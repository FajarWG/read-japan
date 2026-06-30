export interface GrammarPattern {
  pattern: string;
  jlpt: "N5" | "N4" | "N3" | "N2" | "N1";
  descEn: string;
  descId: string;
  exampleJp: string;
  exampleKana: string;
  exampleEn: string;
  exampleId: string;
}

export interface ConjugationGuideData {
  formKey: string;
  purposeEn: string;
  purposeId: string;
  rules: {
    group1: { patternEn: string; patternId: string; examples: { base: string; conj: string; romaji: string }[] };
    group2: { patternEn: string; patternId: string; examples: { base: string; conj: string; romaji: string }[] };
    group3: { patternEn: string; patternId: string; examples: { base: string; conj: string; romaji: string }[] };
  };
  mistake?: {
    titleEn: string;
    titleId: string;
    descEn: string;
    descId: string;
    examples: { bad: string; good: string; noteEn: string; noteId: string }[];
  };
  grammarPatterns: GrammarPattern[];
}

export const CONJUGATION_GUIDES: Record<string, ConjugationGuideData> = {
  dictionary: {
    formKey: "dictionary",
    purposeEn: "The base form of all verbs. It is how verbs are listed in dictionaries, and represents the present or future tense in casual speech.",
    purposeId: "Bentuk dasar dari semua kata kerja. Ini adalah bentuk kata kerja yang terdaftar di kamus, dan mewakili waktu sekarang atau masa depan dalam percakapan kasual.",
    rules: {
      group1: {
        patternEn: "Ends in -u sounds (u, tsu, ru, mu, bu, nu, ku, gu, su).",
        patternId: "Berakhiran dengan vokal -u (u, tsu, ru, mu, bu, nu, ku, gu, su).",
        examples: [
          { base: "買う", conj: "かう (kau)", romaji: "to buy" },
          { base: "話す", conj: "はなす (hanasu)", romaji: "to speak" },
        ]
      },
      group2: {
        patternEn: "Ends in -iru or -eru.",
        patternId: "Berakhiran dengan -iru atau -eru.",
        examples: [
          { base: "食べる", conj: "たべる (taberu)", romaji: "to eat" },
          { base: "見る", conj: "みる (miru)", romaji: "to see" },
        ]
      },
      group3: {
        patternEn: "Irregular verbs.",
        patternId: "Kata kerja tidak beraturan.",
        examples: [
          { base: "する", conj: "する (suru)", romaji: "to do" },
          { base: "来る", conj: "くる (kuru)", romaji: "to come" },
        ]
      }
    },
    grammarPatterns: [
      {
        pattern: "～ことができる",
        jlpt: "N4",
        descEn: "Expresses ability or possibility to do something.",
        descId: "Menyatakan kemampuan atau kemungkinan untuk melakukan sesuatu.",
        exampleJp: "日本語を話すことができます。",
        exampleKana: "にほんごをはなすことができます。",
        exampleEn: "I can speak Japanese.",
        exampleId: "Saya bisa berbicara bahasa Jepang."
      },
      {
        pattern: "～ことになる",
        jlpt: "N3",
        descEn: "Expresses that a decision has been made (usually by external factors/rules).",
        descId: "Menyatakan bahwa suatu keputusan telah ditetapkan (biasanya oleh faktor luar/peraturan).",
        exampleJp: "来月から日本へ出張することになりました。",
        exampleKana: "らいげつからにほんへしゅっちょうすることになりました。",
        exampleEn: "It has been decided that I will go on a business trip to Japan next month.",
        exampleId: "Telah diputuskan bahwa saya akan dinas ke Jepang mulai bulan depan."
      },
      {
        pattern: "～ことにする",
        jlpt: "N3",
        descEn: "Expresses a personal decision to do or not do something.",
        descId: "Menyatakan keputusan pribadi untuk melakukan atau tidak melakukan sesuatu.",
        exampleJp: "毎日３０分歩くことにします。",
        exampleKana: "まいにち３０ぷんあるくことにします。",
        exampleEn: "I decided to walk for 30 minutes every day.",
        exampleId: "Saya memutuskan untuk berjalan kaki 30 menit setiap hari."
      },
      {
        pattern: "～ことはない",
        jlpt: "N2",
        descEn: "Indicates that there is no need or obligation to do something.",
        descId: "Menunjukkan bahwa tidak ada kebutuhan atau kewajiban untuk melakukan sesuatu.",
        exampleJp: "心配することはありませんよ。",
        exampleKana: "しんぱいすることはありませんよ。",
        exampleEn: "There is no need to worry.",
        exampleId: "Tidak perlu khawatir kok."
      },
      {
        pattern: "～こと",
        jlpt: "N5",
        descEn: "Turns a verb into a noun clause (nominalization).",
        descId: "Mengubah kata kerja menjadi frasa kata benda (nominalisasi).",
        exampleJp: "私の趣味は映画を見ることです。",
        exampleKana: "わたしのしゅみはえいがをみることです。",
        exampleEn: "My hobby is watching movies.",
        exampleId: "Hobi saya adalah menonton film."
      },
      {
        pattern: "～前に (～まえに)",
        jlpt: "N5",
        descEn: "Indicates that action A happens before action B.",
        descId: "Menunjukkan bahwa tindakan A terjadi sebelum tindakan B.",
        exampleJp: "ご飯を食べる前に、薬を飲みます。",
        exampleKana: "ごはんをたべるまえに、くすりをのみます。",
        exampleEn: "Before eating a meal, I take medicine.",
        exampleId: "Sebelum makan nasi, saya minum obat."
      },
      {
        pattern: "～と",
        jlpt: "N4",
        descEn: "Indicates a natural consequence or conditional ('When/If you do X, Y happens').",
        descId: "Menunjukkan konsekuensi alami atau pengandaian ('Ketika/Jika melakukan X, Y akan terjadi').",
        exampleJp: "このボタンを押すと、水が出ます。",
        exampleKana: "このぼたんをおすと、みずがでます。",
        exampleEn: "When you press this button, water comes out.",
        exampleId: "Jika menekan tombol ini, air akan keluar."
      },
      {
        pattern: "～と思う (意見・推量)",
        jlpt: "N5",
        descEn: "Expresses a personal opinion or conjecture ('I think that...').",
        descId: "Menyatakan pendapat pribadi atau dugaan ('Saya pikir/kira...').",
        exampleJp: "東京の地下鉄は複雑だと思います。",
        exampleKana: "とうきょうのちかてつはふくざつだとおモいます。",
        exampleEn: "I think Tokyo's subway system is complicated.",
        exampleId: "Saya pikir kereta bawah tanah Tokyo rumit."
      },
      {
        pattern: "～と言う (～という)",
        jlpt: "N5",
        descEn: "Used to report someone's words or quote a phrase ('to say that...').",
        descId: "Digunakan untuk melaporkan perkataan seseorang atau mengutip sebuah frasa ('mengatakan bahwa...').",
        exampleJp: "「おいしい」は英語で「delicious」と言います。",
        exampleKana: "「おいしい」はえいごで「delicious」といいます。",
        exampleEn: "'Oishii' is said as 'delicious' in English.",
        exampleId: "「Oishii」 dalam bahasa Inggris diucapkan 「delicious」."
      },
      {
        pattern: "～そうだ (伝聞)",
        jlpt: "N4",
        descEn: "Expresses hearsay or reports information heard from another source ('I heard that...').",
        descId: "Menyatakan kabar angin atau melaporkan informasi yang didengar dari sumber lain ('Kabarnya...', 'Katanya...').",
        exampleJp: "明日、台風が来るそうです。",
        exampleKana: "あした、たいふうがくるそうです。",
        exampleEn: "I heard that a typhoon is coming tomorrow.",
        exampleId: "Kabarnya besok topan akan datang."
      },
      {
        pattern: "～とき (辞書形)",
        jlpt: "N5",
        descEn: "Indicates the time when an action takes place.",
        descId: "Menunjukkan waktu ketika suatu tindakan terjadi.",
        exampleJp: "料理を作るとき、本を見ます。",
        exampleKana: "りょうりをつくるとき、ほんをみます。",
        exampleEn: "When I make a dish, I look at a book.",
        exampleId: "Ketika membuat masakan, saya melihat buku."
      },
      {
        pattern: "～名詞 (修飾 - 辞書形)",
        jlpt: "N5",
        descEn: "Modifies a noun using a verb in dictionary form.",
        descId: "Memodifikasi kata benda menggunakan kata kerja bentuk kamus.",
        exampleJp: "これは私がよく読む雑誌です。",
        exampleKana: "これはわたしがよくよむざっしです。",
        exampleEn: "This is a magazine that I read often.",
        exampleId: "Ini adalah majalah yang sering saya baca."
      }
    ]
  },
  masu: {
    formKey: "masu",
    purposeEn: "The polite form of Japanese verbs, used to speak respectfully to teachers, strangers, coworkers, or in business contexts.",
    purposeId: "Bentuk sopan dari kata kerja bahasa Jepang, digunakan saat berbicara dengan guru, orang asing, rekan kerja, atau dalam konteks bisnis.",
    rules: {
      group1: {
        patternEn: "Change the final -u sound to -i and add ます (masu).",
        patternId: "Ubah vokal akhiran -u menjadi vokal -i lalu tambahkan ます (masu).",
        examples: [
          { base: "書く (kaku)", conj: "書き + ます → 書きます (kakimasu)", romaji: "to write" },
          { base: "読む (yomu)", conj: "読み + ます → 読めます (yomimasu)", romaji: "to read" }
        ]
      },
      group2: {
        patternEn: "Remove る (ru) and add ます (masu).",
        patternId: "Hilangkan akhiran る (ru) lalu tambahkan ます (masu).",
        examples: [
          { base: "食べる (taberu)", conj: "食べ + ます → 食べます (tabemasu)", romaji: "to eat" },
          { base: "起きる (okiru)", conj: "起き + ます → 起きます (okimasu)", romaji: "to wake up" }
        ]
      },
      group3: {
        patternEn: "Irregular stems change.",
        patternId: "Perubahan kata kerja tidak beraturan.",
        examples: [
          { base: "する (suru)", conj: "します (shimasu)", romaji: "to do" },
          { base: "来る (kuru)", conj: "来ます (きます - kimasu)", romaji: "to come" }
        ]
      }
    },
    grammarPatterns: [
      {
        pattern: "～ながら",
        jlpt: "N4",
        descEn: "Indicates doing two actions simultaneously.",
        descId: "Menunjukkan melakukan dua pekerjaan secara bersamaan.",
        exampleJp: "音楽を聞きながら勉強します。",
        exampleKana: "おんがくをききながらべんきょうします。",
        exampleEn: "I study while listening to music.",
        exampleId: "Saya belajar sambil mendengarkan musik."
      },
      {
        pattern: "～たい",
        jlpt: "N5",
        descEn: "Expresses desire to do something.",
        descId: "Menyatakan keinginan untuk melakukan sesuatu.",
        exampleJp: "ラーメンを食べたいです。",
        exampleKana: "らーめんをたべたいです。",
        exampleEn: "I want to eat ramen.",
        exampleId: "Saya ingin makan ramen."
      },
      {
        pattern: "～やすい / ～にくい",
        jlpt: "N4",
        descEn: "Expresses that something is easy or difficult to do.",
        descId: "Menyatakan bahwa sesuatu mudah atau sulit dilakukan.",
        exampleJp: "このペンは書きやすいです。",
        exampleKana: "このぺんはかきやすいです。",
        exampleEn: "This pen is easy to write with.",
        exampleId: "Pena ini mudah ditulis."
      },
      {
        pattern: "～ます / ～ません",
        jlpt: "N5",
        descEn: "Expresses polite present or future action/state.",
        descId: "Menyatakan tindakan atau keadaan masa kini atau masa depan dalam bentuk sopan.",
        exampleJp: "アンナさんは毎日、朝ご飯を食べますか。 —— いいえ、食べません。",
        exampleKana: "アンナさんはまいにち、あさごはんをたべますか。 —— いいえ、たべません。",
        exampleEn: "Does Anna eat breakfast every day? —— No, she does not.",
        exampleId: "Apakah Anna makan sarapan setiap hari? —— Tidak, dia tidak makan sarapan."
      },
      {
        pattern: "～ました / ～ませんでした",
        jlpt: "N5",
        descEn: "Expresses polite past action/state.",
        descId: "Menyatakan tindakan atau keadaan masa lampau dalam bentuk sopan.",
        exampleJp: "昨日、勉強しませんでした。",
        exampleKana: "きのう、べんきょうしませんでした。",
        exampleEn: "Yesterday, I did not study.",
        exampleId: "Kemarin, saya tidak belajar."
      },
      {
        pattern: "～に行きます / 来ます / 帰ります",
        jlpt: "N5",
        descEn: "Expresses the purpose of going, coming, or returning to a place.",
        descId: "Menyatakan tujuan pergi, datang, atau pulang ke suatu tempat.",
        exampleJp: "週末、友達と渋谷へお酒を飲みに行きます。",
        exampleKana: "しゅうまつ、ともだちとしぶやへおさけをのみにいきます。",
        exampleEn: "On the weekend, I will go to Shibuya with my friend to drink alcohol.",
        exampleId: "Akhir pekan, saya pergi ke Shibuya dengan teman untuk minum alkohol."
      },
      {
        pattern: "～ませんか",
        jlpt: "N5",
        descEn: "Polite invitation or suggestion ('Won't you do...?').",
        descId: "Ajakan atau saran yang sopan ('Bagaimana kalau kita...?').",
        exampleJp: "今晩、一緒にご飯を食べに行きませんか。",
        exampleKana: "こんばん、いっしょにごはんをたべにいきませんか。",
        exampleEn: "Would you like to go eat a meal together tonight?",
        exampleId: "Bagaimana kalau malam ini kita pergi makan bersama?"
      },
      {
        pattern: "～ましょう",
        jlpt: "N5",
        descEn: "Polite proposal or agreement ('Let's do...').",
        descId: "Ajakan atau kesepakatan yang sopan ('Mari kita...').",
        exampleJp: "5時に会いましょう。",
        exampleKana: "ごじにあいましょう。",
        exampleEn: "Let's meet at 5 o'clock.",
        exampleId: "Mari bertemu jam 5."
      },
      {
        pattern: "～ましょうか",
        jlpt: "N5",
        descEn: "Offering to do something for the listener ('Shall I do...?').",
        descId: "Menawarkan bantuan untuk melakukan sesuatu ('Bagaimana jika saya bantu...?').",
        exampleJp: "手伝いましょうか。",
        exampleKana: "てつだいまようか。",
        exampleEn: "Shall I help you?",
        exampleId: "Bagaimana kalau saya bantu?"
      },
      {
        pattern: "～方 (～かた)",
        jlpt: "N4",
        descEn: "Expresses the way or method of doing something.",
        descId: "Menyatakan cara atau metode melakukan sesuatu.",
        exampleJp: "料理の作り方を教えてください。",
        exampleKana: "りょうりのつくりかたをおしえてください。",
        exampleEn: "Please teach me how to make this dish.",
        exampleId: "Tolong ajarkan saya cara membuat masakan ini."
      }
    ]
  },
  te: {
    formKey: "te",
    purposeEn: "A versatile conjugation used to link sentences together, request actions, and create complex aspect and mood structures.",
    purposeId: "Konjugasi serbaguna yang digunakan untuk menyambung kalimat, memohon tindakan, dan menyusun aspek serta nuansa tata bahasa kompleks.",
    rules: {
      group1: {
        patternEn: "う/つ/る → って, む/ぶ/ぬ → んで, く → いて (except 行く → 行って), ぐ → いで, す → して.",
        patternId: "う/つ/る → って, む/ぶ/ぬ → んで, く → いて (kecuali 行く → 行って), ぐ → いで, す → して.",
        examples: [
          { base: "待つ (matsu)", conj: "待って (matte)", romaji: "wait" },
          { base: "飲む (nomu)", conj: "飲んで (nonde)", romaji: "drink" },
          { base: "行く (iku)", conj: "行って (itte)", romaji: "go (exception)" },
        ]
      },
      group2: {
        patternEn: "Remove る (ru) and add て (te).",
        patternId: "Hilangkan る (ru) lalu tambahkan て (te).",
        examples: [
          { base: "見る (miru)", conj: "見て (mite)", romaji: "see" },
          { base: "覚える (oboeru)", conj: "覚えて (oboete)", romaji: "remember" }
        ]
      },
      group3: {
        patternEn: "Irregular changes.",
        patternId: "Perubahan tidak beraturan.",
        examples: [
          { base: "する (suru)", conj: "して (shite)", romaji: "do" },
          { base: "来る (kuru)", conj: "来て (きて - kite)", romaji: "come" }
        ]
      }
    },
    mistake: {
      titleEn: "Confusing Godan -iru/-eru exceptions",
      titleId: "Keliru kata pengecualian Godan akhiran -iru/-eru",
      descEn: "Some verbs ending in -iru or -eru are actually Group 1 (Godan) verbs, not Group 2 (Ichidan). They conjugate using Group 1 rules (e.g. hashiru -> hashitte, NOT hashite).",
      descId: "Beberapa kata kerja berakhiran -iru atau -eru sebenarnya termasuk Golongan 1 (Godan). Konjugasinya mengikuti aturan Godan (misal: hashiru -> hashitte, BUKAN hashite).",
      examples: [
        { bad: "走る → 走て (hashite)", good: "走る → 走って (hashitte)", noteEn: "hashiru is a Godan exception.", noteId: "hashiru adalah pengecualian Godan." },
        { bad: "帰る → 帰て (kaete)", good: "帰る → 帰って (kaette)", noteEn: "kaeru is a Godan exception.", noteId: "kaeru adalah pengecualian Godan." }
      ]
    },
    grammarPatterns: [
      {
        pattern: "～てください",
        jlpt: "N5",
        descEn: "Polite request to do something.",
        descId: "Permohonan sopan untuk melakukan sesuatu.",
        exampleJp: "ここに書いてください。",
        exampleKana: "ここにかいてください。",
        exampleEn: "Please write here.",
        exampleId: "Tolong tulis di sini."
      },
      {
        pattern: "～てもいい",
        jlpt: "N5",
        descEn: "Expresses permission to do something.",
        descId: "Menyatakan izin untuk melakukan sesuatu.",
        exampleJp: "テレビを見てもいいですか。",
        exampleKana: "てれびをみてもいいですか。",
        exampleEn: "May I watch television?",
        exampleId: "Boleh kah saya menonton TV?"
      },
      {
        pattern: "～てはいけません",
        jlpt: "N5",
        descEn: "Expresses prohibition (you must not do X).",
        descId: "Menyatakan larangan keras (tidak boleh melakukan X).",
        exampleJp: "ここで写真を撮ってはいけません。",
        exampleKana: "ここでしゃしんをとってはいけません。",
        exampleEn: "You must not take photos here.",
        exampleId: "Tidak boleh mengambil foto di sini."
      },
      {
        pattern: "～ています",
        jlpt: "N4",
        descEn: "Expresses ongoing actions (continuous) or state of being.",
        descId: "Menyatakan aksi yang sedang berlangsung atau keadaan saat ini.",
        exampleJp: "今、本を読んでいます。",
        exampleKana: "いま、ほんをよんでいます。",
        exampleEn: "I am reading a book right now.",
        exampleId: "Saya sedang membaca buku sekarang."
      },
      {
        pattern: "～て、～",
        jlpt: "N5",
        descEn: "Connects multiple actions in chronological order.",
        descId: "Menghubungkan beberapa tindakan secara berurutan.",
        exampleJp: "週末、友達とご飯を食べて、映画を見ます。",
        exampleKana: "しゅうまつ、ともだちとごはんをたべて、えいがをみます。",
        exampleEn: "On the weekend, I will eat with my friend and watch a movie.",
        exampleId: "Akhir pekan, saya makan bersama teman lalu menonton film."
      },
      {
        pattern: "～てから",
        jlpt: "N5",
        descEn: "Indicates that action B happens after action A finishes.",
        descId: "Menunjukkan bahwa tindakan B terjadi setelah tindakan A selesai.",
        exampleJp: "歯を磨いてから、寝ます。",
        exampleKana: "はをみがいてから、ねます。",
        exampleEn: "After brushing my teeth, I go to sleep.",
        exampleId: "Setelah menggosok gigi, saya tidur."
      },
      {
        pattern: "まだ ～ていません",
        jlpt: "N5",
        descEn: "Expresses that an action has not been done yet.",
        descId: "Menyatakan bahwa suatu tindakan belum dilakukan.",
        exampleJp: "まだ昼ご飯を食べていません。",
        exampleKana: "まだひるごはんをたべていません。",
        exampleEn: "I have not eaten lunch yet.",
        exampleId: "Saya belum makan siang."
      },
      {
        pattern: "～てきます",
        jlpt: "N4",
        descEn: "Indicates doing an action and returning, or going somewhere to do something and coming back.",
        descId: "Menunjukkan pergi untuk melakukan sesuatu lalu kembali.",
        exampleJp: "コンビニでジュースを買ってきます。",
        exampleKana: "こんびにでじゅーすをかってきます。",
        exampleEn: "I will go buy some juice at the convenience store (and come back).",
        exampleId: "Saya pergi membeli jus di minimarket sebentar (lalu kembali)."
      },
      {
        pattern: "～ても",
        jlpt: "N5",
        descEn: "Expresses 'even if' or 'although' for concessive conditions.",
        descId: "Menyatakan 'meskipun' atau 'walaupun' untuk kondisi konsesif.",
        exampleJp: "雨が降っても、試合はあります。",
        exampleKana: "あめがふっても、しあいはあります。",
        exampleEn: "Even if it rains, there will be a match.",
        exampleId: "Meskipun hujan turun, pertandingan tetap ada."
      }
    ]
  },
  ta: {
    formKey: "ta",
    purposeEn: "Expresses past tense, completed actions, or experience in casual contexts.",
    purposeId: "Menyatakan masa lampau, tindakan yang telah selesai, atau pengalaman dalam percakapan kasual.",
    rules: {
      group1: {
        patternEn: "Follows same rules as Te-form but with た (ta) / だ (da).",
        patternId: "Mengikuti aturan yang sama dengan bentuk Te, tetapi menggunakan た (ta) / だ (da).",
        examples: [
          { base: "買う (kau)", conj: "買った (katta)", romaji: "bought" },
          { base: "読む (yomu)", conj: "読んだ (yonda)", romaji: "read (past)" }
        ]
      },
      group2: {
        patternEn: "Remove る (ru) and add た (ta).",
        patternId: "Hilangkan る (ru) lalu tambahkan た (ta).",
        examples: [
          { base: "食べる (taberu)", conj: "食べた (tabeta)", romaji: "ate" }
        ]
      },
      group3: {
        patternEn: "Irregular changes.",
        patternId: "Perubahan tidak beraturan.",
        examples: [
          { base: "する (suru)", conj: "した (shita)", romaji: "did" },
          { base: "来る (kuru)", conj: "来た (きた - kita)", romaji: "came" }
        ]
      }
    },
    grammarPatterns: [
      {
        pattern: "～たことがある",
        jlpt: "N4",
        descEn: "Indicates having the past experience of doing something.",
        descId: "Menunjukkan adanya pengalaman pernah melakukan sesuatu.",
        exampleJp: "富士山に登ったことがあります。",
        exampleKana: "ふじさんにのぼったことがあります。",
        exampleEn: "I have climbed Mt. Fuji before.",
        exampleId: "Saya pernah mendaki Gunung Fuji."
      },
      {
        pattern: "～たほうがいい",
        jlpt: "N4",
        descEn: "Gives advice (it is better to do X).",
        descId: "Memberikan nasihat/saran (lebih baik melakukan X).",
        exampleJp: "早く寝たほうがいいですよ。",
        exampleKana: "はやくねたほうがいいですよ。",
        exampleEn: "You should go to sleep early.",
        exampleId: "Lebih baik kamu tidur cepat."
      },
      {
        pattern: "～たり ～たりする",
        jlpt: "N5",
        descEn: "Lists actions as examples among others, without chronological order.",
        descId: "Menyebutkan beberapa tindakan sebagai contoh tanpa urutan kronologis.",
        exampleJp: "休みの日、家で本を読んだり音楽を聞いたりしています。",
        exampleKana: "やすみのひ、いえでほんをよんだりおんがくをきいたりしています。",
        exampleEn: "On my days off, I do things like reading books and listening to music at home.",
        exampleId: "Pada hari libur, saya membaca buku dan mendengarkan musik di rumah."
      },
      {
        pattern: "～たら",
        jlpt: "N5",
        descEn: "Indicates conditional condition ('If/When...').",
        descId: "Menunjukkan kondisi pengandaian ('Jika/Ketika...').",
        exampleJp: "時間があったら、映画を見に行きませんか。",
        exampleKana: "じかんがあったら、えいがをみにいきませんか。",
        exampleEn: "If you have time, would you like to go watch a movie?",
        exampleId: "Jika ada waktu, bagaimana kalau kita pergi menonton film?"
      },
      {
        pattern: "～とき (タ形)",
        jlpt: "N5",
        descEn: "Indicates the time when an action was completed.",
        descId: "Menunjukkan waktu ketika suatu tindakan telah selesai.",
        exampleJp: "イタリアへ行ったとき、この帽子を買いました。",
        exampleKana: "イタリアへいったとき、このぼうしをかいました。",
        exampleEn: "When I went to Italy, I bought this hat.",
        exampleId: "Ketika pergi ke Italia, saya membeli topi ini."
      },
      {
        pattern: "～名詞 (修飾 - タ形)",
        jlpt: "N5",
        descEn: "Modifies a noun using a verb in past plain form.",
        descId: "Memodifikasi kata benda menggunakan kata kerja bentuk lampau biasa.",
        exampleJp: "これは私が昨日食べたケーキです。",
        exampleKana: "これはわたしがきのうたべたケーキです。",
        exampleEn: "This is the cake that I ate yesterday.",
        exampleId: "Ini adalah kue yang saya makan kemarin."
      }
    ]
  },
  nai: {
    formKey: "nai",
    purposeEn: "The casual negative form, representing 'do not' or 'will not'. Form for casual speech and grammar extensions.",
    purposeId: "Bentuk negatif kasual, mewakili arti 'tidak melakukan'. Digunakan dalam percakapan kasual dan perluasan tata bahasa.",
    rules: {
      group1: {
        patternEn: "Change the final -u sound to -a and add ない. Verbs ending in -u change to -wa.",
        patternId: "Ubah vokal akhiran -u menjadi vokal -a lalu tambahkan ない. Kata kerja berakhiran vokal -u menjadi -wa.",
        examples: [
          { base: "書く (kaku)", conj: "書か + ない → 書かない (kakanai)", romaji: "don't write" },
          { base: "会う (au)", conj: "会わ + ない → 会わない (awanai)", romaji: "don't meet" }
        ]
      },
      group2: {
        patternEn: "Remove る (ru) and add ない (nai).",
        patternId: "Hilangkan る (ru) lalu tambahkan ない (nai).",
        examples: [
          { base: "食べる (taberu)", conj: "食べ + ない → 食べない (tabenai)", romaji: "don't eat" }
        ]
      },
      group3: {
        patternEn: "Irregular forms change.",
        patternId: "Perubahan tidak beraturan.",
        examples: [
          { base: "する (suru)", conj: "しない (shinai)", romaji: "don't do" },
          { base: "来る (kuru)", conj: "来ない (こない - konai)", romaji: "don't come" }
        ]
      }
    },
    mistake: {
      titleEn: "Negating 'aru' (to exist)",
      titleId: "Negatif dari 'aru' (ada)",
      descEn: "The verb 'aru' (ある) does not follow the standard Godan rules to become 'aranai'. Its negative form is simply 'nai' (ない).",
      descId: "Kata kerja 'aru' (ある) tidak mengikuti aturan Godan biasa menjadi 'aranai'. Bentuk negatifnya adalah 'nai' (ない).",
      examples: [
        { bad: "ある → あらない (aranai)", good: "ある → ない (nai)", noteEn: "aru directly changes to nai.", noteId: "aru langsung berubah menjadi nai." }
      ]
    },
    grammarPatterns: [
      {
        pattern: "～ないでください",
        jlpt: "N5",
        descEn: "Polite request not to do something.",
        descId: "Permohonan sopan untuk tidak melakukan sesuatu.",
        exampleJp: "写真を撮らないでください。",
        exampleKana: "しゃしんをとらないでください。",
        exampleEn: "Please do not take photos.",
        exampleId: "Tolong jangan mengambil foto."
      },
      {
        pattern: "～なければならない",
        jlpt: "N4",
        descEn: "Expresses obligation or necessity (must do).",
        descId: "Menyatakan kewajiban atau keharusan (harus melakukan).",
        exampleJp: "宿題をしなければなりません。",
        exampleKana: "しゅくだいをしなければなりません。",
        exampleEn: "I must do my homework.",
        exampleId: "Saya harus mengerjakan PR."
      },
      {
        pattern: "～なくてもいい",
        jlpt: "N4",
        descEn: "Indicates that doing something is optional (you don't have to).",
        descId: "Menunjukkan bahwa melakukan sesuatu bersifat opsional (tidak harus).",
        exampleJp: "無理して来なくてもいいですよ。",
        exampleKana: "むりしてこなくてもいいですよ。",
        exampleEn: "You don't have to push yourself to come.",
        exampleId: "Kamu tidak harus memaksakan diri datang."
      },
      {
        pattern: "～ないほうがいい",
        jlpt: "N4",
        descEn: "Gives advice not to do something (it is better not to do X).",
        descId: "Memberikan nasihat/saran untuk tidak melakukan sesuatu (lebih baik tidak melakukan X).",
        exampleJp: "あまりお酒を飲まないほうがいいです。",
        exampleKana: "あまりおさけをのまないほうがいいです。",
        exampleEn: "You should not drink too much alcohol.",
        exampleId: "Lebih baik tidak terlalu banyak minum minuman beralkohol."
      },
      {
        pattern: "～とき (ナイ形)",
        jlpt: "N5",
        descEn: "Indicates the time when an action does not take place.",
        descId: "Menunjukkan waktu ketika suatu tindakan tidak terjadi.",
        exampleJp: "アルバイトがないとき、友達と遊びます。",
        exampleKana: "アルバイトがないとき、ともだちとあそびます。",
        exampleEn: "When there is no part-time job, I play with friends.",
        exampleId: "Ketika tidak ada kerja paruh waktu, saya bermain dengan teman."
      },
      {
        pattern: "～名詞 (修飾 - ナイ形)",
        jlpt: "N5",
        descEn: "Modifies a noun using a verb in negative plain form.",
        descId: "Memodifikasi kata benda menggunakan kata kerja bentuk negatif biasa.",
        exampleJp: "行かない場所を教えてください。",
        exampleKana: "いかないばしょをおしえてください。",
        exampleEn: "Please tell me the places you do not go to.",
        exampleId: "Tolong beri tahu saya tempat yang tidak kamu datangi."
      }
    ]
  },
  potential: {
    formKey: "potential",
    purposeEn: "Expresses ability, capability, or permission to perform an action (e.g., 'can do', 'able to eat').",
    purposeId: "Menyatakan kemampuan, kesanggupan, atau izin untuk melakukan tindakan (misal: 'bisa melakukan', 'bisa makan').",
    rules: {
      group1: {
        patternEn: "Change the final -u sound to -e and add る (ru).",
        patternId: "Ubah vokal akhiran -u menjadi vokal -e lalu tambahkan る (ru).",
        examples: [
          { base: "話す (hanasu)", conj: "話せ + る → 話せる (hanaseru)", romaji: "can speak" },
          { base: "飲む (nomu)", conj: "飲め + る → 飲める (nomeru)", romaji: "can drink" }
        ]
      },
      group2: {
        patternEn: "Remove る (ru) and add られる (rareru). In casual speech, ら is often dropped (called ra-nuki: ~eru).",
        patternId: "Hilangkan る (ru) lalu tambahkan られる (rareru). Dalam ragam kasual, ら sering dihilangkan (ra-nuki: ~eru).",
        examples: [
          { base: "食べる (taberu)", conj: "食べられる (taberareru) / 食べれる", romaji: "can eat" }
        ]
      },
      group3: {
        patternEn: "Irregular modifications.",
        patternId: "Perubahan tidak beraturan.",
        examples: [
          { base: "する (suru)", conj: "できる (dekiru)", romaji: "can do" },
          { base: "来る (kuru)", conj: "来られる (こられる - korareru)", romaji: "can come" }
        ]
      }
    },
    grammarPatterns: [
      {
        pattern: "～（可能形）ようになる",
        jlpt: "N4",
        descEn: "Indicates reaching the point where one becomes able to do something.",
        descId: "Menunjukkan pencapaian di mana seseorang mulai menjadi bisa melakukan sesuatu.",
        exampleJp: "練習して、泳げるようになりました。",
        exampleKana: "れんしゅうして、およげるようになりました。",
        exampleEn: "After practicing, I became able to swim.",
        exampleId: "Setelah berlatih, saya menjadi bisa berenang."
      }
    ]
  },
  volitional: {
    formKey: "volitional",
    purposeEn: "A casual invitation or self-suggestion, equivalent to 'Let's' or 'Shall we' in English (e.g., 'let's go', 'let's eat').",
    purposeId: "Ajakan atau saran kasual kepada diri sendiri/orang lain, setara dengan 'Mari kita' atau 'Ayo' (misal: 'ayo pergi', 'mari makan').",
    rules: {
      group1: {
        patternEn: "Change the final -u sound to -o and add う (u).",
        patternId: "Ubah vokal akhiran -u menjadi vokal -o lalu tambahkan う (u).",
        examples: [
          { base: "行く (iku)", conj: "行こ + う → 行こう (ikou)", romaji: "let's go" },
          { base: "話す (hanasu)", conj: "話そ + う → 話そう (hanasou)", romaji: "let's talk" }
        ]
      },
      group2: {
        patternEn: "Remove る (ru) and add よう (you).",
        patternId: "Hilangkan る (ru) lalu tambahkan よう (you).",
        examples: [
          { base: "食べる (taberu)", conj: "食べよう (tabeyou)", romaji: "let's eat" }
        ]
      },
      group3: {
        patternEn: "Irregular changes.",
        patternId: "Perubahan tidak beraturan.",
        examples: [
          { base: "する (suru)", conj: "しよう (shiyou)", romaji: "let's do" },
          { base: "来る (kuru)", conj: "来よう (こよう - koyou)", romaji: "let's come" }
        ]
      }
    },
    grammarPatterns: [
      {
        pattern: "～（意向形）と思う",
        jlpt: "N4",
        descEn: "Expresses a subjective intention or plan to do something.",
        descId: "Menyatakan niat subjektif atau rencana untuk melakukan sesuatu.",
        exampleJp: "来年、日本へ留学しようと思っています。",
        exampleKana: "らいねん、にほんへりゅうがくしようとおもっています。",
        exampleEn: "I am thinking of studying abroad in Japan next year.",
        exampleId: "Saya berniat untuk kuliah di Jepang tahun depan."
      }
    ]
  },
  imperative: {
    formKey: "imperative",
    purposeEn: "A commanding form expressing strong, direct orders. Often used by authority figures, in slogans, or emergencies.",
    purposeId: "Bentuk perintah tegas yang mengekspresikan instruksi langsung secara keras. Sering dipakai oleh figur otoritas, slogan, atau situasi darurat.",
    rules: {
      group1: {
        patternEn: "Change the final -u sound to -e.",
        patternId: "Ubah vokal akhiran -u menjadi vokal -e.",
        examples: [
          { base: "書く (kaku)", conj: "書け (kake)", romaji: "write!" },
          { base: "待つ (matsu)", conj: "待て (mate)", romaji: "wait!" }
        ]
      },
      group2: {
        patternEn: "Remove る (ru) and add ろ (ro) or よ (yo).",
        patternId: "Hilangkan る (ru) lalu tambahkan ろ (ro) atau よ (yo).",
        examples: [
          { base: "起きる (okiru)", conj: "起きろ (okiro)", romaji: "wake up!" }
        ]
      },
      group3: {
        patternEn: "Irregular modifications.",
        patternId: "Perubahan tidak beraturan.",
        examples: [
          { base: "する (suru)", conj: "しろ (shiro)", romaji: "do it!" },
          { base: "来る (kuru)", conj: "来い (こい - koi)", romaji: "come here!" }
        ]
      }
    },
    grammarPatterns: [
      {
        pattern: "～なさい",
        jlpt: "N4",
        descEn: "Polite but firm commanding form, often used by parents or teachers.",
        descId: "Bentuk perintah yang sopan tapi tegas, sering digunakan oleh orang tua atau guru.",
        exampleJp: "早く宿題をしなさい。",
        exampleKana: "はやくしゅくだいをしなさい。",
        exampleEn: "Do your homework quickly.",
        exampleId: "Cepat kerjakan PR-mu."
      }
    ]
  },
  prohibitive: {
    formKey: "prohibitive",
    purposeEn: "Expresses a direct, forceful negative command ('Do not do X'). Used mostly in casual speech by males, or on signs.",
    purposeId: "Menyatakan larangan langsung yang keras ('Jangan lakukan X'). Umumnya dipakai dalam obrolan pria, atau pada rambu-rambu.",
    rules: {
      group1: {
        patternEn: "Add な (na) to the Dictionary form.",
        patternId: "Tambahkan な (na) pada bentuk Kamus.",
        examples: [
          { base: "話す (hanasu)", conj: "話すな (hanasuna)", romaji: "don't talk!" }
        ]
      },
      group2: {
        patternEn: "Add な (na) to the Dictionary form.",
        patternId: "Tambahkan な (na) pada bentuk Kamus.",
        examples: [
          { base: "食べる (taberu)", conj: "食べるな (taberuna)", romaji: "don't eat!" }
        ]
      },
      group3: {
        patternEn: "Add な (na) to the Dictionary form.",
        patternId: "Tambahkan な (na) pada bentuk Kamus.",
        examples: [
          { base: "する (suru)", conj: "するな (suruna)", romaji: "don't do it!" },
          { base: "来る (kuru)", conj: "来るな (くるな - kuruna)", romaji: "don't come!" }
        ]
      }
    },
    grammarPatterns: [
      {
        pattern: "～てはいけない",
        jlpt: "N4",
        descEn: "Standard casual way of expressing that something is forbidden.",
        descId: "Cara kasual standar untuk menyatakan bahwa sesuatu dilarang.",
        exampleJp: "ここに入ってはいけない。",
        exampleKana: "ここにはいってはいけない。",
        exampleEn: "You shouldn't enter here.",
        exampleId: "Tidak boleh masuk ke sini."
      }
    ]
  },
  passive: {
    formKey: "passive",
    purposeEn: "Expresses passive voice (an action performed upon the subject, e.g., 'was eaten', 'was praised'). Also used for honorifics.",
    purposeId: "Menyatakan kalimat pasif (tindakan yang dikenakan pada subjek, misal: 'dimakan', 'dipuji'). Juga dipakai untuk ragam hormat.",
    rules: {
      group1: {
        patternEn: "Change the final -u sound to -a and add れる (reru). Ending -u becomes -wareru.",
        patternId: "Ubah vokal akhiran -u menjadi vokal -a lalu tambahkan れる (reru). Akhiran vokal -u menjadi -wareru.",
        examples: [
          { base: "叱る (shikaru)", conj: "叱られる (shikarareru)", romaji: "be scolded" },
          { base: "言う (iu)", conj: "言われる (iwareru)", romaji: "be told" }
        ]
      },
      group2: {
        patternEn: "Remove る (ru) and add られる (rareru).",
        patternId: "Hilangkan る (ru) lalu tambahkan られる (rareru).",
        examples: [
          { base: "ほめる (homeru)", conj: "ほめられる (homerareru)", romaji: "be praised" }
        ]
      },
      group3: {
        patternEn: "Irregular changes.",
        patternId: "Perubahan tidak beraturan.",
        examples: [
          { base: "する (suru)", conj: "される (sareru)", romaji: "be done / affected" },
          { base: "来る (kuru)", conj: "来られる (こられる - korareru)", romaji: "be visited (affected)" }
        ]
      }
    },
    grammarPatterns: [
      {
        pattern: "～（受身形）て困る / 迷惑受身",
        jlpt: "N3",
        descEn: "Indicates being troubled by someone else's passive action (suffering passive).",
        descId: "Menunjukkan keadaan terganggu oleh tindakan pasif orang lain (suffering passive).",
        exampleJp: "雨に降られて、濡れてしまいました。",
        exampleKana: "あめにふられて、ぬれてしまいました。",
        exampleEn: "I got rained on, and ended up getting wet.",
        exampleId: "Saya kehujanan, dan berakhir menjadi basah kuyup."
      }
    ]
  },
  causative: {
    formKey: "causative",
    purposeEn: "Expresses making or letting someone perform an action ('to force to do' or 'to allow to do').",
    purposeId: "Menyatakan menyuruh atau membiarkan seseorang melakukan pekerjaan ('memaksa melakukan' atau 'mengizinkan melakukan').",
    rules: {
      group1: {
        patternEn: "Change final -u sound to -a and add せる (seru). Ending -u becomes -waseru.",
        patternId: "Ubah vokal akhiran -u menjadi vokal -a lalu tambahkan せる (seru). Akhiran vokal -u menjadi -waseru.",
        examples: [
          { base: "読む (yomu)", conj: "読ませる (yomaseru)", romaji: "make someone read" }
        ]
      },
      group2: {
        patternEn: "Remove る (ru) and add させる (saseru).",
        patternId: "Hilangkan る (ru) lalu tambahkan させる (saseru).",
        examples: [
          { base: "食べる (taberu)", conj: "食べさせる (tabesaseru)", romaji: "make someone eat" }
        ]
      },
      group3: {
        patternEn: "Irregular stem changes.",
        patternId: "Perubahan tidak beraturan.",
        examples: [
          { base: "する (suru)", conj: "させる (saseru)", romaji: "make someone do" },
          { base: "来る (kuru)", conj: "来させる (こさせる - kosaseru)", romaji: "make someone come" }
        ]
      }
    },
    grammarPatterns: [
      {
        pattern: "～（使役形）てください",
        jlpt: "N3",
        descEn: "Polite request asking permission to let the speaker do something.",
        descId: "Permohonan sopan meminta izin untuk membiarkan pembicara melakukan sesuatu.",
        exampleJp: "私に紹介させてください。",
        exampleKana: "わたしにしょうかいさせてください。",
        exampleEn: "Please let me introduce.",
        exampleId: "Tolong izinkan saya memperkenalkan diri."
      }
    ]
  },
  causativePassive: {
    formKey: "causativePassive",
    purposeEn: "Expresses coercion or being forced to do an action against one's own will ('was made to do X').",
    purposeId: "Menyatakan paksaan atau dipaksa melakukan suatu pekerjaan di luar keinginan sendiri ('dibuat terpaksa melakukan X').",
    rules: {
      group1: {
        patternEn: "Change final -u sound to -a and add される (sareru). For -su ending verbs, add させられる (saserareru).",
        patternId: "Ubah vokal akhiran -u menjadi vokal -a lalu tambahkan される (sareru). Untuk kata kerja berakhiran -su, tambahkan させられる (saserareru).",
        examples: [
          { base: "書く (kaku)", conj: "書かされる (kakasareru)", romaji: "be made to write" },
          { base: "話す (hanasu)", conj: "話させられる (hanasaserareru)", romaji: "be made to talk" }
        ]
      },
      group2: {
        patternEn: "Remove る (ru) and add させられる (saserareru).",
        patternId: "Hilangkan る (ru) lalu tambahkan させられる (saserareru).",
        examples: [
          { base: "食べる (taberu)", conj: "食べさせられる (tabesaserareru)", romaji: "be made to eat" }
        ]
      },
      group3: {
        patternEn: "Irregular changes.",
        patternId: "Perubahan tidak beraturan.",
        examples: [
          { base: "する (suru)", conj: "させられる (saserareru)", romaji: "be made to do" },
          { base: "来る (kuru)", conj: "来させられる (こさせられる - kosaserareru)", romaji: "be made to come" }
        ]
      }
    },
    grammarPatterns: [
      {
        pattern: "～（使役受身）て困った",
        jlpt: "N3",
        descEn: "Expresses distress over being forced to perform an action.",
        descId: "Menyatakan kesusahan karena dipaksa melakukan suatu pekerjaan.",
        exampleJp: "昨日、お酒をたくさん飲ませられました。",
        exampleKana: "きのう、おさけをたくさんのませられました。",
        exampleEn: "Yesterday, I was forced to drink a lot of alcohol.",
        exampleId: "Kemarin, saya dipaksa meminum banyak sake."
      }
    ]
  },
  ba: {
    formKey: "ba",
    purposeEn: "A conditional conjugation equivalent to 'If...' or 'Provided that...' in English.",
    purposeId: "Konjugasi pengandaian yang setara dengan kata hubung 'Jika...' atau 'Seandainya...' dalam bahasa Indonesia.",
    rules: {
      group1: {
        patternEn: "Change the final -u sound to -e and add ば (ba).",
        patternId: "Ubah vokal akhiran -u menjadi vokal -e lalu tambahkan ば (ba).",
        examples: [
          { base: "読む (yomu)", conj: "読めば (yomeba)", romaji: "if one reads" }
        ]
      },
      group2: {
        patternEn: "Remove る (ru) and add れば (reba).",
        patternId: "Hilangkan る (ru) lalu tambahkan れば (reba).",
        examples: [
          { base: "起きる (okiru)", conj: "起きれば (okireba)", romaji: "if one wakes up" }
        ]
      },
      group3: {
        patternEn: "Irregular changes.",
        patternId: "Perubahan tidak beraturan.",
        examples: [
          { base: "する (suru)", conj: "すれば (sureba)", romaji: "if one does" },
          { base: "来る (kuru)", conj: "来れば (くれば - kureba)", romaji: "if one comes" }
        ]
      }
    },
    grammarPatterns: [
      {
        pattern: "～ば～ほど",
        jlpt: "N3",
        descEn: "Expresses 'the more X, the more Y'.",
        descId: "Menyatakan 'semakin X, semakin Y'.",
        exampleJp: "日本語は勉強すればするほど難しくなります。",
        exampleKana: "にほんごはべんきょうすればするほどむずかしくなります。",
        exampleEn: "The more you study Japanese, the more difficult it becomes.",
        exampleId: "Bahasa Jepang semakin dipelajari semakin menjadi sulit."
      },
      {
        pattern: "～ばよかった",
        jlpt: "N3",
        descEn: "Expresses regret ('I wish I had done X').",
        descId: "Menyatakan penyesalan ('Seharusnya saya melakukan X').",
        exampleJp: "もっと早く起きればよかったです。",
        exampleKana: "もっとはやくおきればよかったです。",
        exampleEn: "I wish I had woken up earlier.",
        exampleId: "Seharusnya saya bangun tidur lebih cepat."
      }
    ]
  }
};
