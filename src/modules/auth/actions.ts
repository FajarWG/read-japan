"use server";

import { prisma } from "@/src/shared/lib/db";
import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import {
  createSession,
  deleteSession,
  getSession,
} from "@/src/shared/lib/session";
import { redirect } from "next/navigation";

export type AuthResult = { success: true } | { success: false; error: string };

/**
 * Sanitasi tujuan redirect dari `?next=` agar tidak menjadi open-redirect.
 * Hanya izinkan path absolut yang dimulai dengan "/" dan BUKAN "//"
 * (protocol-relative URL).
 */
async function safeNextPath(): Promise<string> {
  try {
    const h = await headers();
    // Next.js menyusun URL penuh di header `referer` saat form dipost
    // — kita ambil path saja dari situ.
    const ref = h.get("referer");
    if (ref) {
      const u = new URL(ref);
      const next = u.searchParams.get("next");
      if (next && next.startsWith("/") && !next.startsWith("//")) return next;
    }
  } catch {
    /* ignore */
  }
  return "/";
}

// ─────────────────────────────────────────
// Login
// ─────────────────────────────────────────

export async function loginAction(
  _prev: AuthResult,
  formData: FormData,
): Promise<AuthResult> {
  const username = (formData.get("username") as string)?.trim();
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { success: false, error: "Username dan password wajib diisi." };
  }

  const user = await prisma.user.findFirst({
    where: { username: { equals: username, mode: "insensitive" } },
  });
  if (!user) {
    return { success: false, error: "Username atau password salah." };
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return { success: false, error: "Username atau password salah." };
  }

  await createSession({
    id: user.id,
    username: user.username,
    role: user.role,
  });

  redirect(await safeNextPath());
}

// ─────────────────────────────────────────
// Register
// ─────────────────────────────────────────

export async function registerAction(
  _prev: AuthResult,
  formData: FormData,
): Promise<AuthResult> {
  const username = (formData.get("username") as string)?.trim();
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { success: false, error: "Username dan password wajib diisi." };
  }
  if (username.length < 3) {
    return { success: false, error: "Username minimal 3 karakter." };
  }
  if (password.length < 6) {
    return { success: false, error: "Password minimal 6 karakter." };
  }

  const existing = await prisma.user.findFirst({
    where: { username: { equals: username, mode: "insensitive" } },
  });
  if (existing) {
    return { success: false, error: "Username sudah digunakan." };
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { username, password: hashed },
  });

  await createSession({
    id: user.id,
    username: user.username,
    role: user.role,
  });

  redirect(await safeNextPath());
}

// ─────────────────────────────────────────
// Logout
// ─────────────────────────────────────────

export async function logoutAction(): Promise<void> {
  await deleteSession();
  redirect("/");
}

// ─────────────────────────────────────────
// Get current session (re-export for client use via server actions)
// ─────────────────────────────────────────

export async function getSessionAction() {
  return getSession();
}
