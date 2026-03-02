"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  TextField,
  Label,
  Input,
  FieldError,
  Separator,
} from "@heroui/react";
import { loginAction, registerAction } from "@/src/modules/auth/actions";
import { ThemeToggle } from "@/src/modules/theme/components/ThemeToggle";
import { LanguageToggle } from "@/src/modules/language/components/LanguageToggle";
import { useLanguage } from "@/src/modules/language/components/LanguageProvider";

type AuthResult = { success: true } | { success: false; error: string };
const idle: AuthResult = { success: false, error: "" };

// ─────────────────────────────────────────
// LoginPageContent
// ─────────────────────────────────────────

export function LoginPageContent() {
  const { t } = useLanguage();
  const router = useRouter();
  const [loginResult, loginDispatch, loginPending] = useActionState(
    loginAction,
    idle,
  );
  const [registerResult, registerDispatch, registerPending] = useActionState(
    registerAction,
    idle,
  );

  const [showPass, setShowPass] = useState(false);
  const [showPassReg, setShowPassReg] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      {/* Top bar */}
      <div className="mb-8 flex w-full max-w-lg items-center justify-between">
        <div>
          <h1 className="font-jp text-lg font-bold leading-tight text-foreground">
            読む日本語
            <span className="ml-2 font-sans text-sm font-normal text-muted">
              Read Japan
            </span>
          </h1>
          <p className="text-xs text-muted">{t.brandDesc}</p>
        </div>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>

      {/* Card */}
      <Card className="w-full max-w-lg  bg-transparent  rounded-2xl overflow-hidden">
        <CardHeader className="px-6 pt-6 pb-2">
          <CardTitle className="text-lg font-bold text-foreground">
            {t.authWelcome}
          </CardTitle>
          <p className="text-sm text-muted mt-1">{t.authSubtitle}</p>
        </CardHeader>

        <CardContent className="px-6 pb-6">
          {/* ── Custom tab switcher ── */}
          <div className="flex border-b border-border mt-2 mb-1">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={[
                "relative flex-1 py-2.5 text-sm font-medium transition-colors duration-200",
                mode === "login"
                  ? "text-foreground"
                  : "text-muted hover:text-foreground/80",
              ].join(" ")}
            >
              {t.authLogin}
              <span
                className={[
                  "absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-accent transition-opacity duration-200",
                  mode === "login" ? "opacity-100" : "opacity-0",
                ].join(" ")}
              />
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={[
                "relative flex-1 py-2.5 text-sm font-medium transition-colors duration-200",
                mode === "register"
                  ? "text-foreground"
                  : "text-muted hover:text-foreground/80",
              ].join(" ")}
            >
              {t.authRegister}
              <span
                className={[
                  "absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-accent transition-opacity duration-200",
                  mode === "register" ? "opacity-100" : "opacity-0",
                ].join(" ")}
              />
            </button>
          </div>

          {/* ── Sliding panels ── */}
          <div className="overflow-hidden">
            <div
              className="grid transition-transform duration-300 ease-in-out"
              style={{
                gridTemplateColumns: "repeat(2, 100%)",
                transform:
                  mode === "login" ? "translateX(0)" : "translateX(-50%)",
              }}
            >
              {/* ── Login panel ── */}
              <div
                className="pt-4"
                aria-hidden={mode !== "login"}
                style={{ pointerEvents: mode === "login" ? "auto" : "none" }}
              >
                <form action={loginDispatch} className="flex flex-col gap-4">
                  <TextField
                    name="username"
                    fullWidth
                    className="flex flex-col gap-1.5"
                  >
                    <Label className="text-sm font-medium text-foreground">
                      {t.authUsername}
                    </Label>
                    <Input
                      placeholder="contoh: fajar123"
                      autoComplete="username"
                      autoCapitalize="none"
                      required
                      className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                    <FieldError className="text-xs text-red-500" />
                  </TextField>

                  <TextField
                    name="password"
                    fullWidth
                    className="flex flex-col gap-1.5"
                  >
                    <Label className="text-sm font-medium text-foreground">
                      {t.authPassword}
                    </Label>
                    <div className="relative">
                      <Input
                        placeholder="••••••••"
                        type={showPass ? "text" : "password"}
                        autoComplete="current-password"
                        required
                        className="w-full rounded-xl border border-border bg-background px-3 py-2 pr-16 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass((p) => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted hover:text-foreground transition-colors"
                      >
                        {showPass ? t.authHide : t.authShow}
                      </button>
                    </div>
                    <FieldError className="text-xs text-red-500" />
                  </TextField>

                  {!loginResult.success && loginResult.error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
                      ⚠️ {loginResult.error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    isDisabled={loginPending}
                    className="w-full"
                  >
                    {loginPending ? t.authLoggingIn : t.authLogin}
                  </Button>
                </form>
              </div>

              {/* ── Register panel ── */}
              <div
                className="pt-4"
                aria-hidden={mode !== "register"}
                style={{ pointerEvents: mode === "register" ? "auto" : "none" }}
              >
                <form action={registerDispatch} className="flex flex-col gap-4">
                  <TextField
                    name="name"
                    fullWidth
                    className="flex flex-col gap-1.5"
                  >
                    <Label className="text-sm font-medium text-foreground">
                      {t.authName}
                    </Label>
                    <Input
                      placeholder="contoh: Fajar"
                      autoComplete="name"
                      required
                      className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                    <FieldError className="text-xs text-red-500" />
                  </TextField>

                  <TextField
                    name="username"
                    fullWidth
                    className="flex flex-col gap-1.5"
                  >
                    <Label className="text-sm font-medium text-foreground">
                      {t.authUsername}
                    </Label>
                    <Input
                      placeholder="contoh: fajar123"
                      autoComplete="username"
                      autoCapitalize="none"
                      required
                      className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                    <p className="text-[11px] text-muted">
                      {t.authUsernameHint}
                    </p>
                    <FieldError className="text-xs text-red-500" />
                  </TextField>

                  <TextField
                    name="password"
                    fullWidth
                    className="flex flex-col gap-1.5"
                  >
                    <Label className="text-sm font-medium text-foreground">
                      {t.authPassword}
                    </Label>
                    <div className="relative">
                      <Input
                        placeholder="••••••••"
                        type={showPassReg ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        className="w-full rounded-xl border border-border bg-background px-3 py-2 pr-16 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassReg((p) => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted hover:text-foreground transition-colors"
                      >
                        {showPassReg ? t.authHide : t.authShow}
                      </button>
                    </div>
                    <p className="text-[11px] text-muted">
                      {t.authPasswordHint}
                    </p>
                    <FieldError className="text-xs text-red-500" />
                  </TextField>

                  {!registerResult.success && registerResult.error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
                      ⚠️ {registerResult.error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    isDisabled={registerPending}
                    className="w-full"
                  >
                    {registerPending ? t.authRegistering : t.authRegister}
                  </Button>
                </form>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-muted">{t.authOr}</span>
            <Separator className="flex-1" />
          </div>

          {/* Guest option */}
          <div className="flex flex-col gap-2">
            <Button
              variant="secondary"
              className="w-full"
              onPress={() => router.push("/")}
            >
              {t.authContinueGuest}
            </Button>
            <p className="text-center text-[11px] text-amber-600 dark:text-amber-400 leading-snug px-2">
              ⚠️ {t.authGuestWarning}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
