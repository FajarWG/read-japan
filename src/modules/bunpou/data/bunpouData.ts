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
            "exampleJp": "これは私の本です。",
            "exampleKana": "これはわたしのほんです。",
            "exampleEn": "This is my book.",
            "exampleId": "Ini adalah buku saya."
          },
          {
            "exampleJp": "それは日本の車です。",
            "exampleKana": "それはにほんのくるまです。",
            "exampleEn": "That is a Japanese car.",
            "exampleId": "Itu adalah mobil Jepang."
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
            "exampleJp": "あなたは学生ですか。",
            "exampleKana": "あなたはがくせいですか。",
            "exampleEn": "Are you a student?",
            "exampleId": "Apakah Anda seorang pelajar?"
          },
          {
            "exampleJp": "それはあなたの本ですか。",
            "exampleKana": "それはあなたのほんですか。",
            "exampleEn": "Is that your book?",
            "exampleId": "Apakah itu buku Anda?"
          },
          {
            "exampleJp": "それは日本の車ですか。",
            "exampleKana": "それはにほんのくるまですか。",
            "exampleEn": "Is that a Japanese car?",
            "exampleId": "Apakah itu mobil Jepang?"
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
            "exampleJp": "トイレはどこですか。",
            "exampleKana": "トイレはどこですか。",
            "exampleEn": "Where is the restroom?",
            "exampleId": "Di mana toiletnya?"
          },
          {
            "exampleJp": "あなたの誕生日はいつですか。",
            "exampleKana": "あなたのたんじょうびはいつですか。",
            "exampleEn": "When is your birthday?",
            "exampleId": "Kapan ulang tahun Anda?"
          },
          {
            "exampleJp": "これは何ですか。",
            "exampleKana": "これはなんですか。",
            "exampleEn": "What is this?",
            "exampleId": "Apa ini?"
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
            "exampleJp": "これは私の先生の辞書です。",
            "exampleKana": "これはわたしのせんせいのじしょです。",
            "exampleEn": "This is my teacher's dictionary.",
            "exampleId": "Ini adalah kamus guru saya."
          },
          {
            "exampleJp": "それは日本の大学の本ですか。",
            "exampleKana": "それはにほんだいがくのほんですか。",
            "exampleEn": "Is that a book from a Japanese university?",
            "exampleId": "Apakah itu buku dari universitas Jepang?"
          },
          {
            "exampleJp": "田中さんの車はどれですか。",
            "exampleKana": "たなかさんのくるまはどれですか。",
            "exampleEn": "Which one is Mr. Tanaka's car?",
            "exampleId": "Yang mana mobil milik Pak Tanaka?"
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
            "exampleJp": "ペンとノートを買いました。",
            "exampleKana": "ぺんとのおーとをかいました。",
            "exampleEn": "I bought a pen and a notebook.",
            "exampleId": "Saya membeli pulpen dan buku catatan."
          },
          {
            "exampleJp": "机の上に本とペンがあります。",
            "exampleKana": "つくえのうえにほんとぺんがあります。",
            "exampleEn": "There is a book and a pen on the desk.",
            "exampleId": "Ada buku dan pulpen di atas meja."
          },
          {
            "exampleJp": "明日、田中さんと佐藤さんと会います。",
            "exampleKana": "あした、たなかさんとさとうさんとあいます。",
            "exampleEn": "I will meet Mr. Tanaka and Mr. Sato tomorrow.",
            "exampleId": "Besok, saya akan bertemu dengan Pak Tanaka dan Pak Sato."
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
            "exampleJp": "私も行きます。",
            "exampleKana": "わたしもいきます。",
            "exampleEn": "I will go too.",
            "exampleId": "Saya juga akan pergi."
          },
          {
            "exampleJp": "ペンを買いました。ノートも買いました。",
            "exampleKana": "ぺんをかいました。のおーともかいました。",
            "exampleEn": "I bought a pen. I also bought a notebook.",
            "exampleId": "Saya membeli pulpen. Saya juga membeli buku catatan."
          },
          {
            "exampleJp": "机の上に本があります。ペンもあります。",
            "exampleKana": "つくえのうえにほんがあります。ぺんもあります。",
            "exampleEn": "There is a book on the desk. There is a pen too.",
            "exampleId": "Ada buku di atas meja. Ada pulpen juga."
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
            "exampleKana": "これはわたし　の　ほん　です。",
            "exampleEn": "This is my book.",
            "exampleId": "Ini adalah buku saya."
          },
          {
            "exampleJp": "それは何ですか。",
            "exampleKana": "それ　は　なん　です　か。",
            "exampleEn": "What is that (near you)?",
            "exampleId": "Apa itu (di dekat Anda)?"
          },
          {
            "exampleJp": "あれは学校です。",
            "exampleKana": "あれ　は　がっこう　です。",
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
            "exampleJp": "この本は面白いです。",
            "exampleKana": "この　ほん　は　おもしろい　です。",
            "exampleEn": "This book is interesting.",
            "exampleId": "Buku ini menarik."
          },
          {
            "exampleJp": "そのペンは誰のですか。",
            "exampleKana": "その　ぺん　は　だれ　の　です　か。",
            "exampleEn": "Whose pen is that?",
            "exampleId": "Pena itu milik siapa?"
          },
          {
            "exampleJp": "あの車はとても速いです。",
            "exampleKana": "あの　くるま　は　とても　はやい　です。",
            "exampleEn": "That car over there is very fast.",
            "exampleId": "Mobil di sana itu sangat cepat."
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
            "exampleJp": "ここは私の教室です。",
            "exampleKana": "ここ　は　わたし　の　きょうしつ　です。",
            "exampleEn": "This is my classroom.",
            "exampleId": "Ini adalah ruang kelas saya."
          },
          {
            "exampleJp": "トイレはどこですか。",
            "exampleKana": "といれ　は　どこ　です　か。",
            "exampleEn": "Where is the restroom?",
            "exampleId": "Di mana toiletnya?"
          },
          {
            "exampleJp": "そこはあそこより近いです。",
            "exampleKana": "そこ　は　あそこ　より　ちかい　です。",
            "exampleEn": "That place (near you) is closer than that place (over there).",
            "exampleId": "Tempat di situ lebih dekat daripada tempat di sana."
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
            "exampleJp": "水をください。",
            "exampleKana": "みず　を　ください。",
            "exampleEn": "Please give me water.",
            "exampleId": "Tolong beri saya air."
          },
          {
            "exampleJp": "このペンをください。",
            "exampleKana": "この　ぺん　を　ください。",
            "exampleEn": "Please give me this pen.",
            "exampleId": "Tolong beri saya pena ini."
          },
          {
            "exampleJp": "あそこのパンをください。",
            "exampleKana": "あそこ　の　ぱん　を　ください。",
            "exampleEn": "Please give me that bread (over there).",
            "exampleId": "Tolong beri saya roti yang di sana itu."
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
            "exampleJp": "その赤い時計はいくらですか。",
            "exampleKana": "そのあかいとけいはいくらですか。",
            "exampleEn": "How much is that red watch?",
            "exampleId": "Berapa harga jam tangan merah itu?"
          },
          {
            "exampleJp": "あの新しいカメラはいくらですか。",
            "exampleKana": "あのあたらしいかめらはいくらですか。",
            "exampleEn": "How much is that new camera over there?",
            "exampleId": "Berapa harga kamera baru di sana itu?"
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
            "exampleJp": "それは何の本ですか。",
            "exampleKana": "それはなんのほんですか。",
            "exampleEn": "What kind of book is that?",
            "exampleId": "Itu buku tentang apa?"
          },
          {
            "exampleJp": "これは何の雑誌ですか。",
            "exampleKana": "これはなんのざっしですか。",
            "exampleEn": "What kind of magazine is this?",
            "exampleId": "Ini majalah tentang apa?"
          },
          {
            "exampleJp": "その高い辞書は何の辞書ですか。",
            "exampleKana": "そのたかいじしょはなんのじしょですか。",
            "exampleEn": "What kind of dictionary is that expensive dictionary?",
            "exampleId": "Kamus apa kamus mahal itu?"
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
            "exampleJp": "それはどこの靴ですか。",
            "exampleKana": "それはどこのくつですか。",
            "exampleEn": "Where are those shoes from?",
            "exampleId": "Sepatu itu buatan mana?"
          },
          {
            "exampleJp": "このパソコンはどこのパソコンですか。",
            "exampleKana": "このぱそこんはどこのぱそこんですか。",
            "exampleEn": "Where is this computer from?",
            "exampleId": "Komputer ini buatan mana?"
          },
          {
            "exampleJp": "そのどこのカメラもいくらですか。",
            "exampleKana": "そのどこのかめらもいくらですか。",
            "exampleEn": "How much are those cameras from anywhere?",
            "exampleId": "Berapa harga kamera dari mana pun itu?"
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
            "exampleJp": "それは誰の傘ですか。",
            "exampleKana": "それはだれのかさですか。",
            "exampleEn": "Whose umbrella is that?",
            "exampleId": "Itu payung milik siapa?"
          },
          {
            "exampleJp": "このどこの時計が誰の時計ですか。",
            "exampleKana": "このどこのとけいがだれのとけいですか。",
            "exampleEn": "Whose watch is this watch from that place?",
            "exampleId": "Jam tangan dari tempat itu ini milik siapa?"
          },
          {
            "exampleJp": "その何の雑誌は誰の雑誌ですか。",
            "exampleKana": "そのなんのざっしはだれのざっしですか。",
            "exampleEn": "Whose magazine is that magazine about?",
            "exampleId": "Majalah tentang itu milik siapa?"
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
            "exampleKana": "にほんごで はなして ください。",
            "exampleEn": "Please speak in Japanese.",
            "exampleId": "Tolong bicara dalam bahasa Jepang."
          },
          {
            "exampleJp": "この本は英語で書いてあります。",
            "exampleKana": "この ほんは えいごで かいて あります。",
            "exampleEn": "This book is written in English.",
            "exampleId": "Buku ini ditulis dalam bahasa Inggris."
          },
          {
            "exampleJp": "日本語で手紙を書きたいです。",
            "exampleKana": "にほんごで てがみを かきたいです。",
            "exampleEn": "I want to write a letter in Japanese.",
            "exampleId": "Saya ingin menulis surat dalam bahasa Jepang."
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
            "exampleJp": "朝、コーヒーを飲みません。",
            "exampleKana": "あさ、こーひーをのみません。",
            "exampleEn": "I do not drink coffee in the morning.",
            "exampleId": "Saya tidak minum kopi di pagi hari."
          },
          {
            "exampleJp": "明日、新しい本を読みます。",
            "exampleKana": "あした、あたらしいほんをよみます。",
            "exampleEn": "I will read a new book tomorrow.",
            "exampleId": "Saya akan membaca buku baru besok."
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
            "exampleJp": "学校へ行きます。",
            "exampleKana": "がっこうへいきます。",
            "exampleEn": "I go to school.",
            "exampleId": "Saya pergi ke sekolah."
          },
          {
            "exampleJp": "図書館へ行きません。",
            "exampleKana": "としょかんへいきません。",
            "exampleEn": "I do not go to the library.",
            "exampleId": "Saya tidak pergi ke perpustakaan."
          },
          {
            "exampleJp": "明日、友達とデパートへ行きます。",
            "exampleKana": "あした、ともだちとでぱーとへいきます。",
            "exampleEn": "I will go to the department store with my friend tomorrow.",
            "exampleId": "Besok saya pergi ke toserba bersama teman."
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
            "exampleKana": "ぱんをたべます。",
            "exampleEn": "I eat bread.",
            "exampleId": "Saya makan roti."
          },
          {
            "exampleJp": "公園で手紙を書きません。",
            "exampleKana": "こうえんでてがみをかきません。",
            "exampleEn": "I do not write a letter at the park.",
            "exampleId": "Saya tidak menulis surat di taman."
          },
          {
            "exampleJp": "学校へ行って、日本語の本を読みます。",
            "exampleKana": "がっこうへいって、にほんごのほんをよみます。",
            "exampleEn": "I go to school and read a Japanese book.",
            "exampleId": "Saya pergi ke sekolah dan membaca buku bahasa Jepang."
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
            "exampleEn": "I wake up at 7 o'clock.",
            "exampleId": "Saya bangun jam 7."
          },
          {
            "exampleJp": "八時に学校へ行きません。",
            "exampleKana": "はちじにがっこうへいきません。",
            "exampleEn": "I do not go to school at 8 o'clock.",
            "exampleId": "Saya tidak pergi ke sekolah jam 8."
          },
          {
            "exampleJp": "九時にデパートへ行って、パンを食べます。",
            "exampleKana": "くじにでぱーとへいって、ぱんをたべます。",
            "exampleEn": "I go to the department store at 9 o'clock and eat bread.",
            "exampleId": "Saya pergi ke toserba jam 9 dan makan roti."
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
            "exampleJp": "図書館で本を読みます。",
            "exampleKana": "としょかんでほんをよみます。",
            "exampleEn": "I read books at the library.",
            "exampleId": "Saya membaca buku di perpustakaan."
          },
          {
            "exampleJp": "公園で友達と遊びます。",
            "exampleKana": "こうえんでともだちとあそびます。",
            "exampleEn": "I play with my friend at the park.",
            "exampleId": "Saya bermain dengan teman di taman."
          },
          {
            "exampleJp": "レストランで晩ご飯を食べます。",
            "exampleKana": "れすとらんでばんごはんをたべます。",
            "exampleEn": "I eat dinner at a restaurant.",
            "exampleId": "Saya makan malam di restoran."
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
            "exampleJp": "家から学校まで歩きます。",
            "exampleKana": "いえからがっこうまであるきます。",
            "exampleEn": "I walk from home to school.",
            "exampleId": "Saya berjalan kaki dari rumah sampai sekolah."
          },
          {
            "exampleJp": "九時から五時まで働きます。",
            "exampleKana": "くじからごじまではたらきます。",
            "exampleEn": "I work from nine to five.",
            "exampleId": "Saya bekerja dari jam sembilan sampai jam lima."
          },
          {
            "exampleJp": "ここから駅まで歩いて行きます。",
            "exampleKana": "ここからえきまであるいていきます。",
            "exampleEn": "I walk from here to the station.",
            "exampleId": "Saya berjalan kaki dari sini sampai stasiun."
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
            "exampleJp": "カバンの中に本やペンなどがあります。",
            "exampleKana": "かばんのなかにほんやぺんなどがあります。",
            "exampleEn": "There are books, pens, etc., in the bag.",
            "exampleId": "Di dalam tas ada buku, pena, dan lain-lain."
          },
          {
            "exampleJp": "デパートで服や靴などを買います。",
            "exampleKana": "でぱーとでふくやくつなどをかいます。",
            "exampleEn": "I buy clothes, shoes, etc., at the department store.",
            "exampleId": "Saya membeli baju, sepatu, dan lain-lain di toserba."
          },
          {
            "exampleJp": "公園でリンゴやバナナなどを食べます。",
            "exampleKana": "こうえんでりんごやばなななどをたべます。",
            "exampleEn": "I eat apples, bananas, etc., at the park.",
            "exampleId": "Saya makan apel, pisang, dan lain-lain di taman."
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
            "exampleJp": "今日はどこへも行きません。",
            "exampleKana": "きょうはどこへもいきません。",
            "exampleEn": "I am not going anywhere today.",
            "exampleId": "Hari ini saya tidak pergi ke mana pun."
          },
          {
            "exampleJp": "お腹がすいていませんから、何も食べません。",
            "exampleKana": "おなかがすいていませんから、なにもたべません。",
            "exampleEn": "I am not hungry, so I will not eat anything.",
            "exampleId": "Karena saya tidak lapar, saya tidak makan apa pun."
          },
          {
            "exampleJp": "どこへも行きたくないので、家で何も買いません。",
            "exampleKana": "どこへもいきたくないので、いえでなにもかいません。",
            "exampleEn": "I don't want to go anywhere, so I won't buy anything at home.",
            "exampleId": "Karena saya tidak ingin pergi ke mana pun, saya tidak membeli apa pun di rumah."
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
            "exampleJp": "今日は暑いです。",
            "exampleKana": "きょうはあついです。",
            "exampleEn": "Today is hot.",
            "exampleId": "Hari ini panas."
          },
          {
            "exampleJp": "この部屋はきれいです。",
            "exampleKana": "このへやはきれいです。",
            "exampleEn": "This room is clean.",
            "exampleId": "Kamar ini bersih."
          },
          {
            "exampleJp": "その本は面白いです。",
            "exampleKana": "そのほんはおもしろいです。",
            "exampleEn": "That book is interesting.",
            "exampleId": "Buku itu menarik."
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
            "exampleJp": "今日は暑くないです。",
            "exampleKana": "きょうはあつくないです。",
            "exampleEn": "Today is not hot.",
            "exampleId": "Hari ini tidak panas."
          },
          {
            "exampleJp": "この部屋はきれいじゃありません。",
            "exampleKana": "このへやはきれいじゃありません。",
            "exampleEn": "This room is not clean.",
            "exampleId": "Kamar ini tidak bersih."
          },
          {
            "exampleJp": "その本は面白くないです。",
            "exampleKana": "そのほんはおもしろくないです。",
            "exampleEn": "That book is not interesting.",
            "exampleId": "Buku itu tidak menarik."
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
            "exampleJp": "暑い日は水を飲みます。",
            "exampleKana": "あついひはみずをのみます。",
            "exampleEn": "On hot days, I drink water.",
            "exampleId": "Pada hari yang panas, saya minum air."
          },
          {
            "exampleJp": "きれいな部屋で勉強します。",
            "exampleKana": "きれいなへやでべんきょうします。",
            "exampleEn": "I study in a clean room.",
            "exampleId": "Saya belajar di kamar yang bersih."
          },
          {
            "exampleJp": "面白い本を読みます。",
            "exampleKana": "おもしろいほんをよみます。",
            "exampleEn": "I read an interesting book.",
            "exampleId": "Saya membaca buku yang menarik."
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
            "exampleJp": "夏は暑いです。",
            "exampleKana": "なつはあついです。",
            "exampleEn": "Summer is hot.",
            "exampleId": "Musim panas itu panas."
          },
          {
            "exampleJp": "八月は暑い月です。",
            "exampleKana": "はちがつはあついつきです。",
            "exampleEn": "August is a hot month.",
            "exampleId": "Agustus adalah bulan yang panas."
          },
          {
            "exampleJp": "冬はきれいな雪が降ります。",
            "exampleKana": "ふゆはきれいなゆきがふります。",
            "exampleEn": "In winter, beautiful snow falls.",
            "exampleId": "Pada musim dingin, salju yang indah turun."
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
            "exampleJp": "この本はとても面白いです。",
            "exampleKana": "このほんはとてもおもしろいです。",
            "exampleEn": "This book is very interesting.",
            "exampleId": "Buku ini sangat menarik."
          },
          {
            "exampleJp": "今日は少し暑いです。",
            "exampleKana": "きょうはすこしあついです。",
            "exampleEn": "It is a little hot today.",
            "exampleId": "Hari ini sedikit panas."
          },
          {
            "exampleJp": "この部屋はとても広くて、少し静かです。",
            "exampleKana": "このへやはとてもひろくて、すこししずかです。",
            "exampleEn": "This room is very spacious and a little quiet.",
            "exampleId": "Ruangan ini sangat luas dan sedikit tenang."
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
            "exampleJp": "この映画はあまり面白くないです。",
            "exampleKana": "このえいがはあまりおもしろくないです。",
            "exampleEn": "This movie is not very interesting.",
            "exampleId": "Film ini tidak begitu menarik."
          },
          {
            "exampleJp": "今日の宿題はあまり難しくありません。",
            "exampleKana": "きょうのしゅくだいはあまりむずかしくありません。",
            "exampleEn": "Today's homework is not very difficult.",
            "exampleId": "PR hari ini tidak begitu sulit."
          },
          {
            "exampleJp": "その部屋はあまり広くなくて、少し寒いです。",
            "exampleKana": "そのへやはあまりひろくなくて、すこしさむいです。",
            "exampleEn": "That room is not very spacious and is a little cold.",
            "exampleId": "Ruangan itu tidak begitu luas dan sedikit dingin."
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
            "exampleJp": "部屋にとても面白い本があります。",
            "exampleKana": "へやにとてもおもしろいほんがあります。",
            "exampleEn": "There is a very interesting book in the room.",
            "exampleId": "Ada buku yang sangat menarik di dalam kamar."
          },
          {
            "exampleJp": "教室にあまり難しくない本があります。",
            "exampleKana": "きょうしつにあまりむずかしくないほんがあります。",
            "exampleEn": "There is a not-so-difficult book in the classroom.",
            "exampleId": "Ada buku yang tidak terlalu sulit di dalam kelas."
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
            "exampleJp": "本は机の中です。",
            "exampleKana": "ほんはつくえのなかです。",
            "exampleEn": "The book is inside the desk.",
            "exampleId": "Bukunya ada di dalam meja."
          },
          {
            "exampleJp": "机は部屋の右です。",
            "exampleKana": "つくえはへやのみぎです。",
            "exampleEn": "The desk is to the right of the room.",
            "exampleId": "Mejanya ada di sebelah kanan ruangan."
          },
          {
            "exampleJp": "とても面白い本は机の右の中にあります。",
            "exampleKana": "とてもおもしろいほんはつくえのみぎのなかにあります。",
            "exampleEn": "The very interesting book is inside the right side of the desk.",
            "exampleId": "Buku yang sangat menarik itu ada di dalam bagian kanan meja."
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
            "exampleJp": "家から駅までどのくらいですか。",
            "exampleKana": "いえからえきまでどのくらいですか。",
            "exampleEn": "How long does it take from your house to the station?",
            "exampleId": "Dari rumah sampai stasiun berapa lama?"
          },
          {
            "exampleJp": "東京から大阪までどのくらいかかりますか。",
            "exampleKana": "とうきょうからおおさかまでどのくらいかかりますか。",
            "exampleEn": "How long does it take to get from Tokyo to Osaka?",
            "exampleId": "Dari Tokyo sampai Osaka berapa lama?"
          },
          {
            "exampleJp": "学校から図書館まで、歩いてどのくらいですか。",
            "exampleKana": "がっこうからとしょかんまで、あるいてどのくらいですか。",
            "exampleEn": "How long does it take to walk from the school to the library?",
            "exampleId": "Dari sekolah sampai perpustakaan, kalau jalan kaki berapa lama?"
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
            "exampleJp": "バスで学校へ行きます。",
            "exampleKana": "バスでがっこうへいきます。",
            "exampleEn": "I go to school by bus.",
            "exampleId": "Saya pergi ke sekolah naik bus."
          },
          {
            "exampleJp": "電車で東京から大阪まで行きます。",
            "exampleKana": "でんしゃでとうきょうからおおさかまでいきます。",
            "exampleEn": "I go from Tokyo to Osaka by train.",
            "exampleId": "Saya pergi dari Tokyo ke Osaka naik kereta."
          },
          {
            "exampleJp": "家から駅まで、自転車でどのくらいかかりますか。",
            "exampleKana": "いえからえきまで、じてんしゃでどのくらいかかりますか。",
            "exampleEn": "How long does it take to get from your house to the station by bicycle?",
            "exampleId": "Dari rumah sampai stasiun, kalau naik sepeda berapa lama?"
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
            "exampleId": "Makanan seperti apa yang kamu suka?"
          },
          {
            "exampleJp": "どんな電車で東京へ行きますか。",
            "exampleKana": "どんなでんしゃでとうきょうへいきますか。",
            "exampleEn": "What kind of train do you take to go to Tokyo?",
            "exampleId": "Naik kereta yang seperti apa kamu pergi ke Tokyo?"
          },
          {
            "exampleJp": "どんな乗り物で学校から家まで帰りますか。",
            "exampleKana": "どんなのりものでがっこうからいえまでかえりますか。",
            "exampleEn": "What kind of transportation do you use to go home from school?",
            "exampleId": "Naik kendaraan apa kamu pulang dari sekolah ke rumah?"
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
            "exampleJp": "新しい電車はどうですか。",
            "exampleKana": "あたらしいでんしゃはどうですか。",
            "exampleEn": "How is the new train?",
            "exampleId": "Bagaimana kereta yang baru itu?"
          },
          {
            "exampleJp": "学校から駅まで自転車で行くのはどうですか。",
            "exampleKana": "がっこうからえきまでじてんしゃでいくのはどうですか。",
            "exampleEn": "How about going from the school to the station by bicycle?",
            "exampleId": "Bagaimana kalau pergi dari sekolah ke stasiun naik sepeda?"
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
            "exampleJp": "私はパンを食べます。そして、コーヒーを飲みます。",
            "exampleKana": "わたしはぱんをたべます。そして、こーひーをのみます。",
            "exampleEn": "I eat bread. And, I drink coffee.",
            "exampleId": "Saya makan roti. Lalu, saya minum kopi."
          },
          {
            "exampleJp": "この本は面白いです。そして、とても安いです。",
            "exampleKana": "このほんはおもしろいです。そして、とてもやすいです。",
            "exampleEn": "This book is interesting. And, it is very cheap.",
            "exampleId": "Buku ini menarik. Dan, harganya sangat murah."
          },
          {
            "exampleJp": "昨日、公園へ行きました。そして、友達に会いました。",
            "exampleKana": "きのう、こうえんへいきました。そして、ともだちにあいました。",
            "exampleEn": "I went to the park yesterday. And, I met a friend.",
            "exampleId": "Kemarin, saya pergi ke taman. Lalu, saya bertemu teman."
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
            "exampleJp": "パンは食べますが、コーヒーは飲みません。",
            "exampleKana": "ぱんはたべますが、こーひーはのみません。",
            "exampleEn": "I eat bread, but I do not drink coffee.",
            "exampleId": "Saya makan roti, tetapi saya tidak minum kopi."
          },
          {
            "exampleJp": "この本は面白いですが、少し難しいです。",
            "exampleKana": "このほんはおもしろいですが、すこしむずかしいです。",
            "exampleEn": "This book is interesting, but it is a little difficult.",
            "exampleId": "Buku ini menarik, tetapi sedikit sulit."
          },
          {
            "exampleJp": "昨日公園へ行きましたが、友達には会いませんでした。",
            "exampleKana": "きのうこうえんへいきましたが、ともだちにはあいませんでした。",
            "exampleEn": "I went to the park yesterday, but I did not meet my friend.",
            "exampleId": "Kemarin saya pergi ke taman, tetapi saya tidak bertemu teman."
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
            "exampleJp": "パンは美味しいですね。",
            "exampleKana": "ぱんはおいしいですね。",
            "exampleEn": "The bread is delicious, isn't it?",
            "exampleId": "Rotinya enak, ya."
          },
          {
            "exampleJp": "今日はとても暑いですね。",
            "exampleKana": "きょうはとてもあついですね。",
            "exampleEn": "It is very hot today, isn't it?",
            "exampleId": "Hari ini sangat panas, ya."
          },
          {
            "exampleJp": "昨日公園へ行きましたが、楽しかったですね。",
            "exampleKana": "きのうこうえんへいきましたが、たのしかったですね。",
            "exampleEn": "I went to the park yesterday, and it was fun, wasn't it?",
            "exampleId": "Kemarin saya pergi ke taman, dan itu menyenangkan, ya."
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
            "exampleJp": "昨日、日本語を勉強しました。",
            "exampleKana": "きのう、にほんごをべんきょうしました。",
            "exampleEn": "I studied Japanese yesterday.",
            "exampleId": "Kemarin, saya belajar bahasa Jepang."
          },
          {
            "exampleJp": "今朝、朝ご飯を食べませんでした。",
            "exampleKana": "けさ、あさごはんをたべませんでした。",
            "exampleEn": "I did not eat breakfast this morning.",
            "exampleId": "Tadi pagi, saya tidak makan sarapan."
          },
          {
            "exampleJp": "先週、友達と映画を見ました。",
            "exampleKana": "せんしゅう、ともだちとえいがをみました。",
            "exampleEn": "I watched a movie with a friend last week.",
            "exampleId": "Minggu lalu, saya menonton film bersama teman."
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
            "exampleJp": "そのテストは簡単じゃありませんでした。",
            "exampleKana": "そのテストはかんたんじゃありませんでした。",
            "exampleEn": "That test was not easy.",
            "exampleId": "Tes itu tidak mudah."
          },
          {
            "exampleJp": "先週の休みは楽しかったです。",
            "exampleKana": "せんしゅうのやすみはたのしかったです。",
            "exampleEn": "Last week's holiday was fun.",
            "exampleId": "Liburan minggu lalu menyenangkan."
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
            "exampleJp": "私は辛い食べ物が嫌いです。",
            "exampleKana": "わたしはからいたべものがきらいです。",
            "exampleEn": "I dislike spicy food.",
            "exampleId": "Saya tidak suka makanan pedas."
          },
          {
            "exampleJp": "昨日食べた料理が好きでした。",
            "exampleKana": "きのうたべたりょうりがすきでした。",
            "exampleEn": "I liked the food that I ate yesterday.",
            "exampleId": "Saya menyukai masakan yang saya makan kemarin."
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
            "exampleKana": "あたらしいカメラがほしいです。",
            "exampleEn": "I want a new camera.",
            "exampleId": "Saya ingin kamera baru."
          },
          {
            "exampleJp": "私は新しい車がほしいですが、高いです。",
            "exampleKana": "わたしはあたらしいくるまがほしいですが、たかいです。",
            "exampleEn": "I want a new car, but it is expensive.",
            "exampleId": "Saya ingin mobil baru, tapi harganya mahal."
          },
          {
            "exampleJp": "昨日、ほしい本を買いました。",
            "exampleKana": "きのう、ほしいほんをかいました。",
            "exampleEn": "I bought the book that I wanted yesterday.",
            "exampleId": "Kemarin, saya membeli buku yang saya inginkan."
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
            "exampleJp": "私は新しい本が読みたいです。",
            "exampleKana": "わたしはあたらしいほんがよみたいです。",
            "exampleEn": "I want to read a new book.",
            "exampleId": "Saya ingin membaca buku baru."
          },
          {
            "exampleJp": "冷たい水が飲みたいです。",
            "exampleKana": "つめたいみずがのみたいです。",
            "exampleEn": "I want to drink cold water.",
            "exampleId": "Saya ingin minum air dingin."
          },
          {
            "exampleJp": "今日は早く家に帰りたいです。",
            "exampleKana": "きょうははやくうちにかえりたいです。",
            "exampleEn": "I want to go home early today.",
            "exampleId": "Saya ingin pulang ke rumah lebih awal hari ini."
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
            "exampleId": "Saya pergi ke toserba untuk membeli pakaian."
          },
          {
            "exampleJp": "友達と映画を見に行きます。",
            "exampleKana": "ともだちとえいがをみにいきます。",
            "exampleEn": "I am going to see a movie with a friend.",
            "exampleId": "Saya pergi menonton film bersama teman."
          },
          {
            "exampleJp": "日本料理を食べに行きたいです。",
            "exampleKana": "にほんりょうりをたべにいきたいです。",
            "exampleEn": "I want to go to eat Japanese food.",
            "exampleId": "Saya ingin pergi makan masakan Jepang."
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
            "exampleJp": "どこかへ涼しい所に行きたいです。",
            "exampleKana": "どこかへすずしいところにいきたいです。",
            "exampleEn": "I want to go somewhere cool.",
            "exampleId": "Saya ingin pergi ke suatu tempat yang sejuk."
          },
          {
            "exampleJp": "休みの日、どこかへ遊びに行きませんか。",
            "exampleKana": "やすみのひ、どこかへあそびにいきませんか。",
            "exampleEn": "Shall we go somewhere to hang out on our day off?",
            "exampleId": "Bagaimana kalau kita pergi bermain ke suatu tempat di hari libur?"
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
            "exampleJp": "どうして学校へ行きますか。",
            "exampleKana": "どうしてがっこうへいきますか。",
            "exampleEn": "Why are you going to school?",
            "exampleId": "Mengapa kamu pergi ke sekolah?"
          },
          {
            "exampleJp": "どうして日本料理を食べに行きたいですか。",
            "exampleKana": "どうしてにほんりょうりをたべにいきたいですか。",
            "exampleEn": "Why do you want to go to eat Japanese food?",
            "exampleId": "Mengapa kamu ingin pergi makan masakan Jepang?"
          },
          {
            "exampleJp": "どうして週末にどこかへ行きたいですか。",
            "exampleKana": "どうしてしゅうまつにどこかへいきたいですか。",
            "exampleEn": "Why do you want to go somewhere on the weekend?",
            "exampleId": "Mengapa kamu ingin pergi ke suatu tempat di akhir pekan?"
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
            "exampleJp": "朝ごはんを食べます。それから、学校へ行きます。",
            "exampleKana": "あさごはんをたべます。それから、がっこうへいきます。",
            "exampleEn": "I eat breakfast. After that, I go to school.",
            "exampleId": "Saya makan sarapan. Setelah itu, saya pergi ke sekolah."
          },
          {
            "exampleJp": "宿題をします。それから、テレビを見ます。",
            "exampleKana": "しゅくだいをします。それから、テレビをみます。",
            "exampleEn": "I do my homework. Then, I watch TV.",
            "exampleId": "Saya mengerjakan PR. Setelah itu, saya menonton TV."
          },
          {
            "exampleJp": "本を読みました。それから、公園へ行きました。",
            "exampleKana": "ほんをよみました。それから、こうえんへいきました。",
            "exampleEn": "I read a book. Then, I went to the park.",
            "exampleId": "Saya membaca buku. Setelah itu, saya pergi ke taman."
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
            "exampleJp": "友達と映画を見ます。",
            "exampleKana": "ともだちとえいがをみます。",
            "exampleEn": "I watch a movie with my friend.",
            "exampleId": "Saya menonton film bersama teman."
          },
          {
            "exampleJp": "友達と映画を見ます。それから、買い物をします。",
            "exampleKana": "ともだちとえいがをみます。それから、かいものをします。",
            "exampleEn": "I watch a movie with my friend. After that, I go shopping.",
            "exampleId": "Saya menonton film bersama teman. Setelah itu, saya pergi berbelanja."
          },
          {
            "exampleJp": "家族と日本へ行きました。それから、友達と観光しました。",
            "exampleKana": "かぞくとにほんへいきました。それから、ともだちとかんこうしました。",
            "exampleEn": "I went to Japan with my family. Then, I went sightseeing with my friend.",
            "exampleId": "Saya pergi ke Jepang bersama keluarga. Setelah itu, saya berwisata bersama teman."
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
            "exampleJp": "時間がありませんから、タクシーで行きます。",
            "exampleKana": "じかんがありませんから、タクシーでいきます。",
            "exampleEn": "Because I don't have time, I will go by taxi.",
            "exampleId": "Karena tidak ada waktu, saya pergi naik taksi."
          },
          {
            "exampleJp": "友達と遊びますから、宿題を早くします。",
            "exampleKana": "ともだちとあそびますから、しゅくだいちはやくします。",
            "exampleEn": "Because I will hang out with my friend, I will do my homework early.",
            "exampleId": "Karena saya akan bermain dengan teman, saya mengerjakan PR dengan cepat."
          },
          {
            "exampleJp": "疲れていますから、それから家で休みます。",
            "exampleKana": "つかれていますから、それからうちでやすみます。",
            "exampleEn": "Because I am tired, I will rest at home after that.",
            "exampleId": "Karena saya lelah, setelah itu saya akan beristirahat di rumah."
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
            "exampleJp": "一緒に昼ごはんを食べませんか。",
            "exampleKana": "いっしょにひるごはんをたべませんか。",
            "exampleEn": "Won't you eat lunch with me?",
            "exampleId": "Maukah Anda makan siang bersama saya?"
          },
          {
            "exampleJp": "明日、映画を見に行きませんか。",
            "exampleKana": "あした、えいがをみにいきませんか。",
            "exampleEn": "Won't you go to watch a movie tomorrow?",
            "exampleId": "Maukah Anda pergi menonton film besok?"
          },
          {
            "exampleJp": "新しいレストランへ行きませんか。",
            "exampleKana": "あたらしいレストランへいきませんか。",
            "exampleEn": "Won't you go to the new restaurant?",
            "exampleId": "Maukah Anda pergi ke restoran baru itu?"
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
            "exampleJp": "ここで少し休みましょう。",
            "exampleKana": "ここですこしやすみましょう。",
            "exampleEn": "Let's take a break here.",
            "exampleId": "Mari kita istirahat sebentar di sini."
          },
          {
            "exampleJp": "一緒に美味しい料理を食べましょう。",
            "exampleKana": "いっしょにおいしいりょうりをたべましょう。",
            "exampleEn": "Let's eat delicious food together.",
            "exampleId": "Mari kita makan masakan enak bersama-sama."
          },
          {
            "exampleJp": "明日、映画を見に行きましょう。",
            "exampleKana": "あした、えいがをみにいきましょう。",
            "exampleEn": "Let's go to watch a movie tomorrow.",
            "exampleId": "Mari kita pergi menonton film besok."
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
            "exampleJp": "明日、試験があります。",
            "exampleKana": "あした、しけんがあります。",
            "exampleEn": "There is an exam tomorrow.",
            "exampleId": "Besok ada ujian."
          },
          {
            "exampleJp": "来週、日本のお祭りがあります。",
            "exampleKana": "らいしゅう、にほんのおまつりがあります。",
            "exampleEn": "There is a Japanese festival next week.",
            "exampleId": "Minggu depan ada festival Jepang."
          },
          {
            "exampleJp": "今日、楽しいパーティーがあります。",
            "exampleKana": "きょう、たのしいパーティーがあります。",
            "exampleEn": "There is a fun party today.",
            "exampleId": "Hari ini ada pesta yang menyenangkan."
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
            "exampleJp": "公園で日本のお祭りがあります。",
            "exampleKana": "こうえんでにほんのおまつりがあります。",
            "exampleEn": "There is a Japanese festival at the park.",
            "exampleId": "Ada festival Jepang di taman."
          },
          {
            "exampleJp": "学校で試験があります。",
            "exampleKana": "がっこうでしけんがあります。",
            "exampleEn": "There is an exam at the school.",
            "exampleId": "Ada ujian di sekolah."
          },
          {
            "exampleJp": "新しいレストランでパーティーがあります。",
            "exampleKana": "あたらしいレストランでパーティーがあります。",
            "exampleEn": "There is a party at the new restaurant.",
            "exampleId": "Ada pesta di restoran baru itu."
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
            "exampleId": "Ada tiga buah buku di atas meja."
          },
          {
            "exampleJp": "冷蔵庫の中に卵が二つあります。",
            "exampleKana": "れいぞうこのなかにたまごがふたつあります。",
            "exampleEn": "There are two eggs in the refrigerator.",
            "exampleId": "Ada dua butir telur di dalam kulkas."
          },
          {
            "exampleJp": "教室に学生が五人あります。",
            "exampleKana": "きょうしつにがくせいがごにんあります。",
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
            "exampleJp": "クラスで田中さんがいちばん背が高いです。",
            "exampleKana": "クラスでたなかさんがいちばんせがたかいです。",
            "exampleEn": "Tanaka-san is the tallest in the class.",
            "exampleId": "Tanaka-san adalah yang paling tinggi di kelas."
          },
          {
            "exampleJp": "果物の中でりんごがいちばん好きです。",
            "exampleKana": "くだもののなかでりんごがいちばんすきです。",
            "exampleEn": "Among fruits, I like apples the most.",
            "exampleId": "Di antara buah-buahan, saya paling suka apel."
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
            "exampleJp": "りんごはバナナより大きいです。",
            "exampleKana": "りんごはバナナよりおおきいです。",
            "exampleEn": "Apples are bigger than bananas.",
            "exampleId": "Apel lebih besar daripada pisang."
          },
          {
            "exampleJp": "昨日は今日より寒かったです。",
            "exampleKana": "きのうはきょうよりさむかったです。",
            "exampleEn": "Yesterday was colder than today.",
            "exampleId": "Kemarin lebih dingin daripada hari ini."
          },
          {
            "exampleJp": "新幹線は電車より速いです。",
            "exampleKana": "しんかんせんはでんしゃよりはやいです。",
            "exampleEn": "The Shinkansen is faster than the train.",
            "exampleId": "Shinkansen lebih cepat daripada kereta biasa."
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
            "exampleJp": "コーヒーと紅茶とどちらが好きですか。コーヒーのほうが好きです。",
            "exampleKana": "コーヒーとこうちゃとどちらがすきですか。コーヒーのほうがすきです。",
            "exampleEn": "Which do you like better, coffee or tea? I prefer coffee.",
            "exampleId": "Antara kopi dan teh, lebih suka yang mana? Saya lebih suka kopi."
          },
          {
            "exampleJp": "日本とタイとどちらが暑いですか。タイのほうが暑いです。",
            "exampleKana": "にほんとタイとどちらがあついですか。タイのほうがあついです。",
            "exampleEn": "Which is hotter, Japan or Thailand? Thailand is hotter.",
            "exampleId": "Antara Jepang dan Thailand, mana yang lebih panas? Thailand lebih panas."
          },
          {
            "exampleJp": "夏と冬とどちらが好きですか。冬のほうが好きです。",
            "exampleKana": "なつとふゆとどちらがすきですか。ふゆのほうがすきです。",
            "exampleEn": "Which do you like better, summer or winter? I prefer winter.",
            "exampleId": "Antara musim panas dan musim dingin, lebih suka yang mana? Saya lebih suka musim dingin."
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
            "exampleJp": "もう宿題をしましたか。",
            "exampleKana": "もうしゅくだいをしましたか。",
            "exampleEn": "Have you already done your homework?",
            "exampleId": "Apakah kamu sudah mengerjakan PR?"
          },
          {
            "exampleJp": "もう昼ごはんを食べましたか。",
            "exampleKana": "もうひるごはんをたべましたか。",
            "exampleEn": "Have you already eaten lunch?",
            "exampleId": "Apakah kamu sudah makan siang?"
          },
          {
            "exampleJp": "もうチケットを買いましたか。",
            "exampleKana": "もうちけっとをかいましたか。",
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
            "exampleJp": "もう宿題をしましたよ。",
            "exampleKana": "もうしゅくだいをしましたよ。",
            "exampleEn": "I have already done my homework, you know.",
            "exampleId": "Aku sudah mengerjakan PR, lho."
          },
          {
            "exampleJp": "もう昼ごはんを食べましたよ。",
            "exampleKana": "もうひるごはんをたべましたよ。",
            "exampleEn": "I have already eaten lunch, so don't worry.",
            "exampleId": "Aku sudah makan siang, kok."
          },
          {
            "exampleJp": "もうチケットを買いましたよ。明日行きましょう。",
            "exampleKana": "もうちけっとをかいましたよ。あしたゆきましょう。",
            "exampleEn": "I have already bought the ticket. Let's go tomorrow!",
            "exampleId": "Aku sudah beli tiketnya, lho. Ayo kita pergi besok!"
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
            "exampleJp": "本は机の上にあります。",
            "exampleKana": "ほんはつくえのうえにあります。",
            "exampleEn": "The book is on the desk.",
            "exampleId": "Buku ada di atas meja."
          },
          {
            "exampleJp": "猫は庭にいます。",
            "exampleKana": "ねこはにわにいます。",
            "exampleEn": "The cat is in the garden.",
            "exampleId": "Kucing ada di halaman."
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
            "exampleJp": "教室に田中さんがいます。",
            "exampleKana": "きょうしつにたなかさんがいます。",
            "exampleEn": "There is Tanaka-san in the classroom.",
            "exampleId": "Di dalam kelas ada Tanaka-san."
          },
          {
            "exampleJp": "机の上に本があります。",
            "exampleKana": "つくえのうえにほんがあります。",
            "exampleEn": "There is a book on the desk.",
            "exampleId": "Di atas meja ada buku."
          },
          {
            "exampleJp": "庭に猫がいます。",
            "exampleKana": "にわにねこがいます。",
            "exampleEn": "There is a cat in the garden.",
            "exampleId": "Di halaman ada kucing."
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
            "exampleJp": "教室に田中さんがいます。呼んでください。",
            "exampleKana": "きょうしつにたなかさんがいます。よんでください。",
            "exampleEn": "Tanaka-san is in the classroom. Please call him.",
            "exampleId": "Tanaka-san ada di kelas. Tolong panggil dia."
          },
          {
            "exampleJp": "机の上に本があります。取ってください。",
            "exampleKana": "つくえのうえにほんがあります。とってください。",
            "exampleEn": "There is a book on the desk. Please take it.",
            "exampleId": "Ada buku di atas meja. Tolong ambilkan."
          },
          {
            "exampleJp": "庭に猫がいます。見てください。",
            "exampleKana": "にわにねこがいます。みてください。",
            "exampleEn": "There is a cat in the garden. Please look.",
            "exampleId": "Ada kucing di halaman. Tolong lihat."
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
            "exampleJp": "田中さんは教室で本を読んでいます。",
            "exampleKana": "たなかさんはきょうしつでほんをよんでいます。",
            "exampleEn": "Tanaka-san is reading a book in the classroom.",
            "exampleId": "Tanaka-san sedang membaca buku di dalam kelas."
          },
          {
            "exampleJp": "猫が庭で寝ています。",
            "exampleKana": "ねこがにわでねています。",
            "exampleEn": "The cat is sleeping in the garden.",
            "exampleId": "Kucing sedang tidur di halaman."
          },
          {
            "exampleJp": "机の上に本が置いてあります。",
            "exampleKana": "つくえのうえにほんがおいてあります。",
            "exampleEn": "A book is placed on the desk.",
            "exampleId": "Ada buku yang diletakkan di atas meja."
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
            "exampleJp": "窓を開けましょうか。",
            "exampleKana": "まどをあけましょうか。",
            "exampleEn": "Shall I open the window?",
            "exampleId": "Bagaimana kalau saya buka jendelanya?"
          },
          {
            "exampleJp": "荷物を持ちましょうか。",
            "exampleKana": "にもつをもちましょうか。",
            "exampleEn": "Shall I carry your luggage?",
            "exampleId": "Bagaimana kalau saya bawakan barangnya?"
          },
          {
            "exampleJp": "手伝いましょうか。",
            "exampleKana": "てつだいましょうか。",
            "exampleEn": "Shall I help you?",
            "exampleId": "Bagaimana kalau saya bantu?"
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
            "exampleJp": "漢字の書き方を教えてください。",
            "exampleKana": "かんじのかきかたをおしえてください。",
            "exampleEn": "Please teach me how to write Kanji.",
            "exampleId": "Tolong ajari saya cara menulis Kanji."
          },
          {
            "exampleJp": "この薬の飲み方を説明しましょうか。",
            "exampleKana": "このくすりののみかたをせつめいしましょうか。",
            "exampleEn": "Shall I explain how to take this medicine?",
            "exampleId": "Bagaimana kalau saya jelaskan cara meminum obat ini?"
          },
          {
            "exampleJp": "おいしいコーヒーの作り方を教えてください。",
            "exampleKana": "おいしいコーヒーのつくりかたをおしえてください。",
            "exampleEn": "Please teach me how to make delicious coffee.",
            "exampleId": "Tolong ajari saya cara membuat kopi yang enak."
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
            "exampleJp": "宿題はもう終わりましたか。",
            "exampleKana": "しゅくだいはもうおわりましたか。",
            "exampleEn": "Have you finished your homework yet?",
            "exampleId": "Apakah PR-nya sudah selesai?"
          },
          {
            "exampleJp": "いいえ、まだ終わっていません。",
            "exampleKana": "いいえ、まだおわっていません。",
            "exampleEn": "No, I haven't finished yet.",
            "exampleId": "Belum, saya belum menyelesaikannya."
          },
          {
            "exampleJp": "もうお昼ご飯を食べましたか。いいえ、まだです。",
            "exampleKana": "もうおひるごはんをたべましたか。いいえ、まだです。",
            "exampleEn": "Have you already eaten lunch? No, not yet.",
            "exampleId": "Apakah sudah makan siang? Belum."
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
            "exampleJp": "誰が窓を開けましたか。",
            "exampleKana": "だれがまどをあけましたか。",
            "exampleEn": "Who opened the window?",
            "exampleId": "Siapa yang membuka jendela?"
          },
          {
            "exampleJp": "誰がこの漢字の書き方を知っていますか。",
            "exampleKana": "だれがこのかんじのかきかたをしっていますか。",
            "exampleEn": "Who knows how to write this Kanji?",
            "exampleId": "Siapa yang tahu cara menulis Kanji ini?"
          },
          {
            "exampleJp": "誰がもう宿題を終わらせましたか。",
            "exampleKana": "だれがもうしゅくだいをおわらせましたか。",
            "exampleEn": "Who has already finished the homework?",
            "exampleId": "Siapa yang sudah menyelesaikan PR?"
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
            "exampleJp": "どの傘があなたの傘ですか。",
            "exampleKana": "どの かさが あなたの かさですか。",
            "exampleEn": "Which umbrella is yours?",
            "exampleId": "Payung yang mana milik Anda?"
          },
          {
            "exampleJp": "この中でどれが一番おいしいですか。",
            "exampleKana": "この なかで どれが いちばん おいしいですか。",
            "exampleEn": "Which one among these is the most delicious?",
            "exampleId": "Di antara ini, yang mana yang paling enak?"
          },
          {
            "exampleJp": "どのペンを使いますか。どれでもいいです。",
            "exampleKana": "どの ぺんを つかいますか。どれでも いいです。",
            "exampleEn": "Which pen will you use? Any one is fine.",
            "exampleId": "Pena yang mana yang akan Anda gunakan? Yang mana saja boleh."
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
            "exampleKana": "はしで ごはんを たべます。",
            "exampleEn": "I eat rice with chopsticks.",
            "exampleId": "Saya makan nasi dengan sumpit."
          },
          {
            "exampleJp": "どの箸で食べますか。この箸で食べます。",
            "exampleKana": "どの はしで たべますか。この はしで たべます。",
            "exampleEn": "Which chopsticks will you use to eat? I will eat with these chopsticks.",
            "exampleId": "Anda akan makan dengan sumpit yang mana? Saya akan makan dengan sumpit ini."
          },
          {
            "exampleJp": "どれで切りますか。このナイフで切ります。",
            "exampleKana": "どれで きりますか。この ないふで きります。",
            "exampleEn": "Which one will you use to cut? I will cut with this knife.",
            "exampleId": "Anda akan memotong dengan yang mana? Saya akan memotong dengan pisau ini."
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
            "exampleJp": "私は日本語を教えています。",
            "exampleKana": "わたしはにほんごをおしえています。",
            "exampleEn": "I teach Japanese.",
            "exampleId": "Saya mengajar bahasa Jepang."
          },
          {
            "exampleJp": "父は銀行で働いています。",
            "exampleKana": "ちちはぎんこうではたらいています。",
            "exampleEn": "My father works at a bank.",
            "exampleId": "Ayah saya bekerja di bank."
          },
          {
            "exampleJp": "兄は毎日ジムで運動しています。",
            "exampleKana": "あにはまいにちじむでうんどうしています。",
            "exampleEn": "My older brother exercises at the gym every day.",
            "exampleId": "Kakak laki-laki saya berolahraga di gym setiap hari."
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
            "exampleEn": "The elephant has a long nose.",
            "exampleId": "Gajah hidungnya panjang."
          },
          {
            "exampleJp": "あの人は目が大きいです。",
            "exampleKana": "あのひとはめがおおきいです。",
            "exampleEn": "That person has big eyes.",
            "exampleId": "Orang itu matanya besar."
          },
          {
            "exampleJp": "私の先生は日本語が上手です。",
            "exampleKana": "わたしのせんせいはにほんごがじょうずです。",
            "exampleEn": "My teacher is good at Japanese.",
            "exampleId": "Guru saya mahir bahasa Jepang."
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
            "exampleJp": "この料理は安くて、美味しいです。",
            "exampleKana": "このりょうりはやすくて、おいしいです。",
            "exampleEn": "This food is cheap and delicious.",
            "exampleId": "Makanan ini murah dan enak."
          },
          {
            "exampleJp": "あの先生は親切で、日本語が上手です。",
            "exampleKana": "あのせんせいはしんせつで、にほんごがじょうずです。",
            "exampleEn": "That teacher is kind and good at Japanese.",
            "exampleId": "Guru itu baik hati dan mahir bahasa Jepang."
          },
          {
            "exampleJp": "私の家は広くて、静かです。",
            "exampleKana": "わたしのいえはひろくて、しずかです。",
            "exampleEn": "My house is spacious and quiet.",
            "exampleId": "Rumah saya luas dan tenang."
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
            "exampleJp": "私は先生に美味しいお菓子をもらいました。",
            "exampleKana": "わたしはせんせいにおいしいおかしをもらいました。",
            "exampleEn": "I received delicious snacks from my teacher.",
            "exampleId": "Saya menerima camilan enak dari guru."
          },
          {
            "exampleJp": "母は私に新しい服をくれました。",
            "exampleKana": "はははわたしにあたらしいふくをくれました。",
            "exampleEn": "My mother gave me new clothes.",
            "exampleId": "Ibu memberikan baju baru untuk saya."
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
            "exampleKana": "うちに かぞくが よにん います。",
            "exampleEn": "There are four family members at home.",
            "exampleId": "Ada empat orang anggota keluarga di rumah."
          },
          {
            "exampleJp": "公園に友達が二人います。",
            "exampleKana": "こうえんに ともだちが ふたり います。",
            "exampleEn": "There are two friends at the park.",
            "exampleId": "Ada dua orang teman di taman."
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
            "exampleJp": "三人で教室を掃除します。",
            "exampleKana": "さんにんで きょうしつを そうじします。",
            "exampleEn": "The three of us will clean the classroom.",
            "exampleId": "Kami bertiga akan membersihkan kelas."
          },
          {
            "exampleJp": "四人で一緒に晩ご飯を食べます。",
            "exampleKana": "よにんで いっしょに ばんごはんを たべます。",
            "exampleEn": "The four of us will eat dinner together.",
            "exampleId": "Kami berempat akan makan malam bersama."
          },
          {
            "exampleJp": "二人で公園へ散歩に行きます。",
            "exampleKana": "ふたりで こうえんへ さんぽに いきます。",
            "exampleEn": "The two of us will go for a walk to the park.",
            "exampleId": "Kami berdua akan pergi berjalan-jalan ke taman."
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
            "exampleJp": "寝ることは大切です。",
            "exampleKana": "ねることはたいせつです。",
            "exampleEn": "Sleeping is important.",
            "exampleId": "Tidur itu penting."
          },
          {
            "exampleJp": "日本語を勉強することは楽しいです。",
            "exampleKana": "にほんごをべんきょうすることはたのしいです。",
            "exampleEn": "Studying Japanese is fun.",
            "exampleId": "Belajar bahasa Jepang itu menyenangkan."
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
            "exampleEn": "I can write kanji.",
            "exampleId": "Saya bisa menulis kanji."
          },
          {
            "exampleJp": "泳ぐことができますか。",
            "exampleKana": "およぐことができますか。",
            "exampleEn": "Can you swim?",
            "exampleId": "Apakah Anda bisa berenang?"
          },
          {
            "exampleJp": "毎日、日本語を勉強することができます。",
            "exampleKana": "まいにち、にほんごをべんきょうすることができます。",
            "exampleEn": "I can study Japanese every day.",
            "exampleId": "Saya bisa belajar bahasa Jepang setiap hari."
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
            "exampleJp": "風邪をひいて、学校を休みます。",
            "exampleKana": "かぜをひいて、がっこうをやすみます。",
            "exampleEn": "I caught a cold, so I will take a day off from school.",
            "exampleId": "Saya masuk angin, jadi saya libur sekolah."
          },
          {
            "exampleJp": "お腹がすいて、何も食べることができません。",
            "exampleKana": "おなかがすいて、なにもたべることができません。",
            "exampleEn": "I am hungry, so I cannot eat anything (yet).",
            "exampleId": "Saya lapar, jadi saya tidak bisa makan apa-apa."
          },
          {
            "exampleJp": "本を読んで、新しいことを知ることができました。",
            "exampleKana": "ほんをよんで、あたらしいことをしることができました。",
            "exampleEn": "I read a book, and (because of that) I was able to learn new things.",
            "exampleId": "Saya membaca buku, dan (karenanya) saya bisa mengetahui hal baru."
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
            "exampleJp": "一週間に二回、運動します。",
            "exampleKana": "いっしゅうかんににかい、うんどうします。",
            "exampleEn": "I exercise twice a week.",
            "exampleId": "Saya berolahraga dua kali seminggu."
          },
          {
            "exampleJp": "一ヶ月に三回、映画を見ることができます。",
            "exampleKana": "いっかげつにさんかい、えいがをみることができます。",
            "exampleEn": "I can watch movies three times a month.",
            "exampleId": "Saya bisa menonton film tiga kali sebulan."
          },
          {
            "exampleJp": "疲れて、一日に一回も日本語を勉強することができませんでした。",
            "exampleKana": "つかれて、いちにちにいっかいもにほんごをべんきょうすることができませんでした。",
            "exampleEn": "I was tired, so I couldn't even study Japanese once today.",
            "exampleId": "Saya lelah, jadi hari ini saya tidak bisa belajar bahasa Jepang sekalipun."
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
            "exampleJp": "私はいつも朝ごはんを食べます。",
            "exampleKana": "わたしはいつもあさごはんをたべます。",
            "exampleEn": "I always eat breakfast.",
            "exampleId": "Saya selalu makan sarapan."
          },
          {
            "exampleJp": "ときどき図書館で本を読みます。",
            "exampleKana": "ときどきとしょかんではんをよみます。",
            "exampleEn": "I sometimes read books at the library.",
            "exampleId": "Saya terkadang membaca buku di perpustakaan."
          },
          {
            "exampleJp": "私はあまり肉を食べません。全然食べません。",
            "exampleKana": "わたしはあまりにくをたべません。ぜんぜんたべません。",
            "exampleEn": "I don't eat meat much. I don't eat it at all.",
            "exampleId": "Saya tidak terlalu banyak makan daging. Saya sama sekali tidak memakannya."
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
            "exampleJp": "どうやって学校へ行きますか。",
            "exampleKana": "どうやってがっこうへいきますか。",
            "exampleEn": "How do you go to school?",
            "exampleId": "Bagaimana cara Anda pergi ke sekolah?"
          },
          {
            "exampleJp": "どうやって日本語を勉強しますか。",
            "exampleKana": "どうやってにほんごをべんきょうしますか。",
            "exampleEn": "How do you study Japanese?",
            "exampleId": "Bagaimana cara Anda belajar bahasa Jepang?"
          },
          {
            "exampleJp": "どうやってこの漢字を書きますか。",
            "exampleKana": "どうやってこのかんじをかきますか。",
            "exampleEn": "How do you write this kanji?",
            "exampleId": "Bagaimana cara menulis kanji ini?"
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
            "exampleJp": "私はいつも勉強します。でも、あまり上手になりません。",
            "exampleKana": "わたしはいつもべんきょうします。でも、あまりじょうずになりません。",
            "exampleEn": "I always study. But, I don't get very good.",
            "exampleId": "Saya selalu belajar. Tapi, saya tidak terlalu mahir."
          },
          {
            "exampleJp": "ときどき日本へ行きたいです。でも、お金がありません。",
            "exampleKana": "ときどきにほんへいきたいです。でも、おかねがありません。",
            "exampleEn": "I sometimes want to go to Japan. But, I have no money.",
            "exampleId": "Terkadang saya ingin pergi ke Jepang. Tapi, saya tidak punya uang."
          },
          {
            "exampleJp": "これはどうやって作りますか。でも、とても難しそうです。",
            "exampleKana": "これはどうやってつくりますか。でも、とてもむずかしそうです。",
            "exampleEn": "How do you make this? But, it looks very difficult.",
            "exampleId": "Bagaimana cara membuat ini? Tapi, kelihatannya sangat sulit."
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
            "exampleJp": "ここで たばこを 吸わないで ください。",
            "exampleKana": "ここで たばこを すわないで ください。",
            "exampleEn": "Please do not smoke here.",
            "exampleId": "Tolong jangan merokok di sini."
          },
          {
            "exampleJp": "この 本に 書かないで ください。",
            "exampleKana": "この ほんに かかないで ください。",
            "exampleEn": "Please do not write in this book.",
            "exampleId": "Tolong jangan menulis di buku ini."
          },
          {
            "exampleJp": "教室で 大きい声で 話さないで ください。",
            "exampleKana": "きょうしつで おおきいこえで はなさないで ください。",
            "exampleEn": "Please do not talk in a loud voice in the classroom.",
            "exampleId": "Tolong jangan berbicara dengan suara keras di dalam kelas."
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
            "exampleJp": "ここで 写真を 撮っても いいですか。",
            "exampleKana": "ここで しゃしんを とっても いいですか。",
            "exampleEn": "May I take a photo here?",
            "exampleId": "Bolehkah saya mengambil foto di sini?"
          },
          {
            "exampleJp": "窓を 開けても いいですか。",
            "exampleKana": "まどを あけても いいですか。",
            "exampleEn": "May I open the window?",
            "exampleId": "Bolehkah saya membuka jendela?"
          },
          {
            "exampleJp": "すみません、ここで たばこを 吸っても いいですか。",
            "exampleKana": "すみません、ここで たばこを すっても いいですか。",
            "exampleEn": "Excuse me, may I smoke here?",
            "exampleId": "Permisi, bolehkah saya merokok di sini?"
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
            "exampleJp": "窓が 開けて あります。",
            "exampleKana": "まどが あけて あります。",
            "exampleEn": "The window is left open.",
            "exampleId": "Jendelanya sedang dalam keadaan terbuka."
          },
          {
            "exampleJp": "壁に 絵が かかって います。",
            "exampleKana": "かべに えが かかって います。",
            "exampleEn": "A picture is hanging on the wall.",
            "exampleId": "Ada gambar yang tergantung di dinding."
          },
          {
            "exampleJp": "机の上に 本が 置いて あります。",
            "exampleKana": "つくえのうえに ほんが おいて あります。",
            "exampleEn": "A book is placed on the desk.",
            "exampleId": "Ada buku yang diletakkan di atas meja."
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
            "exampleJp": "ちょっと コンビニへ 行って 来ます。",
            "exampleKana": "ちょっと コンビニへ いって きます。",
            "exampleEn": "I'll go to the convenience store and come back.",
            "exampleId": "Saya pergi ke minimarket sebentar lalu kembali."
          },
          {
            "exampleJp": "郵便局へ 手紙を 出して 来ます。",
            "exampleKana": "ゆうびんきょくへ てがみを だして きます。",
            "exampleEn": "I'll go to the post office to send a letter and come back.",
            "exampleId": "Saya pergi ke kantor pos untuk mengirim surat lalu kembali."
          },
          {
            "exampleJp": "冷たい お茶を 買って 来ます。",
            "exampleKana": "つめたい おちゃを かって きます。",
            "exampleEn": "I'll go buy some cold tea and come back.",
            "exampleId": "Saya pergi membeli teh dingin lalu kembali."
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
            "exampleJp": "窓から山が見えます。",
            "exampleKana": "まどからやまがみえます。",
            "exampleEn": "I can see the mountain from the window.",
            "exampleId": "Dari jendela, gunung terlihat."
          },
          {
            "exampleJp": "静かな部屋で鳥の声が聞こえます。",
            "exampleKana": "しずかなへやでとりのこえがきこえます。",
            "exampleEn": "I can hear the sound of birds in the quiet room.",
            "exampleId": "Di kamar yang tenang, suara burung terdengar."
          },
          {
            "exampleJp": "あそこから海が見えますか。",
            "exampleKana": "あそこからうみがみえますか。",
            "exampleEn": "Can you see the sea from over there?",
            "exampleId": "Apakah laut terlihat dari sana?"
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
            "exampleJp": "天気が寒くなります。",
            "exampleKana": "てんきがさむくなります。",
            "exampleEn": "The weather is getting cold.",
            "exampleId": "Cuacanya menjadi dingin."
          },
          {
            "exampleJp": "来年、二十歳になります。",
            "exampleKana": "らいねん、はたちになります。",
            "exampleEn": "I will turn twenty years old next year.",
            "exampleId": "Tahun depan, saya akan menjadi dua puluh tahun."
          },
          {
            "exampleJp": "窓から見える景色がきれいになります。",
            "exampleKana": "まどからみえるけしきがきれいになります。",
            "exampleEn": "The scenery visible from the window is becoming beautiful.",
            "exampleId": "Pemandangan yang terlihat dari jendela menjadi indah."
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
            "exampleEn": "I walk in the park.",
            "exampleId": "Saya berjalan-jalan di taman."
          },
          {
            "exampleJp": "橋を渡ります。",
            "exampleKana": "はしをわたります。",
            "exampleEn": "I cross the bridge.",
            "exampleId": "Saya menyeberangi jembatan."
          },
          {
            "exampleJp": "静かになった道を歩きます。",
            "exampleKana": "しずかになったみちをあるきます。",
            "exampleEn": "I walk along the road that has become quiet.",
            "exampleId": "Saya berjalan menyusuri jalan yang sudah menjadi tenang."
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
            "exampleJp": "肉は食べますが、魚は食べません。",
            "exampleKana": "にくはたべますが、さかなはたべません。",
            "exampleEn": "I eat meat, but I don't eat fish.",
            "exampleId": "Saya makan daging, tetapi ikan tidak saya makan."
          },
          {
            "exampleJp": "今日は忙しいですが、明日は暇になります。",
            "exampleKana": "きょうはいそがしいですが、あしたはひまになります。",
            "exampleEn": "I am busy today, but I will be free tomorrow.",
            "exampleId": "Hari ini saya sibuk, tetapi besok saya akan senggang."
          },
          {
            "exampleJp": "公園は歩きますが、道は歩きません。",
            "exampleKana": "こうえんはあるきますが、みちはあるきません。",
            "exampleEn": "I walk in the park, but I don't walk on the road.",
            "exampleId": "Saya berjalan di taman, tetapi di jalan saya tidak berjalan."
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
            "exampleJp": "日曜日は本を読んだり、音楽を聞いたりします。",
            "exampleKana": "にちようびはほんをよんだり、おんがくをきいたりします。",
            "exampleEn": "On Sundays, I do things like reading books and listening to music.",
            "exampleId": "Pada hari Minggu, saya melakukan hal-hal seperti membaca buku dan mendengarkan musik."
          },
          {
            "exampleJp": "休みの日には、買い物に行ったり、友達と会ったりします。",
            "exampleKana": "やすみのひには、かいものにいったり、ともだちとあったりします。",
            "exampleEn": "On my day off, I do things like going shopping and meeting friends.",
            "exampleId": "Pada hari libur, saya melakukan hal-hal seperti pergi belanja dan bertemu teman."
          },
          {
            "exampleJp": "昨日は掃除をしたり、料理を作ったりして忙しかったです。",
            "exampleKana": "きのうはそうじをしたり、りょうりをつくったりしていそがしかったです。",
            "exampleEn": "Yesterday, I was busy doing things like cleaning and cooking.",
            "exampleId": "Kemarin saya sibuk melakukan hal-hal seperti membersihkan rumah dan memasak."
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
            "exampleJp": "兄は背が高いですが、弟は背が低いです。",
            "exampleKana": "あにはせがたかいですが、おとうとはせがひくいです。",
            "exampleEn": "My older brother is tall, but my younger brother is short.",
            "exampleId": "Kakak laki-laki saya tinggi, tetapi adik laki-laki saya pendek."
          },
          {
            "exampleJp": "日本料理は好きですが、辛い料理はあまり好きではありません。",
            "exampleKana": "にほんりょうりはすきですが、からいりょうりはあまりすきではありません。",
            "exampleEn": "I like Japanese food, but I don't really like spicy food.",
            "exampleId": "Saya suka masakan Jepang, tetapi saya tidak begitu suka masakan pedas."
          },
          {
            "exampleJp": "昨日は本を読んだりしましたが、今日は映画を見たりします。",
            "exampleKana": "きのうはほんをよんだりしましたが、きょうはえいがをみたりします。",
            "exampleEn": "Yesterday I did things like reading, but today I will do things like watching movies.",
            "exampleId": "Kemarin saya melakukan hal seperti membaca buku, tetapi hari ini saya akan melakukan hal seperti menonton film."
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
            "exampleJp": "暇なとき、本を読みます。",
            "exampleKana": "ひまなとき、ほんをよみます。",
            "exampleEn": "When I am free, I read books.",
            "exampleId": "Saat saya senggang, saya membaca buku."
          },
          {
            "exampleJp": "学生のとき、よく友達と遊びました。",
            "exampleKana": "がくせいのとき、よくともだちとあそびました。",
            "exampleEn": "When I was a student, I often hung out with friends.",
            "exampleId": "Saat saya masih pelajar, saya sering bermain dengan teman-teman."
          },
          {
            "exampleJp": "疲れたとき、温かいお茶を飲んだり、音楽を聞いたりします。",
            "exampleKana": "つかれたとき、あたたかいおちゃをのんだり、おんがくをきいたりします。",
            "exampleEn": "When I am tired, I do things like drink warm tea and listen to music.",
            "exampleId": "Saat saya lelah, saya melakukan hal seperti minum teh hangat dan mendengarkan musik."
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
            "exampleJp": "雨が降りました。どうしますか。",
            "exampleKana": "あめがふりました。どうしますか。",
            "exampleEn": "It started raining. What will you do?",
            "exampleId": "Hujan turun. Apa yang akan kamu lakukan?"
          },
          {
            "exampleJp": "暇なとき、どうしますか。",
            "exampleKana": "ひまなとき、どうしますか。",
            "exampleEn": "What do you do when you are free?",
            "exampleId": "Apa yang kamu lakukan saat senggang?"
          },
          {
            "exampleJp": "疲れたとき、どうしますか。寝たり、映画を見たりしますか。",
            "exampleKana": "つかれたとき、どうしますか。ねたり、えいがをみたりしますか。",
            "exampleEn": "What do you do when you are tired? Do you sleep or watch movies?",
            "exampleId": "Apa yang kamu lakukan saat lelah? Apakah kamu tidur atau menonton film?"
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
            "exampleJp": "明日、一緒に映画を見に行かない？",
            "exampleKana": "あした、いっしょにえいがをみにいかない？",
            "exampleEn": "Won't you go watch a movie with me tomorrow?",
            "exampleId": "Besok, mau pergi nonton film bareng tidak?"
          },
          {
            "exampleJp": "昨日、何を食べたの？",
            "exampleKana": "きのう、なにをたべたの？",
            "exampleEn": "What did you eat yesterday?",
            "exampleId": "Kemarin makan apa?"
          },
          {
            "exampleJp": "今日は忙しいから、行けないよ。",
            "exampleKana": "きょうはいそがしいから、いけないよ。",
            "exampleEn": "I'm busy today, so I can't go.",
            "exampleId": "Hari ini sibuk, jadi tidak bisa pergi."
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
            "exampleJp": "明日、映画に行かないんだ。",
            "exampleKana": "あした、えいがにいかないんだ。",
            "exampleEn": "The thing is, I'm not going to the movie tomorrow.",
            "exampleId": "Sebenarnya, besok saya tidak pergi menonton film."
          },
          {
            "exampleJp": "昨日、たくさん食べたんだ。",
            "exampleKana": "きのう、たくさんたべたんだ。",
            "exampleEn": "You see, I ate a lot yesterday.",
            "exampleId": "Sebenarnya, kemarin saya makan banyak."
          },
          {
            "exampleJp": "今日は忙しいんだ。だから行けないよ。",
            "exampleKana": "きょうはいそがしいんだ。だからいけないよ。",
            "exampleEn": "The thing is, I'm busy today. That's why I can't go.",
            "exampleId": "Sebenarnya hari ini saya sibuk. Makanya tidak bisa pergi."
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
            "exampleJp": "明日、映画を見に行ったほうがいいですよ。",
            "exampleKana": "あした、えいがをみにいったほうがいいですよ。",
            "exampleEn": "You should go watch the movie tomorrow.",
            "exampleId": "Sebaiknya besok kamu pergi menonton film."
          },
          {
            "exampleJp": "野菜をたくさん食べたほうがいいですよ。",
            "exampleKana": "やさいをたくさんたべたほうがいいですよ。",
            "exampleEn": "You should eat lots of vegetables.",
            "exampleId": "Sebaiknya kamu makan banyak sayur."
          },
          {
            "exampleJp": "忙しいなら、今日は休んだほうがいいですよ。",
            "exampleKana": "いそがしいなら、きょうはやすんだほうがいいですよ。",
            "exampleEn": "If you are busy, you should rest today.",
            "exampleId": "Kalau sibuk, sebaiknya hari ini kamu istirahat."
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
            "exampleJp": "映画を見る前に、チケットを買います。",
            "exampleKana": "えいがをみるまえに、チケットをかいます。",
            "exampleEn": "I will buy a ticket before watching the movie.",
            "exampleId": "Sebelum menonton film, saya akan membeli tiket."
          },
          {
            "exampleJp": "食べる前に、手を洗ったほうがいいですよ。",
            "exampleKana": "たべるまえに、てをあらったほうがいいですよ。",
            "exampleEn": "You should wash your hands before you eat.",
            "exampleId": "Sebelum makan, sebaiknya cuci tangan."
          },
          {
            "exampleJp": "忙しくなる前に、この仕事を終わらせるんだ。",
            "exampleKana": "いそがしくなるまえに、このしごとをおわらせるんだ。",
            "exampleEn": "I'm going to finish this work before I get busy.",
            "exampleId": "Sebelum jadi sibuk, saya akan menyelesaikan pekerjaan ini."
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
            "exampleJp": "手を洗ってから、ご飯を食べます。",
            "exampleKana": "てをあらってから、ごはんをたべます。",
            "exampleEn": "After washing my hands, I will eat a meal.",
            "exampleId": "Setelah mencuci tangan, saya akan makan."
          },
          {
            "exampleJp": "宿題をしてから、テレビを見たいです。",
            "exampleKana": "しゅくだいをしてから、テレビをみたいです。",
            "exampleEn": "After doing my homework, I want to watch TV.",
            "exampleId": "Setelah mengerjakan PR, saya ingin menonton TV."
          },
          {
            "exampleJp": "日本語を勉強してから、日本へ行きたいです。",
            "exampleKana": "にほんごをべんきょうしてから、にほんへいきたいです。",
            "exampleEn": "After studying Japanese, I want to go to Japan.",
            "exampleId": "Setelah belajar bahasa Jepang, saya ingin pergi ke Jepang."
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
            "exampleJp": "日本料理を食べたことがあります。",
            "exampleKana": "にほんりょうりを たべた ことが あります。",
            "exampleEn": "I have eaten Japanese food before.",
            "exampleId": "Saya pernah makan masakan Jepang."
          },
          {
            "exampleJp": "北海道へ行ったことがあります。",
            "exampleKana": "ほっかいどうへ いった ことが あります。",
            "exampleEn": "I have been to Hokkaido before.",
            "exampleId": "Saya pernah pergi ke Hokkaido."
          },
          {
            "exampleJp": "富士山に登ったことがあります。",
            "exampleKana": "ふじさんに のぼった ことが あります。",
            "exampleEn": "I have climbed Mount Fuji before.",
            "exampleId": "Saya pernah mendaki Gunung Fuji."
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
            "exampleJp": "昨日食べた料理は美味しかったです。",
            "exampleKana": "きのう たべた りょうりは おいしかったです。",
            "exampleEn": "The food I ate yesterday was delicious.",
            "exampleId": "Makanan yang saya makan kemarin enak."
          },
          {
            "exampleJp": "私が行ったことがある国は日本です。",
            "exampleKana": "わたしが いった ことが ある くには にほんです。",
            "exampleEn": "The country I have been to is Japan.",
            "exampleId": "Negara yang pernah saya kunjungi adalah Jepang."
          },
          {
            "exampleJp": "富士山に登ったことがある人は少ないです。",
            "exampleKana": "ふじさんに のぼった ことが ある ひとは すくないです。",
            "exampleEn": "There are few people who have climbed Mount Fuji.",
            "exampleId": "Sedikit orang yang pernah mendaki Gunung Fuji."
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
            "exampleJp": "私はその料理を知っています。",
            "exampleKana": "わたしは その りょうりを しっています。",
            "exampleEn": "I know that food.",
            "exampleId": "Saya tahu masakan itu."
          },
          {
            "exampleJp": "昨日食べた料理の名前を知っていますか。",
            "exampleKana": "きのう たべた りょうりの なまえを しっていますか。",
            "exampleEn": "Do you know the name of the food you ate yesterday?",
            "exampleId": "Apakah Anda tahu nama makanan yang Anda makan kemarin?"
          },
          {
            "exampleJp": "富士山に登ったことがある人は知りません。",
            "exampleKana": "ふじさんに のぼった ことが ある ひとは しりません。",
            "exampleEn": "I don't know anyone who has climbed Mount Fuji.",
            "exampleId": "Saya tidak kenal orang yang pernah mendaki Gunung Fuji."
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
            "exampleJp": "すき焼きという料理を知っています。",
            "exampleKana": "すきやきと いう りょうりを しっています。",
            "exampleEn": "I know a dish called Sukiyaki.",
            "exampleId": "Saya tahu masakan yang bernama Sukiyaki."
          },
          {
            "exampleJp": "昨日食べた、すき焼きという料理は美味しかったです。",
            "exampleKana": "きのう たべた、すきやきと いう りょうりは おいしかったです。",
            "exampleEn": "The dish called Sukiyaki that I ate yesterday was delicious.",
            "exampleId": "Masakan yang bernama Sukiyaki yang saya makan kemarin enak."
          },
          {
            "exampleJp": "北海道という場所に行ったことがあります。",
            "exampleKana": "ほっかいどうと いう ばしょに いった ことが あります。",
            "exampleEn": "I have been to a place called Hokkaido.",
            "exampleId": "Saya pernah pergi ke tempat yang bernama Hokkaido."
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
            "exampleJp": "春になると、花がさきます。",
            "exampleKana": "はるになると、はながさきます。",
            "exampleEn": "When spring comes, flowers bloom.",
            "exampleId": "Jika musim semi tiba, bunga-bunga bermekaran."
          },
          {
            "exampleJp": "このボタンを押すと、ドアが開きます。",
            "exampleKana": "このボタンをおすと、ドアがあきます。",
            "exampleEn": "If you press this button, the door opens.",
            "exampleId": "Jika menekan tombol ini, pintunya terbuka."
          },
          {
            "exampleJp": "右に曲がると、銀行があります。",
            "exampleKana": "みぎにまがると、ぎんこうがあります。",
            "exampleEn": "When you turn right, there is a bank.",
            "exampleId": "Jika belok ke kanan, ada bank di sana."
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
            "exampleJp": "右に曲がると危ないですから、走ってはいけません。",
            "exampleKana": "みぎにまがるとあぶないですから、はしってはいけません。",
            "exampleEn": "It is dangerous if you turn right, so you must not run.",
            "exampleId": "Karena berbahaya jika belok ke kanan, tidak boleh berlari."
          },
          {
            "exampleJp": "このボタンを押してはいけません。",
            "exampleKana": "このボタンをおしてはいけません。",
            "exampleEn": "You must not press this button.",
            "exampleId": "Tidak boleh menekan tombol ini."
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
            "exampleJp": "毎日、日本語を勉強しなければなりません。",
            "exampleKana": "まいにち、にほんごをべんきょうしなければなりません。",
            "exampleEn": "I must study Japanese every day.",
            "exampleId": "Saya harus belajar bahasa Jepang setiap hari."
          },
          {
            "exampleJp": "春になると、新しい服を買わなければなりません。",
            "exampleKana": "はるになると、あたらしいふくをかわなければなりません。",
            "exampleEn": "When spring comes, I must buy new clothes.",
            "exampleId": "Jika musim semi tiba, saya harus membeli baju baru."
          },
          {
            "exampleJp": "銀行へ行って、お金をおろさなければなりません。",
            "exampleKana": "ぎんこうへいって、おかねをおろさなければなりません。",
            "exampleEn": "I must go to the bank and withdraw money.",
            "exampleId": "Saya harus pergi ke bank dan menarik uang."
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
            "exampleId": "Besok tidak usah pergi ke sekolah."
          },
          {
            "exampleJp": "このボタンを押さなくてもいいです。",
            "exampleKana": "このボタンをおさなくてもいいです。",
            "exampleEn": "You don't have to press this button.",
            "exampleId": "Tidak usah menekan tombol ini."
          },
          {
            "exampleJp": "春になると暖かくなりますから、コートを着なくてもいいです。",
            "exampleKana": "はるになるとあたたかくなりますから、コートをきなくてもいいです。",
            "exampleEn": "When spring comes, it gets warm, so you don't have to wear a coat.",
            "exampleId": "Karena jika musim semi tiba udara menjadi hangat, jadi tidak usah memakai mantel."
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
            "exampleId": "Saya pikir besok akan turun hujan."
          },
          {
            "exampleJp": "この映画は面白いと思います。",
            "exampleKana": "このえいがはおもしろいとおもいます。",
            "exampleEn": "I think this movie is interesting.",
            "exampleId": "Saya pikir film ini menarik."
          },
          {
            "exampleJp": "彼は日本へ行きたいと思っていると思います。",
            "exampleKana": "かれはにほんへいきたいとおもっているとおもいます。",
            "exampleEn": "I think that he wants to go to Japan.",
            "exampleId": "Saya pikir dia ingin pergi ke Jepang."
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
            "exampleJp": "彼は「この映画は面白い」と言います。",
            "exampleKana": "かれは「このえいがはおもしろい」といいます。",
            "exampleEn": "He says, \"This movie is interesting.\"",
            "exampleId": "Dia berkata, \"Film ini menarik.\""
          },
          {
            "exampleJp": "私は彼に「日本へ行きたい」と言いました。",
            "exampleKana": "わたしはかれに「にほんへいきたい」といいました。",
            "exampleEn": "I told him, \"I want to go to Japan.\"",
            "exampleId": "Saya berkata kepadanya, \"Saya ingin pergi ke Jepang.\""
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
            "exampleJp": "天気予報によると、明日は雨だそうです。",
            "exampleKana": "てんきよほうによると、あしたはあめだそうです。",
            "exampleEn": "According to the weather forecast, I heard it will rain tomorrow.",
            "exampleId": "Menurut prakiraan cuaca, katanya besok akan hujan."
          },
          {
            "exampleJp": "田中さんは、新しい車を買ったそうです。",
            "exampleKana": "たなかさんは、あたらしいくるまをかったそうです。",
            "exampleEn": "I heard that Mr. Tanaka bought a new car.",
            "exampleId": "Katanya Pak Tanaka telah membeli mobil baru."
          },
          {
            "exampleJp": "あの店はとてもおいしいそうですから、行ってみます。",
            "exampleKana": "あのみせはとてもおいしいそうですから、いってみます。",
            "exampleEn": "I heard that shop is very delicious, so I will try going there.",
            "exampleId": "Katanya toko itu sangat enak, jadi saya akan coba pergi ke sana."
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
            "exampleJp": "明日、時間があったら、映画を見に行きます。",
            "exampleKana": "あした、じかんがあったら、えいがをみにいきます。",
            "exampleEn": "If I have time tomorrow, I will go to watch a movie.",
            "exampleId": "Kalau besok ada waktu, saya akan pergi menonton film."
          },
          {
            "exampleJp": "日本に着いたら、電話をしてください。",
            "exampleKana": "にほんについたら、でんわをしてください。",
            "exampleEn": "When you arrive in Japan, please call me.",
            "exampleId": "Kalau sudah sampai di Jepang, tolong telepon saya."
          },
          {
            "exampleJp": "雨が降ったら、外で遊ぶのはやめましょう。",
            "exampleKana": "あめがふったら、そとであそぶのはやめましょう。",
            "exampleEn": "If it rains, let's stop playing outside.",
            "exampleId": "Kalau hujan, mari kita berhenti bermain di luar."
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
            "exampleJp": "明日、雨が降っても、テニスをします。",
            "exampleKana": "あした、あめがふっても、テニスをします。",
            "exampleEn": "Even if it rains tomorrow, I will play tennis.",
            "exampleId": "Walaupun besok hujan, saya akan tetap bermain tenis."
          },
          {
            "exampleJp": "高くても、このコンピューターがほしいです。",
            "exampleKana": "たかくても、このコンピューターがほしいです。",
            "exampleEn": "Even if it is expensive, I want this computer.",
            "exampleId": "Biarpun mahal, saya ingin komputer ini."
          },
          {
            "exampleJp": "何回聞いても、わかりません。",
            "exampleKana": "なんかいきいても、わかりません。",
            "exampleEn": "Even if I ask many times, I don't understand.",
            "exampleId": "Walaupun saya bertanya berkali-kali, saya tetap tidak mengerti."
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
            "exampleJp": "私は今、東京に住んでいます。",
            "exampleKana": "わたしはいま、とうきょうにすんでいます。",
            "exampleEn": "I am living in Tokyo now.",
            "exampleId": "Sekarang saya tinggal di Tokyo."
          },
          {
            "exampleJp": "彼は結婚指輪をしています。",
            "exampleKana": "かれはけっこんゆびわをしています。",
            "exampleEn": "He is wearing a wedding ring.",
            "exampleId": "Dia sedang memakai cincin pernikahan."
          },
          {
            "exampleJp": "窓が開いていますから、閉めてください。",
            "exampleKana": "まどがあいていますから、しめてください。",
            "exampleEn": "The window is open, so please close it.",
            "exampleId": "Jendelanya sedang terbuka, jadi tolong tutup."
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
            "exampleJp": "風邪で学校を休みます。",
            "exampleKana": "かぜでがっこうをやすみます。",
            "exampleEn": "I am absent from school due to a cold.",
            "exampleId": "Saya absen sekolah karena sakit flu."
          },
          {
            "exampleJp": "事故で電車が遅れました。",
            "exampleKana": "じこででんしゃがおくれました。",
            "exampleEn": "The train was delayed because of an accident.",
            "exampleId": "Kereta terlambat karena ada kecelakaan."
          },
          {
            "exampleJp": "地震で家が壊れました。",
            "exampleKana": "じしんのいえがこわれました。",
            "exampleEn": "The house was destroyed due to the earthquake.",
            "exampleId": "Rumah rusak karena gempa bumi."
          }
        ]
      }
    ]
  }
];
