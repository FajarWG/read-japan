"use server";

import { prisma } from "@/src/shared/lib/db";
import bcrypt from "bcryptjs";
import {
  createSession,
  deleteSession,
  getSession,
} from "@/src/shared/lib/session";
import { redirect } from "next/navigation";

export type AuthResult = { success: true } | { success: false; error: string };

// ─────────────────────────────────────────
// Login
// ─────────────────────────────────────────

export async function loginAction(
  _prev: AuthResult,
  formData: FormData,
): Promise<AuthResult> {
  const username = (formData.get("username") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { success: false, error: "Username dan password wajib diisi." };
  }

  const user = await prisma.user.findUnique({ where: { username } });
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
    name: user.name,
    role: user.role,
  });

  redirect("/");
}

// ─────────────────────────────────────────
// Register
// ─────────────────────────────────────────

export async function registerAction(
  _prev: AuthResult,
  formData: FormData,
): Promise<AuthResult> {
  const username = (formData.get("username") as string)?.trim().toLowerCase();
  const name = (formData.get("name") as string)?.trim();
  const password = formData.get("password") as string;

  if (!username || !name || !password) {
    return { success: false, error: "Semua field wajib diisi." };
  }
  if (username.length < 3) {
    return { success: false, error: "Username minimal 3 karakter." };
  }
  if (password.length < 6) {
    return { success: false, error: "Password minimal 6 karakter." };
  }

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    return { success: false, error: "Username sudah digunakan." };
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { username, name, password: hashed },
  });

  await createSession({
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
  });

  redirect("/");
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
