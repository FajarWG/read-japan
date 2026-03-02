import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Offline — Tidak Ada Koneksi",
  description: "Perangkat Anda sedang offline.",
};

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="max-w-sm mx-auto space-y-6">
        {/* Icon */}
        <div className="text-7xl">📡</div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-foreground">
          Tidak Ada Koneksi
        </h1>

        {/* Description */}
        <p className="text-foreground/60 text-sm leading-relaxed">
          Kamu sedang offline. Beberapa halaman yang sudah pernah dibuka masih
          bisa diakses, tapi koneksi internet diperlukan untuk memuat konten
          baru.
        </p>

        {/* Tips */}
        <div className="bg-content1 rounded-2xl p-4 text-left space-y-2">
          <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wide">
            Yang bisa dilakukan
          </p>
          <ul className="text-sm text-foreground/70 space-y-1">
            <li>• Periksa koneksi Wi-Fi atau data seluler</li>
            <li>• Coba buka halaman yang sudah pernah dikunjungi</li>
            <li>• Halaman Kana dan Learn tersedia offline</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-medium"
          >
            Coba Lagi
          </button>
          <Link
            href="/kana"
            className="px-5 py-2.5 bg-content2 text-foreground rounded-xl text-sm font-medium"
          >
            Buka Kana
          </Link>
        </div>
      </div>
    </div>
  );
}
