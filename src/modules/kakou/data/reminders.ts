import { BUNPOU_DATA } from "@/src/modules/bunpou/data/bunpouData";
import { CONJUGATION_GUIDES } from "@/src/modules/katsuyou/data/conjugationGuides";
import { mockVerbs, type VerbConjugations } from "@/src/modules/katsuyou/data/verbs";
import { CONJUGATION_FORMS } from "@/src/modules/katsuyou/data/conjugationForms";
import type {
  KakouLevel,
  KakouPrompt,
  KakouReminder,
  KakouSource,
  KakouSourceType,
} from "@/src/modules/kakou/data/types";

const BUNPOU_SOURCE_BY_PROMPT: Record<string, string> = {
  "grammar-n5-01": "v-tai-desu",
  "grammar-n5-02": "n1-ni-n2-ga-arimasu-existence",
  "grammar-n5-03": "v-tari-v-tari-shimasu",
  "grammar-n5-04": "sentence-kara-sentence",
  "copy-n4-01": "v-ta-koto-ga-arimasu",
};

const KATSUYOU_FORM_BY_PROMPT: Record<string, keyof VerbConjugations> = {
  "conjugation-n4-01": "potential",
  "conjugation-n4-02": "volitional",
  "conjugation-n4-03": "ba",
  "conjugation-n4-04": "imperative",
  "conjugation-n3-01": "passive",
  "conjugation-n3-02": "causative",
  "conjugation-n3-03": "causativePassive",
  "conjugation-n3-04": "dictionary",
};

const PATTERN_MEANINGS: Array<[string, string, string?]> = [
  ["たい", "Menyatakan keinginan pembicara untuk melakukan sesuatu.", "Gunakan bentuk dasar ます tanpa ます, lalu tambahkan たいです."],
  ["があります", "Menyatakan keberadaan benda mati atau suatu kejadian.", "Tempat menggunakan partikel に; benda yang ada menggunakan が."],
  ["たり", "Menyebutkan beberapa kegiatan sebagai contoh, bukan daftar lengkap.", "Ubah kata kerja ke bentuk た lalu tambahkan り."],
  ["から", "Menghubungkan alasan dengan hasil atau keputusan.", "Alasan diletakkan sebelum から."],
  ["てみ", "Menyatakan mencoba melakukan sesuatu untuk mengetahui hasilnya.", "Gunakan bentuk て + みます."],
  ["てお", "Menyatakan tindakan persiapan yang dilakukan sebelumnya.", "Gunakan bentuk て + おきます."],
  ["すぎ", "Menyatakan sesuatu yang berlebihan atau terlalu banyak.", "Kata kerja memakai akar ます; kata sifat membuang い atau な sesuai jenisnya."],
  ["つもり", "Menyatakan niat atau rencana yang sudah diputuskan.", "Gunakan bentuk kamus atau ない + つもりです."],
  ["おかげ", "Menyatakan hasil positif berkat seseorang atau sesuatu.", "Untuk hasil negatif biasanya gunakan せいで, bukan おかげで."],
  ["せい", "Menyatakan penyebab hasil yang negatif.", "Gunakan dengan hati-hati karena dapat terdengar menyalahkan."],
  ["ても", "Menyatakan hasil yang tetap terjadi walaupun kondisinya berbeda.", "Gunakan bentuk て + も."],
  ["代わり", "Menyatakan pengganti, pertukaran, atau alternatif.", "Pastikan dua tindakan mempunyai hubungan penggantian yang jelas."],
  ["ながら", "Menyatakan dua kegiatan yang dilakukan bersamaan.", "Aktivitas utama berada di akhir kalimat."],
  ["ため", "Menyatakan tujuan atau alasan formal.", "Untuk tujuan, subjek kedua tindakan biasanya sama."],
  ["前に", "Menyatakan tindakan yang dilakukan sebelum tindakan lain.", "Kata kerja sebelum 前に menggunakan bentuk kamus."],
  ["あとで", "Menyatakan tindakan setelah tindakan lain selesai.", "Kata kerja sebelum あとで biasanya menggunakan bentuk た."],
  ["ので", "Menyatakan alasan dengan nuansa lebih halus daripada から.", "Kata benda dan な-adjective menggunakan なので."],
  ["ようになる", "Menyatakan perubahan kemampuan atau kebiasaan secara bertahap.", "Gunakan bentuk kamus, potensial, atau ない sebelum ようになる."],
  ["のに", "Menyatakan hasil yang bertentangan dengan harapan.", "Jangan gunakan untuk permintaan atau perintah langsung."],
  ["によると", "Menandai sumber informasi yang dilaporkan.", "Biasanya dipasangkan dengan そうです atau とのことです."],
  ["ことに", "Menyatakan keputusan pribadi yang dibuat pembicara.", "Bedakan ことにする (memutuskan) dan ことになる (diputuskan)."],
];

function levelFrom(value: string): KakouLevel {
  if (value.includes("N4")) return "N4";
  if (value.includes("N3") || value.includes("N2") || value.includes("N1")) return "N3";
  return "N5";
}

function findBunpouPattern(id: string) {
  for (const lesson of BUNPOU_DATA) {
    const pattern = lesson.patterns.find((item) => item.id === id);
    if (pattern) return { lesson, pattern };
  }
  return null;
}

function bunpouReminder(id: string): KakouReminder | null {
  const found = findBunpouPattern(id);
  if (!found) return null;
  return {
    title: found.pattern.pattern,
    meaning: found.pattern.descId,
    structures: [found.pattern.pattern],
    examples: found.pattern.examples.slice(0, 3).map((example) => ({
      japanese: example.exampleJp,
      reading: example.exampleKana,
      meaning: example.exampleId,
    })),
    source: {
      type: "BUNPOU",
      id,
      href: `/kakou?source=bunpou&sourceId=${encodeURIComponent(id)}`,
      label: "Open full lesson in Bunpou",
    },
  };
}

function guideReminder(formKey: string): KakouReminder | null {
  const guide = CONJUGATION_GUIDES[formKey];
  const form = CONJUGATION_FORMS.find((item) => item.key === formKey);
  if (!guide || !form) return null;

  const groups = [guide.rules.group1, guide.rules.group2, guide.rules.group3];
  return {
    title: `${form.labelEn} · ${form.jpName}`,
    meaning: guide.purposeId,
    structures: groups.map((group) => group.patternId),
    examples: groups.flatMap((group) => group.examples.slice(0, 1)).map((example) => ({
      japanese: `${example.base} → ${example.conj}`,
    })),
    commonMistakes: guide.mistake
      ? [guide.mistake.descId, ...guide.mistake.examples.slice(0, 2).map((item) => `${item.bad} → ${item.good}: ${item.noteId}`)]
      : undefined,
    source: {
      type: "KATSUYOU",
      id: formKey,
      href: `/kakou?source=katsuyou&sourceId=${encodeURIComponent(formKey)}`,
      label: "Open full guide in Katsuyou",
    },
  };
}

function verbFromPrompt(prompt: KakouPrompt) {
  const written = prompt.japanese.split(/[（\s—]/)[0];
  return mockVerbs.find((verb) => verb.kanji === written || verb.kana === written);
}

function conjugationReminder(prompt: KakouPrompt): KakouReminder | null {
  const verb = verbFromPrompt(prompt);
  const formKey = KATSUYOU_FORM_BY_PROMPT[prompt.id];
  const guide = formKey ? guideReminder(formKey) : guideReminder("te");
  if (!guide) return null;

  if (verb) {
    const keys: Array<keyof VerbConjugations> = formKey
      ? [formKey]
      : ["masu", "te", "nai", "ta"];
    guide.examples = keys.flatMap((key) => {
      const form = verb.conjugations[key];
      return form
        ? [{ japanese: `${verb.kanji} → ${form.kanji}`, reading: form.kana }]
        : [];
    });
    guide.title = `${verb.kanji} · ${guide.title}`;
  }
  return guide;
}

function genericReminder(prompt: KakouPrompt): KakouReminder | null {
  if (!prompt.pattern && !prompt.example && (!prompt.hints || prompt.hints.length === 0)) {
    return null;
  }
  const target = `${prompt.pattern ?? ""} ${prompt.japanese}`;
  const explanation = PATTERN_MEANINGS.find(([needle]) => target.includes(needle));
  return {
    title: prompt.pattern ?? prompt.title,
    meaning:
      explanation?.[1] ??
      "Gunakan pola dan petunjuk berikut sebagai pengingat sebelum menulis jawabanmu.",
    structures: prompt.pattern ? [prompt.pattern] : [],
    examples: prompt.example
      ? [{ japanese: prompt.example }]
      : prompt.hints?.slice(0, 3).map((hint) => ({ japanese: hint })) ?? [],
    commonMistakes: explanation?.[2] ? [explanation[2]] : undefined,
  };
}

export function hydrateKakouPrompt(prompt: KakouPrompt): KakouPrompt {
  if (prompt.reminder) return prompt;

  const bunpouId = BUNPOU_SOURCE_BY_PROMPT[prompt.id];
  const reminder = bunpouId
    ? bunpouReminder(bunpouId)
    : prompt.kind === "CONJUGATION"
      ? conjugationReminder(prompt)
      : genericReminder(prompt);

  return {
    ...prompt,
    reminder: reminder ?? undefined,
    source: reminder?.source,
  };
}

export function findFirstIncompleteBunpouPattern(completedIds: string[]): string | null {
  for (const lesson of BUNPOU_DATA) {
    for (const pattern of lesson.patterns) {
      if (!completedIds.includes(pattern.id)) return pattern.id;
    }
  }
  return null;
}

export function buildFocusedKakouPrompt(
  sourceType: KakouSourceType,
  sourceId: string,
): KakouPrompt | null {
  if (sourceType === "BUNPOU") {
    const found = findBunpouPattern(sourceId);
    const reminder = bunpouReminder(sourceId);
    if (!found || !reminder) return null;
    return {
      id: `bunpou-${sourceId}`,
      kind: "GRAMMAR",
      level: levelFrom(found.pattern.jlpt),
      title: `Practice ${found.pattern.pattern}`,
      japanese: found.pattern.pattern,
      instruction:
        "Salin pola dan dua contoh ke buku. Setelah itu, buat tiga kalimatmu sendiri dengan pola yang sama.",
      pattern: found.pattern.pattern,
      example: found.pattern.examples[0]?.exampleJp,
      source: reminder.source,
      reminder,
    };
  }

  const form = CONJUGATION_FORMS.find((item) => item.key === sourceId);
  const reminder = guideReminder(sourceId);
  if (!form || !reminder) return null;
  return {
    id: `katsuyou-${sourceId}`,
    kind: "CONJUGATION",
    level: levelFrom(form.jlpt),
    title: `Practice ${form.labelEn}`,
    japanese: form.jpName,
    instruction:
      "Tulis ringkasan aturan untuk setiap kelompok kata kerja. Salin tiga contoh, lalu konjugasikan tiga kata kerja lain dengan bentuk yang sama.",
    pattern: form.labelId,
    source: reminder.source,
    reminder,
  };
}

/**
 * Like buildFocusedKakouPrompt("KATSUYOU", formKey) but pins a specific verb
 * (instead of showing generic group examples) and stamps source.verbId, so
 * the resulting prompt can drive a KatsuyouReviewCard SRS update after
 * review — used by the sequential session picker, which always knows exactly
 * which verb it chose for a given form.
 */
export function buildKatsuyouPracticePrompt(formKey: string, verbId: string): KakouPrompt | null {
  const form = CONJUGATION_FORMS.find((item) => item.key === formKey);
  const verb = mockVerbs.find((item) => item.id === verbId);
  const reminder = guideReminder(formKey);
  if (!form || !verb || !reminder) return null;

  const conjugated = verb.conjugations[formKey as keyof VerbConjugations];
  if (!conjugated || !reminder.source) return null;
  const source: KakouSource = { ...reminder.source, verbId };

  return {
    id: `katsuyou-${formKey}-${verbId}`,
    kind: "CONJUGATION",
    level: levelFrom(form.jlpt),
    title: `Practice ${form.labelEn} — ${verb.kanji}`,
    japanese: `${verb.kanji} → ${conjugated.kanji}`,
    instruction:
      "Salin contoh di atas, lalu tulis tiga kalimatmu sendiri menggunakan kata kerja ini dalam bentuk yang sama.",
    pattern: form.labelId,
    example: `${verb.kanji} (${verb.romaji}) → ${conjugated.kanji} (${conjugated.romaji})`,
    source,
    reminder: {
      ...reminder,
      examples: [{ japanese: `${verb.kanji} → ${conjugated.kanji}`, reading: conjugated.kana }],
      source,
    },
  };
}
