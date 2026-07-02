export interface ITTerm {
  id: string;
  kanji: string;
  hiragana: string;
  romaji: string;
  translationId: string;
  translationEn: string;
  exampleJp: string;
  exampleKana: string;
  exampleTranslationId: string;
  exampleTranslationEn: string;
  isCustom?: boolean;
}

export const DEFAULT_IT_TERMS: ITTerm[] = [
  {
    id: "term-1",
    kanji: "開発",
    hiragana: "かいはつ",
    romaji: "kaihatsu",
    translationId: "Pengembangan (Development)",
    translationEn: "Development",
    exampleJp: "新しいWebアプリケーションを開発しています。",
    exampleKana: "あたらしい うぇぶあぷりけーしょんを かいはつしています。",
    exampleTranslationId: "Sedang mengembangkan aplikasi web baru.",
    exampleTranslationEn: "We are developing a new web application."
  },
  {
    id: "term-2",
    kanji: "実装",
    hiragana: "じっそう",
    romaji: "jissou",
    translationId: "Implementasi (Implementation / Coding)",
    translationEn: "Implementation",
    exampleJp: "この新機能は来週実装されます。",
    exampleKana: "この しんきのうは らいしゅう じっそうされます。",
    exampleTranslationId: "Fitur baru ini akan diimplementasikan minggu depan.",
    exampleTranslationEn: "This new feature will be implemented next week."
  },
  {
    id: "term-3",
    kanji: "仕様書",
    hiragana: "しようしょ",
    romaji: "shiyousho",
    translationId: "Dokumen Spesifikasi (Specification Document)",
    translationEn: "Specification Document",
    exampleJp: "開発を始める前に、仕様書をよく読んでください。",
    exampleKana: "かいはつを はじめるまえに、しようしょを よく よんでください。",
    exampleTranslationId: "Sebelum mulai mengembangkan, harap baca dokumen spesifikasi dengan baik.",
    exampleTranslationEn: "Before starting development, please read the specification document carefully."
  },
  {
    id: "term-4",
    kanji: "設計",
    hiragana: "せっけい",
    romaji: "sekkei",
    translationId: "Desain Sistem / Arsitektur (System Design)",
    translationEn: "System Design / Architecture",
    exampleJp: "データベースの設計を見直す必要があります。",
    exampleKana: "でーたべーすの せっけいを みなおす ひつようがあります。",
    exampleTranslationId: "Perlu meninjau kembali desain database.",
    exampleTranslationEn: "We need to review the database design."
  },
  {
    id: "term-5",
    kanji: "要件定義",
    hiragana: "ようけんていぎ",
    romaji: "youken teigi",
    translationId: "Definisi Kebutuhan (Requirements Definition)",
    translationEn: "Requirements Definition",
    exampleJp: "要件定義フェーズでクライアントの要望を整理します。",
    exampleKana: "ようけんていぎ ふぇーずで くらいあんとの ようぼうを せいりします。",
    exampleTranslationId: "Mengatur keinginan klien pada fase definisi kebutuhan.",
    exampleTranslationEn: "We organize the client's needs in the requirements definition phase."
  },
  {
    id: "term-6",
    kanji: "開発環境",
    hiragana: "かいはつきょうきょう",
    romaji: "kaihatsu kankyou",
    translationId: "Lingkungan Pengembangan (Development Environment)",
    translationEn: "Development Environment",
    exampleJp: "各自のローカルPCに開発環境を構築してください。",
    exampleKana: "かくじの ろーかるぴーしーに かいはつきょうきょうを こうちくしてください。",
    exampleTranslationId: "Silakan bangun lingkungan pengembangan di komputer lokal masing-masing.",
    exampleTranslationEn: "Please set up the development environment on your local computer."
  },
  {
    id: "term-7",
    kanji: "本番環境",
    hiragana: "ほんばんかんきょう",
    romaji: "honban kankyou",
    translationId: "Lingkungan Produksi (Production Environment)",
    translationEn: "Production Environment",
    exampleJp: "本番環境でコードを直接編集してはいけません。",
    exampleKana: "ほんばんかんきょうで こーどを ちょくせつ へんしゅうしては いけません。",
    exampleTranslationId: "Tidak boleh mengedit kode secara langsung di lingkungan produksi.",
    exampleTranslationEn: "Do not edit code directly in the production environment."
  },
  {
    id: "term-8",
    kanji: "構築",
    hiragana: "こうちく",
    romaji: "kouchiku",
    translationId: "Membangun / Konstruksi (Build / Setup)",
    translationEn: "Build / Construct / Setup",
    exampleJp: "Dockerを使ってサーバーを構築しました。",
    exampleKana: "どっかーを つかって さーばーを こうちくしました。",
    exampleTranslationId: "Membangun server menggunakan Docker.",
    exampleTranslationEn: "We built the server using Docker."
  },
  {
    id: "term-9",
    kanji: "不具合",
    hiragana: "ふぐあい",
    romaji: "fuguai",
    translationId: "Bug / Glitch / Masalah (System Glitch)",
    translationEn: "Bug / Defect / Issue",
    exampleJp: "ログイン機能に重大な不具合が見つかりました。",
    exampleKana: "ろぐいんきのうに じゅうだいな ふぐあいが みつかりました。",
    exampleTranslationId: "Ditemukan bug serius pada fitur login.",
    exampleTranslationEn: "A critical bug was found in the login function."
  },
  {
    id: "term-10",
    kanji: "修正",
    hiragana: "しゅうせい",
    romaji: "shuusei",
    translationId: "Perbaikan / Koreksi (Fix / Modify)",
    translationEn: "Bug Fix / Correction",
    exampleJp: "不具合の原因を特定して修正しました。",
    exampleKana: "ふぐあいの げんいんを とくていして しゅうせいしました。",
    exampleTranslationId: "Mengidentifikasi penyebab bug dan memperbaikinya.",
    exampleTranslationEn: "We identified the cause of the bug and fixed it."
  },
  {
    id: "term-11",
    kanji: "障害",
    hiragana: "しょうがい",
    romaji: "shougai",
    translationId: "Gangguan Sistem / Outage (System Failure)",
    translationEn: "System Outage / Incident",
    exampleJp: "サーバー障害が発生し、サービスが一時停止しました。",
    exampleKana: "さーばーしょうがいが はっせいし、さーびすが いちじていししました。",
    exampleTranslationId: "Gangguan server terjadi dan layanan dihentikan sementara.",
    exampleTranslationEn: "A server failure occurred and the service was temporarily suspended."
  },
  {
    id: "term-12",
    kanji: "監視",
    hiragana: "かんし",
    romaji: "kanshi",
    translationId: "Pemantauan (Monitoring)",
    translationEn: "Monitoring",
    exampleJp: "システムの稼働状況を24時間監視しています。",
    exampleKana: "しすてむの かどうじょうきょうを にじゅうよじかん かんししています。",
    exampleTranslationId: "Memantau status operasi sistem selama 24 jam.",
    exampleTranslationEn: "We monitor the system's operational status 24 hours a day."
  },
  {
    id: "term-13",
    kanji: "運用",
    hiragana: "うんよう",
    romaji: "unyou",
    translationId: "Pengoperasian (System Operation)",
    translationEn: "Operation / Run",
    exampleJp: "このシステムは来月から運用が始まります。",
    exampleKana: "この しすてむは らいげつから うんようが はじまります。",
    exampleTranslationId: "Sistem ini akan mulai dioperasikan bulan depan.",
    exampleTranslationEn: "The operation of this system will start next month."
  },
  {
    id: "term-14",
    kanji: "保守",
    hiragana: "ほしゅ",
    romaji: "hoshu",
    translationId: "Pemeliharaan (Maintenance)",
    translationEn: "Maintenance",
    exampleJp: "古いシステムの保守コストが高くなっています。",
    exampleKana: "ふるい しすてむの ほしゅこすとが たかくなっています。",
    exampleTranslationId: "Biaya pemeliharaan sistem lama menjadi semakin tinggi.",
    exampleTranslationEn: "The maintenance cost of the legacy system is increasing."
  },
  {
    id: "term-15",
    kanji: "脆弱性",
    hiragana: "ぜいじゃくせい",
    romaji: "zeijakusei",
    translationId: "Kerentanan Keamanan (Security Vulnerability)",
    translationEn: "Vulnerability",
    exampleJp: "最新のセキュリティパッチを適用して脆弱性を修正します。",
    exampleKana: "さいしんの せきゅりてぃぱっちを てきようして ぜいじゃくせいを しゅうせいします。",
    exampleTranslationId: "Menerapkan patch keamanan terbaru untuk memperbaiki kerentanan.",
    exampleTranslationEn: "We apply the latest security patches to fix the vulnerability."
  },
  {
    id: "term-16",
    kanji: "移行",
    hiragana: "いこう",
    romaji: "ikou",
    translationId: "Migrasi (Migration)",
    translationEn: "Migration",
    exampleJp: "オンプレミスからクラウド環境への移行を進めています。",
    exampleKana: "おんぷれみすから くらうどかんきょうへの いこうを すすめています。",
    exampleTranslationId: "Sedang melakukan migrasi dari on-premise ke lingkungan cloud.",
    exampleTranslationEn: "We are migrating from on-premise to the cloud environment."
  },
  {
    id: "term-17",
    kanji: "同期",
    hiragana: "どうき",
    romaji: "douki",
    translationId: "Sinkronisasi (Synchronization)",
    translationEn: "Synchronization / Sync",
    exampleJp: "データベースのデータを自動で同期します。",
    exampleKana: "でーたべーすの でーたを じどうで どうきします。",
    exampleTranslationId: "Menyinkronkan data database secara otomatis.",
    exampleTranslationEn: "Synchronize database data automatically."
  },
  {
    id: "term-18",
    kanji: "画面",
    hiragana: "がめん",
    romaji: "gamen",
    translationId: "Layar / Antarmuka (Screen / UI)",
    translationEn: "Screen / Interface / UI",
    exampleJp: "ログイン画面のデザインを変更してください。",
    exampleKana: "ろぐいんがめんの でざいんを へんこうしてください。",
    exampleTranslationId: "Silakan ubah desain layar login.",
    exampleTranslationEn: "Please change the design of the login screen."
  },
  {
    id: "term-19",
    kanji: "機能",
    hiragana: "きのう",
    romaji: "kinou",
    translationId: "Fitur / Fungsi (Feature / Function)",
    translationEn: "Feature / Function",
    exampleJp: "ユーザー検索機能を追加しました。",
    exampleKana: "ゆーざーけんさくきのうを ついかしました。",
    exampleTranslationId: "Telah menambahkan fitur pencarian pengguna.",
    exampleTranslationEn: "Added a user search feature."
  },
  {
    id: "term-20",
    kanji: "接続",
    hiragana: "せつぞく",
    romaji: "setsuzoku",
    translationId: "Koneksi (Connection)",
    translationEn: "Connection",
    exampleJp: "データベースへの接続がタイムアウトしました。",
    exampleKana: "でーたべーすへの せつぞくが たいむあうとしました。",
    exampleTranslationId: "Koneksi ke database mengalami batas waktu (timeout).",
    exampleTranslationEn: "The connection to the database timed out."
  },
  {
    id: "term-21",
    kanji: "起動",
    hiragana: "きどう",
    romaji: "kidou",
    translationId: "Menjalankan / Booting (Startup / Launch)",
    translationEn: "Startup / Launch / Boot",
    exampleJp: "サーバーを再起動してください。",
    exampleKana: "さーばーを さいきどうしてください。",
    exampleTranslationId: "Silakan restart (jalankan ulang) server.",
    exampleTranslationEn: "Please restart the server."
  },
  {
    id: "term-22",
    kanji: "終了",
    hiragana: "しゅうりょう",
    romaji: "shuuryou",
    translationId: "Mengakhiri / Selesai (Termination / Close)",
    translationEn: "End / Termination / Close",
    exampleJp: "プログラム of 処理が正常に終了しました。",
    exampleKana: "ぷろぐらむの しょりが せいじょうに しゅうりょうしました。",
    exampleTranslationId: "Proses program telah berakhir dengan normal.",
    exampleTranslationEn: "The program process terminated successfully."
  },
  {
    id: "term-23",
    kanji: "更新",
    hiragana: "こうしん",
    romaji: "koushin",
    translationId: "Pembaruan (Update)",
    translationEn: "Update / Renewal",
    exampleJp: "プロフィール情報を更新しました。",
    exampleKana: "ぷろふぃーるじょうほうを こうしんしました。",
    exampleTranslationId: "Telah memperbarui informasi profil.",
    exampleTranslationEn: "Updated the profile information."
  },
  {
    id: "term-24",
    kanji: "認証",
    hiragana: "にんしょう",
    romaji: "ninshou",
    translationId: "Autentikasi (Authentication)",
    translationEn: "Authentication (AuthN)",
    exampleJp: "二要素認証を有効にしてください。",
    exampleKana: "にようそにんしょうを ゆうこうにしてください。",
    exampleTranslationId: "Silakan aktifkan autentikasi dua faktor.",
    exampleTranslationEn: "Please enable two-factor authentication."
  },
  {
    id: "term-25",
    kanji: "認可",
    hiragana: "にんか",
    romaji: "ninka",
    translationId: "Otorisasi (Authorization)",
    translationEn: "Authorization (AuthZ)",
    exampleJp: "この操作を行うには管理者権限の認可が必要です。",
    exampleKana: "この そうさを おこなうには かんりしゃけんげんの にんかが ひつようです。",
    exampleTranslationId: "Untuk melakukan operasi ini, diperlukan otorisasi wewenang administrator.",
    exampleTranslationEn: "To perform this operation, authorization of administrator privileges is required."
  },
  {
    id: "term-26",
    kanji: "処理",
    hiragana: "しょり",
    romaji: "shori",
    translationId: "Pemrosesan / Eksekusi (Processing)",
    translationEn: "Processing / Execution",
    exampleJp: "バックグラウンドで大量のデータを処理しています。",
    exampleKana: "ばっくぐらうんどで たいりょうの でーたを しょりしています。",
    exampleTranslationId: "Sedang memproses data dalam jumlah besar di latar belakang.",
    exampleTranslationEn: "Processing a large amount of data in the background."
  },
  {
    id: "term-27",
    kanji: "負荷",
    hiragana: "ふか",
    romaji: "fuka",
    translationId: "Beban Kerja Sistem (Load / Stress)",
    translationEn: "Load / Stress",
    exampleJp: "アクセス集中によりサーバーの負荷が高まっています。",
    exampleKana: "あくせすしゅうちゅうにより さーばーの ふかが たかまっています。",
    exampleTranslationId: "Beban server meningkat karena konsentrasi akses.",
    exampleTranslationEn: "The server load is increasing due to concentrated access."
  },
  {
    id: "term-28",
    kanji: "容量",
    hiragana: "ようりょう",
    romaji: "youryou",
    translationId: "Kapasitas Penyimpanan (Capacity / Volume)",
    translationEn: "Capacity / Storage Size",
    exampleJp: "ディスク容量が不足しています。",
    exampleKana: "でぃすくようりょうが ふそくしています。",
    exampleTranslationId: "Kapasitas disk tidak mencukupi.",
    exampleTranslationEn: "The disk capacity is running low."
  },
  {
    id: "term-29",
    kanji: "試験 / テスト",
    hiragana: "しけん / てすと",
    romaji: "shiken / tesuto",
    translationId: "Pengujian / Tes (Testing)",
    translationEn: "Testing / Examination",
    exampleJp: "結合テストを明日から開始します。",
    exampleKana: "けつごうてすとを あしたから かいしします。",
    exampleTranslationId: "Uji integrasi (integration testing) akan dimulai besok.",
    exampleTranslationEn: "We will start integration testing tomorrow."
  },
  {
    id: "term-30",
    kanji: "納品",
    hiragana: "のうひん",
    romaji: "nouhin",
    translationId: "Penyerahan Produk / Delivery (Delivery)",
    translationEn: "Product Delivery / Release",
    exampleJp: "成果物をクライアントに納品しました。",
    exampleKana: "せいかぶつを くらいあんとに のうひんしました。",
    exampleTranslationId: "Menyerahkan hasil kerja (deliverables) kepada klien.",
    exampleTranslationEn: "We delivered the deliverables to the client."
  }
];
