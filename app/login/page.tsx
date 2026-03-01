import type { Metadata } from "next";
import { LoginPageContent } from "@/src/modules/auth/components/LoginPageContent";

export const metadata: Metadata = { title: "Login" };

export default function LoginPage() {
  return <LoginPageContent />;
}
