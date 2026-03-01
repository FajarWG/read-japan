export type KanaType = "hiragana" | "katakana";

export interface KanaEntry {
  romaji: string;
  type: KanaType;
  /** Huruf dasar jika ini adalah modifikasi (dakuten/handakuten/yoon) */
  origin?: string;
  /** Penjelasan singkat modifikasi */
  explanation?: string;
}

/**
 * Peta lengkap Hiragana & Katakana.
 * Key = karakter kana (misalnya 'あ', 'ア', 'きゃ', 'キャ', dsb.)
 */
export const kanaMap: Record<string, KanaEntry> = {
  // ─────────────────────────────────────────
  // HIRAGANA — Vokal
  // ─────────────────────────────────────────
  あ: { romaji: "a", type: "hiragana" },
  い: { romaji: "i", type: "hiragana" },
  う: { romaji: "u", type: "hiragana" },
  え: { romaji: "e", type: "hiragana" },
  お: { romaji: "o", type: "hiragana" },

  // ─────────────────────────────────────────
  // HIRAGANA — K-row
  // ─────────────────────────────────────────
  か: { romaji: "ka", type: "hiragana" },
  き: { romaji: "ki", type: "hiragana" },
  く: { romaji: "ku", type: "hiragana" },
  け: { romaji: "ke", type: "hiragana" },
  こ: { romaji: "ko", type: "hiragana" },

  // G-row (dakuten dari K)
  が: { romaji: "ga", type: "hiragana", origin: "か", explanation: "dakuten" },
  ぎ: { romaji: "gi", type: "hiragana", origin: "き", explanation: "dakuten" },
  ぐ: { romaji: "gu", type: "hiragana", origin: "く", explanation: "dakuten" },
  げ: { romaji: "ge", type: "hiragana", origin: "け", explanation: "dakuten" },
  ご: { romaji: "go", type: "hiragana", origin: "こ", explanation: "dakuten" },

  // ─────────────────────────────────────────
  // HIRAGANA — S-row
  // ─────────────────────────────────────────
  さ: { romaji: "sa", type: "hiragana" },
  し: { romaji: "shi", type: "hiragana" },
  す: { romaji: "su", type: "hiragana" },
  せ: { romaji: "se", type: "hiragana" },
  そ: { romaji: "so", type: "hiragana" },

  // Z-row (dakuten dari S)
  ざ: { romaji: "za", type: "hiragana", origin: "さ", explanation: "dakuten" },
  じ: { romaji: "ji", type: "hiragana", origin: "し", explanation: "dakuten" },
  ず: { romaji: "zu", type: "hiragana", origin: "す", explanation: "dakuten" },
  ぜ: { romaji: "ze", type: "hiragana", origin: "せ", explanation: "dakuten" },
  ぞ: { romaji: "zo", type: "hiragana", origin: "そ", explanation: "dakuten" },

  // ─────────────────────────────────────────
  // HIRAGANA — T-row
  // ─────────────────────────────────────────
  た: { romaji: "ta", type: "hiragana" },
  ち: { romaji: "chi", type: "hiragana" },
  つ: { romaji: "tsu", type: "hiragana" },
  て: { romaji: "te", type: "hiragana" },
  と: { romaji: "to", type: "hiragana" },

  // D-row (dakuten dari T)
  だ: { romaji: "da", type: "hiragana", origin: "た", explanation: "dakuten" },
  ぢ: { romaji: "di", type: "hiragana", origin: "ち", explanation: "dakuten" },
  づ: { romaji: "du", type: "hiragana", origin: "つ", explanation: "dakuten" },
  で: { romaji: "de", type: "hiragana", origin: "て", explanation: "dakuten" },
  ど: { romaji: "do", type: "hiragana", origin: "と", explanation: "dakuten" },

  // ─────────────────────────────────────────
  // HIRAGANA — N-row
  // ─────────────────────────────────────────
  な: { romaji: "na", type: "hiragana" },
  に: { romaji: "ni", type: "hiragana" },
  ぬ: { romaji: "nu", type: "hiragana" },
  ね: { romaji: "ne", type: "hiragana" },
  の: { romaji: "no", type: "hiragana" },

  // ─────────────────────────────────────────
  // HIRAGANA — H-row
  // ─────────────────────────────────────────
  は: { romaji: "ha", type: "hiragana" },
  ひ: { romaji: "hi", type: "hiragana" },
  ふ: { romaji: "fu", type: "hiragana" },
  へ: { romaji: "he", type: "hiragana" },
  ほ: { romaji: "ho", type: "hiragana" },

  // B-row (dakuten dari H)
  ば: { romaji: "ba", type: "hiragana", origin: "は", explanation: "dakuten" },
  び: { romaji: "bi", type: "hiragana", origin: "ひ", explanation: "dakuten" },
  ぶ: { romaji: "bu", type: "hiragana", origin: "ふ", explanation: "dakuten" },
  べ: { romaji: "be", type: "hiragana", origin: "へ", explanation: "dakuten" },
  ぼ: { romaji: "bo", type: "hiragana", origin: "ほ", explanation: "dakuten" },

  // P-row (handakuten dari H)
  ぱ: {
    romaji: "pa",
    type: "hiragana",
    origin: "は",
    explanation: "handakuten",
  },
  ぴ: {
    romaji: "pi",
    type: "hiragana",
    origin: "ひ",
    explanation: "handakuten",
  },
  ぷ: {
    romaji: "pu",
    type: "hiragana",
    origin: "ふ",
    explanation: "handakuten",
  },
  ぺ: {
    romaji: "pe",
    type: "hiragana",
    origin: "へ",
    explanation: "handakuten",
  },
  ぽ: {
    romaji: "po",
    type: "hiragana",
    origin: "ほ",
    explanation: "handakuten",
  },

  // ─────────────────────────────────────────
  // HIRAGANA — M-row
  // ─────────────────────────────────────────
  ま: { romaji: "ma", type: "hiragana" },
  み: { romaji: "mi", type: "hiragana" },
  む: { romaji: "mu", type: "hiragana" },
  め: { romaji: "me", type: "hiragana" },
  も: { romaji: "mo", type: "hiragana" },

  // ─────────────────────────────────────────
  // HIRAGANA — Y-row
  // ─────────────────────────────────────────
  や: { romaji: "ya", type: "hiragana" },
  ゆ: { romaji: "yu", type: "hiragana" },
  よ: { romaji: "yo", type: "hiragana" },

  // ─────────────────────────────────────────
  // HIRAGANA — R-row
  // ─────────────────────────────────────────
  ら: { romaji: "ra", type: "hiragana" },
  り: { romaji: "ri", type: "hiragana" },
  る: { romaji: "ru", type: "hiragana" },
  れ: { romaji: "re", type: "hiragana" },
  ろ: { romaji: "ro", type: "hiragana" },

  // ─────────────────────────────────────────
  // HIRAGANA — W-row & N
  // ─────────────────────────────────────────
  わ: { romaji: "wa", type: "hiragana" },
  ゐ: { romaji: "wi", type: "hiragana" },
  ゑ: { romaji: "we", type: "hiragana" },
  を: { romaji: "wo", type: "hiragana" },
  ん: { romaji: "n", type: "hiragana" },

  // ─────────────────────────────────────────
  // HIRAGANA — Yōon (kombinasi dengan small や/ゆ/よ)
  // ─────────────────────────────────────────
  きゃ: {
    romaji: "kya",
    type: "hiragana",
    origin: "き",
    explanation: "yoon/combination",
  },
  きゅ: {
    romaji: "kyu",
    type: "hiragana",
    origin: "き",
    explanation: "yoon/combination",
  },
  きょ: {
    romaji: "kyo",
    type: "hiragana",
    origin: "き",
    explanation: "yoon/combination",
  },

  ぎゃ: {
    romaji: "gya",
    type: "hiragana",
    origin: "ぎ",
    explanation: "yoon/combination",
  },
  ぎゅ: {
    romaji: "gyu",
    type: "hiragana",
    origin: "ぎ",
    explanation: "yoon/combination",
  },
  ぎょ: {
    romaji: "gyo",
    type: "hiragana",
    origin: "ぎ",
    explanation: "yoon/combination",
  },

  しゃ: {
    romaji: "sha",
    type: "hiragana",
    origin: "し",
    explanation: "yoon/combination",
  },
  しゅ: {
    romaji: "shu",
    type: "hiragana",
    origin: "し",
    explanation: "yoon/combination",
  },
  しょ: {
    romaji: "sho",
    type: "hiragana",
    origin: "し",
    explanation: "yoon/combination",
  },

  じゃ: {
    romaji: "ja",
    type: "hiragana",
    origin: "じ",
    explanation: "yoon/combination",
  },
  じゅ: {
    romaji: "ju",
    type: "hiragana",
    origin: "じ",
    explanation: "yoon/combination",
  },
  じょ: {
    romaji: "jo",
    type: "hiragana",
    origin: "じ",
    explanation: "yoon/combination",
  },

  ちゃ: {
    romaji: "cha",
    type: "hiragana",
    origin: "ち",
    explanation: "yoon/combination",
  },
  ちゅ: {
    romaji: "chu",
    type: "hiragana",
    origin: "ち",
    explanation: "yoon/combination",
  },
  ちょ: {
    romaji: "cho",
    type: "hiragana",
    origin: "ち",
    explanation: "yoon/combination",
  },

  にゃ: {
    romaji: "nya",
    type: "hiragana",
    origin: "に",
    explanation: "yoon/combination",
  },
  にゅ: {
    romaji: "nyu",
    type: "hiragana",
    origin: "に",
    explanation: "yoon/combination",
  },
  にょ: {
    romaji: "nyo",
    type: "hiragana",
    origin: "に",
    explanation: "yoon/combination",
  },

  ひゃ: {
    romaji: "hya",
    type: "hiragana",
    origin: "ひ",
    explanation: "yoon/combination",
  },
  ひゅ: {
    romaji: "hyu",
    type: "hiragana",
    origin: "ひ",
    explanation: "yoon/combination",
  },
  ひょ: {
    romaji: "hyo",
    type: "hiragana",
    origin: "ひ",
    explanation: "yoon/combination",
  },

  びゃ: {
    romaji: "bya",
    type: "hiragana",
    origin: "び",
    explanation: "yoon/combination",
  },
  びゅ: {
    romaji: "byu",
    type: "hiragana",
    origin: "び",
    explanation: "yoon/combination",
  },
  びょ: {
    romaji: "byo",
    type: "hiragana",
    origin: "び",
    explanation: "yoon/combination",
  },

  ぴゃ: {
    romaji: "pya",
    type: "hiragana",
    origin: "ぴ",
    explanation: "yoon/combination",
  },
  ぴゅ: {
    romaji: "pyu",
    type: "hiragana",
    origin: "ぴ",
    explanation: "yoon/combination",
  },
  ぴょ: {
    romaji: "pyo",
    type: "hiragana",
    origin: "ぴ",
    explanation: "yoon/combination",
  },

  みゃ: {
    romaji: "mya",
    type: "hiragana",
    origin: "み",
    explanation: "yoon/combination",
  },
  みゅ: {
    romaji: "myu",
    type: "hiragana",
    origin: "み",
    explanation: "yoon/combination",
  },
  みょ: {
    romaji: "myo",
    type: "hiragana",
    origin: "み",
    explanation: "yoon/combination",
  },

  りゃ: {
    romaji: "rya",
    type: "hiragana",
    origin: "り",
    explanation: "yoon/combination",
  },
  りゅ: {
    romaji: "ryu",
    type: "hiragana",
    origin: "り",
    explanation: "yoon/combination",
  },
  りょ: {
    romaji: "ryo",
    type: "hiragana",
    origin: "り",
    explanation: "yoon/combination",
  },

  // ─────────────────────────────────────────
  // KATAKANA — Vokal
  // ─────────────────────────────────────────
  ア: { romaji: "a", type: "katakana" },
  イ: { romaji: "i", type: "katakana" },
  ウ: { romaji: "u", type: "katakana" },
  エ: { romaji: "e", type: "katakana" },
  オ: { romaji: "o", type: "katakana" },

  // ─────────────────────────────────────────
  // KATAKANA — K-row
  // ─────────────────────────────────────────
  カ: { romaji: "ka", type: "katakana" },
  キ: { romaji: "ki", type: "katakana" },
  ク: { romaji: "ku", type: "katakana" },
  ケ: { romaji: "ke", type: "katakana" },
  コ: { romaji: "ko", type: "katakana" },

  // G-row (dakuten dari K)
  ガ: { romaji: "ga", type: "katakana", origin: "カ", explanation: "dakuten" },
  ギ: { romaji: "gi", type: "katakana", origin: "キ", explanation: "dakuten" },
  グ: { romaji: "gu", type: "katakana", origin: "ク", explanation: "dakuten" },
  ゲ: { romaji: "ge", type: "katakana", origin: "ケ", explanation: "dakuten" },
  ゴ: { romaji: "go", type: "katakana", origin: "コ", explanation: "dakuten" },

  // ─────────────────────────────────────────
  // KATAKANA — S-row
  // ─────────────────────────────────────────
  サ: { romaji: "sa", type: "katakana" },
  シ: { romaji: "shi", type: "katakana" },
  ス: { romaji: "su", type: "katakana" },
  セ: { romaji: "se", type: "katakana" },
  ソ: { romaji: "so", type: "katakana" },

  // Z-row (dakuten dari S)
  ザ: { romaji: "za", type: "katakana", origin: "サ", explanation: "dakuten" },
  ジ: { romaji: "ji", type: "katakana", origin: "シ", explanation: "dakuten" },
  ズ: { romaji: "zu", type: "katakana", origin: "ス", explanation: "dakuten" },
  ゼ: { romaji: "ze", type: "katakana", origin: "セ", explanation: "dakuten" },
  ゾ: { romaji: "zo", type: "katakana", origin: "ソ", explanation: "dakuten" },

  // ─────────────────────────────────────────
  // KATAKANA — T-row
  // ─────────────────────────────────────────
  タ: { romaji: "ta", type: "katakana" },
  チ: { romaji: "chi", type: "katakana" },
  ツ: { romaji: "tsu", type: "katakana" },
  テ: { romaji: "te", type: "katakana" },
  ト: { romaji: "to", type: "katakana" },

  // D-row (dakuten dari T)
  ダ: { romaji: "da", type: "katakana", origin: "タ", explanation: "dakuten" },
  ヂ: { romaji: "di", type: "katakana", origin: "チ", explanation: "dakuten" },
  ヅ: { romaji: "du", type: "katakana", origin: "ツ", explanation: "dakuten" },
  デ: { romaji: "de", type: "katakana", origin: "テ", explanation: "dakuten" },
  ド: { romaji: "do", type: "katakana", origin: "ト", explanation: "dakuten" },

  // ─────────────────────────────────────────
  // KATAKANA — N-row
  // ─────────────────────────────────────────
  ナ: { romaji: "na", type: "katakana" },
  ニ: { romaji: "ni", type: "katakana" },
  ヌ: { romaji: "nu", type: "katakana" },
  ネ: { romaji: "ne", type: "katakana" },
  ノ: { romaji: "no", type: "katakana" },

  // ─────────────────────────────────────────
  // KATAKANA — H-row
  // ─────────────────────────────────────────
  ハ: { romaji: "ha", type: "katakana" },
  ヒ: { romaji: "hi", type: "katakana" },
  フ: { romaji: "fu", type: "katakana" },
  ヘ: { romaji: "he", type: "katakana" },
  ホ: { romaji: "ho", type: "katakana" },

  // B-row (dakuten dari H)
  バ: { romaji: "ba", type: "katakana", origin: "ハ", explanation: "dakuten" },
  ビ: { romaji: "bi", type: "katakana", origin: "ヒ", explanation: "dakuten" },
  ブ: { romaji: "bu", type: "katakana", origin: "フ", explanation: "dakuten" },
  ベ: { romaji: "be", type: "katakana", origin: "ヘ", explanation: "dakuten" },
  ボ: { romaji: "bo", type: "katakana", origin: "ホ", explanation: "dakuten" },

  // P-row (handakuten dari H)
  パ: {
    romaji: "pa",
    type: "katakana",
    origin: "ハ",
    explanation: "handakuten",
  },
  ピ: {
    romaji: "pi",
    type: "katakana",
    origin: "ヒ",
    explanation: "handakuten",
  },
  プ: {
    romaji: "pu",
    type: "katakana",
    origin: "フ",
    explanation: "handakuten",
  },
  ペ: {
    romaji: "pe",
    type: "katakana",
    origin: "ヘ",
    explanation: "handakuten",
  },
  ポ: {
    romaji: "po",
    type: "katakana",
    origin: "ホ",
    explanation: "handakuten",
  },

  // ─────────────────────────────────────────
  // KATAKANA — M-row
  // ─────────────────────────────────────────
  マ: { romaji: "ma", type: "katakana" },
  ミ: { romaji: "mi", type: "katakana" },
  ム: { romaji: "mu", type: "katakana" },
  メ: { romaji: "me", type: "katakana" },
  モ: { romaji: "mo", type: "katakana" },

  // ─────────────────────────────────────────
  // KATAKANA — Y-row
  // ─────────────────────────────────────────
  ヤ: { romaji: "ya", type: "katakana" },
  ユ: { romaji: "yu", type: "katakana" },
  ヨ: { romaji: "yo", type: "katakana" },

  // ─────────────────────────────────────────
  // KATAKANA — R-row
  // ─────────────────────────────────────────
  ラ: { romaji: "ra", type: "katakana" },
  リ: { romaji: "ri", type: "katakana" },
  ル: { romaji: "ru", type: "katakana" },
  レ: { romaji: "re", type: "katakana" },
  ロ: { romaji: "ro", type: "katakana" },

  // ─────────────────────────────────────────
  // KATAKANA — W-row & N
  // ─────────────────────────────────────────
  ワ: { romaji: "wa", type: "katakana" },
  ヲ: { romaji: "wo", type: "katakana" },
  ン: { romaji: "n", type: "katakana" },

  // ─────────────────────────────────────────
  // KATAKANA — Yōon (kombinasi dengan small ャ/ュ/ョ)
  // ─────────────────────────────────────────
  キャ: {
    romaji: "kya",
    type: "katakana",
    origin: "キ",
    explanation: "yoon/combination",
  },
  キュ: {
    romaji: "kyu",
    type: "katakana",
    origin: "キ",
    explanation: "yoon/combination",
  },
  キョ: {
    romaji: "kyo",
    type: "katakana",
    origin: "キ",
    explanation: "yoon/combination",
  },

  ギャ: {
    romaji: "gya",
    type: "katakana",
    origin: "ギ",
    explanation: "yoon/combination",
  },
  ギュ: {
    romaji: "gyu",
    type: "katakana",
    origin: "ギ",
    explanation: "yoon/combination",
  },
  ギョ: {
    romaji: "gyo",
    type: "katakana",
    origin: "ギ",
    explanation: "yoon/combination",
  },

  シャ: {
    romaji: "sha",
    type: "katakana",
    origin: "シ",
    explanation: "yoon/combination",
  },
  シュ: {
    romaji: "shu",
    type: "katakana",
    origin: "シ",
    explanation: "yoon/combination",
  },
  ショ: {
    romaji: "sho",
    type: "katakana",
    origin: "シ",
    explanation: "yoon/combination",
  },

  ジャ: {
    romaji: "ja",
    type: "katakana",
    origin: "ジ",
    explanation: "yoon/combination",
  },
  ジュ: {
    romaji: "ju",
    type: "katakana",
    origin: "ジ",
    explanation: "yoon/combination",
  },
  ジョ: {
    romaji: "jo",
    type: "katakana",
    origin: "ジ",
    explanation: "yoon/combination",
  },

  チャ: {
    romaji: "cha",
    type: "katakana",
    origin: "チ",
    explanation: "yoon/combination",
  },
  チュ: {
    romaji: "chu",
    type: "katakana",
    origin: "チ",
    explanation: "yoon/combination",
  },
  チョ: {
    romaji: "cho",
    type: "katakana",
    origin: "チ",
    explanation: "yoon/combination",
  },

  ニャ: {
    romaji: "nya",
    type: "katakana",
    origin: "ニ",
    explanation: "yoon/combination",
  },
  ニュ: {
    romaji: "nyu",
    type: "katakana",
    origin: "ニ",
    explanation: "yoon/combination",
  },
  ニョ: {
    romaji: "nyo",
    type: "katakana",
    origin: "ニ",
    explanation: "yoon/combination",
  },

  ヒャ: {
    romaji: "hya",
    type: "katakana",
    origin: "ヒ",
    explanation: "yoon/combination",
  },
  ヒュ: {
    romaji: "hyu",
    type: "katakana",
    origin: "ヒ",
    explanation: "yoon/combination",
  },
  ヒョ: {
    romaji: "hyo",
    type: "katakana",
    origin: "ヒ",
    explanation: "yoon/combination",
  },

  ビャ: {
    romaji: "bya",
    type: "katakana",
    origin: "ビ",
    explanation: "yoon/combination",
  },
  ビュ: {
    romaji: "byu",
    type: "katakana",
    origin: "ビ",
    explanation: "yoon/combination",
  },
  ビョ: {
    romaji: "byo",
    type: "katakana",
    origin: "ビ",
    explanation: "yoon/combination",
  },

  ピャ: {
    romaji: "pya",
    type: "katakana",
    origin: "ピ",
    explanation: "yoon/combination",
  },
  ピュ: {
    romaji: "pyu",
    type: "katakana",
    origin: "ピ",
    explanation: "yoon/combination",
  },
  ピョ: {
    romaji: "pyo",
    type: "katakana",
    origin: "ピ",
    explanation: "yoon/combination",
  },

  ミャ: {
    romaji: "mya",
    type: "katakana",
    origin: "ミ",
    explanation: "yoon/combination",
  },
  ミュ: {
    romaji: "myu",
    type: "katakana",
    origin: "ミ",
    explanation: "yoon/combination",
  },
  ミョ: {
    romaji: "myo",
    type: "katakana",
    origin: "ミ",
    explanation: "yoon/combination",
  },

  リャ: {
    romaji: "rya",
    type: "katakana",
    origin: "リ",
    explanation: "yoon/combination",
  },
  リュ: {
    romaji: "ryu",
    type: "katakana",
    origin: "リ",
    explanation: "yoon/combination",
  },
  リョ: {
    romaji: "ryo",
    type: "katakana",
    origin: "リ",
    explanation: "yoon/combination",
  },

  // ─────────────────────────────────────────
  // KATAKANA — Kombinasi modern (loanword/gairaigo)
  // ─────────────────────────────────────────
  ファ: {
    romaji: "fa",
    type: "katakana",
    origin: "フ",
    explanation: "yoon/combination",
  },
  フィ: {
    romaji: "fi",
    type: "katakana",
    origin: "フ",
    explanation: "yoon/combination",
  },
  フェ: {
    romaji: "fe",
    type: "katakana",
    origin: "フ",
    explanation: "yoon/combination",
  },
  フォ: {
    romaji: "fo",
    type: "katakana",
    origin: "フ",
    explanation: "yoon/combination",
  },
  フュ: {
    romaji: "fyu",
    type: "katakana",
    origin: "フ",
    explanation: "yoon/combination",
  },

  ティ: {
    romaji: "ti",
    type: "katakana",
    origin: "テ",
    explanation: "yoon/combination",
  },
  トゥ: {
    romaji: "tu",
    type: "katakana",
    origin: "ト",
    explanation: "yoon/combination",
  },
  ディ: {
    romaji: "di",
    type: "katakana",
    origin: "デ",
    explanation: "yoon/combination",
  },
  ドゥ: {
    romaji: "du",
    type: "katakana",
    origin: "ド",
    explanation: "yoon/combination",
  },

  ウィ: {
    romaji: "wi",
    type: "katakana",
    origin: "ウ",
    explanation: "yoon/combination",
  },
  ウェ: {
    romaji: "we",
    type: "katakana",
    origin: "ウ",
    explanation: "yoon/combination",
  },
  ウォ: {
    romaji: "wo",
    type: "katakana",
    origin: "ウ",
    explanation: "yoon/combination",
  },

  ヴァ: {
    romaji: "va",
    type: "katakana",
    origin: "ヴ",
    explanation: "yoon/combination",
  },
  ヴィ: {
    romaji: "vi",
    type: "katakana",
    origin: "ヴ",
    explanation: "yoon/combination",
  },
  ヴ: { romaji: "vu", type: "katakana", origin: "ウ", explanation: "dakuten" },
  ヴェ: {
    romaji: "ve",
    type: "katakana",
    origin: "ヴ",
    explanation: "yoon/combination",
  },
  ヴォ: {
    romaji: "vo",
    type: "katakana",
    origin: "ヴ",
    explanation: "yoon/combination",
  },

  チェ: {
    romaji: "che",
    type: "katakana",
    origin: "チ",
    explanation: "yoon/combination",
  },
  シェ: {
    romaji: "she",
    type: "katakana",
    origin: "シ",
    explanation: "yoon/combination",
  },
  ジェ: {
    romaji: "je",
    type: "katakana",
    origin: "ジ",
    explanation: "yoon/combination",
  },
  ツァ: {
    romaji: "tsa",
    type: "katakana",
    origin: "ツ",
    explanation: "yoon/combination",
  },
  ツェ: {
    romaji: "tse",
    type: "katakana",
    origin: "ツ",
    explanation: "yoon/combination",
  },
  ツォ: {
    romaji: "tso",
    type: "katakana",
    origin: "ツ",
    explanation: "yoon/combination",
  },
};

// ─────────────────────────────────────────
// Helper: filter berdasarkan tipe
// ─────────────────────────────────────────
export function getKanaByType(type: KanaType): Record<string, KanaEntry> {
  return Object.fromEntries(
    Object.entries(kanaMap).filter(([, entry]) => entry.type === type),
  );
}

// Helper: filter hanya huruf dasar (bukan modifikasi/yoon)
export function getBaseKana(type: KanaType): Record<string, KanaEntry> {
  return Object.fromEntries(
    Object.entries(kanaMap).filter(
      ([, entry]) => entry.type === type && !entry.origin,
    ),
  );
}

// Helper: filter hanya yoon / kombinasi
export function getYoonKana(type: KanaType): Record<string, KanaEntry> {
  return Object.fromEntries(
    Object.entries(kanaMap).filter(
      ([, entry]) => entry.type === type && entry.explanation?.includes("yoon"),
    ),
  );
}
