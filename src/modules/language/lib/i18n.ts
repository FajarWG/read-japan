export type Lang = "en" | "id";

export const translations = {
  en: {
    // ── Auth ────────────────────────────────────────────────
    authWelcome: "Welcome to Read Japan",
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

    // ── Onboarding ────────────────────────────────────────────────────
    onboardingSlide1Title: "Welcome to Read Japan! \uD83D\uDC4B",
    onboardingSlide1Desc:
      "Practice reading Japanese Hiragana & Katakana through real stories. It\u2019s free and works without an account.",
    onboardingSlide2Title: "Reading Mode \uD83D\uDCDA",
    onboardingSlide2Desc:
      "Tap underlined kana characters to see their reading. Every tap is tracked automatically so you can review later.",
    onboardingSlide3Title: "Review Mode \u2705",
    onboardingSlide3Desc:
      "After finishing a story, mark the characters you misread. Results are saved \u2014 the app builds your personal review list.",
    onboardingSlide4Title: "Track Your Progress \uD83D\uDCCA",
    onboardingSlide4Desc:
      "The Progress tab shows every kana you\u2019ve looked up and highlights those needing more practice.",
    onboardingSlide5Title: "Save Your Progress \uD83D\uDD10",
    onboardingSlide5Desc:
      "Guest data lives only in this browser. Log in to sync your progress to the cloud and access it anywhere.",
    onboardingDontShow: "Don\u2019t show again",
    onboardingNext: "Next \u2192",
    onboardingBack: "\u2190 Back",
    onboardingStart: "Start Learning!",
    onboardingGuide: "Guide",
    onboardingClose: "Close",
  },
  id: {
    // ── Auth ────────────────────────────────────────────────
    authWelcome: "Selamat Datang di Read Japan",
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

    // ── Onboarding ────────────────────────────────────────────────────
    onboardingSlide1Title: "Selamat Datang di Read Japan! \uD83D\uDC4B",
    onboardingSlide1Desc:
      "Latihan membaca Hiragana & Katakana Jepang melalui cerita nyata. Gratis dan bisa dipakai tanpa akun.",
    onboardingSlide2Title: "Mode Membaca \uD83D\uDCDA",
    onboardingSlide2Desc:
      "Tap huruf kana yang bergaris bawah untuk melihat cara bacanya. Setiap tap dicatat otomatis agar bisa direview.",
    onboardingSlide3Title: "Mode Review \u2705",
    onboardingSlide3Desc:
      "Setelah selesai membaca, tandai huruf yang salah baca. Hasilnya tersimpan \u2014 app akan membuat daftar review pribadimu.",
    onboardingSlide4Title: "Lacak Progresmu \uD83D\uDCCA",
    onboardingSlide4Desc:
      "Tab Progres menampilkan semua kana yang pernah kamu buka dan menyoroti yang perlu lebih banyak latihan.",
    onboardingSlide5Title: "Simpan Progresmu \uD83D\uDD10",
    onboardingSlide5Desc:
      "Data tamu hanya tersimpan di browser ini. Login untuk menyinkronkan progres ke cloud dan akses dari mana saja.",
    onboardingDontShow: "Jangan tampilkan lagi",
    onboardingNext: "Selanjutnya \u2192",
    onboardingBack: "\u2190 Kembali",
    onboardingStart: "Mulai Belajar!",
    onboardingGuide: "Panduan",
    onboardingClose: "Tutup",
  },
} as const;

export type Translations = (typeof translations)[Lang];
