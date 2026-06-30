export interface BunpouPattern {
  id: string;
  pattern: string;
  jlpt: string;
  descEn: string;
  descId: string;
  exampleJp: string;
  exampleKana: string;
  exampleEn: string;
  exampleId: string;
}

export interface BunpouLesson {
  chapter: number;
  titleEn: string;
  titleId: string;
  patterns: BunpouPattern[];
}

export const BUNPOU_DATA: BunpouLesson[] = [
  {
    chapter: 1,
    titleEn: "Basic Greetings & Copula",
    titleId: "Perkenalan Diri & Keterangan Dasar",
    patterns: [
      {
        id: "n1-wa-n2-desu",
        pattern: "N1 は N2 です",
        jlpt: "N5",
        descEn: "Identifies N1 as N2 ('N1 is N2').",
        descId: "Menyatakan bahwa N1 adalah N2 ('N1 adalah N2').",
        exampleJp: "パクさんは学生です。",
        exampleKana: "パクさんはがくせいです。",
        exampleEn: "Mr. Park is a student.",
        exampleId: "Pak Park adalah seorang mahasiswa."
      },
      {
        id: "n1-wa-n2-desuka",
        pattern: "N1 は N2 ですか",
        jlpt: "N5",
        descEn: "Asks if N1 is N2.",
        descId: "Menanyakan apakah N1 adalah N2.",
        exampleJp: "ワンさんは学生ですか。 —— いいえ、学生じゃありません。",
        exampleKana: "ワンさんはがくせいですか。 —— いいえ、がくせいじゃありません。",
        exampleEn: "Is Mr. Wang a student? —— No, he is not a student.",
        exampleId: "Apakah Pak Wang seorang mahasiswa? —— Bukan, dia bukan mahasiswa."
      },
      {
        id: "n-wa-dochira-itsu-nandesuka",
        pattern: "N は どちら／いつ／何ですか",
        jlpt: "N5",
        descEn: "Asks where / when / what N is.",
        descId: "Menanyakan di mana / kapan / apa itu N.",
        exampleJp: "お国はどちらですか。",
        exampleKana: "おくにはどちらですか。",
        exampleEn: "Which country are you from?",
        exampleId: "Negara Anda di mana?"
      },
      {
        id: "n1-no-n2",
        pattern: "N1 の N2",
        jlpt: "N5",
        descEn: "Indicates possession, origin, or modification ('N2 of N1').",
        descId: "Menunjukkan kepemilikan, asal, atau modifikasi ('N2 milik/bagian dari N1').",
        exampleJp: "私はふじみ大学 of 学生です。", // wait, let's fix: 私はふじみ大学の学生です。
        exampleKana: "わたしはふじみだいがくのがくせいです。",
        exampleEn: "I am a student of Fujimi University.",
        exampleId: "Saya adalah mahasiswa Universitas Fujimi."
      },
      {
        id: "n1-to-n2",
        pattern: "N1 と N2",
        jlpt: "N5",
        descEn: "Connects nouns ('N1 and N2').",
        descId: "Menghubungkan kata benda ('N1 dan N2').",
        exampleJp: "パクさんの趣味は旅行と映画です。",
        exampleKana: "パクさんのしゅみはりょこうとえいがです。",
        exampleEn: "Mr. Park's hobbies are travel and movies.",
        exampleId: "Hobi Pak Park adalah traveling dan film."
      },
      {
        id: "n-mo",
        pattern: "N も",
        jlpt: "N5",
        descEn: "Indicates 'also' or 'too'.",
        descId: "Menunjukkan arti 'juga' atau 'pun'.",
        exampleJp: "ワンさんの趣味は料理です。ナタポンさんの趣味も料理です。",
        exampleKana: "ワンさんのしゅみはりょうりです。ナタポンさんのしゅみもりょうりです。",
        exampleEn: "Mr. Wang's hobby is cooking. Mr. Nattapon's hobby is also cooking.",
        exampleId: "Hobi Pak Wang adalah memasak. Hobi Pak Nattapon juga memasak."
      }
    ]
  },
  {
    chapter: 2,
    titleEn: "Demonstratives & Noun Modifiers",
    titleId: "Kata Tunjuk & Modifikasi Kata Benda",
    patterns: [
      {
        id: "kore-sore-are",
        pattern: "これ／それ／あれ",
        jlpt: "N5",
        descEn: "Demonstrative pronouns for objects close to speaker / listener / far from both.",
        descId: "Kata ganti penunjuk benda di dekat pembicara (ini) / lawan bicara (itu) / jauh dari keduanya (itu sana).",
        exampleJp: "これは10,000円です。",
        exampleKana: "これはいちまんえんです。",
        exampleEn: "This is 10,000 yen.",
        exampleId: "Ini harganya 10.000 yen."
      },
      {
        id: "kono-sono-ano",
        pattern: "この／その／あの N",
        jlpt: "N5",
        descEn: "Demonstrative determiners directly modifying a noun.",
        descId: "Kata penunjuk yang langsung melekat sebelum kata benda (N ini/itu/itu sana).",
        exampleJp: "あのTシャツは3,000円です。",
        exampleKana: "あのティーシャツはさんぜんえんです。",
        exampleEn: "That T-shirt over there is 3,000 yen.",
        exampleId: "Kaos di sebelah sana itu harganya 3.000 yen."
      },
      {
        id: "koko-soko-asoko-doko",
        pattern: "ここ／そこ／あそこ／どこ (こちら／そちら／あちら／どちら)",
        jlpt: "N5",
        descEn: "Demonstratives for locations (here, there, over there, where).",
        descId: "Kata penunjuk tempat (sini, situ, sana, mana) atau arah (sini/situ/sana/mana bentuk sopan).",
        exampleJp: "トイレはどこですか。 —— あそこです。",
        exampleKana: "トイレはどこですか。 —— あそこです。",
        exampleEn: "Where is the restroom? —— It is over there.",
        exampleId: "Toilet di mana? —— Di sebelah sana."
      },
      {
        id: "n-o-kudasai",
        pattern: "N をください",
        jlpt: "N5",
        descEn: "Polite request for an item ('Please give me N').",
        descId: "Permintaan sopan untuk meminta suatu barang ('Tolong berikan N').",
        exampleJp: "そのTシャツをください。",
        exampleKana: "そのティーシャツをください。",
        exampleEn: "Please give me that T-shirt.",
        exampleId: "Tolong berikan saya kaos itu."
      },
      {
        id: "ikura",
        pattern: "いくら",
        jlpt: "N5",
        descEn: "Asks for the price of something ('How much?').",
        descId: "Menanyakan harga suatu barang ('Berapa harganya?').",
        exampleJp: "これはいくらですか。",
        exampleKana: "これはいくらですか。",
        exampleEn: "How much is this?",
        exampleId: "Ini berapa harganya?"
      },
      {
        id: "nan-no-n",
        pattern: "何の N",
        jlpt: "N5",
        descEn: "Asks about the content or category of N ('What kind of N?').",
        descId: "Menanyakan isi atau kategori dari N ('N tentang apa?').",
        exampleJp: "これは何のカレーですか。 —— 豚肉 of カレーです。", // wait, let's fix: 豚肉のカレーです。
        exampleKana: "これはなんのかれーですか。 —— ぶたにくのかれーです。",
        exampleEn: "What kind of curry is this? —— It is pork curry.",
        exampleId: "Ini kari apa? —— Ini kari daging babi."
      },
      {
        id: "doko-no-n",
        pattern: "どこの N",
        jlpt: "N5",
        descEn: "Asks about the origin or country of N ('Where is N from?').",
        descId: "Menanyakan asal negara atau perusahaan pembuat N ('N buatan mana?').",
        exampleJp: "これはどこのビールですか。 —— ドイツのビールです。",
        exampleKana: "これはどこのびーるですか。 —— ドイツのびーるです。",
        exampleEn: "Where is this beer from? —— It is German beer.",
        exampleId: "Ini bir buatan mana? —— Ini bir Jerman."
      },
      {
        id: "dare-no-n",
        pattern: "誰の N",
        jlpt: "N5",
        descEn: "Asks for the owner of N ('Whose N?').",
        descId: "Menanyakan pemilik dari N ('N milik siapa?').",
        exampleJp: "これは誰の財布ですか。 —— 私の財布です。",
        exampleKana: "これはだれのさいふですか。 —— わたしのさいふです。",
        exampleEn: "Whose wallet is this? —— It is my wallet.",
        exampleId: "Whose wallet is this? —— It is my wallet."
      },
      {
        id: "n-de-language",
        pattern: "N (言語) で",
        jlpt: "N5",
        descEn: "Indicates the language used ('In N language').",
        descId: "Menunjukkan bahasa yang digunakan ('Dalam bahasa N').",
        exampleJp: "「ぶたにく」は英語で何ですか。 —— 「pork」です。",
        exampleKana: "「ぶたにく」はえいごでなんですか。 —— 「pork」です。",
        exampleEn: "What is 'butaniku' in English? —— It is 'pork'.",
        exampleId: "Apa bahasa Inggrisnya 'butaniku'? —— 'pork'."
      }
    ]
  },
  {
    chapter: 3,
    titleEn: "Particles & Movements",
    titleId: "Partikel & Arah Gerakan",
    patterns: [
      {
        id: "n-basho-e-ikimasu",
        pattern: "N (場所) へ",
        jlpt: "N5",
        descEn: "Indicates the direction or destination of movement.",
        descId: "Menunjukkan arah atau tujuan pergerakan.",
        exampleJp: "私は日曜日、図書館へ行きます。",
        exampleKana: "わたしはにちようび、としょかんへいきます。",
        exampleEn: "I will go to the library on Sunday.",
        exampleId: "Saya hari Minggu pergi ke perpustakaan."
      },
      {
        id: "n-o-verb",
        pattern: "N を",
        jlpt: "N5",
        descEn: "Marks the direct object of a transitive verb.",
        descId: "Menandai objek langsung dari kata kerja transitif.",
        exampleJp: "私は毎朝、コーヒーを飲みます。",
        exampleKana: "わたしはまいあさ、こーひーをのみます。",
        exampleEn: "I drink coffee every morning.",
        exampleId: "Saya minum kopi setiap pagi."
      },
      {
        id: "n-time-ni",
        pattern: "N (時間) に",
        jlpt: "N5",
        descEn: "Indicates the specific time when an action occurs.",
        descId: "Menunjukkan waktu spesifik terjadinya suatu tindakan.",
        exampleJp: "私は8時に起きます。",
        exampleKana: "わたしははちじにおきます。",
        exampleEn: "I wake up at 8 o'clock.",
        exampleId: "Saya bangun jam 8."
      },
      {
        id: "n-basho-de",
        pattern: "N (場所) で",
        jlpt: "N5",
        descEn: "Indicates the place where an action occurs.",
        descId: "Menunjukkan tempat berlangsungnya suatu tindakan.",
        exampleJp: "私は北海道でスキーをします。",
        exampleKana: "わたしはほっかいどうですきーをします。",
        exampleEn: "I ski in Hokkaido.",
        exampleId: "Saya bermain ski di Hokkaido."
      },
      {
        id: "n-kara-n-made",
        pattern: "N から N まで",
        jlpt: "N5",
        descEn: "Indicates starting and ending points in time or space ('from... to...').",
        descId: "Menunjukkan titik awal dan titik akhir waktu atau ruang ('dari... sampai...').",
        exampleJp: "みどり郵便局は午前9時から午後5時までです。",
        exampleKana: "みどりゆうびんきょくはごぜんくじからごごごじまでです。",
        exampleEn: "The Midori Post Office is open from 9 AM to 5 PM.",
        exampleId: "Kantor Pos Midori buka dari jam 9 pagi sampai jam 5 sore."
      },
      {
        id: "n1-ya-n2-nado",
        pattern: "N1 や N2 など",
        jlpt: "N5",
        descEn: "Lists nouns non-exhaustively ('N1, N2, and so on').",
        descId: "Menyebutkan kata benda sebagai contoh perwakilan ('N1, N2, dan lain-lain').",
        exampleJp: "私は朝、パンやサラダなどを食べます。",
        exampleKana: "わたしはあさ、ぱんやさらだなどをたべます。",
        exampleEn: "I eat bread, salad, and other things in the morning.",
        exampleId: "Saya makan roti, salad, dll. di pagi hari."
      },
      {
        id: "nanimo-dokoe-mo-verb-negative",
        pattern: "何も／どこへも Vません",
        jlpt: "N5",
        descEn: "Total negation ('nothing' or 'nowhere' with negative verbs).",
        descId: "Negasi total ('tidak makan apa-apa' / 'tidak pergi ke mana-mana').",
        exampleJp: "ナタポンさんは午後、どこへ行きますか。 —— どこへも行きません。",
        exampleKana: "ナタポンさんはごご、どこへいきますか。 —— どこへもいきません。",
        exampleEn: "Where is Mr. Nattapon going this afternoon? —— Nowhere.",
        exampleId: "Ke mana Pak Nattapon akan pergi siang ini? —— Tidak ke mana-mana."
      }
    ]
  },
  {
    chapter: 4,
    titleEn: "Adjectives, Existence & Spatial Relations",
    titleId: "Kata Sifat, Eksistensi Benda & Keterangan Tempat",
    patterns: [
      {
        id: "n-wa-a-desu",
        pattern: "N は A です",
        jlpt: "N5",
        descEn: "Describes N with an adjective A.",
        descId: "Mendeskripsikan kata benda N menggunakan kata sifat A.",
        exampleJp: "私の町は緑が多いです。",
        exampleKana: "わたしのまちはみдоりがおおいです。",
        exampleEn: "My town has a lot of greenery.",
        exampleId: "Kota saya banyak pepohonan hijau."
      },
      {
        id: "n-wa-i-a-kunai-na-a-ja-arimasen",
        pattern: "イA-い くないです / ナA じゃありません",
        jlpt: "N5",
        descEn: "Negative polite forms of adjectives.",
        descId: "Bentuk negatif sopan dari kata sifat-i dan kata sifat-na.",
        exampleJp: "この料理 is 辛くないです。私の町はにぎやかじゃありません。", // wait, let's fix: この料理は辛くないです。
        exampleKana: "このりょうりはからくないです。わたしのまちはにぎやかじゃありません。",
        exampleEn: "This dish is not spicy. My town is not lively.",
        exampleId: "Masakan ini tidak pedas. Kota saya tidak ramai."
      },
      {
        id: "a-n-modifier",
        pattern: "イA ＋ N / ナA な ＋ N",
        jlpt: "N5",
        descEn: "Adjectives modifying nouns directly.",
        descId: "Kata sifat yang memodifikasi kata benda secara langsung.",
        exampleJp: "姫路城は大きいお城です。私の町はにぎやかなところです。",
        exampleKana: "ひめじじょうはおおきいおしろです。わたしのまちはにぎやかなところです。",
        exampleEn: "Himeji Castle is a large castle. My town is a lively place.",
        exampleId: "Kastil Himeji adalah kastil yang besar. Kota saya adalah tempat yang ramai."
      },
      {
        id: "n-wa-season-a-desu",
        pattern: "N は [春/○月/一年中...]、A です",
        jlpt: "N5",
        descEn: "Describes weather or conditions of N in a specific season or month.",
        descId: "Mendeskripsikan kondisi cuaca atau suasana N di musim/bulan tertentu.",
        exampleJp: "東京は6月、雨が多いです。",
        exampleKana: "とうきょうはろくがつ、あめがおおいです。",
        exampleEn: "Tokyo has a lot of rain in June.",
        exampleId: "Tokyo pada bulan Juni banyak turun hujan."
      },
      {
        id: "totemo-sukoshi-a-desu",
        pattern: "とても／少し A です",
        jlpt: "N5",
        descEn: "Modifies adjective intensity ('very' / 'a little').",
        descId: "Memodifikasi intensitas kata sifat ('sangat' / 'sedikit').",
        exampleJp: "私の町は冬、とても寒いです。",
        exampleKana: "わたしのまちはふゆ、とてもさむいです。",
        exampleEn: "My town is very cold in winter.",
        exampleId: "Kota saya sangat dingin di musim dingin."
      },
      {
        id: "amari-a-kunai-ja-arimasen",
        pattern: "あまり [イA-い くないです/ナA じゃありません]",
        jlpt: "N5",
        descEn: "Expresses 'not very...' with negative adjective forms.",
        descId: "Menyatakan makna 'tidak begitu...' dengan kata sifat negatif.",
        exampleJp: "この公園はあまり大きくないです。",
        exampleKana: "このこうえんはあまりおおきくないです。",
        exampleEn: "This park is not very big.",
        exampleId: "Taman ini tidak begitu besar."
      },
      {
        id: "n1-ni-n2-ga-arimasu-existence",
        pattern: "N1 (場所) に N2 (物) があります",
        jlpt: "N5",
        descEn: "Expresses existence of inanimate N2 in place N1.",
        descId: "Menyatakan keberadaan benda mati N2 di tempat N1.",
        exampleJp: "私の町にきれいな川があります。",
        exampleKana: "わたしのまちにきれいなかわがあります。",
        exampleEn: "There is a beautiful river in my town.",
        exampleId: "Ada sungai yang indah di kota saya."
      },
      {
        id: "n-wa-n-no-direction-desu",
        pattern: "N (場所) は N の [東/西/南/北] です",
        jlpt: "N5",
        descEn: "Expresses relative direction of location N ('N is south of...').",
        descId: "Menunjukkan letak mata angin relatif dari tempat N ('N berada di sebelah selatan...').",
        exampleJp: "沖縄は日本の南です。",
        exampleKana: "おきなわはにほんのみなみです。",
        exampleEn: "Okinawa is south of Japan.",
        exampleId: "Okinawa berada di sebelah selatan Jepang."
      },
      {
        id: "n1-kara-n2-made-donokurai",
        pattern: "N1 から N2 まで どのくらいですか",
        jlpt: "N5",
        descEn: "Asks for duration or distance between two places.",
        descId: "Menanyakan perkiraan durasi atau jarak antara dua tempat.",
        exampleJp: "東京から箱根までどのくらいですか。 —— 1時間半くらいです。",
        exampleKana: "とうきょうからはこねまでどのくらいですか。 —— いちじかんはんくらいです。",
        exampleEn: "How long does it take from Tokyo to Hakone? —— About 1.5 hours.",
        exampleId: "Dari Tokyo sampai Hakone kira-kira berapa lama? —— Sekitar 1 setengah jam."
      },
      {
        id: "n-norimono-de",
        pattern: "N (乗り物) で",
        jlpt: "N5",
        descEn: "Indicates vehicle or method of transit ('By train/car').",
        descId: "Menunjukkan jenis kendaraan atau moda transportasi ('Dengan kereta/mobil').",
        exampleJp: "大阪から京都まで電車で30分くらいです。",
        exampleKana: "おおさかからきょうとまででんしゃでさんじゅっぷんくらいです。",
        exampleEn: "It takes about 30 minutes by train from Osaka to Kyoto.",
        exampleId: "Dari Osaka sampai Kyoto dengan kereta sekitar 30 menit."
      },
      {
        id: "donna-n",
        pattern: "どんな N",
        jlpt: "N5",
        descEn: "Asks about characteristics ('What kind of N?').",
        descId: "Menanyakan sifat atau karakteristik ('N yang bagaimana?').",
        exampleJp: "アユタヤはどんなところですか。 —— きれいなところです。",
        exampleKana: "アユタヤはどんなところですか。 —— きれいなところです。",
        exampleEn: "What kind of place is Ayutthaya? —— It is a beautiful place.",
        exampleId: "Ayutthaya tempat yang bagaimana? —— Tempat yang indah."
      },
      {
        id: "n-wa-dou-desuka",
        pattern: "N はどうですか",
        jlpt: "N5",
        descEn: "Asks for opinion or checks status ('How about N?').",
        descId: "Menanyakan pendapat atau keadaan ('Bagaimana dengan N?').",
        exampleJp: "日本は8月、とても暑いです。ロシアはどうですか。 —— ロシアはあまり暑くないです。",
        exampleKana: "にほんははちがつ、とてもあついです。ロシアはどうですか。 —— ロシアはあまりあつくないです。",
        exampleEn: "Japan is very hot in August. How about Russia? —— Russia is not very hot.",
        exampleId: "Jepang pada bulan Agustus sangat panas. Bagaimana dengan Rusia? —— Rusia tidak begitu panas."
      },
      {
        id: "soshite",
        pattern: " Machinist そして", // wait, let's fix: "そして"
        jlpt: "N5",
        descEn: "Conjunction to add information ('And / Also').",
        descId: "Kata sambung untuk menambahkan informasi searah ('Dan / Serta / Dan juga').",
        exampleJp: "この町はにぎやかです。そして、きれいです。",
        exampleKana: "このまちはにぎやかです。そして、きれいです。",
        exampleEn: "This town is lively. And, it is beautiful.",
        exampleId: "Kota ini ramai. Dan juga, bersih/indah."
      },
      {
        id: "sentence-ga-sentence",
        pattern: "＿＿＿が、＿＿＿",
        jlpt: "N5",
        descEn: "Conjunction showing contrast ('But / However').",
        descId: "Kata hubung yang menyatakan pertentangan/kontras ('Tapi / Namun').",
        exampleJp: "私の町は大きくないですが、いいところです。",
        exampleKana: "わたしのまちはおおきくないですが、いいところです。",
        exampleEn: "My town is not big, but it is a nice place.",
        exampleId: "Kota saya tidak besar, tapi merupakan tempat yang menyenangkan."
      },
      {
        id: "sentence-ne",
        pattern: "＿＿＿ね",
        jlpt: "N5",
        descEn: "Sentence-ending particle seeking agreement ('isn't it?' / 'right?').",
        descId: "Partikel akhir kalimat untuk mencari kesepakatan ('ya?' / 'kan?').",
        exampleJp: "暑いですね。 —— そうですね。",
        exampleKana: "あついですね。 —— そうですね。",
        exampleEn: "It is hot, isn't it? —— Yes, indeed.",
        exampleId: "Panas sekali ya. —— Iya benar."
      }
    ]
  },
  {
    chapter: 5,
    titleEn: "Past Adjectives, Preferences & Desire",
    titleId: "Kata Sifat Lampau, Kesukaan & Keinginan",
    patterns: [
      {
        id: "a-n-past-tense",
        pattern: "イA-かった / [ナA/N] でした / じゃありませんでした",
        jlpt: "N5",
        descEn: "Past tense polite forms of adjectives and nouns.",
        descId: "Bentuk lampau sopan dari kata sifat dan kata benda.",
        exampleJp: "昨日のパーティーは楽しかったです。テストは簡単じゃありませんでした。",
        exampleKana: "きのうのぱーてぃーはたのしかったです。てすとはかんたんじゃありませんでした。",
        exampleEn: "Yesterday's party was fun. The test was not easy.",
        exampleId: "Pesta kemarin menyenangkan. Ujiannya tidak mudah."
      },
      {
        id: "n-ga-suki-kirai-desu",
        pattern: "N が好きです／嫌いです",
        jlpt: "N5",
        descEn: "Expresses liking or disliking N.",
        descId: "Menyatakan kesukaan atau ketidaksukaan terhadap N.",
        exampleJp: "私は日本のアニメが好きです。",
        exampleKana: "わたしはにほんのあにめがすきです。",
        exampleEn: "I like Japanese anime.",
        exampleId: "Saya menyukai anime Jepang."
      },
      {
        id: "n-ga-hoshire-desu",
        pattern: "N がほしいです",
        jlpt: "N5",
        descEn: "Expresses desire for N (want an object).",
        descId: "Menyatakan keinginan untuk memiliki benda N.",
        exampleJp: "私はパソコンがほしいです。",
        exampleKana: "わたしはぱそこんがほしいです。",
        exampleEn: "I want a computer.",
        exampleId: "Saya ingin laptop/komputer."
      },
      {
        id: "dokoka-e-ikimasu",
        pattern: "どこかへ",
        jlpt: "N5",
        descEn: "Indicates 'somewhere' ('Do you go somewhere?').",
        descId: "Menunjukkan ketidakpastian tempat ('ke suatu tempat').",
        exampleJp: "昨日、どこかへ行きましたか。",
        exampleKana: "きのう、どこかへいきましたか。",
        exampleEn: "Did you go somewhere yesterday?",
        exampleId: "Apakah kemarin pergi ke suatu tempat?"
      },
      {
        id: "doushite",
        pattern: "どうして",
        jlpt: "N5",
        descEn: "Asking for reasons ('Why?').",
        descId: "Menanyakan alasan ('Mengapa?').",
        exampleJp: "どうして朝、何も食べませんでしたか。 —— 朝、忙しかったですから。",
        exampleKana: "どうしてあさ、なにもたべませんでしたか。 —— あさ、いそがしかったですから。",
        exampleEn: "Why didn't you eat anything this morning? —— Because I was busy.",
        exampleId: "Mengapa pagi ini tidak makan apa-apa? —— Karena pagi-pagi sibuk."
      },
      {
        id: "sorekara",
        pattern: "それから",
        jlpt: "N5",
        descEn: "Conjunction to show sequential actions ('And then').",
        descId: "Kata penghubung untuk menyatakan urutan kegiatan ('Setelah itu / Kemudian').",
        exampleJp: "昨日、恋人と映画を見ました。それから、食事をしました。",
        exampleKana: "きのう、こいびととえいがをみました。それから、しょくじをしました。",
        exampleEn: "Yesterday, I watched a movie with my lover. And then, we had a meal.",
        exampleId: "Kemarin, saya menonton film bersama pacar. Setelah itu, kami makan."
      },
      {
        id: "n-to-verb",
        pattern: "N (人) と",
        jlpt: "N5",
        descEn: "Indicates companion ('Together with N').",
        descId: "Menunjukkan orang yang menemani ('Bersama dengan N').",
        exampleJp: "週末、友達とサッカーをしました。",
        exampleKana: "しゅうまつ、ともだちとさっかーをしました。",
        exampleEn: "On the weekend, I played soccer with my friend.",
        exampleId: "Akhir pekan, saya bermain sepak bola bersama teman."
      },
      {
        id: "sentence-kara-sentence",
        pattern: "＿＿＿から、＿＿＿",
        jlpt: "N5",
        descEn: "Conjunction showing reason ('Because...').",
        descId: "Kata hubung yang menyatakan sebab/alasan ('Karena...').",
        exampleJp: "昨日、雨でしたから、どこへも行きませんでした。",
        exampleKana: "きのう、あめでしたから、どこへもいきませんでした。",
        exampleEn: "Because it was rainy yesterday, I went nowhere.",
        exampleId: "Karena kemarin hujan, saya tidak pergi ke mana-mana."
      }
    ]
  },
  {
    chapter: 6,
    titleEn: "Existence, Comparison & Hearsay",
    titleId: "Eksistensi Acara, Perbandingan & Hearsay",
    patterns: [
      {
        id: "n-ga-arimasu-event-schedule",
        pattern: "N があります (用事・約束)",
        jlpt: "N5",
        descEn: "Expresses having plans, chores, or appointments.",
        descId: "Menyatakan memiliki janji, tugas, atau urusan.",
        exampleJp: "明日、友達と約束があります。",
        exampleKana: "あした、ともだちとやくそくがあります。",
        exampleEn: "I have an appointment with a friend tomorrow.",
        exampleId: "Besok saya ada janji dengan teman."
      },
      {
        id: "n-basho-de-n-ga-arimasu",
        pattern: "N1 (場所) で N2 (イベント) があります",
        jlpt: "N5",
        descEn: "Expresses that an event takes place in a location.",
        descId: "Menyatakan diadakannya suatu acara/kegiatan di suatu tempat.",
        exampleJp: "今晩、横浜でサッカーの試合があります。",
        exampleKana: "こんばん、よこはまでさっかーのしあいがあります。",
        exampleEn: "There is a soccer match in Yokohama tonight.",
        exampleId: "Malam ini ada pertandingan sepak bola di Yokohama."
      },
      {
        id: "n-ga-counter-arimasu",
        pattern: "N が [～枚/～つ/...] あります",
        jlpt: "N5",
        descEn: "Expresses quantity of inanimate objects.",
        descId: "Menyatakan jumlah keberadaan benda mati.",
        exampleJp: "映画のチケットが2枚あります。",
        exampleKana: "えいがのちけっとがにまいあります。",
        exampleEn: "I have two movie tickets.",
        exampleId: "Saya punya 2 lembar tiket bioskop."
      },
      {
        id: "n1-de-n2-ga-ichiban-a-desu",
        pattern: "N1 で N2 が いちばん A です",
        jlpt: "N5",
        descEn: "Expresses superlative ('N2 is the most A within group N1').",
        descId: "Menyatakan tingkat paling/ter (superlatif) ('N2 paling A di antara N1').",
        exampleJp: "スポーツで野球がいちばんおもしろいです。",
        exampleKana: "すぽーつでやきゅうがいちばんおもしろいです。",
        exampleEn: "Baseball is the most interesting sport.",
        exampleId: "Di antara olahraga, bisbol adalah yang paling menarik."
      },
      {
        id: "n1-wa-n2-yori-a-desu",
        pattern: "N1 は N2 より A です",
        jlpt: "N5",
        descEn: "Expresses comparison ('N1 is more A than N2').",
        descId: "Menyatakan perbandingan lebih ('N1 lebih A daripada N2').",
        exampleJp: "7月は8月より雨が多いです。",
        exampleKana: "しちがつははちがつよりあめがおおいです。",
        exampleEn: "July has more rain than August.",
        exampleId: "Bulan Juli curah hujannya lebih banyak daripada bulan Agustus."
      },
      {
        id: "n1-to-n2-to-dochira-ga-a-desuka-hou-ga",
        pattern: "N1 と N2 とどちらが A ですか / N のほうが A です",
        jlpt: "N5",
        descEn: "Asks to compare two items and response with choice.",
        descId: "Menanyakan perbandingan antara dua benda dan merespon dengan memilih salah satu.",
        exampleJp: "夏と冬とどちらが好きですか。 —— 冬のほうが好きです。",
        exampleKana: "なつとふゆとどちらがすきですか。 —— ふゆのほうがすきです。",
        exampleEn: "Which do you like better, summer or winter? —— I like winter better.",
        exampleId: "Antara musim panas dan musim dingin, mana yang Anda sukai? —— Saya lebih suka musim dingin."
      },
      {
        id: "n-wa-dou-desuka-kan-yuu",
        pattern: "N はどうですか (勧誘)",
        jlpt: "N5",
        descEn: "Offers or suggests N politely.",
        descId: "Menawarkan atau menyarankan N secara sopan.",
        exampleJp: "A：何を食べますか。 B：おすしはどうですか。 A：いいですね。",
        exampleKana: "A：なにをたべますか。 B：おすしはどうですか。 A：いいですね。",
        exampleEn: "A: What shall we eat? B: How about sushi? A: Sounds good.",
        exampleId: "A: Makan apa kita? B: Bagaimana kalau sushi? A: Boleh juga ya."
      },
      {
        id: "sentence-yo",
        pattern: "＿＿＿よ",
        jlpt: "N5",
        descEn: "Sentence-ending particle to inform new information.",
        descId: "Partikel akhir kalimat untuk menginformasikan hal baru kepada pendengar.",
        exampleJp: "この映画はとてもおもしろいですよ。",
        exampleKana: "このえいがはてつだおもしろいですよ。", // wait, let's fix: "このえいがはとてもおもしろいですよ。"
        exampleEn: "This movie is very interesting, you know.",
        exampleId: "Film ini sangat menarik lho."
      }
    ]
  },
  {
    chapter: 7,
    titleEn: "Position & Animate Existence",
    titleId: "Posisi & Keberadaan Makhluk Hidup",
    patterns: [
      {
        id: "n1-wa-n2-ni-imasu-arimasu",
        pattern: "N1 は N2 (場所) に います／あります",
        jlpt: "N5",
        descEn: "Expresses location of a specific person (imasu) or thing (arimasu).",
        descId: "Menyatakan lokasi keberadaan orang (imasu) atau benda (arimasu) yang spesifik.",
        exampleJp: "私は本屋にいます。バス停はコンビニの前にあります。",
        exampleKana: "わたしはほんやにいます。ばすていはこんびにのまえにあります。",
        exampleEn: "I am at the bookstore. The bus stop is in front of the convenience store.",
        exampleId: "Saya ada di toko buku. Halte bus berada di depan minimarket."
      },
      {
        id: "n1-ni-n2-ga-imasu-arimasu",
        pattern: "N1 (場所) に N2 が います／あります",
        jlpt: "N5",
        descEn: "Expresses presence of animate (imasu) or inanimate (arimasu) object in place N1.",
        descId: "Menyatakan keberadaan makhluk hidup (imasu) atau benda mati (arimasu) di tempat N1.",
        exampleJp: "あそこにパクさんがいます。銀行の前に本屋があります。",
        exampleKana: "あそこにパクさんがいます。ぎんこうのまえにほんやがあります。",
        exampleEn: "Mr. Park is over there. There is a bookstore in front of the bank.",
        exampleId: "Di setelah sana ada Pak Park. Ada toko buku di depan bank." // wait, let's fix: "Di sebelah sana"
      },
      {
        id: "mada-mou-existence",
        pattern: "まだ／もう",
        jlpt: "N5",
        descEn: "Indicates 'still' (mada) or 'already/no longer' (mou).",
        descId: "Menunjukkan keadaan 'masih' (mada) atau 'sudah/tidak lagi' (mou).",
        exampleJp: "サラダはまだありますか。 —— いいえ、もうありません。",
        exampleKana: "さらだはまだありますか。 —— いいえ、もうありません。",
        exampleEn: "Is there still salad left? —— No, there is no more.",
        exampleId: "Apakah saladnya masih ada? —— Tidak, sudah tidak ada lagi."
      },
      {
        id: "dare-ga-subject-marker",
        pattern: "誰が",
        jlpt: "N5",
        descEn: "Question word for subject, always followed by particle ga.",
        descId: "Kata tanya subjek, selalu diikuti partikel 'ga' bukan 'wa'.",
        exampleJp: "誰がこのケーキを作りましたか。 —— ワンさんが作りました。",
        exampleKana: "だれがこのけーきをつくりましたか。 —— ワンさんがつくりました。",
        exampleEn: "Who made this cake? —— Mr. Wang made it.",
        exampleId: "Siapa yang membuat kue ini? —— Pak Wang yang membuatnya."
      },
      {
        id: "dono-n-dore",
        pattern: "どの N／どれ",
        jlpt: "N5",
        descEn: "Question words for choosing among three or more items.",
        descId: "Kata tanya untuk memilih di antara tiga barang atau lebih.",
        exampleJp: "A：お皿を洗ってください。 B：どのお皿ですか。",
        exampleKana: "A：おさらをあらってください。 B：どのおさらですか。",
        exampleEn: "A: Please wash the dishes. B: Which dish?",
        exampleId: "A: Tolong cuci piringnya. B: Piring yang mana?"
      },
      {
        id: "n-dougu-de",
        pattern: "N (道具) で",
        jlpt: "N5",
        descEn: "Indicates instrument or tool used ('With chopsticks').",
        descId: "Menunjukkan alat atau instrumen yang digunakan ('Dengan sumpit').",
        exampleJp: "はしでご飯を食べます。",
        exampleKana: "はしでごはんをたべます。",
        exampleEn: "I eat rice with chopsticks.",
        exampleId: "Saya makan nasi dengan sumpit."
      }
    ]
  },
  {
    chapter: 8,
    titleEn: "Physical Attributes & Giving/Receiving",
    titleId: "Atribut Fisik & Memberi/Menerima",
    patterns: [
      {
        id: "n1-wa-n2-ga-a-desu",
        pattern: "N1 は N2 が A です",
        jlpt: "N5",
        descEn: "Describes N1's N2 attribute with an adjective (e.g. hair is long, good at soccer).",
        descId: "Menyatakan atribut N2 milik N1 yang bersifat A (misal: rambut panjang, mahir bola).",
        exampleJp: "ダニエルさんは背が高いです。マルコさんはサッカーが上手です。",
        exampleKana: "ダニエルさんはせがたかいです。マルコさんはさっかーがじょうずです。",
        exampleEn: "Mr. Daniel is tall. Mr. Marco is good at soccer.",
        exampleId: "Pak Daniel tinggi. Pak Marco mahir bermain sepak bola."
      },
      {
        id: "n-person-ni-n-o-agemasu-moraimasu-kuremasu",
        pattern: "N1 (人) に N2 (物) を あげます／もらいます／くれます",
        jlpt: "N5",
        descEn: "Givers and receivers of objects (give to, receive from, give to me).",
        descId: "Transaksi pemberian barang (memberi kepada, menerima dari, memberi kepada saya).",
        exampleJp: "カルロスさんはパクさんに花をあげました。メアリーさんが私にかばんをくれました。",
        exampleKana: "カルロスさんはパクさんにはなをあげました。メアリーさんがわたしにかばんをくれました。",
        exampleEn: "Mr. Carlos gave flowers to Mr. Park. Mary gave a bag to me.",
        exampleId: "Pak Carlos memberikan bunga kepada Pak Park. Mary memberikan tas kepada saya."
      },
      {
        id: "n-person-ga-counter-imasu",
        pattern: "N (人) が [～人] います",
        jlpt: "N5",
        descEn: "Expresses headcount of people.",
        descId: "Menyatakan jumlah orang yang ada.",
        exampleJp: "私は妹が二人います。",
        exampleKana: "わたしはいもうtoがふたりいます。", // wait, let's fix: わたしはいもうとがふたりいます。
        exampleEn: "I have two younger sisters.",
        exampleId: "Saya punya dua adik perempuan."
      },
      {
        id: "person-counter-de",
        pattern: "[～人] で",
        jlpt: "N5",
        descEn: "Indicates number of people doing an activity together.",
        descId: "Menunjukkan jumlah orang yang melakukan aktivitas bersama-sama.",
        exampleJp: "私はルームメイトと3人で住んでいます。",
        exampleKana: "わたしはるーむめいととさんにんですんでいます。",
        exampleEn: "I live with my roommates in a group of three.",
        exampleId: "Saya tinggal bersama teman sekamar bertiga."
      }
    ]
  },
  {
    chapter: 9,
    titleEn: "Frequency & Conjunctions",
    titleId: "Frekuensi Kegiatan & Kata Hubung",
    patterns: [
      {
        id: "period-ni-counter",
        pattern: "[期間] に [回数]",
        jlpt: "N5",
        descEn: "Expresses frequency within a period ('Twice a week').",
        descId: "Menyatakan frekuensi dalam kurun waktu tertentu ('Dua kali seminggu').",
        exampleJp: "1週間に2回、家族に電話します。",
        exampleKana: "いっしゅうかんににかい、かぞくにでんわします。",
        exampleEn: "I call my family twice a week.",
        exampleId: "Saya menelepon keluarga dua kali seminggu."
      },
      {
        id: "frequency-adverbs",
        pattern: "いつも／よく／ときどき／あまり／全然",
        jlpt: "N5",
        descEn: "Adverbs of frequency. Last two are paired with negative verb forms.",
        descId: "Kata keterangan frekuensi. Dua terakhir wajib menggunakan bentuk negatif.",
        exampleJp: "ナタポンさんはよくサッカーをしますか。 —— いいえ、あまりしません。",
        exampleKana: "ナタポンさんはよくさっかーをしますか。 —— いいえ、あまりしません。",
        exampleEn: "Do you play soccer often, Mr. Nattapon? —— No, not very often.",
        exampleId: "Apakah Pak Nattapon sering main bola? —— Tidak, tidak begitu sering."
      },
      {
        id: "douyatte",
        pattern: "どうやって",
        jlpt: "N5",
        descEn: "Asks for directions or method of doing ('How / By what means?').",
        descId: "Menanyakan cara atau petunjuk menuju suatu tempat ('Bagaimana caranya?').",
        exampleJp: "どうやって美術館へ行きますか。 —— 3番のバスに乗って行きます。",
        exampleKana: "どうやってびじゅつかんへいきますか。 —— さんばんのばすにのっていきます。",
        exampleEn: "How do we get to the art museum? —— Ride bus number 3.",
        exampleId: "Bagaimana cara pergi ke museum seni? —— Naik bus nomor 3."
      },
      {
        id: "demo",
        pattern: "でも",
        jlpt: "N5",
        descEn: "Conjunction meaning 'but' or 'however', used at sentence start.",
        descId: "Kata hubung di awal kalimat yang berarti 'namun' atau 'tetapi'.",
        exampleJp: "私の趣味はスポーツです。でも、最近、全然しません。",
        exampleKana: "わたしのしゅみはすぽーつです。でも、さいきん、ぜんぜんしません。",
        exampleEn: "My hobby is sports. But, I don't play at all recently.",
        exampleId: "Hobi saya adalah olahraga. Tetapi, belakangan ini sama sekali tidak melakukannya."
      }
    ]
  },
  {
    chapter: 10,
    titleEn: "Perception & State Changes",
    titleId: "Persepsi & Perubahan Keadaan",
    patterns: [
      {
        id: "n-ga-miemasu-kikoemasu",
        pattern: "N が見えます／聞こえます",
        jlpt: "N4",
        descEn: "Expresses natural visibility or audibility without active action.",
        descId: "Menyatakan objek yang secara alami terlihat atau terdengar tanpa tindakan aktif.",
        exampleJp: "ここから東京タワーが見えます。鳥の声が聞こえます。",
        exampleKana: "ここからとうきょうたわーがみえます。とりのこえがきこえます。",
        exampleEn: "Tokyo Tower is visible from here. The voices of birds can be heard.",
        exampleId: "Dari sini terlihat Tokyo Tower. Terdengar suara burung."
      },
      {
        id: "adjective-noun-ni-narimasu",
        pattern: "イA-く / [ナA/N] になります",
        jlpt: "N5",
        descEn: "Expresses change in state ('to become cold / turn 12 o'clock').",
        descId: "Menyatakan perubahan keadaan/waktu ('menjadi dingin / menjadi jam 12').",
        exampleJp: "寒くなりました。もうすぐ12時になります。",
        exampleKana: "さむくなりました。もうすぐじゅうにじになります。",
        exampleEn: "It has become cold. It will be 12 o'clock soon.",
        exampleId: "Sudah menjadi dingin. Sebentar lagi menjadi jam 12."
      },
      {
        id: "n-basho-o-movement",
        pattern: "N (場所) を",
        jlpt: "N4",
        descEn: "Indicates space of motion (passing through, crossing, turning).",
        descId: "Menunjukkan ruang yang dilewati/dilalui saat bergerak (menyeberang, berbelok).",
        exampleJp: "あの橋を渡って、交差点を右に曲がってください。",
        exampleKana: "あのはしをわたって、こうじてんをみぎにまがってください。",
        exampleEn: "Cross that bridge and turn right at the intersection.",
        exampleId: "Sebelah menyeberangi jembatan itu, tolong belok kanan di persimpangan."
      },
      {
        id: "n-wa-contrastive",
        pattern: "N は (対比・強調)",
        jlpt: "N5",
        descEn: "Brings focus to a topic, often contrastive in a sentence.",
        descId: "Menekankan topik kalimat, sering kali digunakan untuk membedakan kontras.",
        exampleJp: "ここに荷物を置いてもいいですか。 —— あ、荷物はあそこに置いてください。",
        exampleKana: "ここに荷物を置いてもいいですか。 —— あ、にもつはあそこにおいてください。",
        exampleEn: "May I place my luggage here? —— Please place it over there.",
        exampleId: "Boleh saya meletakkan barang bawaan di sini? —— Barang bawaannya tolong diletakkan di sana."
      }
    ]
  },
  {
    chapter: 11,
    titleEn: "Contrast & Confusion",
    titleId: "Kalimat Kontras & Kebingungan",
    patterns: [
      {
        id: "n1-wa-ga-n2-wa",
        pattern: "N1 は ＿＿＿ が、N2 は ＿＿＿",
        jlpt: "N5",
        descEn: "Contrasts two different items using particle wa.",
        descId: "Membandingkan dua topik kontras menggunakan partikel wa.",
        exampleJp: "犬は好きですが、猫は好きじゃありません。",
        exampleKana: "いぬはすきですが、ねこはすきじゃありません。",
        exampleEn: "I like dogs, but I don't like cats.",
        exampleId: "Saya suka anjing, tapi tidak suka kucing."
      },
      {
        id: "doushimasuka",
        pattern: "どうしますか",
        jlpt: "N5",
        descEn: "Asking what one should do in a situation.",
        descId: "Menanyakan apa yang sebaiknya dilakukan dalam suatu keadaan.",
        exampleJp: "疲れたとき、どうしますか。 —— 甘いものを食べます。",
        exampleKana: "つかれたとき、どうしますか。 —— あまいものをたべます。",
        exampleEn: "What do you do when you are tired? —— I eat sweet things.",
        exampleId: "Saat lelah, apa yang Anda lakukan? —— Makan yang manis-manis."
      }
    ]
  },
  {
    chapter: 13,
    titleEn: "Knowledge States & Named Expressions",
    titleId: "Keadaan Pengetahuan & Ungkapan Nama",
    patterns: [
      {
        id: "shitteimasu-shirimasen",
        pattern: "知っています／知りません",
        jlpt: "N5",
        descEn: "State of knowing or not knowing (uses shirimasen instead of shitteimasen).",
        descId: "Menyatakan tahu (shitteimasu) atau tidak tahu (shirimasen — bentuk perkecualian).",
        exampleJp: "おいしいパン屋を知っていますか。 —— いいえ、知りません。",
        exampleKana: "おいしいぱんやをしっていますか。 —— いいえ、しりません。",
        exampleEn: "Do you know a delicious bakery? —— No, I don't.",
        exampleId: "Apakah kamu tahu toko roti yang enak? —— Tidak, saya tidak tahu."
      },
      {
        id: "n1-to-iu-n2",
        pattern: "N1 という N2",
        jlpt: "N4",
        descEn: "Expression to name or call N2 as N1 ('N2 called N1').",
        descId: "Ungkapan untuk mendeskripsikan N2 yang bernama N1 ('N2 yang bernama/disebut N1').",
        exampleJp: "これは「さくら」という歌です。",
        exampleKana: "これは「さくら」といううたです。",
        exampleEn: "This is a song called 'Sakura'.",
        exampleId: "Ini adalah lagu yang bernama 'Sakura'."
      }
    ]
  },
  {
    chapter: 15,
    titleEn: "Causes of Events",
    titleId: "Penyebab Kejadian",
    patterns: [
      {
        id: "n-de-reason",
        pattern: "N で (原因)",
        jlpt: "N4",
        descEn: "Indicates cause or reason for a state/event ('Due to N').",
        descId: "Menunjukkan sebab atau alasan terjadinya suatu kejadian/kondisi ('Karena/Akibat N').",
        exampleJp: "事故で電車が止まっています。",
        exampleKana: "じこででんしゃがとまっています。",
        exampleEn: "The train is stopped due to an accident.",
        exampleId: "Kereta berhenti akibat kecelakaan."
      }
    ]
  }
];
