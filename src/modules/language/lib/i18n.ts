export type Lang = "en" | "id";

export const translations = {
  en: {
    // ── Auth ────────────────────────────────────────────────
    authWelcome: "Welcome to Nihongo Flow",
    authSubtitle: "Log in or create an account to save your progress.",
    authLogin: "Login",
    authRegister: "Register",
    authLogout: "Logout",
    authUsername: "Username",
    authName: "Display Name",
    authPassword: "Password",
    authUsernameHint: "Min. 3 characters, e.g. FajarWG",
    authPasswordHint: "Min. 6 characters",
    authShow: "Show",
    authHide: "Hide",
    authLoggingIn: "Logging in\u2026",
    authRegistering: "Registering\u2026",
    authOr: "or",
    authContinueGuest: "Continue without login",
    authGuestWarning:
      "Guest data is stored in this browser only and will be lost if you clear browser data. We recommend logging in.",
    authGuestModeTitle: "Guest Mode",
    authGuestModeDesc:
      "Your progress is stored in this browser only \u2014 it will be lost if you clear browser data.",
    authLoginRecommended: "Log in to save permanently.",

    // ── Common ──────────────────────────────────────────────
    home: "\uD83C\uDFE0 Home",
    back: "← Back",
    cancel: "Cancel",
    admin: "Admin",
    saving: "Saving…",

    // ── Stats ───────────────────────────────────────────────
    totalClicks: "total clicks",
    totalWrong: "total wrong",
    clicksPlusWrong: "clicks + wrong",

    // ── Brand ───────────────────────────────────────────────
    brandDesc: "Learn to Read Hiragana & Katakana",

    // ── Home page ───────────────────────────────────────────
    addStory: "+ Add Story",
    addFirstStory: "+ Add First Story",
    continueReading: "✨ Continue reading today",
    timesRead: "x read",
    chooseStory: "📚 Choose Story",
    noStoriesTitle: "No stories yet",
    noStoriesDesc: "Start by adding your first story for reading practice.",
    recommendedStories: "📖 Recommended Stories",
    recommendedStoriesDesc: "Click a story to start reading",

    // ── Story Picker Modal ──────────────────────────────────
    storiesAvailable: "{n} stories available · sorted by least read",

    // ── Bottom Nav ──────────────────────────────────────────
    navStories: "Stories",
    navProgress: "Progress",
    navKana: "Kana",

    // ── Learn page ──────────────────────────────────────────
    learnTitle: "Learning Progress",
    learnSubtitle: "Kana you've explored",
    noProgressTitle: "No progress yet",
    noProgressDesc:
      "Start reading stories and click kana characters to track your progress.",
    goToStories: "Go to Story List",
    needsReview: "⚠️ Needs Review",
    allLookedUp: "📖 Kana you looked up",
    kanjiLookedUp: "🈶 Kanji you looked up",
    characters: "characters",

    // ── Kana reference page ─────────────────────────────────
    kanaRefTitle: "Kana Reference",
    kanaBasic: "Basic",
    kanaDakuten: "Dakuten & Handakuten",
    kanaYoon: "Combinations (Yōon)",

    // ── Read page ───────────────────────────────────────────
    readingModeTitle: "📖 Reading Mode",
    readingModeDesc:
      "Click kana characters (underlined) to see how to read them. Each click is recorded to track progress.",
    reviewModeTitle: "✅ Review Mode",
    reviewModeDesc:
      "After finishing reading, mark characters you read wrong. Results are saved automatically.",
    progressSaved: "Your click progress is saved automatically ✨",
    createdOn: "Created",
    lessThanMinute: "< 1 min",
    minutes: "min",

    // ── Reader component ────────────────────────────────────
    finishReading: "Finish Reading",
    backToReading: "← Back to Reading",
    markedWrong: "kana marked wrong",
    noneMarked: "None marked yet — tap characters you read wrong",
    submitWrong: "Submit ({n} wrong)",
    submitPerfect: "Submit — All Correct ✓",
    fromOrigin: "from",
    resultOf: "of",
    resultKanaRead: "kana read correctly",
    resultWrong: "wrong",
    needsStudy: "📚 Needs more practice:",
    perfectScore: "🌟 Amazing! All kana read correctly!",
    debtReduced: "Reading debt for this story's kana reduced by 1 ✓",
    countdownPrefix: "Returning to home in",
    goHomeNow: "Go Home Now",
    storyMeaning: "Story Meaning",

    // ── New story page ──────────────────────────────────────
    newStoryNavLabel: "Add Story",
    addNewStoryTitle: "Add New Story",
    addNewStoryDesc:
      "Enter Japanese text for reading practice. Kana will be detected automatically.",
    goHomeLabel: "← Home",
    storyTitleLabel: "Story Title",
    storyContentLabel: "Content",
    storyContentHint: "(Japanese text)",
    storyTranslationLabel: "Translation",
    storyTranslationHint:
      "(Indonesian translation, optional) — separate sentences with periods (.)",
    storyFocusLabel: "Focus Characters",
    storyFocusHint: "(brief description of kana in this story, optional)",
    saveStory: "Save Story",
    batchFormat: "📋 Required JSON format",
    showTemplate: "Show template",
    hideTemplate: "Hide",
    useTemplate: "Use this template",
    pasteJson: "Paste JSON here",
    jsonMaxItems: "Unlimited items. Each entry is validated before saving.",
    saveAll: "Save All",
    required: "required",
    optional: "optional",
    batchSuccess: "Successfully saved {n} stories. Redirecting to home…",
    singleTabLabel: "Single Story",
    batchTabLabel: "Batch (JSON)",

    // ── Error messages ──────────────────────────────────────
    titleRequired: "Title is required.",
    contentRequired: "Content is required.",
    jsonInvalid: "Invalid JSON. Check the format and punctuation.",
    jsonNotArray: "JSON must be an array: [ {...}, {...} ]",
    jsonEmpty: "Array must not be empty.",
    jsonBadItem: "Item {n}: must be an object.",
    jsonMissingTitle: "Item {n}: field 'title' is required.",
    jsonMissingContent: "Item {n}: field 'content' is required.",
    serverError: "A server error occurred.",



    // ── Credits / About ─────────────────────────────────────────
    creditsAbout: "About",
    creditsTitle: "About Nihongo Flow",
    creditsProjectDesc:
      "An open-source Japanese study suite \u2014 practice reading, master verb conjugations with Kotoba Flex, review SRS flashcards, and prep lesson sheets. Free, no ads, no tracking.",
    creditsMadeBy: "Made by",
    creditsContact: "Suggestions & feedback:",
    creditsOpenSource: "Open Source on GitHub",

    // ── Prep & Anki ─────────────────────────────────────────────
    prepTitle: "Pre-Class Prep & Cheat Sheet",
    prepSubtitle:
      "Prepare your lessons with dialogues, grammar, and vocabulary.",
    prepSelectChapter: "Select Chapter",
    prepSelectPoint: "Select Point",
    prepPointLabel: "Point {n}",
    prepNoDataTitle: "No study materials yet",
    prepNoDataDesc:
      "There is no study data for this chapter and point in the database.",
    prepUploadInstruction: "How to Upload Data",
    prepLLMPromptTitle: "AI LLM Prompt",
    prepCopyPrompt: "Copy Prompt",
    prepPromptCopied: "Prompt copied to clipboard!",
    prepPasteJsonLabel: "Paste generated JSON here",
    prepAudioSelectLabel: "Select associated audios",
    prepNoAudioAvailable:
      "No audio files found. Place mp3 files in public/audio/.",
    prepSaveData: "Save & Start Studying",
    prepEditData: "Edit Lesson Data",
    prepDialogTitle: "💬 Dialogue",
    prepGrammarTitle: "📚 Grammar Explanations",
    prepVocabularyTitle: "📝 Vocabulary (Kotoba) List",
    prepExercisesTitle: "✍️ Exercises",
    prepTabMateri: "💬 Lessons & Exercises",
    prepTabVocabulary: "📝 Vocabulary (Kotoba)",
    prepTabAudio: "🎵 Audio Player",
    prepTabGrammar: "📚 Grammar",
    prepTogglesLabel: "Self-Test Options:",
    prepToggleHiragana: "Hide/Show Hiragana",
    prepToggleTranslation: "Hide/Show Translation",
    prepPlayAudio: "Play Audio",
    prepSaveSuccess: "Lesson data saved successfully!",
    prepSaveFailed:
      "Failed to save lesson data. Make sure JSON format is correct.",
    prepExercisePromptPlaceholder: "Type your sentence here...",
    prepExerciseShowAnswer: "Show Answer Key",
    prepExerciseHideAnswer: "Hide Answer Key",
    prepExerciseCorrectAnswerLabel: "Answer Key (LLM):",
    prepExerciseCheckButton: "Check Answer",

    ankiTitle: "Anki",
    ankiSubtitle: "Spaced repetition (SRS).",
    ankiCardCount: "{n} cards left for today",
    ankiCardDue: "Due",
    ankiCardNew: "New",
    ankiFlipCard: "Tap Card to Flip",
    ankiAgain: "Again",
    ankiHard: "Hard",
    ankiGood: "Good",
    ankiEasy: "Easy",
    ankiFinishedTitle: "Session Completed! 🎉",
    ankiFinishedDesc: "You have reviewed all cards due for today. Keep it up!",
    ankiResetSession: "Study Again",
    ankiNoCardsTitle: "No cards to review",
    ankiNoCardsDesc:
      "There are no vocabulary cards for the selected chapter/point.",
    ankiFilterChapter: "Filter by Chapter",
    ankiFilterPoint: "Filter by Point",
    ankiAllChapters: "All Chapters",
    ankiAllPoints: "All Points",
  },
  id: {
    // ── Auth ────────────────────────────────────────────────
    authWelcome: "Selamat Datang di Nihongo Flow",
    authSubtitle: "Masuk atau daftar untuk menyimpan progresmu.",
    authLogin: "Masuk",
    authRegister: "Daftar",
    authLogout: "Keluar",
    authUsername: "Username",
    authName: "Nama Tampilan",
    authPassword: "Password",
    authUsernameHint: "Min. 3 karakter, misal FajarWG",
    authPasswordHint: "Min. 6 karakter",
    authShow: "Tampilkan",
    authHide: "Sembunyikan",
    authLoggingIn: "Sedang masuk\u2026",
    authRegistering: "Sedang mendaftar\u2026",
    authOr: "atau",
    authContinueGuest: "Lanjut tanpa login",
    authGuestWarning:
      "Data tamu hanya tersimpan di browser ini dan akan hilang jika browser dibersihkan. Kami sarankan untuk login.",
    authGuestModeTitle: "Mode Tamu",
    authGuestModeDesc:
      "Progresmu hanya tersimpan di browser ini \u2014 akan hilang jika browser dibersihkan.",
    authLoginRecommended: "Login untuk simpan secara permanen.",

    // ── Common ──────────────────────────────────────────────
    home: "\uD83C\uDFE0 Beranda",
    back: "← Kembali",
    cancel: "Batal",
    admin: "Admin",
    saving: "Menyimpan…",

    // ── Stats ───────────────────────────────────────────────
    totalClicks: "total klik",
    totalWrong: "total salah",
    clicksPlusWrong: "klik + salah",

    // ── Brand ───────────────────────────────────────────────
    brandDesc: "Belajar Baca Hiragana & Katakana",

    // ── Home page ───────────────────────────────────────────
    addStory: "+ Tambah Cerita",
    addFirstStory: "+ Tambah Cerita Pertama",
    continueReading: "✨ Lanjut membaca hari ini",
    timesRead: "x dibaca",
    chooseStory: "📚 Pilih Cerita",
    noStoriesTitle: "Belum ada cerita",
    noStoriesDesc:
      "Mulai dengan menambah cerita pertama untuk latihan membaca.",
    recommendedStories: "📖 Rekomendasi Cerita",
    recommendedStoriesDesc: "Klik cerita untuk langsung mulai membaca",

    // ── Story Picker Modal ──────────────────────────────────
    storiesAvailable:
      "{n} cerita tersedia · diurutkan dari paling jarang dibaca",

    // ── Bottom Nav ──────────────────────────────────────────
    navStories: "Cerita",
    navProgress: "Progres",
    navKana: "Kana",

    // ── Learn page ──────────────────────────────────────────
    learnTitle: "Progres Belajar",
    learnSubtitle: "Kana yang pernah kamu jelajahi",
    noProgressTitle: "Belum ada progres",
    noProgressDesc:
      "Mulai membaca cerita dan klik huruf kana untuk melacak progresmu.",
    goToStories: "Ke Daftar Cerita",
    needsReview: "⚠️ Perlu Dipelajari Lagi",
    allLookedUp: "📖 Kana yang di contek",
    kanjiLookedUp: "🈶 Kanji yang kamu lihat artinya",
    characters: "huruf",

    // ── Kana reference page ─────────────────────────────────
    kanaRefTitle: "Referensi Kana",
    kanaBasic: "Dasar",
    kanaDakuten: "Dakuten & Handakuten",
    kanaYoon: "Kombinasi (Yōon)",

    // ── Read page ───────────────────────────────────────────
    readingModeTitle: "📖 Mode Membaca",
    readingModeDesc:
      "Klik huruf kana (bergaris bawah) untuk melihat cara bacanya. Setiap klik dicatat untuk melacak progres.",
    reviewModeTitle: "✅ Mode Review",
    reviewModeDesc:
      "Setelah selesai membaca, tandai huruf yang salah dibaca. Hasilnya tersimpan otomatis.",
    progressSaved: "Progres klikmu tersimpan otomatis di database ✨",
    createdOn: "Dibuat",
    lessThanMinute: "< 1 menit",
    minutes: "menit",

    // ── Reader component ────────────────────────────────────
    finishReading: "Selesai Membaca",
    backToReading: "← Kembali Membaca",
    markedWrong: "kana ditandai salah",
    noneMarked: "Belum ada yang ditandai — tap huruf yang salah baca",
    submitWrong: "Submit Hasil ({n} salah)",
    submitPerfect: "Submit — Semua Benar ✓",
    fromOrigin: "dari",
    resultOf: "dari",
    resultKanaRead: "kana dibaca benar",
    resultWrong: "salah",
    needsStudy: "📚 Perlu dipelajari lagi:",
    perfectScore: "🌟 Luar biasa! Semua kana dibaca dengan benar!",
    debtReduced: "Hutang bacaan untuk kana di cerita ini dikurangi 1 ✓",
    countdownPrefix: "Kembali ke beranda dalam",
    goHomeNow: "Ke Beranda Sekarang",
    storyMeaning: "Arti Cerita",

    // ── New story page ──────────────────────────────────────
    newStoryNavLabel: "Tambah Cerita",
    addNewStoryTitle: "Tambah Cerita Baru",
    addNewStoryDesc:
      "Masukkan teks Jepang untuk latihan membaca. Kana akan dideteksi otomatis.",
    goHomeLabel: "← Beranda",
    storyTitleLabel: "Judul Cerita",
    storyContentLabel: "Konten",
    storyContentHint: "(teks Jepang)",
    storyTranslationLabel: "Arti",
    storyTranslationHint:
      "(terjemahan Indonesia, opsional) — pisahkan kalimat dengan titik (.)",
    storyFocusLabel: "Fokus Huruf",
    storyFocusHint: "(deskripsi singkat kana di cerita ini, opsional)",
    saveStory: "Simpan Cerita",
    batchFormat: "📋 Format JSON yang diperlukan",
    showTemplate: "Lihat template",
    hideTemplate: "Sembunyikan",
    useTemplate: "Pakai template ini",
    pasteJson: "Tempel JSON di sini",
    jsonMaxItems:
      "Maksimum tidak terbatas. Setiap item divalidasi sebelum disimpan.",
    saveAll: "Simpan Semua",
    required: "wajib",
    optional: "opsional",
    batchSuccess: "Berhasil menyimpan {n} cerita. Mengarahkan ke beranda…",
    singleTabLabel: "Satu Cerita",
    batchTabLabel: "Batch (JSON)",

    // ── Error messages ──────────────────────────────────────
    titleRequired: "Judul wajib diisi.",
    contentRequired: "Konten wajib diisi.",
    jsonInvalid: "JSON tidak valid. Periksa format dan tanda baca.",
    jsonNotArray: "JSON harus berupa array: [ {...}, {...} ]",
    jsonEmpty: "Array tidak boleh kosong.",
    jsonBadItem: "Item ke-{n}: harus berupa object.",
    jsonMissingTitle: "Item ke-{n}: field 'title' wajib diisi.",
    jsonMissingContent: "Item ke-{n}: field 'content' wajib diisi.",
    serverError: "Terjadi kesalahan server.",



    // ── Credits / About ─────────────────────────────────────────
    creditsAbout: "Tentang",
    creditsTitle: "Tentang Nihongo Flow",
    creditsProjectDesc:
      "Aplikasi belajar bahasa Jepang open-source \u2014 latihan membaca cerita, kuasai konjugasi kata kerja (Kotoba Flex), SRS flashcards, dan lembar persiapan kelas. Gratis, tanpa iklan, tanpa pelacakan.",
    creditsMadeBy: "Dibuat oleh",
    creditsContact: "Saran & masukan:",
    creditsOpenSource: "Open Source di GitHub",

    // ── Prep & Anki ─────────────────────────────────────────────
    prepTitle: "Pre-Class Prep & Cheat Sheet",
    prepSubtitle:
      "Persiapkan materi belajar dengan percakapan, tata bahasa, dan kosakata.",
    prepSelectChapter: "Pilih Bab",
    prepSelectPoint: "Pilih Poin Pembahasan",
    prepPointLabel: "Poin {n}",
    prepNoDataTitle: "Belum ada materi belajar",
    prepNoDataDesc:
      "Data persiapan untuk bab dan poin pembahasan ini belum diunggah.",
    prepUploadInstruction: "Cara Unggah Data",
    prepLLMPromptTitle: "Prompt AI / LLM",
    prepCopyPrompt: "Salin Prompt",
    prepPromptCopied: "Prompt berhasil disalin!",
    prepPasteJsonLabel: "Tempel JSON hasil generate di sini",
    prepAudioSelectLabel: "Pilih audio yang sesuai",
    prepNoAudioAvailable:
      "Berkas audio tidak ditemukan. Taruh file mp3 di public/audio/.",
    prepSaveData: "Simpan & Mulai Belajar",
    prepEditData: "Edit Data Persiapan",
    prepDialogTitle: "💬 Percakapan",
    prepGrammarTitle: "📚 Penjelasan Tata Bahasa",
    prepVocabularyTitle: "📝 Daftar Kosakata (Kotoba)",
    prepExercisesTitle: "✍️ Latihan Soal",
    prepTabMateri: "💬 Materi & Latihan",
    prepTabVocabulary: "📝 Kosakata (Kotoba)",
    prepTabAudio: "🎵 Putar Audio",
    prepTabGrammar: "📚 Tata Bahasa",
    prepTogglesLabel: "Opsi Tebakan:",
    prepToggleHiragana: "Sembunyikan/Tampilkan Hiragana",
    prepToggleTranslation: "Sembunyikan/Tampilkan Arti",
    prepPlayAudio: "Putar Audio",
    prepSaveSuccess: "Data materi berhasil disimpan!",
    prepSaveFailed: "Gagal menyimpan materi. Pastikan format JSON sudah benar.",
    prepExercisePromptPlaceholder: "Ketik kalimat Anda di sini...",
    prepExerciseShowAnswer: "Tampilkan Kunci Jawaban",
    prepExerciseHideAnswer: "Sembunyikan Kunci Jawaban",
    prepExerciseCorrectAnswerLabel: "Kunci Jawaban (LLM):",
    prepExerciseCheckButton: "Cek Jawaban",

    ankiTitle: "Anki Flashcards",
    ankiSubtitle: "Hafalkan kosakata dengan metode spaced repetition (SRS).",
    ankiCardCount: "Sisa {n} kartu untuk hari ini",
    ankiCardDue: "Review",
    ankiCardNew: "Baru",
    ankiFlipCard: "Ketuk kartu untuk melihat jawaban",
    ankiAgain: "Ulangi (Again)",
    ankiHard: "Susah (Hard)",
    ankiGood: "Biasa (Good)",
    ankiEasy: "Mudah (Easy)",
    ankiFinishedTitle: "Sesi Belajar Selesai! 🎉",
    ankiFinishedDesc:
      "Kamu telah mereview semua kartu yang jatuh tempo hari ini. Pertahankan progresmu!",
    ankiResetSession: "Belajar Lagi",
    ankiNoCardsTitle: "Tidak ada kartu",
    ankiNoCardsDesc:
      "Kosakata tidak ditemukan untuk filter bab/poin yang dipilih.",
    ankiFilterChapter: "Filter Bab",
    ankiFilterPoint: "Filter Poin",
    ankiAllChapters: "Semua Bab",
    ankiAllPoints: "Semua Poin",
  },
} as const;

export type Translations = (typeof translations)[Lang];
