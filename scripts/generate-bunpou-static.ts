import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { callGemini } from "../src/shared/lib/gemini-limiter";

interface BunpouExample {
  exampleJp: string;
  exampleKana: string;
  exampleEn: string;
  exampleId: string;
}

interface NewBunpouPattern {
  id: string;
  pattern: string;
  jlpt: string;
  descEn: string;
  descId: string;
  examples: BunpouExample[];
}

interface NewBunpouLesson {
  chapter: number;
  titleEn: string;
  titleId: string;
  patterns: NewBunpouPattern[];
}

const INPUT_SYLLABUS = [
  {
    chapter: 1,
    titleEn: "Basic Greetings & Copula",
    titleId: "Perkenalan Diri & Keterangan Dasar",
    patterns: [
      { id: "n1-wa-n2-desu", pattern: "N1 は N2 です", jlpt: "N5", descEn: "Identifies N1 as N2 ('N1 is N2').", descId: "Menyatakan bahwa N1 adalah N2 ('N1 adalah N2')." },
      { id: "n1-wa-n2-desuka", pattern: "N1 は N2 ですか", jlpt: "N5", descEn: "Asks if N1 is N2.", descId: "Menanyakan apakah N1 adalah N2." },
      { id: "n-wa-dochira-itsu-nandesuka", pattern: "N は どちら／いつ／何ですか", jlpt: "N5", descEn: "Asks where / when / what N is.", descId: "Menanyakan di mana / kapan / apa itu N." },
      { id: "n1-no-n2", pattern: "N1 の N2", jlpt: "N5", descEn: "Indicates possession, origin, or modification.", descId: "Menunjukkan kepemilikan, asal, atau hubungan." },
      { id: "n1-to-n2", pattern: "N1 と N2", jlpt: "N5", descEn: "Connects nouns ('N1 and N2').", descId: "Menghubungkan kata benda ('N1 dan N2')." },
      { id: "n-mo", pattern: "N も", jlpt: "N5", descEn: "Indicates 'also' or 'too'.", descId: "Menunjukkan arti 'juga' atau 'pun'." }
    ]
  },
  {
    chapter: 2,
    titleEn: "Demonstratives & Noun Modifiers",
    titleId: "Kata Tunjuk & Modifikasi Kata Benda",
    patterns: [
      { id: "kore-sore-are", pattern: "これ／それ／あれ", jlpt: "N5", descEn: "Demonstrative pronouns for objects close to speaker, listener, or far from both.", descId: "Kata tunjuk benda dekat pembicara, lawan bicara, atau jauh dari keduanya." },
      { id: "kono-sono-ano", pattern: "この／その／あの N", jlpt: "N5", descEn: "Demonstrative determiners modifying nouns directly.", descId: "Kata tunjuk yang memodifikasi kata benda secara langsung." },
      { id: "koko-soko-asoko-doko", pattern: "ここ／そこ／あそこ／どこ", jlpt: "N5", descEn: "Demonstratives for locations (here, there, over there, where).", descId: "Kata tunjuk tempat (sini, situ, sana, mana)." },
      { id: "n-o-kudasai", pattern: "N をください", jlpt: "N5", descEn: "Requesting an object politely ('Please give me N').", descId: "Meminta barang secara sopan ('Tolong berikan N')." },
      { id: "ikura", pattern: "いくら", jlpt: "N5", descEn: "Asking for the price of something ('How much?').", descId: "Menanyakan harga barang ('Berapa harganya?')." },
      { id: "nan-no-n", pattern: "何の N", jlpt: "N5", descEn: "Asking about content or type ('What kind of N?').", descId: "Menanyakan isi atau jenis ('N apa? / N tentang apa?')." },
      { id: "doko-no-n", pattern: "どこの N", jlpt: "N5", descEn: "Asking about origin or manufacturer ('Where is this N made?').", descId: "Menanyakan asal negara atau pembuat ('N buatan mana?')." },
      { id: "dare-no-n", pattern: "誰の N", jlpt: "N5", descEn: "Asking about ownership ('Whose N?').", descId: "Menanyakan kepemilikan ('N milik siapa?')." },
      { id: "n-de-language", pattern: "N(～語) で", jlpt: "N5", descEn: "Expressing something using a specific language ('in [language]').", descId: "Menyatakan sesuatu menggunakan bahasa tertentu ('dalam [bahasa]')." }
    ]
  },
  {
    chapter: 3,
    titleEn: "Particles & Movements",
    titleId: "Partikel & Perpindahan Tempat",
    patterns: [
      { id: "v-masu-masen", pattern: "V ます／ません", jlpt: "N5", descEn: "Polite form of verbs (affirmative / negative).", descId: "Bentuk sopan kata kerja (positif / negatif)." },
      { id: "n-basho-e-ikimasu", pattern: "N(場所) へ 行きます", jlpt: "N5", descEn: "Indicates destination or direction of movement ('go to N').", descId: "Menunjukkan tempat tujuan atau arah perpindahan ('pergi ke N')." },
      { id: "n-o-verb", pattern: "N を V", jlpt: "N5", descEn: "Indicates direct object of a verb.", descId: "Menunjukkan objek langsung dari kata kerja." },
      { id: "n-time-ni", pattern: "N(時間) に", jlpt: "N5", descEn: "Indicates specific time when action occurs.", descId: "Menunjukkan waktu spesifik terjadinya suatu aksi." },
      { id: "n-basho-de", pattern: "N(場所) で", jlpt: "N5", descEn: "Indicates place where action occurs.", descId: "Menunjukkan tempat terjadinya suatu aksi." },
      { id: "n-kara-n-made", pattern: "N から N まで", jlpt: "N5", descEn: "Indicates starting and ending points of time or space ('from N to N').", descId: "Menunjukkan titik awal dan akhir waktu atau ruang ('dari N sampai N')." },
      { id: "n1-ya-n2-nado", pattern: "N1 や N2 など", jlpt: "N5", descEn: "Lists nouns non-exhaustively ('N1, N2, etc.').", descId: "Menyebutkan kata benda secara tidak menyeluruh ('N1, N2, dan lain-lain')." },
      { id: "nanimo-dokoe-mo-verb-negative", pattern: "何も／どこへも V ません", jlpt: "N5", descEn: "Complete negation of things or destination ('nothing / nowhere').", descId: "Penyangkalan menyeluruh terhadap benda atau tujuan ('tidak... apapun / kemanapun')." }
    ]
  },
  {
    chapter: 4,
    titleEn: "Adjectives, Existence & Spatial Relations",
    titleId: "Kata Sifat, Keberadaan & Arah",
    patterns: [
      { id: "n-wa-a-desu", pattern: "N は A です", jlpt: "N5", descEn: "Adjective describing a noun.", descId: "Kata sifat yang menerangkan kata benda." },
      { id: "n-wa-i-a-kunai-na-a-ja-arimasen", pattern: "イA-くないです / ナA じゃありません", jlpt: "N5", descEn: "Negative form of adjectives.", descId: "Bentuk negatif dari kata sifat (i-adjective dan na-adjective)." },
      { id: "a-n-modifier", pattern: "イA ＋ N / ナA な ＋ N", jlpt: "N5", descEn: "Adjective directly modifying a noun.", descId: "Kata sifat yang langsung memodifikasi kata benda di depannya." },
      { id: "n-wa-season-a-desu", pattern: "N は [季節/月]、A です", jlpt: "N5", descEn: "Describing state of weather or seasons.", descId: "Menjelaskan keadaan cuaca atau musim." },
      { id: "totemo-sukoshi-a-desu", pattern: "とても／少し A です", jlpt: "N5", descEn: "Degree adverbs ('very / a little').", descId: "Kata keterangan penunjuk derajat ('sangat / sedikit')." },
      { id: "amari-a-kunai-ja-arimasen", pattern: "あまり A くない／じゃありません", jlpt: "N5", descEn: "Negative modifier expressing 'not very' or 'not much'.", descId: "Penyangkalan halus yang berarti 'tidak begitu / tidak terlalu'." },
      { id: "n1-ni-n2-ga-arimasu-existence", pattern: "N1(場所) に N2 があります", jlpt: "N5", descEn: "Expressing existence of inanimate objects at a location.", descId: "Menyatakan keberadaan benda mati di suatu tempat." },
      { id: "n-wa-n-no-direction-desu", pattern: "N は N の [方向] です", jlpt: "N5", descEn: "Specifying spatial relations (east, west, inside, etc.).", descId: "Menyatakan arah posisi ruang (timur, barat, dalam, dll.)." },
      { id: "n1-kara-n2-made-donokurai", pattern: "N1 から N2 までどのくらい", jlpt: "N5", descEn: "Asking about duration or distance between two locations.", descId: "Menanyakan durasi atau jarak antara dua lokasi." },
      { id: "n-norimono-de", pattern: "N(乗り物) で", jlpt: "N5", descEn: "Indicates means of transportation ('by [transportation]').", descId: "Menunjukkan sarana transportasi ('naik / dengan [kendaraan]')." },
      { id: "donna-n", pattern: "どんな N", jlpt: "N5", descEn: "Asking for details or characteristics ('What kind of N?').", descId: "Menanyakan karakteristik atau jenis ('N yang seperti apa?')." },
      { id: "n-wa-dou-desuka", pattern: "N はどうですか", jlpt: "N5", descEn: "Asking about opinion or recommendation.", descId: "Menanyakan pendapat atau menawarkan sesuatu." },
      { id: "soshite", pattern: "そして", jlpt: "N5", descEn: "Conjunction to add information ('And / Also').", descId: "Kata hubung untuk menambahkan informasi ('Dan / Lalu')." },
      { id: "sentence-ga-sentence", pattern: "～が、～", jlpt: "N5", descEn: "Conjunction indicating contrast ('but').", descId: "Kata hubung pertentangan ('tetapi / namun')." },
      { id: "sentence-ne", pattern: "～ね", jlpt: "N5", descEn: "Sentence ending particle seeking agreement ('isn't it?').", descId: "Partikel akhir kalimat untuk meminta persetujuan ('ya / bukan?')." }
    ]
  },
  {
    chapter: 5,
    titleEn: "Past Adjectives, Preferences & Desire",
    titleId: "Kata Sifat Lampau, Kesukaan & Keinginan",
    patterns: [
      { id: "v-mashita-masendeshita", pattern: "V ました／ませんでした", jlpt: "N5", descEn: "Past tense of polite verbs.", descId: "Bentuk lampau sopan kata kerja (positif / negatif)." },
      { id: "a-n-past-tense", pattern: "A/N でした／じゃありませんでした", jlpt: "N5", descEn: "Past tense of adjectives and nouns.", descId: "Bentuk lampau dari kata sifat dan kata benda." },
      { id: "n-ga-suki-kirai-desu", pattern: "N が好きです／嫌いです", jlpt: "N5", descEn: "Expressing likes and dislikes.", descId: "Menyatakan kesukaan dan ketidaksukaan terhadap sesuatu." },
      { id: "n-ga-hoshire-desu", pattern: "N がほしいです", jlpt: "N5", descEn: "Expressing desire for an object ('want N').", descId: "Menyatakan keinginan memiliki suatu barang ('ingin N')." },
      { id: "v-tai-desu", pattern: "Vたいです", jlpt: "N5", descEn: "Expressing desire to do an action ('want to do V').", descId: "Menyatakan keinginan melakukan suatu tindakan ('ingin melakukan V')." },
      { id: "v-ni-ikimasu", pattern: "V に行きます", jlpt: "N5", descEn: "Expressing purpose of movement ('go to do V').", descId: "Menyatakan tujuan pergi untuk melakukan suatu tindakan." },
      { id: "dokoka-e-ikimasu", pattern: "どこかへ行きます", jlpt: "N5", descEn: "Going somewhere (indefinite location).", descId: "Pergi ke suatu tempat (tujuan tidak spesifik)." },
      { id: "doushite", pattern: "どうして", jlpt: "N5", descEn: "Asking for reasons ('Why?').", descId: "Menanyakan alasan ('Mengapa? / Kenapa?')." },
      { id: "sorekara", pattern: "それから", jlpt: "N5", descEn: "Conjunction indicating sequence ('after that / then').", descId: "Kata hubung urutan waktu ('setelah itu / kemudian')." },
      { id: "n-to-verb", pattern: "N(人) と V", jlpt: "N5", descEn: "Doing an action together with someone.", descId: "Melakukan tindakan bersama dengan orang lain." },
      { id: "sentence-kara-sentence", pattern: "～から、～", jlpt: "N5", descEn: "Expressing reason or cause ('because / so').", descId: "Menyatakan sebab-akibat ('karena... maka...')." }
    ]
  },
  {
    chapter: 6,
    titleEn: "Existence, Comparison & Hearsay",
    titleId: "Keberadaan, Perbandingan & Ajakan",
    patterns: [
      { id: "v-masenka", pattern: "V ませんか", jlpt: "N5", descEn: "Polite invitation or suggestion ('Won't you do V?').", descId: "Ajakan atau tawaran sopan ('Maukah melakukan V?')." },
      { id: "v-mashou", pattern: "V ましょう", jlpt: "N5", descEn: "Polite suggestion ('Let's do V').", descId: "Ajakan atau kesepakatan melakukan sesuatu bersama ('Mari lakukan V')." },
      { id: "n-ga-arimasu-event-schedule", pattern: "N があります (acara)", jlpt: "N5", descEn: "Expressing that an event or scheduled activity takes place.", descId: "Menyatakan berlangsungnya suatu acara atau jadwal kegiatan." },
      { id: "n-basho-de-n-ga-arimasu", pattern: "N1 で N2 があります", jlpt: "N5", descEn: "Specifying the location of an event.", descId: "Menyatakan lokasi berlangsungnya suatu acara." },
      { id: "n-ga-counter-arimasu", pattern: "N があります (数量)", jlpt: "N5", descEn: "Stating the quantity of objects available.", descId: "Menyatakan jumlah barang yang ada menggunakan kata bantu bilangan." },
      { id: "n1-de-n2-ga-ichiban-a-desu", pattern: "N1 で N2 がいちばん A です", jlpt: "N5", descEn: "Expressing superlative comparison ('N2 is the most A in N1').", descId: "Menyatakan perbandingan teratas/paling ('N2 adalah yang paling A di N1')." },
      { id: "n1-wa-n2-yori-a-desu", pattern: "N1 は N2 より A です", jlpt: "N5", descEn: "Comparing two items ('N1 is more A than N2').", descId: "Membandingkan dua hal ('N1 lebih A daripada N2')." },
      { id: "n1-to-n2-to-dochira-ga-a-desuka-hou-ga", pattern: "N1 と N2 とどちらが A ですか / N のほうが A です", jlpt: "N5", descEn: "Asking to choose between two options, and selecting one.", descId: "Menanyakan pilihan antara dua hal, dan memilih salah satunya." },
      { id: "v-mou-mashitaka", pattern: "もう V ましたか", jlpt: "N5", descEn: "Asking if an action has already been completed.", descId: "Menanyakan apakah suatu aksi sudah selesai dilakukan." },
      { id: "sentence-yo", pattern: "～よ", jlpt: "N5", descEn: "Sentence ending particle to provide new info or emphasis ('you know / !').", descId: "Partikel akhir kalimat untuk memberikan informasi baru atau penekanan." }
    ]
  },
  {
    chapter: 7,
    titleEn: "Position & Animate Existence",
    titleId: "Posisi & Keberadaan Makhluk Hidup",
    patterns: [
      { id: "n1-wa-n2-ni-imasu-arimasu", pattern: "N1 は N2 にいます／あります", jlpt: "N5", descEn: "Locating specific people or items ('N1 is at N2').", descId: "Menyatakan keberadaan benda/orang spesifik ('N1 ada di N2')." },
      { id: "n1-ni-n2-ga-imasu-arimasu", pattern: "N1 に N2 がいます／あります", jlpt: "N5", descEn: "Stating what is at a location ('There is N2 at N1').", descId: "Menyatakan apa yang ada di suatu tempat ('Di N1 ada N2')." },
      { id: "v-te-kudasai", pattern: "Vて ください", jlpt: "N5", descEn: "Making a polite request ('Please do V').", descId: "Meminta tolong atau instruksi secara sopan ('Tolong lakukan V')." },
      { id: "v-te-imasu", pattern: "Vて います", jlpt: "N5", descEn: "Expressing ongoing action or state.", descId: "Menyatakan tindakan yang sedang berlangsung atau keadaan." },
      { id: "v-mashouka", pattern: "V ましょうか", jlpt: "N5", descEn: "Offering help politely ('Shall I do V?').", descId: "Menawarkan bantuan secara sopan ('Bagaimana kalau saya lakukan V?')." },
      { id: "v-kata", pattern: "V方", jlpt: "N5", descEn: "Expressing the method of doing an action ('how to do V').", descId: "Menyatakan cara melakukan suatu tindakan ('cara melakukan V')." },
      { id: "mada-mou-existence", pattern: "まだ／もう", jlpt: "N5", descEn: "Adverbs expressing 'yet / already'.", descId: "Kata keterangan yang menyatakan 'belum / sudah'." },
      { id: "dare-ga-subject-marker", pattern: "誰が", jlpt: "N5", descEn: "Subject marker for question words ('Who did...?').", descId: "Penanda subjek untuk kata tanya ('Siapa yang...?')." },
      { id: "dono-n-dore", pattern: "どの N／どれ", jlpt: "N5", descEn: "Which N / which one (among three or more options).", descId: "N yang mana / yang mana (di antara tiga pilihan atau lebih)." },
      { id: "n-dougu-de", pattern: "N(道具) で", jlpt: "N5", descEn: "Indicates the tool or method used to perform an action ('with N').", descId: "Menunjukkan alat atau metode untuk melakukan suatu aksi ('dengan N')." }
    ]
  },
  {
    chapter: 8,
    titleEn: "Physical Attributes & Giving/Receiving",
    titleId: "Atribut Fisik & Memberi/Menerima",
    patterns: [
      { id: "v-te-imasu-job-habit", pattern: "Vて います (pekerjaan/kebiasaan)", jlpt: "N5", descEn: "Expressing state of occupation or habit.", descId: "Menyatakan pekerjaan tetap atau kebiasaan rutin." },
      { id: "n1-wa-n2-ga-a-desu", pattern: "N1 は N2 が A です", jlpt: "N5", descEn: "Describing a feature or attribute of N1 (e.g. 'He has long legs').", descId: "Menjelaskan bagian/atribut tubuh dari N1 (misal: 'Dia kakinya panjang')." },
      { id: "a-kute-a-de", pattern: "Aくて、～ / Aで、～", jlpt: "N5", descEn: "Connecting adjectives to describe multiple attributes.", descId: "Menghubungkan kata sifat untuk menjelaskan beberapa karakteristik." },
      { id: "n-person-ni-n-o-agemasu-moraimasu-kuremasu", pattern: "N1 に N2 を あげます／もらいます／くれます", jlpt: "N5", descEn: "Expressing giving and receiving of items.", descId: "Menyatakan tindakan memberi dan menerima barang." },
      { id: "n-person-ga-counter-imasu", pattern: "N がいます (数量)", jlpt: "N5", descEn: "Stating the count of people available.", descId: "Menyatakan jumlah orang yang ada." },
      { id: "person-counter-de", pattern: "～人で", jlpt: "N5", descEn: "Doing an action with a specific number of people.", descId: "Melakukan suatu aksi dengan jumlah orang tertentu." }
    ]
  },
  {
    chapter: 9,
    titleEn: "Frequency & Conjunctions",
    titleId: "Frekuensi & Kata Hubung",
    patterns: [
      { id: "v-jishokei-koto", pattern: "V辞書形 こと", jlpt: "N5", descEn: "Nominalizing a verb using 'koto'.", descId: "Mengubah kata kerja menjadi kata benda menggunakan 'koto'." },
      { id: "v-koto-ga-dekimasu", pattern: "Vことができます", jlpt: "N5", descEn: "Expressing ability or possibility ('can do V').", descId: "Menyatakan kemampuan atau potensi ('bisa/dapat melakukan V')." },
      { id: "v-te-reason", pattern: "Vて、～", jlpt: "N5", descEn: "Connecting actions / expressing reason.", descId: "Menghubungkan tindakan / menyatakan sebab-akibat sederhana." },
      { id: "period-ni-counter", pattern: "[期間] に [回数]", jlpt: "N5", descEn: "Stating frequency over a period ('X times in [period]').", descId: "Menyatakan frekuensi dalam jangka waktu tertentu ('X kali dalam [jangka waktu]')." },
      { id: "frequency-adverbs", pattern: "いつも/よく/ときどき/あまり/全然", jlpt: "N5", descEn: "Adverbs of frequency.", descId: "Kata keterangan penunjuk frekuensi kegiatan." },
      { id: "douyatte", pattern: "どうやって", jlpt: "N5", descEn: "Asking for directions or methods ('how/in what way?').", descId: "Menanyakan cara atau rute ('bagaimana caranya?')." },
      { id: "demo", pattern: "でも", jlpt: "N5", descEn: "Conjunction meaning 'but / however' at the start of a sentence.", descId: "Kata hubung di awal kalimat yang berarti 'tetapi / namun'." }
    ]
  },
  {
    chapter: 10,
    titleEn: "Perception & State Changes",
    titleId: "Persepsi & Perubahan Keadaan",
    patterns: [
      { id: "v-naide-kudasai", pattern: "Vないで ください", jlpt: "N5", descEn: "Requesting someone not to do an action ('Please don't do V').", descId: "Meminta seseorang untuk tidak melakukan sesuatu ('Tolong jangan lakukan V')." },
      { id: "v-temo-ii-desuka", pattern: "Vても いいですか", jlpt: "N5", descEn: "Asking for permission ('May I do V?').", descId: "Meminta izin untuk melakukan suatu tindakan ('Bolehkah saya melakukan V?')." },
      { id: "n-ga-v-te-imasu-state", pattern: "N が Vて います (状態)", jlpt: "N5", descEn: "Expressing a state resulting from an action.", descId: "Menyatakan keadaan yang dihasilkan dari suatu tindakan sebelumnya." },
      { id: "v-te-kimasu", pattern: "Vて きます", jlpt: "N5", descEn: "Going to do something and returning ('go and come back').", descId: "Pergi untuk melakukan suatu aksi lalu kembali ('pergi dulu untuk...')." },
      { id: "n-ga-miemasu-kikoemasu", pattern: "N が見えます／聞こえます", jlpt: "N5", descEn: "Expressing spontaneous visual or auditory perception.", descId: "Menyatakan sesuatu terlihat atau terdengar secara spontan/alami." },
      { id: "adjective-noun-ni-narimasu", pattern: "Aくなります／Nになります", jlpt: "N5", descEn: "Expressing a change in state ('become A/N').", descId: "Menyatakan perubahan keadaan ('menjadi A/N')." },
      { id: "n-basho-o-movement", pattern: "N(場所) を V", jlpt: "N5", descEn: "Moving through or along a space (e.g. 'walk along the street').", descId: "Melalui atau melintasi suatu area (misal: 'berjalan menyusuri jalan')." },
      { id: "n-wa-contrastive", pattern: "N は (対比)", jlpt: "N5", descEn: "Using 'wa' particle for contrast/comparison.", descId: "Menggunakan partikel 'wa' untuk menunjukkan perbandingan/kontras." }
    ]
  },
  {
    chapter: 11,
    titleEn: "Contrast & Confusion",
    titleId: "Perbandingan Kontras & Kondisi Waktu",
    patterns: [
      { id: "v-tari-v-tari-shimasu", pattern: "Vたり Vたりします", jlpt: "N5", descEn: "Listing representative actions non-exhaustively ('doing things like A and B').", descId: "Menyebutkan beberapa tindakan secara tidak berurutan ('melakukan aktivitas seperti A dan B')." },
      { id: "n1-wa-ga-n2-wa", pattern: "N1 は～が、N2 は～", jlpt: "N5", descEn: "Direct contrast between two nouns/topics.", descId: "Perbandingan kontras langsung antara dua kata benda/topik." },
      { id: "a-n-v-toki", pattern: "とき", jlpt: "N5", descEn: "Expressing time or condition ('when doing/being...').", descId: "Menyatakan waktu atau kondisi kejadian ('saat/ketika...')." },
      { id: "doushimasuka", pattern: "どうしますか", jlpt: "N5", descEn: "Asking what someone will do in a situation.", descId: "Menanyakan apa yang akan dilakukan dalam suatu kondisi." }
    ]
  },
  {
    chapter: 12,
    titleEn: "Casual Style & Advising",
    titleId: "Bahasa Kasual & Memberi Nasihat",
    patterns: [
      { id: "casual-speech", pattern: "普通体／友達言葉", jlpt: "N5", descEn: "Casual/informal speech style used among close relationships.", descId: "Gaya bahasa informal/akrab di antara teman atau keluarga." },
      { id: "plain-form-ndesu", pattern: "普通形 んです", jlpt: "N5", descEn: "Expressing reason, emphasis, or seeking clarification.", descId: "Menjelaskan alasan, memberikan penekanan, atau meminta kejelasan." },
      { id: "v-hou-ga-ii-desu", pattern: "Vほうがいいです", jlpt: "N5", descEn: "Giving strong advice or suggestions ('had better / should').", descId: "Memberikan saran atau nasihat ('sebaiknya / lebih baik melakukan...')." },
      { id: "v-before", pattern: "V前に", jlpt: "N5", descEn: "Action occurring before another event ('before doing...').", descId: "Tindakan yang terjadi sebelum kejadian lain ('sebelum melakukan...')." },
      { id: "v-te-kara", pattern: "Vてから", jlpt: "N5", descEn: "Action occurring after another event finishes ('after doing...').", descId: "Tindakan yang dilakukan setelah aksi sebelumnya selesai ('setelah melakukan...')." }
    ]
  },
  {
    chapter: 13,
    titleEn: "Knowledge States & Named Expressions",
    titleId: "Status Pengetahuan & Modifikasi Kalimat",
    patterns: [
      { id: "v-ta-koto-ga-arimasu", pattern: "Vた ことがあります", jlpt: "N5", descEn: "Expressing past experience ('have done V before').", descId: "Menyatakan pengalaman di masa lalu ('pernah melakukan V')." },
      { id: "plain-form-noun-modifier", pattern: "普通形 ＋ N", jlpt: "N5", descEn: "Modifying a noun with a relative clause.", descId: "Memodifikasi kata benda menggunakan klausa kata kerja bentuk biasa." },
      { id: "shitteimasu-shirimasen", pattern: "知っています／知りません", jlpt: "N5", descEn: "Expressing states of knowing or not knowing.", descId: "Menyatakan status tahu atau tidak tahu." },
      { id: "n1-to-iu-n2", pattern: "N1 という N2", jlpt: "N5", descEn: "Naming or identifying a noun ('N2 named N1').", descId: "Menyebut nama atau mengidentifikasi benda ('N2 yang bernama N1')." }
    ]
  },
  {
    chapter: 14,
    titleEn: "Prohibitions & Obligation Rules",
    titleId: "Larangan & Aturan Kewajiban",
    patterns: [
      { id: "v-to", pattern: "V辞書形 と、～", jlpt: "N5", descEn: "Natural consequence conditional ('whenever / if... then...').", descId: "Pengandaian konsekuensi alamiah ('begitu / jika... maka...')." },
      { id: "v-te-wa-ikemasen", pattern: "Vてはいけません", jlpt: "N5", descEn: "Expressing prohibition ('must not do V').", descId: "Menyatakan larangan keras ('tidak boleh melakukan V')." },
      { id: "v-nakereba-narimasen", pattern: "Vなければなりません", jlpt: "N5", descEn: "Expressing obligation ('must do V').", descId: "Menyatakan keharusan atau kewajiban ('harus melakukan V')." },
      { id: "v-nakute-mo-ii-desu", pattern: "Vなくてもいいです", jlpt: "N5", descEn: "Expressing lack of obligation ('do not have to do V').", descId: "Menyatakan tidak adanya keharusan ('tidak usah melakukan V')." },
      { id: "plain-form-to-omoimasu", pattern: "普通形 と思います", jlpt: "N5", descEn: "Expressing conjecture or opinion ('I think that...').", descId: "Menyatakan pendapat atau dugaan ('Saya kira / pikir...')." },
      { id: "to-iimasu", pattern: "「～」と言います", jlpt: "N5", descEn: "Quoting direct or indirect speech ('says...').", descId: "Mengutip ucapan langsung atau tidak langsung ('berkata...')." }
    ]
  },
  {
    chapter: 15,
    titleEn: "Causes of Events",
    titleId: "Sebab Akibat & Keadaan Lanjutan",
    patterns: [
      { id: "plain-form-soudes", pattern: "普通形 そうです", jlpt: "N5", descEn: "Reporting hearsay ('I heard that...').", descId: "Menyatakan kabar angin / kabar burung ('katanya...')." },
      { id: "tara-conditional", pattern: "～たら", jlpt: "N5", descEn: "Past conditional ('if / when...').", descId: "Pengandaian kondisi masa lampau ('jika / kalau...')." },
      { id: "temo-conditional", pattern: "～ても", jlpt: "N5", descEn: "Concessive conditional ('even if...').", descId: "Pengandaian pertentangan ('walaupun / biarpun...')." },
      { id: "v-te-imasu-state-continued", pattern: "Vて います (状態の継続)", jlpt: "N5", descEn: "State of ongoing condition.", descId: "Keadaan kondisi yang terus berlanjut." },
      { id: "n-de-reason", pattern: "N で (原因)", jlpt: "N5", descEn: "Indicates cause or reason for an event ('due to / because of N').", descId: "Menunjukkan sebab atau alasan terjadinya peristiwa ('karena N')." }
    ]
  }
];

function extractJson(text: string): string {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    return text.substring(start, end + 1);
  }
  return text;
}

async function generateChunkWithRetry(patterns: any[]): Promise<Record<string, BunpouExample[]>> {
  const patternsStr = patterns.map(p => 
    `- ID: "${p.id}", Pattern: "${p.pattern}", Description: "${p.descEn} / ${p.descId}"`
  ).join("\n");

  const systemPrompt = `You are a professional Japanese language teacher.
Your task is to generate exactly 3 high-quality, natural example sentences for each grammar pattern in the list.

Key Pedagogical Rule (Scaffolding):
Within each chapter, the grammar patterns are ordered.
- The first pattern's examples should be simple and basic.
- Subsequent patterns' examples should, wherever natural and possible, build on top of and combine with the earlier patterns in the same chapter or previous chapters. For example, if Chapter 5 has:
  1. V-tai-desu (want to do) -> "I want to eat."
  2. V-ni-ikimasu (go to do) -> "I want to go to eat." (combining pattern 1 and 2: V-tai + V-ni ikimasu)
Note: Some cases cannot be combined naturally, which is fine, but do it as much as naturally possible to show how grammar patterns interact in context!

For each example, you must provide:
- exampleJp: The sentence in standard Japanese (Kanji/Kana, with correct punctuation).
- exampleKana: The sentence in Kana only (representing Furigana).
- exampleEn: Natural English translation.
- exampleId: Natural Indonesian translation.

Ensure the vocabulary and complexity are suitable for basic JLPT N5/N4 levels.
Return the result strictly as a JSON object where the keys are the pattern IDs, and the values are arrays of exactly 3 example objects matching:
{
  "exampleJp": "...",
  "exampleKana": "...",
  "exampleEn": "...",
  "exampleId": "..."
}

Do not return any markdown code blocks, tags, explanations, or text outside the JSON. Return only the raw JSON.`;

  const userMessage = `Here are the patterns to generate 3 examples for:
${patternsStr}

Please return the JSON object mapping pattern IDs to their 3 examples.`;

  let attempt = 0;
  const maxAttempts = 5;
  while (attempt < maxAttempts) {
    try {
      const response = await callGemini(systemPrompt, [], userMessage, "gemini-3.1-flash-lite");
      const cleaned = extractJson(response.text.trim());
      const parsed = JSON.parse(cleaned) as Record<string, BunpouExample[]>;
      
      // Validate that all requested patterns are in the keys and have 3 examples
      let allValid = true;
      for (const p of patterns) {
        if (!parsed[p.id] || !Array.isArray(parsed[p.id]) || parsed[p.id].length !== 3) {
          allValid = false;
          break;
        }
      }

      if (allValid) {
        return parsed;
      }
      throw new Error("Invalid response keys or incorrect example count in parsed JSON");
    } catch (error: any) {
      attempt++;
      console.warn(`   ⚠️ Warning: Attempt ${attempt}/${maxAttempts} for chunk failed: ${error.message}. Retrying in 5s...`);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  throw new Error(`Failed to generate examples for chunk after ${maxAttempts} attempts.`);
}

async function main() {
  console.log("🚀 Starting generation of examples for complete syllabus (Chapters 1-15)...");
  
  const newLessons: NewBunpouLesson[] = [];

  for (const lesson of INPUT_SYLLABUS) {
    console.log(`\n📖 Chapter ${lesson.chapter}: ${lesson.titleEn}`);
    const newPatterns: NewBunpouPattern[] = [];

    // Split patterns into chunks of 4
    const chunks: any[][] = [];
    for (let i = 0; i < lesson.patterns.length; i += 4) {
      chunks.push(lesson.patterns.slice(i, i + 4));
    }

    for (let cIdx = 0; cIdx < chunks.length; cIdx++) {
      const chunk = chunks[cIdx];
      console.log(`   👉 Generating chunk ${cIdx + 1}/${chunks.length} (${chunk.map(p => p.id).join(", ")})`);
      
      const chunkResult = await generateChunkWithRetry(chunk);
      
      for (const p of chunk) {
        newPatterns.push({
          id: p.id,
          pattern: p.pattern,
          jlpt: p.jlpt,
          descEn: p.descEn,
          descId: p.descId,
          examples: chunkResult[p.id]
        });
      }
      
      console.log(`      ✅ Generated chunk successfully.`);
      // Wait to stay within 15 RPM
      await new Promise(resolve => setTimeout(resolve, 4500));
    }

    newLessons.push({
      chapter: lesson.chapter,
      titleEn: lesson.titleEn,
      titleId: lesson.titleId,
      patterns: newPatterns
    });
  }

  // Write new file contents
  const destPath = join(process.cwd(), "src", "modules", "bunpou", "data", "bunpouData.ts");
  const codeContent = `export interface BunpouExample {
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

export const BUNPOU_DATA: BunpouLesson[] = ${JSON.stringify(newLessons, null, 2)};
`;

  writeFileSync(destPath, codeContent, "utf8");
  console.log(`\n🎉 Success! Generated and wrote complete syllabus to ${destPath}`);
}

main().catch(err => {
  console.error("Fatal generation failure:", err);
  process.exit(1);
});
