import type { KakouFeedback, KakouPrompt, KakouSessionView } from "@/src/modules/kakou/data/types";

const KIND_LABELS: Record<KakouPrompt["kind"], string> = {
  JOURNAL: "Guided journal",
  COPY_CHANGE_CREATE: "Copy → Change → Create",
  GRAMMAR: "Grammar challenge",
  SENTENCE_BUILDER: "Sentence builder",
  CONJUGATION: "Conjugation drill",
};

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
      ]
    }
  ]
}`;

export function buildTextReviewPrompt(session: KakouSessionView): string {
  const requirements = session.prompts
    .map(
      (item, index) =>
        `${index + 1}. ${KIND_LABELS[item.kind]}\nTugas: ${item.instruction}${
          item.pattern ? `\nPola target: ${item.pattern}` : ""
        }`,
    )
    .join("\n\n");

  return `Saya sedang belajar menulis bahasa Jepang secara mandiri. Tolong periksa tulisan saya sebagai guru bahasa Jepang yang teliti.

Level: JLPT ${session.level}
Latihan:
${requirements}

Tulisan saya:
[TULIS ATAU TEMPEL TULISAN BAHASA JEPANGMU DI SINI — pisahkan per nomor latihan sesuai daftar di atas]

CRITICAL REQUIREMENT:
Kembalikan SELURUH hasil evaluasi HANYA dalam format JSON valid (di dalam kode blok \`\`\`json ... \`\`\`) tanpa teks tambahan di luar JSON. Beri SATU entri "perPrompt" untuk SETIAP nomor latihan di atas (cocokkan "promptIndex" dengan nomornya) — jangan gabungkan semua kalimat jadi satu skor.

Gunakan struktur JSON berikut:
\`\`\`json
${PER_PROMPT_JSON_SCHEMA}
\`\`\`

Catatan Tambahan:
- Jika user masih menulis kata menggunakan Hiragana padahal kata tersebut lazim ditulis dengan Kanji sesuai level JLPT ini, berikan saran Kanji pada array "suggestedKanji" (contoh: ["たべます → 食べます (JLPT N5)", "とうきょう → 東京 (JLPT N5)"]).

Ketentuan Skor per latihan (0 - 100):
- 90-100: Sangat alami & tata bahasa tepat.
- 75-89: Baik dan mudah dipahami, ada 1-2 kesalahan kecil partikel/ejaan.
- 60-74: Ada kesalahan tata bahasa/partikel yang mengganggu pemahaman.
- <60: Banyak kesalahan mendasar.`;
}

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
5. Kembalikan SELURUH hasil evaluasi HANYA dalam format JSON valid (di dalam kode blok \`\`\`json ... \`\`\`) tanpa teks tambahan di luar JSON.

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
