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
  },

  {
    "chapter": 16,
    "titleEn": "Intentions & Purposes",
    "titleId": "Keinginan, Niat & Tujuan",
    "patterns": [
      {
        "id": "n-v-no-tame-ni",
        "pattern": "N の / V辞書形 ために",
        "jlpt": "N4",
        "descEn": "Indicates purpose, intention, or sake ('in order to / for the sake of').",
        "descId": "Menyatakan tujuan, niat, atau demi sesuatu ('demi / untuk').",
        "examples": [
          {
            "exampleJp": "日本に留学するために、日本語を勉強しています。",
            "exampleKana": "にほんにりゅうがくするために、にほんごをべんきょうしています。",
            "exampleEn": "I am studying Japanese in order to study abroad in Japan.",
            "exampleId": "Saya belajar bahasa Jepang untuk kuliah di Jepang."
          },
          {
            "exampleJp": "家族のために、毎日一生懸命働きます。",
            "exampleKana": "かぞくのために、まいにちいっしょうけんめいはたらきます。",
            "exampleEn": "I work hard every day for the sake of my family.",
            "exampleId": "Saya bekerja keras setiap hari demi keluarga."
          },
          {
            "exampleJp": "新しい車を買うために、貯金しています。",
            "exampleKana": "あたらしいくるまをかうために、ちょきんしています。",
            "exampleEn": "I am saving money in order to buy a new car.",
            "exampleId": "Saya menabung untuk membeli mobil baru."
          }
        ]
      },
      {
        "id": "v-youni",
        "pattern": "V辞書形 / Vない形 ように",
        "jlpt": "N4",
        "descEn": "Indicates a target state or goal ('so that / in order to').",
        "descId": "Menyatakan kondisi sasaran atau harapan ('supaya / agar').",
        "examples": [
          {
            "exampleJp": "風邪を引かないように、温かい服を着ます。",
            "exampleKana": "かぜをひかないように、あたたかいふくをきます。",
            "exampleEn": "I wear warm clothes so that I won't catch a cold.",
            "exampleId": "Saya memakai baju hangat agar tidak kena flu."
          },
          {
            "exampleJp": "試験に合格できるように、毎日復習します。",
            "exampleKana": "しけんにごうかくできるように、まいにちふくしゅうします。",
            "exampleEn": "I review every day so that I can pass the exam.",
            "exampleId": "Saya mengulang pelajaran setiap hari supaya bisa lulus ujian."
          },
          {
            "exampleJp": "忘れないように、ノートにメモしておきます。",
            "exampleKana": "わすれないように、のーとにめもしておきます。",
            "exampleEn": "I take notes in my notebook so I won't forget.",
            "exampleId": "Saya mencatat di buku catatan agar tidak lupa."
          }
        ]
      },
      {
        "id": "v-ikoukei-to-omou",
        "pattern": "V意向形 と思う / と思っている",
        "jlpt": "N4",
        "descEn": "Expresses an intention to do something ('I think I will / I am planning to').",
        "descId": "Menyatakan niat atau rencana pribadi ('berniat untuk / berencana').",
        "examples": [
          {
            "exampleJp": "来年、日本へ旅行に行こうと思っています。",
            "exampleKana": "らいねん、にほんへりょこうにいこうとおもっています。",
            "exampleEn": "I am thinking of travelling to Japan next year.",
            "exampleId": "Saya berniat untuk jalan-jalan ke Jepang tahun depan."
          },
          {
            "exampleJp": "今週末は家でゆっくり休もうと思います。",
            "exampleKana": "こんしゅうまつはいえでゆっくりやすもうとおもいます。",
            "exampleEn": "I think I will rest at home this weekend.",
            "exampleId": "Saya rasa saya akan istirahat santai di rumah akhir pekan ini."
          },
          {
            "exampleJp": "会社をやめて、新しい仕事を始めようと思います。",
            "exampleKana": "かいしゃをやめて、あたらしいしごとをはじめようとおもいます。",
            "exampleEn": "I think I will quit the company and start a new job.",
            "exampleId": "Saya berniat resign dan memulai pekerjaan baru."
          }
        ]
      },
      {
        "id": "v-tsumori-desu",
        "pattern": "V辞書形 / Vない形 つもりです",
        "jlpt": "N4",
        "descEn": "Expresses a definite plan or determination ('plan to / intend to').",
        "descId": "Menyatakan rencana atau niat yang sudah pasti ('berencana untuk / bermaksud').",
        "examples": [
          {
            "exampleJp": "大学を卒業したら、IT企業で働くつもりです。",
            "exampleKana": "だいがくをそつぎょうしたら、あいてぃーきぎょうではたらくつもりです。",
            "exampleEn": "After graduating from university, I plan to work at an IT company.",
            "exampleId": "Setelah lulus kuliah, saya berencana bekerja di perusahaan IT."
          },
          {
            "exampleJp": "今日はお酒を飲まないつもりです。",
            "exampleKana": "きょうはおさけをのまないつもりです。",
            "exampleEn": "I intend not to drink alcohol today.",
            "exampleId": "Hari ini saya berniat untuk tidak minum alkohol."
          },
          {
            "exampleJp": "夏休みに国へ帰るつもりです。",
            "exampleKana": "なつやすみにくにへかえるつもりです。",
            "exampleEn": "I plan to return to my home country during summer vacation.",
            "exampleId": "Saya berencana pulang kampung saat libur musim panas."
          }
        ]
      },
      {
        "id": "v-yotei-desu",
        "pattern": "V辞書形 / N の 予定です",
        "jlpt": "N4",
        "descEn": "Indicates a scheduled event or arrangement ('is scheduled to').",
        "descId": "Menyatakan agenda atau jadwal resmi ('dijadwalkan untuk').",
        "examples": [
          {
            "exampleJp": "新幹線は午前10時に出発する予定です。",
            "exampleKana": "しんかんせんはごぜんじゅうじにしゅっぱつするよていです。",
            "exampleEn": "The Shinkansen is scheduled to depart at 10:00 AM.",
            "exampleId": "Shinkansen dijadwalkan berangkat jam 10 pagi."
          },
          {
            "exampleJp": "明日は会議の予定です。",
            "exampleKana": "あしたはかいぎのよていです。",
            "exampleEn": "A meeting is scheduled for tomorrow.",
            "exampleId": "Besok ada agenda rapat."
          },
          {
            "exampleJp": "社長は来週アメリカへ出張する予定です。",
            "exampleKana": "しゃちょうはらいしゅうあめりかへしゅっちょうするよていです。",
            "exampleEn": "The president is scheduled to go on a business trip to America next week.",
            "exampleId": "Direktur dijadwalkan dinas ke Amerika minggu depan."
          }
        ]
      }
    ]
  },
  {
    "chapter": 17,
    "titleEn": "Changes & Conjecture",
    "titleId": "Perubahan Keadaan, Kemungkinan & Kesimpulan",
    "patterns": [
      {
        "id": "v-youni-narimasu",
        "pattern": "V可能形 / V辞書形 ように なります",
        "jlpt": "N4",
        "descEn": "Indicates a change in state or ability ('come to be able to / start doing').",
        "descId": "Menyatakan perubahan kemampuan atau kebiasaan ('menjadi bisa / mulai...').",
        "examples": [
          {
            "exampleJp": "日本語で日常会話ができるようになりました。",
            "exampleKana": "にほんごでにちじょうかいわができるようになりました。",
            "exampleEn": "I have become able to hold daily conversations in Japanese.",
            "exampleId": "Saya sudah menjadi bisa percakapan sehari-hari dalam bahasa Jepang."
          },
          {
            "exampleJp": "毎日練習して、ピアノが弾けるようになりました。",
            "exampleKana": "まいにちれんしゅうして、ぴあのがひけるようになりました。",
            "exampleEn": "By practicing every day, I became able to play the piano.",
            "exampleId": "Dengan latihan tiap hari, saya jadi bisa main piano."
          },
          {
            "exampleJp": "最近、野菜を食べるようになりました。",
            "exampleKana": "さいきん、やさいをたべるようになりました。",
            "exampleEn": "Recently, I have started eating vegetables.",
            "exampleId": "Akhir-akhir ini saya mulai terbiasa makan sayur."
          }
        ]
      },
      {
        "id": "v-youni-shimasu",
        "pattern": "V辞書形 / Vない形 ように します",
        "jlpt": "N4",
        "descEn": "Indicates making an effort to form a habit ('try to / make sure to').",
        "descId": "Menyatakan usaha atau upaya terus-menerus ('berusaha untuk / mengusahakan').",
        "examples": [
          {
            "exampleJp": "健康のために、毎日運動するようにしています。",
            "exampleKana": "けんこうのために、まいにちうんどうするようにしています。",
            "exampleEn": "For my health, I make sure to exercise every day.",
            "exampleId": "Demi kesehatan, saya mengusahakan olahraga setiap hari."
          },
          {
            "exampleJp": "夜遅くファーストフードを食べないようにします。",
            "exampleKana": "よるおそくふぁーすとふーどをたべないようにします。",
            "exampleEn": "I will try not to eat fast food late at night.",
            "exampleId": "Saya akan berusaha tidak makan fast food larut malam."
          },
          {
            "exampleJp": "寝る前にスマホを見ないようにしてください。",
            "exampleKana": "ねるまえにすまほをみないようにしてください。",
            "exampleEn": "Please make sure not to look at your smartphone before sleeping.",
            "exampleId": "Tolong usahakan jangan melihat HP sebelum tidur."
          }
        ]
      },
      {
        "id": "toori-ni",
        "pattern": "普通形 とおりに / N の とおりに",
        "jlpt": "N4",
        "descEn": "Indicates doing something exactly as shown or instructed ('just as / according to').",
        "descId": "Melakukan sesuatu sesuai atau sama persis dengan yang diajarkan/ditunjukkan.",
        "examples": [
          {
            "exampleJp": "先生が言ったとおりに書いてください。",
            "exampleKana": "せんせいがいったとおりにかいてください。",
            "exampleEn": "Please write exactly as the teacher said.",
            "exampleId": "Tolong tulis sesuai seperti yang dikatakan guru."
          },
          {
            "exampleJp": "説明書のとおりに組み立てました。",
            "exampleKana": "せつめいしょのとおりにくみたてました。",
            "exampleEn": "I assembled it according to the instruction manual.",
            "exampleId": "Saya merakitnya sesuai petunjuk manual."
          },
          {
            "exampleJp": "私がやるのとおりに真似してください。",
            "exampleKana": "わたしがやるのとおりにまねしてください。",
            "exampleEn": "Please imitate just as I do.",
            "exampleId": "Tolong tirukan persis seperti yang saya lakukan."
          }
        ]
      },
      {
        "id": "hazusu-desu",
        "pattern": "普通形 はずです / はずがない",
        "jlpt": "N4",
        "descEn": "Expresses an expectation based on knowledge or logic ('should be / ought to be').",
        "descId": "Menyatakan dugaan berlandaskan logika/bukti ('seharusnya / tidak mungkin').",
        "examples": [
          {
            "exampleJp": "彼は昨日しっかり勉強したから、テストに合格するはずです。",
            "exampleKana": "かれはきのうしっかりべんきょうしたから、てすとにごうかくするはずです。",
            "exampleEn": "Since he studied hard yesterday, he should pass the test.",
            "exampleId": "Karena dia kemarin belajar keras, dia seharusnya lulus tes."
          },
          {
            "exampleJp": "鍵はポケットにあるはずですが、見つかりません。",
            "exampleKana": "かぎはぽけっとにあるはずですが、みつかりません。",
            "exampleEn": "The key should be in my pocket, but I can't find it.",
            "exampleId": "Kunci seharusnya ada di kantong, tapi tidak ketemu."
          },
          {
            "exampleJp": "真面目な田中さんが嘘をつくはずがありません。",
            "exampleKana": "まじめなたなかさんがうそをつくはずがありません。",
            "exampleEn": "There is no way that serious Mr. Tanaka would lie.",
            "exampleId": "Pak Tanaka yang serius tidak mungkin berbohong."
          }
        ]
      },
      {
        "id": "kamo-shiremasen",
        "pattern": "普通形 かも しれません",
        "jlpt": "N4",
        "descEn": "Indicates possibility ('might / may / perhaps').",
        "descId": "Menyatakan kemungkinan yang belum pasti ('mungkin / bisa jadi').",
        "examples": [
          {
            "exampleJp": "午後から雨が降るかもしれません。",
            "exampleKana": "ごごからあめがふるかもしれません。",
            "exampleEn": "It might rain in the afternoon.",
            "exampleId": "Bisa jadi sore nanti turun hujan."
          },
          {
            "exampleJp": "彼は道を間違えたかもしれません。",
            "exampleKana": "かれはみちをまちがえたかもしれません。",
            "exampleEn": "He might have taken the wrong road.",
            "exampleId": "Dia mungkin salah jalan."
          },
          {
            "exampleJp": "明日、時間に間に合わないかもしれません。",
            "exampleKana": "あした、じかんにまにあわないかもしれません。",
            "exampleEn": "I might not make it on time tomorrow.",
            "exampleId": "Besok saya mungkin tidak tepat waktu."
          }
        ]
      }
    ]
  },
  {
    "chapter": 18,
    "titleEn": "Causative, Passive & Benefactives",
    "titleId": "Kausatif, Pasif & Hubungan Bantuan",
    "patterns": [
      {
        "id": "v-ukemi",
        "pattern": "V受身 (～られる / ～される)",
        "jlpt": "N4",
        "descEn": "Expresses passive voice ('is done by someone').",
        "descId": "Bentuk pasif (dikenai tindakan oleh orang lain).",
        "examples": [
          {
            "exampleJp": "私は先生にほめられました。",
            "exampleKana": "わたしはせんせいにほめられました。",
            "exampleEn": "I was praised by the teacher.",
            "exampleId": "Saya dipuji oleh guru."
          },
          {
            "exampleJp": "泥棒に財布を盗まれました。",
            "exampleKana": "どろぼうにさいふをぬすまれました。",
            "exampleEn": "My wallet was stolen by a thief.",
            "exampleId": "Dompet saya dicuri oleh pencuri."
          },
          {
            "exampleJp": "この本は世界中で読まれています。",
            "exampleKana": "このほんはせかいじゅうでよまれています。",
            "exampleEn": "This book is read all over the world.",
            "exampleId": "Buku ini dibaca di seluruh dunia."
          }
        ]
      },
      {
        "id": "v-shieki",
        "pattern": "V使役 (～させる)",
        "jlpt": "N4",
        "descEn": "Expresses causative voice ('make someone do / let someone do').",
        "descId": "Bentuk kausatif (menyuruh atau membiarkan seseorang melakukan).",
        "examples": [
          {
            "exampleJp": "お母さんは子どもに部屋を掃除させました。",
            "exampleKana": "おかあさんはこどもにへやをそうじさせました。",
            "exampleEn": "The mother made the child clean the room.",
            "exampleId": "Ibu menyuruh anaknya membersihkan kamar."
          },
          {
            "exampleJp": "先生は学生に作文を書かせます。",
            "exampleKana": "せんせいはがくせいにさくぶんをかかせます。",
            "exampleEn": "The teacher makes the students write essays.",
            "exampleId": "Guru menyuruh siswa menulis karangan."
          },
          {
            "exampleJp": "部下を早く帰らせてあげました。",
            "exampleKana": "ぶかをはやくかえらせてあげました。",
            "exampleEn": "I let my subordinate go home early.",
            "exampleId": "Saya membiarkan bawahan pulang lebih awal."
          }
        ]
      },
      {
        "id": "v-shieki-ukemi",
        "pattern": "V使役受身 (～させられる)",
        "jlpt": "N4",
        "descEn": "Expresses causative-passive voice ('be forced / coerced into doing something').",
        "descId": "Bentuk kausatif-pasif (dipaksa melakukan sesuatu oleh orang lain).",
        "examples": [
          {
            "exampleJp": "嫌な仕事をさせられました。",
            "exampleKana": "いやなしごとをさせられました。",
            "exampleEn": "I was forced to do an unpleasant job.",
            "exampleId": "Saya dipaksa melakukan pekerjaan yang tidak saya sukai."
          },
          {
            "exampleJp": "子供の頃、毎日ピアノを練習させられました。",
            "exampleKana": "こどものころ、まいにちぴあのをれんしゅうさせられました。",
            "exampleEn": "When I was a child, I was forced to practice the piano every day.",
            "exampleId": "Sewaktu kecil, saya dipaksa latihan piano tiap hari."
          },
          {
            "exampleJp": "雨の中、1時間も待たされました。",
            "exampleKana": "あめのなか、いちじかんもまたされました。",
            "exampleEn": "I was made to wait for an hour in the rain.",
            "exampleId": "Saya dipaksa menunggu 1 jam di tengah hujan."
          }
        ]
      },
      {
        "id": "v-te-agemasu-moraimasu-kuremasu",
        "pattern": "Vて あげます / もらいます / くれます",
        "jlpt": "N4",
        "descEn": "Indicates doing an action for someone or receiving a favor of action.",
        "descId": "Menyatakan memberi bantuan aksi atau menerima kebaikan dari aksi orang lain.",
        "examples": [
          {
            "exampleJp": "友達に日本語を教えてあげました。",
            "exampleKana": "ともだちににほんごをおしえてあげました。",
            "exampleEn": "I taught Japanese to my friend.",
            "exampleId": "Saya mengajarkan bahasa Jepang kepada teman."
          },
          {
            "exampleJp": "田中さんに荷物を持ってもらいました。",
            "exampleKana": "たなかさんににもつをもってもらいました。",
            "exampleEn": "I had Mr. Tanaka carry my luggage.",
            "exampleId": "Saya dibantu Pak Tanaka dibawakan barangnya."
          },
          {
            "exampleJp": "先輩が美味しい料理を奢ってくれました。",
            "exampleKana": "せんぱいがおいしいりょうりをおごってくれました。",
            "exampleEn": "My senior treated me to delicious food.",
            "exampleId": "Senior meraktir saya makanan enak."
          }
        ]
      },
      {
        "id": "v-te-itadakemasenka",
        "pattern": "Vて いただけませんか / くれませんか",
        "jlpt": "N4",
        "descEn": "Polite request asking if someone could do a favor ('could you please...?').",
        "descId": "Permohonan sopan meminta seseorang melakukan sesuatu ('bisakah Anda tolong...?').",
        "examples": [
          {
            "exampleJp": "この漢字の読み方を教えていただけませんか。",
            "exampleKana": "このかんじのよみかたをおしえていただけませんか。",
            "exampleEn": "Could you please teach me how to read this kanji?",
            "exampleId": "Bolehkah Anda tolong ajarkan cara membaca kanji ini?"
          },
          {
            "exampleJp": "写真を撮っていただけませんか。",
            "exampleKana": "しゃしんをとっていただけませんか。",
            "exampleEn": "Could you please take a photo for me?",
            "exampleId": "Bisakah Anda tolong ambilkan foto?"
          },
          {
            "exampleJp": "もう少しゆっくり話してくれませんか。",
            "exampleKana": "もうすこしゆっくりはなしてくれませんか。",
            "exampleEn": "Could you please speak a little more slowly?",
            "exampleId": "Bisakah kamu bicara sedikit lebih pelan?"
          }
        ]
      }
    ]
  },
  {
    "chapter": 19,
    "titleEn": "Conditionals & Conjectures",
    "titleId": "Pengandaian, Syarat & Conjectures",
    "patterns": [
      {
        "id": "v-ba-conditional",
        "pattern": "Vば / Aければ / N・Aなら",
        "jlpt": "N4",
        "descEn": "Conditional form expressing a hypothetical condition ('if').",
        "descId": "Bentuk pengandaian Ba untuk syarat hipotesis ('jika / kalau').",
        "examples": [
          {
            "exampleJp": "安ければ、買いましょう。",
            "exampleKana": "やすければ、かいましょう。",
            "exampleEn": "If it is cheap, let me buy it.",
            "exampleId": "Jika murah, mari kita beli."
          },
          {
            "exampleJp": "時間があれば、一緒に行きましょう。",
            "exampleKana": "じかんがあれば、いっしょにいきましょう。",
            "exampleEn": "If you have time, let's go together.",
            "exampleId": "Jika ada waktu, ayo pergi bareng."
          },
          {
            "exampleJp": "明日雨が降らなければ、ハイキングに行きます。",
            "exampleKana": "あしたあめがふらなければ、はいきんぐにいきます。",
            "exampleEn": "If it doesn't rain tomorrow, I will go hiking.",
            "exampleId": "Jika besok tidak hujan, saya akan pergi hiking."
          }
        ]
      },
      {
        "id": "n-v-nara",
        "pattern": "普通形 なら",
        "jlpt": "N4",
        "descEn": "Indicates a topic-based conditional ('if it is the case that / as for').",
        "descId": "Pengandaian berdasarkan konteks ucapan orang lain ('kalau soal / jika memang').",
        "examples": [
          {
            "exampleJp": "京都へ行くなら、秋が一番おすすめですよ。",
            "exampleKana": "きょうとへいくなら、あきがいちばんおすすめですよ。",
            "exampleEn": "If you are going to Kyoto, autumn is most recommended.",
            "exampleId": "Kalau mau pergi ke Kyoto, musim gugur paling direkomendasikan."
          },
          {
            "exampleJp": "カメラを買うなら、あの店がいいです。",
            "exampleKana": "かめらをかうなら、あのみせがいいです。",
            "exampleEn": "If you are buying a camera, that shop is good.",
            "exampleId": "Kalau mau beli kamera, toko itu bagus."
          },
          {
            "exampleJp": "日本語の辞書なら、これが便利ですよ。",
            "exampleKana": "にほんごのじしょなら、これがべんりですよ。",
            "exampleEn": "If it's a Japanese dictionary, this one is convenient.",
            "exampleId": "Kalau kamus bahasa Jepang, yang ini praktis."
          }
        ]
      },
      {
        "id": "v-temo-demo",
        "pattern": "Vて も / Aくても / N・Aでも",
        "jlpt": "N4",
        "descEn": "Expresses a concessive condition ('even if / even though').",
        "descId": "Pengandaian pertentangan ('meskipun / walaupun').",
        "examples": [
          {
            "exampleJp": "雨が降っても、試合は行われます。",
            "exampleKana": "あめがふっても、しあいはおこなわれます。",
            "exampleEn": "Even if it rains, the match will be held.",
            "exampleId": "Meskipun hujan, pertandingan tetap dilaksanakan."
          },
          {
            "exampleJp": "高くても、品質が良いものを買いたいです。",
            "exampleKana": "たかくても、ひんしつがよいものをかいたいです。",
            "exampleEn": "Even if it is expensive, I want to buy good quality items.",
            "exampleId": "Meskipun mahal, saya ingin beli barang berkualiatas."
          },
          {
            "exampleJp": "いくら大変でも、途中で諦めません。",
            "exampleKana": "いくらたいへんでも、とちゅうであきらめません。",
            "exampleEn": "No matter how tough it is, I won't give up halfway.",
            "exampleId": "Seberat apapun itu, saya tidak akan menyerah di tengah jalan."
          }
        ]
      },
      {
        "id": "v-so-desu",
        "pattern": "Vstem / A stem そうです",
        "jlpt": "N4",
        "descEn": "Indicates visual conjecture ('looks like / seems about to').",
        "descId": "Dugaan berdasarkan penampilan penglihatan ('kelihatannya / tampaknya').",
        "examples": [
          {
            "exampleJp": "空が暗くなってきたから、今にも雨が降りそうです。",
            "exampleKana": "そらがくらくなってきたから、いまにもあめがふりそうです。",
            "exampleEn": "The sky has turned dark, so it looks like it's about to rain any minute.",
            "exampleId": "Langit mulai gelap, sepertinya akan segera turun hujan."
          },
          {
            "exampleJp": "このケーキはとても美味しそうです。",
            "exampleKana": "このけーきはとてもおいしそうです。",
            "exampleEn": "This cake looks very delicious.",
            "exampleId": "Kue ini kelihatannya sangat lezat."
          },
          {
            "exampleJp": "荷物が重そうですね。手伝いましょうか。",
            "exampleKana": "にもつがおもそうですね。てつだいましょうか。",
            "exampleEn": "Your luggage looks heavy. Shall I help you?",
            "exampleId": "Barang bapak kelihatannya berat ya. Boleh saya bantu?"
          }
        ]
      },
      {
        "id": "v-rashii-desu",
        "pattern": "普通形 らしいです",
        "jlpt": "N4",
        "descEn": "Indicates hearsay or conjecture based on reliable information ('it seems that / word is that').",
        "descId": "Sepertinya / kabar beritanya (berdasarkan bukti atau kabar tepercaya).",
        "examples": [
          {
            "exampleJp": "噂によると、あの二人は来年結婚するらしいです。",
            "exampleKana": "うわさによると、あのふたりはらいねんけっこんするらしいです。",
            "exampleEn": "According to rumor, it seems those two are getting married next year.",
            "exampleId": "Menurut rumor, sepertinya mereka berdua akan menikah tahun depan."
          },
          {
            "exampleJp": "明日は大雨になるらしいです。",
            "exampleKana": "あしたはおおあめになるらしいです。",
            "exampleEn": "It seems it will rain heavily tomorrow.",
            "exampleId": "Katanya besok akan turun hujan deras."
          },
          {
            "exampleJp": "田中さんは風邪で休んでいるらしいです。",
            "exampleKana": "たなかさんはかぜでやすんでいるらしいです。",
            "exampleEn": "It seems Tanaka-san is absent due to a cold.",
            "exampleId": "Sepertinya Pak Tanaka absen karena flu."
          }
        ]
      }
    ]
  },
  {
    "chapter": 20,
    "titleEn": "Sequential Time Events",
    "titleId": "Transisi & Hubungan Waktu",
    "patterns": [
      {
        "id": "v-te-kara-v-ta-ato-de",
        "pattern": "Vてから / Vた あとで",
        "jlpt": "N4",
        "descEn": "Indicates action sequence ('after doing V').",
        "descId": "Menunjukkan urutan tindakan ('setelah melakukan V').",
        "examples": [
          {
            "exampleJp": "手を洗ってから、ご飯を食べます。",
            "exampleKana": "てをあらってから、ごはんをたべます。",
            "exampleEn": "After washing my hands, I eat meals.",
            "exampleId": "Setelah mencuci tangan, saya makan nasi."
          },
          {
            "exampleJp": "仕事が終わったあとで、飲みに行きませんか。",
            "exampleKana": "しごとがおわったあとで、のみにいきませんか。",
            "exampleEn": "After work finishes, would you like to go drinking?",
            "exampleId": "Setelah kerjaan selesai, bagaimana kalau kita minum?"
          },
          {
            "exampleJp": "薬を飲んだあとで、ゆっくり休んでください。",
            "exampleKana": "くすりをのんだあとで、ゆっくりやすんでください。",
            "exampleEn": "After taking the medicine, please rest well.",
            "exampleId": "Setelah minum obat, tolong istirahat dengan tenang."
          }
        ]
      },
      {
        "id": "v-toki-n4",
        "pattern": "V辞書形 とき / Vた とき",
        "jlpt": "N4",
        "descEn": "Indicates timing of action depending on completed or incomplete status.",
        "descId": "Menyatakan momen waktu sebelum (V辞書形) atau sesudah (Vた) aksi.",
        "examples": [
          {
            "exampleJp": "家を出るとき、「いってきます」と言います。",
            "exampleKana": "いえをでるとき、「いってきます」といいます。",
            "exampleEn": "When leaving home, I say 'Ittekimasu'.",
            "exampleId": "Saat akan keluar rumah, saya mengucapkan 'Ittekimasu'."
          },
          {
            "exampleJp": "日本に着いたとき、友達に電話しました。",
            "exampleKana": "にほんについたとき、ともだちにでんわしました。",
            "exampleEn": "When I arrived in Japan, I called my friend.",
            "exampleId": "Ketika sudah sampai di Jepang, saya menelepon teman."
          },
          {
            "exampleJp": "困ったときは、いつでも連絡してください。",
            "exampleKana": "こまったときは、いつでもれんらくしてください。",
            "exampleEn": "When you are in trouble, please contact me anytime.",
            "exampleId": "Saat sedang kesulitan, silakan hubungi saya kapan saja."
          }
        ]
      },
      {
        "id": "v-nagara",
        "pattern": "Vstem ながら",
        "jlpt": "N4",
        "descEn": "Indicates two actions taking place simultaneously by the same subject.",
        "descId": "Melakukan dua pekerjaan secara bersamaan ('sambil').",
        "examples": [
          {
            "exampleJp": "音楽を聞きながら、勉強します。",
            "exampleKana": "おんがくをききながら、べんきょうします。",
            "exampleEn": "I study while listening to music.",
            "exampleId": "Saya belajar sambil mendengarkan musik."
          },
          {
            "exampleJp": "歩きながら、スマホを見るのは危険です。",
            "exampleKana": "あるきながら、すまほをみるのはきけんです。",
            "exampleEn": "Looking at your phone while walking is dangerous.",
            "exampleId": "Melihat HP sambil berjalan itu berbahaya."
          },
          {
            "exampleJp": "コーヒーを飲みながら、友達とおしゃべりしました。",
            "exampleKana": "こーひーをのみながら、ともだちとおしゃべりしました。",
            "exampleEn": "I chatted with my friend while drinking coffee.",
            "exampleId": "Saya mengobrol dengan teman sambil minum kopi."
          }
        ]
      },
      {
        "id": "v-tsuzukemasu",
        "pattern": "Vstem つづけます",
        "jlpt": "N4",
        "descEn": "Indicates continuation of an action ('continue doing').",
        "descId": "Melanjutkan aksi secara terus menerus ('terus melakukan').",
        "examples": [
          {
            "exampleJp": "雨が降り続いています。",
            "exampleKana": "あめがふりつづけています。",
            "exampleEn": "The rain continues to fall.",
            "exampleId": "Hujan terus menerus turun."
          },
          {
            "exampleJp": "諦めないで、走り続けてください。",
            "exampleKana": "あきらめないで、はしりつづけてください。",
            "exampleEn": "Don't give up, keep running.",
            "exampleId": "Jangan menyerah, teruslah berlari."
          },
          {
            "exampleJp": "彼は10年間、日本語を勉強し続けています。",
            "exampleKana": "かれはじゅうねんかん、にほんごをべんきょうしつづけています。",
            "exampleEn": "He has continued studying Japanese for 10 years.",
            "exampleId": "Dia terus belajar bahasa Jepang selama 10 tahun."
          }
        ]
      },
      {
        "id": "v-owarimasu-hajimemasu",
        "pattern": "Vstem おわります / はじめます",
        "jlpt": "N4",
        "descEn": "Indicates the start or completion of an action ('finish doing / start doing').",
        "descId": "Selesai atau mulai melakukan suatu aktivitas.",
        "examples": [
          {
            "exampleJp": "この本を読み終わったら、貸してください。",
            "exampleKana": "このほんをよみおわったら、かしてください。",
            "exampleEn": "When you finish reading this book, please lend it to me.",
            "exampleId": "Jika sudah selesai membaca buku ini, tolong pinjamkan ke saya."
          },
          {
            "exampleJp": "赤ちゃんが急に泣き始めました。",
            "exampleKana": "あかちゃんがきゅうになきはじめました。",
            "exampleEn": "The baby suddenly started crying.",
            "exampleId": "Bayi itu mendadak mulai menangis."
          },
          {
            "exampleJp": "全員が書き終わるまで待ってください。",
            "exampleKana": "ぜんいんがかきおわるまでまってください。",
            "exampleEn": "Please wait until everyone finishes writing.",
            "exampleId": "Tolong tunggu sampai semuanya selesai menulis."
          }
        ]
      }
    ]
  },
  {
    "chapter": 21,
    "titleEn": "Appearances & Degree",
    "titleId": "Dugaan Visual, Tingkat Kemudahan & Berlebihan",
    "patterns": [
      {
        "id": "v-mitai-desu",
        "pattern": "普通形 みたいです",
        "jlpt": "N4",
        "descEn": "Expresses similitude or informal conjecture based on appearance ('looks like / resembles').",
        "descId": "Menyatakan kemiripan atau dugaan informal ('seperti / mirip').",
        "examples": [
          {
            "exampleJp": "あの雲はまるで泳いでいる魚みたいです。",
            "exampleKana": "あのくもはまるでおよいでいるさかなみたいです。",
            "exampleEn": "That cloud looks just like a swimming fish.",
            "exampleId": "Awan itu tampak persis seperti ikan yang berenang."
          },
          {
            "exampleJp": "彼はまるで日本人のように日本語がペラペラです。",
            "exampleKana": "かれはまるでにほんじんのようににほんごがぺらぺらです。",
            "exampleEn": "He speaks Japanese fluently just like a native Japanese person.",
            "exampleId": "Dia fasih bahasa Jepang seperti orang Jepang asli."
          },
          {
            "exampleJp": "隣の部屋でパーティーをやっているみたいです。",
            "exampleKana": "となりのへやでぱーてぃーをやっているみたいです。",
            "exampleEn": "It looks like they are having a party in the next room.",
            "exampleId": "Sepertinya kamar sebelah lagi pesta."
          }
        ]
      },
      {
        "id": "v-yasui-nikui",
        "pattern": "Vstem やすい / にくい",
        "jlpt": "N4",
        "descEn": "Indicates ease or difficulty of performing an action ('easy to / hard to').",
        "descId": "Tingkat kemudahan atau kesulitan melakukan sesuatu ('mudah / sulit').",
        "examples": [
          {
            "exampleJp": "このペンは軽くてとても書きやすいです。",
            "exampleKana": "このぺんはかるくてとてもかきやすいです。",
            "exampleEn": "This pen is light and very easy to write with.",
            "exampleId": "Pulpen ini ringan dan sangat mudah dipakai menulis."
          },
          {
            "exampleJp": "彼の説明は分かりにくいです。",
            "exampleKana": "かれのせつめいはわかりにくいです。",
            "exampleEn": "His explanation is difficult to understand.",
            "exampleId": "Penjelasannya sulit dipahami."
          },
          {
            "exampleJp": "この靴は滑りにくくて安全です。",
            "exampleKana": "このくつはすべりにくくてあんぜんです。",
            "exampleEn": "These shoes are slip-resistant and safe.",
            "exampleId": "Sepatu ini tidak mudah licin dan aman."
          }
        ]
      },
      {
        "id": "v-sugimasu",
        "pattern": "Vstem / A stem すぎます",
        "jlpt": "N4",
        "descEn": "Indicates excessiveness or going beyond limits ('too much / overly').",
        "descId": "Menyatakan tindakan atau kondisi yang berlebihan ('terlalu').",
        "examples": [
          {
            "exampleJp": "昨夜、お酒を飲みすぎました。",
            "exampleKana": "さくや、おさけをのみすぎました。",
            "exampleEn": "I drank too much alcohol last night.",
            "exampleId": "Semalam saya terlalu banyak minum alkohol."
          },
          {
            "exampleJp": "この部屋は狭すぎますから、引っ越したいです。",
            "exampleKana": "このへやはせますぎますから、ひっこしたいです。",
            "exampleEn": "This room is too small, so I want to move out.",
            "exampleId": "Kamar ini terlalu sempit, jadi saya ingin pindah."
          },
          {
            "exampleJp": "冗談を言いすぎて、彼を怒らせてしまいました。",
            "exampleKana": "じょうだんをいいすぎて、かれをおこらせてしまいました。",
            "exampleEn": "I made too many jokes and made him angry.",
            "exampleId": "Saya terlalu banyak bercanda sampai membuat dia marah."
          }
        ]
      },
      {
        "id": "v-soni-nai",
        "pattern": "Vstem そうにない",
        "jlpt": "N4",
        "descEn": "Indicates that something seems unlikely to happen ('does not look like it will').",
        "descId": "Tampaknya tidak akan terjadi (berdasarkan pengamatan saat ini).",
        "examples": [
          {
            "exampleJp": "雨は当分やみそうにありません。",
            "exampleKana": "あめはとうぶんやみそうにありません。",
            "exampleEn": "The rain doesn't look like it will stop anytime soon.",
            "exampleId": "Hujan kelihatannya tidak akan reda dalam waktu dekat."
          },
          {
            "exampleJp": "今日の仕事は時間内に終わりそうにないです。",
            "exampleKana": "きょうのしごとはじかん内におわりそうにないです。",
            "exampleEn": "Today's work doesn't seem like it will finish on time.",
            "exampleId": "Pekerjaan hari ini sepertinya tidak akan kelar tepat waktu."
          },
          {
            "exampleJp": "彼が約束を守りそうにないです。",
            "exampleKana": "かれがやくそくをまもりそうにないです。",
            "exampleEn": "It doesn't seem like he will keep his promise.",
            "exampleId": "Dia kelihatannya tidak akan menepati janji."
          }
        ]
      },
      {
        "id": "v-zurai",
        "pattern": "Vstem づらい",
        "jlpt": "N4",
        "descEn": "Indicates emotional or physical hardship/reluctance in doing an action.",
        "descId": "Sukar / enggan / sungkan dilakukan karena beban perasaan.",
        "examples": [
          {
            "exampleJp": "先輩には意見を言いづらいです。",
            "exampleKana": "せんぱいにはいけんをいいづらいです。",
            "exampleEn": "It is hard to express opinions to seniors.",
            "exampleId": "Sungkan untuk menyampaikan pendapat kepada senior."
          },
          {
            "exampleJp": "この部屋は暗くて本が読みづらいです。",
            "exampleKana": "このへやはくらくてもとがよみづらいです。",
            "exampleEn": "This room is dark, making it hard to read books.",
            "exampleId": "Kamar ini gelap sehingga susah membaca buku."
          },
          {
            "exampleJp": "傷が痛むので、歩きづらいです。",
            "exampleKana": "きずがいたむので、あるきづらいです。",
            "exampleEn": "Because the wound hurts, it is hard to walk.",
            "exampleId": "Karena lukanya sakit, jadi susah berjalan."
          }
        ]
      }
    ]
  },
  {
    "chapter": 22,
    "titleEn": "Experience & Obligations",
    "titleId": "Pengalaman, Kebiasaan & Keharusan",
    "patterns": [
      {
        "id": "v-ta-koto-ga-aru",
        "pattern": "Vた ことが あります",
        "jlpt": "N4",
        "descEn": "Indicates past experience ('have done something before').",
        "descId": "Menyatakan pengalaman di masa lalu ('pernah melakukan').",
        "examples": [
          {
            "exampleJp": "私は富士山に登ったことがあります。",
            "exampleKana": "わたしはふじさんにのぼったことがあります。",
            "exampleEn": "I have climbed Mt. Fuji before.",
            "exampleId": "Saya pernah mendaki Gunung Fuji."
          },
          {
            "exampleJp": "本場の歌舞伎を見たことがありますか。",
            "exampleKana": "ほんばのかぶきをみたことがありますか。",
            "exampleEn": "Have you ever watched authentic Kabuki?",
            "exampleId": "Apakah kamu pernah menonton pertunjukkan Kabuki?"
          },
          {
            "exampleJp": "納豆を食べたことがありません。",
            "exampleKana": "なっとうをたべたことがありません。",
            "exampleEn": "I have never eaten Natto before.",
            "exampleId": "Saya belum pernah makan Natto."
          }
        ]
      },
      {
        "id": "v-tari-v-tari-n4",
        "pattern": "Vたり Vたり します",
        "jlpt": "N4",
        "descEn": "Lists representative actions among others without chronological order.",
        "descId": "Menyebutkan contoh beberapa kegiatan tanpa urutan waktu.",
        "examples": [
          {
            "exampleJp": "休みの日は本を読んだり、音楽を聞いたりします。",
            "exampleKana": "やすみのひはほんをよんだり、おんがくをきいたりします。",
            "exampleEn": "On holidays, I do things like reading books and listening to music.",
            "exampleId": "Saat hari libur, saya melakukan kegiatan seperti membaca buku dan mendengarkan musik."
          },
          {
            "exampleJp": "昨日は買い物に行ったり、友達と会ったりしました。",
            "exampleKana": "きのうはかいものにいったり、ともだちとあったりしました。",
            "exampleEn": "Yesterday I did things like going shopping and meeting friends.",
            "exampleId": "Kemarin saya pergi belanja, bertemu teman, dan lain-lain."
          },
          {
            "exampleJp": "部屋の温度が上がったり下がったりしています。",
            "exampleKana": "へやのおんどがあがったりさがったりしています。",
            "exampleEn": "The room temperature keeps going up and down.",
            "exampleId": "Suhu ruangan naik turun terus."
          }
        ]
      },
      {
        "id": "v-nakereba-narimasen-n4",
        "pattern": "Vなければ なりません",
        "jlpt": "N4",
        "descEn": "Expresses necessity or obligation ('must / have to do').",
        "descId": "Menyatakan keharusan atau kewajiban ('harus melakukan').",
        "examples": [
          {
            "exampleJp": "明日、試験がありますから、勉強しなければなりません。",
            "exampleKana": "あした、しけんがありますから、べんきょうしなければなりません。",
            "exampleEn": "Since there is an exam tomorrow, I must study.",
            "exampleId": "Karena besok ada ujian, saya harus belajar."
          },
          {
            "exampleJp": "パスポートを更新しなければなりません。",
            "exampleKana": "ぱすぽーとをこうしんしなければなりません。",
            "exampleEn": "I must renew my passport.",
            "exampleId": "Saya harus memperpanjang paspor."
          },
          {
            "exampleJp": "時間通りにレポートを提出しなければなりません。",
            "exampleKana": "じかんどおりにれぽーとをていしゅつしなければなりません。",
            "exampleEn": "I must submit the report on time.",
            "exampleId": "Saya harus mengumpulkan laporan tepat waktu."
          }
        ]
      },
      {
        "id": "v-nakute-mo-ii-n4",
        "pattern": "Vなくても いいです",
        "jlpt": "N4",
        "descEn": "Indicates absence of obligation ('don't have to / optional').",
        "descId": "Menyatakan tidak adanya keharusan ('tidak perlu / tidak usah').",
        "examples": [
          {
            "exampleJp": "明日は日曜日ですから、早起きしなくてもいいです。",
            "exampleKana": "あしたはにちようびですから、はやおきしなくてもいいです。",
            "exampleEn": "Tomorrow is Sunday, so you don't have to wake up early.",
            "exampleId": "Besok hari Minggu, jadi tidak perlu bangun pagi."
          },
          {
            "exampleJp": "名前を漢字で書かなくてもいいです。",
            "exampleKana": "なまえをかんじでかかなくてもいいです。",
            "exampleEn": "You don't have to write your name in Kanji.",
            "exampleId": "Tidak usah menulis nama menggunakan Kanji."
          },
          {
            "exampleJp": "無理して全部食べなくてもいいですよ。",
            "exampleKana": "むりしてぜんぶたべなくてもいいですよ。",
            "exampleEn": "You don't have to force yourself to eat everything.",
            "exampleId": "Tidak perlu memaksakan diri menghabiskan semuanya."
          }
        ]
      },
      {
        "id": "v-naide-n4",
        "pattern": "Vないで",
        "jlpt": "N4",
        "descEn": "Indicates doing something without doing another action ('without doing').",
        "descId": "Melakukan suatu aksi tanpa melakukan tindakan lain sebelumnya.",
        "examples": [
          {
            "exampleJp": "朝ご飯を食べないで、会社へ行きました。",
            "exampleKana": "あさごはんをたべないで、かいしゃへいきました。",
            "exampleEn": "I went to work without eating breakfast.",
            "exampleId": "Saya pergi bekerja tanpa sarapan."
          },
          {
            "exampleJp": "辞書を使わないで、文章を訳しました。",
            "exampleKana": "じしょをつかわないで、ぶんしょうをやくしました。",
            "exampleEn": "I translated the text without using a dictionary.",
            "exampleId": "Saya menerjemahkan kalimat tanpa menggunakan kamus."
          },
          {
            "exampleJp": "傘を持たないで出かけたら、雨に降られました。",
            "exampleKana": "かさをもたないででかけたら、あめにふられました。",
            "exampleEn": "I went out without taking an umbrella and got rained on.",
            "exampleId": "Saya pergi tanpa membawa payung lalu kehujanan."
          }
        ]
      }
    ]
  },
  {
    "chapter": 23,
    "titleEn": "Reasons, Regret & Limits",
    "titleId": "Alasan Beruntun, Penyesalan & Batasan",
    "patterns": [
      {
        "id": "plain-shi-shi",
        "pattern": "普通形 し、～し",
        "jlpt": "N4",
        "descEn": "Lists multiple reasons ('not only... but also / furthermore').",
        "descId": "Menyebutkan beberapa alasan beruntun ('selain... juga...').",
        "examples": [
          {
            "exampleJp": "この店は美味しいし、安いし、いつも賑わっています。",
            "exampleKana": "このみせはおいしいし、やすいし、いつもにぎわっています。",
            "exampleEn": "This shop is delicious and cheap, so it's always crowded.",
            "exampleId": "Toko ini makanannya enak, murah lagi, makanya selalu ramai."
          },
          {
            "exampleJp": "雨も降っているし、体調も悪いし、今日は家から出ません。",
            "exampleKana": "あめもふっているし、たいちょうもわるいし、きょうはいえからでません。",
            "exampleEn": "It's raining and I feel unwell, so I won't leave home today.",
            "exampleId": "Sudah hujan, badan kurang sehat lagi, hari ini saya tidak keluar rumah."
          },
          {
            "exampleJp": "彼は優しいし、頭もいいし、みんなに人気があります。",
            "exampleKana": "かれはやさしいし、あたまもいいし、みんなににんきがあります。",
            "exampleEn": "He is kind and smart, so he is popular with everyone.",
            "exampleId": "Dia baik, pinter lagi, makanya populer di antara semua orang."
          }
        ]
      },
      {
        "id": "plain-node",
        "pattern": "普通形 ので",
        "jlpt": "N4",
        "descEn": "States objective reason or cause politely ('because / since').",
        "descId": "Menyatakan sebab/alasan secara objektif & sopan ('karena / sebab').",
        "examples": [
          {
            "exampleJp": "電車が遅れたので、会議に遅れました。",
            "exampleKana": "でんしゃがおくれたので、かいぎにおくれました。",
            "exampleEn": "Because the train was delayed, I was late for the meeting.",
            "exampleId": "Karena kereta terlambat, saya jadi terlambat rapat."
          },
          {
            "exampleJp": "気分が悪いので、お先に失礼します。",
            "exampleKana": "きぶんがわるいので、おさきにしつれいします。",
            "exampleEn": "Since I feel unwell, I will excuse myself early.",
            "exampleId": "Karena kurang enak badan, saya pamit lebih awal."
          },
          {
            "exampleJp": "危険ですので、この線より内側にお下がりください。",
            "exampleKana": "きけんですので、このせんよりうちがわにおさがりください。",
            "exampleEn": "Since it is dangerous, please stand behind this line.",
            "exampleId": "Karena berbahaya, mohon mundur di belakang garis ini."
          }
        ]
      },
      {
        "id": "plain-noni",
        "pattern": "普通形 のに",
        "jlpt": "N4",
        "descEn": "Expresses contradiction, surprise, or complaint ('even though / despite').",
        "descId": "Pertentangan atau kekecewaan ('padahal / meskipun').",
        "examples": [
          {
            "exampleJp": "一生懸命勉強したのに、不合格でした。",
            "exampleKana": "いっしょうけんめいべんきょうしたのに、ふごうかくでした。",
            "exampleEn": "Even though I studied hard, I failed.",
            "exampleId": "Padahal sudah belajar keras, tapi tidak lulus."
          },
          {
            "exampleJp": "約束したのに、彼は来ませんでした。",
            "exampleKana": "やくそくしたのに、かれはきませんでした。",
            "exampleEn": "Even though he promised, he didn't come.",
            "exampleId": "Padahal sudah berjanji, tapi dia tidak datang."
          },
          {
            "exampleJp": "薬を飲んだのに、熱が下がりません。",
            "exampleKana": "くすりをのんだのに、ねつがさがりません。",
            "exampleEn": "Even though I took medicine, the fever won't go down.",
            "exampleId": "Padahal sudah minum obat, tapi demam tidak turun."
          }
        ]
      },
      {
        "id": "dake-shika-nai",
        "pattern": "N だけ / N しか ～ない",
        "jlpt": "N4",
        "descEn": "Indicates limitation ('only / nothing except').",
        "descId": "Menunjukkan batasan ('hanya / tidak ada selain').",
        "examples": [
          {
            "exampleJp": "財布の中に100円しかありません。",
            "exampleKana": "さいふのなかになんひゃくえんしかありません。",
            "exampleEn": "There is only 100 yen in my wallet.",
            "exampleId": "Di dalam dompet hanya ada 100 yen."
          },
          {
            "exampleJp": "ひらがなだけ書くことができます。",
            "exampleKana": "ひらがなだけかくことができます。",
            "exampleEn": "I can only write Hiragana.",
            "exampleId": "Saya hanya bisa menulis Hiragana."
          },
          {
            "exampleJp": "クラスで田中さんしか合格しませんでした。",
            "exampleKana": "くらすであなかさんしかごうかくしませんでした。",
            "exampleEn": "No one except Tanaka-san passed in the class.",
            "exampleId": "Di kelas tidak ada yang lulus selain Pak Tanaka."
          }
        ]
      },
      {
        "id": "ni-tsuite",
        "pattern": "N に ついて",
        "jlpt": "N4",
        "descEn": "Indicates topic or subject matter ('about / regarding').",
        "descId": "Menunjukkan topik pembahasan ('mengenai / tentang').",
        "examples": [
          {
            "exampleJp": "日本の文化について調べたいです。",
            "exampleKana": "にほんのぶんかについてしらべたいです。",
            "exampleEn": "I want to research about Japanese culture.",
            "exampleId": "Saya ingin mencari tahu mengenai kebudayaan Jepang."
          },
          {
            "exampleJp": "この問題についてどう思いますか。",
            "exampleKana": "このもんだいについてどうおもいますか。",
            "exampleEn": "What do you think about this issue?",
            "exampleId": "Apa pendapatmu tentang masalah ini?"
          },
          {
            "exampleJp": "新プロジェクトについて話し合いましょう。",
            "exampleKana": "しんぷろじぇくとについてはなしあいましょう。",
            "exampleEn": "Let's discuss about the new project.",
            "exampleId": "Mari kita diskusikan tentang proyek baru."
          }
        ]
      }
    ]
  },
  {
    "chapter": 24,
    "titleEn": "Honorific Language (Keigo)",
    "titleId": "Bahasa Kehormatan (Keigo - Sonkeigo & Kenjougo)",
    "patterns": [
      {
        "id": "o-ni-narimasu",
        "pattern": "お Vstem に なります",
        "jlpt": "N4",
        "descEn": "Honorific form (Sonkeigo) to show respect to superiors' actions.",
        "descId": "Bentuk hormat (Sonkeigo) untuk menghormati tindakan atasan/orang lain.",
        "examples": [
          {
            "exampleJp": "社長はお帰りになりました。",
            "exampleKana": "しゃちょうはおかえりになりました。",
            "exampleEn": "The company president has returned home.",
            "exampleId": "Bapak Direktur sudah pulang."
          },
          {
            "exampleJp": "こちらの資料をお読みになりましたか。",
            "exampleKana": "こちらのしりょうをおよみになりましたか。",
            "exampleEn": "Have you read these documents?",
            "exampleId": "Apakah Bapak/Ibu sudah membaca dokumen ini?"
          },
          {
            "exampleJp": "少々お待ちいただけますか。",
            "exampleKana": "しょうしょうおまちいただけますか。",
            "exampleEn": "Could you please wait a moment?",
            "exampleId": "Bolehkah mohon menunggu sebentar?"
          }
        ]
      },
      {
        "id": "o-shimasu",
        "pattern": "お Vstem します / いたします",
        "jlpt": "N4",
        "descEn": "Humble form (Kenjougo) when speaking about one's own actions to superiors.",
        "descId": "Bentuk merendah diri (Kenjougo) saat menceritakan tindakan sendiri kepada atasan.",
        "examples": [
          {
            "exampleJp": "重い荷物をお持ちします。",
            "exampleKana": "おもいにもつをおもちします。",
            "exampleEn": "I will carry your heavy luggage.",
            "exampleId": "Saya akan bantu membawakan barang berat Anda."
          },
          {
            "exampleJp": "駅までお送りいたします。",
            "exampleKana": "えきまでおおくりいたします。",
            "exampleEn": "I will escort you to the station.",
            "exampleId": "Saya akan mengantar Anda sampai stasiun."
          },
          {
            "exampleJp": "後ほどご連絡いたします。",
            "exampleKana": "のちほどごれんらくいたします。",
            "exampleEn": "I will contact you later.",
            "exampleId": "Saya akan menghubungi Anda sebentar lagi."
          }
        ]
      },
      {
        "id": "sonkeigo-special",
        "pattern": "いらっしゃいます / おっしゃいます / ご覧になります",
        "jlpt": "N4",
        "descEn": "Special Sonkeigo verbs for 行く/来る/いる, 言う, 見る.",
        "descId": "Kata kerja khusus Sonkeigo untuk Pergi/Datang/Ada, Berkata, dan Melihat.",
        "examples": [
          {
            "exampleJp": "先生は明日どちらへいらっしゃいますか。",
            "exampleKana": "せんせいはあしたどちらへいらっしゃいますか。",
            "exampleEn": "Where will the teacher go tomorrow?",
            "exampleId": "Besok Bapak Guru akan pergi ke mana?"
          },
          {
            "exampleJp": "社長がそうおっしゃいました。",
            "exampleKana": "しゃちょうがそうおっしゃいました。",
            "exampleEn": "The company president said so.",
            "exampleId": "Bapak Direktur menyampaikan demikian."
          },
          {
            "exampleJp": "こちらの写真をご覧になりましたか。",
            "exampleKana": "こちらのしゃしんをごらんになりましたか。",
            "exampleEn": "Have you seen this photo?",
            "exampleId": "Apakah Bapak/Ibu sudah melihat foto ini?"
          }
        ]
      },
      {
        "id": "kenjougo-special",
        "pattern": "参ります / 申します / いたします / いただきます",
        "jlpt": "N4",
        "descEn": "Special Kenjougo verbs for 行く/来る, 言う, する, 食べる/飲む.",
        "descId": "Kata kerja khusus Kenjougo untuk Pergi/Datang, Berkata, Melakukan, dan Makan/Minum.",
        "examples": [
          {
            "exampleJp": "私、田中と申します。",
            "exampleKana": "わたし、たなかともうします。",
            "exampleEn": "My name is Tanaka.",
            "exampleId": "Nama saya Tanaka."
          },
          {
            "exampleJp": "明日10時に伺います。",
            "exampleKana": "あしたじゅうじにうかがいます。",
            "exampleEn": "I will visit tomorrow at 10:00.",
            "exampleId": "Besok jam 10 saya akan berkunjung."
          },
          {
            "exampleJp": "美味しくいただきました。",
            "exampleKana": "おいしくいただきました。",
            "exampleEn": "I enjoyed the meal.",
            "exampleId": "Saya telah menikmati santapannya."
          }
        ]
      },
      {
        "id": "de-gozaimasu",
        "pattern": "～で ございます",
        "jlpt": "N4",
        "descEn": "Polite form (Teineigo) of 'desu'.",
        "descId": "Bentuk sangat sopan (Teineigo) menggantikan 'desu'.",
        "examples": [
          {
            "exampleJp": "お電話ありがとうございます。ABC商事の田中と申します。",
            "exampleKana": "おでんわありがとうございます。えーびーしーしょうじのたなかともうします。",
            "exampleEn": "Thank you for calling. This is Tanaka from ABC Trading.",
            "exampleId": "Terima kasih telah menelepon. Ini Tanaka dari ABC Trading."
          },
          {
            "exampleJp": "お手洗いはあちらでございます。",
            "exampleKana": "おてあらいであちらでございます。",
            "exampleEn": "The restroom is over there.",
            "exampleId": "Toilet ada di sebelah sana."
          },
          {
            "exampleJp": "本日の営業は終了でございます。",
            "exampleKana": "ほんじつのえいぎょうはしゅうりょうでございます。",
            "exampleEn": "Business operations for today have finished.",
            "exampleId": "Jam operasional hari ini sudah selesai."
          }
        ]
      }
    ]
  },
  {
    "chapter": 25,
    "titleEn": "States & Preparation",
    "titleId": "Keadaan Lanjutan & Persiapan",
    "patterns": [
      {
        "id": "v-te-arimasu",
        "pattern": "Vて あります",
        "jlpt": "N4",
        "descEn": "Indicates a state resulting from a purposeful action ('has been done and remains so').",
        "descId": "Keadaan yang sengaja dilakukan dan masih bertahan sampai sekarang.",
        "examples": [
          {
            "exampleJp": "壁にカレンダーが貼ってあります。",
            "exampleKana": "かべにかれんだーがはってあります。",
            "exampleEn": "A calendar is posted on the wall.",
            "exampleId": "Kalender sudah sengaja ditempel di dinding."
          },
          {
            "exampleJp": "パーティーの準備はもうしてあります。",
            "exampleKana": "ぱーてぃーのじゅんびはもうしてあります。",
            "exampleEn": "Preparations for the party have already been done.",
            "exampleId": "Persiapan pesta sudah dilakukan."
          },
          {
            "exampleJp": "冷蔵庫にビールが冷やしてあります。",
            "exampleKana": "れいぞうこにびーるがひやしてあります。",
            "exampleEn": "Beer is chilled in the refrigerator.",
            "exampleId": "Bir sudah sengaja didinginkan di kulkas."
          }
        ]
      },
      {
        "id": "v-te-okimasu",
        "pattern": "Vて おきます",
        "jlpt": "N4",
        "descEn": "Indicates performing an action in advance for future convenience ('in advance / ahead of time').",
        "descId": "Melakukan tindakan terlebih dahulu untuk persiapan masa depan.",
        "examples": [
          {
            "exampleJp": "旅行の前に、ホテルの予約をしておきます。",
            "exampleKana": "りょこうのまえに、ほてるのよやくをしておきます。",
            "exampleEn": "Before the trip, I will make a hotel reservation in advance.",
            "exampleId": "Sebelum jalan-jalan, saya akan reservasi hotel terlebih dahulu."
          },
          {
            "exampleJp": "使ったハサミは元の場所に戻しておいてください。",
            "exampleKana": "つかったはさみはもとのばしょにもどしておいてください。",
            "exampleEn": "Please put the used scissors back in their original place.",
            "exampleId": "Gunting yang sudah dipakai tolong kembalikan ke tempat semula."
          },
          {
            "exampleJp": "お客様が来るので、部屋を掃除しておきました。",
            "exampleKana": "おきゃくさまがくるので、へやをそうじしておきました。",
            "exampleEn": "Because guests are coming, I cleaned the room in advance.",
            "exampleId": "Karena tamu mau datang, saya sudah bersihkan ruangan terlebih dahulu."
          }
        ]
      },
      {
        "id": "v-te-shimaimashita",
        "pattern": "Vて しまいました / しまう",
        "jlpt": "N4",
        "descEn": "Indicates completion of action or expression of regret/unintentional error ('completely / unfortunately').",
        "descId": "Selesai secara total atau penyesalan atas ketidaksengajaan.",
        "examples": [
          {
            "exampleJp": "大事な書類を家に忘れてしまいました。",
            "exampleKana": "だいじなしょるいをいえにわすれてしまいました。",
            "exampleEn": "Unfortunately, I forgot the important document at home.",
            "exampleId": "Sayang sekali, dokumen penting ketinggalan di rumah."
          },
          {
            "exampleJp": "宿題を全部やってしまいました。",
            "exampleKana": "しゅくだいをぜんぶやってしまいました。",
            "exampleEn": "I have completely finished all my homework.",
            "exampleId": "Saya sudah menyelesaikan seluruh PR secara tuntas."
          },
          {
            "exampleJp": "お気に入りのコップを割ってしまいました。",
            "exampleKana": "おきにいりのこっぷをわってしまいました。",
            "exampleEn": "I accidentally broke my favorite glass.",
            "exampleId": "Saya tidak sengaja memecahkan gelas kesayangan saya."
          }
        ]
      },
      {
        "id": "v-te-mimasu",
        "pattern": "Vて みます",
        "jlpt": "N4",
        "descEn": "Indicates trying something to see what it's like ('try doing').",
        "descId": "Mencoba melakukan sesuatu untuk melihat hasilnya.",
        "examples": [
          {
            "exampleJp": "新しいレストランの料理を食べてみます。",
            "exampleKana": "あたらしいれすとらんのりょうりをたべてみます。",
            "exampleEn": "I will try eating the food at the new restaurant.",
            "exampleId": "Saya akan mencoba makan hidangan di restoran baru."
          },
          {
            "exampleJp": "この服を着てみてもいいですか。",
            "exampleKana": "このふくをきてみてもいいですか。",
            "exampleEn": "May I try on these clothes?",
            "exampleId": "Bolehkah saya mencoba memakai baju ini?"
          },
          {
            "exampleJp": "難しそうですが、やってみます。",
            "exampleKana": "むずかしそうですが、やってみます。",
            "exampleEn": "It looks difficult, but I will try.",
            "exampleId": "Kelihatannya susah, tapi saya akan coba."
          }
        ]
      },
      {
        "id": "v-yasuku-shimasu",
        "pattern": "Vstem + やすく します",
        "jlpt": "N4",
        "descEn": "Indicates altering or adjusting something to make it easier to do.",
        "descId": "Mengubah atau menyesuaikan sesuatu agar lebih mudah dilakukan.",
        "examples": [
          {
            "exampleJp": "文字を大きくして、読みやすくします。",
            "exampleKana": "もじをおおきくして、よみやすくします。",
            "exampleEn": "I will enlarge the text to make it easier to read.",
            "exampleId": "Saya akan memperbesar tulisan agar lebih mudah dibaca."
          },
          {
            "exampleJp": "説明を簡潔にして、分かりやすくしました。",
            "exampleKana": "せつめいをかんけつにして、わかりやすくしました。",
            "exampleEn": "I made the explanation concise to make it easier to understand.",
            "exampleId": "Saya buat penjelasannya singkat agar lebih mudah dipahami."
          },
          {
            "exampleJp": "部屋を片付けて、住みやすくします。",
            "exampleKana": "へやをかたづけて、すみやすくします。",
            "exampleEn": "I will tidy up the room to make it more comfortable to live in.",
            "exampleId": "Saya merapikan kamar agar lebih nyaman ditinggali."
          }
        ]
      }
    ]
  },

  {
    "chapter": 26,
    "titleEn": "Time Intervals & Maintained States",
    "titleId": "Durasi, Jangka Waktu & Kondisi Tetap",
    "patterns": [
      {
        "id": "v-aida-aidani",
        "pattern": "V辞書形 / N の あいだ / あいだに",
        "jlpt": "N4",
        "descEn": "Indicates continuous action during a time period (あいだ) or an action happening at a specific moment within a period (あいだに).",
        "descId": "Menyatakan tindakan terus menerus sepanjang periode (あいだ) atau kejadian di sela-sela periode tertentu (あいだに).",
        "examples": [
          {
            "exampleJp": "夏休みのあいだ、ずっと祖父母の家にいました。",
            "exampleKana": "なつやすみのあいだ、ずっとそふぼのいえにいました。",
            "exampleEn": "During the summer vacation, I stayed at my grandparents' house the whole time.",
            "exampleId": "Selama liburan musim panas, saya terus berada di rumah kakek nenek."
          },
          {
            "exampleJp": "お母さんが寝ているあいだに、宿題を終わらせました。",
            "exampleKana": "おかあさんがねているあいだに、しゅくだいをおわらせました。",
            "exampleEn": "While my mother was sleeping, I finished my homework.",
            "exampleId": "Saat ibu sedang tidur, saya menyelesaikan PR."
          },
          {
            "exampleJp": "日本にいるあいだに、一度京都に行きたいです。",
            "exampleKana": "にほんにいるあいだに、いちどきょうとにいきたいです。",
            "exampleEn": "While I am in Japan, I want to visit Kyoto at least once.",
            "exampleId": "Mumpung / selagi berada di Jepang, saya ingin pergi ke Kyoto sekali."
          }
        ]
      },
      {
        "id": "v-mama",
        "pattern": "Vた / N の まま",
        "jlpt": "N4",
        "descEn": "Indicates doing something while leaving a state unchanged ('as it is / without changing').",
        "descId": "Melakukan tindakan lain dalam kondisi yang tetap / tanpa mengubah keadaan semula.",
        "examples": [
          {
            "exampleJp": "電気をつけたまま寝てしまいました。",
            "exampleKana": "でんきをつけたままねてしまいました。",
            "exampleEn": "I ended up sleeping with the light still on.",
            "exampleId": "Saya tertidur dalam keadaan lampu tetap menyala."
          },
          {
            "exampleJp": "靴のまま部屋に入らないでください。",
            "exampleKana": "くつのままへやにはいらないでください。",
            "exampleEn": "Please do not enter the room with your shoes on.",
            "exampleId": "Tolong jangan masuk kamar memakai sepatu."
          },
          {
            "exampleJp": "窓を開けたまま出かけてしまいました。",
            "exampleKana": "まどをあけたままでかけてしまいました。",
            "exampleEn": "I went out leaving the window open.",
            "exampleId": "Saya pergi dengan jendela tetap terbuka."
          }
        ]
      },
      {
        "id": "v-tabi-ni",
        "pattern": "V辞書形 / N の たび に",
        "jlpt": "N4",
        "descEn": "Indicates every time an action occurs, another action always happens ('every time / whenever').",
        "descId": "Setiap kali / tiap kali melakukan aksi ini, kejadian itu selalu terjadi.",
        "examples": [
          {
            "exampleJp": "この写真を見るたびに、楽しかった旅行を思いだします。",
            "exampleKana": "このしゃしんをみるたびに、たのしかったりょこうをおもいだします。",
            "exampleEn": "Every time I look at this photo, I remember the fun trip.",
            "exampleId": "Setiap kali melihat foto ini, saya teringat liburan yang menyenangkan."
          },
          {
            "exampleJp": "父は出張のたびに、お土産を買ってきてくれます。",
            "exampleKana": "ちちはしゅっちょうのたびに、おみやげをかってきてくれます。",
            "exampleEn": "Every time my father goes on a business trip, he buys me souvenirs.",
            "exampleId": "Tiap kali ayah dinas luar, dia selalu membelikan oleh-oleh."
          },
          {
            "exampleJp": "会うたびに、彼女は綺麗になります。",
            "exampleKana": "あうたびに、かのじょはきれいになります。",
            "exampleEn": "Every time I meet her, she gets prettier.",
            "exampleId": "Tiap kali bertemu, dia makin cantik."
          }
        ]
      },
      {
        "id": "v-tsuide-ni",
        "pattern": "Vた / V辞書形 / N の ついでに",
        "jlpt": "N4",
        "descEn": "Indicates taking advantage of an opportunity to do a secondary task ('while you're at it / on the way').",
        "descId": "Sekalian / mumpung sedang melakukan suatu hal, melakukan hal lain yang sejalan.",
        "examples": [
          {
            "exampleJp": "散歩のついでに、手紙を出してきました。",
            "exampleKana": "さんぽのついでに、てがみをだしてきました。",
            "exampleEn": "While out for a walk, I dropped off the letter.",
            "exampleId": "Sekalian jalan-jalan santai, saya sekalian poskan surat."
          },
          {
            "exampleJp": "コンビニへ行くなら、ついでにお茶を買ってきてください。",
            "exampleKana": "こんびにへいくなら、ついでにおちゃをかってきてください。",
            "exampleEn": "If you're going to the convenience store, please buy me green tea while you're at it.",
            "exampleId": "Kalau mau ke minimarket, sekalian belikan teh ya."
          },
          {
            "exampleJp": "買い物のついでに、図書館で本を返しました。",
            "exampleKana": "かいもののついでに、としょかんでほんをかえしました。",
            "exampleEn": "On my way shopping, I returned the book to the library.",
            "exampleId": "Mumpung lagi belanja, saya sekalian mengembalikan buku di perpustakaan."
          }
        ]
      },
      {
        "id": "v-kawarini",
        "pattern": "V辞書形 / N の かわりに",
        "jlpt": "N4",
        "descEn": "Indicates doing something instead of another or in compensation for ('in place of / instead of').",
        "descId": "Sebagai ganti / alih-alih melakukan hal tersebut atau menggantikan seseorang.",
        "examples": [
          {
            "exampleJp": "病気の先生のかわりに、新しい先生が来ました。",
            "exampleKana": "びょうきのせんせいのかわりに、あたらしいせんせいがきました。",
            "exampleEn": "Instead of the sick teacher, a new teacher came.",
            "exampleId": "Sebagai ganti guru yang sakit, datang guru baru."
          },
          {
            "exampleJp": "コーヒーのかわりに、紅茶を飲みます。",
            "exampleKana": "こーひーのかわりに、こうちゃをのみます。",
            "exampleEn": "I drink black tea instead of coffee.",
            "exampleId": "Saya minum teh hitam sebagai ganti kopi."
          },
          {
            "exampleJp": "英語を教えてもらうかわりに、日本語を教えてあげます。",
            "exampleKana": "えいごをおしえてもらうかわりに、にほんごをおしえてあげます。",
            "exampleEn": "In exchange for being taught English, I teach them Japanese.",
            "exampleId": "Sebagai balasan diajarkan bahasa Inggris, saya mengajarkan bahasa Jepang."
          }
        ]
      }
    ]
  },
  {
    "chapter": 27,
    "titleEn": "Rules, Decisions & Casual Nuances",
    "titleId": "Aturan, Keputusan & Ragam Bahasa",
    "patterns": [
      {
        "id": "koto-ni-nattte-iru",
        "pattern": "V辞書形 / Vない形 ことになっている",
        "jlpt": "N4",
        "descEn": "Indicates a rule, custom, or decision made by an external authority ('it is arranged that / rule says').",
        "descId": "Menyatakan aturan, norma, atau keputusan pihak luar yang harus dipatuhi.",
        "examples": [
          {
            "exampleJp": "この部屋では靴を脱ぐことになっています。",
            "exampleKana": "このへやではくつをぬぐことになっています。",
            "exampleEn": "It is a rule to take off shoes in this room.",
            "exampleId": "Di ruangan ini sudah menjadi aturan untuk melepas sepatu."
          },
          {
            "exampleJp": "来月から東京へ転勤することになりました。",
            "exampleKana": "らいげつからとうきょうへてんきんすることになりました。",
            "exampleEn": "It has been decided that I will transfer to Tokyo starting next month.",
            "exampleId": "Sudah diputuskan bahwa mulai bulan depan saya pindah tugas ke Tokyo."
          },
          {
            "exampleJp": "館内では写真をとってはいけないことになっています。",
            "exampleKana": "かんないではしゃしんをとってはいけないことになっています。",
            "exampleEn": "It is arranged that taking photos inside the building is prohibited.",
            "exampleId": "Di dalam gedung ada aturan tidak boleh mengambil foto."
          }
        ]
      },
      {
        "id": "koto-ni-suru",
        "pattern": "V辞書形 / Vない形 ことにする",
        "jlpt": "N4",
        "descEn": "Indicates a personal decision or determination ('decide to / make it a rule to').",
        "descId": "Keputusan pribadi yang diambil sendiri untuk melakukan/tidak melakukan sesuatu.",
        "examples": [
          {
            "exampleJp": "毎日30分ジョギングすることにしました。",
            "exampleKana": "まいにちさんじゅっぷんじょぎんぐすることにしました。",
            "exampleEn": "I decided to go jogging for 30 minutes every day.",
            "exampleId": "Saya memutuskan untuk jogging 30 menit setiap hari."
          },
          {
            "exampleJp": "健康のために、甘いものを食べないことにします。",
            "exampleKana": "けんこうのために、あまいものをたべないことにします。",
            "exampleEn": "For my health, I decided not to eat sweet things.",
            "exampleId": "Demi kesehatan, saya memutuskan untuk tidak makan makanan manis."
          },
          {
            "exampleJp": "今年の夏休みはどこへも行かないことにしました。",
            "exampleKana": "ことしのなつやすみはどこへもいかないことにしました。",
            "exampleEn": "I decided not to go anywhere during this summer vacation.",
            "exampleId": "Saya memutuskan libur musim panas tahun ini tidak pergi ke mana-mana."
          }
        ]
      },
      {
        "id": "v-zuni",
        "pattern": "Vない形 + ずに (する→せずに)",
        "jlpt": "N4",
        "descEn": "Indicates doing something without doing another action (written formal equivalent of ないで).",
        "descId": "Tanpa melakukan aksi tersebut (Bentuk bahasa tulisan / formal dari ないで).",
        "examples": [
          {
            "exampleJp": "昨夜は寝ずに勉強しました。",
            "exampleKana": "さくやはねずにべんきょうしました。",
            "exampleEn": "I studied last night without sleeping.",
            "exampleId": "Semalam saya belajar tanpa tidur."
          },
          {
            "exampleJp": "朝ご飯を食べずに学校へ来ました。",
            "exampleKana": "あさごはんをたべずにがっこうへきました。",
            "exampleEn": "I came to school without eating breakfast.",
            "exampleId": "Saya datang ke sekolah tanpa sarapan."
          },
          {
            "exampleJp": "あきらめずに最後まで頑張ってください。",
            "exampleKana": "あきらめずにさいごまでがんばってください。",
            "exampleEn": "Please do your best until the end without giving up.",
            "exampleId": "Tolong berjuanglah sampai akhir tanpa menyerah."
          }
        ]
      },
      {
        "id": "kke-particle",
        "pattern": "普通形 ＋ っけ",
        "jlpt": "N4",
        "descEn": "Casual sentence ending particle used to confirm something the speaker forgot ('was it...? / right?').",
        "descId": "Partikel kasual di akhir kalimat untuk mengonfirmasi ingatan yang lupa ('...kan ya?').",
        "examples": [
          {
            "exampleJp": "彼の誕生日はいつだっけ。",
            "exampleKana": "かれのたんじょうびはいつだっけ。",
            "exampleEn": "When was his birthday again?",
            "exampleId": "Ulang tahun dia kapan kan ya?"
          },
          {
            "exampleJp": "明日の会議は何時からだっけ。",
            "exampleKana": "あしたのかいぎはなんじからだっけ。",
            "exampleEn": "What time does tomorrow's meeting start again?",
            "exampleId": "Rapat besok mulai jam berapa kan ya?"
          },
          {
            "exampleJp": "田中さんって、納豆が嫌いだっけ。",
            "exampleKana": "たなかさんって、なっとうがきらいだっけ。",
            "exampleEn": "Does Tanaka-san dislike Natto again?",
            "exampleId": "Pak Tanaka itu benci Natto kan ya?"
          }
        ]
      },
      {
        "id": "kana-kashira",
        "pattern": "普通形 ＋ かな / かしら",
        "jlpt": "N4",
        "descEn": "Sentence ending particle indicating self-wondering or subtle question ('I wonder if...').",
        "descId": "Partikel di akhir kalimat untuk mementahkan gumaman / penasaran pada diri sendiri.",
        "examples": [
          {
            "exampleJp": "明日は晴れるかな。",
            "exampleKana": "あしたははれるかな。",
            "exampleEn": "I wonder if it will be sunny tomorrow.",
            "exampleId": "Apakah besok bakal cerah ya?"
          },
          {
            "exampleJp": "彼は無事に着いたかしら。",
            "exampleKana": "かれはぶじについたかしら。",
            "exampleEn": "I wonder if he arrived safely.",
            "exampleId": "Apakah dia sudah sampai dengan selamat ya?"
          },
          {
            "exampleJp": "この服、私に似合うかな。",
            "exampleKana": "このふく、わたしににあうかな。",
            "exampleEn": "I wonder if this dress suits me.",
            "exampleId": "Baju ini cocok untuk saya tidak ya?"
          }
        ]
      }
    ]
  },
  {
    "chapter": 28,
    "titleEn": "Basis, Comparison & Viewpoint",
    "titleId": "Berdasarkan, Perbandingan & Sudut Pandang",
    "patterns": [
      {
        "id": "ni-yoruto",
        "pattern": "N に よると / に よれば",
        "jlpt": "N4",
        "descEn": "Indicates source of news or information ('according to').",
        "descId": "Menunjukkan sumber informasi atau berita ('menurut / berdasarkan').",
        "examples": [
          {
            "exampleJp": "天気予報によると、明日は大雨になるそうです。",
            "exampleKana": "てんきよほうによると、あしたはおおあめになるそうです。",
            "exampleEn": "According to the weather forecast, it will rain heavily tomorrow.",
            "exampleId": "Menurut prakiraan cuaca, katanya besok akan turun hujan deras."
          },
          {
            "exampleJp": "ニュースによれば、事故の原因はまだ分かっていません。",
            "exampleKana": "にゅーすによれば、じこのげんいんはまだわかっていません。",
            "exampleEn": "According to the news, the cause of the accident is not yet known.",
            "exampleId": "Berdasarkan berita, penyebab kecelakaan belum diketahui."
          },
          {
            "exampleJp": "噂によると、あの店は近々閉店するらしいです。",
            "exampleKana": "うわさによると、あのみせはちかぢかへいてんするらしいです。",
            "exampleEn": "According to rumors, that shop seems to be closing down soon.",
            "exampleId": "Menurut rumor, toko itu sepertinya akan tutup dalam waktu dekat."
          }
        ]
      },
      {
        "id": "ni-yotte",
        "pattern": "N に よって / に より",
        "jlpt": "N4",
        "descEn": "Indicates means, cause, creator, or variation depending on cases ('by / depending on / due to').",
        "descId": "Oleh (pencipta/penemu), karena (sebab), atau tergantung pada variasi.",
        "examples": [
          {
            "exampleJp": "この電話はベルによって発明されました。",
            "exampleKana": "このでんわはべるによってはつめいされました。",
            "exampleEn": "This telephone was invented by Bell.",
            "exampleId": "Telepon ini ditemukan oleh Bell."
          },
          {
            "exampleJp": "人によって考え方が違います。",
            "exampleKana": "ひとによってかんがえかたがちがいます。",
            "exampleEn": "Ways of thinking differ depending on the person.",
            "exampleId": "Cara berpikir berbeda-beda tergantung orangnya."
          },
          {
            "exampleJp": "台風によって、多くの家が被害を受けました。",
            "exampleKana": "たいふうによって、おおくのいえがひがいをうけました。",
            "exampleEn": "Due to the typhoon, many houses suffered damage.",
            "exampleId": "Karena angin topan, banyak rumah mengalami kerusakan."
          }
        ]
      },
      {
        "id": "ni-totte",
        "pattern": "N に とって",
        "jlpt": "N4",
        "descEn": "Indicates evaluation or stance from the viewpoint of someone ('for / to / from the stance of').",
        "descId": "Bagi / menurut sudut pandang atau penilaian subjek tersebut.",
        "examples": [
          {
            "exampleJp": "私にとって、家族が番大切です。",
            "exampleKana": "わたしにとって、かぞくがいちばんたいせつです。",
            "exampleEn": "For me, family is the most important.",
            "exampleId": "Bagi saya, keluarga adalah yang paling penting."
          },
          {
            "exampleJp": "外国人にとって、日本語の漢字は難しいです。",
            "exampleKana": "がいこくじんにとって、にほんごのかんじはむずかしいです。",
            "exampleEn": "For foreigners, Japanese Kanji is difficult.",
            "exampleId": "Bagi orang asing, Kanji bahasa Jepang itu sulit."
          },
          {
            "exampleJp": "水は人間にとって不可欠なものです。",
            "exampleKana": "みずはにんげんにとってふかけつなものです。",
            "exampleEn": "Water is indispensable for human beings.",
            "exampleId": "Air adalah hal yang sangat krusial bagi manusia."
          }
        ]
      },
      {
        "id": "ni-kurabete",
        "pattern": "N に くらべて",
        "jlpt": "N4",
        "descEn": "Expresses comparison between two things ('compared to').",
        "descId": "Menyatakan perbandingan langsung dengan hal lain ('dibandingkan dengan').",
        "examples": [
          {
            "exampleJp": "去年のにくらべて、今年の夏はとても暑いです。",
            "exampleKana": "きょねんのにくらべて、ことしのなつはとてもあついです。",
            "exampleEn": "Compared to last year, this summer is very hot.",
            "exampleId": "Dibandingkan tahun lalu, musim panas tahun ini sangat panas."
          },
          {
            "exampleJp": "東京にくらべて、私の田舎は空気が綺麗です。",
            "exampleKana": "とうきょうにくらべて、わたしのいなかはくうきがきれいです。",
            "exampleEn": "Compared to Tokyo, the air in my hometown is clean.",
            "exampleId": "Dibandingkan dengan Tokyo, udara di kampung halaman saya bersih."
          },
          {
            "exampleJp": "姉にくらべて、妹はおとなしい性格です。",
            "exampleKana": "あねにくらべて、いもうとはおとなしいせいかくです。",
            "exampleEn": "Compared to the older sister, the younger sister has a quiet personality.",
            "exampleId": "Dibandingkan kakak perempuannya, adiknya berkepribadian pendiam."
          }
        ]
      },
      {
        "id": "nanka-nado",
        "pattern": "N なんか / など",
        "jlpt": "N4",
        "descEn": "Indicates exemplification or modest light evaluation ('things like / for instance').",
        "descId": "Menunjukkan contoh ringan atau merendah ('hal seperti / semacam').",
        "examples": [
          {
            "exampleJp": "休日は映画なんかを見て過ごします。",
            "exampleKana": "きゅうじつはえいがなんかをみてすごします。",
            "exampleEn": "On holidays, I spend time watching things like movies.",
            "exampleId": "Saat libur, saya menghabiskan waktu menonton hal seperti film."
          },
          {
            "exampleJp": "私なんか、まだまだ勉強が足りません。",
            "exampleKana": "わたしなんか、まだまだべんきょうがたりません。",
            "exampleEn": "Someone like me still has a lot to study.",
            "exampleId": "Orang seperti saya ini masih sangat kurang belajarnya."
          },
          {
            "exampleJp": "お茶などはいかがですか。",
            "exampleKana": "おちゃなどはいかがですか。",
            "exampleEn": "How about something like tea?",
            "exampleId": "Bagaimana kalau minum sejenis teh?"
          }
        ]
      }
    ]
  },
  {
    "chapter": 29,
    "titleEn": "Action Moments & Metaphors",
    "titleId": "Usaha Momen, Perubahan Mendadak & Kiasan",
    "patterns": [
      {
        "id": "v-yoto-suru",
        "pattern": "V意向形 と する / と しない",
        "jlpt": "N4",
        "descEn": "Indicates being just about to do something (とする) or refusing to try doing something (としない).",
        "descId": "Hampir / baru mau melakukan sesuatu (とする) atau tidak mau berusaha sama sekali (としない).",
        "examples": [
          {
            "exampleJp": "出かけようとした時、電話が鳴りました。",
            "exampleKana": "でかけようとしたとき、でんわがなりました。",
            "exampleEn": "Just as I was about to go out, the phone rang.",
            "exampleId": "Pas baru mau pergi keluar, telepon berdering."
          },
          {
            "exampleJp": "電車に乗ろうとしたら、ドアが閉まってしまいました。",
            "exampleKana": "でんしゃにのろうとしたら、どあがしまってしまいました。",
            "exampleEn": "When I tried to get on the train, the door closed.",
            "exampleId": "Ketika mencoba naik kereta, pintunya keburu tutup."
          },
          {
            "exampleJp": "彼は自分の間違いを認めようとしません。",
            "exampleKana": "かれはじぶんのまちがいをみとめようとしません。",
            "exampleEn": "He makes no attempt to admit his mistake.",
            "exampleId": "Dia tidak mau sama sekali mengakui kesalahannya."
          }
        ]
      },
      {
        "id": "v-dasu",
        "pattern": "Vstem 出す (だす)",
        "jlpt": "N4",
        "descEn": "Indicates sudden initiation of an action ('suddenly burst into / start').",
        "descId": "Mendadak mulai melakukan suatu aksi secara tiba-tiba.",
        "examples": [
          {
            "exampleJp": "さっきまで笑っていた赤ちゃんが、突然泣き出しました。",
            "exampleKana": "さっきまでわらっていたあかちゃんが、とつぜんなきだしました。",
            "exampleEn": "The baby who was laughing until a moment ago suddenly burst out crying.",
            "exampleId": "Bayi yang tadi tertawa mendadak mulai menangis."
          },
          {
            "exampleJp": "急に強い雨が降り出しました。",
            "exampleKana": "きゅうにつよいあめがふりだしました。",
            "exampleEn": "Heavy rain suddenly started falling.",
            "exampleId": "Tiba-tiba hujan deras mulai turun."
          },
          {
            "exampleJp": "彼らは喧嘩を走り出しました。",
            "exampleKana": "かれらはけんかをはしりだしました。",
            "exampleEn": "They suddenly started running.",
            "exampleId": "Mereka mendadak mulai berlari."
          }
        ]
      },
      {
        "id": "ikura-temo",
        "pattern": "いくら / どんなに ～ても",
        "jlpt": "N4",
        "descEn": "Indicates strong concession regardless of degree ('no matter how much').",
        "descId": "Betapapun / berapapun usahanya, hasilnya tidak berubah ('seberapa pun').",
        "examples": [
          {
            "exampleJp": "いくら安くても、要らないものは買いません。",
            "exampleKana": "いくらやすくても、いらないものはかいません。",
            "exampleEn": "No matter how cheap it is, I won't buy things I don't need.",
            "exampleId": "Seberapa murah pun itu, saya tidak beli barang yang tidak perlu."
          },
          {
            "exampleJp": "どんなに大変でも、夢を諦めません。",
            "exampleKana": "どんなにたいへんでも、ゆめをあきらめません。",
            "exampleEn": "No matter how hard it is, I won't give up on my dream.",
            "exampleId": "Betapapun beratnya, saya tidak akan menyerah pada impian."
          },
          {
            "exampleJp": "いくら考えても、答えが分かりません。",
            "exampleKana": "いくらかんがえても、こたえがわかりません。",
            "exampleEn": "No matter how much I think, I can't figure out the answer.",
            "exampleId": "Seberapa lama pun saya pikirkan, saya tidak tahu jawabannya."
          }
        ]
      },
      {
        "id": "marude-yoda",
        "pattern": "まるで N の ようだ / みたいだ",
        "jlpt": "N4",
        "descEn": "Expresses vivid figurative comparison or metaphor ('just like / as if').",
        "descId": "Kiasan atau metafora yang sangat mirip ('bagaikan / seolah-olah').",
        "examples": [
          {
            "exampleJp": "今日は春なのに、まるで冬のように寒いです。",
            "exampleKana": "きょうははるなのに、まるでふゆのようにさむいです。",
            "exampleEn": "Although it is spring today, it is cold just like winter.",
            "exampleId": "Padahal hari ini musim semi, tapi dinginnya bagaikan musim dingin."
          },
          {
            "exampleJp": "彼女の肌はまるで雪のように白いです。",
            "exampleKana": "かのじょのはだはまるでゆきのようにしろいです。",
            "exampleEn": "Her skin is white just like snow.",
            "exampleId": "Kulitnya putih bagaikan salju."
          },
          {
            "exampleJp": "まるで夢を見ているようです。",
            "exampleKana": "まるでゆめをみているようです。",
            "exampleEn": "It is just like dreaming.",
            "exampleId": "Rasanya seperti sedang bermimpi."
          }
        ]
      },
      {
        "id": "to-iu-koto-wa",
        "pattern": "～という ことは / というのは",
        "jlpt": "N4",
        "descEn": "Used to explain the meaning or logical conclusion of something ('which means that...').",
        "descId": "Menjelaskan arti kata atau kesimpulan logis ('berarti / maksudnya adalah').",
        "examples": [
          {
            "exampleJp": "彼が来ないということは、約束を忘れたということです。",
            "exampleKana": "かれがこないということは、やくそくをわすれたということです。",
            "exampleEn": "That he hasn't come means that he forgot the appointment.",
            "exampleId": "Bahwa dia tidak datang berarti dia lupa janji."
          },
          {
            "exampleJp": "「禁煙」というのは、タバコを吸ってはいけないということです。",
            "exampleKana": "「きんえん」というのは、たばこをすってはいけないということです。",
            "exampleEn": "'Kin-en' means that you must not smoke tobacco.",
            "exampleId": "'Kin-en' itu maksudnya adalah tidak boleh merokok."
          },
          {
            "exampleJp": "電気はついている。ということは、誰か部屋にいるはずだ。",
            "exampleKana": "でんきはついている。ということは、だれかへやにいるはずだ。",
            "exampleEn": "The light is on. Which means someone should be in the room.",
            "exampleId": "Lampu menyala. Berarti seharusnya ada orang di dalam kamar."
          }
        ]
      }
    ]
  },
  {
    "chapter": 30,
    "titleEn": "Polite Requests, Correlation & Wishes",
    "titleId": "Permohonan Izin Sopan, Korelasi & Doa",
    "patterns": [
      {
        "id": "v-sasete-itadakemasenka",
        "pattern": "V使役て いただけませんか / くれませんか",
        "jlpt": "N4",
        "descEn": "Extremely polite request asking for permission to allow the speaker to do an action ('would you please allow me to...?').",
        "descId": "Permohonan izin sangat sopan meminta agar pembicara diperbolehkan melakukan sesuatu.",
        "examples": [
          {
            "exampleJp": "体調が悪いので、早退させていただけませんか。",
            "exampleKana": "たいちょうがわるいので、そうたいさせていただけませんか。",
            "exampleEn": "Since I feel unwell, could you please allow me to leave early?",
            "exampleId": "Karena kurang sehat, bolehkah saya minta izin pulang lebih awal?"
          },
          {
            "exampleJp": "この資料をコピーさせていただけませんか。",
            "exampleKana": "このしりょうをこぴーさせていただけませんか。",
            "exampleEn": "Could you please let me make a copy of this document?",
            "exampleId": "Bolehkah saya diperkenankan mengopi dokumen ini?"
          },
          {
            "exampleJp": "少し考えさせてくれませんか。",
            "exampleKana": "すこしかんがえさせてくれませんか。",
            "exampleEn": "Could you please let me think for a moment?",
            "exampleId": "Bisakah beri saya waktu sebentar untuk berpikir?"
          }
        ]
      },
      {
        "id": "v-ba-hodo",
        "pattern": "Vば V辞書形 ほど / Aければ Aい ほど",
        "jlpt": "N4",
        "descEn": "Indicates proportional correlation between two states ('the more..., the more...').",
        "descId": "Menyatakan korelasi sebanding ('semakin... semakin...').",
        "examples": [
          {
            "exampleJp": "日本語は勉強すればするほど難しくなりますが、面白いです。",
            "exampleKana": "にほんごはべんきょうすればするほどむずかしくなりますが、おもしろいです。",
            "exampleEn": "The more you study Japanese, the harder it gets, but it is interesting.",
            "exampleId": "Bahasa Jepang semakin dipelajari semakin susah, tapi menarik."
          },
          {
            "exampleJp": "早ければ早いほどいいです。",
            "exampleKana": "はやければはやいほどいいです。",
            "exampleEn": "The sooner, the better.",
            "exampleId": "Semakin cepat semakin baik."
          },
          {
            "exampleJp": "この本は読めば読むほど味がでます。",
            "exampleKana": "このほんはよめばよむほどあじがでます。",
            "exampleEn": "The more you read this book, the more meaningful it becomes.",
            "exampleId": "Buku ini semakin dibaca semakin terasa maknanya."
          }
        ]
      },
      {
        "id": "v-te-hajimete",
        "pattern": "Vて はじめて",
        "jlpt": "N4",
        "descEn": "Indicates realizing something only after experiencing an action for the first time ('only after doing V did I realize').",
        "descId": "Baru setelah mengalami/melakukan hal itu, seseorang pertama kali menyadari.",
        "examples": [
          {
            "exampleJp": "病気になってはじめて、健康の難しさを知りました。",
            "exampleKana": "びょうきになってはじめて、けんこうのむずかしさをしりました。",
            "exampleEn": "Only after becoming sick did I realize the value of health.",
            "exampleId": "Baru setelah jatuh sakit, saya menyadari berharganya kesehatan."
          },
          {
            "exampleJp": "日本へ行ってはじめて、本物の歌舞伎を見ました。",
            "exampleKana": "にほんへいってはじめて、ほんもののかぶきをみました。",
            "exampleEn": "Only after going to Japan did I watch real Kabuki for the first time.",
            "exampleId": "Baru setelah pergi ke Jepang, saya pertama kali nonton Kabuki asli."
          },
          {
            "exampleJp": "自分で一人暮らしをしてはじめて、親のありがたみが分かりました。",
            "exampleKana": "じぶんでひとりぐらしをしてはじめて、おやのありがたみがわかりました。",
            "exampleEn": "Only after living alone did I understand my parents' gratitude.",
            "exampleId": "Baru setelah tinggal sendiri, saya memahami kebaikan orang tua."
          }
        ]
      },
      {
        "id": "v-kata",
        "pattern": "Vstem ＋ 方 (かた)",
        "jlpt": "N4",
        "descEn": "Indicates method or way of doing an action ('way of / how to').",
        "descId": "Cara atau metode melakukan suatu pekerjaan.",
        "examples": [
          {
            "exampleJp": "このパソコンの使い方を教えてください。",
            "exampleKana": "このぱそこんのつかいかたをおしえてください。",
            "exampleEn": "Please teach me how to use this computer.",
            "exampleId": "Tolong ajari saya cara memakai laptop ini."
          },
          {
            "exampleJp": "漢字の書き方を練習しています。",
            "exampleKana": "かんじのかきかたをれんしゅうしています。",
            "exampleEn": "I am practicing how to write Kanji.",
            "exampleId": "Saya sedang latihan cara menulis Kanji."
          },
          {
            "exampleJp": "美味しいお寿司の作り方を知りたいです。",
            "exampleKana": "おいしいおすしのつくりかたをしりたいです。",
            "exampleEn": "I want to know how to make delicious sushi.",
            "exampleId": "Saya ingin tahu cara membuat sushi yang enak."
          }
        ]
      },
      {
        "id": "v-to-iitara-ii",
        "pattern": "普通形 といい / たらいい / といいですね",
        "jlpt": "N4",
        "descEn": "Expresses hopes, wishes for oneself or others ('I hope that / it would be good if').",
        "descId": "Mendoakan atau berharap agar sesuatu berjalan baik ('semoga / alangkah baiknya jika').",
        "examples": [
          {
            "exampleJp": "明日は晴れるといいですね。",
            "exampleKana": "あしたははれるといいですね。",
            "exampleEn": "I hope it will be sunny tomorrow.",
            "exampleId": "Semoga besok cerah ya."
          },
          {
            "exampleJp": "試験に合格できるといいですね。",
            "exampleKana": "しけんにごうかくできるといいですね。",
            "exampleEn": "I hope you can pass the exam.",
            "exampleId": "Semoga bisa lulus ujian ya."
          },
          {
            "exampleJp": "早く風邪が治るといいですね。",
            "exampleKana": "はやくかぜがなおるといいですね。",
            "exampleEn": "I hope your cold gets better soon.",
            "exampleId": "Semoga flu-nya cepat sembuh ya."
          }
        ]
      }
    ]
  }

];
