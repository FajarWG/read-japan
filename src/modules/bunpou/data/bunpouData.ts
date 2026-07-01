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
            "exampleJp": "あれは私の本です。",
            "exampleKana": "あれはわたしのほんです。",
            "exampleEn": "That is my book.",
            "exampleId": "Itu adalah buku saya."
          },
          {
            "exampleJp": "今日は月曜日です。",
            "exampleKana": "きょうはげつようびです。",
            "exampleEn": "Today is Monday.",
            "exampleId": "Hari ini adalah hari Senin."
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
            "exampleEn": "Are you Tanaka-san?",
            "exampleId": "Apakah Anda Tanaka-san?"
          },
          {
            "exampleJp": "それは辞書ですか。",
            "exampleKana": "それはじしょですか。",
            "exampleEn": "Is that a dictionary?",
            "exampleId": "Apakah itu kamus?"
          },
          {
            "exampleJp": "ここは学校ですか。",
            "exampleKana": "ここはがっこうですか。",
            "exampleEn": "Is this a school?",
            "exampleId": "Apakah ini sekolah?"
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
            "exampleKana": "といれはどちらですか。",
            "exampleEn": "Where is the restroom?",
            "exampleId": "Di mana letak toilet?"
          },
          {
            "exampleJp": "試験はいつですか。",
            "exampleKana": "しけんはいつですか。",
            "exampleEn": "When is the exam?",
            "exampleId": "Kapan ujiannya?"
          },
          {
            "exampleJp": "あなたの趣味は何ですか。",
            "exampleKana": "あなたのしゅみはなんですか。",
            "exampleEn": "What is your hobby?",
            "exampleId": "Apa hobi Anda?"
          }
        ]
      },
      {
        "id": "n1-no-n2",
        "pattern": "N1 の N2",
        "jlpt": "N5",
        "descEn": "Indicates possession, origin, or modification ('N2 of N1').",
        "descId": "Menunjukkan kepemilikan, asal, atau modifikasi ('N2 milik/bagian dari N1').",
        "examples": [
          {
            "exampleJp": "これは日本語の本です。",
            "exampleKana": "これはにほんごのほんです。",
            "exampleEn": "This is a Japanese language book.",
            "exampleId": "Ini adalah buku bahasa Jepang."
          },
          {
            "exampleJp": "あれは私の母の車です。",
            "exampleKana": "あれはわたしのははのくるまです。",
            "exampleEn": "That is my mother's car.",
            "exampleId": "Itu adalah mobil ibu saya."
          },
          {
            "exampleJp": "それは日本の大学の地図です。",
            "exampleKana": "それはにほんのだいがくのちずです。",
            "exampleEn": "That is a map of a Japanese university.",
            "exampleId": "Itu adalah peta universitas di Jepang."
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
            "exampleJp": "私はパンと牛乳を買いました。",
            "exampleKana": "わたしはぱんとぎゅうにゅうをかいました。",
            "exampleEn": "I bought bread and milk.",
            "exampleId": "Saya membeli roti dan susu."
          },
          {
            "exampleJp": "田中さんと佐藤さんは友達です。",
            "exampleKana": "たなかさんとさとうさんはともだちです。",
            "exampleEn": "Tanaka-san and Sato-san are friends.",
            "exampleId": "Tanaka-san dan Sato-san adalah teman."
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
            "exampleJp": "私も日本へ行きます。",
            "exampleKana": "わたしもにほんへいきます。",
            "exampleEn": "I am also going to Japan.",
            "exampleId": "Saya juga akan pergi ke Jepang."
          },
          {
            "exampleJp": "このケーキはおいしいです。コーヒーもおいしいです。",
            "exampleKana": "このけーきはおいしいです。こーひーもおいしいです。",
            "exampleEn": "This cake is delicious. The coffee is also delicious.",
            "exampleId": "Kue ini enak. Kopinya juga enak."
          },
          {
            "exampleJp": "昨日、デパートで服と靴も買いました。",
            "exampleKana": "きのう、でぱーとでふくとくつもかいました。",
            "exampleEn": "Yesterday, I bought clothes and also shoes at the department store.",
            "exampleId": "Kemarin, saya membeli baju dan juga sepatu di toserba."
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
        "descEn": "Demonstrative pronouns for objects close to speaker / listener / far from both.",
        "descId": "Kata ganti penunjuk benda di dekat pembicara (ini) / lawan bicara (itu) / jauh dari keduanya (itu sana).",
        "examples": [
          {
            "exampleJp": "これは私の本です。",
            "exampleKana": "これはわたし　の　ほん　です。",
            "exampleEn": "This is my book.",
            "exampleId": "Ini adalah buku saya."
          },
          {
            "exampleJp": "それは何ですか。",
            "exampleKana": "それは　なん　です　か。",
            "exampleEn": "What is that (near you)?",
            "exampleId": "Apa itu (di dekat Anda)?"
          },
          {
            "exampleJp": "あれは学校です。",
            "exampleKana": "あれは　がっこう　です。",
            "exampleEn": "That (over there) is a school.",
            "exampleId": "Itu (di sana) adalah sekolah."
          }
        ]
      },
      {
        "id": "kono-sono-ano",
        "pattern": "この／その／あの N",
        "jlpt": "N5",
        "descEn": "Demonstrative determiners directly modifying a noun.",
        "descId": "Kata penunjuk yang langsung melekat sebelum kata benda (N ini/itu/itu sana).",
        "examples": [
          {
            "exampleJp": "この傘は私のです。",
            "exampleKana": "この　かさ　は　わたし　の　です。",
            "exampleEn": "This umbrella is mine.",
            "exampleId": "Payung ini adalah milik saya."
          },
          {
            "exampleJp": "そのペンは誰のですか。",
            "exampleKana": "その　ぺん　は　だれ　の　です　か。",
            "exampleEn": "Whose pen is that?",
            "exampleId": "Pulpen itu milik siapa?"
          },
          {
            "exampleJp": "あの車は新しいです。",
            "exampleKana": "あの　くるま　は　あたらしい　です。",
            "exampleEn": "That car over there is new.",
            "exampleId": "Mobil itu (di sana) baru."
          }
        ]
      },
      {
        "id": "koko-soko-asoko-doko",
        "pattern": "ここ／そこ／あそこ／どこ (こちら／そちら／あちら／どちら)",
        "jlpt": "N5",
        "descEn": "Demonstratives for locations (here, there, over there, where).",
        "descId": "Kata penunjuk tempat (sini, situ, sana, mana) atau arah (sini/situ/sana/mana bentuk sopan).",
        "examples": [
          {
            "exampleJp": "ここは私の部屋です。",
            "exampleKana": "ここは　わたし　の　へや　です。",
            "exampleEn": "This is my room.",
            "exampleId": "Ini adalah kamar saya."
          },
          {
            "exampleJp": "トイレはどこですか。",
            "exampleKana": "といれ　は　どこ　です　か。",
            "exampleEn": "Where is the restroom?",
            "exampleId": "Di mana kamar kecilnya?"
          },
          {
            "exampleJp": "あそこは公園です。",
            "exampleKana": "あそこは　こうえん　です。",
            "exampleEn": "That place over there is a park.",
            "exampleId": "Tempat di sana adalah taman."
          }
        ]
      },
      {
        "id": "n-o-kudasai",
        "pattern": "N をください",
        "jlpt": "N5",
        "descEn": "Polite request for an item ('Please give me N').",
        "descId": "Permintaan sopan untuk meminta suatu barang ('Tolong berikan N').",
        "examples": [
          {
            "exampleJp": "水をください。",
            "exampleKana": "みず　を　ください。",
            "exampleEn": "Please give me water.",
            "exampleId": "Tolong berikan air."
          },
          {
            "exampleJp": "メニューをください。",
            "exampleKana": "めにゅー　を　ください。",
            "exampleEn": "Please give me the menu.",
            "exampleId": "Tolong berikan menunya."
          },
          {
            "exampleJp": "そのりんごをください。",
            "exampleKana": "その　りんご　を　ください。",
            "exampleEn": "Please give me that apple.",
            "exampleId": "Tolong berikan apel itu."
          }
        ]
      },
      {
        "id": "ikura",
        "pattern": "いくら",
        "jlpt": "N5",
        "descEn": "Asks for the price of something ('How much?').",
        "descId": "Menanyakan harga suatu barang ('Berapa harganya?').",
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
            "exampleJp": "このかばんはいくらですか。",
            "exampleKana": "このかばんはいくらですか。",
            "exampleEn": "How much is this bag?",
            "exampleId": "Berapa harga tas ini?"
          }
        ]
      },
      {
        "id": "nan-no-n",
        "pattern": "何の N",
        "jlpt": "N5",
        "descEn": "Asks about the content or category of N ('What kind of N?').",
        "descId": "Menanyakan isi atau kategori dari N ('N tentang apa?').",
        "examples": [
          {
            "exampleJp": "それは何の雑誌ですか。",
            "exampleKana": "それはなんのざっしですか。",
            "exampleEn": "What kind of magazine is that?",
            "exampleId": "Itu majalah tentang apa?"
          },
          {
            "exampleJp": "これは何の歌ですか。",
            "exampleKana": "これはなんのうたですか。",
            "exampleEn": "What kind of song is this?",
            "exampleId": "Ini lagu tentang apa?"
          },
          {
            "exampleJp": "あれは何の建物ですか。",
            "exampleKana": "あれはなんのたてものですか。",
            "exampleEn": "What kind of building is that?",
            "exampleId": "Itu gedung apa?"
          }
        ]
      },
      {
        "id": "doko-no-n",
        "pattern": "どこの N",
        "jlpt": "N5",
        "descEn": "Asks about the origin or country of N ('Where is N from?').",
        "descId": "Menanyakan asal negara atau perusahaan pembuat N ('N buatan mana?').",
        "examples": [
          {
            "exampleJp": "それはどこの車ですか。",
            "exampleKana": "それはどこのくるまですか。",
            "exampleEn": "Where is that car from?",
            "exampleId": "Itu mobil buatan mana?"
          },
          {
            "exampleJp": "これはどこの時計ですか。",
            "exampleKana": "これはどこのとけいですか。",
            "exampleEn": "Where is this watch from?",
            "exampleId": "Ini jam tangan buatan mana?"
          },
          {
            "exampleJp": "それはどこの国の料理ですか。",
            "exampleKana": "それはどこのくにのりょうりですか。",
            "exampleEn": "What country is that cuisine from?",
            "exampleId": "Itu masakan dari negara mana?"
          }
        ]
      },
      {
        "id": "dare-no-n",
        "pattern": "誰の N",
        "jlpt": "N5",
        "descEn": "Asks for the owner of N ('Whose N?').",
        "descId": "Menanyakan pemilik dari N ('N milik siapa?').",
        "examples": [
          {
            "exampleJp": "この傘は誰の傘ですか。",
            "exampleKana": "このかさはだれのかさですか。",
            "exampleEn": "Whose umbrella is this?",
            "exampleId": "Payung ini milik siapa?"
          },
          {
            "exampleJp": "それは誰のノートですか。",
            "exampleKana": "それはだれののーとですか。",
            "exampleEn": "Whose notebook is that?",
            "exampleId": "Itu buku catatan milik siapa?"
          },
          {
            "exampleJp": "あれは誰のペンですか。",
            "exampleKana": "あれはだれのぺんですか。",
            "exampleEn": "Whose pen is that?",
            "exampleId": "Itu pulpen milik siapa?"
          }
        ]
      },
      {
        "id": "n-de-language",
        "pattern": "N (言語) で",
        "jlpt": "N5",
        "descEn": "Indicates the language used ('In N language').",
        "descId": "Menunjukkan bahasa yang digunakan ('Dalam bahasa N').",
        "examples": [
          {
            "exampleJp": "日本語で話してください。",
            "exampleKana": "にほんごではなしてください。",
            "exampleEn": "Please speak in Japanese.",
            "exampleId": "Tolong bicara dalam bahasa Jepang."
          },
          {
            "exampleJp": "この手紙は英語で書かれています。",
            "exampleKana": "このてがみはえいごでかかれています。",
            "exampleEn": "This letter is written in English.",
            "exampleId": "Surat ini ditulis dalam bahasa Inggris."
          },
          {
            "exampleJp": "先生はインドネシア語で説明しました。",
            "exampleKana": "せんせいはインドネシアごでせつめいしました。",
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
    "titleId": "Partikel & Arah Gerakan",
    "patterns": [
      {
        "id": "n-basho-e-ikimasu",
        "pattern": "N (場所) へ",
        "jlpt": "N5",
        "descEn": "Indicates the direction or destination of movement.",
        "descId": "Menunjukkan arah atau tujuan pergerakan.",
        "examples": [
          {
            "exampleJp": "明日、学校へ行きます。",
            "exampleKana": "あした、がっこうへいきます。",
            "exampleEn": "I will go to school tomorrow.",
            "exampleId": "Besok, saya akan pergi ke sekolah."
          },
          {
            "exampleJp": "来週、日本へ行きます。",
            "exampleKana": "らいしゅう、にほんへいきます。",
            "exampleEn": "I will go to Japan next week.",
            "exampleId": "Minggu depan, saya akan pergi ke Jepang."
          },
          {
            "exampleJp": "昨日、公園へ行きました。",
            "exampleKana": "きのう、こうえんへいきました。",
            "exampleEn": "I went to the park yesterday.",
            "exampleId": "Kemarin, saya pergi ke taman."
          }
        ]
      },
      {
        "id": "n-o-verb",
        "pattern": "N を",
        "jlpt": "N5",
        "descEn": "Marks the direct object of a transitive verb.",
        "descId": "Menandai objek langsung dari kata kerja transitif.",
        "examples": [
          {
            "exampleJp": "パンを食べます。",
            "exampleKana": "パンをたべます。",
            "exampleEn": "I eat bread.",
            "exampleId": "Saya makan roti."
          },
          {
            "exampleJp": "本を読みます。",
            "exampleKana": "ほんをよみます。",
            "exampleEn": "I read a book.",
            "exampleId": "Saya membaca buku."
          },
          {
            "exampleJp": "映画を見ました。",
            "exampleKana": "えいがをみました。",
            "exampleEn": "I watched a movie.",
            "exampleId": "Saya menonton film."
          }
        ]
      },
      {
        "id": "n-time-ni",
        "pattern": "N (時間) に",
        "jlpt": "N5",
        "descEn": "Indicates the specific time when an action occurs.",
        "descId": "Menunjukkan waktu spesifik terjadinya suatu tindakan.",
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
            "exampleJp": "午後三時に家へ帰りました。",
            "exampleKana": "ごごさんじにいえへかえりました。",
            "exampleEn": "I returned home at 3:00 PM.",
            "exampleId": "Saya pulang ke rumah pada jam tiga sore."
          }
        ]
      },
      {
        "id": "n-basho-de",
        "pattern": "N (場所) で",
        "jlpt": "N5",
        "descEn": "Indicates the place where an action occurs.",
        "descId": "Menunjukkan tempat berlangsungnya suatu tindakan.",
        "examples": [
          {
            "exampleJp": "図書館で勉強します。",
            "exampleKana": "としょかんでべんきょうします。",
            "exampleEn": "I study at the library.",
            "exampleId": "Saya belajar di perpustakaan."
          },
          {
            "exampleJp": "レストランで昼ご飯を食べます。",
            "exampleKana": "レストランでひるごはんをたべます。",
            "exampleEn": "I eat lunch at a restaurant.",
            "exampleId": "Saya makan siang di restoran."
          },
          {
            "exampleJp": "駅で切符を買いました。",
            "exampleKana": "えきできっぷをかいました。",
            "exampleEn": "I bought a ticket at the station.",
            "exampleId": "Saya membeli tiket di stasiun."
          }
        ]
      },
      {
        "id": "n-kara-n-made",
        "pattern": "N から N まで",
        "jlpt": "N5",
        "descEn": "Indicates starting and ending points in time or space ('from... to...').",
        "descId": "Menunjukkan titik awal dan titik akhir waktu atau ruang ('dari... sampai...').",
        "examples": [
          {
            "exampleJp": "学校は八時から三時までです。",
            "exampleKana": "がっこうは はちじから さんじまでです。",
            "exampleEn": "School is from 8 o'clock to 3 o'clock.",
            "exampleId": "Sekolah berlangsung dari jam 8 sampai jam 3."
          },
          {
            "exampleJp": "東京から大阪まで新幹線で行きます。",
            "exampleKana": "とうきょうから おおさかまで しんかんせんで いきます。",
            "exampleEn": "I will go from Tokyo to Osaka by Shinkansen.",
            "exampleId": "Saya akan pergi dari Tokyo ke Osaka dengan Shinkansen."
          },
          {
            "exampleJp": "夏休みは七月から八月までです。",
            "exampleKana": "なつやすみは しちがつから はちがつまでです。",
            "exampleEn": "Summer vacation is from July to August.",
            "exampleId": "Liburan musim panas adalah dari bulan Juli sampai bulan Agustus."
          }
        ]
      },
      {
        "id": "n1-ya-n2-nado",
        "pattern": "N1 や N2 など",
        "jlpt": "N5",
        "descEn": "Lists nouns non-exhaustively ('N1, N2, and so on').",
        "descId": "Menyebutkan kata benda sebagai contoh perwakilan ('N1, N2, dan lain-lain').",
        "examples": [
          {
            "exampleJp": "かばんの中に本やノートなどがあります。",
            "exampleKana": "かばんのなかに ほんや のーとなどが あります。",
            "exampleEn": "There are books, notebooks, and other things in the bag.",
            "exampleId": "Di dalam tas ada buku, buku catatan, dan lain-lain."
          },
          {
            "exampleJp": "週末は映画や買い物などをしました。",
            "exampleKana": "しゅうまつは えいがや かいものなどを しました。",
            "exampleEn": "On the weekend, I did things like watching movies and shopping.",
            "exampleId": "Akhir pekan saya melakukan hal-hal seperti menonton film dan berbelanja."
          },
          {
            "exampleJp": "冷蔵庫にりんごやみかんなどが入っています。",
            "exampleKana": "れいぞうこに りんごや みかんなどが はいっています。",
            "exampleEn": "There are apples, oranges, and other things in the refrigerator.",
            "exampleId": "Di dalam kulkas ada apel, jeruk, dan lain-lain."
          }
        ]
      },
      {
        "id": "nanimo-dokoe-mo-verb-negative",
        "pattern": "何も／どこへも Vません",
        "jlpt": "N5",
        "descEn": "Total negation ('nothing' or 'nowhere' with negative verbs).",
        "descId": "Negasi total ('tidak makan apa-apa' / 'tidak pergi ke mana-mana').",
        "examples": [
          {
            "exampleJp": "今日はお腹がすいていませんから、何も食べません。",
            "exampleKana": "きょうは おなかが すいていませんから、なにも たべません。",
            "exampleEn": "I am not hungry today, so I will not eat anything.",
            "exampleId": "Hari ini saya tidak lapar, jadi saya tidak makan apa-apa."
          },
          {
            "exampleJp": "昨日はどこへも行きませんでした。",
            "exampleKana": "きのうは どこへも いきませんでした。",
            "exampleEn": "I didn't go anywhere yesterday.",
            "exampleId": "Kemarin saya tidak pergi ke mana-mana."
          },
          {
            "exampleJp": "何も知りません。",
            "exampleKana": "なにも しりません。",
            "exampleEn": "I don't know anything.",
            "exampleId": "Saya tidak tahu apa-apa."
          }
        ]
      }
    ]
  },
  {
    "chapter": 4,
    "titleEn": "Adjectives, Existence & Spatial Relations",
    "titleId": "Kata Sifat, Eksistensi Benda & Keterangan Tempat",
    "patterns": [
      {
        "id": "n-wa-a-desu",
        "pattern": "N は A です",
        "jlpt": "N5",
        "descEn": "Describes N with an adjective A.",
        "descId": "Mendeskripsikan kata benda N menggunakan kata sifat A.",
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
            "exampleEn": "Japanese summer is hot.",
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
        "pattern": "イA-い くないです / ナA じゃありません",
        "jlpt": "N5",
        "descEn": "Negative polite forms of adjectives.",
        "descId": "Bentuk negatif sopan dari kata sifat-i dan kata sifat-na.",
        "examples": [
          {
            "exampleJp": "この映画は面白くないです。",
            "exampleKana": "このえいがはおもしろくないです。",
            "exampleEn": "This movie is not interesting.",
            "exampleId": "Film ini tidak menarik."
          },
          {
            "exampleJp": "昨日は寒くなかったです。",
            "exampleKana": "きのうはさむくなかったです。",
            "exampleEn": "It was not cold yesterday.",
            "exampleId": "Kemarin tidak dingin."
          },
          {
            "exampleJp": "この町は静かじゃありません。",
            "exampleKana": "このまちはしずかじゃありません。",
            "exampleEn": "This town is not quiet.",
            "exampleId": "Kota ini tidak tenang."
          }
        ]
      },
      {
        "id": "a-n-modifier",
        "pattern": "イA ＋ N / ナA な ＋ N",
        "jlpt": "N5",
        "descEn": "Adjectives modifying nouns directly.",
        "descId": "Kata sifat yang memodifikasi kata benda secara langsung.",
        "examples": [
          {
            "exampleJp": "おいしい料理を食べました。",
            "exampleKana": "おいしいりょうりをたべました。",
            "exampleEn": "I ate delicious food.",
            "exampleId": "Saya makan makanan yang enak."
          },
          {
            "exampleJp": "あそこにきれいな花があります。",
            "exampleKana": "あそこにきれいなはながあります。",
            "exampleEn": "There is a beautiful flower over there.",
            "exampleId": "Di sana ada bunga yang indah."
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
        "pattern": "N は [春/○月/一年中...]、A です",
        "jlpt": "N5",
        "descEn": "Describes weather or conditions of N in a specific season or month.",
        "descId": "Mendeskripsikan kondisi cuaca atau suasana N di musim/bulan tertentu.",
        "examples": [
          {
            "exampleJp": "日本の春は暖かいです。",
            "exampleKana": "にほんのはるはあたたかいです。",
            "exampleEn": "Spring in Japan is warm.",
            "exampleId": "Musim semi di Jepang hangat."
          },
          {
            "exampleJp": "東京の冬は寒いです。",
            "exampleKana": "とうきょうのふゆはさむいです。",
            "exampleEn": "Winter in Tokyo is cold.",
            "exampleId": "Musim dingin di Tokyo dingin."
          },
          {
            "exampleJp": "八月はとても暑いです。",
            "exampleKana": "はちがつはとてもあついです。",
            "exampleEn": "August is very hot.",
            "exampleId": "Bulan Agustus sangat panas."
          }
        ]
      },
      {
        "id": "totemo-sukoshi-a-desu",
        "pattern": "とても／少し A です",
        "jlpt": "N5",
        "descEn": "Modifies adjective intensity ('very' / 'a little').",
        "descId": "Memodifikasi intensitas kata sifat ('sangat' / 'sedikit').",
        "examples": [
          {
            "exampleJp": "この映画はとても面白いです。",
            "exampleKana": "このえいがはとてもおもしろいです。",
            "exampleEn": "This movie is very interesting.",
            "exampleId": "Film ini sangat menarik."
          },
          {
            "exampleJp": "今日のテストは少し難しいです。",
            "exampleKana": "きょうのテストはすこしむずかしいです。",
            "exampleEn": "Today's test is a little difficult.",
            "exampleId": "Ujian hari ini sedikit sulit."
          },
          {
            "exampleJp": "この部屋はとても静かです。",
            "exampleKana": "このへやはとてもしずかです。",
            "exampleEn": "This room is very quiet.",
            "exampleId": "Ruangan ini sangat tenang."
          }
        ]
      },
      {
        "id": "amari-a-kunai-ja-arimasen",
        "pattern": "あまり [イA-い くないです/ナA じゃありません]",
        "jlpt": "N5",
        "descEn": "Expresses 'not very...' with negative adjective forms.",
        "descId": "Menyatakan makna 'tidak begitu...' dengan kata sifat negatif.",
        "examples": [
          {
            "exampleJp": "このスープはあまり熱くないです。",
            "exampleKana": "このスープはあまりあつくないです。",
            "exampleEn": "This soup is not very hot.",
            "exampleId": "Sup ini tidak begitu panas."
          },
          {
            "exampleJp": "昨日の映画はあまり面白くありませんでした。",
            "exampleKana": "きのうのえいがはあまりおもしろくありませんでした。",
            "exampleEn": "Yesterday's movie was not very interesting.",
            "exampleId": "Film kemarin tidak begitu menarik."
          },
          {
            "exampleJp": "この町はあまり賑やかじゃありません。",
            "exampleKana": "このまちはあまりにぎやかじゃありません。",
            "exampleEn": "This town is not very lively.",
            "exampleId": "Kota ini tidak begitu ramai."
          }
        ]
      },
      {
        "id": "n1-ni-n2-ga-arimasu-existence",
        "pattern": "N1 (場所) に N2 (物) があります",
        "jlpt": "N5",
        "descEn": "Expresses existence of inanimate N2 in place N1.",
        "descId": "Menyatakan keberadaan benda mati N2 di tempat N1.",
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
            "exampleJp": "カバンの中にペンがあります。",
            "exampleKana": "かばんのなかにペンがあります。",
            "exampleEn": "There is a pen in the bag.",
            "exampleId": "Ada pulpen di dalam tas."
          }
        ]
      },
      {
        "id": "n-wa-n-no-direction-desu",
        "pattern": "N (場所) は N の [東/西/南/北] です",
        "jlpt": "N5",
        "descEn": "Expresses relative direction of location N ('N is south of...').",
        "descId": "Menunjukkan letak mata angin relatif dari tempat N ('N berada di sebelah selatan...').",
        "examples": [
          {
            "exampleJp": "日本は中国の東です。",
            "exampleKana": "にほんはちゅうごくのひがしです。",
            "exampleEn": "Japan is east of China.",
            "exampleId": "Jepang berada di sebelah timur Tiongkok."
          },
          {
            "exampleJp": "北海道は日本の北です。",
            "exampleKana": "ほっかいどうはにほんのきたです。",
            "exampleEn": "Hokkaido is north of Japan.",
            "exampleId": "Hokkaido berada di sebelah utara Jepang."
          },
          {
            "exampleJp": "沖縄は日本の南です。",
            "exampleKana": "おきなわはにほんのみなみです。",
            "exampleEn": "Okinawa is south of Japan.",
            "exampleId": "Okinawa berada di sebelah selatan Jepang."
          }
        ]
      },
      {
        "id": "n1-kara-n2-made-donokurai",
        "pattern": "N1 から N2 まで どのくらいですか",
        "jlpt": "N5",
        "descEn": "Asks for duration or distance between two places.",
        "descId": "Menanyakan perkiraan durasi atau jarak antara dua tempat.",
        "examples": [
          {
            "exampleJp": "家から駅までどのくらいですか。",
            "exampleKana": "いえからえきまでどのくらいですか。",
            "exampleEn": "How long does it take from your house to the station?",
            "exampleId": "Berapa lama dari rumah ke stasiun?"
          },
          {
            "exampleJp": "東京から京都までどのくらいかかりますか。",
            "exampleKana": "とうきょうからきょうとまでどのくらいかかりますか。",
            "exampleEn": "How long does it take to get from Tokyo to Kyoto?",
            "exampleId": "Berapa lama perjalanan dari Tokyo ke Kyoto?"
          },
          {
            "exampleJp": "学校から図書館までどのくらいですか。",
            "exampleKana": "がっこうからとしょかんまでどのくらいですか。",
            "exampleEn": "How far is it from the school to the library?",
            "exampleId": "Seberapa jauh dari sekolah ke perpustakaan?"
          }
        ]
      },
      {
        "id": "n-norimono-de",
        "pattern": "N (乗り物) で",
        "jlpt": "N5",
        "descEn": "Indicates vehicle or method of transit ('By train/car').",
        "descId": "Menunjukkan jenis kendaraan atau moda transportasi ('Dengan kereta/mobil').",
        "examples": [
          {
            "exampleJp": "私は電車で会社へ行きます。",
            "exampleKana": "わたしはでんしゃでかいしゃへいきます。",
            "exampleEn": "I go to the office by train.",
            "exampleId": "Saya pergi ke kantor dengan kereta."
          },
          {
            "exampleJp": "バスで学校まで行きました。",
            "exampleKana": "バスでがっこうまでいきました。",
            "exampleEn": "I went to school by bus.",
            "exampleId": "Saya pergi ke sekolah dengan bus."
          },
          {
            "exampleJp": "自転車で公園へ行きましょう。",
            "exampleKana": "じてんしゃでこうえんへいきましょう。",
            "exampleEn": "Let's go to the park by bicycle.",
            "exampleId": "Ayo pergi ke taman dengan sepeda."
          }
        ]
      },
      {
        "id": "donna-n",
        "pattern": "どんな N",
        "jlpt": "N5",
        "descEn": "Asks about characteristics ('What kind of N?').",
        "descId": "Menanyakan sifat atau karakteristik ('N yang bagaimana?').",
        "examples": [
          {
            "exampleJp": "どんな本を読みますか。",
            "exampleKana": "どんなほんをよみますか。",
            "exampleEn": "What kind of books do you read?",
            "exampleId": "Buku seperti apa yang kamu baca?"
          },
          {
            "exampleJp": "どんな料理が好きですか。",
            "exampleKana": "どんなりょうりがすきですか。",
            "exampleEn": "What kind of food do you like?",
            "exampleId": "Masakan seperti apa yang kamu suka?"
          },
          {
            "exampleJp": "どんな音楽を聞きますか。",
            "exampleKana": "どんなおんがくをききますか。",
            "exampleEn": "What kind of music do you listen to?",
            "exampleId": "Musik seperti apa yang kamu dengarkan?"
          }
        ]
      },
      {
        "id": "n-wa-dou-desuka",
        "pattern": "N はどうですか",
        "jlpt": "N5",
        "descEn": "Asks for opinion or checks status ('How about N?').",
        "descId": "Menanyakan pendapat atau keadaan ('Bagaimana dengan N?').",
        "examples": [
          {
            "exampleJp": "今日の天気はどうですか。",
            "exampleKana": "きょうのてんきはどうですか。",
            "exampleEn": "How is the weather today?",
            "exampleId": "Bagaimana cuaca hari ini?"
          },
          {
            "exampleJp": "日本の生活はどうですか。",
            "exampleKana": "にほんのせいかつはどうですか。",
            "exampleEn": "How is life in Japan?",
            "exampleId": "Bagaimana kehidupan di Jepang?"
          },
          {
            "exampleJp": "新しい仕事はどうですか。",
            "exampleKana": "あたらしいしごとはどうですか。",
            "exampleEn": "How is your new job?",
            "exampleId": "Bagaimana dengan pekerjaan barumu?"
          }
        ]
      },
      {
        "id": "soshite",
        "pattern": " Machinist そして",
        "jlpt": "N5",
        "descEn": "Conjunction to add information ('And / Also').",
        "descId": "Kata sambung untuk menambahkan informasi searah ('Dan / Serta / Dan juga').",
        "examples": [
          {
            "exampleJp": "彼はピアノが上手です。そして、歌も歌えます。",
            "exampleKana": "かれはピアノがじょうずです。そして、うたもうたえます。",
            "exampleEn": "He is good at playing the piano. And, he can sing too.",
            "exampleId": "Dia pandai bermain piano. Dan, dia juga bisa bernyanyi."
          },
          {
            "exampleJp": "昨日は図書館へ行きました。そして、本を借りました。",
            "exampleKana": "きのうはとしょかんへいきました。そして、ほんをかりました。",
            "exampleEn": "I went to the library yesterday. And, I borrowed a book.",
            "exampleId": "Kemarin saya pergi ke perpustakaan. Dan, saya meminjam buku."
          },
          {
            "exampleJp": "この料理は美味しいです。そして、とても安いです。",
            "exampleKana": "このりょうりはおいしいです。そして、とてもやすいです。",
            "exampleEn": "This dish is delicious. And, it is very cheap.",
            "exampleId": "Masakan ini enak. Dan, harganya sangat murah."
          }
        ]
      },
      {
        "id": "sentence-ga-sentence",
        "pattern": "＿＿＿が、＿＿＿",
        "jlpt": "N5",
        "descEn": "Conjunction showing contrast ('But / However').",
        "descId": "Kata hubung yang menyatakan pertentangan/kontras ('Tapi / Namun').",
        "examples": [
          {
            "exampleJp": "日本語は難しいですが、面白いです。",
            "exampleKana": "にほんごはむずかしいですが、おもしろいです。",
            "exampleEn": "Japanese is difficult, but it is interesting.",
            "exampleId": "Bahasa Jepang itu sulit, tapi menarik."
          },
          {
            "exampleJp": "昨日、公園へ行きましたが、雨が降っていました。",
            "exampleKana": "きのう、こうえんへいきましたが、あめがふっていました。",
            "exampleEn": "I went to the park yesterday, but it was raining.",
            "exampleId": "Kemarin saya pergi ke taman, tapi sedang turun hujan."
          },
          {
            "exampleJp": "この靴はいいですが、少し高いです。",
            "exampleKana": "このくつはいいですが、すこしたかいです。",
            "exampleEn": "These shoes are nice, but they are a bit expensive.",
            "exampleId": "Sepatu ini bagus, tapi agak mahal."
          }
        ]
      },
      {
        "id": "sentence-ne",
        "pattern": "＿＿＿ね",
        "jlpt": "N5",
        "descEn": "Sentence-ending particle seeking agreement ('isn't it?' / 'right?').",
        "descId": "Partikel akhir kalimat untuk mencari kesepakatan ('ya?' / 'kan?').",
        "examples": [
          {
            "exampleJp": "今日はいい天気ですね。",
            "exampleKana": "きょうはいいてんきですね。",
            "exampleEn": "The weather is nice today, isn't it?",
            "exampleId": "Cuaca hari ini bagus ya."
          },
          {
            "exampleJp": "この映画はとても面白かったですね。",
            "exampleKana": "このえいがはとてもおもしろかったですね。",
            "exampleEn": "This movie was very interesting, wasn't it?",
            "exampleId": "Film ini sangat menarik ya, kan?"
          },
          {
            "exampleJp": "もうすぐ冬休みですね。",
            "exampleKana": "もうすぐふゆやすみですね。",
            "exampleEn": "It's almost winter break, isn't it?",
            "exampleId": "Sebentar lagi liburan musim dingin ya."
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
        "id": "a-n-past-tense",
        "pattern": "イA-かった / [ナA/N] でした / じゃありませんでした",
        "jlpt": "N5",
        "descEn": "Past tense polite forms of adjectives and nouns.",
        "descId": "Bentuk lampau sopan dari kata sifat dan kata benda.",
        "examples": [
          {
            "exampleJp": "昨日は暑かったです。",
            "exampleKana": "きのうはあつかったです。",
            "exampleEn": "It was hot yesterday.",
            "exampleId": "Kemarin cuacanya panas."
          },
          {
            "exampleJp": "先週のパーティーは楽しかったです。",
            "exampleKana": "せんしゅうのパーティーはたのしかったです。",
            "exampleEn": "The party last week was fun.",
            "exampleId": "Pesta minggu lalu menyenangkan."
          },
          {
            "exampleJp": "学生の時は暇でした。",
            "exampleKana": "がくせいのときはひまでした。",
            "exampleEn": "I was free when I was a student.",
            "exampleId": "Saya punya banyak waktu luang saat masih menjadi pelajar."
          }
        ]
      },
      {
        "id": "n-ga-suki-kirai-desu",
        "pattern": "N が好きです／嫌いです",
        "jlpt": "N5",
        "descEn": "Expresses liking or disliking N.",
        "descId": "Menyatakan kesukaan atau ketidaksukaan terhadap N.",
        "examples": [
          {
            "exampleJp": "私は日本料理が好きです。",
            "exampleKana": "わたしはにほんりょうりがすきです。",
            "exampleEn": "I like Japanese food.",
            "exampleId": "Saya suka masakan Jepang."
          },
          {
            "exampleJp": "弟は魚が嫌いです。",
            "exampleKana": "おとうとはさかながきらいです。",
            "exampleEn": "My younger brother dislikes fish.",
            "exampleId": "Adik laki-laki saya tidak suka ikan."
          },
          {
            "exampleJp": "あなたはどんなスポーツが好きですか。",
            "exampleKana": "あなたはどんなスポーツがすきですか。",
            "exampleEn": "What kind of sports do you like?",
            "exampleId": "Kamu suka olahraga apa?"
          }
        ]
      },
      {
        "id": "n-ga-hoshire-desu",
        "pattern": "N がほしいです",
        "jlpt": "N5",
        "descEn": "Expresses desire for N (want an object).",
        "descId": "Menyatakan keinginan untuk memiliki benda N.",
        "examples": [
          {
            "exampleJp": "新しいパソコンがほしいです。",
            "exampleKana": "あたらしいパソコンがほしいです。",
            "exampleEn": "I want a new computer.",
            "exampleId": "Saya ingin komputer baru."
          },
          {
            "exampleJp": "誕生日に何がほしいですか。",
            "exampleKana": "たんじょうびになにがほしいですか。",
            "exampleEn": "What do you want for your birthday?",
            "exampleId": "Kamu ingin apa di hari ulang tahunmu?"
          },
          {
            "exampleJp": "今、冷たい水がほしいです。",
            "exampleKana": "いま、つめたいみずがほしいです。",
            "exampleEn": "I want some cold water now.",
            "exampleId": "Sekarang, saya ingin air dingin."
          }
        ]
      },
      {
        "id": "dokoka-e-ikimasu",
        "pattern": "どこかへ",
        "jlpt": "N5",
        "descEn": "Indicates 'somewhere' ('Do you go somewhere?').",
        "descId": "Menunjukkan ketidakpastian tempat ('ke suatu tempat').",
        "examples": [
          {
            "exampleJp": "週末はどこかへ行きますか。",
            "exampleKana": "しゅうまつはどこかへいきますか。",
            "exampleEn": "Are you going somewhere this weekend?",
            "exampleId": "Apakah kamu akan pergi ke suatu tempat akhir pekan ini?"
          },
          {
            "exampleJp": "夏休みはどこかへ行きたいです。",
            "exampleKana": "なつやすみはどこかへいきたいです。",
            "exampleEn": "I want to go somewhere for summer vacation.",
            "exampleId": "Saya ingin pergi ke suatu tempat saat liburan musim panas."
          },
          {
            "exampleJp": "どこかへ旅行したいです。",
            "exampleKana": "どこかへりょこうしたいです。",
            "exampleEn": "I want to travel somewhere.",
            "exampleId": "Saya ingin pergi berwisata ke suatu tempat."
          }
        ]
      },
      {
        "id": "doushite",
        "pattern": "どうして",
        "jlpt": "N5",
        "descEn": "Asking for reasons ('Why?').",
        "descId": "Menanyakan alasan ('Mengapa?').",
        "examples": [
          {
            "exampleJp": "どうして学校へ行きませんか。",
            "exampleKana": "どうして がっこうへ いきませんか。",
            "exampleEn": "Why aren't you going to school?",
            "exampleId": "Mengapa Anda tidak pergi ke sekolah?"
          },
          {
            "exampleJp": "どうして昨日休みましたか。",
            "exampleKana": "どうして きのう やすみましたか。",
            "exampleEn": "Why were you absent yesterday?",
            "exampleId": "Mengapa kemarin Anda libur?"
          },
          {
            "exampleJp": "どうして日本語を勉強しますか。",
            "exampleKana": "どうして にほんごを べんきょうしますか。",
            "exampleEn": "Why do you study Japanese?",
            "exampleId": "Mengapa Anda belajar bahasa Jepang?"
          }
        ]
      },
      {
        "id": "sorekara",
        "pattern": "それから",
        "jlpt": "N5",
        "descEn": "Conjunction to show sequential actions ('And then').",
        "descId": "Kata penghubung untuk menyatakan urutan kegiatan ('Setelah itu / Kemudian').",
        "examples": [
          {
            "exampleJp": "朝ごはんを食べました。それから、学校へ行きました。",
            "exampleKana": "あさごはんを たべました。それから、 がっこうへ いきました。",
            "exampleEn": "I ate breakfast. And then, I went to school.",
            "exampleId": "Saya makan sarapan. Setelah itu, saya pergi ke sekolah."
          },
          {
            "exampleJp": "宿題をします。それから、友達と遊びます。",
            "exampleKana": "しゅくだいを します。それから、 ともだちと あそびます。",
            "exampleEn": "I will do my homework. And then, I will hang out with my friends.",
            "exampleId": "Saya akan mengerjakan PR. Kemudian, saya akan bermain dengan teman."
          },
          {
            "exampleJp": "デパートで買い物をしました。それから、映画を見ました。",
            "exampleKana": "デパートで かいものを しました。それから、 えいがを みました。",
            "exampleEn": "I went shopping at the department store. And then, I watched a movie.",
            "exampleId": "Saya berbelanja di toserba. Setelah itu, saya menonton film."
          }
        ]
      },
      {
        "id": "n-to-verb",
        "pattern": "N (人) と",
        "jlpt": "N5",
        "descEn": "Indicates companion ('Together with N').",
        "descId": "Menunjukkan orang yang menemani ('Bersama dengan N').",
        "examples": [
          {
            "exampleJp": "友達と公園へ行きます。",
            "exampleKana": "ともだちと こうえんへ いきます。",
            "exampleEn": "I will go to the park with my friend.",
            "exampleId": "Saya akan pergi ke taman bersama teman."
          },
          {
            "exampleJp": "家族と日本へ旅行します。",
            "exampleKana": "かぞくと にほんに りょこうします。",
            "exampleEn": "I will travel to Japan with my family.",
            "exampleId": "Saya akan berwisata ke Jepang bersama keluarga."
          },
          {
            "exampleJp": "先生と話しました。",
            "exampleKana": "せんせいと はなしました。",
            "exampleEn": "I talked with my teacher.",
            "exampleId": "Saya berbicara dengan guru."
          }
        ]
      },
      {
        "id": "sentence-kara-sentence",
        "pattern": "＿＿＿から、＿＿＿",
        "jlpt": "N5",
        "descEn": "Conjunction showing reason ('Because...').",
        "descId": "Kata hubung yang menyatakan sebab/alasan ('Karena...').",
        "examples": [
          {
            "exampleJp": "雨ですから、タクシーで行きます。",
            "exampleKana": "あめですから、 タクシーで いきます。",
            "exampleEn": "Because it is raining, I will go by taxi.",
            "exampleId": "Karena hujan, saya pergi naik taksi."
          },
          {
            "exampleJp": "時間がありませんから、急ぎます。",
            "exampleKana": "じかんが ありませんから、 いそぎます。",
            "exampleEn": "Because I don't have time, I will hurry.",
            "exampleId": "Karena tidak ada waktu, saya akan bergegas."
          },
          {
            "exampleJp": "おなかがすきましたから、何か食べたいです。",
            "exampleKana": "おなかが すきましたから、 なにか たべたいです。",
            "exampleEn": "Because I am hungry, I want to eat something.",
            "exampleId": "Karena saya lapar, saya ingin makan sesuatu."
          }
        ]
      }
    ]
  },
  {
    "chapter": 6,
    "titleEn": "Existence, Comparison & Hearsay",
    "titleId": "Eksistensi Acara, Perbandingan & Hearsay",
    "patterns": [
      {
        "id": "n-ga-arimasu-event-schedule",
        "pattern": "N があります (用事・約束)",
        "jlpt": "N5",
        "descEn": "Expresses having plans, chores, or appointments.",
        "descId": "Menyatakan memiliki janji, tugas, atau urusan.",
        "examples": [
          {
            "exampleJp": "明日、病院の予約があります。",
            "exampleKana": "あした、びょういんのよやくがあります。",
            "exampleEn": "I have a doctor's appointment tomorrow.",
            "exampleId": "Besok saya ada janji di rumah sakit."
          },
          {
            "exampleJp": "今日は友達と約束があります。",
            "exampleKana": "きょうはともだちとやくそくがあります。",
            "exampleEn": "I have plans with a friend today.",
            "exampleId": "Hari ini saya ada janji dengan teman."
          },
          {
            "exampleJp": "すみません、今から用事があります。",
            "exampleKana": "すみません、いまからようじがあります。",
            "exampleEn": "Excuse me, I have some business to attend to now.",
            "exampleId": "Maaf, saya ada urusan mulai sekarang."
          }
        ]
      },
      {
        "id": "n-basho-de-n-ga-arimasu",
        "pattern": "N1 (場所) で N2 (イベント) があります",
        "jlpt": "N5",
        "descEn": "Expresses that an event takes place in a location.",
        "descId": "Menyatakan diadakannya suatu acara/kegiatan di suatu tempat.",
        "examples": [
          {
            "exampleJp": "明日、公園で祭りがあります。",
            "exampleKana": "あした、こうえんでまつりがあります。",
            "exampleEn": "There is a festival at the park tomorrow.",
            "exampleId": "Besok ada festival di taman."
          },
          {
            "exampleJp": "学校で日本語のテストがあります。",
            "exampleKana": "がっこうでにほんごのテストがあります。",
            "exampleEn": "There is a Japanese test at school.",
            "exampleId": "Ada ujian bahasa Jepang di sekolah."
          },
          {
            "exampleJp": "来月、東京でコンサートがあります。",
            "exampleKana": "らいげつ、とうきょうでコンサートがあります。",
            "exampleEn": "There will be a concert in Tokyo next month.",
            "exampleId": "Bulan depan ada konser di Tokyo."
          }
        ]
      },
      {
        "id": "n-ga-counter-arimasu",
        "pattern": "N が [～枚/～つ/...] あります",
        "jlpt": "N5",
        "descEn": "Expresses quantity of inanimate objects.",
        "descId": "Menyatakan jumlah keberadaan benda mati.",
        "examples": [
          {
            "exampleJp": "机の上に本が三冊あります。",
            "exampleKana": "つくえのうえにほんがさんさつあります。",
            "exampleEn": "There are three books on the desk.",
            "exampleId": "Ada tiga buku di atas meja."
          },
          {
            "exampleJp": "冷蔵庫の中に卵が二つあります。",
            "exampleKana": "れいぞうこのなかにたまごがふたつあります。",
            "exampleEn": "There are two eggs in the refrigerator.",
            "exampleId": "Ada dua butir telur di dalam kulkas."
          },
          {
            "exampleJp": "かばんの中にペンが一本あります。",
            "exampleKana": "かばんのなかにペンがいっぽんあります。",
            "exampleEn": "There is one pen in the bag.",
            "exampleId": "Ada satu buah pulpen di dalam tas."
          }
        ]
      },
      {
        "id": "n1-de-n2-ga-ichiban-a-desu",
        "pattern": "N1 で N2 が いちばん A です",
        "jlpt": "N5",
        "descEn": "Expresses superlative ('N2 is the most A within group N1').",
        "descId": "Menyatakan tingkat paling/ter (superlatif) ('N2 paling A di antara N1').",
        "examples": [
          {
            "exampleJp": "果物の中でりんごがいちばん好きです。",
            "exampleKana": "くだもののなかでりんごがいちばんすきです。",
            "exampleEn": "Among fruits, I like apples the best.",
            "exampleId": "Di antara buah-buahan, saya paling suka apel."
          },
          {
            "exampleJp": "一年の中で夏がいちばん暑いです。",
            "exampleKana": "いちねんのなかでなつがいちばんあついです。",
            "exampleEn": "Summer is the hottest time of the year.",
            "exampleId": "Di antara sepanjang tahun, musim panas adalah yang paling panas."
          },
          {
            "exampleJp": "クラスの中で田中さんがいちばん背が高いです。",
            "exampleKana": "クラスのなかでたなかさんがいちばんせがたかいです。",
            "exampleEn": "Tanaka-san is the tallest in the class.",
            "exampleId": "Di antara teman sekelas, Tanaka-san yang paling tinggi."
          }
        ]
      },
      {
        "id": "n1-wa-n2-yori-a-desu",
        "pattern": "N1 は N2 より A です",
        "jlpt": "N5",
        "descEn": "Expresses comparison ('N1 is more A than N2').",
        "descId": "Menyatakan perbandingan lebih ('N1 lebih A daripada N2').",
        "examples": [
          {
            "exampleJp": "日本はタイより寒いです。",
            "exampleKana": "にほんはタイよりさむいです。",
            "exampleEn": "Japan is colder than Thailand.",
            "exampleId": "Jepang lebih dingin daripada Thailand."
          },
          {
            "exampleJp": "このかばんはあのカバンより大きいです。",
            "exampleKana": "このかばんはあのかばんよりおおきいです。",
            "exampleEn": "This bag is bigger than that bag.",
            "exampleId": "Tas ini lebih besar daripada tas itu."
          },
          {
            "exampleJp": "昨日は今日より忙しかったです。",
            "exampleKana": "きのうはきょうよりいそがしかったです。",
            "exampleEn": "Yesterday was busier than today.",
            "exampleId": "Kemarin lebih sibuk daripada hari ini."
          }
        ]
      },
      {
        "id": "n1-to-n2-to-dochira-ga-a-desuka-hou-ga",
        "pattern": "N1 と N2 とどちらが A ですか / N のほうが A です",
        "jlpt": "N5",
        "descEn": "Asks to compare two items and response with choice.",
        "descId": "Menanyakan perbandingan antara dua benda dan merespon dengan memilih salah satu.",
        "examples": [
          {
            "exampleJp": "コーヒーと紅茶とどちらが好きですか。コーヒーのほうが好きです。",
            "exampleKana": "コーヒーとこうちゃとどちらがすきですか。コーヒーのほうがすきです。",
            "exampleEn": "Which do you like better, coffee or tea? I like coffee better.",
            "exampleId": "Antara kopi dan teh, mana yang lebih kamu suka? Saya lebih suka kopi."
          },
          {
            "exampleJp": "夏と冬とどちらが暑いですか。夏のほうが暑いです。",
            "exampleKana": "なつとふゆとどちらがあついですか。なつのほうがあついです。",
            "exampleEn": "Which is hotter, summer or winter? Summer is hotter.",
            "exampleId": "Antara musim panas dan musim dingin, mana yang lebih panas? Musim panas lebih panas."
          },
          {
            "exampleJp": "電車とバスとどちらが速いですか。電車のほうが速いです。",
            "exampleKana": "でんしゃとバスとどちらがはやいですか。でんしゃのほうがはやいです。",
            "exampleEn": "Which is faster, the train or the bus? The train is faster.",
            "exampleId": "Antara kereta dan bus, mana yang lebih cepat? Kereta lebih cepat."
          }
        ]
      },
      {
        "id": "n-wa-dou-desuka-kan-yuu",
        "pattern": "N はどうですか (勧誘)",
        "jlpt": "N5",
        "descEn": "Offers or suggests N politely.",
        "descId": "Menawarkan atau menyarankan N secara sopan.",
        "examples": [
          {
            "exampleJp": "お茶はどうですか。",
            "exampleKana": "おちゃはどうですか。",
            "exampleEn": "How about some tea?",
            "exampleId": "Bagaimana kalau minum teh?"
          },
          {
            "exampleJp": "映画はどうですか。",
            "exampleKana": "えいがはどうですか。",
            "exampleEn": "How about watching a movie?",
            "exampleId": "Bagaimana kalau menonton film?"
          },
          {
            "exampleJp": "冷たいジュースはどうですか。",
            "exampleKana": "つめたいジュースはどうですか。",
            "exampleEn": "How about some cold juice?",
            "exampleId": "Bagaimana kalau jus dingin?"
          }
        ]
      },
      {
        "id": "sentence-yo",
        "pattern": "＿＿＿よ",
        "jlpt": "N5",
        "descEn": "Sentence-ending particle to inform new information.",
        "descId": "Partikel akhir kalimat untuk menginformasikan hal baru kepada pendengar.",
        "examples": [
          {
            "exampleJp": "明日は休みですよ。",
            "exampleKana": "あしたはやすみですよ。",
            "exampleEn": "Tomorrow is a day off, you know.",
            "exampleId": "Besok libur, lho."
          },
          {
            "exampleJp": "この料理はとてもおいしいですよ。",
            "exampleKana": "このりょうりはとてもおいしいですよ。",
            "exampleEn": "This food is very delicious.",
            "exampleId": "Masakan ini enak sekali, lho."
          },
          {
            "exampleJp": "会議は3時に始まりますよ。",
            "exampleKana": "かいぎはさんじにはじまりますよ。",
            "exampleEn": "The meeting starts at 3 o'clock.",
            "exampleId": "Rapatnya mulai jam 3, lho."
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
        "pattern": "N1 は N2 (場所) に います／あります",
        "jlpt": "N5",
        "descEn": "Expresses location of a specific person (imasu) or thing (arimasu).",
        "descId": "Menyatakan lokasi keberadaan orang (imasu) atau benda (arimasu) yang spesifik.",
        "examples": [
          {
            "exampleJp": "田中さんは教室にいます。",
            "exampleKana": "たなかさんはきょうしつにいます。",
            "exampleEn": "Tanaka-san is in the classroom.",
            "exampleId": "Tanaka-san ada di dalam kelas."
          },
          {
            "exampleJp": "私の本は机の上にあります。",
            "exampleKana": "わたしのほんはつくえのうえにあります。",
            "exampleEn": "My book is on the desk.",
            "exampleId": "Buku saya ada di atas meja."
          },
          {
            "exampleJp": "猫は庭にいます。",
            "exampleKana": "ねこはにわにいます。",
            "exampleEn": "The cat is in the garden.",
            "exampleId": "Kucing itu ada di taman."
          }
        ]
      },
      {
        "id": "n1-ni-n2-ga-imasu-arimasu",
        "pattern": "N1 (場所) に N2 が います／あります",
        "jlpt": "N5",
        "descEn": "Expresses presence of animate (imasu) or inanimate (arimasu) object in place N1.",
        "descId": "Menyatakan keberadaan makhluk hidup (imasu) atau benda mati (arimasu) di tempat N1.",
        "examples": [
          {
            "exampleJp": "教室に学生がいます。",
            "exampleKana": "きょうしつにがくせいがいます。",
            "exampleEn": "There is a student in the classroom.",
            "exampleId": "Ada murid di dalam kelas."
          },
          {
            "exampleJp": "部屋にテレビがあります。",
            "exampleKana": "へやにテレビがあります。",
            "exampleEn": "There is a TV in the room.",
            "exampleId": "Ada televisi di dalam kamar."
          },
          {
            "exampleJp": "公園に子供がいます。",
            "exampleKana": "こうえんにこどもがいます。",
            "exampleEn": "There are children in the park.",
            "exampleId": "Ada anak-anak di taman."
          }
        ]
      },
      {
        "id": "mada-mou-existence",
        "pattern": "まだ／もう",
        "jlpt": "N5",
        "descEn": "Indicates 'still' (mada) or 'already/no longer' (mou).",
        "descId": "Menunjukkan keadaan 'masih' (mada) atau 'sudah/tidak lagi' (mou).",
        "examples": [
          {
            "exampleJp": "もう昼ごはんを食べました。",
            "exampleKana": "もうひるごはんをたべました。",
            "exampleEn": "I have already eaten lunch.",
            "exampleId": "Saya sudah makan siang."
          },
          {
            "exampleJp": "まだ宿題をしていません。",
            "exampleKana": "まだしゅくだいをしていません。",
            "exampleEn": "I haven't done my homework yet.",
            "exampleId": "Saya belum mengerjakan PR."
          },
          {
            "exampleJp": "もう雨はやみました。",
            "exampleKana": "もうあめはやみました。",
            "exampleEn": "The rain has already stopped.",
            "exampleId": "Hujannya sudah reda."
          }
        ]
      },
      {
        "id": "dare-ga-subject-marker",
        "pattern": "誰が",
        "jlpt": "N5",
        "descEn": "Question word for subject, always followed by particle ga.",
        "descId": "Kata tanya subjek, selalu diikuti partikel 'ga' bukan 'wa'.",
        "examples": [
          {
            "exampleJp": "誰が日本語を教えますか。",
            "exampleKana": "だれがにほんごをおしえますか。",
            "exampleEn": "Who teaches Japanese?",
            "exampleId": "Siapa yang mengajar bahasa Jepang?"
          },
          {
            "exampleJp": "誰がこのケーキを作りましたか。",
            "exampleKana": "だれがこのケーキをつくりましたか。",
            "exampleEn": "Who made this cake?",
            "exampleId": "Siapa yang membuat kue ini?"
          },
          {
            "exampleJp": "誰が部屋にいますか。",
            "exampleKana": "だれがへやにいますか。",
            "exampleEn": "Who is in the room?",
            "exampleId": "Siapa yang ada di dalam kamar?"
          }
        ]
      },
      {
        "id": "dono-n-dore",
        "pattern": "どの N／どれ",
        "jlpt": "N5",
        "descEn": "Question words for choosing among three or more items.",
        "descId": "Kata tanya untuk memilih di antara tiga barang atau lebih.",
        "examples": [
          {
            "exampleJp": "どのペンがあなたのですか。",
            "exampleKana": "どのぺんがあなたのですか。",
            "exampleEn": "Which pen is yours?",
            "exampleId": "Pena yang mana milik Anda?"
          },
          {
            "exampleJp": "どれが一番おいしいですか。",
            "exampleKana": "どれがいちばんおいしいですか。",
            "exampleEn": "Which one is the most delicious?",
            "exampleId": "Yang mana yang paling enak?"
          },
          {
            "exampleJp": "どの本が日本語の勉強にいいですか。",
            "exampleKana": "どのほんがにほんごのべんきょうにいいですか。",
            "exampleEn": "Which book is good for studying Japanese?",
            "exampleId": "Buku yang mana yang bagus untuk belajar bahasa Jepang?"
          }
        ]
      },
      {
        "id": "n-dougu-de",
        "pattern": "N (道具) で",
        "jlpt": "N5",
        "descEn": "Indicates instrument or tool used ('With chopsticks').",
        "descId": "Menunjukkan alat atau instrumen yang digunakan ('Dengan sumpit').",
        "examples": [
          {
            "exampleJp": "箸でご飯を食べます。",
            "exampleKana": "はしでごはんをたべます。",
            "exampleEn": "I eat rice with chopsticks.",
            "exampleId": "Saya makan nasi dengan sumpit."
          },
          {
            "exampleJp": "ペンで手紙を書きます。",
            "exampleKana": "ぺんでてがみをかきます。",
            "exampleEn": "I write a letter with a pen.",
            "exampleId": "Saya menulis surat dengan pena."
          },
          {
            "exampleJp": "ハサミで紙を切ります。",
            "exampleKana": "はさみでかみをきります。",
            "exampleEn": "I cut paper with scissors.",
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
        "id": "n1-wa-n2-ga-a-desu",
        "pattern": "N1 は N2 が A です",
        "jlpt": "N5",
        "descEn": "Describes N1's N2 attribute with an adjective (e.g. hair is long, good at soccer).",
        "descId": "Menyatakan atribut N2 milik N1 yang bersifat A (misal: rambut panjang, mahir bola).",
        "examples": [
          {
            "exampleJp": "象は鼻が長いです。",
            "exampleKana": "ぞうは はなが ながいです。",
            "exampleEn": "Elephants have long noses.",
            "exampleId": "Gajah hidungnya panjang."
          },
          {
            "exampleJp": "田中さんは日本語が上手です。",
            "exampleKana": "たなかさんは にほんごが じょうずです。",
            "exampleEn": "Tanaka-san is good at Japanese.",
            "exampleId": "Tanaka-san mahir bahasa Jepang."
          },
          {
            "exampleJp": "この部屋は天井が高いです。",
            "exampleKana": "このへやは てんじょうが たかいです。",
            "exampleEn": "This room has a high ceiling.",
            "exampleId": "Ruangan ini langit-langitnya tinggi."
          }
        ]
      },
      {
        "id": "n-person-ni-n-o-agemasu-moraimasu-kuremasu",
        "pattern": "N1 (人) に N2 (物) を あげます／もらいます／くれます",
        "jlpt": "N5",
        "descEn": "Givers and receivers of objects (give to, receive from, give to me).",
        "descId": "Transaksi pemberian barang (memberi kepada, menerima dari, memberi kepada saya).",
        "examples": [
          {
            "exampleJp": "私は友達にプレゼントをあげました。",
            "exampleKana": "わたしは ともだちに ぷれぜんとを あげました。",
            "exampleEn": "I gave a present to my friend.",
            "exampleId": "Saya memberikan hadiah kepada teman."
          },
          {
            "exampleJp": "私は先生に本をもらいました。",
            "exampleKana": "わたしは せんせいに ほんを もらいました。",
            "exampleEn": "I received a book from the teacher.",
            "exampleId": "Saya menerima buku dari guru."
          },
          {
            "exampleJp": "母が私に手紙をくれました。",
            "exampleKana": "ははが わたしに てがみを くれました。",
            "exampleEn": "My mother gave me a letter.",
            "exampleId": "Ibu memberikan surat kepada saya."
          }
        ]
      },
      {
        "id": "n-person-ga-counter-imasu",
        "pattern": "N (人) が [～人] います",
        "jlpt": "N5",
        "descEn": "Expresses headcount of people.",
        "descId": "Menyatakan jumlah orang yang ada.",
        "examples": [
          {
            "exampleJp": "教室に学生が三人います。",
            "exampleKana": "きょうしつに がくせいが さんにん います。",
            "exampleEn": "There are three students in the classroom.",
            "exampleId": "Ada tiga murid di dalam kelas."
          },
          {
            "exampleJp": "家に家族が四人います。",
            "exampleKana": "うちに かぞくが よにん います。",
            "exampleEn": "There are four family members at home.",
            "exampleId": "Ada empat anggota keluarga di rumah."
          },
          {
            "exampleJp": "公園に子供が二人います。",
            "exampleKana": "こうえんに こどもが ふたり います。",
            "exampleEn": "There are two children in the park.",
            "exampleId": "Ada dua anak di taman."
          }
        ]
      },
      {
        "id": "person-counter-de",
        "pattern": "[～人] で",
        "jlpt": "N5",
        "descEn": "Indicates number of people doing an activity together.",
        "descId": "Menunjukkan jumlah orang yang melakukan aktivitas bersama-sama.",
        "examples": [
          {
            "exampleJp": "三人で映画を見に行きます。",
            "exampleKana": "さんにんで えいがを みに いきます。",
            "exampleEn": "We will go to see a movie with three people.",
            "exampleId": "Kami pergi menonton film bertiga."
          },
          {
            "exampleJp": "二人でランチを食べました。",
            "exampleKana": "ふたりで らんちを たべました。",
            "exampleEn": "We ate lunch together, the two of us.",
            "exampleId": "Kami makan siang berdua."
          },
          {
            "exampleJp": "五人でサッカーをします。",
            "exampleKana": "ごにんで さっかーを します。",
            "exampleEn": "We will play soccer with five people.",
            "exampleId": "Kami bermain sepak bola berlima."
          }
        ]
      }
    ]
  },
  {
    "chapter": 9,
    "titleEn": "Frequency & Conjunctions",
    "titleId": "Frekuensi Kegiatan & Kata Hubung",
    "patterns": [
      {
        "id": "period-ni-counter",
        "pattern": "[期間] に [回数]",
        "jlpt": "N5",
        "descEn": "Expresses frequency within a period ('Twice a week').",
        "descId": "Menyatakan frekuensi dalam kurun waktu tertentu ('Dua kali seminggu').",
        "examples": [
          {
            "exampleJp": "私は一週間に二回テニスをします。",
            "exampleKana": "わたしはいっしゅうかんににかいてにすをします。",
            "exampleEn": "I play tennis twice a week.",
            "exampleId": "Saya bermain tenis dua kali seminggu."
          },
          {
            "exampleJp": "この薬は一日に三回飲んでください。",
            "exampleKana": "このくすりはいちにちにさんかいのんでください。",
            "exampleEn": "Please take this medicine three times a day.",
            "exampleId": "Tolong minum obat ini tiga kali sehari."
          },
          {
            "exampleJp": "一ヶ月に一回、映画を見に行きます。",
            "exampleKana": "いっかげつにいっかい、えいがをみにいきます。",
            "exampleEn": "I go to see a movie once a month.",
            "exampleId": "Saya pergi menonton film sebulan sekali."
          }
        ]
      },
      {
        "id": "frequency-adverbs",
        "pattern": "いつも／よく／ときどき／あまり／全然",
        "jlpt": "N5",
        "descEn": "Adverbs of frequency. Last two are paired with negative verb forms.",
        "descId": "Kata keterangan frekuensi. Dua terakhir wajib menggunakan bentuk negatif.",
        "examples": [
          {
            "exampleJp": "私はいつも朝ごはんを食べます。",
            "exampleKana": "わたしはいつもあさごはんをたべます。",
            "exampleEn": "I always eat breakfast.",
            "exampleId": "Saya selalu sarapan pagi."
          },
          {
            "exampleJp": "あまりテレビを見ません。",
            "exampleKana": "あまりてれびをみません。",
            "exampleEn": "I don't watch TV very much.",
            "exampleId": "Saya jarang menonton TV."
          },
          {
            "exampleJp": "全然日本語がわかりません。",
            "exampleKana": "ぜんぜんにほんごがわかりません。",
            "exampleEn": "I don't understand Japanese at all.",
            "exampleId": "Saya sama sekali tidak mengerti bahasa Jepang."
          }
        ]
      },
      {
        "id": "douyatte",
        "pattern": "どうやって",
        "jlpt": "N5",
        "descEn": "Asks for directions or method of doing ('How / By what means?').",
        "descId": "Menanyakan cara atau petunjuk menuju suatu tempat ('Bagaimana caranya?').",
        "examples": [
          {
            "exampleJp": "どうやって学校へ行きますか。",
            "exampleKana": "どうやってがっこうへいきますか。",
            "exampleEn": "How do you get to school?",
            "exampleId": "Bagaimana cara kamu pergi ke sekolah?"
          },
          {
            "exampleJp": "どうやってこの漢字を書きますか。",
            "exampleKana": "どうやってこのかんじをかきますか。",
            "exampleEn": "How do you write this Kanji?",
            "exampleId": "Bagaimana cara menulis Kanji ini?"
          },
          {
            "exampleJp": "駅までどうやって行きますか。",
            "exampleKana": "えきまでどうやっていきますか。",
            "exampleEn": "How do I get to the station?",
            "exampleId": "Bagaimana cara pergi ke stasiun?"
          }
        ]
      },
      {
        "id": "demo",
        "pattern": "でも",
        "jlpt": "N5",
        "descEn": "Conjunction meaning 'but' or 'however', used at sentence start.",
        "descId": "Kata hubung di awal kalimat yang berarti 'namun' atau 'tetapi'.",
        "examples": [
          {
            "exampleJp": "今日は忙しいです。でも、行きます。",
            "exampleKana": "きょうはいそがしいです。でも、いきます。",
            "exampleEn": "I am busy today. But, I will go.",
            "exampleId": "Hari ini saya sibuk. Tapi, saya akan pergi."
          },
          {
            "exampleJp": "料理は美味しいです。でも、高いです。",
            "exampleKana": "りょうりはおいしいです。でも、たかいです。",
            "exampleEn": "The food is delicious. However, it is expensive.",
            "exampleId": "Masakannya enak. Tapi, harganya mahal."
          },
          {
            "exampleJp": "たくさん勉強しました。でも、テストは難しかったです。",
            "exampleKana": "たくさんべんきょうしました。でも、てすとはむずかしかったです。",
            "exampleEn": "I studied a lot. But, the test was difficult.",
            "exampleId": "Saya sudah banyak belajar. Namun, ujiannya sulit."
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
        "id": "n-ga-miemasu-kikoemasu",
        "pattern": "N が見えます／聞こえます",
        "jlpt": "N4",
        "descEn": "Expresses natural visibility or audibility without active action.",
        "descId": "Menyatakan objek yang secara alami terlihat atau terdengar tanpa tindakan aktif.",
        "examples": [
          {
            "exampleJp": "窓から山が見えます。",
            "exampleKana": "まどからやまがみえます。",
            "exampleEn": "I can see the mountain from the window.",
            "exampleId": "Saya bisa melihat gunung dari jendela."
          },
          {
            "exampleJp": "遠くから鳥の声が聞こえます。",
            "exampleKana": "とおくからとりのこえがきこえます。",
            "exampleEn": "I can hear the sound of birds from far away.",
            "exampleId": "Saya bisa mendengar suara burung dari jauh."
          },
          {
            "exampleJp": "ここから海が見えますか。",
            "exampleKana": "ここからうみがみえますか。",
            "exampleEn": "Can you see the ocean from here?",
            "exampleId": "Apakah Anda bisa melihat laut dari sini?"
          }
        ]
      },
      {
        "id": "adjective-noun-ni-narimasu",
        "pattern": "イA-く / [ナA/N] になります",
        "jlpt": "N5",
        "descEn": "Expresses change in state ('to become cold / turn 12 o'clock').",
        "descId": "Menyatakan perubahan keadaan/waktu ('menjadi dingin / menjadi jam 12').",
        "examples": [
          {
            "exampleJp": "冬になって、寒くなりました。",
            "exampleKana": "ふゆになって、さむくなりました。",
            "exampleEn": "It became winter, and it got cold.",
            "exampleId": "Sudah masuk musim dingin, dan (cuaca) menjadi dingin."
          },
          {
            "exampleJp": "もう12時になりました。",
            "exampleKana": "もうじゅうにじになりました。",
            "exampleEn": "It has already become 12 o'clock.",
            "exampleId": "Sudah jam 12 sekarang."
          },
          {
            "exampleJp": "日本語が上手になりました。",
            "exampleKana": "にほんごがじょうずになりました。",
            "exampleEn": "My Japanese has become good.",
            "exampleId": "Bahasa Jepang saya sudah menjadi mahir."
          }
        ]
      },
      {
        "id": "n-basho-o-movement",
        "pattern": "N (場所) を",
        "jlpt": "N4",
        "descEn": "Indicates space of motion (passing through, crossing, turning).",
        "descId": "Menunjukkan ruang yang dilewati/dilalui saat bergerak (menyeberang, berbelok).",
        "examples": [
          {
            "exampleJp": "公園を散歩します。",
            "exampleKana": "こうえんをさんぽします。",
            "exampleEn": "I take a walk in the park.",
            "exampleId": "Saya berjalan-jalan di taman."
          },
          {
            "exampleJp": "この道をまっすぐ行きます。",
            "exampleKana": "このみちをまっすぐいきます。",
            "exampleEn": "Go straight along this road.",
            "exampleId": "Jalan lurus terus di jalan ini."
          },
          {
            "exampleJp": "交差点を右に曲がります。",
            "exampleKana": "こうさてんをみぎにまがります。",
            "exampleEn": "Turn right at the intersection.",
            "exampleId": "Belok kanan di persimpangan."
          }
        ]
      },
      {
        "id": "n-wa-contrastive",
        "pattern": "N は (対比・強調)",
        "jlpt": "N5",
        "descEn": "Brings focus to a topic, often contrastive in a sentence.",
        "descId": "Menekankan topik kalimat, sering kali digunakan untuk membedakan kontras.",
        "examples": [
          {
            "exampleJp": "今日は忙しいですが、明日は暇です。",
            "exampleKana": "きょうはいそがしいですが、あしたはひまです。",
            "exampleEn": "I am busy today, but I am free tomorrow.",
            "exampleId": "Hari ini saya sibuk, tapi besok saya senggang."
          },
          {
            "exampleJp": "肉は食べますが、魚は食べません。",
            "exampleKana": "にくはたべますが、さかなはたべません。",
            "exampleEn": "I eat meat, but I do not eat fish.",
            "exampleId": "Saya makan daging, tapi saya tidak makan ikan."
          },
          {
            "exampleJp": "コーヒーは飲みますが、紅茶は飲みません。",
            "exampleKana": "こーひーはのみますが、こうちゃはのみません。",
            "exampleEn": "I drink coffee, but I do not drink black tea.",
            "exampleId": "Saya minum kopi, tapi saya tidak minum teh hitam."
          }
        ]
      }
    ]
  },
  {
    "chapter": 11,
    "titleEn": "Contrast & Confusion",
    "titleId": "Kalimat Kontras & Kebingungan",
    "patterns": [
      {
        "id": "n1-wa-ga-n2-wa",
        "pattern": "N1 は ＿＿＿ が、N2 は ＿＿＿",
        "jlpt": "N5",
        "descEn": "Contrasts two different items using particle wa.",
        "descId": "Membandingkan dua topik kontras menggunakan partikel wa.",
        "examples": [
          {
            "exampleJp": "兄は背が高いが、弟は背が低い。",
            "exampleKana": "あにはせがたかいが、おとうとはせがひくい。",
            "exampleEn": "My older brother is tall, but my younger brother is short.",
            "exampleId": "Kakak laki-laki saya tinggi, tetapi adik laki-laki saya pendek."
          },
          {
            "exampleJp": "夏は暑いが、冬は寒い。",
            "exampleKana": "なつはあついがいふゆはさむい。",
            "exampleEn": "Summer is hot, but winter is cold.",
            "exampleId": "Musim panas itu panas, tetapi musim dingin itu dingin."
          },
          {
            "exampleJp": "この部屋は広いが、あの部屋は狭い。",
            "exampleKana": "このへやはひろいがあのへやはせまい。",
            "exampleEn": "This room is spacious, but that room is small.",
            "exampleId": "Ruangan ini luas, tetapi ruangan itu sempit."
          }
        ]
      },
      {
        "id": "doushimasuka",
        "pattern": "どうしますか",
        "jlpt": "N5",
        "descEn": "Asking what one should do in a situation.",
        "descId": "Menanyakan apa yang sebaiknya dilakukan dalam suatu keadaan.",
        "examples": [
          {
            "exampleJp": "雨が降ってきました。どうしますか。",
            "exampleKana": "あめがふってきました。どうしますか。",
            "exampleEn": "It has started to rain. What shall we do?",
            "exampleId": "Hujan mulai turun. Apa yang akan kita lakukan?"
          },
          {
            "exampleJp": "電車が遅れています。どうしますか。",
            "exampleKana": "でんしゃがおくれています。どうしますか。",
            "exampleEn": "The train is delayed. What should we do?",
            "exampleId": "Keretanya terlambat. Apa yang sebaiknya kita lakukan?"
          },
          {
            "exampleJp": "時間がありません。どうしますか。",
            "exampleKana": "じかんがありません。どうしますか。",
            "exampleEn": "There is no time. What are you going to do?",
            "exampleId": "Tidak ada waktu. Apa yang akan kamu lakukan?"
          }
        ]
      }
    ]
  },
  {
    "chapter": 13,
    "titleEn": "Knowledge States & Named Expressions",
    "titleId": "Keadaan Pengetahuan & Ungkapan Nama",
    "patterns": [
      {
        "id": "shitteimasu-shirimasen",
        "pattern": "知っています／知りません",
        "jlpt": "N5",
        "descEn": "State of knowing or not knowing (uses shirimasen instead of shitteimasen).",
        "descId": "Menyatakan tahu (shitteimasu) atau tidak tahu (shirimasen — bentuk perkecualian).",
        "examples": [
          {
            "exampleJp": "私はこの歌を知っています。",
            "exampleKana": "わたしは このうたを しっています。",
            "exampleEn": "I know this song.",
            "exampleId": "Saya tahu lagu ini."
          },
          {
            "exampleJp": "田中さんの電話番号を知っていますか。",
            "exampleKana": "たなかさんの でんわばんごうを しっていますか。",
            "exampleEn": "Do you know Mr. Tanaka's phone number?",
            "exampleId": "Apakah Anda tahu nomor telepon Pak Tanaka?"
          },
          {
            "exampleJp": "すみません、道を知りません。",
            "exampleKana": "すみません、みちを しりません。",
            "exampleEn": "Excuse me, I don't know the way.",
            "exampleId": "Maaf, saya tidak tahu jalannya."
          }
        ]
      },
      {
        "id": "n1-to-iu-n2",
        "pattern": "N1 という N2",
        "jlpt": "N4",
        "descEn": "Expression to name or call N2 as N1 ('N2 called N1').",
        "descId": "Ungkapan untuk mendeskripsikan N2 yang bernama N1 ('N2 yang bernama/disebut N1').",
        "examples": [
          {
            "exampleJp": "これは「すし」という食べ物です。",
            "exampleKana": "これは「すし」という たべものです。",
            "exampleEn": "This is a food called 'sushi'.",
            "exampleId": "Ini adalah makanan yang disebut 'sushi'."
          },
          {
            "exampleJp": "昨日、佐藤という人から電話がありました。",
            "exampleKana": "きのう、さとうという ひとから でんわが ありました。",
            "exampleEn": "Yesterday, there was a call from a person named Sato.",
            "exampleId": "Kemarin, ada telepon dari orang yang bernama Sato."
          },
          {
            "exampleJp": "「にほんご」という本を読んでいます。",
            "exampleKana": "「にほんご」という ほんを よんでいます。",
            "exampleEn": "I am reading a book called 'Nihongo'.",
            "exampleId": "Saya sedang membaca buku yang berjudul 'Nihongo'."
          }
        ]
      }
    ]
  },
  {
    "chapter": 15,
    "titleEn": "Causes of Events",
    "titleId": "Penyebab Kejadian",
    "patterns": [
      {
        "id": "n-de-reason",
        "pattern": "N で (原因)",
        "jlpt": "N4",
        "descEn": "Indicates cause or reason for a state/event ('Due to N').",
        "descId": "Menunjukkan sebab atau alasan terjadinya suatu kejadian/kondisi ('Karena/Akibat N').",
        "examples": [
          {
            "exampleJp": "地震で家が壊れました。",
            "exampleKana": "じしんでいえがこわれました。",
            "exampleEn": "The house was destroyed by the earthquake.",
            "exampleId": "Rumah hancur karena gempa bumi."
          },
          {
            "exampleJp": "病気で学校を休みます。",
            "exampleKana": "びょうきでがっこうをやすみます。",
            "exampleEn": "I will be absent from school due to illness.",
            "exampleId": "Saya absen sekolah karena sakit."
          },
          {
            "exampleJp": "事故で電車が遅れました。",
            "exampleKana": "じこででんしゃがおくれました。",
            "exampleEn": "The train was delayed because of an accident.",
            "exampleId": "Kereta terlambat karena ada kecelakaan."
          }
        ]
      }
    ]
  }
];
