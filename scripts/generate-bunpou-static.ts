import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { BUNPOU_DATA } from "../src/modules/bunpou/data/bunpouData";
import { callGemini } from "../src/shared/lib/gemini-limiter";

interface BunpouExample {
  exampleJp: string;
  exampleKana: string;
  exampleEn: string;
  exampleId: string;
}

interface NewBunpouPattern {
  id: string;
  pattern: string;
  jlpt: string;
  descEn: string;
  descId: string;
  examples: BunpouExample[];
}

interface NewBunpouLesson {
  chapter: number;
  titleEn: string;
  titleId: string;
  patterns: NewBunpouPattern[];
}

function extractJson(text: string): string {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    return text.substring(start, end + 1);
  }
  return text;
}

async function generateChunkWithRetry(patterns: any[]): Promise<Record<string, BunpouExample[]>> {
  const patternsStr = patterns.map(p => 
    `- ID: "${p.id}", Pattern: "${p.pattern}", Description: "${p.descEn} / ${p.descId}"`
  ).join("\n");

  const systemPrompt = `You are a professional Japanese language teacher.
Your task is to generate exactly 3 high-quality, natural example sentences for each grammar pattern in the list.
For each example, you must provide:
- exampleJp: The sentence in standard Japanese (Kanji/Kana, with correct punctuation).
- exampleKana: The sentence in Kana only (representing Furigana).
- exampleEn: Natural English translation.
- exampleId: Natural Indonesian translation.

Ensure the vocabulary and complexity are suitable for basic JLPT N5/N4 levels.
Return the result strictly as a JSON object where the keys are the pattern IDs, and the values are arrays of exactly 3 example objects matching:
{
  "exampleJp": "...",
  "exampleKana": "...",
  "exampleEn": "...",
  "exampleId": "..."
}

Do not return any markdown code blocks, tags, explanations, or text outside the JSON. Return only the raw JSON.`;

  const userMessage = `Here are the patterns to generate 3 examples for:
${patternsStr}

Please return the JSON object mapping pattern IDs to their 3 examples.`;

  let attempt = 0;
  const maxAttempts = 5;
  while (attempt < maxAttempts) {
    try {
      const response = await callGemini(systemPrompt, [], userMessage, "gemini-3.1-flash-lite");
      const cleaned = extractJson(response.text.trim());
      const parsed = JSON.parse(cleaned) as Record<string, BunpouExample[]>;
      
      // Validate that all requested patterns are in the keys and have 3 examples
      let allValid = true;
      for (const p of patterns) {
        if (!parsed[p.id] || !Array.isArray(parsed[p.id]) || parsed[p.id].length !== 3) {
          allValid = false;
          break;
        }
      }

      if (allValid) {
        return parsed;
      }
      throw new Error("Invalid response keys or incorrect example count in parsed JSON");
    } catch (error: any) {
      attempt++;
      console.warn(`   ⚠️ Warning: Attempt ${attempt}/${maxAttempts} for chunk failed: ${error.message}. Retrying in 5s...`);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  throw new Error(`Failed to generate examples for chunk after ${maxAttempts} attempts.`);
}

async function main() {
  console.log("🚀 Starting chunk-by-chunk generation of examples...");
  
  const newLessons: NewBunpouLesson[] = [];

  for (const lesson of BUNPOU_DATA) {
    console.log(`\n📖 Chapter ${lesson.chapter}: ${lesson.titleEn}`);
    const newPatterns: NewBunpouPattern[] = [];

    // Split patterns into chunks of 4
    const chunks: any[][] = [];
    for (let i = 0; i < lesson.patterns.length; i += 4) {
      chunks.push(lesson.patterns.slice(i, i + 4));
    }

    for (let cIdx = 0; cIdx < chunks.length; cIdx++) {
      const chunk = chunks[cIdx];
      console.log(`   👉 Generating chunk ${cIdx + 1}/${chunks.length} (${chunk.map(p => p.id).join(", ")})`);
      
      const chunkResult = await generateChunkWithRetry(chunk);
      
      for (const p of chunk) {
        newPatterns.push({
          id: p.id,
          pattern: p.pattern,
          jlpt: p.jlpt,
          descEn: p.descEn,
          descId: p.descId,
          examples: chunkResult[p.id]
        });
      }
      
      console.log(`      ✅ Generated chunk successfully.`);
      // Wait to stay within 15 RPM
      await new Promise(resolve => setTimeout(resolve, 4500));
    }

    newLessons.push({
      chapter: lesson.chapter,
      titleEn: lesson.titleEn,
      titleId: lesson.titleId,
      patterns: newPatterns
    });
  }

  // Write new file contents
  const destPath = join(process.cwd(), "src", "modules", "bunpou", "data", "bunpouData.ts");
  const codeContent = `export interface BunpouExample {
  exampleJp: string;
  exampleKana: string;
  exampleEn: string;
  exampleId: string;
}

export interface BunpouPattern {
  id: string;
  pattern: string;
  jlpt: string;
  descEn: string;
  descId: string;
  examples: BunpouExample[];
}

export interface BunpouLesson {
  chapter: number;
  titleEn: string;
  titleId: string;
  patterns: BunpouPattern[];
}

export const BUNPOU_DATA: BunpouLesson[] = ${JSON.stringify(newLessons, null, 2)};
`;

  writeFileSync(destPath, codeContent, "utf8");
  console.log(`\n🎉 Success! Generated and wrote new data to ${destPath}`);
}

main().catch(err => {
  console.error("Fatal generation failure:", err);
  process.exit(1);
});
