import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

/**
 * Proxy auth gate (Next.js 16 — replaces middleware).
 *
 * Setelah Phase 1, semua route (kecuali /login dan asset publik) wajib
 * memiliki cookie `rj-session` yang valid. Jika tidak ada / tidak valid,
 * redirect ke /login dengan parameter `?next=` agar user kembali ke
 * halaman yang dituju setelah berhasil login.
 *
 * Verifikasi JWT di sini (tidak query DB) — cukup untuk gate awal.
 * Page yang butuh role check (admin) tetap panggil getSession() di server.
 */

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "read-japan-secret-key-change-me-in-production",
);

const PUBLIC_PATHS = new Set<string>(["/login", "/offline", "/manifest.webmanifest"]);

function isPublicAsset(pathname: string): boolean {
  if (pathname.startsWith("/_next/")) return true;
  if (pathname.startsWith("/icons/")) return true;
  if (pathname.startsWith("/audio/")) return true;
  if (pathname.startsWith("/favicon")) return true;
  if (pathname === "/sw.js") return true;
  if (pathname === "/robots.txt") return true;
  if (pathname === "/sitemap.xml") return true;
  if (pathname.startsWith("/opengraph-image")) return true;
  if (pathname.startsWith("/twitter-image")) return true;
  if (/\.[a-zA-Z0-9]+$/.test(pathname)) return true;
  return false;
}

async function isAuthed(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    await jwtVerify(token, SECRET);
    return true;
  } catch {
    return false;
  }
}

export async function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  if (PUBLIC_PATHS.has(pathname) || isPublicAsset(pathname)) {
    return NextResponse.next();
  }

  const token = req.cookies.get("rj-session")?.value;
  if (await isAuthed(token)) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", req.url);
  if (pathname !== "/") loginUrl.searchParams.set("next", pathname + search);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sw.js|workbox-.*\\.js).*)",
  ],
};
