import Link from "next/link";
import {
  buttonVariants,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@heroui/react";

export default function StoryNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md bg-surface border border-border shadow-sm rounded-2xl text-center">
        <CardHeader className="px-8 pt-10 pb-2 flex flex-col items-center gap-2">
          <span className="text-7xl select-none">見つからない</span>
          <CardTitle className="font-jp text-2xl font-bold text-foreground mt-2">
            Cerita tidak ditemukan
          </CardTitle>
        </CardHeader>
        <CardContent className="px-8 pb-10 flex flex-col items-center gap-6">
          <p className="text-muted text-sm leading-relaxed">
            Cerita dengan ID tersebut tidak ada di database. Mungkin sudah
            dihapus atau ID-nya salah.
          </p>
          <Link
            href="/"
            className={buttonVariants({
              variant: "primary",
              className: "rounded-xl px-6",
            })}
          >
            ← Kembali ke Beranda
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
