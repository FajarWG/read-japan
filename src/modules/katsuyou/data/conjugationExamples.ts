export interface ExampleSentence {
  japanese: string;   // Full kanji/hiragana text
  furigana: string;   // Kana-only representation
  romaji: string;     // Romaji representation
  english: string;    // English translation
  indonesian: string; // Indonesian translation
  highlight: string;  // The specific conjugated verb substring to highlight
}

export const CONJUGATION_EXAMPLES: Record<string, ExampleSentence[]> = {
  dictionary: [
    {
      japanese: "私は毎日日本語の本を読みます。", // wait, reading a book
      furigana: "わたしは まいにち にほんごの ほんを よみます。",
      romaji: "Watashi wa mainichi nihongo no hon o yomimasu.",
      english: "I read a Japanese book every day.",
      indonesian: "Saya membaca buku bahasa Jepang setiap hari.",
      highlight: "読みます"
    },
    {
      japanese: "明日、図書館へ行くつもりです。",
      furigana: "あした、としょかんへ いく つもりです。",
      romaji: "Ashita, toshokan e iku tsumori desu.",
      english: "I plan to go to the library tomorrow.",
      indonesian: "Besok, saya berencana pergi ke perpustakaan.",
      highlight: "行く"
    },
    {
      japanese: "彼はギターを弾くことができます。",
      furigana: "かれは ぎたーを ひく ことが できます。",
      romaji: "Kare wa gitaa o hiku koto ga dekimasu.",
      english: "He can play the guitar.",
      indonesian: "Dia bisa bermain gitar.",
      highlight: "弾く"
    },
    {
      japanese: "来年日本へ行くことにしました。",
      furigana: "らいねん にほんへ いく ことに しました。",
      romaji: "Rainen nihon e iku koto ni shimashita.",
      english: "I have decided to go to Japan next year.",
      indonesian: "Saya memutuskan untuk pergi ke Jepang tahun depan.",
      highlight: "行く"
    },
    {
      japanese: "バスが来るのを待っています。",
      furigana: "ばすが くるの を まっています。",
      romaji: "Basu ga kuru no o matte imasu.",
      english: "I am waiting for the bus to come.",
      indonesian: "Saya sedang menunggu bus datang.",
      highlight: "来る"
    }
  ],
  masu: [
    {
      japanese: "私たちは毎朝コーヒーを飲みます。",
      furigana: "わたしたちは まいあさ こーひーを のみます。",
      romaji: "Watashitachi wa maiasa koohii o nomimasu.",
      english: "We drink coffee every morning.",
      indonesian: "Kami minum kopi setiap pagi.",
      highlight: "飲みます"
    },
    {
      japanese: "先生に手紙を書きました。",
      furigana: "せんせいに てがみを かきました。",
      romaji: "Sensei ni tegami o kakishimashita.",
      english: "I wrote a letter to the teacher.",
      indonesian: "Saya menulis surat untuk guru.",
      highlight: "書きました"
    },
    {
      japanese: "今度の週末、映画を見に行きませんか。",
      furigana: "こんどの しゅうまつ、えいがを みに いきませんか。",
      romaji: "Kondo no shuumatsu, eiga o mi ni ikimasen ka?",
      english: "Would you like to go watch a movie this weekend?",
      indonesian: "Bagaimana kalau kita pergi menonton film akhir pekan ini?",
      highlight: "見に行きませんか"
    },
    {
      japanese: "日本語を話しながらご飯を食べます。",
      furigana: "にほんごを はなしながら ごはんを たべます。",
      romaji: "Nihongo o hanashinagara gohan o tabemasu.",
      english: "I eat meals while speaking Japanese.",
      indonesian: "Saya makan sambil berbicara bahasa Jepang.",
      highlight: "話しながら"
    },
    {
      japanese: "新しい靴を買いたいです。",
      furigana: "あたらしい くつを かいたいです。",
      romaji: "Atarashii kutsu o kaitai desu.",
      english: "I want to buy new shoes.",
      indonesian: "Saya ingin membeli sepatu baru.",
      highlight: "買いたいです"
    }
  ],
  te: [
    {
      japanese: "ここに名前を書いてください。",
      furigana: "ここに なまえを かいて ください。",
      romaji: "Koko ni namae o kaite kudasai.",
      english: "Please write your name here.",
      indonesian: "Tolong tulis nama Anda di sini.",
      highlight: "書いて"
    },
    {
      japanese: "窓を開けてもいいですか。",
      furigana: "まどを あけても いいですか。",
      romaji: "Mado o akete mo ii desu ka?",
      english: "May I open the window?",
      indonesian: "Bolehkah saya membuka jendela?",
      highlight: "開けても"
    },
    {
      japanese: "図書館で大きな声で話してはいけません。",
      furigana: "としょかんで おおきな こえで はなしては いけません。",
      romaji: "Toshokan de ookina koe de hanashite wa ikemasen.",
      english: "You must not talk in a loud voice in the library.",
      indonesian: "Tidak boleh berbicara dengan suara keras di perpustakaan.",
      highlight: "話しては"
    },
    {
      japanese: "彼は今、テレビを見ています。",
      furigana: "かれは いま、てれびを みています。",
      romaji: "Kare wa ima, terebi o matte imasu.",
      english: "He is watching television right now.",
      indonesian: "Dia sedang menonton TV sekarang.",
      highlight: "見ています"
    },
    {
      japanese: "荷物を置いて出かけました。",
      furigana: "にもつを おいて でかけました。",
      romaji: "Nimotsu o oite dekakemashita.",
      english: "I put down the luggage and went out.",
      indonesian: "Saya menaruh barang bawaan lalu pergi keluar.",
      highlight: "置いて"
    }
  ],
  ta: [
    {
      japanese: "昨日、日本料理を食べました。",
      furigana: "きのう、にほんりょうりを たべました。",
      romaji: "Kinou, nihon ryouri o tabemashita.",
      english: "Yesterday, I ate Japanese food.",
      indonesian: "Kemarin, saya makan makanan Jepang.",
      highlight: "食べました"
    },
    {
      japanese: "私は一度も寿司を食べたことがありません。",
      furigana: "わたしは いちども すしを たべた ことが ありません。",
      romaji: "Watashi wa ichido mo sushi o tabeta koto ga arimasen.",
      english: "I have never eaten sushi before.",
      indonesian: "Saya belum pernah makan sushi sekalipun.",
      highlight: "食べた"
    },
    {
      japanese: "風邪をひいた時は薬を飲んだほうがいいです。",
      furigana: "かぜを ひいた ときは くすりを のんだ ほうが いいです。",
      romaji: "Kaze o hiita toki wa kusuri o nonda hou ga ii desu.",
      english: "It is better to take medicine when you have a cold.",
      indonesian: "Saat masuk angin, lebih baik meminum obat.",
      highlight: "飲んだ"
    },
    {
      japanese: "掃除をしたり洗濯をしたりしました。",
      furigana: "そうじを したり せんたくを したり しました。",
      romaji: "Souji o shitari sentaku o shitari shimashita.",
      english: "I did things like cleaning and washing clothes.",
      indonesian: "Saya bersih-bersih dan mencuci pakaian.",
      highlight: "掃除をしたり"
    },
    {
      japanese: "授業が終わったら、家に帰りました。",
      furigana: "じゅぎょうが おわったら、うちに かえりました。",
      romaji: "Jugyou ga owattara, uchi ni kaerimashita.",
      english: "When class ended, I went back home.",
      indonesian: "Setelah pelajaran selesai, saya pulang ke rumah.",
      highlight: "帰りました"
    }
  ],
  nai: [
    {
      japanese: "無理をしないでください。",
      furigana: "むりを しないで ください。",
      romaji: "Muri o shinaide kudasai.",
      english: "Please do not push yourself too hard.",
      indonesian: "Tolong jangan memaksakan diri.",
      highlight: "しないで"
    },
    {
      japanese: "明日は早く起きなければなりません。",
      furigana: "あしたは はやく おきなければ なりません。",
      romaji: "Ashita wa hayaku okinakereba narimasen.",
      english: "I must wake up early tomorrow.",
      indonesian: "Besok saya harus bangun pagi.",
      highlight: "起きなければ"
    },
    {
      japanese: "日曜日だから、学校へ行かなくてもいいです。",
      furigana: "にちようび だから、がっこうへ いかなくても いいです。",
      romaji: "Nichiyoubi da kara, gakkou e ikanakute mo ii desu.",
      english: "Since it's Sunday, I don't have to go to school.",
      indonesian: "Karena ini hari Minggu, saya tidak harus pergi ke sekolah.",
      highlight: "行かなくても"
    },
    {
      japanese: "テストの時、辞書を使わないでください。",
      furigana: "てすとの とき、じしょを つかわないで ください。",
      romaji: "Tesuto no toki, jisho o tsukawanaide kudasai.",
      english: "Please do not use a dictionary during the test.",
      indonesian: "Tolong jangan gunakan kamus saat ujian.",
      highlight: "使わないで"
    },
    {
      japanese: "傘を持たないで出かけてしまいました。",
      furigana: "かさを もたないで でかけて しまいました。",
      romaji: "Kasa o motanaide dekate shimaimashita.",
      english: "I went out without carrying an umbrella.",
      indonesian: "Saya terlanjur pergi keluar tanpa membawa payung.",
      highlight: "持たないで"
    }
  ],
  potential: [
    {
      japanese: "漢字が少し書けるようになりました。",
      furigana: "かんじが すこし かけるように なりました。",
      romaji: "Kanji ga sukoshi kakeru you ni narimashita.",
      english: "I became able to write a little bit of Kanji.",
      indonesian: "Saya sudah mulai bisa menulis sedikit Kanji.",
      highlight: "書ける"
    },
    {
      japanese: "日本語で自分の意見が話せます。",
      furigana: "にほんごで じぶんの いけんが はなせます。",
      romaji: "Nihongo de jibun no iken ga hanasemasu.",
      english: "I can express my own opinion in Japanese.",
      indonesian: "Saya bisa menyampaikan pendapat sendiri dalam bahasa Jepang.",
      highlight: "話せます"
    },
    {
      japanese: "このレストランでは美味しい寿司が食べられます。",
      furigana: "この れすとらんでは おいしい すしが たべられます。",
      romaji: "Kono resutoran de wa oishii sushi ga taberaremasu.",
      english: "You can eat delicious sushi at this restaurant.",
      indonesian: "Kamu bisa makan sushi lezat di restoran ini.",
      highlight: "食べられます"
    },
    {
      japanese: "お腹が痛くて、何も食べられません。",
      furigana: "おなかが いたくて、なにも たべられません。",
      romaji: "Onaka ga itakute, nani mo taberaremasen.",
      english: "My stomach hurts, so I cannot eat anything.",
      indonesian: "Perut saya sakit, jadi saya tidak bisa makan apa-apa.",
      highlight: "食べられません"
    },
    {
      japanese: "明日仕事に行けますか。",
      furigana: "あした しごとに いけますか。",
      romaji: "Ashita shigoto ni ikemasu ka?",
      english: "Can you go to work tomorrow?",
      indonesian: "Apakah kamu bisa pergi bekerja besok?",
      highlight: "行けますか"
    }
  ],
  volitional: [
    {
      japanese: "一緒に美味しいラーメンを食べよう！",
      furigana: "いっしょに おいしい らーめんを たべよう！",
      romaji: "Issho ni oishii ramen o tabeyou!",
      english: "Let's eat delicious ramen together!",
      indonesian: "Ayo makan ramen yang lezat bersama-sama!",
      highlight: "食べよう"
    },
    {
      japanese: "疲れたから、少し休もう。",
      furigana: "つかれたから、すこし やすもう。",
      romaji: "Tsukareta kara, sukoshi yasumou.",
      english: "I'm tired, so let's rest a bit.",
      indonesian: "Karena lelah, ayo istirahat sejenak.",
      highlight: "休もう"
    },
    {
      japanese: "来年日本へ留学しようと思っています。",
      furigana: "らいねん にほんへ りゅうがくしようと おもっています。",
      romaji: "Rainen nihon e ryuugakushiyou to omotte imasu.",
      english: "I am thinking of studying abroad in Japan next year.",
      indonesian: "Saya berniat untuk kuliah di Jepang tahun depan.",
      highlight: "留学しようと"
    },
    {
      japanese: "今夜、友達と映画を見に行こう。",
      furigana: "こんや、ともだちと えいがを みにいこう。",
      romaji: "Konya, tomodachi to eiga o mi ni ikou.",
      english: "Let's go watch a movie with friends tonight.",
      indonesian: "Ayo pergi menonton film bersama teman malam ini.",
      highlight: "見に行こう"
    },
    {
      japanese: "もっと一生懸命勉強しようと決めました。",
      furigana: "もっと いっしょうけんめい べんきょうしようと きめました。",
      romaji: "Motto isshoukenmei benkyoushiyou to kimemashita.",
      english: "I decided to study much harder.",
      indonesian: "Saya memutuskan untuk belajar lebih giat lagi.",
      highlight: "勉強しようと"
    }
  ],
  imperative: [
    {
      japanese: "早く走りなさい！遅れるぞ！",
      furigana: "はやく はしりなさい！おくれるぞ！",
      romaji: "Hayaku hashirinasa! Okureru zo!",
      english: "Run quickly! You'll be late!",
      indonesian: "Cepat berlari! Kamu akan terlambat!",
      highlight: "走りなさい"
    },
    {
      japanese: "諦めるな！最後まで頑張れ！",
      furigana: "あきらめるな！さいごまで がんばれ！",
      romaji: "Akirameru na! Saigo made ganbare!",
      english: "Don't give up! Hang in there until the end!",
      indonesian: "Jangan menyerah! Berjuanglah sampai akhir!",
      highlight: "頑張れ"
    },
    {
      japanese: "質問があれば、手を挙げろ。",
      furigana: "しつもんが あれば、てを あげろ。",
      romaji: "Shitsumon ga areba, te o agero.",
      english: "If you have a question, raise your hand.",
      indonesian: "Kalau ada pertanyaan, angkat tanganmu.",
      highlight: "挙げろ"
    },
    {
      japanese: "危ない！止まれ！",
      furigana: "あぶない！とまれ！",
      romaji: "Abunai! Tomare!",
      english: "Danger! Stop!",
      indonesian: "Bahaya! Berhenti!",
      highlight: "止まれ"
    },
    {
      japanese: "早くここに来い！",
      furigana: "はやく ここに こい！",
      romaji: "Hayaku koko ni koi!",
      english: "Come here quickly!",
      indonesian: "Cepat datang ke sini!",
      highlight: "来い"
    }
  ],
  prohibitive: [
    {
      japanese: "ここにゴミを捨てるな。",
      furigana: "ここに ごみを すてるな。",
      romaji: "Koko ni gomi o suteru na.",
      english: "Do not throw trash here.",
      indonesian: "Jangan membuang sampah di sini.",
      highlight: "捨てるな"
    },
    {
      japanese: "嘘をつくな！本当のことを言え。",
      furigana: "うそを つくな！ほんとうの ことを いえ。",
      romaji: "Uso o tsuku na! Hontou no koto o ie.",
      english: "Don't tell lies! Speak the truth.",
      indonesian: "Jangan berbohong! Katakan yang sejujurnya.",
      highlight: "つくな"
    },
    {
      japanese: "芝生に入るなという看板があります。",
      furigana: "しばふに はいるなという かんばんが あります。",
      romaji: "Shibafu ni hairu na to iu kanban ga arimasu.",
      english: "There is a sign saying 'Do not step on the lawn'.",
      indonesian: "Ada papan pengumuman bertuliskan 'Jangan masuk ke area rumput'.",
      highlight: "入るな"
    },
    {
      japanese: "諦めるな、夢は必ず叶う。",
      furigana: "あきらめるな、ゆめは かならず かなう。",
      romaji: "Akirameru na, yume wa kanarazu kanau.",
      english: "Do not give up, dreams will surely come true.",
      indonesian: "Jangan menyerah, impian pasti akan terwujud.",
      highlight: "諦めるな"
    },
    {
      japanese: "私の物に触るな！",
      furigana: "わたしの ものに さわるな！",
      romaji: "Watashi no mono ni sawaru na!",
      english: "Don't touch my things!",
      indonesian: "Jangan sentuh barang-barangku!",
      highlight: "触るな"
    }
  ],
  passive: [
    {
      japanese: "先生に発音をほめられました。",
      furigana: "せんせいに はつおんを ほめられました。",
      romaji: "Sensei ni hatsuon o homeraremashita.",
      english: "I was praised by the teacher for my pronunciation.",
      indonesian: "Saya dipuji oleh guru karena pelafalan saya.",
      highlight: "ほめられました"
    },
    {
      japanese: "満員電車の中で足を踏まれました。",
      furigana: "まんいんでんしゃの なかで あしを ふまれました。",
      romaji: "Man'in densha no naka de ashi o fumaremashita.",
      english: "My foot was stepped on inside the crowded train.",
      indonesian: "Kaki saya terinjak di dalam kereta yang penuh sesak.",
      highlight: "踏まれました"
    },
    {
      japanese: "雨に降られて、服がびしょ濡れになりました。",
      furigana: "あめに ふられて、ふくが びしょぬれに なりました。",
      romaji: "Ame ni furarete, fuku ga bishonure ni narimashita.",
      english: "I got rained on, and my clothes got soaking wet.",
      indonesian: "Saya kehujanan, dan pakaian saya menjadi basah kuyup.",
      highlight: "降られて"
    },
    {
      japanese: "私のケーキを弟に食べられてしまいました。",
      furigana: "わたしの けーきを おとうとに たべられて しまいました。",
      romaji: "Watashi no keeki o otouto ni taberate shimaimashita.",
      english: "My cake ended up being eaten by my younger brother.",
      indonesian: "Kue saya terlanjur dimakan oleh adik laki-laki saya.",
      highlight: "食べられて"
    },
    {
      japanese: "このビルは１９９０年に建てられました。",
      furigana: "この びるは １９９０ねんに たてられました。",
      romaji: "Kono biru wa senkyuuhyakukyuujuunen ni tateraremashita.",
      english: "This building was built in the year 1990.",
      indonesian: "Gedung ini didirikan pada tahun 1990.",
      highlight: "建てられました"
    }
  ],
  causative: [
    {
      japanese: "母は私に野菜を食べさせました。",
      furigana: "ははは わたしに やさいを たべさせました。",
      romaji: "Haha wa watashi ni yasai o tabesasemashita.",
      english: "My mother made me eat vegetables.",
      indonesian: "Ibu memaksa saya makan sayur.",
      highlight: "食べさせました"
    },
    {
      japanese: "先生は学生に作文を書かせました。",
      furigana: "せんせいは がくせいに さくぶんを かかせました。",
      romaji: "Sensei wa gakusei ni sakubun o kakasemashita.",
      english: "The teacher made the students write an essay.",
      indonesian: "Guru menyuruh siswa menulis karangan.",
      highlight: "書かせました"
    },
    {
      japanese: "子供に好きなことをやらせてあげたいです。",
      furigana: "こどもに すきな ことを やらせてあげたいです。",
      romaji: "Kodomo ni sukina koto o yarasetegaitai desu.",
      english: "I want to let my children do what they like.",
      indonesian: "Saya ingin membiarkan anak-anak melakukan hal yang mereka sukai.",
      highlight: "やらせて"
    },
    {
      japanese: "すみません、少し自己紹介をさせてください。",
      furigana: "すみません、すこし じこしょうかいを させてください。",
      romaji: "Sumimasen, sukoshi jikoshoukai o sasetekudasai.",
      english: "Excuse me, please let me introduce myself briefly.",
      indonesian: "Maaf, izinkan saya memperkenalkan diri sejenak.",
      highlight: "させてください"
    },
    {
      japanese: "部長は部下を遅くまで働かせました。",
      furigana: "ぶちょうは ぶかを おそくまで はたらかせました。",
      romaji: "Buchou wa buka o osoku made hatarakasemashita.",
      english: "The department manager made the subordinates work until late.",
      indonesian: "Manajer divisi menyuruh bawahannya bekerja sampai larut.",
      highlight: "働かせました"
    }
  ],
  causativePassive: [
    {
      japanese: "昨日は遅くまで残業させられました。",
      furigana: "きのうは おそくまで ざんぎょうさせられました。",
      romaji: "Kinou wa osoku made zangyousaseraremashita.",
      english: "Yesterday, I was forced to work overtime until late.",
      indonesian: "Kemarin, saya dipaksa kerja lembur sampai larut malam.",
      highlight: "残業させられました"
    },
    {
      japanese: "子供の頃、母にピアノを練習させられました。",
      furigana: "こどもの ころ、ははに ぴあのを れんしゅうさせられました。",
      romaji: "Kodomo no koro, haha ni piano o renshuusaseraremashita.",
      english: "When I was a child, I was forced by my mother to practice piano.",
      indonesian: "Waktu kecil, saya dipaksa oleh ibu berlatih piano.",
      highlight: "練習させられました"
    },
    {
      japanese: "飲み会でビールをたくさん飲まされました。",
      furigana: "のみかいで びーるを たくさん のまされました。",
      romaji: "Nomikai de biiru o takusan nomasaremashita.",
      english: "I was forced to drink a lot of beer at the drinking party.",
      indonesian: "Saya dipaksa minum banyak bir di pesta minum.",
      highlight: "飲まされました"
    },
    {
      japanese: "嫌な仕事をさせられて、辞めたくなりました。",
      furigana: "いやな しごとを させられて、やめたくなりました。",
      romaji: "Iyana shigoto o saserarete, yametakunarimashita.",
      english: "Being forced to do a job I disliked, I wanted to quit.",
      indonesian: "Karena dipaksa melakukan pekerjaan yang tidak disukai, saya jadi ingin resign.",
      highlight: "させられて"
    },
    {
      japanese: "先生に教室を掃除させられました。",
      furigana: "せんせいに きょうしつを そうじさせられました。",
      romaji: "Sensei ni kyoushitsu o soujisaseraremashita.",
      english: "I was made to clean the classroom by the teacher.",
      indonesian: "Saya disuruh membersihkan kelas oleh guru.",
      highlight: "掃除させられました"
    }
  ],
  ba: [
    {
      japanese: "安ければ、新しいパソコンを買いたいです。",
      furigana: "やすければ、あたらしい ぱそこんを かいたいです。",
      romaji: "Yasukereba, atarashii pasokon o kaitai desu.",
      english: "If it is cheap, I want to buy a new computer.",
      indonesian: "Jika murah, saya ingin membeli komputer baru.",
      highlight: "安ければ"
    },
    {
      japanese: "雨が降れば、遠足は中止になります。",
      furigana: "あめが ふれば、えんそくは ちゅうしに なります。",
      romaji: "Ame ga fureba, ensoku wa chuushi ni narimasu.",
      english: "If it rains, the excursion will be canceled.",
      indonesian: "Jika turun hujan, piknik akan dibatalkan.",
      highlight: "降れば"
    },
    {
      japanese: "急げば、まだ電車に間に合いますよ。",
      furigana: "いそげば、まだ でんしゃに まにあいますよ。",
      romaji: "Isogeba, mada densha ni maniaimasu yo.",
      english: "If you hurry, you will still make it to the train.",
      indonesian: "Jika bergegas, kamu masih bisa mengejar kereta.",
      highlight: "急げば"
    },
    {
      japanese: "薬を飲めば、風邪が早く治ります。",
      furigana: "くすりを のめば、かぜが はやく なおります。",
      romaji: "Kusuri o nomeba, kaze ga hayaku naorimasu.",
      english: "If you take medicine, your cold will cure quickly.",
      indonesian: "Jika meminum obat, masuk angin akan lekas sembuh.",
      highlight: "飲めば"
    },
    {
      japanese: "日本語は勉強すればするほど面白くなります。",
      furigana: "にほんごは べんきょうすればするほど おもしろくなります。",
      romaji: "Nihongo wa benkyousureba suru houdo omoshiroku narimasu.",
      english: "The more you study Japanese, the more interesting it becomes.",
      indonesian: "Bahasa Jepang semakin dipelajari akan menjadi semakin menarik.",
      highlight: "勉強すればするほど"
    }
  ]
};
