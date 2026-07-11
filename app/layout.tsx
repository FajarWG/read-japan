import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Serif_JP } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/src/modules/theme/components/ThemeProvider";
import { LanguageProvider } from "@/src/modules/language/components/LanguageProvider";
import { AuthProvider } from "@/src/modules/auth/components/AuthProvider";
import { BottomNav } from "@/src/shared/components/BottomNav";
import { PageTransition } from "@/src/shared/components/PageTransition";

import { getSession } from "@/src/shared/lib/session";
import { Analytics } from "@vercel/analytics/next";
import { ServiceWorkerRegistration } from "@/src/shared/components/ServiceWorkerRegistration";

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

const APP_DESCRIPTION =
  "A focused Japanese study app: Anki SRS flashcards, Bunpou grammar, Katsuyou verb conjugation, pre-class Prep sheets, and Kotoba — your personal vocabulary notebook. English interface, Indonesian meanings.";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    template: "%s | Nihongo Flow",
    default: "Nihongo Flow — Japanese Study Suite",
  },
  description: APP_DESCRIPTION,
  keywords: [
    "learn Japanese",
    "Japanese study app",
    "anki flashcards",
    "spaced repetition Japanese",
    "Japanese grammar",
    "bunpou",
    "verb conjugation",
    "katsuyou",
    "Japanese vocabulary notebook",
    "kotoba",
    "nihongo flow",
    "JLPT prep",
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
    locale: "en_US",
    url: BASE_URL,
    siteName: "Nihongo Flow",
    title: "Nihongo Flow — Japanese Study Suite",
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Nihongo Flow — Japanese Study Suite",
    description: APP_DESCRIPTION,
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
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent flash of wrong theme — runs before React hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme');var dark=t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches);document.documentElement.classList.toggle('dark',dark);document.documentElement.setAttribute('data-theme',dark?'dark':'light');})();`,
          }}
        />
        {/* PWA meta tags */}
        <meta name="application-name" content="Nihongo Flow" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Nihongo Flow" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#dc2626" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/icons/icon-152x152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icons/icon-192x192.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="167x167"
          href="/icons/icon-192x192.png"
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
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
        <Analytics />
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
