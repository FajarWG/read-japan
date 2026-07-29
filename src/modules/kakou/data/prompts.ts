import type { KakouLevel, KakouPrompt, KakouPromptKind } from "./types";

function prompt(
  id: string,
  kind: KakouPromptKind,
  level: KakouLevel,
  title: string,
  japanese: string,
  instruction: string,
  options: Pick<KakouPrompt, "pattern" | "example" | "hints"> = {},
): KakouPrompt {
  return { id, kind, level, title, japanese, instruction, ...options };
}

/**
 * Curated, deterministic writing bank. No content is generated at runtime by AI.
 * Sessions combine these entries and persist a snapshot in PostgreSQL.
 */
export const KAKOU_PROMPTS: KakouPrompt[] = [
  // Guided journal — N5
  prompt("journal-n5-01", "JOURNAL", "N5", "Today", "今日、何をしましたか。", "Tuliskan kegiatanmu hari ini dalam 3–5 kalimat.", { pattern: "～ました", hints: ["何時に起きましたか。", "何を食べましたか。", "どこへ行きましたか。"] }),
  prompt("journal-n5-02", "JOURNAL", "N5", "Yesterday", "昨日はどんな日でしたか。", "Ceritakan harimu kemarin dalam 3–5 kalimat bentuk lampau.", { pattern: "～ました／～ませんでした", hints: ["天気はどうでしたか。", "だれと話しましたか。"] }),
  prompt("journal-n5-03", "JOURNAL", "N5", "My morning", "毎朝、何をしますか。", "Jelaskan rutinitas pagimu secara berurutan dalam minimal 4 kalimat.", { pattern: "～ます", hints: ["まず", "それから", "最後に"] }),
  prompt("journal-n5-04", "JOURNAL", "N5", "Weekend plan", "週末、何をしたいですか。", "Tuliskan tiga hal yang ingin kamu lakukan akhir pekan ini dan alasannya.", { pattern: "～たいです／～から", hints: ["どこへ行きたいですか。", "だれと行きたいですか。"] }),
  // Guided journal — N4
  prompt("journal-n4-01", "JOURNAL", "N4", "A memorable meal", "今まで食べた料理の中で、何が一番おいしかったですか。", "Ceritakan makanan paling berkesan dalam 5–7 kalimat.", { pattern: "～たことがあります", hints: ["どこで食べましたか。", "どんな味でしたか。"] }),
  prompt("journal-n4-02", "JOURNAL", "N4", "A recent challenge", "最近、難しかったことは何ですか。", "Jelaskan kesulitan yang baru dialami dan cara mengatasinya.", { pattern: "～ので／～ても", hints: ["どうして難しかったですか。", "どうやって解決しましたか。"] }),
  prompt("journal-n4-03", "JOURNAL", "N4", "A place to recommend", "友達にどこを紹介したいですか。", "Rekomendasikan satu tempat kepada teman dalam 5–7 kalimat.", { pattern: "～たほうがいい／～と思います", hints: ["何ができますか。", "いつ行くのがいいですか。"] }),
  prompt("journal-n4-04", "JOURNAL", "N4", "Changing habits", "変えたい習慣がありますか。", "Tuliskan kebiasaan yang ingin diubah, alasan, dan rencanamu.", { pattern: "～ようと思います", hints: ["今はどうしていますか。", "これから何をしますか。"] }),
  // Guided journal — N3
  prompt("journal-n3-01", "JOURNAL", "N3", "Learning from failure", "失敗から学んだことについて書いてください。", "Ceritakan satu kegagalan, penyebabnya, dan pelajaran yang didapat dalam 7–10 kalimat.", { pattern: "～おかげで／～せいで", hints: ["何が起こりましたか。", "考え方はどう変わりましたか。"] }),
  prompt("journal-n3-02", "JOURNAL", "N3", "Technology and life", "技術によって生活はどう変わったと思いますか。", "Jelaskan satu perubahan positif dan satu perubahan negatif.", { pattern: "～によって／一方で", hints: ["具体的な例を書きましょう。"] }),
  prompt("journal-n3-03", "JOURNAL", "N3", "An important decision", "今までにした大切な決断について書いてください。", "Ceritakan keputusan penting, pertimbanganmu, dan hasilnya.", { pattern: "～ことにする／～た結果", hints: ["なぜ決めましたか。", "後悔していますか。"] }),
  prompt("journal-n3-04", "JOURNAL", "N3", "Ideal community", "住みやすい町には何が必要だと思いますか。", "Tulis pendapatmu beserta sedikitnya dua alasan dan contoh.", { pattern: "～ためには／～べきだ", hints: ["交通", "環境", "人間関係"] }),

  // Copy → Change → Create — N5
  prompt("copy-n5-01", "COPY_CHANGE_CREATE", "N5", "Daily schedule", "私は毎朝七時に起きます。", "Salin kalimat. Ganti waktu dan kegiatannya. Lalu buat satu kalimat baru dengan pola yang sama.", { pattern: "Time に + verb", example: "私は毎晩十一時に寝ます。" }),
  prompt("copy-n5-02", "COPY_CHANGE_CREATE", "N5", "Going somewhere", "日曜日に友達と公園へ行きました。", "Salin kalimat. Ganti hari, orang, dan tempat. Lalu buat satu kalimat baru.", { pattern: "Time に + person と + place へ行きます", example: "土曜日に家族とデパートへ行きました。" }),
  prompt("copy-n5-03", "COPY_CHANGE_CREATE", "N5", "Likes", "私は日本の音楽が好きです。", "Salin kalimat. Ganti jenis musik. Lalu buat kalimat baru tentang hal yang kamu suka.", { pattern: "N が好きです", example: "私は辛い料理が好きです。" }),
  prompt("copy-n5-04", "COPY_CHANGE_CREATE", "N5", "Requests", "窓を開けてください。", "Salin kalimat. Ganti benda dan tindakan. Lalu buat satu permintaan baru.", { pattern: "～てください", example: "ここに名前を書いてください。" }),
  // Copy → Change → Create — N4
  prompt("copy-n4-01", "COPY_CHANGE_CREATE", "N4", "Experience", "私は京都へ行ったことがあります。", "Salin. Ganti tempatnya. Lalu buat kalimat pengalamanmu sendiri.", { pattern: "～たことがあります", example: "私は着物を着たことがあります。" }),
  prompt("copy-n4-02", "COPY_CHANGE_CREATE", "N4", "Advice", "疲れているなら、早く寝たほうがいいです。", "Salin. Ganti kondisi dan sarannya. Lalu tulis satu nasihat untuk teman.", { pattern: "～なら、～たほうがいい", example: "日本へ行くなら、少し日本語を勉強したほうがいいです。" }),
  prompt("copy-n4-03", "COPY_CHANGE_CREATE", "N4", "Simultaneous actions", "音楽を聞きながら、宿題をします。", "Salin. Ganti kedua aktivitas. Lalu buat satu kalimat tentang kebiasaanmu.", { pattern: "～ながら", example: "コーヒーを飲みながら、本を読みます。" }),
  prompt("copy-n4-04", "COPY_CHANGE_CREATE", "N4", "Purpose", "日本で働くために、日本語を勉強しています。", "Salin. Ganti tujuan dan tindakannya. Lalu tulis tujuan pribadimu.", { pattern: "～ために", example: "健康のために、毎日歩いています。" }),
  // Copy → Change → Create — N3
  prompt("copy-n3-01", "COPY_CHANGE_CREATE", "N3", "Unexpected result", "急いだのに、電車に間に合いませんでした。", "Salin. Ubah situasi dan hasilnya. Lalu buat contoh pengalamanmu sendiri.", { pattern: "～のに", example: "薬を飲んだのに、まだ頭が痛いです。" }),
  prompt("copy-n3-02", "COPY_CHANGE_CREATE", "N3", "Gradual change", "日本語のニュースが少しずつ分かるようになりました。", "Salin. Ganti kemampuan yang berubah. Lalu tulis perubahan yang kamu alami.", { pattern: "～ようになる", example: "早く起きられるようになりました。" }),
  prompt("copy-n3-03", "COPY_CHANGE_CREATE", "N3", "Reported information", "天気予報によると、明日は雪が降るそうです。", "Salin. Ganti sumber dan informasinya. Lalu buat satu laporan baru.", { pattern: "～によると、～そうです", example: "先生によると、試験は来週だそうです。" }),
  prompt("copy-n3-04", "COPY_CHANGE_CREATE", "N3", "Decision", "来月から毎日運動することにしました。", "Salin. Ganti waktu dan keputusan. Lalu tuliskan keputusanmu sendiri.", { pattern: "～ことにする", example: "今年、日本語能力試験を受けることにしました。" }),

  // Grammar challenges — N5
  prompt("grammar-n5-01", "GRAMMAR", "N5", "What you want", "～たいです", "Tulis tiga hal yang ingin kamu lakukan bulan ini. Gunakan pola pada setiap kalimat.", { pattern: "Verb ます-stem + たいです", example: "新しい本を読みたいです。" }),
  prompt("grammar-n5-02", "GRAMMAR", "N5", "There is / are", "～があります／います", "Gambarkan kamar atau lingkunganmu dengan empat kalimat.", { pattern: "Place に N があります／います", example: "机の上に本があります。" }),
  prompt("grammar-n5-03", "GRAMMAR", "N5", "Past activities", "～たり～たりします", "Tuliskan beberapa kegiatan yang kamu lakukan akhir pekan lalu.", { pattern: "Verb たり + Verb たりします", example: "本を読んだり、映画を見たりしました。" }),
  prompt("grammar-n5-04", "GRAMMAR", "N5", "Reason", "～から", "Tulis tiga keputusan sederhana beserta alasannya.", { pattern: "Reason から、result", example: "雨ですから、家にいます。" }),
  // Grammar challenges — N4
  prompt("grammar-n4-01", "GRAMMAR", "N4", "Try doing", "～てみます", "Tulis tiga hal baru yang ingin kamu coba dan alasannya.", { pattern: "Verb て + みます", example: "今度、納豆を食べてみます。" }),
  prompt("grammar-n4-02", "GRAMMAR", "N4", "Preparation", "～ておきます", "Tulis tiga persiapan yang perlu dilakukan sebelum perjalanan.", { pattern: "Verb て + おきます", example: "ホテルを予約しておきます。" }),
  prompt("grammar-n4-03", "GRAMMAR", "N4", "Too much", "～すぎます", "Tulis tiga masalah akibat sesuatu yang berlebihan dan satu solusinya.", { pattern: "Verb ます-stem／adjective + すぎます", example: "昨日、食べすぎました。" }),
  prompt("grammar-n4-04", "GRAMMAR", "N4", "Plans", "～つもりです", "Tuliskan empat rencana untuk liburan berikutnya.", { pattern: "Dictionary form + つもりです", example: "夏休みに北海道へ行くつもりです。" }),
  // Grammar challenges — N3
  prompt("grammar-n3-01", "GRAMMAR", "N3", "Because of", "～おかげで／～せいで", "Tulis dua hasil positif dengan おかげで dan dua hasil negatif dengan せいで.", { pattern: "N の／plain form + おかげで・せいで", example: "友達のおかげで、問題が解決しました。" }),
  prompt("grammar-n3-02", "GRAMMAR", "N3", "Even if", "～ても", "Tulis empat hal yang tetap akan atau tidak akan kamu lakukan dalam kondisi berbeda.", { pattern: "Verb ても／adjective ても", example: "雨が降っても、出かけます。" }),
  prompt("grammar-n3-03", "GRAMMAR", "N3", "According to", "～によると", "Tulis tiga informasi yang kamu dengar atau baca, beserta sumbernya.", { pattern: "Source によると、～そうです", example: "ニュースによると、物価が上がるそうです。" }),
  prompt("grammar-n3-04", "GRAMMAR", "N3", "Instead of", "～代わりに", "Tulis tiga pertukaran tindakan atau kebiasaan alternatif.", { pattern: "N の／Verb 代わりに", example: "車で行く代わりに、電車を使いました。" }),

  // Sentence builders — N5
  prompt("builder-n5-01", "SENTENCE_BUILDER", "N5", "At the library", "私・昨日・図書館・日本語・勉強する", "Susun unsur di atas menjadi satu kalimat benar. Lalu ubah menjadi bentuk negatif.", { hints: ["Time は/に", "Place で", "Object を"] }),
  prompt("builder-n5-02", "SENTENCE_BUILDER", "N5", "Breakfast", "妹・毎朝・パン・牛乳・食べる／飲む", "Buat dua kalimat dari unsur di atas, lalu gabungkan dengan そして.", { hints: ["毎朝", "～ます"] }),
  prompt("builder-n5-03", "SENTENCE_BUILDER", "N5", "Shopping", "母・デパート・靴・買う・日曜日", "Susun satu kalimat lampau. Lalu buat pertanyaan dari kalimat itu.", { hints: ["どこで", "何を"] }),
  prompt("builder-n5-04", "SENTENCE_BUILDER", "N5", "Weather", "今日・暑い・水・たくさん・飲む", "Susun satu kalimat sebab-akibat menggunakan から.", { hints: ["今日は暑いですから、…"] }),
  // Sentence builders — N4
  prompt("builder-n4-01", "SENTENCE_BUILDER", "N4", "Before an exam", "試験・始まる・前に・ノート・復習する", "Susun kalimat dengan ～前に, lalu tambahkan satu persiapan lain.", { pattern: "Dictionary form + 前に" }),
  prompt("builder-n4-02", "SENTENCE_BUILDER", "N4", "After work", "仕事・終わる・あとで・同僚・食事する", "Susun kalimat dengan ～あとで, lalu ubah waktunya.", { pattern: "Past form + あとで" }),
  prompt("builder-n4-03", "SENTENCE_BUILDER", "N4", "While walking", "駅・歩く・ながら・友達・電話する", "Susun kalimat dengan ～ながら. Pastikan aktivitas utama berada di akhir.", { pattern: "Verb ます-stem + ながら" }),
  prompt("builder-n4-04", "SENTENCE_BUILDER", "N4", "Lost item", "財布・なくす・ので・交番・行く", "Susun kalimat sebab-akibat dengan ～ので, lalu buat versi sopannya.", { pattern: "Plain form + ので" }),
  // Sentence builders — N3
  prompt("builder-n3-01", "SENTENCE_BUILDER", "N3", "New ability", "毎日・練習する・漢字・書ける・ようになる", "Susun kalimat perubahan kemampuan, lalu tambahkan lama prosesnya.", { pattern: "Potential form + ようになる" }),
  prompt("builder-n3-02", "SENTENCE_BUILDER", "N3", "Despite studying", "一生懸命・勉強する・のに・試験・合格できない", "Susun kalimat kontras, lalu tuliskan perasaan pembicaranya.", { pattern: "Plain form + のに" }),
  prompt("builder-n3-03", "SENTENCE_BUILDER", "N3", "Environmental action", "ごみ・減らす・ために・買い物袋・持っていく", "Susun kalimat tujuan, lalu tambahkan satu tindakan ramah lingkungan lain.", { pattern: "Dictionary form + ために" }),
  prompt("builder-n3-04", "SENTENCE_BUILDER", "N3", "Expected arrival", "天気予報・よると・台風・今夜・来る・そうだ", "Susun laporan informasi yang benar, lalu tulis tindakan persiapanmu.", { pattern: "～によると、～そうです" }),

  // Conjugation drills — N5
  prompt("conjugation-n5-01", "CONJUGATION", "N5", "Write 食べる", "食べる（たべる）— makan", "Tulis bentuk ます・て・ない・た. Setelah itu, buat satu kalimat menggunakan salah satunya.", { hints: ["Ichidan verb"] }),
  prompt("conjugation-n5-02", "CONJUGATION", "N5", "Write 飲む", "飲む（のむ）— minum", "Tulis bentuk ます・て・ない・た. Lingkari perubahan akhir katanya.", { hints: ["Godan む → んで／んだ"] }),
  prompt("conjugation-n5-03", "CONJUGATION", "N5", "Write 行く", "行く（いく）— pergi", "Tulis bentuk ます・て・ない・た, lalu buat kalimat lampau.", { hints: ["Exception: 行って／行った"] }),
  prompt("conjugation-n5-04", "CONJUGATION", "N5", "Write する", "する — melakukan", "Tulis bentuk ます・て・ない・た dan tiga kata benda yang dapat dipakai dengan する.", { hints: ["Irregular verb"] }),
  // Conjugation drills — N4
  prompt("conjugation-n4-01", "CONJUGATION", "N4", "Potential 話す", "話す（はなす）— berbicara", "Tulis bentuk potensial, negatif potensial, dan lampau potensial. Gunakan satu bentuk dalam kalimat.", { pattern: "Godan: す → せる" }),
  prompt("conjugation-n4-02", "CONJUGATION", "N4", "Volitional 見る", "見る（みる）— melihat", "Tulis bentuk volitional biasa dan sopan, lalu buat ajakan dalam konteks.", { pattern: "見よう／見ましょう" }),
  prompt("conjugation-n4-03", "CONJUGATION", "N4", "Conditional 買う", "買う（かう）— membeli", "Tulis bentuk ～たら dan ～ば, lalu buat satu kalimat untuk masing-masing.", { pattern: "買ったら／買えば" }),
  prompt("conjugation-n4-04", "CONJUGATION", "N4", "Imperative 待つ", "待つ（まつ）— menunggu", "Tulis bentuk perintah biasa, larangan, dan permintaan sopan. Catat perbedaan nuansanya.", { pattern: "待て／待つな／待ってください" }),
  // Conjugation drills — N3
  prompt("conjugation-n3-01", "CONJUGATION", "N3", "Passive 読む", "読む（よむ）— membaca", "Tulis bentuk pasif biasa, negatif, dan lampau. Buat satu kalimat pasif lengkap.", { pattern: "読まれる" }),
  prompt("conjugation-n3-02", "CONJUGATION", "N3", "Causative 行く", "行く（いく）— pergi", "Tulis bentuk kausatif biasa, negatif, dan lampau. Buat satu kalimat dengan pelaku dan orang yang disuruh.", { pattern: "行かせる" }),
  prompt("conjugation-n3-03", "CONJUGATION", "N3", "Causative-passive 食べる", "食べる（たべる）— makan", "Tulis bentuk kausatif-pasif biasa dan lampau, lalu gunakan dalam satu kalimat.", { pattern: "食べさせられる" }),
  prompt("conjugation-n3-04", "CONJUGATION", "N3", "Honorific 来る", "来る（くる）— datang", "Tulis bentuk biasa, sopan, potensial, pasif, dan bentuk honorifik yang umum. Buat satu contoh sopan.", { pattern: "来る／来ます／来られる／いらっしゃる" }),
];

export function getPromptsByLevel(level: KakouLevel): KakouPrompt[] {
  return KAKOU_PROMPTS.filter((item) => item.level === level);
}
