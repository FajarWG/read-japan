/**
 * Seed data kanji JLPT N5 (100 kanji).
 *
 * Sumber: disusun manual dari standar JLPT N5. Setiap entry memiliki:
 * - kanji: bentuk kanji
 * - onyomi: bacaan on'yomi (katakana)
 * - kunyomi: bacaan kun'yomi (hiragana), array karena bisa lebih dari 1
 * - meaningEn / meaningId: terjemahan
 * - examples: [{word, reading, meaningEn, meaningId}] — kata turunan umum
 * - jlpt: selalu "N5"
 * - strokes: jumlah goresan (untuk ditampilkan)
 *
 * Untuk stroke order SVG, dipakai KanjiVG data via dynamic fetch (lihat
 * KanjiDetail component). File ini hanya menyimpan metadata.
 */

export interface KanjiSeed {
  kanji: string;
  onyomi: string | null;
  kunyomi: string[];
  meaningEn: string;
  meaningId: string;
  jlpt: "N5";
  strokes: number;
  examples: Array<{
    word: string;
    reading: string;
    meaningEn: string;
    meaningId: string;
  }>;
}

export const KANJI_N5: KanjiSeed[] = [
  {
    kanji: "一", onyomi: "イチ", kunyomi: ["ひと", "ひと.つ"],
    meaningEn: "one", meaningId: "satu", jlpt: "N5", strokes: 1,
    examples: [{ word: "一人", reading: "ひとり", meaningEn: "one person", meaningId: "satu orang" }],
  },
  {
    kanji: "二", onyomi: "ニ", kunyomi: ["ふた", "ふた.つ", "ふたた.び"],
    meaningEn: "two", meaningId: "dua", jlpt: "N5", strokes: 2,
    examples: [{ word: "二人", reading: "ふたり", meaningEn: "two people", meaningId: "dua orang" }],
  },
  {
    kanji: "三", onyomi: "サン", kunyomi: ["み", "み.つ", "みっ.つ"],
    meaningEn: "three", meaningId: "tiga", jlpt: "N5", strokes: 3,
    examples: [{ word: "三人", reading: "さんにん", meaningEn: "three people", meaningId: "tiga orang" }],
  },
  {
    kanji: "四", onyomi: "シ", kunyomi: ["よ", "よ.つ", "よっ.つ", "よん"],
    meaningEn: "four", meaningId: "empat", jlpt: "N5", strokes: 5,
    examples: [{ word: "四人", reading: "よにん", meaningEn: "four people", meaningId: "empat orang" }],
  },
  {
    kanji: "五", onyomi: "ゴ", kunyomi: ["いつ", "いつ.つ"],
    meaningEn: "five", meaningId: "lima", jlpt: "N5", strokes: 4,
    examples: [{ word: "五人", reading: "ごにん", meaningEn: "five people", meaningId: "lima orang" }],
  },
  {
    kanji: "六", onyomi: "ロク", kunyomi: ["む", "む.つ", "むっ.つ", "むい"],
    meaningEn: "six", meaningId: "enam", jlpt: "N5", strokes: 4,
    examples: [{ word: "六時", reading: "ろくじ", meaningEn: "six o'clock", meaningId: "jam enam" }],
  },
  {
    kanji: "七", onyomi: "シチ", kunyomi: ["なな", "なな.つ", "なの"],
    meaningEn: "seven", meaningId: "tujuh", jlpt: "N5", strokes: 2,
    examples: [{ word: "七日", reading: "なのか", meaningEn: "seven days", meaningId: "tujuh hari" }],
  },
  {
    kanji: "八", onyomi: "ハチ", kunyomi: ["や", "や.つ", "やっ.つ", "よう"],
    meaningEn: "eight", meaningId: "delapan", jlpt: "N5", strokes: 2,
    examples: [{ word: "八月", reading: "はちがつ", meaningEn: "August", meaningId: "Agustus" }],
  },
  {
    kanji: "九", onyomi: "キュウ", kunyomi: ["ここの", "ここの.つ"],
    meaningEn: "nine", meaningId: "sembilan", jlpt: "N5", strokes: 2,
    examples: [{ word: "九時", reading: "くじ", meaningEn: "nine o'clock", meaningId: "jam sembilan" }],
  },
  {
    kanji: "十", onyomi: "ジュウ", kunyomi: ["とお", "と"],
    meaningEn: "ten", meaningId: "sepuluh", jlpt: "N5", strokes: 2,
    examples: [{ word: "十時", reading: "じゅうじ", meaningEn: "ten o'clock", meaningId: "jam sepuluh" }],
  },
  {
    kanji: "百", onyomi: "ヒャク", kunyomi: [],
    meaningEn: "hundred", meaningId: "ratus", jlpt: "N5", strokes: 6,
    examples: [{ word: "百円", reading: "ひゃくえん", meaningEn: "100 yen", meaningId: "100 yen" }],
  },
  {
    kanji: "千", onyomi: "セン", kunyomi: ["ち"],
    meaningEn: "thousand", meaningId: "ribu", jlpt: "N5", strokes: 3,
    examples: [{ word: "三千", reading: "さんぜん", meaningEn: "three thousand", meaningId: "tiga ribu" }],
  },
  {
    kanji: "万", onyomi: "マン", kunyomi: [],
    meaningEn: "ten thousand", meaningId: "puluh ribu", jlpt: "N5", strokes: 3,
    examples: [{ word: "一万", reading: "いちまん", meaningEn: "ten thousand", meaningId: "sepuluh ribu" }],
  },
  {
    kanji: "人", onyomi: "ジン", kunyomi: ["ひと"],
    meaningEn: "person", meaningId: "orang", jlpt: "N5", strokes: 2,
    examples: [
      { word: "日本人", reading: "にほんじん", meaningEn: "Japanese person", meaningId: "orang Jepang" },
      { word: "人", reading: "ひと", meaningEn: "person", meaningId: "orang" },
    ],
  },
  {
    kanji: "日", onyomi: "ニチ", kunyomi: ["ひ", "か"],
    meaningEn: "day, sun", meaningId: "hari, matahari", jlpt: "N5", strokes: 4,
    examples: [
      { word: "毎日", reading: "まいにち", meaningEn: "every day", meaningId: "setiap hari" },
      { word: "日曜日", reading: "にちようび", meaningEn: "Sunday", meaningId: "hari Minggu" },
    ],
  },
  {
    kanji: "月", onyomi: "ゲツ", kunyomi: ["つき"],
    meaningEn: "month, moon", meaningId: "bulan", jlpt: "N5", strokes: 4,
    examples: [
      { word: "一月", reading: "いちがつ", meaningEn: "January", meaningId: "Januari" },
      { word: "月曜日", reading: "げつようび", meaningEn: "Monday", meaningId: "hari Senin" },
    ],
  },
  {
    kanji: "火", onyomi: "カ", kunyomi: ["ひ", "ほ"],
    meaningEn: "fire", meaningId: "api", jlpt: "N5", strokes: 4,
    examples: [
      { word: "火曜日", reading: "かようび", meaningEn: "Tuesday", meaningId: "hari Selasa" },
      { word: "花火", reading: "はなび", meaningEn: "fireworks", meaningId: "kembang api" },
    ],
  },
  {
    kanji: "水", onyomi: "スイ", kunyomi: ["みず"],
    meaningEn: "water", meaningId: "air", jlpt: "N5", strokes: 4,
    examples: [
      { word: "水曜日", reading: "すいようび", meaningEn: "Wednesday", meaningId: "hari Rabu" },
      { word: "水道", reading: "すいどう", meaningEn: "water supply", meaningId: "saluran air" },
    ],
  },
  {
    kanji: "木", onyomi: "ボク", kunyomi: ["き", "こ"],
    meaningEn: "tree, wood", meaningId: "pohon, kayu", jlpt: "N5", strokes: 4,
    examples: [
      { word: "木曜日", reading: "もくようび", meaningEn: "Thursday", meaningId: "hari Kamis" },
      { word: "木村", reading: "きむら", meaningEn: "Kimura (surname)", meaningId: "Kimura (nama keluarga)" },
    ],
  },
  {
    kanji: "金", onyomi: "キン", kunyomi: ["かね", "かな"],
    meaningEn: "gold, money, metal", meaningId: "emas, uang, logam", jlpt: "N5", strokes: 8,
    examples: [
      { word: "金曜日", reading: "きんようび", meaningEn: "Friday", meaningId: "hari Jumat" },
      { word: "お金", reading: "おかね", meaningEn: "money", meaningId: "uang" },
    ],
  },
  {
    kanji: "土", onyomi: "ド", kunyomi: ["つち"],
    meaningEn: "earth, soil", meaningId: "tanah", jlpt: "N5", strokes: 3,
    examples: [
      { word: "土曜日", reading: "どようび", meaningEn: "Saturday", meaningId: "hari Sabtu" },
      { word: "土地", reading: "とち", meaningEn: "land", meaningId: "tanah" },
    ],
  },
  {
    kanji: "本", onyomi: "ホン", kunyomi: ["もと"],
    meaningEn: "book, origin", meaningId: "buku, asal", jlpt: "N5", strokes: 5,
    examples: [
      { word: "本", reading: "ほん", meaningEn: "book", meaningId: "buku" },
      { word: "日本", reading: "にほん", meaningEn: "Japan", meaningId: "Jepang" },
    ],
  },
  {
    kanji: "大", onyomi: "ダイ", kunyomi: ["おお", "おお.きい"],
    meaningEn: "big", meaningId: "besar", jlpt: "N5", strokes: 3,
    examples: [
      { word: "大きい", reading: "おおきい", meaningEn: "big", meaningId: "besar" },
      { word: "大学", reading: "だいがく", meaningEn: "university", meaningId: "universitas" },
    ],
  },
  {
    kanji: "小", onyomi: "ショウ", kunyomi: ["ちい.さい", "こ", "お"],
    meaningEn: "small", meaningId: "kecil", jlpt: "N5", strokes: 3,
    examples: [
      { word: "小さい", reading: "ちいさい", meaningEn: "small", meaningId: "kecil" },
      { word: "小学校", reading: "しょうがっこう", meaningEn: "elementary school", meaningId: "sekolah dasar" },
    ],
  },
  {
    kanji: "中", onyomi: "チュウ", kunyomi: ["なか", "うち", "あた.る"],
    meaningEn: "middle, inside", meaningId: "tengah, dalam", jlpt: "N5", strokes: 4,
    examples: [
      { word: "中学校", reading: "ちゅうがっこう", meaningEn: "middle school", meaningId: "SMP" },
      { word: "中", reading: "なか", meaningEn: "inside", meaningId: "dalam" },
    ],
  },
  {
    kanji: "上", onyomi: "ジョウ", kunyomi: ["うえ", "うわ", "かみ", "あ.げる", "のぼ.る"],
    meaningEn: "up, above", meaningId: "atas", jlpt: "N5", strokes: 3,
    examples: [
      { word: "上手", reading: "じょうず", meaningEn: "good at", meaningId: "pandai" },
      { word: "上がる", reading: "あがる", meaningEn: "to rise", meaningId: "naik" },
    ],
  },
  {
    kanji: "下", onyomi: "カ", kunyomi: ["した", "しも", "さ.げる", "くだ.る"],
    meaningEn: "down, below", meaningId: "bawah", jlpt: "N5", strokes: 3,
    examples: [
      { word: "下手", reading: "へた", meaningEn: "bad at", meaningId: "tidak pandai" },
      { word: "下がる", reading: "さがる", meaningEn: "to fall", meaningId: "turun" },
    ],
  },
  {
    kanji: "山", onyomi: "サン", kunyomi: ["やま"],
    meaningEn: "mountain", meaningId: "gunung", jlpt: "N5", strokes: 3,
    examples: [
      { word: "山", reading: "やま", meaningEn: "mountain", meaningId: "gunung" },
      { word: "富士山", reading: "ふじさん", meaningEn: "Mt. Fuji", meaningId: "Gunung Fuji" },
    ],
  },
  {
    kanji: "川", onyomi: "セン", kunyomi: ["かわ", "がわ"],
    meaningEn: "river", meaningId: "sungai", jlpt: "N5", strokes: 3,
    examples: [
      { word: "川", reading: "かわ", meaningEn: "river", meaningId: "sungai" },
    ],
  },
  {
    kanji: "田", onyomi: "デン", kunyomi: ["た"],
    meaningEn: "rice field", meaningId: "sawah", jlpt: "N5", strokes: 5,
    examples: [
      { word: "田中", reading: "たなか", meaningEn: "Tanaka (surname)", meaningId: "Tanaka" },
      { word: "田んぼ", reading: "たんぼ", meaningEn: "rice paddy", meaningId: "sawah" },
    ],
  },
  {
    kanji: "学校", onyomi: "ガク", kunyomi: [],
    meaningEn: "school", meaningId: "sekolah", jlpt: "N5", strokes: 10,
    examples: [
      { word: "学校", reading: "がっこう", meaningEn: "school", meaningId: "sekolah" },
    ],
  },
  {
    kanji: "先", onyomi: "セン", kunyomi: ["さき", "ま.ず"],
    meaningEn: "before, ahead", meaningId: "sebelum, depan", jlpt: "N5", strokes: 6,
    examples: [
      { word: "先生", reading: "せんせい", meaningEn: "teacher", meaningId: "guru" },
      { word: "先月", reading: "せんげつ", meaningEn: "last month", meaningId: "bulan lalu" },
    ],
  },
  {
    kanji: "生", onyomi: "セイ", kunyomi: ["い.きる", "う.まれる", "は.える", "なま"],
    meaningEn: "life, birth, raw", meaningId: "hidup, lahir, mentah", jlpt: "N5", strokes: 5,
    examples: [
      { word: "学生", reading: "がくせい", meaningEn: "student", meaningId: "pelajar" },
      { word: "生まれる", reading: "うまれる", meaningEn: "to be born", meaningId: "lahir" },
    ],
  },
  {
    kanji: "年", onyomi: "ネン", kunyomi: ["とし"],
    meaningEn: "year", meaningId: "tahun", jlpt: "N5", strokes: 6,
    examples: [
      { word: "今年", reading: "ことし", meaningEn: "this year", meaningId: "tahun ini" },
      { word: "来年", reading: "らいねん", meaningEn: "next year", meaningId: "tahun depan" },
    ],
  },
  {
    kanji: "時", onyomi: "ジ", kunyomi: ["とき"],
    meaningEn: "time, hour", meaningId: "waktu, jam", jlpt: "N5", strokes: 10,
    examples: [
      { word: "時間", reading: "じかん", meaningEn: "time", meaningId: "waktu" },
      { word: "時", reading: "とき", meaningEn: "time", meaningId: "waktu" },
    ],
  },
  {
    kanji: "分", onyomi: "ブン", kunyomi: ["わ.ける", "わ.かる"],
    meaningEn: "minute, part, understand", meaningId: "menit, bagian, mengerti", jlpt: "N5", strokes: 4,
    examples: [
      { word: "分かる", reading: "わかる", meaningEn: "to understand", meaningId: "mengerti" },
      { word: "三分", reading: "さんぶん", meaningEn: "three minutes", meaningId: "tiga menit" },
    ],
  },
  {
    kanji: "半", onyomi: "ハン", kunyomi: ["なか.ば"],
    meaningEn: "half", meaningId: "setengah", jlpt: "N5", strokes: 5,
    examples: [
      { word: "半分", reading: "はんぶん", meaningEn: "half", meaningId: "setengah" },
    ],
  },
  {
    kanji: "円", onyomi: "エン", kunyomi: ["まる.い"],
    meaningEn: "yen, circle", meaningId: "yen, lingkaran", jlpt: "N5", strokes: 4,
    examples: [
      { word: "百円", reading: "ひゃくえん", meaningEn: "100 yen", meaningId: "100 yen" },
    ],
  },
  {
    kanji: "行", onyomi: "コウ", kunyomi: ["い.く", "ゆ.く", "おこな.う"],
    meaningEn: "to go, conduct", meaningId: "pergi, melakukan", jlpt: "N5", strokes: 6,
    examples: [
      { word: "行く", reading: "いく", meaningEn: "to go", meaningId: "pergi" },
      { word: "旅行", reading: "りょこう", meaningEn: "travel", meaningId: "perjalanan" },
    ],
  },
  {
    kanji: "来", onyomi: "ライ", kunyomi: ["く.る", "こ"],
    meaningEn: "to come", meaningId: "datang", jlpt: "N5", strokes: 7,
    examples: [
      { word: "来る", reading: "くる", meaningEn: "to come", meaningId: "datang" },
    ],
  },
  {
    kanji: "帰", onyomi: "キ", kunyomi: ["かえ.る", "かえ.す"],
    meaningEn: "to return", meaningId: "kembali", jlpt: "N5", strokes: 10,
    examples: [
      { word: "帰る", reading: "かえる", meaningEn: "to return home", meaningId: "pulang" },
    ],
  },
  {
    kanji: "食", onyomi: "ショク", kunyomi: ["た.べる", "く.う", "は.む"],
    meaningEn: "to eat, food", meaningId: "makan, makanan", jlpt: "N5", strokes: 9,
    examples: [
      { word: "食べる", reading: "たべる", meaningEn: "to eat", meaningId: "makan" },
      { word: "食事", reading: "しょくじ", meaningEn: "meal", meaningId: "makanan" },
    ],
  },
  {
    kanji: "飲", onyomi: "イン", kunyomi: ["の.む"],
    meaningEn: "to drink", meaningId: "minum", jlpt: "N5", strokes: 12,
    examples: [
      { word: "飲む", reading: "のむ", meaningEn: "to drink", meaningId: "minum" },
    ],
  },
  {
    kanji: "見", onyomi: "ケン", kunyomi: ["み.る", "み.える", "み.せる"],
    meaningEn: "to see", meaningId: "lihat", jlpt: "N5", strokes: 7,
    examples: [
      { word: "見る", reading: "みる", meaningEn: "to see/watch", meaningId: "melihat" },
    ],
  },
  {
    kanji: "聞", onyomi: "ブン", kunyomi: ["き.く", "き.こえる"],
    meaningEn: "to hear, ask", meaningId: "mendengar, bertanya", jlpt: "N5", strokes: 14,
    examples: [
      { word: "聞く", reading: "きく", meaningEn: "to listen/ask", meaningId: "mendengar/bertanya" },
    ],
  },
  {
    kanji: "読", onyomi: "ドク", kunyomi: ["よ.む", "よ.み"],
    meaningEn: "to read", meaningId: "baca", jlpt: "N5", strokes: 14,
    examples: [
      { word: "読む", reading: "よむ", meaningEn: "to read", meaningId: "membaca" },
    ],
  },
  {
    kanji: "書", onyomi: "ショ", kunyomi: ["か.く", "か.き"],
    meaningEn: "to write", meaningId: "tulis", jlpt: "N5", strokes: 10,
    examples: [
      { word: "書く", reading: "かく", meaningEn: "to write", meaningId: "menulis" },
    ],
  },
  {
    kanji: "話", onyomi: "ワ", kunyomi: ["はな.す", "はなし"],
    meaningEn: "to talk, story", meaningId: "bicara, cerita", jlpt: "N5", strokes: 13,
    examples: [
      { word: "話す", reading: "はなす", meaningEn: "to speak", meaningId: "berbicara" },
      { word: "電話", reading: "でんわ", meaningEn: "telephone", meaningId: "telepon" },
    ],
  },
  {
    kanji: "言", onyomi: "ゲン", kunyomi: ["い.う", "こと"],
    meaningEn: "to say", meaningId: "bilang", jlpt: "N5", strokes: 7,
    examples: [
      { word: "言う", reading: "いう", meaningEn: "to say", meaningId: "mengatakan" },
    ],
  },
  {
    kanji: "出", onyomi: "シュツ", kunyomi: ["で.る", "だ.す", "い.でる"],
    meaningEn: "to exit, send out", meaningId: "keluar", jlpt: "N5", strokes: 5,
    examples: [
      { word: "出る", reading: "でる", meaningEn: "to go out", meaningId: "keluar" },
    ],
  },
  {
    kanji: "入", onyomi: "ニュウ", kunyomi: ["い.る", "はい.る", "い.れる"],
    meaningEn: "to enter", meaningId: "masuk", jlpt: "N5", strokes: 2,
    examples: [
      { word: "入る", reading: "はいる", meaningEn: "to enter", meaningId: "masuk" },
      { word: "入口", reading: "いりぐち", meaningEn: "entrance", meaningId: "pintu masuk" },
    ],
  },
  {
    kanji: "立", onyomi: "リツ", kunyomi: ["た.つ", "た.てる"],
    meaningEn: "to stand", meaningId: "berdiri", jlpt: "N5", strokes: 5,
    examples: [
      { word: "立つ", reading: "たつ", meaningEn: "to stand", meaningId: "berdiri" },
    ],
  },
  {
    kanji: "休", onyomi: "キュウ", kunyomi: ["やす.む", "やす.まる", "やす.い"],
    meaningEn: "to rest", meaningId: "istirahat", jlpt: "N5", strokes: 6,
    examples: [
      { word: "休む", reading: "やすむ", meaningEn: "to rest", meaningId: "istirahat" },
      { word: "休み", reading: "やすみ", meaningEn: "holiday, rest", meaningId: "libur" },
    ],
  },
  {
    kanji: "買", onyomi: "バイ", kunyomi: ["か.う"],
    meaningEn: "to buy", meaningId: "beli", jlpt: "N5", strokes: 12,
    examples: [
      { word: "買う", reading: "かう", meaningEn: "to buy", meaningId: "membeli" },
    ],
  },
  {
    kanji: "売", onyomi: "バイ", kunyomi: ["う.る", "う.り"],
    meaningEn: "to sell", meaningId: "jual", jlpt: "N5", strokes: 7,
    examples: [
      { word: "売る", reading: "うる", meaningEn: "to sell", meaningId: "menjual" },
    ],
  },
  {
    kanji: "新", onyomi: "シン", kunyomi: ["あたら.しい", "あら.た", "にい"],
    meaningEn: "new", meaningId: "baru", jlpt: "N5", strokes: 13,
    examples: [
      { word: "新しい", reading: "あたらしい", meaningEn: "new", meaningId: "baru" },
    ],
  },
  {
    kanji: "古", onyomi: "コ", kunyomi: ["ふる.い", "ふる"],
    meaningEn: "old", meaningId: "lama, tua", jlpt: "N5", strokes: 5,
    examples: [
      { word: "古い", reading: "ふるい", meaningEn: "old", meaningId: "lama" },
    ],
  },
  {
    kanji: "高", onyomi: "コウ", kunyomi: ["たか.い", "たか", "たか.まる", "たか.める"],
    meaningEn: "tall, expensive", meaningId: "tinggi, mahal", jlpt: "N5", strokes: 10,
    examples: [
      { word: "高い", reading: "たかい", meaningEn: "tall/expensive", meaningId: "tinggi/mahal" },
    ],
  },
  {
    kanji: "安", onyomi: "アン", kunyomi: ["やす.い", "やす.まる", "やす"],
    meaningEn: "cheap, peaceful", meaningId: "murah, tenang", jlpt: "N5", strokes: 6,
    examples: [
      { word: "安い", reading: "やすい", meaningEn: "cheap", meaningId: "murah" },
    ],
  },
  {
    kanji: "多", onyomi: "タ", kunyomi: ["おお.い"],
    meaningEn: "many", meaningId: "banyak", jlpt: "N5", strokes: 6,
    examples: [
      { word: "多い", reading: "おおい", meaningEn: "many", meaningId: "banyak" },
    ],
  },
  {
    kanji: "少", onyomi: "ショウ", kunyomi: ["すく.ない", "すこ.し"],
    meaningEn: "few, little", meaningId: "sedikit", jlpt: "N5", strokes: 4,
    examples: [
      { word: "少ない", reading: "すくない", meaningEn: "few", meaningId: "sedikit" },
      { word: "少し", reading: "すこし", meaningEn: "a little", meaningId: "sedikit" },
    ],
  },
  {
    kanji: "長", onyomi: "チョウ", kunyomi: ["なが.い", "おさ"],
    meaningEn: "long, leader", meaningId: "panjang, pemimpin", jlpt: "N5", strokes: 8,
    examples: [
      { word: "長い", reading: "ながい", meaningEn: "long", meaningId: "panjang" },
    ],
  },
  {
    kanji: "天", onyomi: "テン", kunyomi: ["あま"],
    meaningEn: "heaven, sky", meaningId: "langit", jlpt: "N5", strokes: 4,
    examples: [
      { word: "天気", reading: "てんき", meaningEn: "weather", meaningId: "cuaca" },
    ],
  },
  {
    kanji: "気", onyomi: "キ", kunyomi: [],
    meaningEn: "spirit, mood", meaningId: "semangat, suasana", jlpt: "N5", strokes: 4,
    examples: [
      { word: "元気", reading: "げんき", meaningEn: "healthy, energetic", meaningId: "sehat" },
    ],
  },
  {
    kanji: "車", onyomi: "シャ", kunyomi: ["くるま"],
    meaningEn: "car, vehicle", meaningId: "mobil, kendaraan", jlpt: "N5", strokes: 7,
    examples: [
      { word: "車", reading: "くるま", meaningEn: "car", meaningId: "mobil" },
    ],
  },
  {
    kanji: "電", onyomi: "デン", kunyomi: [],
    meaningEn: "electricity", meaningId: "listrik", jlpt: "N5", strokes: 13,
    examples: [
      { word: "電話", reading: "でんわ", meaningEn: "phone", meaningId: "telepon" },
    ],
  },
  {
    kanji: "駅", onyomi: "エキ", kunyomi: [],
    meaningEn: "station", meaningId: "stasiun", jlpt: "N5", strokes: 14,
    examples: [
      { word: "駅", reading: "えき", meaningEn: "station", meaningId: "stasiun" },
    ],
  },
  {
    kanji: "道", onyomi: "ドウ", kunyomi: ["みち"],
    meaningEn: "road, way", meaningId: "jalan", jlpt: "N5", strokes: 12,
    examples: [
      { word: "道", reading: "みち", meaningEn: "road", meaningId: "jalan" },
    ],
  },
  {
    kanji: "国", onyomi: "コク", kunyomi: ["くに"],
    meaningEn: "country", meaningId: "negara", jlpt: "N5", strokes: 8,
    examples: [
      { word: "日本国", reading: "にほんこく", meaningEn: "Japan (country)", meaningId: "Jepang" },
      { word: "外国", reading: "がいこく", meaningEn: "foreign country", meaningId: "luar negeri" },
    ],
  },
  {
    kanji: "語", onyomi: "ゴ", kunyomi: ["かた.る", "かた.らう"],
    meaningEn: "language", meaningId: "bahasa", jlpt: "N5", strokes: 14,
    examples: [
      { word: "日本語", reading: "にほんご", meaningEn: "Japanese language", meaningId: "bahasa Jepang" },
    ],
  },
  {
    kanji: "学", onyomi: "ガク", kunyomi: ["まな.ぶ"],
    meaningEn: "study, learning", meaningId: "belajar", jlpt: "N5", strokes: 8,
    examples: [
      { word: "勉強", reading: "べんきょう", meaningEn: "study", meaningId: "belajar" },
    ],
  },
  {
    kanji: "男", onyomi: "ダン", kunyomi: ["おとこ", "お"],
    meaningEn: "man, male", meaningId: "laki-laki", jlpt: "N5", strokes: 7,
    examples: [
      { word: "男の人", reading: "おとこのひと", meaningEn: "man", meaningId: "laki-laki" },
    ],
  },
  {
    kanji: "女", onyomi: "ジョ", kunyomi: ["おんな", "め"],
    meaningEn: "woman, female", meaningId: "perempuan", jlpt: "N5", strokes: 3,
    examples: [
      { word: "女の人", reading: "おんなのひと", meaningEn: "woman", meaningId: "perempuan" },
    ],
  },
  {
    kanji: "子", onyomi: "シ", kunyomi: ["こ", "ね"],
    meaningEn: "child", meaningId: "anak", jlpt: "N5", strokes: 3,
    examples: [
      { word: "子供", reading: "こども", meaningEn: "child", meaningId: "anak" },
    ],
  },
  {
    kanji: "友", onyomi: "ユウ", kunyomi: ["とも"],
    meaningEn: "friend", meaningId: "teman", jlpt: "N5", strokes: 4,
    examples: [
      { word: "友達", reading: "ともだち", meaningEn: "friend", meaningId: "teman" },
    ],
  },
  {
    kanji: "何", onyomi: "カ", kunyomi: ["なに", "なん"],
    meaningEn: "what", meaningId: "apa", jlpt: "N5", strokes: 7,
    examples: [
      { word: "何", reading: "なに", meaningEn: "what", meaningId: "apa" },
    ],
  },
  {
    kanji: "一", onyomi: "イチ", kunyomi: ["ひと", "ひと.つ"],
    meaningEn: "one", meaningId: "satu", jlpt: "N5", strokes: 1,
    examples: [],
  },
  {
    kanji: "名", onyomi: "メイ", kunyomi: ["な"],
    meaningEn: "name", meaningId: "nama", jlpt: "N5", strokes: 6,
    examples: [
      { word: "名前", reading: "なまえ", meaningEn: "name", meaningId: "nama" },
    ],
  },
  {
    kanji: "白", onyomi: "ハク", kunyomi: ["しろ", "しら"],
    meaningEn: "white", meaningId: "putih", jlpt: "N5", strokes: 5,
    examples: [
      { word: "白い", reading: "しろい", meaningEn: "white", meaningId: "putih" },
    ],
  },
  {
    kanji: "黒", onyomi: "コク", kunyomi: ["くろ"],
    meaningEn: "black", meaningId: "hitam", jlpt: "N5", strokes: 11,
    examples: [
      { word: "黒い", reading: "くろい", meaningEn: "black", meaningId: "hitam" },
    ],
  },
  {
    kanji: "赤", onyomi: "セキ", kunyomi: ["あか", "あか.い"],
    meaningEn: "red", meaningId: "merah", jlpt: "N5", strokes: 7,
    examples: [
      { word: "赤い", reading: "あかい", meaningEn: "red", meaningId: "merah" },
    ],
  },
  {
    kanji: "青", onyomi: "セイ", kunyomi: ["あお", "あお.い"],
    meaningEn: "blue", meaningId: "biru", jlpt: "N5", strokes: 8,
    examples: [
      { word: "青い", reading: "あおい", meaningEn: "blue", meaningId: "biru" },
    ],
  },
  {
    kanji: "会社", onyomi: "シャ", kunyomi: [],
    meaningEn: "company", meaningId: "perusahaan", jlpt: "N5", strokes: 10,
    examples: [
      { word: "会社", reading: "かいしゃ", meaningEn: "company", meaningId: "perusahaan" },
    ],
  },
  {
    kanji: "店", onyomi: "テン", kunyomi: ["みせ"],
    meaningEn: "shop, store", meaningId: "toko", jlpt: "N5", strokes: 8,
    examples: [
      { word: "店", reading: "みせ", meaningEn: "shop", meaningId: "toko" },
    ],
  },
  {
    kanji: "家", onyomi: "カ", kunyomi: ["いえ", "や", "うち"],
    meaningEn: "house, home, family", meaningId: "rumah, keluarga", jlpt: "N5", strokes: 10,
    examples: [
      { word: "家", reading: "いえ", meaningEn: "house", meaningId: "rumah" },
      { word: "家族", reading: "かぞく", meaningEn: "family", meaningId: "keluarga" },
    ],
  },
  {
    kanji: "母", onyomi: "ボ", kunyomi: ["はは", "かあ.さん"],
    meaningEn: "mother", meaningId: "ibu", jlpt: "N5", strokes: 5,
    examples: [
      { word: "母", reading: "はは", meaningEn: "mother", meaningId: "ibu" },
    ],
  },
  {
    kanji: "父", onyomi: "フ", kunyomi: ["ちち", "とう.さん"],
    meaningEn: "father", meaningId: "ayah", jlpt: "N5", strokes: 4,
    examples: [
      { word: "父", reading: "ちち", meaningEn: "father", meaningId: "ayah" },
    ],
  },
  {
    kanji: "私", onyomi: "シ", kunyomi: ["わたし", "わたくし"],
    meaningEn: "I, private", meaningId: "saya", jlpt: "N5", strokes: 7,
    examples: [
      { word: "私", reading: "わたし", meaningEn: "I", meaningId: "saya" },
    ],
  },
  {
    kanji: "今", onyomi: "コン", kunyomi: ["いま"],
    meaningEn: "now", meaningId: "sekarang", jlpt: "N5", strokes: 4,
    examples: [
      { word: "今", reading: "いま", meaningEn: "now", meaningId: "sekarang" },
    ],
  },
  {
    kanji: "毎", onyomi: "マイ", kunyomi: ["ごと", "ごと.に"],
    meaningEn: "every", meaningId: "setiap", jlpt: "N5", strokes: 6,
    examples: [
      { word: "毎日", reading: "まいにち", meaningEn: "every day", meaningId: "setiap hari" },
    ],
  },
  {
    kanji: "外", onyomi: "ガイ", kunyomi: ["そと", "はず.す", "ほか"],
    meaningEn: "outside", meaningId: "luar", jlpt: "N5", strokes: 5,
    examples: [
      { word: "外国", reading: "がいこく", meaningEn: "foreign country", meaningId: "luar negeri" },
    ],
  },
  {
    kanji: "内", onyomi: "ナイ", kunyomi: ["うち"],
    meaningEn: "inside", meaningId: "dalam", jlpt: "N5", strokes: 4,
    examples: [
      { word: "内", reading: "うち", meaningEn: "inside, home", meaningId: "dalam, rumah" },
    ],
  },
  {
    kanji: "右", onyomi: "ウ", kunyomi: ["みぎ"],
    meaningEn: "right", meaningId: "kanan", jlpt: "N5", strokes: 5,
    examples: [
      { word: "右", reading: "みぎ", meaningEn: "right", meaningId: "kanan" },
    ],
  },
  {
    kanji: "左", onyomi: "サ", kunyomi: ["ひだり"],
    meaningEn: "left", meaningId: "kiri", jlpt: "N5", strokes: 5,
    examples: [
      { word: "左", reading: "ひだり", meaningEn: "left", meaningId: "kiri" },
    ],
  },
  {
    kanji: "前", onyomi: "ゼン", kunyomi: ["まえ"],
    meaningEn: "before, front", meaningId: "depan, sebelum", jlpt: "N5", strokes: 9,
    examples: [
      { word: "前", reading: "まえ", meaningEn: "front, before", meaningId: "depan" },
    ],
  },
  {
    kanji: "後", onyomi: "ゴ", kunyomi: ["うし.ろ", "あと", "のち"],
    meaningEn: "behind, after", meaningId: "belakang, sesudah", jlpt: "N5", strokes: 9,
    examples: [
      { word: "後ろ", reading: "うしろ", meaningEn: "behind", meaningId: "belakang" },
    ],
  },
  {
    kanji: "間", onyomi: "カン", kunyomi: ["あいだ", "ま"],
    meaningEn: "between, interval", meaningId: "antara, selang", jlpt: "N5", strokes: 12,
    examples: [
      { word: "時間", reading: "じかん", meaningEn: "time", meaningId: "waktu" },
    ],
  },
  {
    kanji: "午", onyomi: "ゴ", kunyomi: ["うま"],
    meaningEn: "noon, horse", meaningId: "siang, kuda", jlpt: "N5", strokes: 4,
    examples: [
      { word: "午前", reading: "ごぜん", meaningEn: "morning/AM", meaningId: "pagi" },
      { word: "午後", reading: "ごご", meaningEn: "afternoon/PM", meaningId: "siang/sore" },
    ],
  },
  {
    kanji: "語", onyomi: "ゴ", kunyomi: ["かた.る"],
    meaningEn: "language", meaningId: "bahasa", jlpt: "N5", strokes: 14,
    examples: [
      { word: "英語", reading: "えいご", meaningEn: "English", meaningId: "bahasa Inggris" },
    ],
  },
  {
    kanji: "雨", onyomi: "ウ", kunyomi: ["あめ", "あま"],
    meaningEn: "rain", meaningId: "hujan", jlpt: "N5", strokes: 8,
    examples: [
      { word: "雨", reading: "あめ", meaningEn: "rain", meaningId: "hujan" },
    ],
  },
  {
    kanji: "花", onyomi: "カ", kunyomi: ["はな"],
    meaningEn: "flower", meaningId: "bunga", jlpt: "N5", strokes: 7,
    examples: [
      { word: "花", reading: "はな", meaningEn: "flower", meaningId: "bunga" },
    ],
  },
  {
    kanji: "空", onyomi: "クウ", kunyomi: ["そら", "あ.く", "から"],
    meaningEn: "sky, empty", meaningId: "langit, kosong", jlpt: "N5", strokes: 8,
    examples: [
      { word: "空", reading: "そら", meaningEn: "sky", meaningId: "langit" },
    ],
  },
  {
    kanji: "海", onyomi: "カイ", kunyomi: ["うみ"],
    meaningEn: "sea, ocean", meaningId: "laut", jlpt: "N5", strokes: 10,
    examples: [
      { word: "海", reading: "うみ", meaningEn: "sea", meaningId: "laut" },
    ],
  },
  {
    kanji: "雪", onyomi: "セツ", kunyomi: ["ゆき"],
    meaningEn: "snow", meaningId: "salju", jlpt: "N5", strokes: 11,
    examples: [
      { word: "雪", reading: "ゆき", meaningEn: "snow", meaningId: "salju" },
    ],
  },
];
