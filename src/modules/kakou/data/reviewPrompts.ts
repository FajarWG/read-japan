import type { KakouFeedback, KakouSessionView } from "@/src/modules/kakou/data/types";

const PER_PROMPT_JSON_SCHEMA = `{
  "overallFeedback": "Ringkasan apresiasi & ulasan umum singkat dalam bahasa Indonesia untuk seluruh sesi.",
  "perPrompt": [
    {
      "promptIndex": 1,
      "score": 85,
      "sentences": [
        {
          "original": "kalimat asli user",
          "corrected": "koreksi minimum tata bahasa/partikel/ejaan agar benar",
          "improved": "versi yang lebih alami/natural bagi penutur asli",
          "meaning": "arti kalimat versi improved dalam bahasa indonesia",
          "explanation": "alasan singkat perbaikan tata bahasa/partikel",
          "suggestedKanji": [
            "わたし → 私 (JLPT N5)",
            "ともだち → 友達 (JLPT N5)"
          ]
        }
      ],
      "errorPatterns": [
        "pola kesalahan 1 yang perlu diperhatikan untuk latihan ini"
      ],
      "reviewPoints": [
        "saran latihan yang perlu diperbaiki untuk latihan ini"
      ],
      "additionalExamples": [
        {
          "japanese": "contoh kalimat lain yang baik/natural memakai pola atau bentuk yang sama dengan latihan ini",
          "meaning": "artinya dalam bahasa Indonesia"
        }
      ]
    }
  ]
}`;

export function buildPhotoReviewPrompt(session: KakouSessionView): string {
  return `Saya mengunggah foto tulisan tangan bahasa Jepang untuk diperiksa. Level saya JLPT ${session.level}.

Konteks latihan:
${session.prompts
  .map(
    (item, index) =>
      `${index + 1}. ${item.instruction}${item.pattern ? ` (Target: ${item.pattern})` : ""}`,
  )
  .join("\n")}

CRITICAL REQUIREMENT:
1. Transkripsikan tulisan tangan pada foto secara akurat.
2. Periksa tata bahasa, partikel, ejaan, dan kealamian kalimat.
3. Cocokkan tulisan pada foto ke nomor latihan di atas berdasarkan urutan/konteksnya, dan beri SATU entri "perPrompt" per nomor latihan (cocokkan "promptIndex" dengan nomornya) — jangan gabungkan semua kalimat jadi satu skor.
4. Jika tulisan masih menggunakan Hiragana untuk kata yang lazim memakai Kanji sesuai level JLPT ${session.level}, berikan saran Kanji pada array "suggestedKanji" (contoh: ["わたし → 私", "たべます → 食べます"]).
5. Untuk SETIAP latihan, tambahkan 1-2 "additionalExamples": contoh kalimat LAIN yang baik/natural (bukan koreksi dari tulisan user, tapi contoh baru) yang memakai pola/bentuk tata bahasa yang sama dengan latihan tersebut, lengkap dengan artinya dalam bahasa Indonesia — supaya user punya referensi tambahan seperti apa kalimat yang bagus.
6. Kembalikan SELURUH hasil evaluasi HANYA dalam format JSON valid (di dalam kode blok \`\`\`json ... \`\`\`) tanpa teks tambahan di luar JSON.

Gunakan struktur JSON berikut:
\`\`\`json
${PER_PROMPT_JSON_SCHEMA}
\`\`\`

Ketentuan Skor per latihan (0 - 100):
- 90-100: Sangat alami, bentuk kanji/kana dan tata bahasa sangat baik.
- 75-89: Tulisan terbaca dan tata bahasa secara umum baik dengan 1-2 koreksi kecil.
- 60-74: Ada kesalahan partikel/kana yang mengganggu.
- <60: Banyak kesalahan atau karakter tidak terbaca [?].`;
}

/**
 * Extracts a JSON object from raw AI output (handles ```json fences, or plain
 * text with extra prose around a brace-delimited object) and validates it has
 * the minimum shape of a KakouFeedback — a non-empty perPrompt[] where every
 * entry has a numeric promptIndex/score and a sentences array.
 */
export function parseKakouFeedbackJson(raw: string): KakouFeedback | null {
  let jsonStr = raw.trim();
  const codeblockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (codeblockMatch) {
    jsonStr = codeblockMatch[1].trim();
  } else {
    const braceMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (braceMatch) jsonStr = braceMatch[0];
  }

  try {
    const parsed = JSON.parse(jsonStr) as KakouFeedback;
    if (!Array.isArray(parsed.perPrompt) || parsed.perPrompt.length === 0) {
      return null;
    }
    const valid = parsed.perPrompt.every(
      (item) =>
        typeof item.promptIndex === "number" &&
        typeof item.score === "number" &&
        Array.isArray(item.sentences),
    );
    return valid ? parsed : null;
  } catch {
    return null;
  }
}
