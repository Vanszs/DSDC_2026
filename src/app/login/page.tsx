"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Eye,
  EyeOff,
  Check,
  Building2,
  Mail,
  Lock,
  Quote,
  LogIn,
  UserPlus,
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-context";

// Akun resmi yang diizinkan masuk ke sistem
const AUTHORIZED_ACCOUNT = {
  email: "hendro.prasetyo@dinkes.semarangkota.go.id",
  nip: "197804152003121002",
  password: "SandiKedinasan@2026",
  name: "Dr. Hendro Prasetyo, M.Epid",
  roleId: "dinkes" as const,
};

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  // Mode: "login" or "register"
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  // Form states (Login / Common) - Langsung Autocomplete 1 akun resmi yang valid
  const [identifier, setIdentifier] = useState<string>(AUTHORIZED_ACCOUNT.email);
  const [password, setPassword] = useState<string>(AUTHORIZED_ACCOUNT.password);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberSession, setRememberSession] = useState<boolean>(true);

  // Form states (Register)
  const [fullName, setFullName] = useState<string>("");
  const [agency, setAgency] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  // Status & transition
  const [authStep, setAuthStep] = useState<"input" | "success">("input");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [redirectCountdown, setRedirectCountdown] = useState<number>(3);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (authStep === "success" && redirectCountdown > 0) {
      interval = setInterval(() => {
        setRedirectCountdown((prev) => {
          if (prev <= 1) {
            router.push("/dashboard");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [authStep, redirectCountdown, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Semua registrasi ditolak dengan notifikasi sistem tidak menerima user baru
    if (authMode === "register") {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setErrorMsg(
          "Pendaftaran ditolak: Sistem tidak menerima pendaftaran pengguna baru. Akses portal dibatasi khusus untuk personel terdaftar."
        );
      }, 400);
      return;
    }

    // Validasi Login: Hanya 1 akun resmi yang diizinkan masuk
    const cleanInput = identifier.trim().toLowerCase().replace(/\s+/g, "");
    const validEmail = AUTHORIZED_ACCOUNT.email.toLowerCase();
    const validNip = AUTHORIZED_ACCOUNT.nip;

    const isAuthorized =
      (cleanInput === validEmail || cleanInput === validNip) &&
      password === AUTHORIZED_ACCOUNT.password;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (!isAuthorized) {
        setErrorMsg(
          "Kredensial tidak valid. Hanya akun resmi kedinasan yang terdaftar yang diizinkan mengakses portal ini."
        );
        return;
      }

      login(AUTHORIZED_ACCOUNT.roleId, AUTHORIZED_ACCOUNT.name);
      setAuthStep("success");
      setRedirectCountdown(3);
    }, 450);
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col lg:grid lg:grid-cols-12 overflow-x-hidden">
      {/* ========================================================================= */}
      {/* KOLOM KIRI: CARD DENGAN BACKGROUND SPLASH SCREEN (#080C14)                */}
      {/* ========================================================================= */}
      <div className="hidden lg:flex lg:col-span-6 xl:col-span-6 p-4 sm:p-6 lg:p-8">
        <div
          className="w-full h-full min-h-[calc(100vh-4rem)] rounded-3xl bg-[#080C14] text-[#F8F9FC] border border-[#1E2638] p-8 sm:p-10 xl:p-14 flex flex-col justify-between relative overflow-hidden select-none shadow-2xl"
          style={{ backgroundColor: "#080C14" }}
        >
          {/* Decorative Square Grid Pattern (Pojok Kanan Bawah hingga ke Atas) */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <svg
              className="absolute inset-0 w-full h-full stroke-white/[0.08] [mask-image:linear-gradient(to_top_left,white_20%,rgba(255,255,255,0.45)_55%,transparent_90%)]"
              aria-hidden="true"
            >
              <defs>
                <pattern
                  id="grid-squares-login"
                  width={36}
                  height={36}
                  patternUnits="userSpaceOnUse"
                  x="100%"
                  y="100%"
                >
                  <path d="M.5 36V.5H36" fill="none" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" strokeWidth={0} fill="url(#grid-squares-login)" />
              {/* Highlighted subtle grid square tiles near bottom right */}
              <svg x="100%" y="100%" className="overflow-visible fill-emerald-500/[0.08] stroke-emerald-500/25">
                <rect strokeWidth={1} width={35} height={35} x={-36 * 1 - 36 + 1} y={-36 * 1 - 36 + 1} />
                <rect strokeWidth={1} width={35} height={35} x={-36 * 3 - 36 + 1} y={-36 * 2 - 36 + 1} />
                <rect strokeWidth={1} width={35} height={35} x={-36 * 2 - 36 + 1} y={-36 * 4 - 36 + 1} />
                <rect strokeWidth={1} width={35} height={35} x={-36 * 4 - 36 + 1} y={-36 * 5 - 36 + 1} />
                <rect strokeWidth={1} width={35} height={35} x={-36 * 1 - 36 + 1} y={-36 * 7 - 36 + 1} />
                <rect strokeWidth={1} width={35} height={35} x={-36 * 3 - 36 + 1} y={-36 * 9 - 36 + 1} />
              </svg>
            </svg>

            {/* Ambient emerald glow from bottom-right */}
            <div className="absolute -bottom-16 -right-16 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          </div>

          {/* Top Brand Link */}
          <div className="relative z-10">
            <Link
              href="/"
              className="inline-block focus-visible:outline-none"
            >
              <Image
                src="/logo-white.svg"
                alt="Sentry Logo"
                width={44}
                height={50}
                priority
                className="w-10 h-auto sm:w-11 sm:h-auto object-contain"
              />
            </Link>
          </div>

          {/* Bottom: Quote Text */}
          <div className="relative z-10 space-y-3 pt-6 max-w-lg">
            <Quote className="h-7 w-7 text-emerald-400 opacity-90 drop-shadow-[0_0_12px_rgba(16,185,129,0.4)]" />
            <blockquote className="font-sans text-base sm:text-lg text-[#FAF8F5] font-light leading-relaxed tracking-tight">
              &ldquo;The world cannot be understood without numbers. And it cannot be understood by numbers alone.&rdquo;
            </blockquote>
            <div className="pt-0.5">
              <cite className="text-xs font-semibold text-emerald-400 tracking-wider uppercase not-italic block">
                — Hans Rosling
              </cite>
              <span className="text-[11px] text-[#9E988F] font-light">
                Physician, Academic, and Public Speaker
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* KOLOM KANAN: FORMULIR LOGIN & REGISTER                                    */}
      {/* ========================================================================= */}
      <div className="col-span-12 lg:col-span-6 xl:col-span-6 flex flex-col justify-center p-6 sm:p-10 md:p-12 xl:p-16 bg-background text-foreground min-h-screen overflow-y-auto">
        {/* Center Main Form Container */}
        <div className="w-full max-w-[440px] mx-auto space-y-6 py-6">
          {/* Back Navigation Link */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-text-secondary hover:text-foreground transition-colors group"
            >
              <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
              <span>Kembali ke Beranda</span>
            </Link>
          </div>

          {/* Mode Switcher: Masuk vs Daftar Akun (Elegant Floating Pill Capsule) */}
          <div className="relative p-1.5 rounded-2xl bg-surface border border-border/80 shadow-xs flex items-center gap-1 backdrop-blur-sm">
            {/* Tab Masuk */}
            <button
              type="button"
              onClick={() => {
                setAuthMode("login");
                setErrorMsg(null);
              }}
              className={cn(
                "relative z-10 flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold rounded-xl transition-colors duration-200 select-none",
                authMode === "login"
                  ? "text-background font-bold"
                  : "text-text-secondary hover:text-foreground"
              )}
            >
              <LogIn className="size-3.5" />
              <span>Masuk</span>
              {authMode === "login" && (
                <motion.div
                  layoutId="authActivePill"
                  className="absolute inset-0 bg-primary rounded-xl shadow-sm -z-10"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}
            </button>

            {/* Tab Daftar */}
            <button
              type="button"
              onClick={() => {
                setAuthMode("register");
                setErrorMsg(null);
              }}
              className={cn(
                "relative z-10 flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold rounded-xl transition-colors duration-200 select-none",
                authMode === "register"
                  ? "text-background font-bold"
                  : "text-text-secondary hover:text-foreground"
              )}
            >
              <UserPlus className="size-3.5" />
              <span>Daftar Akun</span>
              {authMode === "register" && (
                <motion.div
                  layoutId="authActivePill"
                  className="absolute inset-0 bg-primary rounded-xl shadow-sm -z-10"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}
            </button>
          </div>

          {/* Form Header */}
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {authMode === "login" ? "Masuk" : "Daftar Akun"}
            </h1>
          </div>

          {/* Error Message Alert */}
          {errorMsg && (
            <div
              role="alert"
              className="flex items-start gap-2.5 p-3 rounded-xl bg-danger/10 border border-danger/20 text-danger text-xs animate-in fade-in slide-in-from-top-1"
            >
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <span className="leading-tight font-medium">{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: FORM INPUT */}
          {authStep === "input" && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Field Khusus Registrasi: Nama Lengkap */}
              {authMode === "register" && (
                <>
                  <div className="space-y-1.5">
                    <label
                      htmlFor="fullname-input"
                      className="block text-xs font-semibold text-foreground"
                    >
                      Nama Lengkap
                    </label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">
                        <User className="size-4" />
                      </div>
                      <input
                        id="fullname-input"
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Nama Lengkap"
                        className="w-full h-11 rounded-xl border border-border bg-surface pl-10 pr-3.5 py-2 text-xs text-foreground placeholder:text-text-secondary/70 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent font-medium transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="agency-input"
                      className="block text-xs font-semibold text-foreground"
                    >
                      Instansi
                    </label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">
                        <Building2 className="size-4" />
                      </div>
                      <input
                        id="agency-input"
                        type="text"
                        value={agency}
                        onChange={(e) => setAgency(e.target.value)}
                        placeholder="Instansi / Unit Kerja"
                        className="w-full h-11 rounded-xl border border-border bg-surface pl-10 pr-3.5 py-2 text-xs text-foreground placeholder:text-text-secondary/70 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent font-medium transition-all"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Field Email / NIP */}
              <div className="space-y-1.5">
                <label
                  htmlFor="identifier-input"
                  className="block text-xs font-semibold text-foreground"
                >
                  Email atau NIP
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">
                    <Mail className="size-4" />
                  </div>
                  <input
                    id="identifier-input"
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Email atau NIP"
                    className="w-full h-11 rounded-xl border border-border bg-surface pl-10 pr-3.5 py-2 text-xs text-foreground placeholder:text-text-secondary/70 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent font-mono transition-all"
                  />
                </div>
              </div>

              {/* Field Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password-input"
                    className="block text-xs font-semibold text-foreground"
                  >
                    Kata Sandi
                  </label>
                  {authMode === "login" && (
                    <span className="text-[11px] text-accent hover:underline cursor-pointer transition-colors font-medium">
                      Lupa kata sandi?
                    </span>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">
                    <Lock className="size-4" />
                  </div>
                  <input
                    id="password-input"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Kata sandi"
                    className="w-full h-11 rounded-xl border border-border bg-surface pl-10 pr-10 py-2 text-xs text-foreground placeholder:text-text-secondary/70 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent font-mono transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Sembunyikan sandi" : "Tampilkan sandi"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {/* Field Konfirmasi Password (Khusus Register) */}
              {authMode === "register" && (
                <div className="space-y-1.5">
                  <label
                    htmlFor="confirm-password-input"
                    className="block text-xs font-semibold text-foreground"
                  >
                    Konfirmasi Kata Sandi
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">
                      <Lock className="size-4" />
                    </div>
                    <input
                      id="confirm-password-input"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Konfirmasi kata sandi"
                      className="w-full h-11 rounded-xl border border-border bg-surface pl-10 pr-10 py-2 text-xs text-foreground placeholder:text-text-secondary/70 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent font-mono transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? "Sembunyikan sandi" : "Tampilkan sandi"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Remember Session (Khusus Login) */}
              {authMode === "login" && (
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-text-secondary hover:text-foreground transition-colors">
                    <input
                      type="checkbox"
                      checked={rememberSession}
                      onChange={(e) => setRememberSession(e.target.checked)}
                      className="size-4 rounded border-border text-accent focus:ring-accent accent-accent bg-surface"
                    />
                    <span>Ingat saya</span>
                  </label>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-dark text-background font-semibold h-11 rounded-xl mt-2 transition-all active:scale-[0.98] shadow-xs"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="size-4 animate-spin text-accent" />
                    Memproses...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span>{authMode === "register" ? "Daftar" : "Masuk"}</span>
                    <ArrowRight className="size-4" />
                  </span>
                )}
              </Button>
            </form>
          )}

          {/* STEP 2: SUCCESS SCREEN */}
          {authStep === "success" && (
            <div className="p-8 rounded-2xl border border-accent/30 bg-accent/5 text-center space-y-4 animate-in fade-in zoom-in-95">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-lg">
                <Check className="size-7 stroke-[3]" />
              </div>

              <div className="space-y-1">
                <h2 className="text-lg font-bold text-foreground">
                  {authMode === "register" ? "Pendaftaran Berhasil" : "Berhasil Masuk"}
                </h2>
              </div>

              <Button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="w-full h-11 text-xs font-semibold bg-primary hover:bg-primary-dark text-background rounded-xl transition-all active:scale-[0.98] shadow-xs mt-2"
              >
                <span>Masuk ke Dashboard ({redirectCountdown}s)</span>
                <ArrowRight className="size-4 ml-1.5" />
              </Button>
            </div>
          )}
        </div>

        {/* Bottom Spacer */}
        <div className="py-2" />
      </div>
    </div>
  );
}
