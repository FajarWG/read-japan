import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/shared/lib/db";
import { getSession } from "@/src/shared/lib/session";
import { callGemini, RateLimitError, AllModelsExhaustedError } from "@/src/shared/lib/gemini-limiter";
import { DekiruNihongoGroups } from "@/src/helper/DekiruNihongoGroup";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const startChapter = parseInt(body.startChapter ?? "");

    if (isNaN(startChapter) || ![1, 4, 7, 10, 13].includes(startChapter)) {
      return NextResponse.json(
        { error: "Bab awal ujian tidak valid. Harus salah satu dari: 1, 4, 7, 10, 13." },
        { status: 400 }
      );
    }

    const endChapter = startChapter + 2;

    // 1. Fetch DB PrepData for the 3 chapters
    const prepDataList = await prisma.prepData.findMany({
      where: {
        chapter: {
          in: [startChapter, startChapter + 1, startChapter + 2],
        },
        point: {
          in: [1, 2, 3],
        },
      },
      orderBy: [
        { chapter: "asc" },
        { point: "asc" },
      ],
    });

    // 2. Fetch local vocabulary for the 3 chapters
    const aggregatedVocab: Record<number, any[]> = {};
    for (let c = startChapter; c <= endChapter; c++) {
      const chapData = DekiruNihongoGroups[c - 1];
      if (chapData && chapData.sections) {
        const vocabList: any[] = [];
        chapData.sections.forEach((sect: any) => {
          if (sect.examples) {
            vocabList.push(...sect.examples);
          }
        });
        aggregatedVocab[c] = vocabList;
      } else {
        aggregatedVocab[c] = [];
      }
    }

    // 3. Serialize aggregated grammar/sections for the LLM
    let grammarText = "";
    prepDataList.forEach((pd) => {
      grammarText += `\n### Bab ${pd.chapter} Poin ${pd.point}: ${pd.title}\n`;
      
      // Parse sections if available
      if (pd.sections) {
        try {
          const sections = typeof pd.sections === "string" ? JSON.parse(pd.sections) : pd.sections;
          if (Array.isArray(sections)) {
            sections.forEach((sect) => {
              grammarText += `- Bagian: ${sect.title}\n`;
              if (sect.grammar && Array.isArray(sect.grammar)) {
                sect.grammar.forEach((g: any) => {
                  grammarText += `  * Pola: ${g.pattern}\n  * Penjelasan: ${g.explanation}\n`;
                  if (g.examples && Array.isArray(g.examples)) {
                    g.examples.forEach((ex: any) => {
                      grammarText += `    - Contoh: ${ex.japanese} (${ex.translation})\n`;
                    });
                  }
                });
              }
              if (sect.conversations && Array.isArray(sect.conversations)) {
                grammarText += `  * Kalimat Percakapan Utama:\n`;
                sect.conversations.forEach((conv: any) => {
                  grammarText += `    - ${conv.speaker}: ${conv.japanese} (${conv.translation})\n`;
                });
              }
            });
          }
        } catch (e) {
          console.error("Gagal parsing sections JSON:", e);
        }
      }

      // Legacy fallback / root-level grammar
      if (pd.grammar) {
        try {
          const grammarList = typeof pd.grammar === "string" ? JSON.parse(pd.grammar) : pd.grammar;
          if (Array.isArray(grammarList) && grammarList.length > 0) {
            grammarText += `- Tata Bahasa Lainnya:\n`;
            grammarList.forEach((g: any) => {
              grammarText += `  * Pola: ${g.pattern}\n  * Penjelasan: ${g.explanation}\n`;
              if (g.examples && Array.isArray(g.examples)) {
                g.examples.forEach((ex: any) => {
                  grammarText += `    - Contoh: ${ex.japanese} (${ex.translation})\n`;
                });
              }
            });
          }
        } catch (e) {
          console.error("Gagal parsing grammar JSON:", e);
        }
      }
    });

    // 4. Serialize aggregated vocabulary
    let vocabText = "";
    for (let c = startChapter; c <= endChapter; c++) {
      const list = aggregatedVocab[c];
      if (list && list.length > 0) {
        vocabText += `\n### Kosakata Bab ${c}:\n`;
        list.slice(0, 40).forEach((item) => { // limit to 40 vocab items per chapter to prevent prompt bloating
          const kanjiStr = item.kanji === "-" ? "" : ` (${item.kanji})`;
          const meaning = item.translations?.id || item.translations?.en || "Tidak ada terjemahan";
          vocabText += `- ${item.hiragana}${kanjiStr}: ${meaning}\n`;
        });
        if (list.length > 40) {
          vocabText += `- ...dan ${list.length - 40} kosakata lainnya.\n`;
        }
      }
    }

    // 5. Construct the user prompt
    const systemPrompt = `Anda adalah asisten AI bahasa Jepang yang profesional dan ramah. Tugas Anda adalah membantu pengguna membuat Rangkuman Ujian komprehensif untuk persiapan ujian Dekiru Nihongo Bab ${startChapter} sampai Bab ${endChapter}.
Tulis tanggapan Anda seluruhnya dalam Bahasa Indonesia yang alami, rapi, dan mudah dipahami oleh pembelajar bahasa Jepang.
Format keluaran wajib berupa Markdown yang indah (gunakan judul, daftar poin, dan tabel).`;

    const userMessage = `Tolong buatkan Rangkuman Ujian yang komprehensif untuk Bab ${startChapter} sampai Bab ${endChapter} berdasarkan data tata bahasa dan kosakata berikut.

## DATA TATABAHASA & PERCAKAPAN DARI DATABASE:
${grammarText || "Tidak ada data tata bahasa dari database."}

## DATA KOSAKATA DARI BUKU:
${vocabText || "Tidak ada data kosakata."}

---

## PETUNJUK FORMAT RANGKUMAN UJIAN YANG HARUS DIHASILKAN:
1. **Ringkasan Partikel & Tata Bahasa Penting**: Kelompokkan partikel dan pola tata bahasa kunci dari Bab ${startChapter} - ${endChapter}. Tuliskan rumusnya, penjelasan fungsinya dalam Bahasa Indonesia, dan berikan minimal 1-2 contoh kalimat bahasa Jepang (beserta romaji/hiragana dan artinya).
2. **Ungkapan & Kalimat Kunci Percakapan**: Rangkum ungkapan praktis dan kalimat penting yang sering keluar dalam dialog sehari-hari di Bab ${startChapter} - ${endChapter} (seperti cara mengajak, menolak, meminta tolong, mendeskripsikan sesuatu, dll) beserta artinya.
3. **Daftar Kosakata Esensial**: Sajikan tabel/list kosakata paling penting dari ketiga bab ini yang wajib dihafal sebelum ujian (Jepang, bacaan hiragana, arti).

Buatlah penjelasan Anda sangat informatif, ramah, dan terstruktur rapi. Harap langsung berikan markdown rangkumannya saja, tanpa salam pembuka atau penutup tambahan.`;

    // 6. Call Gemini
    const result = await callGemini(
      systemPrompt,
      [],
      userMessage,
      "gemini-3.5-flash"
    );

    return NextResponse.json({
      summary: result.text,
      model: result.model
    });

  } catch (error) {
    if (error instanceof RateLimitError || error instanceof AllModelsExhaustedError) {
      return NextResponse.json({ error: error.message }, { status: 429 });
    }
    console.error("Gagal men-generate rangkuman ujian:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada layanan AI Gemini. Silakan coba lagi atau masukkan secara manual." },
      { status: 500 }
    );
  }
}
