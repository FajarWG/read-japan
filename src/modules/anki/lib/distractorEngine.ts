export type QuizDirection =
  | "kanji_to_reading"
  | "kanji_to_meaning"
  | "reading_to_meaning"
  | "meaning_to_kanji";

export interface VocabularyCardLike {
  cardKey: string;
  chapter: string;
  sectionIndex: number;
  kanji: string;
  hiragana: string;
  romaji?: string;
  translation: string;
}

export type PartOfSpeech =
  | "verb"
  | "i-adj"
  | "na-adj"
  | "time"
  | "person"
  | "place"
  | "expression"
  | "noun";

// Pasangan kanji yang mirip / sering tertukar
const CONFUSABLE_KANJI_PAIRS: Record<string, string[]> = {
  日: ["白", "目", "月", "田"],
  白: ["日", "百", "自", "目"],
  目: ["日", "自", "見", "耳"],
  見: ["目", "貝", "規", "現"],
  貝: ["見", "買", "員", "頁"],
  買: ["売", "員", "貸", "借"],
  右: ["左", "石", "若"],
  左: ["右", "在", "庄"],
  待: ["持", "特", "侍"],
  持: ["待", "特", "指"],
  大: ["太", "犬", "天", "夫"],
  太: ["大", "犬", "木"],
  犬: ["大", "太"],
  木: ["本", "休", "林", "森"],
  本: ["木", "体", "休"],
  休: ["体", "木", "本"],
  体: ["休", "本"],
  聞: ["間", "問", "開"],
  間: ["聞", "開", "門"],
  話: ["語", "読", "活"],
  語: ["話", "読", "記"],
  電: ["雨", "雪", "雷"],
  雨: ["電", "雪"],
  先: ["生", "洗"],
  生: ["先", "牛", "年"],
  手: ["毛", "千"],
  力: ["刀", "万"],
  土: ["士", "工"],
};

/**
 * Deteksi Part of Speech secara heuristik dari kosakata Jepang dan terjemahan Indonesia/Inggris
 */
export function detectPartOfSpeech(card: VocabularyCardLike): PartOfSpeech {
  const h = card.hiragana.trim();
  const k = card.kanji.trim();
  const t = card.translation.toLowerCase().trim();

  // 1. Ekspresi / Salam
  if (
    h.includes("ありがとう") ||
    h.includes("こんにちは") ||
    h.includes("すみません") ||
    h.includes("おねがい") ||
    h.includes("はじめまして") ||
    h.includes("いただきます") ||
    h.includes("ごちそうさま") ||
    h.includes("さようなら") ||
    t.includes("terima kasih") ||
    t.includes("halo") ||
    t.includes("permisi") ||
    t.includes("maaf")
  ) {
    return "expression";
  }

  // 2. Waktu / Temporal
  if (
    /[時分日月年朝昼晩夜今毎]/.test(k) ||
    h.endsWith("じ") ||
    h.endsWith("ふん") ||
    h.endsWith("ぷん") ||
    h.endsWith("ようび") ||
    t.includes("jam") ||
    t.includes("menit") ||
    t.includes("hari") ||
    t.includes("bulan") ||
    t.includes("tahun") ||
    t.includes("besok") ||
    t.includes("kemarin") ||
    t.includes("sekarang") ||
    t.includes("pagi") ||
    t.includes("siang") ||
    t.includes("malam")
  ) {
    return "time";
  }

  // 3. Orang / Keluarga / Profesi
  if (
    /[人父母兄弟姉妹友先生私彼族員]/.test(k) ||
    h.includes("ひと") ||
    h.includes("さん") ||
    t.includes("ayah") ||
    t.includes("ibu") ||
    t.includes("kakak") ||
    t.includes("adik") ||
    t.includes("teman") ||
    t.includes("guru") ||
    t.includes("dokter") ||
    t.includes("orang") ||
    t.includes("saya") ||
    t.includes("dia")
  ) {
    return "person";
  }

  // 4. Tempat / Arah
  if (
    /[駅学校部屋国上下前後右左中外家店院]/.test(k) ||
    t.includes("stasiun") ||
    t.includes("sekolah") ||
    t.includes("kamar") ||
    t.includes("rumah") ||
    t.includes("toko") ||
    t.includes("atas") ||
    t.includes("bawah") ||
    t.includes("depan") ||
    t.includes("belakang") ||
    t.includes("kanan") ||
    t.includes("kiri") ||
    t.includes("dalam") ||
    t.includes("luar")
  ) {
    return "place";
  }

  // 5. Kata Kerja (Verb)
  const isVerbReading =
    h.endsWith("する") ||
    h.endsWith("う") ||
    h.endsWith("く") ||
    h.endsWith("ぐ") ||
    h.endsWith("す") ||
    h.endsWith("つ") ||
    h.endsWith("ぬ") ||
    h.endsWith("ぶ") ||
    h.endsWith("む") ||
    h.endsWith("る");

  const isVerbTranslation =
    t.startsWith("me") ||
    t.startsWith("ber") ||
    t.startsWith("ter") ||
    t.startsWith("to ") ||
    t.includes("makan") ||
    t.includes("minum") ||
    t.includes("tidur") ||
    t.includes("pergi") ||
    t.includes("datang") ||
    t.includes("pulang") ||
    t.includes("beli") ||
    t.includes("baca") ||
    t.includes("tulis");

  if (isVerbReading && isVerbTranslation && !h.endsWith("きらい")) {
    return "verb";
  }

  // 6. Kata Sifat - I (I-Adjective)
  if (
    h.endsWith("い") &&
    !h.endsWith("ない") &&
    (t.includes("besar") ||
      t.includes("kecil") ||
      t.includes("panas") ||
      t.includes("dingin") ||
      t.includes("tinggi") ||
      t.includes("rendah") ||
      t.includes("mahal") ||
      t.includes("murah") ||
      t.includes("baru") ||
      t.includes("lama") ||
      t.includes("enak") ||
      t.includes("bagus") ||
      t.includes("cepat") ||
      t.includes("lambat") ||
      t.includes("sulit") ||
      t.includes("mudah"))
  ) {
    return "i-adj";
  }

  // 7. Kata Sifat - Na (Na-Adjective)
  if (
    h.includes("すき") ||
    h.includes("きらい") ||
    h.includes("しずか") ||
    h.includes("にぎやか") ||
    h.includes("べんり") ||
    h.includes("ゆうめい") ||
    h.includes("げんき") ||
    h.includes("ひま") ||
    t.includes("suka") ||
    t.includes("benci") ||
    t.includes("tenang") ||
    t.includes("ramai") ||
    t.includes("praktis") ||
    t.includes("terkenal") ||
    t.includes("sehat")
  ) {
    return "na-adj";
  }

  return "noun";
}

export function getQuizPrompt(card: VocabularyCardLike, direction: QuizDirection): string {
  switch (direction) {
    case "kanji_to_reading":
    case "kanji_to_meaning":
      return card.kanji === "-" ? card.hiragana : card.kanji;
    case "reading_to_meaning":
      return card.hiragana;
    case "meaning_to_kanji":
      return card.translation;
  }
}

export function getQuizAnswer(card: VocabularyCardLike, direction: QuizDirection): string {
  switch (direction) {
    case "kanji_to_reading":
      return card.hiragana;
    case "kanji_to_meaning":
    case "reading_to_meaning":
      return card.translation;
    case "meaning_to_kanji":
      return card.kanji;
  }
}

export function hasKanji(card: VocabularyCardLike): boolean {
  if (!card.kanji || card.kanji === "-" || card.kanji.trim().length === 0) {
    return false;
  }
  return /[\u4e00-\u9faf]/.test(card.kanji);
}

export function isCardValidForDirection(
  card: VocabularyCardLike,
  direction: QuizDirection,
): boolean {
  const cardHasKanji = hasKanji(card);

  // Jika kata tidak memiliki kanji (misal kata murni kana seperti 'はい', 'ありがとう', 'パン'):
  // - kanji_to_reading: TIDAK VALID (karena prompt hiragana -> jawaban hiragana = sama persis)
  // - meaning_to_kanji: TIDAK VALID (karena tidak ada kanji untuk ditebak)
  // - kanji_to_meaning: TIDAK VALID (karena tidak ada kanji)
  // - reading_to_meaning: SATU-SATUNYA YANG VALID (prompt hiragana -> pilihan arti bahasa Indonesia)
  if (!cardHasKanji) {
    return direction === "reading_to_meaning";
  }

  return true;
}

/**
 * Memeriksa apakah dua kata berbagi karakter kanji yang sama
 */
function sharesKanji(k1: string, k2: string): boolean {
  if (k1 === "-" || k2 === "-") return false;
  for (const c of k1) {
    if (/[\u4e00-\u9faf]/.test(c) && k2.includes(c)) {
      return true;
    }
  }
  return false;
}

/**
 * Memeriksa apakah kanji di k2 mirip secara visual dengan kanji di k1
 */
function isVisuallyConfusable(k1: string, k2: string): boolean {
  if (k1 === "-" || k2 === "-") return false;
  for (const c of k1) {
    const confusables = CONFUSABLE_KANJI_PAIRS[c];
    if (confusables && confusables.some((cf) => k2.includes(cf))) {
      return true;
    }
  }
  return false;
}

/**
 * Generate 4 pilihan jawaban cerdas (1 benar + 3 distractors berbobot tinggi)
 */
export function generateSmartDistractors(
  currentCard: VocabularyCardLike,
  direction: QuizDirection,
  allCards: VocabularyCardLike[],
): string[] {
  const correctAnswer = getQuizAnswer(currentCard, direction);
  const targetPos = detectPartOfSpeech(currentCard);
  const targetHiragana = currentCard.hiragana.trim();
  const targetKanji = currentCard.kanji.trim();

  // Filter kandidat yang valid dan tidak sama dengan jawaban benar
  const validCandidates = allCards.filter(
    (c) =>
      c.cardKey !== currentCard.cardKey &&
      isCardValidForDirection(c, direction) &&
      getQuizAnswer(c, direction) !== correctAnswer,
  );

  if (validCandidates.length === 0) {
    return [correctAnswer];
  }

  // Berikan skor kemiripan pada setiap kandidat
  const scored = validCandidates.map((cand) => {
    let score = 0;
    const candAnswer = getQuizAnswer(cand, direction);
    const candPos = detectPartOfSpeech(cand);
    const candHiragana = cand.hiragana.trim();
    const candKanji = cand.kanji.trim();

    // 1. Kesesuaian Bab (Contextual proximity)
    if (cand.chapter === currentCard.chapter) {
      score += 15;
    }

    // 2. Kesesuaian Part-of-Speech
    if (candPos === targetPos) {
      score += 25;
    }

    // 3. Skor Spesifik Arah (Direction-Specific)
    if (direction === "kanji_to_reading") {
      // Kanji berbagi karakter
      if (sharesKanji(targetKanji, candKanji)) {
        score += 40;
      }
      // Kemiripan panjang mora
      const lengthDiff = Math.abs(candHiragana.length - targetHiragana.length);
      if (lengthDiff === 0) score += 20;
      else if (lengthDiff === 1) score += 10;
      else score -= 10;

      // Kemiripan akhiran mora (e.g. sama-sama akhiran ru / ku / i)
      if (candHiragana.slice(-1) === targetHiragana.slice(-1)) {
        score += 15;
      }
    } else if (direction === "meaning_to_kanji") {
      // Kanji visual confusable
      if (isVisuallyConfusable(targetKanji, candKanji)) {
        score += 45;
      }
      if (sharesKanji(targetKanji, candKanji)) {
        score += 35;
      }
      // Panjang kanji sama (e.g. sama-sama 2 kanji)
      if (targetKanji.length === candKanji.length) {
        score += 20;
      }
      // Okurigana mirip
      if (
        targetKanji.slice(-1) === candKanji.slice(-1) &&
        !/[\u4e00-\u9faf]/.test(targetKanji.slice(-1))
      ) {
        score += 20;
      }
    } else {
      // kanji_to_meaning / reading_to_meaning
      if (candPos === targetPos) {
        score += 35;
      }
      // Jika sama-sama kata sifat / kata kerja
      if (targetPos === "verb" && candPos === "verb") score += 25;
      if (targetPos === "i-adj" && candPos === "i-adj") score += 25;
      if (targetPos === "time" && candPos === "time") score += 30;
      if (targetPos === "person" && candPos === "person") score += 30;
      if (targetPos === "place" && candPos === "place") score += 30;
    }

    // Jitter acak ringan (0-8) agar pilihan bervariasi setiap percobaan
    const jitter = Math.random() * 8;

    return {
      answer: candAnswer,
      score: score + jitter,
    };
  });

  // Urutkan dari skor tertinggi
  scored.sort((a, b) => b.score - a.score);

  // Ambil distractor unik teratas
  const pickedDistractors: string[] = [];
  for (const item of scored) {
    if (
      item.answer !== correctAnswer &&
      !pickedDistractors.includes(item.answer)
    ) {
      pickedDistractors.push(item.answer);
      if (pickedDistractors.length >= 3) break;
    }
  }

  // Gabungkan dengan jawaban benar lalu acak urutan pilihan (1-4)
  const options = [correctAnswer, ...pickedDistractors];
  return options.sort(() => Math.random() - 0.5);
}
