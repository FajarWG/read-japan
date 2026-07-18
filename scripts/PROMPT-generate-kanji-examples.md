# Prompt: Generate `kanji_tamago_examples.json`

Salin prompt di bawah ke LLM-mu, lalu **lampirkan isi file `src/helper/kanji_tamago.json`** sebagai input.
Simpan hasilnya sebagai `src/helper/kanji_tamago_examples.json`.

---

Kamu adalah editor kamus Jepang. Aku beri kamu data JSON berisi daftar kanji/kata dari buku pelajaran (field `moji` = karakter, `yomi` = cara baca, `imi` = arti dalam Bahasa Indonesia).

Tugasmu: untuk **setiap** `moji` unik di data, buat daftar **contoh kata Jepang nyata yang memakai karakter tersebut**, sebagai output JSON.

## Format output (WAJIB persis begini)

Sebuah objek JSON tunggal: key = `moji` (karakter aslinya, disalin apa adanya), value = array contoh:

```json
{
  "語": [
    { "word": "英語", "yomi": "えいご", "imi": "bahasa Inggris" },
    { "word": "言語", "yomi": "げんご", "imi": "bahasa (linguistik)" }
  ],
  "私": [
    { "word": "私立", "yomi": "しりつ", "imi": "swasta (sekolah/lembaga)" }
  ]
}
```

- `word` = kata Jepang (kanji/campuran) yang MENGANDUNG `moji`.
- `yomi` = cara baca dalam **hiragana saja** (tanpa romaji).
- `imi` = arti dalam **Bahasa Indonesia** yang singkat.

## Aturan isi

1. **Sebanyak yang benar-benar berguna & umum** — jangan dibatasi 2–3. Kalau kanji punya banyak kata umum, cantumkan semuanya yang wajar (idealnya 2–6, kata-kata yang sering muncul di level pemula–menengah).
2. **Runtuhkan pola berulang jadi 1 wakil.** Jika sebuah kanji membentuk deret kata yang cuma beda satu unsur (contoh: `語` → 日本語, 英語, ミャンマー語, インドネシア語, …; `人` → アメリカ人, 日本人, …; `月` → 一月, 二月, 三月, …), **cukup beri SATU contoh wakil** (mis. hanya `英語`, atau hanya `日本人`, atau hanya `一月`). Jangan daftarkan semua variasi negara/angka/bulan.
3. Untuk `moji` yang sudah berupa kata majemuk (mis. `学生`), beri contoh **kata lain** yang memakai kanji penyusunnya (mis. 大学, 学校, 先生) — bukan mengulang kata itu sendiri.
4. Utamakan kata yang **umum & natural**, bukan istilah langka.
5. Kalau sebuah `moji` sulit dicari contoh lain yang wajar, boleh beri array kosong `[]` atau 1 contoh saja — jangan mengarang kata yang tidak ada.
6. Abaikan simbol non-kanji seperti `〜` saat mencari contoh (fokus ke bagian kanjinya).

## Output

Keluarkan **hanya** objek JSON valid, tanpa penjelasan, tanpa markdown fence. Pastikan semua `moji` dari input punya entri (boleh `[]`).
