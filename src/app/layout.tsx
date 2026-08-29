import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { AuthProvider } from "@/components/auth/auth-context";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf8f5" },
    { media: "(prefers-color-scheme: dark)", color: "#080c14" },
  ],
};

export const metadata: Metadata = {
  title: "EcoHealth Pulse | Prediksi Kerentanan Iklim & Epidemiologi Kota Semarang (DSDC 2026)",
  description:
    "Sistem analitik epidemiologi prediktif dampak anomali iklim dan risiko lingkungan terhadap beban penyakit DBD dan ISPA di Kota Semarang (DSDC 2026).",
  keywords: [
    "EcoHealth Pulse",
    "Semarang",
    "Epidemiologi",
    "DBD",
    "ISPA",
    "Iklim",
    "DSDC 2026",
    "Dinkes Kota Semarang",
    "Bappeda",
    "PostGIS MVT",
    "DLNM Lag-14",
  ],
  authors: [{ name: "EcoHealth Pulse Engineering Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('ecohealth_theme');
                  var supportDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (theme === 'dark' || (!theme || theme === 'system') && supportDark) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                  } else {
                    document.documentElement.classList.add('light');
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-[100dvh] antialiased bg-background text-foreground selection:bg-emerald-500 selection:text-white">
        <a href="#main-content" className="skip-link">
          Lewati ke konten utama
        </a>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
