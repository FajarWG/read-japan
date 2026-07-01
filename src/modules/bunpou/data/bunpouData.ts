export interface BunpouExample {
  exampleJp: string;
  exampleKana: string;
  exampleEn: string;
  exampleId: string;
}

export interface BunpouPattern {
  id: string;
  pattern: string;
  jlpt: string;
  descEn: string;
  descId: string;
  examples: BunpouExample[];
}

export interface BunpouLesson {
  chapter: number;
  titleEn: string;
  titleId: string;
  patterns: BunpouPattern[];
}

export const BUNPOU_DATA: BunpouLesson[] = [
  {
    "chapter": 1,
    "titleEn": "Basic Greetings & Copula",
    "titleId": "Perkenalan Diri & Keterangan Dasar",
    "patterns": [
      {
        "id": "n1-wa-n2-desu",
        "pattern": "N1 は N2 です",
        "jlpt": "N5",
        "descEn": "Identifies N1 as N2 ('N1 is N2').",
        "descId": "Menyatakan bahwa N1 adalah N2 ('N1 adalah N2').",
        "examples": [
          {
            "exampleJp": "私は学生です。",
            "exampleKana": "わたしはがくせいです。",
            "exampleEn": "I am a student.",
            "exampleId": "Saya adalah seorang pelajar."
          },
          {
            "exampleJp": "ここは私の学校です。",
            "exampleKana": "ここはわたしのがっこうです。",
            "exampleEn": "This place is my school.",
            "exampleId": "Tempat ini adalah sekolah saya."
          },
          {
            "exampleJp": "彼は日本人です。",
            "exampleKana": "かれはにほんじんです。",
            "exampleEn": "He is Japanese.",
            "exampleId": "Dia adalah orang Jepang."
          }
        ]
      },
      {
        "id": "n1-wa-n2-desuka",
        "pattern": "N1 は N2 ですか",
        "jlpt": "N5",
        "descEn": "Asks if N1 is N2.",
        "descId": "Menanyakan apakah N1 adalah N2.",
        "examples": [
          {
            "exampleJp": "あなたは田中さんですか。",
            "exampleKana": "あなたはたなかさんですか。",
            "exampleEn": "Are you Mr./Ms. Tanaka?",
            "exampleId": "Apakah Anda Tanaka-san?"
          },
          {
            "exampleJp": "それは辞書ですか。",
            "exampleKana": "それはじしょですか。",
            "exampleEn": "Is that a dictionary?",
            "exampleId": "Apakah itu kamus?"
          },
          {
            "exampleJp": "これはあなたの本ですか。",
            "exampleKana": "これはあなたのほんですか。",
            "exampleEn": "Is this your book?",
            "exampleId": "Apakah ini buku Anda?"
          }
        ]
      },
      {
        "id": "n-wa-dochira-itsu-nandesuka",
        "pattern": "N は どちら／いつ／何ですか",
        "jlpt": "N5",
        "descEn": "Asks where / when / what N is.",
        "descId": "Menanyakan di mana / kapan / apa itu N.",
        "examples": [
          {
            "exampleJp": "トイレはどちらですか。",
            "exampleKana": "トイレはどちらですか。",
            "exampleEn": "Where is the restroom?",
            "exampleId": "Di mana toiletnya?"
          },
          {
            "exampleJp": "誕生日はいつですか。",
            "exampleKana": "たんじょうびはいつですか。",
            "exampleEn": "When is your birthday?",
            "exampleId": "Kapan ulang tahun Anda?"
          },
          {
            "exampleJp": "趣味は何ですか。",
            "exampleKana": "しゅみはなんですか。",
            "exampleEn": "What is your hobby?",
            "exampleId": "Apa hobi Anda?"
          }
        ]
      },
      {
        "id": "n1-no-n2",
        "pattern": "N1 の N2",
        "jlpt": "N5",
        "descEn": "Indicates possession, origin, or modification.",
        "descId": "Menunjukkan kepemilikan, asal, atau hubungan.",
        "examples": [
          {
            "exampleJp": "これは先生の傘です。",
            "exampleKana": "これはせんせいのかさです。",
            "exampleEn": "This is the teacher's umbrella.",
            "exampleId": "Ini adalah payung guru."
          },
          {
            "exampleJp": "私は日本の大学の学生です。",
            "exampleKana": "わたしはにほんのだいがくのがくせいです。",
            "exampleEn": "I am a student at a Japanese university.",
            "exampleId": "Saya adalah mahasiswa universitas di Jepang."
          },
          {
            "exampleJp": "それは私の友達のノートです。",
            "exampleKana": "それはわたしのともだちのノートです。",
            "exampleEn": "That is my friend's notebook.",
            "exampleId": "Itu adalah buku catatan teman saya."
          }
        ]
      },
      {
        "id": "n1-to-n2",
        "pattern": "N1 と N2",
        "jlpt": "N5",
        "descEn": "Connects nouns ('N1 and N2').",
        "descId": "Menghubungkan kata benda ('N1 dan N2').",
        "examples": [
          {
            "exampleJp": "机の上にペンとノートがあります。",
            "exampleKana": "つくえのうえにぺんとのーとがあります。",
            "exampleEn": "There is a pen and a notebook on the desk.",
            "exampleId": "Ada pulpen dan buku catatan di atas meja."
          },
          {
            "exampleJp": "私はりんごとバナナが好きです。",
            "exampleKana": "わたしはりんごとばなながすきです。",
            "exampleEn": "I like apples and bananas.",
            "exampleId": "Saya suka apel dan pisang."
          },
          {
            "exampleJp": "昨日、兄と公園へ行きました。",
            "exampleKana": "きのう、あにとこうえんへいきました。",
            "exampleEn": "I went to the park with my older brother yesterday.",
            "exampleId": "Kemarin, saya pergi ke taman bersama kakak laki-laki saya."
          }
        ]
      },
      {
        "id": "n-mo",
        "pattern": "N も",
        "jlpt": "N5",
        "descEn": "Indicates 'also' or 'too'.",
        "descId": "Menunjukkan arti 'juga' atau 'pun'.",
        "examples": [
          {
            "exampleJp": "私も日本へ行きたいです。",
            "exampleKana": "わたしもにほんへいきたいです。",
            "exampleEn": "I also want to go to Japan.",
            "exampleId": "Saya juga ingin pergi ke Jepang."
          },
          {
            "exampleJp": "コーヒーも紅茶も飲みます。",
            "exampleKana": "こーひーもこうちゃものみます。",
            "exampleEn": "I drink both coffee and tea.",
            "exampleId": "Saya minum kopi maupun teh."
          },
          {
            "exampleJp": "今日は日曜日です。休みも楽しいです。",
            "exampleKana": "きょうはにちようびです。やすみもたのしいです。",
            "exampleEn": "Today is Sunday. A day off is also fun.",
            "exampleId": "Hari ini hari Minggu. Hari libur juga menyenangkan."
          }
        ]
      }
    ]
  },
  {
    "chapter": 2,
    "titleEn": "Demonstratives & Noun Modifiers",
    "titleId": "Kata Tunjuk & Modifikasi Kata Benda",
    "patterns": [
      {
        "id": "kore-sore-are",
        "pattern": "これ／それ／あれ",
        "jlpt": "N5",
        "descEn": "Demonstrative pronouns for objects close to speaker, listener, or far from both.",
        "descId": "Kata tunjuk benda dekat pembicara, lawan bicara, atau jauh dari keduanya.",
        "examples": [
          {
            "exampleJp": "これは私の本です。",
            "exampleKana": "これはわたしのほんです。",
            "exampleEn": "This is my book.",
            "exampleId": "Ini adalah buku saya."
          },
          {
            "exampleJp": "それは何ですか。",
            "exampleKana": "それはなんですか。",
            "exampleEn": "What is that (near you)?",
            "exampleId": "Itu (yang di dekatmu) apa?"
          },
          {
            "exampleJp": "あれは学校です。",
            "exampleKana": "あれはがっこうです。",
            "exampleEn": "That (over there) is the school.",
            "exampleId": "Itu (di sana) adalah sekolah."
          }
        ]
      },
      {
        "id": "kono-sono-ano",
        "pattern": "この／その／あの N",
        "jlpt": "N5",
        "descEn": "Demonstrative determiners modifying nouns directly.",
        "descId": "Kata tunjuk yang memodifikasi kata benda secara langsung.",
        "examples": [
          {
            "exampleJp": "この傘は私のです。",
            "exampleKana": "このかさはわたしのです。",
            "exampleEn": "This umbrella is mine.",
            "exampleId": "Payung ini milik saya."
          },
          {
            "exampleJp": "そのペンは誰のですか。",
            "exampleKana": "そのぺんはだれのですか。",
            "exampleEn": "Whose pen is that?",
            "exampleId": "Pena itu milik siapa?"
          },
          {
            "exampleJp": "あの車は新しいです。",
            "exampleKana": "あのくるまはあたらしいです。",
            "exampleEn": "That car over there is new.",
            "exampleId": "Mobil itu (di sana) baru."
          }
        ]
      },
      {
        "id": "koko-soko-asoko-doko",
        "pattern": "ここ／そこ／あそこ／どこ",
        "jlpt": "N5",
        "descEn": "Demonstratives for locations (here, there, over there, where).",
        "descId": "Kata tunjuk tempat (sini, situ, sana, mana).",
        "examples": [
          {
            "exampleJp": "ここは私の部屋です。",
            "exampleKana": "ここはわたしのへやです。",
            "exampleEn": "This is my room.",
            "exampleId": "Di sini adalah kamar saya."
          },
          {
            "exampleJp": "トイレはそこです。",
            "exampleKana": "といれはそこです。",
            "exampleEn": "The restroom is there (near you).",
            "exampleId": "Toilet ada di sana (dekat Anda)."
          },
          {
            "exampleJp": "郵便局はどこですか。",
            "exampleKana": "ゆうびんきょくはどこですか。",
            "exampleEn": "Where is the post office?",
            "exampleId": "Kantor pos di mana?"
          }
        ]
      },
      {
        "id": "n-o-kudasai",
        "pattern": "N をください",
        "jlpt": "N5",
        "descEn": "Requesting an object politely ('Please give me N').",
        "descId": "Meminta barang secara sopan ('Tolong berikan N').",
        "examples": [
          {
            "exampleJp": "水をお願いします。",
            "exampleKana": "みずをおねがいします。",
            "exampleEn": "Water, please.",
            "exampleId": "Tolong berikan airnya."
          },
          {
            "exampleJp": "このパンをください。",
            "exampleKana": "このぱんをください。",
            "exampleEn": "Please give me this bread.",
            "exampleId": "Tolong berikan roti ini."
          },
          {
            "exampleJp": "メニューをください。",
            "exampleKana": "めにゅーをください。",
            "exampleEn": "Please give me the menu.",
            "exampleId": "Tolong berikan menunya."
          }
        ]
      },
      {
        "id": "ikura",
        "pattern": "いくら",
        "jlpt": "N5",
        "descEn": "Asking for the price of something ('How much?').",
        "descId": "Menanyakan harga barang ('Berapa harganya?').",
        "examples": [
          {
            "exampleJp": "この辞書はいくらですか。",
            "exampleKana": "このじしょはいくらですか。",
            "exampleEn": "How much is this dictionary?",
            "exampleId": "Berapa harga kamus ini?"
          },
          {
            "exampleJp": "そのりんごはいくらですか。",
            "exampleKana": "そのりんごはいくらですか。",
            "exampleEn": "How much is that apple?",
            "exampleId": "Berapa harga apel itu?"
          },
          {
            "exampleJp": "この靴はいくらですか。",
            "exampleKana": "このくつはいくらですか。",
            "exampleEn": "How much are these shoes?",
            "exampleId": "Berapa harga sepatu ini?"
          }
        ]
      },
      {
        "id": "nan-no-n",
        "pattern": "何の N",
        "jlpt": "N5",
        "descEn": "Asking about content or type ('What kind of N?').",
        "descId": "Menanyakan isi atau jenis ('N apa? / N tentang apa?').",
        "examples": [
          {
            "exampleJp": "それは何の雑誌ですか。",
            "exampleKana": "それはなんのざっしですか。",
            "exampleEn": "What kind of magazine is that?",
            "exampleId": "Itu majalah tentang apa?"
          },
          {
            "exampleJp": "これは何の鍵ですか。",
            "exampleKana": "これはなんのかぎですか。",
            "exampleEn": "What is this key for?",
            "exampleId": "Ini kunci untuk apa?"
          },
          {
            "exampleJp": "それは何の勉強ですか。",
            "exampleKana": "それはなんのべんきょうですか。",
            "exampleEn": "What are you studying?",
            "exampleId": "Itu belajar tentang apa?"
          }
        ]
      },
      {
        "id": "doko-no-n",
        "pattern": "どこの N",
        "jlpt": "N5",
        "descEn": "Asking about origin or manufacturer ('Where is this N made?').",
        "descId": "Menanyakan asal negara atau pembuat ('N buatan mana?').",
        "examples": [
          {
            "exampleJp": "それはどこの国の車ですか。",
            "exampleKana": "それはどこのくにのくるまですか。",
            "exampleEn": "Which country is that car from?",
            "exampleId": "Itu mobil buatan negara mana?"
          },
          {
            "exampleJp": "これはどこの会社の時計ですか。",
            "exampleKana": "これはどこのかいしゃのとけいですか。",
            "exampleEn": "Which company is this watch from?",
            "exampleId": "Ini jam tangan dari perusahaan mana?"
          },
          {
            "exampleJp": "それはどこの靴ですか。",
            "exampleKana": "それはどこのくつですか。",
            "exampleEn": "Where are those shoes from?",
            "exampleId": "Itu sepatu dari mana?"
          }
        ]
      },
      {
        "id": "dare-no-n",
        "pattern": "誰の N",
        "jlpt": "N5",
        "descEn": "Asking about ownership ('Whose N?').",
        "descId": "Menanyakan kepemilikan ('N milik siapa?').",
        "examples": [
          {
            "exampleJp": "これは誰の傘ですか。",
            "exampleKana": "これはだれのかさですか。",
            "exampleEn": "Whose umbrella is this?",
            "exampleId": "Ini payung milik siapa?"
          },
          {
            "exampleJp": "それは誰のノートですか。",
            "exampleKana": "それはだれのノートですか。",
            "exampleEn": "Whose notebook is that?",
            "exampleId": "Itu buku catatan milik siapa?"
          },
          {
            "exampleJp": "あれは誰の鞄ですか。",
            "exampleKana": "あれはだれのかばんですか。",
            "exampleEn": "Whose bag is that over there?",
            "exampleId": "Itu tas milik siapa?"
          }
        ]
      },
      {
        "id": "n-de-language",
        "pattern": "N(～語) で",
        "jlpt": "N5",
        "descEn": "Expressing something using a specific language ('in [language]').",
        "descId": "Menyatakan sesuatu menggunakan bahasa tertentu ('dalam [bahasa]').",
        "examples": [
          {
            "exampleJp": "日本語で話してください。",
            "exampleKana": "にほんごではなしてください。",
            "exampleEn": "Please speak in Japanese.",
            "exampleId": "Tolong bicara dalam bahasa Jepang."
          },
          {
            "exampleJp": "この手紙は英語で書いてあります。",
            "exampleKana": "このてがみはえいごでかいてあります。",
            "exampleEn": "This letter is written in English.",
            "exampleId": "Surat ini ditulis dalam bahasa Inggris."
          },
          {
            "exampleJp": "先生はインドネシア語で説明しました。",
            "exampleKana": "せんせいはいんどねしあごでせつめいしました。",
            "exampleEn": "The teacher explained in Indonesian.",
            "exampleId": "Guru menjelaskan dalam bahasa Indonesia."
          }
        ]
      }
    ]
  },
  {
    "chapter": 3,
    "titleEn": "Particles & Movements",
    "titleId": "Partikel & Perpindahan Tempat",
    "patterns": [
      {
        "id": "v-masu-masen",
        "pattern": "V ます／ません",
        "jlpt": "N5",
        "descEn": "Polite form of verbs (affirmative / negative).",
        "descId": "Bentuk sopan kata kerja (positif / negatif).",
        "examples": [
          {
            "exampleJp": "毎日、日本語を勉強します。",
            "exampleKana": "まいにち、にほんごをべんきょうします。",
            "exampleEn": "I study Japanese every day.",
            "exampleId": "Saya belajar bahasa Jepang setiap hari."
          },
          {
            "exampleJp": "お酒を飲みません。",
            "exampleKana": "おさけをのみません。",
            "exampleEn": "I do not drink alcohol.",
            "exampleId": "Saya tidak minum alkohol."
          },
          {
            "exampleJp": "明日、友達に会います。",
            "exampleKana": "あした、ともだちにあいます。",
            "exampleEn": "I will meet a friend tomorrow.",
            "exampleId": "Saya akan bertemu teman besok."
          }
        ]
      },
      {
        "id": "n-basho-e-ikimasu",
        "pattern": "N(場所) へ 行きます",
        "jlpt": "N5",
        "descEn": "Indicates destination or direction of movement ('go to N').",
        "descId": "Menunjukkan tempat tujuan atau arah perpindahan ('pergi ke N').",
        "examples": [
          {
            "exampleJp": "明日、学校へ行きます。",
            "exampleKana": "あした、がっこうへいきます。",
            "exampleEn": "I will go to school tomorrow.",
            "exampleId": "Besok saya pergi ke sekolah."
          },
          {
            "exampleJp": "先週、日本へ行きました。",
            "exampleKana": "せんしゅう、にほんへいきました。",
            "exampleEn": "I went to Japan last week.",
            "exampleId": "Minggu lalu saya pergi ke Jepang."
          },
          {
            "exampleJp": "一緒にデパートへ行きませんか。",
            "exampleKana": "いっしょにデパートへいきませんか。",
            "exampleEn": "Shall we go to the department store together?",
            "exampleId": "Apakah Anda mau pergi ke toserba bersama?"
          }
        ]
      },
      {
        "id": "n-o-verb",
        "pattern": "N を V",
        "jlpt": "N5",
        "descEn": "Indicates direct object of a verb.",
        "descId": "Menunjukkan objek langsung dari kata kerja.",
        "examples": [
          {
            "exampleJp": "パンを食べます。",
            "exampleKana": "パンをたべます。",
            "exampleEn": "I eat bread.",
            "exampleId": "Saya makan roti."
          },
          {
            "exampleJp": "昨日、本を読みました。",
            "exampleKana": "きのう、ほんをよみました。",
            "exampleEn": "I read a book yesterday.",
            "exampleId": "Kemarin saya membaca buku."
          },
          {
            "exampleJp": "コーヒーを飲みます。",
            "exampleKana": "コーヒーをのみます。",
            "exampleEn": "I drink coffee.",
            "exampleId": "Saya minum kopi."
          }
        ]
      },
      {
        "id": "n-time-ni",
        "pattern": "N(時間) に",
        "jlpt": "N5",
        "descEn": "Indicates specific time when action occurs.",
        "descId": "Menunjukkan waktu spesifik terjadinya suatu aksi.",
        "examples": [
          {
            "exampleJp": "七時に起きます。",
            "exampleKana": "しちじにおきます。",
            "exampleEn": "I wake up at seven o'clock.",
            "exampleId": "Saya bangun jam tujuh."
          },
          {
            "exampleJp": "日曜日に友達に会います。",
            "exampleKana": "にちようびにともだちにあいます。",
            "exampleEn": "I will meet a friend on Sunday.",
            "exampleId": "Saya akan bertemu teman pada hari Minggu."
          },
          {
            "exampleJp": "十時に寝ます。",
            "exampleKana": "じゅうじにねます。",
            "exampleEn": "I go to bed at ten o'clock.",
            "exampleId": "Saya tidur jam sepuluh."
          }
        ]
      },
      {
        "id": "n-basho-de",
        "pattern": "N(場所) で",
        "jlpt": "N5",
        "descEn": "Indicates place where action occurs.",
        "descId": "Menunjukkan tempat terjadinya suatu aksi.",
        "examples": [
          {
            "exampleJp": "私は図書館で勉強します。",
            "exampleKana": "わたしはとしょかんでべんきょうします。",
            "exampleEn": "I study at the library.",
            "exampleId": "Saya belajar di perpustakaan."
          },
          {
            "exampleJp": "公園で友達と遊びました。",
            "exampleKana": "こうえんでともだちとあそびました。",
            "exampleEn": "I played with my friend at the park.",
            "exampleId": "Saya bermain dengan teman di taman."
          },
          {
            "exampleJp": "駅で切符を買います。",
            "exampleKana": "えきできっぷをかいます。",
            "exampleEn": "I will buy a ticket at the station.",
            "exampleId": "Saya akan membeli tiket di stasiun."
          }
        ]
      },
      {
        "id": "n-kara-n-made",
        "pattern": "N から N まで",
        "jlpt": "N5",
        "descEn": "Indicates starting and ending points of time or space ('from N to N').",
        "descId": "Menunjukkan titik awal dan akhir waktu atau ruang ('dari N sampai N').",
        "examples": [
          {
            "exampleJp": "学校は八時から三時までです。",
            "exampleKana": "がっこうははちじからさんじまでです。",
            "exampleEn": "School is from 8 o'clock to 3 o'clock.",
            "exampleId": "Sekolah dari jam 8 sampai jam 3."
          },
          {
            "exampleJp": "ここから駅まで歩きます。",
            "exampleKana": "ここからえきまであるきます。",
            "exampleEn": "I will walk from here to the station.",
            "exampleId": "Saya akan berjalan kaki dari sini sampai stasiun."
          },
          {
            "exampleJp": "月曜日から金曜日まで働きます。",
            "exampleKana": "げつようびからきんようびまではたらきます。",
            "exampleEn": "I work from Monday to Friday.",
            "exampleId": "Saya bekerja dari hari Senin sampai hari Jumat."
          }
        ]
      },
      {
        "id": "n1-ya-n2-nado",
        "pattern": "N1 や N2 など",
        "jlpt": "N5",
        "descEn": "Lists nouns non-exhaustively ('N1, N2, etc.').",
        "descId": "Menyebutkan kata benda secara tidak menyeluruh ('N1, N2, dan lain-lain').",
        "examples": [
          {
            "exampleJp": "かばんの中に本やノートなどがあります。",
            "exampleKana": "かばんのなかにほんやのーとなどがあります。",
            "exampleEn": "There are books, notebooks, etc., in the bag.",
            "exampleId": "Di dalam tas ada buku, buku catatan, dan lain-lain."
          },
          {
            "exampleJp": "店でパンや牛乳などを買いました。",
            "exampleKana": "みせでぱんやぎゅうにゅうなどをかいました。",
            "exampleEn": "I bought bread, milk, etc., at the store.",
            "exampleId": "Saya membeli roti, susu, dan lain-lain di toko."
          },
          {
            "exampleJp": "部屋には机や椅子などがあります。",
            "exampleKana": "へやにはつくえやいすなどがあります。",
            "exampleEn": "There are desks, chairs, etc., in the room.",
            "exampleId": "Di dalam kamar ada meja, kursi, dan lain-lain."
          }
        ]
      },
      {
        "id": "nanimo-dokoe-mo-verb-negative",
        "pattern": "何も／どこへも V ません",
        "jlpt": "N5",
        "descEn": "Complete negation of things or destination ('nothing / nowhere').",
        "descId": "Penyangkalan menyeluruh terhadap benda atau tujuan ('tidak... apapun / kemanapun').",
        "examples": [
          {
            "exampleJp": "今日、何も食べませんでした。",
            "exampleKana": "きょう、なにもたべませんでした。",
            "exampleEn": "I didn't eat anything today.",
            "exampleId": "Hari ini saya tidak makan apa pun."
          },
          {
            "exampleJp": "日曜日はどこへも行きませんでした。",
            "exampleKana": "にちようびはどこへもいきませんでした。",
            "exampleEn": "I didn't go anywhere on Sunday.",
            "exampleId": "Hari Minggu saya tidak pergi ke mana pun."
          },
          {
            "exampleJp": "昨日の夜、何も見ませんでした。",
            "exampleKana": "きのうのよる、なにもみませんでした。",
            "exampleEn": "I didn't watch anything last night.",
            "exampleId": "Tadi malam saya tidak menonton apa pun."
          }
        ]
      }
    ]
  },
  {
    "chapter": 4,
    "titleEn": "Adjectives, Existence & Spatial Relations",
    "titleId": "Kata Sifat, Keberadaan & Arah",
    "patterns": [
      {
        "id": "n-wa-a-desu",
        "pattern": "N は A です",
        "jlpt": "N5",
        "descEn": "Adjective describing a noun.",
        "descId": "Kata sifat yang menerangkan kata benda.",
        "examples": [
          {
            "exampleJp": "この本は面白いです。",
            "exampleKana": "このほんはおもしろいです。",
            "exampleEn": "This book is interesting.",
            "exampleId": "Buku ini menarik."
          },
          {
            "exampleJp": "日本の夏は暑いです。",
            "exampleKana": "にほんのなつはあついです。",
            "exampleEn": "Summer in Japan is hot.",
            "exampleId": "Musim panas di Jepang panas."
          },
          {
            "exampleJp": "この部屋はきれいです。",
            "exampleKana": "このへやはきれいです。",
            "exampleEn": "This room is clean/beautiful.",
            "exampleId": "Kamar ini bersih/indah."
          }
        ]
      },
      {
        "id": "n-wa-i-a-kunai-na-a-ja-arimasen",
        "pattern": "イA-くないです / ナA じゃありません",
        "jlpt": "N5",
        "descEn": "Negative form of adjectives.",
        "descId": "Bentuk negatif dari kata sifat (i-adjective dan na-adjective).",
        "examples": [
          {
            "exampleJp": "昨日の映画は面白くなかったです。",
            "exampleKana": "きのうのえいがはおもしろくなかったです。",
            "exampleEn": "Yesterday's movie was not interesting.",
            "exampleId": "Film kemarin tidak menarik."
          },
          {
            "exampleJp": "この料理は辛くないです。",
            "exampleKana": "このりょうりはからくないです。",
            "exampleEn": "This food is not spicy.",
            "exampleId": "Masakan ini tidak pedas."
          },
          {
            "exampleJp": "今日は暇じゃありません。",
            "exampleKana": "きょうはひまじゃありません。",
            "exampleEn": "I am not free today.",
            "exampleId": "Hari ini saya tidak senggang."
          }
        ]
      },
      {
        "id": "a-n-modifier",
        "pattern": "イA ＋ N / ナA な ＋ N",
        "jlpt": "N5",
        "descEn": "Adjective directly modifying a noun.",
        "descId": "Kata sifat yang langsung memodifikasi kata benda di depannya.",
        "examples": [
          {
            "exampleJp": "美味しいコーヒーを飲みます。",
            "exampleKana": "おいしいこーひーをのみます。",
            "exampleEn": "I drink delicious coffee.",
            "exampleId": "Saya minum kopi yang enak."
          },
          {
            "exampleJp": "ここは静かな場所です。",
            "exampleKana": "ここはしずかなばしょです。",
            "exampleEn": "This is a quiet place.",
            "exampleId": "Ini adalah tempat yang tenang."
          },
          {
            "exampleJp": "新しい靴を買いました。",
            "exampleKana": "あたらしいくつをかいました。",
            "exampleEn": "I bought new shoes.",
            "exampleId": "Saya membeli sepatu baru."
          }
        ]
      },
      {
        "id": "n-wa-season-a-desu",
        "pattern": "N は [季節/月]、A です",
        "jlpt": "N5",
        "descEn": "Describing state of weather or seasons.",
        "descId": "Menjelaskan keadaan cuaca atau musim.",
        "examples": [
          {
            "exampleJp": "冬は寒いです。",
            "exampleKana": "ふゆはさむいです。",
            "exampleEn": "Winter is cold.",
            "exampleId": "Musim dingin itu dingin."
          },
          {
            "exampleJp": "八月は暑いです。",
            "exampleKana": "はちがつはあついです。",
            "exampleEn": "August is hot.",
            "exampleId": "Bulan Agustus itu panas."
          },
          {
            "exampleJp": "春は暖かいです。",
            "exampleKana": "はるはあたたかいです。",
            "exampleEn": "Spring is warm.",
            "exampleId": "Musim semi itu hangat."
          }
        ]
      },
      {
        "id": "totemo-sukoshi-a-desu",
        "pattern": "とても／少し A です",
        "jlpt": "N5",
        "descEn": "Degree adverbs ('very / a little').",
        "descId": "Kata keterangan penunjuk derajat ('sangat / sedikit').",
        "examples": [
          {
            "exampleJp": "この映画はとても面白いです。",
            "exampleKana": "このえいがはとてもおもしろいです。",
            "exampleEn": "This movie is very interesting.",
            "exampleId": "Film ini sangat menarik."
          },
          {
            "exampleJp": "今日は少し寒いです。",
            "exampleKana": "きょうはすこしさむいです。",
            "exampleEn": "It is a little cold today.",
            "exampleId": "Hari ini sedikit dingin."
          },
          {
            "exampleJp": "この部屋はとても広いです。",
            "exampleKana": "このへやはとてもひろいです。",
            "exampleEn": "This room is very spacious.",
            "exampleId": "Kamar ini sangat luas."
          }
        ]
      },
      {
        "id": "amari-a-kunai-ja-arimasen",
        "pattern": "あまり A くない／じゃありません",
        "jlpt": "N5",
        "descEn": "Negative modifier expressing 'not very' or 'not much'.",
        "descId": "Penyangkalan halus yang berarti 'tidak begitu / tidak terlalu'.",
        "examples": [
          {
            "exampleJp": "この本はあまり面白くないです。",
            "exampleKana": "このほんはあまりおもしろくないです。",
            "exampleEn": "This book is not very interesting.",
            "exampleId": "Buku ini tidak begitu menarik."
          },
          {
            "exampleJp": "昨日の試験はあまり難しくありませんでした。",
            "exampleKana": "きのうのしけんはあまりむずかしくありませんでした。",
            "exampleEn": "Yesterday's exam was not very difficult.",
            "exampleId": "Ujian kemarin tidak begitu sulit."
          },
          {
            "exampleJp": "この料理はあまり辛くないです。",
            "exampleKana": "このりょうりはあまりからくないです。",
            "exampleEn": "This dish is not very spicy.",
            "exampleId": "Masakan ini tidak begitu pedas."
          }
        ]
      },
      {
        "id": "n1-ni-n2-ga-arimasu-existence",
        "pattern": "N1(場所) に N2 があります",
        "jlpt": "N5",
        "descEn": "Expressing existence of inanimate objects at a location.",
        "descId": "Menyatakan keberadaan benda mati di suatu tempat.",
        "examples": [
          {
            "exampleJp": "机の上に本があります。",
            "exampleKana": "つくえのうえにほんがあります。",
            "exampleEn": "There is a book on the desk.",
            "exampleId": "Ada buku di atas meja."
          },
          {
            "exampleJp": "教室に黒板があります。",
            "exampleKana": "きょうしつにこくばんがあります。",
            "exampleEn": "There is a blackboard in the classroom.",
            "exampleId": "Ada papan tulis di dalam kelas."
          },
          {
            "exampleJp": "かばんの中に鍵があります。",
            "exampleKana": "かばんのなかにかぎがあります。",
            "exampleEn": "There is a key in the bag.",
            "exampleId": "Ada kunci di dalam tas."
          }
        ]
      },
      {
        "id": "n-wa-n-no-direction-desu",
        "pattern": "N は N の [方向] です",
        "jlpt": "N5",
        "descEn": "Specifying spatial relations (east, west, inside, etc.).",
        "descId": "Menyatakan arah posisi ruang (timur, barat, dalam, dll.).",
        "examples": [
          {
            "exampleJp": "郵便局は銀行の隣です。",
            "exampleKana": "ゆうびんきょくはぎんこうのとなりです。",
            "exampleEn": "The post office is next to the bank.",
            "exampleId": "Kantor pos ada di sebelah bank."
          },
          {
            "exampleJp": "駅は公園の北です。",
            "exampleKana": "えきはこうえんのきたです。",
            "exampleEn": "The station is north of the park.",
            "exampleId": "Stasiun ada di sebelah utara taman."
          },
          {
            "exampleJp": "猫は椅子の下です。",
            "exampleKana": "ねこはいすのしたです。",
            "exampleEn": "The cat is under the chair.",
            "exampleId": "Kucing ada di bawah kursi."
          }
        ]
      },
      {
        "id": "n1-kara-n2-made-donokurai",
        "pattern": "N1 から N2 までどのくらい",
        "jlpt": "N5",
        "descEn": "Asking about duration or distance between two locations.",
        "descId": "Menanyakan durasi atau jarak antara dua lokasi.",
        "examples": [
          {
            "exampleJp": "家から学校までどのくらいかかりますか。",
            "exampleKana": "いえからがっこうまでどのくらいかかりますか。",
            "exampleEn": "How long does it take from your house to school?",
            "exampleId": "Berapa lama waktu yang dibutuhkan dari rumah ke sekolah?"
          },
          {
            "exampleJp": "東京から大阪までどのくらいですか。",
            "exampleKana": "とうきょうからおおさかまでどのくらいですか。",
            "exampleEn": "How far is it from Tokyo to Osaka?",
            "exampleId": "Seberapa jauh jarak dari Tokyo ke Osaka?"
          },
          {
            "exampleJp": "駅まで歩いてどのくらいかかりますか。",
            "exampleKana": "えきまであるいてどのくらいかかりますか。",
            "exampleEn": "How long does it take to walk to the station?",
            "exampleId": "Berapa lama waktu yang dibutuhkan untuk berjalan kaki ke stasiun?"
          }
        ]
      },
      {
        "id": "n-norimono-de",
        "pattern": "N(乗り物) で",
        "jlpt": "N5",
        "descEn": "Indicates means of transportation ('by [transportation]').",
        "descId": "Menunjukkan sarana transportasi ('naik / dengan [kendaraan]').",
        "examples": [
          {
            "exampleJp": "私は電車で会社へ行きます。",
            "exampleKana": "わたしはでんしゃでかいしゃへいきます。",
            "exampleEn": "I go to the office by train.",
            "exampleId": "Saya pergi ke kantor dengan kereta."
          },
          {
            "exampleJp": "バスで旅行に行きましょう。",
            "exampleKana": "バスでりょこうにいきましょう。",
            "exampleEn": "Let's go on a trip by bus.",
            "exampleId": "Ayo pergi berwisata dengan bus."
          },
          {
            "exampleJp": "自転車で学校へ行きます。",
            "exampleKana": "じてんしゃでがっこうへいきます。",
            "exampleEn": "I go to school by bicycle.",
            "exampleId": "Saya pergi ke sekolah naik sepeda."
          }
        ]
      },
      {
        "id": "donna-n",
        "pattern": "どんな N",
        "jlpt": "N5",
        "descEn": "Asking for details or characteristics ('What kind of N?').",
        "descId": "Menanyakan karakteristik atau jenis ('N yang seperti apa?').",
        "examples": [
          {
            "exampleJp": "どんな食べ物が好きですか。",
            "exampleKana": "どんなたべものがすきですか。",
            "exampleEn": "What kind of food do you like?",
            "exampleId": "Makanan seperti apa yang kamu sukai?"
          },
          {
            "exampleJp": "どんな本を読んでいますか。",
            "exampleKana": "どんなほんをよんでいますか。",
            "exampleEn": "What kind of book are you reading?",
            "exampleId": "Buku seperti apa yang sedang kamu baca?"
          },
          {
            "exampleJp": "どんな町に住みたいですか。",
            "exampleKana": "どんなまちにすみたいですか。",
            "exampleEn": "What kind of town do you want to live in?",
            "exampleId": "Kota seperti apa yang ingin kamu tinggali?"
          }
        ]
      },
      {
        "id": "n-wa-dou-desuka",
        "pattern": "N はどうですか",
        "jlpt": "N5",
        "descEn": "Asking about opinion or recommendation.",
        "descId": "Menanyakan pendapat atau menawarkan sesuatu.",
        "examples": [
          {
            "exampleJp": "日本の生活はどうですか。",
            "exampleKana": "にほんのせいかつはどうですか。",
            "exampleEn": "How is life in Japan?",
            "exampleId": "Bagaimana kehidupan di Jepang?"
          },
          {
            "exampleJp": "このコーヒーはどうですか。",
            "exampleKana": "このコーヒーはどうですか。",
            "exampleEn": "How is this coffee?",
            "exampleId": "Bagaimana dengan kopi ini?"
          },
          {
            "exampleJp": "今日の天気はどうですか。",
            "exampleKana": "きょうのてんきはどうですか。",
            "exampleEn": "How is the weather today?",
            "exampleId": "Bagaimana cuaca hari ini?"
          }
        ]
      },
      {
        "id": "soshite",
        "pattern": "そして",
        "jlpt": "N5",
        "descEn": "Conjunction to add information ('And / Also').",
        "descId": "Kata hubung untuk menambahkan informasi ('Dan / Lalu').",
        "examples": [
          {
            "exampleJp": "昨日、買い物に行きました。そして、映画を見ました。",
            "exampleKana": "きのう、かいものにいきました。そして、えいがをみました。",
            "exampleEn": "I went shopping yesterday. And then, I watched a movie.",
            "exampleId": "Kemarin saya pergi berbelanja. Lalu, saya menonton film."
          },
          {
            "exampleJp": "この料理はおいしいです。そして、安いです。",
            "exampleKana": "このりょうりはおいしいです。そして、やすいです。",
            "exampleEn": "This dish is delicious. And, it is cheap.",
            "exampleId": "Masakan ini enak. Dan, harganya murah."
          },
          {
            "exampleJp": "彼は日本語を勉強しています。そして、英語も教えています。",
            "exampleKana": "かれはにほんごをべんきょうしています。そして、えいごもおしえています。",
            "exampleEn": "He is studying Japanese. And, he is also teaching English.",
            "exampleId": "Dia sedang belajar bahasa Jepang. Dan, dia juga mengajar bahasa Inggris."
          }
        ]
      },
      {
        "id": "sentence-ga-sentence",
        "pattern": "～が、～",
        "jlpt": "N5",
        "descEn": "Conjunction indicating contrast ('but').",
        "descId": "Kata hubung pertentangan ('tetapi / namun').",
        "examples": [
          {
            "exampleJp": "日本料理は好きですが、納豆は食べられません。",
            "exampleKana": "にほんりょうりはすきですが、なっとうはたべられません。",
            "exampleEn": "I like Japanese food, but I cannot eat natto.",
            "exampleId": "Saya suka masakan Jepang, tetapi saya tidak bisa makan natto."
          },
          {
            "exampleJp": "今日はいい天気ですが、少し寒いです。",
            "exampleKana": "きょうはいいてんきですが、すこしさむいです。",
            "exampleEn": "The weather is nice today, but it is a little cold.",
            "exampleId": "Cuaca hari ini bagus, tetapi agak dingin."
          },
          {
            "exampleJp": "一生懸命勉強しましたが、試験は難しかったです。",
            "exampleKana": "いっしょうけんめいべんきょうしましたが、しけんはむずかしかったです。",
            "exampleEn": "I studied very hard, but the exam was difficult.",
            "exampleId": "Saya sudah belajar dengan giat, tetapi ujiannya sulit."
          }
        ]
      },
      {
        "id": "sentence-ne",
        "pattern": "～ね",
        "jlpt": "N5",
        "descEn": "Sentence ending particle seeking agreement ('isn't it?').",
        "descId": "Partikel akhir kalimat untuk meminta persetujuan ('ya / bukan?').",
        "examples": [
          {
            "exampleJp": "今日は暑いですね。",
            "exampleKana": "きょうはあついですね。",
            "exampleEn": "It's hot today, isn't it?",
            "exampleId": "Hari ini panas, ya."
          },
          {
            "exampleJp": "この花はきれいですね。",
            "exampleKana": "このはなはきれいですね。",
            "exampleEn": "This flower is beautiful, isn't it?",
            "exampleId": "Bunga ini indah, ya."
          },
          {
            "exampleJp": "明日、一緒に映画に行きましょうね。",
            "exampleKana": "あした、いっしょにえいがにいきましょうね。",
            "exampleEn": "Let's go to the movies together tomorrow, okay?",
            "exampleId": "Besok kita pergi nonton film bersama ya."
          }
        ]
      }
    ]
  },
  {
    "chapter": 5,
    "titleEn": "Past Adjectives, Preferences & Desire",
    "titleId": "Kata Sifat Lampau, Kesukaan & Keinginan",
    "patterns": [
      {
        "id": "v-mashita-masendeshita",
        "pattern": "V ました／ませんでした",
        "jlpt": "N5",
        "descEn": "Past tense of polite verbs.",
        "descId": "Bentuk lampau sopan kata kerja (positif / negatif).",
        "examples": [
          {
            "exampleJp": "昨日、映画を見ました。",
            "exampleKana": "きのう、えいがをみました。",
            "exampleEn": "I watched a movie yesterday.",
            "exampleId": "Kemarin saya menonton film."
          },
          {
            "exampleJp": "今朝、朝ごはんを食べませんでした。",
            "exampleKana": "けさ、あさごはんをたべませんでした。",
            "exampleEn": "I did not eat breakfast this morning.",
            "exampleId": "Tadi pagi saya tidak makan sarapan."
          },
          {
            "exampleJp": "先週、日本へ行きました。",
            "exampleKana": "せんしゅう、にほんへいきました。",
            "exampleEn": "I went to Japan last week.",
            "exampleId": "Minggu lalu saya pergi ke Jepang."
          }
        ]
      },
      {
        "id": "a-n-past-tense",
        "pattern": "A/N でした／じゃありませんでした",
        "jlpt": "N5",
        "descEn": "Past tense of adjectives and nouns.",
        "descId": "Bentuk lampau dari kata sifat dan kata benda.",
        "examples": [
          {
            "exampleJp": "昨日は暑かったです。",
            "exampleKana": "きのうはあつかったです。",
            "exampleEn": "It was hot yesterday.",
            "exampleId": "Kemarin cuacanya panas."
          },
          {
            "exampleJp": "先週は暇じゃありませんでした。",
            "exampleKana": "せんしゅうはひまじゃありませんでした。",
            "exampleEn": "I was not free last week.",
            "exampleId": "Minggu lalu saya tidak senggang."
          },
          {
            "exampleJp": "子供の時、背が高かったです。",
            "exampleKana": "こどものとき、せがたかかったです。",
            "exampleEn": "I was tall when I was a child.",
            "exampleId": "Waktu kecil saya tinggi."
          }
        ]
      },
      {
        "id": "n-ga-suki-kirai-desu",
        "pattern": "N が好きです／嫌いです",
        "jlpt": "N5",
        "descEn": "Expressing likes and dislikes.",
        "descId": "Menyatakan kesukaan dan ketidaksukaan terhadap sesuatu.",
        "examples": [
          {
            "exampleJp": "私は日本料理が好きです。",
            "exampleKana": "わたしはにほんりょうりがすきです。",
            "exampleEn": "I like Japanese food.",
            "exampleId": "Saya suka masakan Jepang."
          },
          {
            "exampleJp": "弟は納豆が嫌いです。",
            "exampleKana": "おとうとはなっとうがきらいです。",
            "exampleEn": "My younger brother dislikes natto.",
            "exampleId": "Adik laki-laki saya tidak suka natto."
          },
          {
            "exampleJp": "あなたはどんなスポーツが好きですか。",
            "exampleKana": "あなたはどんなすぽーつがすきですか。",
            "exampleEn": "What kind of sports do you like?",
            "exampleId": "Anda suka olahraga apa?"
          }
        ]
      },
      {
        "id": "n-ga-hoshire-desu",
        "pattern": "N がほしいです",
        "jlpt": "N5",
        "descEn": "Expressing desire for an object ('want N').",
        "descId": "Menyatakan keinginan memiliki suatu barang ('ingin N').",
        "examples": [
          {
            "exampleJp": "新しいカメラがほしいです。",
            "exampleKana": "あたらしいかめらがほしいです。",
            "exampleEn": "I want a new camera.",
            "exampleId": "Saya ingin kamera baru."
          },
          {
            "exampleJp": "誕生日に何がほしいですか。",
            "exampleKana": "たんじょうびになにがほしいですか。",
            "exampleEn": "What do you want for your birthday?",
            "exampleId": "Anda ingin apa untuk ulang tahun?"
          },
          {
            "exampleJp": "今、冷たい水がほしいです。",
            "exampleKana": "いま、つめたいみずがほしいです。",
            "exampleEn": "I want some cold water now.",
            "exampleId": "Sekarang saya ingin air dingin."
          }
        ]
      },
      {
        "id": "v-tai-desu",
        "pattern": "Vたいです",
        "jlpt": "N5",
        "descEn": "Expressing desire to do an action ('want to do V').",
        "descId": "Menyatakan keinginan melakukan suatu tindakan ('ingin melakukan V').",
        "examples": [
          {
            "exampleJp": "私は日本へ旅行に行きたいです。",
            "exampleKana": "わたしはにほんへりょこうにいきたいです。",
            "exampleEn": "I want to go to Japan for a trip.",
            "exampleId": "Saya ingin pergi berwisata ke Jepang."
          },
          {
            "exampleJp": "冷たい水が飲みたいです。",
            "exampleKana": "つめたいみずがのみたいです。",
            "exampleEn": "I want to drink cold water.",
            "exampleId": "Saya ingin minum air dingin."
          },
          {
            "exampleJp": "新しい本を読みたいです。",
            "exampleKana": "あたらしいほんをよみたいです。",
            "exampleEn": "I want to read a new book.",
            "exampleId": "Saya ingin membaca buku baru."
          }
        ]
      },
      {
        "id": "v-ni-ikimasu",
        "pattern": "V に行きます",
        "jlpt": "N5",
        "descEn": "Expressing purpose of movement ('go to do V').",
        "descId": "Menyatakan tujuan pergi untuk melakukan suatu tindakan.",
        "examples": [
          {
            "exampleJp": "デパートへ服を買いに行きます。",
            "exampleKana": "デパートへふくをかいにいきます。",
            "exampleEn": "I am going to the department store to buy clothes.",
            "exampleId": "Saya pergi ke departemen store untuk membeli baju."
          },
          {
            "exampleJp": "友達と映画を見に行きます。",
            "exampleKana": "ともだちとえいがをみにいきます。",
            "exampleEn": "I am going to watch a movie with my friend.",
            "exampleId": "Saya pergi menonton film bersama teman."
          },
          {
            "exampleJp": "図書館へ勉強しに行きます。",
            "exampleKana": "としょかんへべんきょうしにいきます。",
            "exampleEn": "I am going to the library to study.",
            "exampleId": "Saya pergi ke perpustakaan untuk belajar."
          }
        ]
      },
      {
        "id": "dokoka-e-ikimasu",
        "pattern": "どこかへ行きます",
        "jlpt": "N5",
        "descEn": "Going somewhere (indefinite location).",
        "descId": "Pergi ke suatu tempat (tujuan tidak spesifik).",
        "examples": [
          {
            "exampleJp": "週末はどこかへ行きたいです。",
            "exampleKana": "しゅうまつはどこかへいきたいです。",
            "exampleEn": "I want to go somewhere this weekend.",
            "exampleId": "Saya ingin pergi ke suatu tempat akhir pekan ini."
          },
          {
            "exampleJp": "夏休みにどこかへ行きますか。",
            "exampleKana": "なつやすみにどこかへいきますか。",
            "exampleEn": "Are you going anywhere during summer vacation?",
            "exampleId": "Apakah kamu akan pergi ke suatu tempat saat liburan musim panas?"
          },
          {
            "exampleJp": "静かな場所へ行きたいです。",
            "exampleKana": "しずかなばしょへいきたいです。",
            "exampleEn": "I want to go somewhere quiet.",
            "exampleId": "Saya ingin pergi ke suatu tempat yang tenang."
          }
        ]
      },
      {
        "id": "doushite",
        "pattern": "どうして",
        "jlpt": "N5",
        "descEn": "Asking for reasons ('Why?').",
        "descId": "Menanyakan alasan ('Mengapa? / Kenapa?').",
        "examples": [
          {
            "exampleJp": "どうして学校へ行かないのですか。",
            "exampleKana": "どうしてがっこうへいかないのですか。",
            "exampleEn": "Why are you not going to school?",
            "exampleId": "Mengapa kamu tidak pergi ke sekolah?"
          },
          {
            "exampleJp": "どうして昨日休んだのですか。",
            "exampleKana": "どうしてきのうやすんだのですか。",
            "exampleEn": "Why were you absent yesterday?",
            "exampleId": "Mengapa kamu absen kemarin?"
          },
          {
            "exampleJp": "どうして日本語を勉強していますか。",
            "exampleKana": "どうしてにほんごをべんきょうしていますか。",
            "exampleEn": "Why are you studying Japanese?",
            "exampleId": "Mengapa kamu belajar bahasa Jepang?"
          }
        ]
      },
      {
        "id": "sorekara",
        "pattern": "それから",
        "jlpt": "N5",
        "descEn": "Conjunction indicating sequence ('after that / then').",
        "descId": "Kata hubung urutan waktu ('setelah itu / kemudian').",
        "examples": [
          {
            "exampleJp": "昨日、買い物に行きました。それから、映画を見ました。",
            "exampleKana": "きのう、かいものにいきました。それから、えいがをみました。",
            "exampleEn": "I went shopping yesterday. After that, I watched a movie.",
            "exampleId": "Kemarin saya pergi berbelanja. Setelah itu, saya menonton film."
          },
          {
            "exampleJp": "まず宿題をします。それから、テレビを見ます。",
            "exampleKana": "まずしゅくだいをします。それから、テレビをみます。",
            "exampleEn": "First, I will do my homework. Then, I will watch TV.",
            "exampleId": "Pertama, saya akan mengerjakan PR. Kemudian, saya akan menonton TV."
          },
          {
            "exampleJp": "朝ごはんを食べました。それから、学校へ行きました。",
            "exampleKana": "あさごはんをたべました。それから、がっこうへいきました。",
            "exampleEn": "I ate breakfast. Then, I went to school.",
            "exampleId": "Saya sudah sarapan. Setelah itu, saya pergi ke sekolah."
          }
        ]
      },
      {
        "id": "n-to-verb",
        "pattern": "N(人) と V",
        "jlpt": "N5",
        "descEn": "Doing an action together with someone.",
        "descId": "Melakukan tindakan bersama dengan orang lain.",
        "examples": [
          {
            "exampleJp": "昨日、友達と公園へ行きました。",
            "exampleKana": "きのう、ともだちとこうえんへいきました。",
            "exampleEn": "I went to the park with my friend yesterday.",
            "exampleId": "Kemarin saya pergi ke taman bersama teman."
          },
          {
            "exampleJp": "家族と日本料理を食べます。",
            "exampleKana": "かぞくとにほんりょうりをたべます。",
            "exampleEn": "I will eat Japanese food with my family.",
            "exampleId": "Saya akan makan masakan Jepang bersama keluarga."
          },
          {
            "exampleJp": "先生と日本語で話しました。",
            "exampleKana": "せんせいとにほんごではなしました。",
            "exampleEn": "I spoke in Japanese with my teacher.",
            "exampleId": "Saya berbicara dalam bahasa Jepang dengan guru."
          }
        ]
      },
      {
        "id": "sentence-kara-sentence",
        "pattern": "～から、～",
        "jlpt": "N5",
        "descEn": "Expressing reason or cause ('because / so').",
        "descId": "Menyatakan sebab-akibat ('karena... maka...').",
        "examples": [
          {
            "exampleJp": "暑いですから、窓を開けてください。",
            "exampleKana": "あついですから、まどをあけてください。",
            "exampleEn": "Because it is hot, please open the window.",
            "exampleId": "Karena panas, tolong buka jendelanya."
          },
          {
            "exampleJp": "おなかがすきましたから、何か食べましょう。",
            "exampleKana": "おなかがすきましたから、なにかたべましょう。",
            "exampleEn": "Because I am hungry, let's eat something.",
            "exampleId": "Karena saya lapar, ayo kita makan sesuatu."
          },
          {
            "exampleJp": "明日試験がありますから、勉強しなければなりません。",
            "exampleKana": "あしたしけんがありますから、べんきょうしなければなりません。",
            "exampleEn": "Because there is an exam tomorrow, I must study.",
            "exampleId": "Karena besok ada ujian, saya harus belajar."
          }
        ]
      }
    ]
  },
  {
    "chapter": 6,
    "titleEn": "Existence, Comparison & Hearsay",
    "titleId": "Keberadaan, Perbandingan & Ajakan",
    "patterns": [
      {
        "id": "v-masenka",
        "pattern": "V ませんか",
        "jlpt": "N5",
        "descEn": "Polite invitation or suggestion ('Won't you do V?').",
        "descId": "Ajakan atau tawaran sopan ('Maukah melakukan V?').",
        "examples": [
          {
            "exampleJp": "一緒に映画を見ませんか。",
            "exampleKana": "いっしょにえいがをみませんか。",
            "exampleEn": "Won't you watch a movie with me?",
            "exampleId": "Maukah Anda menonton film bersama saya?"
          },
          {
            "exampleJp": "明日、公園へ行きませんか。",
            "exampleKana": "あした、こうえんへいきませんか。",
            "exampleEn": "Won't you go to the park tomorrow?",
            "exampleId": "Maukah Anda pergi ke taman besok?"
          },
          {
            "exampleJp": "コーヒーを飲みませんか。",
            "exampleKana": "コーヒーをのみませんか。",
            "exampleEn": "Won't you have some coffee?",
            "exampleId": "Maukah Anda minum kopi?"
          }
        ]
      },
      {
        "id": "v-mashou",
        "pattern": "V ましょう",
        "jlpt": "N5",
        "descEn": "Polite suggestion ('Let's do V').",
        "descId": "Ajakan atau kesepakatan melakukan sesuatu bersama ('Mari lakukan V').",
        "examples": [
          {
            "exampleJp": "少し休みましょう。",
            "exampleKana": "すこしやすみましょう。",
            "exampleEn": "Let's take a short break.",
            "exampleId": "Mari kita istirahat sebentar."
          },
          {
            "exampleJp": "タクシーで帰りましょう。",
            "exampleKana": "タクシーでかえりましょう。",
            "exampleEn": "Let's go home by taxi.",
            "exampleId": "Mari kita pulang naik taksi."
          },
          {
            "exampleJp": "ここで写真を撮りましょう。",
            "exampleKana": "ここでしゃしんをとりましょう。",
            "exampleEn": "Let's take a photo here.",
            "exampleId": "Mari kita ambil foto di sini."
          }
        ]
      },
      {
        "id": "n-ga-arimasu-event-schedule",
        "pattern": "N があります (acara)",
        "jlpt": "N5",
        "descEn": "Expressing that an event or scheduled activity takes place.",
        "descId": "Menyatakan berlangsungnya suatu acara atau jadwal kegiatan.",
        "examples": [
          {
            "exampleJp": "明日、テストがあります。",
            "exampleKana": "あした、テストがあります。",
            "exampleEn": "There is a test tomorrow.",
            "exampleId": "Besok ada ujian."
          },
          {
            "exampleJp": "来週、会議があります。",
            "exampleKana": "らいしゅう、かいぎがあります。",
            "exampleEn": "There is a meeting next week.",
            "exampleId": "Minggu depan ada rapat."
          },
          {
            "exampleJp": "今日、誕生会があります。",
            "exampleKana": "きょう、たんじょうかいがあります。",
            "exampleEn": "There is a birthday party today.",
            "exampleId": "Hari ini ada pesta ulang tahun."
          }
        ]
      },
      {
        "id": "n-basho-de-n-ga-arimasu",
        "pattern": "N1 で N2 があります",
        "jlpt": "N5",
        "descEn": "Specifying the location of an event.",
        "descId": "Menyatakan lokasi berlangsungnya suatu acara.",
        "examples": [
          {
            "exampleJp": "体育館でコンサートがあります。",
            "exampleKana": "たいいくかんでコンサートがあります。",
            "exampleEn": "There is a concert at the gymnasium.",
            "exampleId": "Ada konser di gedung olahraga."
          },
          {
            "exampleJp": "学校で日本語の試験があります。",
            "exampleKana": "がっこうでにほんごのしけんがあります。",
            "exampleEn": "There is a Japanese test at school.",
            "exampleId": "Ada ujian bahasa Jepang di sekolah."
          },
          {
            "exampleJp": "駅前で夏祭りがあります。",
            "exampleKana": "えきまえでなつまつりがあります。",
            "exampleEn": "There is a summer festival in front of the station.",
            "exampleId": "Ada festival musim panas di depan stasiun."
          }
        ]
      },
      {
        "id": "n-ga-counter-arimasu",
        "pattern": "N があります (数量)",
        "jlpt": "N5",
        "descEn": "Stating the quantity of objects available.",
        "descId": "Menyatakan jumlah barang yang ada menggunakan kata bantu bilangan.",
        "examples": [
          {
            "exampleJp": "机の上に本が三冊あります。",
            "exampleKana": "つくえのうえにほんがさんさつあります。",
            "exampleEn": "There are three books on the desk.",
            "exampleId": "Ada tiga buku di atas meja."
          },
          {
            "exampleJp": "冷蔵庫に卵が二つあります。",
            "exampleKana": "れいぞうこにたまごがふたつあります。",
            "exampleEn": "There are two eggs in the refrigerator.",
            "exampleId": "Ada dua butir telur di dalam kulkas."
          },
          {
            "exampleJp": "教室に学生が五人います。",
            "exampleKana": "きょうしつにがくせいがごにんいます。",
            "exampleEn": "There are five students in the classroom.",
            "exampleId": "Ada lima orang murid di dalam kelas."
          }
        ]
      },
      {
        "id": "n1-de-n2-ga-ichiban-a-desu",
        "pattern": "N1 で N2 がいちばん A です",
        "jlpt": "N5",
        "descEn": "Expressing superlative comparison ('N2 is the most A in N1').",
        "descId": "Menyatakan perbandingan teratas/paling ('N2 adalah yang paling A di N1').",
        "examples": [
          {
            "exampleJp": "一年で夏がいちばん暑いです。",
            "exampleKana": "いちねんでなつがいちばんあついです。",
            "exampleEn": "Summer is the hottest time of the year.",
            "exampleId": "Musim panas adalah yang paling panas dalam setahun."
          },
          {
            "exampleJp": "果物の中でりんごがいちばん好きです。",
            "exampleKana": "くだもののなかでりんごがいちばんすきです。",
            "exampleEn": "Among fruits, I like apples the most.",
            "exampleId": "Di antara buah-buahan, saya paling suka apel."
          },
          {
            "exampleJp": "クラスで田中さんがいちばん背が高いです。",
            "exampleKana": "クラスでたなかさんがいちばんせがたかいです。",
            "exampleEn": "Tanaka-san is the tallest in the class.",
            "exampleId": "Tanaka-san adalah yang paling tinggi di kelas."
          }
        ]
      },
      {
        "id": "n1-wa-n2-yori-a-desu",
        "pattern": "N1 は N2 より A です",
        "jlpt": "N5",
        "descEn": "Comparing two items ('N1 is more A than N2').",
        "descId": "Membandingkan dua hal ('N1 lebih A daripada N2').",
        "examples": [
          {
            "exampleJp": "このかばんはあの店のかばんより安いです。",
            "exampleKana": "このかばんはあのみせのかばんよりやすいです。",
            "exampleEn": "This bag is cheaper than the bag at that store.",
            "exampleId": "Tas ini lebih murah daripada tas di toko itu."
          },
          {
            "exampleJp": "日本はタイより寒いです。",
            "exampleKana": "にほんはタイよりさむいです。",
            "exampleEn": "Japan is colder than Thailand.",
            "exampleId": "Jepang lebih dingin daripada Thailand."
          },
          {
            "exampleJp": "今日は昨日より忙しいです。",
            "exampleKana": "きょうはきのうよりいそがしいです。",
            "exampleEn": "Today is busier than yesterday.",
            "exampleId": "Hari ini lebih sibuk daripada kemarin."
          }
        ]
      },
      {
        "id": "n1-to-n2-to-dochira-ga-a-desuka-hou-ga",
        "pattern": "N1 と N2 とどちらが A ですか / N のほうが A です",
        "jlpt": "N5",
        "descEn": "Asking to choose between two options, and selecting one.",
        "descId": "Menanyakan pilihan antara dua hal, dan memilih salah satunya.",
        "examples": [
          {
            "exampleJp": "コーヒーと紅茶とどちらが飲みたいですか。コーヒーのほうがいいです。",
            "exampleKana": "コーヒーとこうちゃとどちらがのみたいですか。コーヒーのほうがいいです。",
            "exampleEn": "Which would you like to drink, coffee or tea? I prefer coffee.",
            "exampleId": "Antara kopi dan teh, Anda ingin minum yang mana? Saya lebih memilih kopi."
          },
          {
            "exampleJp": "夏と冬とどちらが好きですか。夏のほうが好きです。",
            "exampleKana": "なつとふゆとどちらがすきですか。なつのほうがすきです。",
            "exampleEn": "Which do you like better, summer or winter? I like summer better.",
            "exampleId": "Antara musim panas dan musim dingin, Anda lebih suka yang mana? Saya lebih suka musim panas."
          },
          {
            "exampleJp": "バスと電車とどちらが速いですか。電車のほうが速いです。",
            "exampleKana": "バスとでんしゃとどちらがはやいですか。でんしゃのほうがはやいです。",
            "exampleEn": "Which is faster, the bus or the train? The train is faster.",
            "exampleId": "Antara bus dan kereta, mana yang lebih cepat? Kereta lebih cepat."
          }
        ]
      },
      {
        "id": "v-mou-mashitaka",
        "pattern": "もう V ましたか",
        "jlpt": "N5",
        "descEn": "Asking if an action has already been completed.",
        "descId": "Menanyakan apakah suatu aksi sudah selesai dilakukan.",
        "examples": [
          {
            "exampleJp": "もう昼ごはんを食べましたか。",
            "exampleKana": "もうひるごはんをたべましたか。",
            "exampleEn": "Have you already eaten lunch?",
            "exampleId": "Apakah kamu sudah makan siang?"
          },
          {
            "exampleJp": "もう宿題をしましたか。",
            "exampleKana": "もうしゅくだいをしましたか。",
            "exampleEn": "Have you already done your homework?",
            "exampleId": "Apakah kamu sudah mengerjakan PR?"
          },
          {
            "exampleJp": "もう切符を買いましたか。",
            "exampleKana": "もうきっぷをかいましたか。",
            "exampleEn": "Have you already bought the ticket?",
            "exampleId": "Apakah kamu sudah membeli tiketnya?"
          }
        ]
      },
      {
        "id": "sentence-yo",
        "pattern": "～よ",
        "jlpt": "N5",
        "descEn": "Sentence ending particle to provide new info or emphasis ('you know / !').",
        "descId": "Partikel akhir kalimat untuk memberikan informasi baru atau penekanan.",
        "examples": [
          {
            "exampleJp": "明日は休みですよ。",
            "exampleKana": "あしたはやすみですよ。",
            "exampleEn": "Tomorrow is a day off, you know.",
            "exampleId": "Besok itu libur, lho."
          },
          {
            "exampleJp": "この映画はとても面白いですよ。",
            "exampleKana": "このえいがはとてもおもしろいですよ。",
            "exampleEn": "This movie is very interesting, I tell you.",
            "exampleId": "Film ini sangat menarik, lho."
          },
          {
            "exampleJp": "傘を持って行ってくださいよ。",
            "exampleKana": "かさをもっていってくださいよ。",
            "exampleEn": "Please take an umbrella with you (because it might rain).",
            "exampleId": "Tolong bawa payung ya."
          }
        ]
      }
    ]
  },
  {
    "chapter": 7,
    "titleEn": "Position & Animate Existence",
    "titleId": "Posisi & Keberadaan Makhluk Hidup",
    "patterns": [
      {
        "id": "n1-wa-n2-ni-imasu-arimasu",
        "pattern": "N1 は N2 にいます／あります",
        "jlpt": "N5",
        "descEn": "Locating specific people or items ('N1 is at N2').",
        "descId": "Menyatakan keberadaan benda/orang spesifik ('N1 ada di N2').",
        "examples": [
          {
            "exampleJp": "田中さんは教室にいます。",
            "exampleKana": "たなかさんはきょうしつにいます。",
            "exampleEn": "Tanaka-san is in the classroom.",
            "exampleId": "Tanaka-san ada di dalam kelas."
          },
          {
            "exampleJp": "猫は机の下にいます。",
            "exampleKana": "ねこはつくえのしたにいます。",
            "exampleEn": "The cat is under the desk.",
            "exampleId": "Kucing itu ada di bawah meja."
          },
          {
            "exampleJp": "私の本はカバンの中にあります。",
            "exampleKana": "わたしのほんはかばんのなかにあります。",
            "exampleEn": "My book is in the bag.",
            "exampleId": "Buku saya ada di dalam tas."
          }
        ]
      },
      {
        "id": "n1-ni-n2-ga-imasu-arimasu",
        "pattern": "N1 に N2 がいます／あります",
        "jlpt": "N5",
        "descEn": "Stating what is at a location ('There is N2 at N1').",
        "descId": "Menyatakan apa yang ada di suatu tempat ('Di N1 ada N2').",
        "examples": [
          {
            "exampleJp": "公園に子供がいます。",
            "exampleKana": "こうえんにこどもがいます。",
            "exampleEn": "There are children in the park.",
            "exampleId": "Di taman ada anak-anak."
          },
          {
            "exampleJp": "部屋に机があります。",
            "exampleKana": "へやにつくえがあります。",
            "exampleEn": "There is a desk in the room.",
            "exampleId": "Di dalam kamar ada meja."
          },
          {
            "exampleJp": "冷蔵庫にビールがあります。",
            "exampleKana": "れいぞうこにびーるがあります。",
            "exampleEn": "There is beer in the refrigerator.",
            "exampleId": "Di dalam kulkas ada bir."
          }
        ]
      },
      {
        "id": "v-te-kudasai",
        "pattern": "Vて ください",
        "jlpt": "N5",
        "descEn": "Making a polite request ('Please do V').",
        "descId": "Meminta tolong atau instruksi secara sopan ('Tolong lakukan V').",
        "examples": [
          {
            "exampleJp": "ここで待ってください。",
            "exampleKana": "ここでまってください。",
            "exampleEn": "Please wait here.",
            "exampleId": "Tolong tunggu di sini."
          },
          {
            "exampleJp": "名前を書いてください。",
            "exampleKana": "なまえをかいてください。",
            "exampleEn": "Please write your name.",
            "exampleId": "Tolong tulis nama Anda."
          },
          {
            "exampleJp": "ドアを開けてください。",
            "exampleKana": "どあをあけてください。",
            "exampleEn": "Please open the door.",
            "exampleId": "Tolong buka pintunya."
          }
        ]
      },
      {
        "id": "v-te-imasu",
        "pattern": "Vて います",
        "jlpt": "N5",
        "descEn": "Expressing ongoing action or state.",
        "descId": "Menyatakan tindakan yang sedang berlangsung atau keadaan.",
        "examples": [
          {
            "exampleJp": "今、日本語を勉強しています。",
            "exampleKana": "いま、にほんごをべんきょうしています。",
            "exampleEn": "I am studying Japanese now.",
            "exampleId": "Sekarang saya sedang belajar bahasa Jepang."
          },
          {
            "exampleJp": "母は料理を作っています。",
            "exampleKana": "はははりょうりをつくっています。",
            "exampleEn": "My mother is cooking.",
            "exampleId": "Ibu sedang memasak."
          },
          {
            "exampleJp": "雨が降っています。",
            "exampleKana": "あめがふっています。",
            "exampleEn": "It is raining.",
            "exampleId": "Sedang hujan."
          }
        ]
      },
      {
        "id": "v-mashouka",
        "pattern": "V ましょうか",
        "jlpt": "N5",
        "descEn": "Offering help politely ('Shall I do V?').",
        "descId": "Menawarkan bantuan secara sopan ('Bagaimana kalau saya lakukan V?').",
        "examples": [
          {
            "exampleJp": "重い荷物を持ちましょうか。",
            "exampleKana": "おもいにもつをもちましょうか。",
            "exampleEn": "Shall I carry your heavy luggage?",
            "exampleId": "Bolehkah saya bantu membawakan barang bawaan Anda yang berat?"
          },
          {
            "exampleJp": "窓を閉めましょうか。",
            "exampleKana": "まどをしめましょうか。",
            "exampleEn": "Shall I close the window?",
            "exampleId": "Bagaimana kalau saya tutup jendelanya?"
          },
          {
            "exampleJp": "タクシーを呼びましょうか。",
            "exampleKana": "たくしーをよびましょうか。",
            "exampleEn": "Shall I call a taxi?",
            "exampleId": "Perlukah saya panggilkan taksi?"
          }
        ]
      },
      {
        "id": "v-kata",
        "pattern": "V方",
        "jlpt": "N5",
        "descEn": "Expressing the method of doing an action ('how to do V').",
        "descId": "Menyatakan cara melakukan suatu tindakan ('cara melakukan V').",
        "examples": [
          {
            "exampleJp": "この漢字の読み方を教えてください。",
            "exampleKana": "このかんじのよみかたをおしえてください。",
            "exampleEn": "Please teach me how to read this kanji.",
            "exampleId": "Tolong ajarkan saya cara membaca kanji ini."
          },
          {
            "exampleJp": "自転車の乗り方を練習します。",
            "exampleKana": "じてんしゃののりかたをれんしゅうします。",
            "exampleEn": "I will practice how to ride a bicycle.",
            "exampleId": "Saya akan berlatih cara mengendarai sepeda."
          },
          {
            "exampleJp": "美味しいコーヒーの入れ方を知っていますか。",
            "exampleKana": "おいしいこーひーのいれかたをしっていますか。",
            "exampleEn": "Do you know how to make delicious coffee?",
            "exampleId": "Apakah Anda tahu cara membuat kopi yang enak?"
          }
        ]
      },
      {
        "id": "mada-mou-existence",
        "pattern": "まだ／もう",
        "jlpt": "N5",
        "descEn": "Adverbs expressing 'yet / already'.",
        "descId": "Kata keterangan yang menyatakan 'belum / sudah'.",
        "examples": [
          {
            "exampleJp": "宿題はもう終わりましたか。いいえ、まだです。",
            "exampleKana": "しゅくだい M もうおわりましたか。いいえ、まだです。",
            "exampleEn": "Have you finished your homework yet? No, not yet.",
            "exampleId": "Apakah PR-nya sudah selesai? Belum."
          },
          {
            "exampleJp": "もう昼ごはんを食べました。",
            "exampleKana": "もうひるごはんをたべました。",
            "exampleEn": "I have already eaten lunch.",
            "exampleId": "Saya sudah makan siang."
          },
          {
            "exampleJp": "まだ雨が降っています。",
            "exampleKana": "まだあめがふっています。",
            "exampleEn": "It is still raining.",
            "exampleId": "Hujannya masih turun."
          }
        ]
      },
      {
        "id": "dare-ga-subject-marker",
        "pattern": "誰が",
        "jlpt": "N5",
        "descEn": "Subject marker for question words ('Who did...?').",
        "descId": "Penanda subjek untuk kata tanya ('Siapa yang...?').",
        "examples": [
          {
            "exampleJp": "誰がこのケーキを作りましたか。",
            "exampleKana": "だれがこのけーきをつくりましたか。",
            "exampleEn": "Who made this cake?",
            "exampleId": "Siapa yang membuat kue ini?"
          },
          {
            "exampleJp": "昨日、誰がここに来ましたか。",
            "exampleKana": "きのう、だれがここにきましたか。",
            "exampleEn": "Who came here yesterday?",
            "exampleId": "Siapa yang datang ke sini kemarin?"
          },
          {
            "exampleJp": "誰が一番速く走れますか。",
            "exampleKana": "だれがいちはんはやくはしれますか。",
            "exampleEn": "Who can run the fastest?",
            "exampleId": "Siapa yang bisa berlari paling cepat?"
          }
        ]
      },
      {
        "id": "dono-n-dore",
        "pattern": "どの N／どれ",
        "jlpt": "N5",
        "descEn": "Which N / which one (among three or more options).",
        "descId": "N yang mana / yang mana (di antara tiga pilihan atau lebih).",
        "examples": [
          {
            "exampleJp": "どのペンがあなたのものですか。",
            "exampleKana": "どのぺんがあなたのものですか。",
            "exampleEn": "Which pen is yours?",
            "exampleId": "Pena yang mana milikmu?"
          },
          {
            "exampleJp": "この中で、どれが一番おいしいですか。",
            "exampleKana": "このなかで、どれがいちばんおいしいですか。",
            "exampleEn": "Which one of these is the most delicious?",
            "exampleId": "Di antara ini semua, yang mana yang paling enak?"
          },
          {
            "exampleJp": "どの道を行けばいいですか。",
            "exampleKana": "どのちみちをいけばいいですか。",
            "exampleEn": "Which road should I take?",
            "exampleId": "Jalan yang mana yang harus saya lalui?"
          }
        ]
      },
      {
        "id": "n-dougu-de",
        "pattern": "N(道具) で",
        "jlpt": "N5",
        "descEn": "Indicates the tool or method used to perform an action ('with N').",
        "descId": "Menunjukkan alat atau metode untuk melakukan suatu aksi ('dengan N').",
        "examples": [
          {
            "exampleJp": "箸でご飯を食べます。",
            "exampleKana": "はしでごはんをたべます。",
            "exampleEn": "I eat rice with chopsticks.",
            "exampleId": "Saya makan nasi dengan sumpit."
          },
          {
            "exampleJp": "日本語で手紙を書きました。",
            "exampleKana": "にほんごでてがみをかきました。",
            "exampleEn": "I wrote a letter in Japanese.",
            "exampleId": "Saya menulis surat dengan bahasa Jepang."
          },
          {
            "exampleJp": "ハサミで紙を切ります。",
            "exampleKana": "はさみでかみをきります。",
            "exampleEn": "I cut the paper with scissors.",
            "exampleId": "Saya memotong kertas dengan gunting."
          }
        ]
      }
    ]
  },
  {
    "chapter": 8,
    "titleEn": "Physical Attributes & Giving/Receiving",
    "titleId": "Atribut Fisik & Memberi/Menerima",
    "patterns": [
      {
        "id": "v-te-imasu-job-habit",
        "pattern": "Vて います (pekerjaan/kebiasaan)",
        "jlpt": "N5",
        "descEn": "Expressing state of occupation or habit.",
        "descId": "Menyatakan pekerjaan tetap atau kebiasaan rutin.",
        "examples": [
          {
            "exampleJp": "私は銀行で働いています。",
            "exampleKana": "わたしはぎんこうではたらいています。",
            "exampleEn": "I work at a bank.",
            "exampleId": "Saya bekerja di bank."
          },
          {
            "exampleJp": "妹は毎日ピアノを練習しています。",
            "exampleKana": "いもうとはまいにちぴあのをれんしゅうしています。",
            "exampleEn": "My younger sister practices the piano every day.",
            "exampleId": "Adik perempuan saya berlatih piano setiap hari."
          },
          {
            "exampleJp": "父は車で会社へ通っています。",
            "exampleKana": "ちちはくるまでかいしゃへかよっています。",
            "exampleEn": "My father commutes to work by car.",
            "exampleId": "Ayah saya pergi ke kantor dengan mobil."
          }
        ]
      },
      {
        "id": "n1-wa-n2-ga-a-desu",
        "pattern": "N1 は N2 が A です",
        "jlpt": "N5",
        "descEn": "Describing a feature or attribute of N1 (e.g. 'He has long legs').",
        "descId": "Menjelaskan bagian/atribut tubuh dari N1 (misal: 'Dia kakinya panjang').",
        "examples": [
          {
            "exampleJp": "象は鼻が長いです。",
            "exampleKana": "ぞうははながながいです。",
            "exampleEn": "Elephants have long noses.",
            "exampleId": "Gajah hidungnya panjang."
          },
          {
            "exampleJp": "あの人は背が高いです。",
            "exampleKana": "あのひとはせがたかいです。",
            "exampleEn": "That person is tall.",
            "exampleId": "Orang itu badannya tinggi."
          },
          {
            "exampleJp": "この部屋は窓が大きいです。",
            "exampleKana": "このへやはまどがおおきいです。",
            "exampleEn": "This room has large windows.",
            "exampleId": "Kamar ini jendelanya besar."
          }
        ]
      },
      {
        "id": "a-kute-a-de",
        "pattern": "Aくて、～ / Aで、～",
        "jlpt": "N5",
        "descEn": "Connecting adjectives to describe multiple attributes.",
        "descId": "Menghubungkan kata sifat untuk menjelaskan beberapa karakteristik.",
        "examples": [
          {
            "exampleJp": "この料理は安くて、おいしいです。",
            "exampleKana": "このりょうりはやすくて、おいしいです。",
            "exampleEn": "This food is cheap and delicious.",
            "exampleId": "Masakan ini murah dan enak."
          },
          {
            "exampleJp": "昨日は天気が良くて、暑かったです。",
            "exampleKana": "きのうはてんきがよくて、あつかったです。",
            "exampleEn": "The weather was good and hot yesterday.",
            "exampleId": "Cuaca kemarin bagus dan panas."
          },
          {
            "exampleJp": "彼は親切で、ハンサムです。",
            "exampleKana": "かれはしんせつで、はんさむです。",
            "exampleEn": "He is kind and handsome.",
            "exampleId": "Dia baik hati dan tampan."
          }
        ]
      },
      {
        "id": "n-person-ni-n-o-agemasu-moraimasu-kuremasu",
        "pattern": "N1 に N2 を あげます／もらいます／くれます",
        "jlpt": "N5",
        "descEn": "Expressing giving and receiving of items.",
        "descId": "Menyatakan tindakan memberi dan menerima barang.",
        "examples": [
          {
            "exampleJp": "私は友達にプレゼントをあげます。",
            "exampleKana": "わたしはともだちにぷれぜんとをあげます。",
            "exampleEn": "I give a present to my friend.",
            "exampleId": "Saya memberikan hadiah kepada teman."
          },
          {
            "exampleJp": "私は先生に花をもらいました。",
            "exampleKana": "わたしはせんせいにはなをもらいました。",
            "exampleEn": "I received flowers from my teacher.",
            "exampleId": "Saya menerima bunga dari guru."
          },
          {
            "exampleJp": "母が私に本をくれました。",
            "exampleKana": "ははがわたしにほんをくれました。",
            "exampleEn": "My mother gave me a book.",
            "exampleId": "Ibu memberikan buku kepada saya."
          }
        ]
      },
      {
        "id": "n-person-ga-counter-imasu",
        "pattern": "N がいます (数量)",
        "jlpt": "N5",
        "descEn": "Stating the count of people available.",
        "descId": "Menyatakan jumlah orang yang ada.",
        "examples": [
          {
            "exampleJp": "教室に学生が三人います。",
            "exampleKana": "きょうしつにがくせいがさんにんいます。",
            "exampleEn": "There are three students in the classroom.",
            "exampleId": "Ada tiga orang siswa di dalam kelas."
          },
          {
            "exampleJp": "家に家族が四人います。",
            "exampleKana": "いえにかぞくがよにんいます。",
            "exampleEn": "There are four family members at home.",
            "exampleId": "Ada empat orang anggota keluarga di rumah."
          },
          {
            "exampleJp": "公園に子供が五人います。",
            "exampleKana": "こうえんにこどもがごにんいます。",
            "exampleEn": "There are five children in the park.",
            "exampleId": "Ada lima orang anak di taman."
          }
        ]
      },
      {
        "id": "person-counter-de",
        "pattern": "～人で",
        "jlpt": "N5",
        "descEn": "Doing an action with a specific number of people.",
        "descId": "Melakukan suatu aksi dengan jumlah orang tertentu.",
        "examples": [
          {
            "exampleJp": "三人で映画を見に行きました。",
            "exampleKana": "さんにんでえいがをみにいきました。",
            "exampleEn": "Three of us went to see a movie.",
            "exampleId": "Kami pergi menonton film bertiga."
          },
          {
            "exampleJp": "二人でランチを食べます。",
            "exampleKana": "ふたりでランチをたべます。",
            "exampleEn": "The two of us will eat lunch.",
            "exampleId": "Kami berdua akan makan siang."
          },
          {
            "exampleJp": "四人で旅行に行きたいです。",
            "exampleKana": "よにんでりょこうにいきたいです。",
            "exampleEn": "I want to go on a trip with four people.",
            "exampleId": "Saya ingin pergi berwisata dengan empat orang."
          }
        ]
      }
    ]
  },
  {
    "chapter": 9,
    "titleEn": "Frequency & Conjunctions",
    "titleId": "Frekuensi & Kata Hubung",
    "patterns": [
      {
        "id": "v-jishokei-koto",
        "pattern": "V辞書形 こと",
        "jlpt": "N5",
        "descEn": "Nominalizing a verb using 'koto'.",
        "descId": "Mengubah kata kerja menjadi kata benda menggunakan 'koto'.",
        "examples": [
          {
            "exampleJp": "私の趣味は本を読むことです。",
            "exampleKana": "わたしのしゅみはほんをよむことです。",
            "exampleEn": "My hobby is reading books.",
            "exampleId": "Hobi saya adalah membaca buku."
          },
          {
            "exampleJp": "日本語を話すことは楽しいです。",
            "exampleKana": "にほんごをはなすことはたのしいです。",
            "exampleEn": "Speaking Japanese is fun.",
            "exampleId": "Berbicara bahasa Jepang itu menyenangkan."
          },
          {
            "exampleJp": "毎日運動することは大切です。",
            "exampleKana": "まいにちうんどうすることはたいせつです。",
            "exampleEn": "Exercising every day is important.",
            "exampleId": "Berolahraga setiap hari itu penting."
          }
        ]
      },
      {
        "id": "v-koto-ga-dekimasu",
        "pattern": "Vことができます",
        "jlpt": "N5",
        "descEn": "Expressing ability or possibility ('can do V').",
        "descId": "Menyatakan kemampuan atau potensi ('bisa/dapat melakukan V').",
        "examples": [
          {
            "exampleJp": "私は漢字を書くことができます。",
            "exampleKana": "わたしはかんじをかくことができます。",
            "exampleEn": "I can write Kanji.",
            "exampleId": "Saya bisa menulis Kanji."
          },
          {
            "exampleJp": "ここで写真を撮ることができますか。",
            "exampleKana": "ここでしゃしんをとることができますか。",
            "exampleEn": "Can I take pictures here?",
            "exampleId": "Apakah saya boleh/bisa mengambil foto di sini?"
          },
          {
            "exampleJp": "泳ぐことができません。",
            "exampleKana": "およぐことができません。",
            "exampleEn": "I cannot swim.",
            "exampleId": "Saya tidak bisa berenang."
          }
        ]
      },
      {
        "id": "v-te-reason",
        "pattern": "Vて、～",
        "jlpt": "N5",
        "descEn": "Connecting actions / expressing reason.",
        "descId": "Menghubungkan tindakan / menyatakan sebab-akibat sederhana.",
        "examples": [
          {
            "exampleJp": "風邪をひいて、学校を休みました。",
            "exampleKana": "かぜをひいて、がっこうをやすみました。",
            "exampleEn": "I caught a cold and was absent from school.",
            "exampleId": "Saya terkena flu, jadi saya tidak masuk sekolah."
          },
          {
            "exampleJp": "雨が降って、出かけませんでした。",
            "exampleKana": "あめがふって、でかけませんでした。",
            "exampleEn": "It rained, so I didn't go out.",
            "exampleId": "Hujan turun, jadi saya tidak pergi keluar."
          },
          {
            "exampleJp": "忙しくて、友達に会えません。",
            "exampleKana": "いそがしくて、ともだちにあえません。",
            "exampleEn": "I am busy, so I cannot meet my friend.",
            "exampleId": "Saya sibuk, jadi saya tidak bisa menemui teman."
          }
        ]
      },
      {
        "id": "period-ni-counter",
        "pattern": "[期間] に [回数]",
        "jlpt": "N5",
        "descEn": "Stating frequency over a period ('X times in [period]').",
        "descId": "Menyatakan frekuensi dalam jangka waktu tertentu ('X kali dalam [jangka waktu]').",
        "examples": [
          {
            "exampleJp": "一週間に二回テニスをします。",
            "exampleKana": "いっしゅうかんににかいてにすをします。",
            "exampleEn": "I play tennis twice a week.",
            "exampleId": "Saya bermain tenis dua kali dalam seminggu."
          },
          {
            "exampleJp": "一ヶ月に一回本を買います。",
            "exampleKana": "いっかげつにいっかいほんをかいます。",
            "exampleEn": "I buy a book once a month.",
            "exampleId": "Saya membeli buku satu kali dalam sebulan."
          },
          {
            "exampleJp": "一日に三回薬を飲んでください。",
            "exampleKana": "いちにちにさんかいくすりをのんでください。",
            "exampleEn": "Please take the medicine three times a day.",
            "exampleId": "Tolong minum obat tiga kali sehari."
          }
        ]
      },
      {
        "id": "frequency-adverbs",
        "pattern": "いつも/よく/ときどき/あまり/全然",
        "jlpt": "N5",
        "descEn": "Adverbs of frequency.",
        "descId": "Kata keterangan penunjuk frekuensi kegiatan.",
        "examples": [
          {
            "exampleJp": "私はいつも朝ご飯を食べます。",
            "exampleKana": "わたしはいつもあさごはんをたべます。",
            "exampleEn": "I always eat breakfast.",
            "exampleId": "Saya selalu makan sarapan."
          },
          {
            "exampleJp": "ときどき図書館で勉強します。",
            "exampleKana": "ときどきとしょかんでべんきょうします。",
            "exampleEn": "I sometimes study at the library.",
            "exampleId": "Saya terkadang belajar di perpustakaan."
          },
          {
            "exampleJp": "私は全然お酒を飲みません。",
            "exampleKana": "わたしはぜんぜんおさけをのみません。",
            "exampleEn": "I don't drink alcohol at all.",
            "exampleId": "Saya sama sekali tidak minum alkohol."
          }
        ]
      },
      {
        "id": "douyatte",
        "pattern": "どうやって",
        "jlpt": "N5",
        "descEn": "Asking for directions or methods ('how/in what way?').",
        "descId": "Menanyakan cara atau rute ('bagaimana caranya?').",
        "examples": [
          {
            "exampleJp": "どうやって駅へ行きますか。",
            "exampleKana": "どうやってえきへいきますか。",
            "exampleEn": "How do you get to the station?",
            "exampleId": "Bagaimana cara pergi ke stasiun?"
          },
          {
            "exampleJp": "どうやってこの漢字を書きますか。",
            "exampleKana": "どうやってこのかんじをかきますか。",
            "exampleEn": "How do you write this Kanji?",
            "exampleId": "Bagaimana cara menulis Kanji ini?"
          },
          {
            "exampleJp": "どうやって日本語を勉強しましたか。",
            "exampleKana": "どうやってにほんごをべんきょうしましたか。",
            "exampleEn": "How did you study Japanese?",
            "exampleId": "Bagaimana cara Anda belajar bahasa Jepang?"
          }
        ]
      },
      {
        "id": "demo",
        "pattern": "でも",
        "jlpt": "N5",
        "descEn": "Conjunction meaning 'but / however' at the start of a sentence.",
        "descId": "Kata hubung di awal kalimat yang berarti 'tetapi / namun'.",
        "examples": [
          {
            "exampleJp": "今日はいい天気です。でも、少し寒いです。",
            "exampleKana": "きょうはいいてんきです。でも、すこしさむいです。",
            "exampleEn": "The weather is nice today. But, it is a little cold.",
            "exampleId": "Hari ini cuacanya bagus. Tapi, sedikit dingin."
          },
          {
            "exampleJp": "この料理はおいしいです。でも、辛いです。",
            "exampleKana": "このりょうりはおいしいです。でも、からいです。",
            "exampleEn": "This food is delicious. However, it is spicy.",
            "exampleId": "Masakan ini enak. Tapi, pedas."
          },
          {
            "exampleJp": "映画を見たいです。でも、時間がありません。",
            "exampleKana": "えいがをみたいです。でも、じかんがありません。",
            "exampleEn": "I want to watch a movie. But, I don't have time.",
            "exampleId": "Saya ingin menonton film. Tapi, saya tidak punya waktu."
          }
        ]
      }
    ]
  },
  {
    "chapter": 10,
    "titleEn": "Perception & State Changes",
    "titleId": "Persepsi & Perubahan Keadaan",
    "patterns": [
      {
        "id": "v-naide-kudasai",
        "pattern": "Vないで ください",
        "jlpt": "N5",
        "descEn": "Requesting someone not to do an action ('Please don't do V').",
        "descId": "Meminta seseorang untuk tidak melakukan sesuatu ('Tolong jangan lakukan V').",
        "examples": [
          {
            "exampleJp": "ここで写真を撮らないでください。",
            "exampleKana": "ここで しゃしんを とらないで ください。",
            "exampleEn": "Please do not take pictures here.",
            "exampleId": "Tolong jangan mengambil foto di sini."
          },
          {
            "exampleJp": "授業中に話さないでください。",
            "exampleKana": "じゅぎょうちゅうに はなさないで ください。",
            "exampleEn": "Please do not talk during class.",
            "exampleId": "Tolong jangan berbicara saat jam pelajaran."
          },
          {
            "exampleJp": "このドアを開けないでください。",
            "exampleKana": "この ドアを あけないで ください。",
            "exampleEn": "Please do not open this door.",
            "exampleId": "Tolong jangan buka pintu ini."
          }
        ]
      },
      {
        "id": "v-temo-ii-desuka",
        "pattern": "Vても いいですか",
        "jlpt": "N5",
        "descEn": "Asking for permission ('May I do V?').",
        "descId": "Meminta izin untuk melakukan suatu tindakan ('Bolehkah saya melakukan V?').",
        "examples": [
          {
            "exampleJp": "ここで座ってもいいですか。",
            "exampleKana": "ここで すわっても いいですか。",
            "exampleEn": "May I sit here?",
            "exampleId": "Bolehkah saya duduk di sini?"
          },
          {
            "exampleJp": "窓を開けてもいいですか。",
            "exampleKana": "まどを あけても いいですか。",
            "exampleEn": "May I open the window?",
            "exampleId": "Bolehkah saya membuka jendela?"
          },
          {
            "exampleJp": "明日、休んでもいいですか。",
            "exampleKana": "あした、やすんでも いいですか。",
            "exampleEn": "May I take a day off tomorrow?",
            "exampleId": "Bolehkah saya libur besok?"
          }
        ]
      },
      {
        "id": "n-ga-v-te-imasu-state",
        "pattern": "N が Vて います (状態)",
        "jlpt": "N5",
        "descEn": "Expressing a state resulting from an action.",
        "descId": "Menyatakan keadaan yang dihasilkan dari suatu tindakan sebelumnya.",
        "examples": [
          {
            "exampleJp": "窓が開いています。",
            "exampleKana": "まどが あいて います。",
            "exampleEn": "The window is open.",
            "exampleId": "Jendelanya sedang terbuka."
          },
          {
            "exampleJp": "電気がついています。",
            "exampleKana": "でんきが ついて います。",
            "exampleEn": "The light is on.",
            "exampleId": "Lampunya sedang menyala."
          },
          {
            "exampleJp": "ドアが閉まっています。",
            "exampleKana": "ドアが しまって います。",
            "exampleEn": "The door is closed.",
            "exampleId": "Pintunya sedang tertutup."
          }
        ]
      },
      {
        "id": "v-te-kimasu",
        "pattern": "Vて きます",
        "jlpt": "N5",
        "descEn": "Going to do something and returning ('go and come back').",
        "descId": "Pergi untuk melakukan suatu aksi lalu kembali ('pergi dulu untuk...').",
        "examples": [
          {
            "exampleJp": "ちょっとコンビニへ行ってきます。",
            "exampleKana": "ちょっと コンビニへ いって きます。",
            "exampleEn": "I'm going to the convenience store (and will be back).",
            "exampleId": "Saya pergi ke minimarket sebentar (lalu akan kembali)."
          },
          {
            "exampleJp": "飲み物を買ってきます。",
            "exampleKana": "のみものを かって きます。",
            "exampleEn": "I'll go buy a drink and come back.",
            "exampleId": "Saya pergi beli minuman dulu ya."
          },
          {
            "exampleJp": "郵便局へ行ってきます。",
            "exampleKana": "ゆうびんきょくへ いって きます。",
            "exampleEn": "I'm going to the post office and will be back.",
            "exampleId": "Saya pergi ke kantor pos sebentar."
          }
        ]
      },
      {
        "id": "n-ga-miemasu-kikoemasu",
        "pattern": "N が見えます／聞こえます",
        "jlpt": "N5",
        "descEn": "Expressing spontaneous visual or auditory perception.",
        "descId": "Menyatakan sesuatu terlihat atau terdengar secara spontan/alami.",
        "examples": [
          {
            "exampleJp": "窓から富士山が見えます。",
            "exampleKana": "まどからふじさんがみえます。",
            "exampleEn": "I can see Mount Fuji from the window.",
            "exampleId": "Saya bisa melihat Gunung Fuji dari jendela."
          },
          {
            "exampleJp": "外から子供の声が聞こえます。",
            "exampleKana": "そとからこどものこえがきこえます。",
            "exampleEn": "I can hear children's voices from outside.",
            "exampleId": "Saya bisa mendengar suara anak-anak dari luar."
          },
          {
            "exampleJp": "遠くに海が見えます。",
            "exampleKana": "とおくにうみがみえます。",
            "exampleEn": "I can see the sea in the distance.",
            "exampleId": "Saya bisa melihat laut di kejauhan."
          }
        ]
      },
      {
        "id": "adjective-noun-ni-narimasu",
        "pattern": "Aくなります／Nになります",
        "jlpt": "N5",
        "descEn": "Expressing a change in state ('become A/N').",
        "descId": "Menyatakan perubahan keadaan ('menjadi A/N').",
        "examples": [
          {
            "exampleJp": "寒くなりましたね。",
            "exampleKana": "さむくなりましたね。",
            "exampleEn": "It has become cold, hasn't it?",
            "exampleId": "Sudah menjadi dingin ya."
          },
          {
            "exampleJp": "来年、二十歳になります。",
            "exampleKana": "らいねん、はたちになります。",
            "exampleEn": "I will turn twenty next year.",
            "exampleId": "Tahun depan saya akan berumur dua puluh tahun."
          },
          {
            "exampleJp": "日本語が上手になりました。",
            "exampleKana": "にほんごがじょうずになりました。",
            "exampleEn": "My Japanese has become better.",
            "exampleId": "Bahasa Jepang saya sudah menjadi lebih mahir."
          }
        ]
      },
      {
        "id": "n-basho-o-movement",
        "pattern": "N(場所) を V",
        "jlpt": "N5",
        "descEn": "Moving through or along a space (e.g. 'walk along the street').",
        "descId": "Melalui atau melintasi suatu area (misal: 'berjalan menyusuri jalan').",
        "examples": [
          {
            "exampleJp": "公園を散歩します。",
            "exampleKana": "こうえんをさんぽします。",
            "exampleEn": "I will take a walk in the park.",
            "exampleId": "Saya akan berjalan-jalan di taman."
          },
          {
            "exampleJp": "この道をまっすぐ行きます。",
            "exampleKana": "このみちをまっすぐいきます。",
            "exampleEn": "Go straight along this road.",
            "exampleId": "Jalan lurus menyusuri jalan ini."
          },
          {
            "exampleJp": "空を鳥が飛んでいます。",
            "exampleKana": "そらをとりがとんでいます。",
            "exampleEn": "A bird is flying through the sky.",
            "exampleId": "Seekor burung sedang terbang melintasi langit."
          }
        ]
      },
      {
        "id": "n-wa-contrastive",
        "pattern": "N は (対比)",
        "jlpt": "N5",
        "descEn": "Using 'wa' particle for contrast/comparison.",
        "descId": "Menggunakan partikel 'wa' untuk menunjukkan perbandingan/kontras.",
        "examples": [
          {
            "exampleJp": "野菜は食べますが、肉は食べません。",
            "exampleKana": "やさいはたべますが、にくはたべません。",
            "exampleEn": "I eat vegetables, but I don't eat meat.",
            "exampleId": "Saya makan sayur, tapi saya tidak makan daging."
          },
          {
            "exampleJp": "今日は忙しいですが、明日は暇です。",
            "exampleKana": "きょうはいそがしいですが、あしたはひまです。",
            "exampleEn": "I am busy today, but I am free tomorrow.",
            "exampleId": "Hari ini saya sibuk, tapi besok saya luang."
          },
          {
            "exampleJp": "コーヒーは飲みますが、紅茶は飲みません。",
            "exampleKana": "こーひーはのみますが、こうちゃはのみません。",
            "exampleEn": "I drink coffee, but I don't drink black tea.",
            "exampleId": "Saya minum kopi, tapi saya tidak minum teh hitam."
          }
        ]
      }
    ]
  },
  {
    "chapter": 11,
    "titleEn": "Contrast & Confusion",
    "titleId": "Perbandingan Kontras & Kondisi Waktu",
    "patterns": [
      {
        "id": "v-tari-v-tari-shimasu",
        "pattern": "Vたり Vたりします",
        "jlpt": "N5",
        "descEn": "Listing representative actions non-exhaustively ('doing things like A and B').",
        "descId": "Menyebutkan beberapa tindakan secara tidak berurutan ('melakukan aktivitas seperti A dan B').",
        "examples": [
          {
            "exampleJp": "日曜日は本を読んだり、映画を見たりします。",
            "exampleKana": "にちようびはほんをよんだり、えいがをみたりします。",
            "exampleEn": "On Sundays, I do things like reading books and watching movies.",
            "exampleId": "Pada hari Minggu, saya melakukan hal-hal seperti membaca buku dan menonton film."
          },
          {
            "exampleJp": "昨日は買い物をしたり、料理を作ったりしました。",
            "exampleKana": "きのうはかいものをしたり、りょうりをつくったりしました。",
            "exampleEn": "Yesterday, I did things like shopping and cooking.",
            "exampleId": "Kemarin, saya melakukan hal-hal seperti berbelanja dan memasak."
          },
          {
            "exampleJp": "休みの日には、友達と話したり、公園を散歩したりしたいです。",
            "exampleKana": "やすみのひには、ともだちとはなしたり、こうえんをさんぽしたりしたいです。",
            "exampleEn": "On my day off, I want to do things like talk with friends and take a walk in the park.",
            "exampleId": "Pada hari libur, saya ingin melakukan hal-hal seperti mengobrol dengan teman dan berjalan-jalan di taman."
          }
        ]
      },
      {
        "id": "n1-wa-ga-n2-wa",
        "pattern": "N1 は～が、N2 は～",
        "jlpt": "N5",
        "descEn": "Direct contrast between two nouns/topics.",
        "descId": "Perbandingan kontras langsung antara dua kata benda/topik.",
        "examples": [
          {
            "exampleJp": "日本料理は好きですが、インドネシア料理はあまり食べません。",
            "exampleKana": "にほんりょうりはすきですが、インドネシアりょうりはあまりたべません。",
            "exampleEn": "I like Japanese food, but I don't really eat Indonesian food.",
            "exampleId": "Saya suka masakan Jepang, tetapi saya tidak terlalu sering makan masakan Indonesia."
          },
          {
            "exampleJp": "兄は背が高いですが、私は低いです。",
            "exampleKana": "あにはせがたかいですが、わたしはひくいです。",
            "exampleEn": "My older brother is tall, but I am short.",
            "exampleId": "Kakak laki-laki saya tinggi, tetapi saya pendek."
          },
          {
            "exampleJp": "今日は天気がいいですが、明日は雨が降るでしょう。",
            "exampleKana": "きょうはてんきがいいですが、あしたはあめがふるでしょう。",
            "exampleEn": "The weather is nice today, but it will probably rain tomorrow.",
            "exampleId": "Cuaca hari ini bagus, tetapi besok mungkin akan hujan."
          }
        ]
      },
      {
        "id": "a-n-v-toki",
        "pattern": "とき",
        "jlpt": "N5",
        "descEn": "Expressing time or condition ('when doing/being...').",
        "descId": "Menyatakan waktu atau kondisi kejadian ('saat/ketika...').",
        "examples": [
          {
            "exampleJp": "暇なとき、よく音楽を聞きます。",
            "exampleKana": "ひまなとき、よくおんがくをききます。",
            "exampleEn": "When I am free, I often listen to music.",
            "exampleId": "Saat saya senggang, saya sering mendengarkan musik."
          },
          {
            "exampleJp": "子供のとき、よく公園で遊びました。",
            "exampleKana": "こどものとき、よくこうえんであそびました。",
            "exampleEn": "When I was a child, I often played in the park.",
            "exampleId": "Saat saya masih kecil, saya sering bermain di taman."
          },
          {
            "exampleJp": "疲れたとき、温かいお茶を飲みます。",
            "exampleKana": "つかれたとき、あたたかいおちゃをのみます。",
            "exampleEn": "When I am tired, I drink hot tea.",
            "exampleId": "Saat saya lelah, saya minum teh hangat."
          }
        ]
      },
      {
        "id": "doushimasuka",
        "pattern": "どうしますか",
        "jlpt": "N5",
        "descEn": "Asking what someone will do in a situation.",
        "descId": "Menanyakan apa yang akan dilakukan dalam suatu kondisi.",
        "examples": [
          {
            "exampleJp": "雨が降ってきました。どうしますか。",
            "exampleKana": "あめがふってきました。どうしますか。",
            "exampleEn": "It has started to rain. What will you do?",
            "exampleId": "Hujan mulai turun. Apa yang akan kamu lakukan?"
          },
          {
            "exampleJp": "時間がありません。どうしますか。",
            "exampleKana": "じかんがありません。どうしますか。",
            "exampleEn": "There is no time. What are you going to do?",
            "exampleId": "Tidak ada waktu lagi. Apa yang akan kamu lakukan?"
          },
          {
            "exampleJp": "道がわかりません。どうしますか。",
            "exampleKana": "みちがわかりません。どうしますか。",
            "exampleEn": "I don't know the way. What shall we do?",
            "exampleId": "Saya tidak tahu jalannya. Apa yang harus kita lakukan?"
          }
        ]
      }
    ]
  },
  {
    "chapter": 12,
    "titleEn": "Casual Style & Advising",
    "titleId": "Bahasa Kasual & Memberi Nasihat",
    "patterns": [
      {
        "id": "casual-speech",
        "pattern": "普通体／友達言葉",
        "jlpt": "N5",
        "descEn": "Casual/informal speech style used among close relationships.",
        "descId": "Gaya bahasa informal/akrab di antara teman atau keluarga.",
        "examples": [
          {
            "exampleJp": "昨日、どこへ行ったの？",
            "exampleKana": "きのう、どこへいったの？",
            "exampleEn": "Where did you go yesterday?",
            "exampleId": "Kemarin pergi ke mana?"
          },
          {
            "exampleJp": "明日、一緒に映画を見ようよ。",
            "exampleKana": "あした、いっしょにえいがをみようよ。",
            "exampleEn": "Let's watch a movie together tomorrow.",
            "exampleId": "Besok ayo nonton film bareng."
          },
          {
            "exampleJp": "このケーキ、すごくおいしいね！",
            "exampleKana": "このケーキ、すごくおいしいね！",
            "exampleEn": "This cake is really delicious, isn't it!",
            "exampleId": "Kue ini enak banget, ya!"
          }
        ]
      },
      {
        "id": "plain-form-ndesu",
        "pattern": "普通形 んです",
        "jlpt": "N5",
        "descEn": "Expressing reason, emphasis, or seeking clarification.",
        "descId": "Menjelaskan alasan, memberikan penekanan, atau meminta kejelasan.",
        "examples": [
          {
            "exampleJp": "どうして学校を休んだんですか。",
            "exampleKana": "どうしてがっこうをやすんだんですか。",
            "exampleEn": "Why did you take a day off from school?",
            "exampleId": "Kenapa (kamu) tidak masuk sekolah?"
          },
          {
            "exampleJp": "明日、試験があるんです。",
            "exampleKana": "あした、しけんがあるんです。",
            "exampleEn": "I have an exam tomorrow.",
            "exampleId": "Besok ada ujian."
          },
          {
            "exampleJp": "昨日、新しいカメラを買ったんです。",
            "exampleKana": "きのう、あたらしいカメラをかったんです。",
            "exampleEn": "I bought a new camera yesterday.",
            "exampleId": "Kemarin saya membeli kamera baru."
          }
        ]
      },
      {
        "id": "v-hou-ga-ii-desu",
        "pattern": "Vほうがいいです",
        "jlpt": "N5",
        "descEn": "Giving strong advice or suggestions ('had better / should').",
        "descId": "Memberikan saran atau nasihat ('sebaiknya / lebih baik melakukan...').",
        "examples": [
          {
            "exampleJp": "毎日、野菜を食べたほうがいいです。",
            "exampleKana": "まいにち、やさいをたべたほうがいいです。",
            "exampleEn": "You should eat vegetables every day.",
            "exampleId": "Sebaiknya kamu makan sayur setiap hari."
          },
          {
            "exampleJp": "夜は早く寝たほうがいいですよ。",
            "exampleKana": "よるははやくねたほうがいいですよ。",
            "exampleEn": "You should go to bed early at night.",
            "exampleId": "Sebaiknya kamu tidur lebih awal di malam hari."
          },
          {
            "exampleJp": "傘を持って行ったほうがいいです。",
            "exampleKana": "かさをもっていったほうがいいです。",
            "exampleEn": "You should take an umbrella with you.",
            "exampleId": "Sebaiknya kamu membawa payung."
          }
        ]
      },
      {
        "id": "v-before",
        "pattern": "V前に",
        "jlpt": "N5",
        "descEn": "Action occurring before another event ('before doing...').",
        "descId": "Tindakan yang terjadi sebelum kejadian lain ('sebelum melakukan...').",
        "examples": [
          {
            "exampleJp": "食事の前に、手を洗います。",
            "exampleKana": "しょくじのまえに、てをあらいます。",
            "exampleEn": "I wash my hands before eating.",
            "exampleId": "Saya mencuci tangan sebelum makan."
          },
          {
            "exampleJp": "寝る前に、本を読みます。",
            "exampleKana": "ねるまえに、ほんをよみます。",
            "exampleEn": "I read a book before going to bed.",
            "exampleId": "Saya membaca buku sebelum tidur."
          },
          {
            "exampleJp": "日本へ行く前に、日本語を勉強しました。",
            "exampleKana": "にほんへいくまえに、にほんごをべんきょうしました。",
            "exampleEn": "I studied Japanese before going to Japan.",
            "exampleId": "Saya belajar bahasa Jepang sebelum pergi ke Jepang."
          }
        ]
      },
      {
        "id": "v-te-kara",
        "pattern": "Vてから",
        "jlpt": "N5",
        "descEn": "Action occurring after another event finishes ('after doing...').",
        "descId": "Tindakan yang dilakukan setelah aksi sebelumnya selesai ('setelah melakukan...').",
        "examples": [
          {
            "exampleJp": "手を洗ってから、ごはんを食べます。",
            "exampleKana": "てをあらってから、ごはんをたべます。",
            "exampleEn": "After washing my hands, I will eat a meal.",
            "exampleId": "Setelah mencuci tangan, saya akan makan."
          },
          {
            "exampleJp": "宿題をしてから、テレビを見ました。",
            "exampleKana": "しゅくだいをしてから、テレビをみました。",
            "exampleEn": "After doing my homework, I watched TV.",
            "exampleId": "Setelah mengerjakan PR, saya menonton TV."
          },
          {
            "exampleJp": "学校が終わってから、友達と遊びます。",
            "exampleKana": "がっこうがおわってから、ともだちとあそびます。",
            "exampleEn": "After school finishes, I will hang out with my friends.",
            "exampleId": "Setelah sekolah selesai, saya akan bermain dengan teman."
          }
        ]
      }
    ]
  },
  {
    "chapter": 13,
    "titleEn": "Knowledge States & Named Expressions",
    "titleId": "Status Pengetahuan & Modifikasi Kalimat",
    "patterns": [
      {
        "id": "v-ta-koto-ga-arimasu",
        "pattern": "Vた ことがあります",
        "jlpt": "N5",
        "descEn": "Expressing past experience ('have done V before').",
        "descId": "Menyatakan pengalaman di masa lalu ('pernah melakukan V').",
        "examples": [
          {
            "exampleJp": "日本へ行ったことがあります。",
            "exampleKana": "にほんへいったことがあります。",
            "exampleEn": "I have been to Japan before.",
            "exampleId": "Saya pernah pergi ke Jepang."
          },
          {
            "exampleJp": "すしを食べたことがありますか。",
            "exampleKana": "すしをたべたことがありますか。",
            "exampleEn": "Have you ever eaten sushi?",
            "exampleId": "Apakah Anda pernah makan sushi?"
          },
          {
            "exampleJp": "この映画を見たことがありません。",
            "exampleKana": "このえいがをみたことがありません。",
            "exampleEn": "I have never seen this movie.",
            "exampleId": "Saya belum pernah menonton film ini."
          }
        ]
      },
      {
        "id": "plain-form-noun-modifier",
        "pattern": "普通形 ＋ N",
        "jlpt": "N5",
        "descEn": "Modifying a noun with a relative clause.",
        "descId": "Memodifikasi kata benda menggunakan klausa kata kerja bentuk biasa.",
        "examples": [
          {
            "exampleJp": "昨日買った本は面白いです。",
            "exampleKana": "きのうかったほんはおもしろいです。",
            "exampleEn": "The book I bought yesterday is interesting.",
            "exampleId": "Buku yang saya beli kemarin menarik."
          },
          {
            "exampleJp": "これは私が住んでいる町です。",
            "exampleKana": "これはわたしがすんでいるまちです。",
            "exampleEn": "This is the town where I live.",
            "exampleId": "Ini adalah kota tempat saya tinggal."
          },
          {
            "exampleJp": "さっき会った人は田中さんです。",
            "exampleKana": "さっきあったひとはたなかさんです。",
            "exampleEn": "The person I met just now is Mr. Tanaka.",
            "exampleId": "Orang yang tadi saya temui adalah Pak Tanaka."
          }
        ]
      },
      {
        "id": "shitteimasu-shirimasen",
        "pattern": "知っています／知りません",
        "jlpt": "N5",
        "descEn": "Expressing states of knowing or not knowing.",
        "descId": "Menyatakan status tahu atau tidak tahu.",
        "examples": [
          {
            "exampleJp": "私は彼の名前を知っています。",
            "exampleKana": "わたしはかれのなまえをしっています。",
            "exampleEn": "I know his name.",
            "exampleId": "Saya tahu namanya."
          },
          {
            "exampleJp": "この歌を知っていますか。",
            "exampleKana": "このうたをしっていますか。",
            "exampleEn": "Do you know this song?",
            "exampleId": "Apakah Anda tahu lagu ini?"
          },
          {
            "exampleJp": "そのことは知りません。",
            "exampleKana": "そのことはしりません。",
            "exampleEn": "I don't know about that matter.",
            "exampleId": "Saya tidak tahu soal hal itu."
          }
        ]
      },
      {
        "id": "n1-to-iu-n2",
        "pattern": "N1 という N2",
        "jlpt": "N5",
        "descEn": "Naming or identifying a noun ('N2 named N1').",
        "descId": "Menyebut nama atau mengidentifikasi benda ('N2 yang bernama N1').",
        "examples": [
          {
            "exampleJp": "これは「すき焼き」という料理です。",
            "exampleKana": "これは「すきやき」というりょうりです。",
            "exampleEn": "This is a dish called 'Sukiyaki'.",
            "exampleId": "Ini adalah masakan yang disebut 'Sukiyaki'."
          },
          {
            "exampleJp": "田中という学生を知っていますか。",
            "exampleKana": "たなかというがくせいをしっていますか。",
            "exampleEn": "Do you know a student named Tanaka?",
            "exampleId": "Apakah Anda tahu siswa yang bernama Tanaka?"
          },
          {
            "exampleJp": "「さくら」という名前の花が好きです。",
            "exampleKana": "「さくら」というなまえのはながすきです。",
            "exampleEn": "I like the flower named 'Sakura'.",
            "exampleId": "Saya suka bunga yang bernama 'Sakura'."
          }
        ]
      }
    ]
  },
  {
    "chapter": 14,
    "titleEn": "Prohibitions & Obligation Rules",
    "titleId": "Larangan & Aturan Kewajiban",
    "patterns": [
      {
        "id": "v-to",
        "pattern": "V辞書形 と、～",
        "jlpt": "N5",
        "descEn": "Natural consequence conditional ('whenever / if... then...').",
        "descId": "Pengandaian konsekuensi alamiah ('begitu / jika... maka...').",
        "examples": [
          {
            "exampleJp": "春になると、花が咲きます。",
            "exampleKana": "はるになると、はながさきます。",
            "exampleEn": "When spring comes, flowers bloom.",
            "exampleId": "Begitu musim semi tiba, bunga-bunga bermekaran."
          },
          {
            "exampleJp": "このボタンを押すと、ドアが開きます。",
            "exampleKana": "このボタンをおすと、ドアがあきます。",
            "exampleEn": "If you press this button, the door opens.",
            "exampleId": "Jika menekan tombol ini, pintunya terbuka."
          },
          {
            "exampleJp": "右に曲がると、郵便局があります。",
            "exampleKana": "みぎにまがると、ゆうびんきょくがあります。",
            "exampleEn": "If you turn right, there is a post office.",
            "exampleId": "Jika belok ke kanan, ada kantor pos."
          }
        ]
      },
      {
        "id": "v-te-wa-ikemasen",
        "pattern": "Vてはいけません",
        "jlpt": "N5",
        "descEn": "Expressing prohibition ('must not do V').",
        "descId": "Menyatakan larangan keras ('tidak boleh melakukan V').",
        "examples": [
          {
            "exampleJp": "ここで写真を撮ってはいけません。",
            "exampleKana": "ここでしゃしんをとってはいけません。",
            "exampleEn": "You must not take photos here.",
            "exampleId": "Tidak boleh mengambil foto di sini."
          },
          {
            "exampleJp": "授業中に寝てはいけません。",
            "exampleKana": "じゅぎょうちゅうにねてはいけません。",
            "exampleEn": "You must not sleep during class.",
            "exampleId": "Tidak boleh tidur saat pelajaran berlangsung."
          },
          {
            "exampleJp": "教室で騒いではいけません。",
            "exampleKana": "きょうしつでさわいではいけません。",
            "exampleEn": "You must not make noise in the classroom.",
            "exampleId": "Tidak boleh berisik di dalam kelas."
          }
        ]
      },
      {
        "id": "v-nakereba-narimasen",
        "pattern": "Vなければなりません",
        "jlpt": "N5",
        "descEn": "Expressing obligation ('must do V').",
        "descId": "Menyatakan keharusan atau kewajiban ('harus melakukan V').",
        "examples": [
          {
            "exampleJp": "毎日日本語を勉強しなければなりません。",
            "exampleKana": "まいにちにほんごをべんきょうしなければなりません。",
            "exampleEn": "I must study Japanese every day.",
            "exampleId": "Saya harus belajar bahasa Jepang setiap hari."
          },
          {
            "exampleJp": "宿題を今日出さなければなりません。",
            "exampleKana": "しゅくだいをきょうださなければなりません。",
            "exampleEn": "I must submit the homework today.",
            "exampleId": "Saya harus mengumpulkan PR hari ini."
          },
          {
            "exampleJp": "薬を飲まなければなりません。",
            "exampleKana": "くすりをのまなければなりません。",
            "exampleEn": "I must take the medicine.",
            "exampleId": "Saya harus minum obat."
          }
        ]
      },
      {
        "id": "v-nakute-mo-ii-desu",
        "pattern": "Vなくてもいいです",
        "jlpt": "N5",
        "descEn": "Expressing lack of obligation ('do not have to do V').",
        "descId": "Menyatakan tidak adanya keharusan ('tidak usah melakukan V').",
        "examples": [
          {
            "exampleJp": "明日は学校へ行かなくてもいいです。",
            "exampleKana": "あしたはがっこうへいかなくてもいいです。",
            "exampleEn": "You don't have to go to school tomorrow.",
            "exampleId": "Besok tidak perlu pergi ke sekolah."
          },
          {
            "exampleJp": "傘を持っていかなくてもいいです。",
            "exampleKana": "かさをもっていかなくてもいいです。",
            "exampleEn": "You don't have to bring an umbrella.",
            "exampleId": "Tidak perlu membawa payung."
          },
          {
            "exampleJp": "靴を脱がなくてもいいです。",
            "exampleKana": "くつをぬがなくてもいいです。",
            "exampleEn": "You don't have to take off your shoes.",
            "exampleId": "Tidak perlu melepas sepatu."
          }
        ]
      },
      {
        "id": "plain-form-to-omoimasu",
        "pattern": "普通形 と思います",
        "jlpt": "N5",
        "descEn": "Expressing conjecture or opinion ('I think that...').",
        "descId": "Menyatakan pendapat atau dugaan ('Saya kira / pikir...').",
        "examples": [
          {
            "exampleJp": "明日は雨が降ると思います。",
            "exampleKana": "あしたはあめがふるとおもいます。",
            "exampleEn": "I think it will rain tomorrow.",
            "exampleId": "Saya pikir besok akan hujan."
          },
          {
            "exampleJp": "この映画はとても面白いと思います。",
            "exampleKana": "このえいがはとてもおもしろいとおもいます。",
            "exampleEn": "I think this movie is very interesting.",
            "exampleId": "Saya pikir film ini sangat menarik."
          },
          {
            "exampleJp": "彼は日本へ行くと思います。",
            "exampleKana": "かれはにほんへいくとおもいます。",
            "exampleEn": "I think he will go to Japan.",
            "exampleId": "Saya pikir dia akan pergi ke Jepang."
          }
        ]
      },
      {
        "id": "to-iimasu",
        "pattern": "「～」と言います",
        "jlpt": "N5",
        "descEn": "Quoting direct or indirect speech ('says...').",
        "descId": "Mengutip ucapan langsung atau tidak langsung ('berkata...').",
        "examples": [
          {
            "exampleJp": "先生は「明日テストがあります」と言いました。",
            "exampleKana": "せんせいは「あしたテストがあります」といいました。",
            "exampleEn": "The teacher said, \"There is a test tomorrow.\"",
            "exampleId": "Guru berkata, \"Besok ada ujian.\""
          },
          {
            "exampleJp": "田中さんは、また来週来ると言っていました。",
            "exampleKana": "たなかさんは、またらいしゅうくるといっていました。",
            "exampleEn": "Tanaka-san said that he would come again next week.",
            "exampleId": "Tanaka-san berkata bahwa dia akan datang lagi minggu depan."
          },
          {
            "exampleJp": "母は「早く寝なさい」と言います。",
            "exampleKana": "ははは「はやくねなさい」といいます。",
            "exampleEn": "My mother says, \"Go to sleep early.\"",
            "exampleId": "Ibu berkata, \"Cepat tidur.\""
          }
        ]
      }
    ]
  },
  {
    "chapter": 15,
    "titleEn": "Causes of Events",
    "titleId": "Sebab Akibat & Keadaan Lanjutan",
    "patterns": [
      {
        "id": "plain-form-soudes",
        "pattern": "普通形 そうです",
        "jlpt": "N5",
        "descEn": "Reporting hearsay ('I heard that...').",
        "descId": "Menyatakan kabar angin / kabar burung ('katanya...').",
        "examples": [
          {
            "exampleJp": "天気予報によると、明日は雨が降るそうです。",
            "exampleKana": "てんきよほうによると、あしたはあめがふるそうです。",
            "exampleEn": "According to the weather forecast, I heard it will rain tomorrow.",
            "exampleId": "Menurut ramalan cuaca, katanya besok akan hujan."
          },
          {
            "exampleJp": "田中さんは来週、日本へ帰るそうです。",
            "exampleKana": "たなかさんはらいしゅう、にほんへかえるそうです。",
            "exampleEn": "I heard that Mr. Tanaka is returning to Japan next week.",
            "exampleId": "Katanya Pak Tanaka akan pulang ke Jepang minggu depan."
          },
          {
            "exampleJp": "このレストランはおいしいそうです。",
            "exampleKana": "このレストランはおいしいそうです。",
            "exampleEn": "I heard that this restaurant is delicious.",
            "exampleId": "Katanya restoran ini enak."
          }
        ]
      },
      {
        "id": "tara-conditional",
        "pattern": "～たら",
        "jlpt": "N5",
        "descEn": "Past conditional ('if / when...').",
        "descId": "Pengandaian kondisi masa lampau ('jika / kalau...').",
        "examples": [
          {
            "exampleJp": "時間ができたら、遊びに行きます。",
            "exampleKana": "じかんができたら、あそびにいきます。",
            "exampleEn": "If I have time, I will go hang out.",
            "exampleId": "Kalau ada waktu, saya akan pergi bermain."
          },
          {
            "exampleJp": "日本に着いたら、電話してください。",
            "exampleKana": "にほんについたら、でんわしてください。",
            "exampleEn": "Please call me when you arrive in Japan.",
            "exampleId": "Kalau sudah sampai di Jepang, tolong telepon saya."
          },
          {
            "exampleJp": "安かったら、この靴を買います。",
            "exampleKana": "やすかったら、このくつをかいます。",
            "exampleEn": "If it is cheap, I will buy these shoes.",
            "exampleId": "Kalau murah, saya akan membeli sepatu ini."
          }
        ]
      },
      {
        "id": "temo-conditional",
        "pattern": "～ても",
        "jlpt": "N5",
        "descEn": "Concessive conditional ('even if...').",
        "descId": "Pengandaian pertentangan ('walaupun / biarpun...').",
        "examples": [
          {
            "exampleJp": "雨が降っても、散歩に行きます。",
            "exampleKana": "あめがふっても、さんぽにいきます。",
            "exampleEn": "Even if it rains, I will go for a walk.",
            "exampleId": "Walaupun hujan, saya akan tetap pergi jalan-jalan."
          },
          {
            "exampleJp": "高くても、このバッグがほしいです。",
            "exampleKana": "たかくても、このバッグがほしいです。",
            "exampleEn": "Even if it is expensive, I want this bag.",
            "exampleId": "Biarpun mahal, saya ingin tas ini."
          },
          {
            "exampleJp": "何回聞いても、わかりません。",
            "exampleKana": "なんかいきいても、わかりません。",
            "exampleEn": "Even if I ask many times, I don't understand.",
            "exampleId": "Walaupun bertanya berkali-kali, saya tidak mengerti."
          }
        ]
      },
      {
        "id": "v-te-imasu-state-continued",
        "pattern": "Vて います (状態の継続)",
        "jlpt": "N5",
        "descEn": "State of ongoing condition.",
        "descId": "Keadaan kondisi yang terus berlanjut.",
        "examples": [
          {
            "exampleJp": "私は東京に住んでいます。",
            "exampleKana": "わたしはとうきょうにすんでいます。",
            "exampleEn": "I live in Tokyo.",
            "exampleId": "Saya tinggal di Tokyo."
          },
          {
            "exampleJp": "窓が開いています。",
            "exampleKana": "まどがあいています。",
            "exampleEn": "The window is open.",
            "exampleId": "Jendelanya sedang terbuka."
          },
          {
            "exampleJp": "彼は結婚しています。",
            "exampleKana": "かれはけっこんしています。",
            "exampleEn": "He is married.",
            "exampleId": "Dia sudah menikah."
          }
        ]
      },
      {
        "id": "n-de-reason",
        "pattern": "N で (原因)",
        "jlpt": "N5",
        "descEn": "Indicates cause or reason for an event ('due to / because of N').",
        "descId": "Menunjukkan sebab atau alasan terjadinya peristiwa ('karena N').",
        "examples": [
          {
            "exampleJp": "地震で電車が止まりました。",
            "exampleKana": "じしんででんしゃがとまりました。",
            "exampleEn": "The train stopped because of the earthquake.",
            "exampleId": "Kereta berhenti karena gempa bumi."
          },
          {
            "exampleJp": "病気で学校を休みます。",
            "exampleKana": "びょうきでがっこうをやすみます。",
            "exampleEn": "I am absent from school due to illness.",
            "exampleId": "Saya absen sekolah karena sakit."
          },
          {
            "exampleJp": "事故で道が混んでいます。",
            "exampleKana": "じこでみちがこんでいます。",
            "exampleEn": "The road is crowded because of an accident.",
            "exampleId": "Jalanan macet karena ada kecelakaan."
          }
        ]
      }
    ]
  }
];
