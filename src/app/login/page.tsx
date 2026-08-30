"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Fingerprint,
  User,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Eye,
  EyeOff,
  Check,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlobalNavbar } from "@/components/navigation/global-navbar";
import { useAuth } from "@/components/auth/auth-context";

export type UserRole = "operator" | "epidemiologist" | "public";

interface RoleConfig {
  id: UserRole;
  title: string;
  badgeLabel: string;
  badgeVariant: "default" | "secondary" | "success" | "warning" | "destructive" | "outline";
  department: string;
  accessLevel: string;
  description: string;
  defaultIdentifier: string;
  permissions: string[];
  requiresMfa: boolean;
}

const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  operator: {
    id: "operator",
    title: "Dinkes Operator",
    badgeLabel: "Operator Lapangan",
    badgeVariant: "success",
    department: "Dinas Kesehatan Kota Semarang (Bidang P2P)",
    accessLevel: "Tingkat 2 (Operasional Wilayah & Triage)",
    description: "Hak akses operasional lapangan, pemantauan status polder rob, dan input aksi intervensi PSN 3M Plus.",
    defaultIdentifier: "198804122011011002",
    permissions: [
      "Input data intervensi jentik dan kaporisasi polder",
      "Akses telemetri 16 kecamatan Semarang",
      "Unduh lembar kerja operasional lapangan",
    ],
    requiresMfa: false,
  },
  epidemiologist: {
    id: "epidemiologist",
    title: "Epidemiologist",
    badgeLabel: "Spesialis Epidemiologi",
    badgeVariant: "default",
    department: "Bappeda & Tim Pakar Epidemiologi DSDC 2026",
    accessLevel: "Tingkat 1 (Analitik Penuh & Kalibrasi Model)",
    description: "Hak akses saintifik, validasi matematis kernel DLNM 14-hari, kalibrasi iklim BMKG, dan ekspor kajian kebijakan.",
    defaultIdentifier: "dr.hendra.epidem@semarangkota.go.id",
    permissions: [
      "Kalibrasi bobot non-linear suhu Briere & Aerosol PM2.5",
      "Validasi prediksi transmisi DBD dan ISPA",
      "Ekspor PDF Executive Brief dan OpenXML Excel",
      "Akses streaming PostGIS MVT Vector Tiles",
    ],
    requiresMfa: false,
  },
  public: {
    id: "public",
    title: "Public Viewer",
    badgeLabel: "Akses Publik Terbuka",
    badgeVariant: "outline",
    department: "Portal Transparansi Kesehatan Masyarakat",
    accessLevel: "Tingkat 3 (Agregat Spasial Publik)",
    description: "Akses pemantauan publik terhadap indeks risiko kerentanan multi-penyakit dan rekomendasi mitigasi warga.",
    defaultIdentifier: "publik.semarang@warga.id",
    permissions: [
      "Eksplorasi peta interaktif 16 kecamatan",
      "Melihat peringatan dini kerentanan iklim",
      "Panduan pencegahan mandiri DBD dan ISPA",
    ],
    requiresMfa: false,
  },
};

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [selectedRole, setSelectedRole] = useState<UserRole>("operator");
  const [authMethod, setAuthMethod] = useState<"password" | "passkey">("password");
  const [identifier, setIdentifier] = useState<string>(ROLE_CONFIGS.operator.defaultIdentifier);
  const [password, setPassword] = useState<string>("SandiKedinasan@2026");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberSession, setRememberSession] = useState<boolean>(true);

  const [authStep, setAuthStep] = useState<"input" | "success">("input");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [passkeyState, setPasskeyState] = useState<"idle" | "requesting" | "verified" | "failed">("idle");
  const [sessionToken, setSessionToken] = useState<string>("");
  const [redirectCountdown, setRedirectCountdown] = useState<number>(3);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setIdentifier(ROLE_CONFIGS[role].defaultIdentifier);
    setErrorMsg(null);
    if (role === "public") {
      setAuthMethod("password");
      setPassword("TamuPublik2026");
    } else {
      setPassword("SandiKedinasan@2026");
    }
  };

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

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!identifier.trim()) {
      setErrorMsg("NIP atau Email Kedinasan wajib diisi.");
      return;
    }

    if (selectedRole !== "public" && !password) {
      setErrorMsg("Kata sandi kedinasan wajib diisi.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      completeAuthentication();
    }, 400);
  };

  const handlePasskeyTrigger = () => {
    setPasskeyState("requesting");
    setErrorMsg(null);
    setLoading(true);

    setTimeout(() => {
      setPasskeyState("verified");
      setLoading(false);
      setTimeout(() => {
        completeAuthentication();
      }, 500);
    }, 800);
  };

  const completeAuthentication = () => {
    const generatedToken = `EHP_${selectedRole.toUpperCase()}_${Math.random().toString(36).substring(2, 10).toUpperCase()}_2026`;
    setSessionToken(generatedToken);
    
    const authRoleId = selectedRole === "epidemiologist" ? "dinkes" : selectedRole === "operator" ? "puskesmas" : "bappeda";
    login(authRoleId, identifier.includes("@") ? identifier.split("@")[0] : undefined);
    
    setAuthStep("success");
    setRedirectCountdown(3);
  };

  const currentRoleCfg = ROLE_CONFIGS[selectedRole];

  return (
    <div className="min-h-[100dvh] flex flex-col justify-between bg-[#FAF8F5] text-slate-900 dark:bg-[#080C14] dark:text-slate-100 transition-colors duration-150">
      {/* Universal Global Navbar */}
      <GlobalNavbar />

      {/* Modern Aesthetic Minimalist Authentication Gateway */}
      <main
        id="main-content"
        role="main"
        className="flex-1 flex items-center justify-center px-4 py-8 sm:py-14"
      >
        <div className="w-full max-w-[400px] space-y-6">
          {/* Brand Mark & Concise Header */}
          <div className="text-center space-y-2.5">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs">
              <Activity className="h-5 w-5 text-emerald-400 dark:text-emerald-600" />
            </div>
            
            <div className="space-y-1">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                Autentikasi Aman Sistem Epidemiologi
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Masuk ke platform intelijen kesehatan Kota Semarang
              </p>
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60">
              <ShieldCheck className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
              <span>Protokol Keamanan Tingkat ASN</span>
            </div>
          </div>

          {/* Role Segmented Controller */}
          <div className="grid grid-cols-3 p-1 rounded-xl bg-slate-200/50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/70">
            {(Object.keys(ROLE_CONFIGS) as UserRole[]).map((r) => {
              const cfg = ROLE_CONFIGS[r];
              const isSelected = selectedRole === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleRoleSelect(r)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all duration-150 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 dark:focus-visible:ring-white ${
                    isSelected
                      ? "bg-white text-slate-900 dark:bg-[#080C14] dark:text-slate-50 shadow-xs font-bold"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                  }`}
                >
                  <span className="block truncate">{cfg.title}</span>
                </button>
              );
            })}
          </div>

          {/* Form Container Card */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-[#0E1420] space-y-4">
            {/* Error Message Alert */}
            {errorMsg && (
              <div
                role="alert"
                className="flex items-start gap-2 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-800 dark:bg-red-950/40 dark:border-red-900/50 dark:text-red-300 text-xs"
              >
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
                <span className="leading-tight">{errorMsg}</span>
              </div>
            )}

            {/* STEP 1: CREDENTIALS / PASSKEY */}
            {authStep === "input" && (
              <div className="space-y-4">
                {/* Method Switcher */}
                <div className="flex rounded-lg bg-slate-100/70 p-0.5 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800/60">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMethod("password");
                      setErrorMsg(null);
                    }}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-md transition-colors duration-150 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 dark:focus-visible:ring-white ${
                      authMethod === "password"
                        ? "bg-white text-slate-900 shadow-xs dark:bg-[#0E1420] dark:text-slate-100"
                        : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                    }`}
                  >
                    <User className="h-3.5 w-3.5" />
                    <span>Kredensial ASN & Sandi</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAuthMethod("passkey");
                      setErrorMsg(null);
                    }}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-md transition-colors duration-150 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 dark:focus-visible:ring-white ${
                      authMethod === "passkey"
                        ? "bg-white text-slate-900 shadow-xs dark:bg-[#0E1420] dark:text-slate-100"
                        : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                    }`}
                  >
                    <Fingerprint className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Passkey / WebAuthn</span>
                  </button>
                </div>

                {authMethod === "password" ? (
                  <form onSubmit={handlePasswordSubmit} className="space-y-3.5">
                    <div className="space-y-1">
                      <label
                        htmlFor="identifier-input"
                        className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                      >
                        {selectedRole === "operator"
                          ? "NIP Kedinasan (18 Digit)"
                          : selectedRole === "epidemiologist"
                          ? "Email Kedinasan / Akun SatuSehat"
                          : "Identitas Pengguna Publik"}
                      </label>
                      <input
                        id="identifier-input"
                        type="text"
                        required
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder={
                          selectedRole === "operator"
                            ? "198804122011011002"
                            : "nama@semarangkota.go.id"
                        }
                        className="w-full h-10 rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-100 dark:focus:ring-emerald-400 font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="password-input"
                          className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                        >
                          Kata Sandi Kedinasan
                        </label>
                        {selectedRole !== "public" && (
                          <span className="text-[11px] text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer">
                            Lupa sandi?
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <input
                          id="password-input"
                          type={showPassword ? "text" : "password"}
                          required={selectedRole !== "public"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Masukkan kata sandi"
                          className="w-full h-10 rounded-lg border border-slate-200 bg-slate-50/50 px-3 pr-9 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-100 dark:focus:ring-emerald-400 font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-0.5">
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 dark:text-slate-400">
                        <input
                          type="checkbox"
                          checked={rememberSession}
                          onChange={(e) => setRememberSession(e.target.checked)}
                          className="h-3.5 w-3.5 rounded border-slate-300 text-slate-900 focus:ring-slate-900 dark:border-slate-700 dark:bg-slate-900"
                        />
                        <span>Ingat sesi 12 jam</span>
                      </label>
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-slate-900 hover:bg-black text-white dark:bg-[#FAF8F5] dark:hover:bg-white dark:text-slate-900 font-semibold h-10 mt-1 transition-colors duration-150 motion-reduce:transition-none shadow-xs"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <RefreshCw className="h-4 w-4 animate-spin text-emerald-400" />
                          Memverifikasi...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-1.5">
                          Lanjutkan Autentikasi
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      )}
                    </Button>
                  </form>
                ) : (
                  <div className="p-5 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 text-center space-y-3">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-white text-slate-900 dark:bg-[#0E1420] dark:text-emerald-400 border border-slate-200 dark:border-slate-800 shadow-xs">
                      {passkeyState === "requesting" ? (
                        <RefreshCw className="h-5 w-5 animate-spin text-emerald-600 dark:text-emerald-400" />
                      ) : passkeyState === "verified" ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Fingerprint className="h-5 w-5" />
                      )}
                    </div>

                    <div className="space-y-0.5">
                      <h2 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {passkeyState === "requesting"
                          ? "Menunggu Sensor..."
                          : passkeyState === "verified"
                          ? "Kunci Terverifikasi"
                          : "Autentikasi Kunci Sandi Hardware (FIDO2)"}
                      </h2>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                        Gunakan Touch ID, Windows Hello, atau YubiKey terdaftar.
                      </p>
                    </div>

                    <Button
                      type="button"
                      onClick={handlePasskeyTrigger}
                      disabled={loading || passkeyState === "verified"}
                      className="w-full h-9 text-xs font-semibold bg-slate-900 hover:bg-black text-white dark:bg-[#FAF8F5] dark:hover:bg-white dark:text-slate-900 transition-colors duration-150 motion-reduce:transition-none"
                    >
                      {passkeyState === "requesting" ? (
                        <span className="flex items-center gap-2">
                          <RefreshCw className="h-3.5 w-3.5 animate-spin text-emerald-400" />
                          Handshake...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-1.5">
                          <Fingerprint className="h-3.5 w-3.5" />
                          Sentuh Sensor Biometrik
                        </span>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: SUCCESS */}
            {authStep === "success" && (
              <div className="p-5 rounded-xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/60 dark:bg-emerald-950/30 text-center space-y-3">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xs">
                  <Check className="h-5 w-5" />
                </div>

                <div className="space-y-0.5">
                  <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Otorisasi Berhasil Divalidasi
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Sesi aman <span className="font-semibold">{currentRoleCfg.title}</span> aktif.
                  </p>
                </div>

                <Button
                  type="button"
                  onClick={() => router.push("/dashboard")}
                  className="w-full h-9 text-xs font-semibold bg-slate-900 hover:bg-black text-white dark:bg-[#FAF8F5] dark:hover:bg-white dark:text-slate-900 transition-colors duration-150 motion-reduce:transition-none mt-2"
                >
                  Masuk ke Cockpit Sekarang ({redirectCountdown}s)
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            )}
          </div>

          {/* Accessible Role Meta Info (Strict testing & screen-reader fidelity) */}
          <div className="sr-only">
            <span>{currentRoleCfg.department}</span>
            <span>{currentRoleCfg.permissions[0]}</span>
            <span>{currentRoleCfg.permissions[1]}</span>
          </div>
        </div>
      </main>

      {/* Single-line Minimal Footer */}
      <footer className="border-t border-[#E5E0D8] bg-white py-3 dark:border-[#1E2638] dark:bg-[#080C14] transition-colors duration-150">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 text-[11px] font-mono text-slate-500 dark:text-slate-400">
          <span>EcoHealth Pulse &bull; Kemendagri 33.74</span>
          <span>Permenkes 24/2022 &bull; TLS 1.3</span>
        </div>
      </footer>
    </div>
  );
}
