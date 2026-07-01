"use server";

import { prisma } from "@/src/shared/lib/db";
import { getSession } from "@/src/shared/lib/session";
import { revalidatePath } from "next/cache";
import { callGemini } from "@/src/shared/lib/gemini-limiter";
import { BUNPOU_DATA } from "../data/bunpouData";

/**
 * Fetch list of grammar pattern IDs completed by the current user.
 */
export async function getBunpouProgress() {
  const session = await getSession();
  if (!session) return [];

  try {
    const userId = session.id;
    const progress = await prisma.bunpouProgress.findMany({
      where: { userId, completed: true },
      select: { patternId: true },
    });
    return progress.map((p) => p.patternId);
  } catch (error) {
    console.error("Error fetching Bunpou progress:", error);
    return [];
  }
}

/**
 * Toggle the learned status of a grammar pattern.
 */
export async function toggleBunpouProgress(patternId: string) {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    const userId = session.id;

    // Check if it already exists
    const existing = await prisma.bunpouProgress.findUnique({
      where: {
        userId_patternId: {
          userId,
          patternId,
        },
      },
    });

    if (existing) {
      // Toggle off: delete progress
      await prisma.bunpouProgress.delete({
        where: {
          id: existing.id,
        },
      });
    } else {
      // Toggle on: create progress
      await prisma.bunpouProgress.create({
        data: {
          userId,
          patternId,
          completed: true,
        },
      });
    }

    revalidatePath("/bunpou");
    return { success: true };
  } catch (error) {
    console.error("Error toggling Bunpou progress:", error);
    return { success: false, error: "Failed to update progress" };
  }
}

// Find a pattern definition by ID helper
function findPatternById(patternId: string) {
  for (const lesson of BUNPOU_DATA) {
    const found = lesson.patterns.find((p) => p.id === patternId);
    if (found) return found;
  }
  return null;
}

/**
 * Fetch practice questions for a specific grammar pattern.
 * If none exist in the database, automatically trigger generation.
 */
export async function getBunpouQuestions(patternId: string) {
  try {
    const questions = await prisma.bunpouQuestion.findMany({
      where: { patternId },
      orderBy: { id: "asc" },
    });

    if (questions.length === 0) {
      console.log(`No questions found in DB for pattern "${patternId}". Triggering AI generation...`);
      return await generateBunpouQuestions(patternId);
    }

    return questions.map((q) => ({
      id: q.id,
      patternId: q.patternId,
      english: q.english,
      indonesian: q.indonesian,
      sentenceJp: q.sentenceJp,
      sentenceKana: q.sentenceKana,
      words: q.words as string[],
    }));
  } catch (error) {
    console.error("Error fetching Bunpou questions:", error);
    return [];
  }
}

// Helper to get all grammar patterns defined BEFORE the current patternId (same chapter or lower chapters)
function getPreviousPatterns(patternId: string): string[] {
  const list: string[] = [];
  for (const lesson of BUNPOU_DATA) {
    for (const p of lesson.patterns) {
      if (p.id === patternId) {
        return list;
      }
      list.push(`- "${p.pattern}" (ID: ${p.id}): ${p.descEn} / ${p.descId}`);
    }
  }
  return list;
}

/**
 * Generate 15 new practice questions using Gemini, save to DB, and return.
 * 5 questions strictly target the pattern.
 * 10 questions combine the pattern with previous patterns in the curriculum.
 */
export async function generateBunpouQuestions(patternId: string) {
  const pattern = findPatternById(patternId);
  if (!pattern) {
    throw new Error(`Pattern with ID "${patternId}" not found in local data`);
  }

  const previousPatternsList = getPreviousPatterns(patternId).join("\n");

  const systemPrompt = `You are a professional Japanese language educator.
Generate exactly 15 sentence scrambling exercises for the Japanese grammar pattern: "${pattern.pattern}" (ID: "${patternId}")
Description: ${pattern.descEn} / ${pattern.descId}

Pedagogical Structure:
- Exactly 5 questions must strictly target this grammar pattern in a simple, isolated way.
- Exactly 10 questions must target this grammar pattern, but COMBINED with one or more previous grammar patterns from earlier in the curriculum.

${previousPatternsList ? `Here are the previous grammar patterns you can combine with (for the 10 combined questions):
${previousPatternsList}` : 'No previous patterns are available (this is the first pattern in the curriculum). So all 15 questions should target this pattern.'}

Each exercise MUST follow this JSON structure:
{
  "english": "English translation / prompt",
  "indonesian": "Indonesian translation / prompt",
  "sentenceJp": "Complete Japanese sentence with Kanji/Kana, e.g. 私は学校に行きます。",
  "sentenceKana": "Complete Japanese sentence in Kana only for Furigana representation, e.g. わたしはがっこうにいきます。",
  "words": ["私", "は", "学校", "に", "行きます"]
}

Rules:
1. The "words" array must contain the components of the "sentenceJp" in scrambled order. When joined in the correct order, they must EXACTLY match the "sentenceJp" string (excluding spaces).
2. The "sentenceKana" must correspond exactly to the "sentenceJp" reading.
3. The sentences should use appropriate JLPT N5/N4 vocabulary.
4. Return the response strictly as a JSON array of exactly 15 objects. Do not include markdown formatting or explanations.`;

  const userMessage = `Generate exactly 15 sentence scrambling questions (5 isolated target-only, 10 combined with previous patterns if available) for: "${patternId}" ("${pattern.pattern}").`;

  try {
    // Call Gemini (automatic rate-limiting & fallback)
    const response = await callGemini(systemPrompt, [], userMessage);
    
    let text = response.text.trim();
    // Clean markdown code blocks if present
    const start = text.indexOf("[");
    const end = text.lastIndexOf("]");
    if (start !== -1 && end !== -1 && end > start) {
      text = text.substring(start, end + 1);
    }

    const parsedQuestions = JSON.parse(text) as Array<{
      english: string;
      indonesian: string;
      sentenceJp: string;
      sentenceKana: string;
      words: string[];
    }>;

    if (!Array.isArray(parsedQuestions) || parsedQuestions.length === 0) {
      throw new Error("Invalid or empty response format from Gemini");
    }

    // Insert to database
    const dataToInsert = parsedQuestions.map((q) => ({
      patternId,
      english: q.english,
      indonesian: q.indonesian,
      sentenceJp: q.sentenceJp,
      sentenceKana: q.sentenceKana,
      words: q.words,
    }));

    await prisma.bunpouQuestion.createMany({
      data: dataToInsert,
    });

    revalidatePath("/bunpou");

    // Fetch and return the updated pool
    const updatedQuestions = await prisma.bunpouQuestion.findMany({
      where: { patternId },
      orderBy: { id: "asc" },
    });

    return updatedQuestions.map((q) => ({
      id: q.id,
      patternId: q.patternId,
      english: q.english,
      indonesian: q.indonesian,
      sentenceJp: q.sentenceJp,
      sentenceKana: q.sentenceKana,
      words: q.words as string[],
    }));
  } catch (error) {
    console.error(`Error generating Bunpou questions for "${patternId}":`, error);
    throw error;
  }
}
