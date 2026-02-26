import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Serif_JP } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: {
    template: "%s | Read Japan",
    default: "Read Japan — Belajar Baca Hiragana & Katakana",
  },
  description:
    "Latihan membaca teks Jepang dengan Hiragana dan Katakana. Klik huruf untuk melihat cara bacanya.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body
        className={`${
          geistSans.variable
        } ${geistMono.variable} ${notoSerifJP.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
