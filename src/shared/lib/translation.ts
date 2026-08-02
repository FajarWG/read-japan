const ID_DICTIONARY: Record<string, string> = {
  // Common Nouns
  school: "sekolah",
  student: "murid / siswa",
  teacher: "guru",
  book: "buku",
  friend: "teman",
  person: "orang",
  human: "manusia",
  child: "anak",
  father: "ayah",
  mother: "ibu",
  house: "rumah",
  car: "mobil",
  water: "air",
  fire: "api",
  tree: "pohon",
  wood: "kayu",
  gold: "emas",
  money: "uang",
  earth: "bumi / tanah",
  soil: "tanah",
  sun: "matahari",
  day: "hari",
  moon: "bulan",
  month: "bulan",
  year: "tahun",
  time: "waktu",
  hour: "jam",
  minute: "menit",
  second: "detik",
  weather: "cuaca",
  rain: "hujan",
  snow: "salju",
  wind: "angin",
  mountain: "gunung",
  river: "sungai",
  sea: "laut",
  ocean: "samudra",
  sky: "langit",
  flower: "bunga",
  dog: "anjing",
  cat: "kucing",
  bird: "burung",
  fish: "ikan",
  food: "makanan",
  rice: "nasi / beras",
  meat: "daging",
  bread: "roti",
  tea: "teh",
  coffee: "kopi",

  // Verbs
  study: "belajar",
  learn: "mempelajari",
  read: "membaca",
  write: "menulis",
  speak: "berbicara",
  talk: "berbicara",
  listen: "mendengar",
  hear: "mendengar",
  see: "melihat",
  look: "melihat",
  watch: "menonton",
  eat: "makan",
  drink: "minum",
  go: "pergi",
  come: "datang",
  return: "kembali / pulang",
  walk: "berjalan",
  run: "berlari",
  buy: "membeli",
  sell: "menjual",
  make: "membuat",
  create: "menciptakan",
  do: "melakukan",
  take: "mengambil",
  give: "memberi",
  meet: "bertemu",
  wait: "menunggu",
  sleep: "tidur",
  wake: "bangun",

  // Adjectives & Feelings
  big: "besar",
  large: "besar",
  small: "kecil",
  little: "kecil",
  new: "baru",
  old: "lama / tua",
  good: "baik / bagus",
  bad: "buruk",
  high: "tinggi",
  expensive: "mahal",
  cheap: "murah",
  fast: "cepat",
  slow: "lambat",
  hot: "panas",
  cold: "dingin",
  warm: "hangat",
  cool: "sejuk",
  happy: "senang",
  sad: "sedih",
  love: "cinta / menyukai",
  like: "suka",
  hate: "benci",
  beautiful: "cantik / indah",
  difficult: "sulit / susah",
  easy: "mudah",

  // Numbers & Positions
  one: "satu",
  two: "dua",
  three: "tiga",
  four: "empat",
  five: "lima",
  six: "enam",
  seven: "tujuh",
  eight: "delapan",
  nine: "sembilan",
  ten: "sepuluh",
  hundred: "ratus",
  thousand: "ribu",
  left: "kiri",
  right: "kanan",
  top: "atas",
  above: "di atas",
  bottom: "bawah",
  under: "di bawah",
  front: "depan",
  back: "belakang",
  inside: "dalam",
  outside: "luar",
};

export function translateWordToIndonesian(word: string): string {
  if (!word) return "";
  const lower = word.toLowerCase().trim();
  if (ID_DICTIONARY[lower]) {
    return ID_DICTIONARY[lower];
  }
  return word;
}

export function translateSentenceToIndonesian(text: string): string {
  if (!text) return "";
  let translated = text;

  // Replace matched dictionary keys surrounded by word boundaries
  for (const [eng, idn] of Object.entries(ID_DICTIONARY)) {
    const regex = new RegExp(`\\b${eng}\\b`, "gi");
    translated = translated.replace(regex, idn);
  }

  return translated;
}
