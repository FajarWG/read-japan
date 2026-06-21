import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginPageContent } from "@/src/modules/auth/components/LoginPageContent";
import { getSession } from "@/src/shared/lib/session";

export const metadata: Metadata = { title: "Login" };

export default async function LoginPage() {
  const session = await getSession();
  // Sudah login → langsung ke home (atau ?next= jika ada).
  if (session) {
    redirect("/");
  }
  return <LoginPageContent />;
}
