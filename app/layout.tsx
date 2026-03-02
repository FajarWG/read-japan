import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Serif_JP } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/src/modules/theme/components/ThemeProvider";
import { LanguageProvider } from "@/src/modules/language/components/LanguageProvider";
import { AuthProvider } from "@/src/modules/auth/components/AuthProvider";
import { BottomNav } from "@/src/shared/components/BottomNav";
import { PageTransition } from "@/src/shared/components/PageTransition";
import { OnboardingGuide } from "@/src/modules/onboarding/components/OnboardingGuide";
import { getSession } from "@/src/shared/lib/session";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Font Jepang — digunakan di teks cerita
const notoSerifJP = Noto_Serif_JP({
  variable: "--font-noto-serif-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const BASE_URL = "https://read-japan.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    template: "%s | Read Japan",
    default: "Read Japan — Belajar Baca Hiragana & Katakana",
  },
  description:
    "Aplikasi web gratis untuk latihan membaca Hiragana dan Katakana bahasa Jepang. Baca cerita pendek, klik huruf untuk melihat cara bacanya, dan lacak progres belajarmu.",
  keywords: [
    "belajar hiragana",
    "belajar katakana",
    "belajar bahasa Jepang",
    "latihan membaca Jepang",
    "hiragana online",
    "katakana online",
    "Japanese reading practice",
    "learn Japanese",
    "read Japan",
    "aplikasi belajar Jepang",
  ],
  authors: [{ name: "FajarWG", url: "https://github.com/fajarwg" }],
  creator: "FajarWG",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    alternateLocale: "en_US",
    url: BASE_URL,
    siteName: "Read Japan",
    title: "Read Japan — Belajar Baca Hiragana & Katakana",
    description:
      "Aplikasi web gratis untuk latihan membaca Hiragana dan Katakana bahasa Jepang. Baca cerita pendek dan lacak progres belajarmu.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Read Japan — Belajar Baca Hiragana & Katakana",
    description:
      "Aplikasi web gratis untuk latihan membaca Hiragana dan Katakana bahasa Jepang.",
    creator: "@fajarwg",
  },
  alternates: {
    canonical: BASE_URL,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getSession();
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        {/* Prevent flash of wrong theme — runs before React hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme');var dark=t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches);document.documentElement.classList.toggle('dark',dark);document.documentElement.setAttribute('data-theme',dark?'dark':'light');})();`,
          }}
        />
      </head>
      <body
        className={`${
          geistSans.variable
        } ${geistMono.variable} ${notoSerifJP.variable} antialiased bg-background text-foreground pb-24`}
      >
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider user={user}>
              <PageTransition>{children}</PageTransition>
              <BottomNav />
              <OnboardingGuide />
              <p className="fixed bottom-1 left-0 right-0 text-center text-[10px] text-foreground/50 pointer-events-none select-none z-40">
                © 2026 FajarWG
              </p>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
