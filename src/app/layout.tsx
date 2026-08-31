import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import { AuthProvider } from "@/components/auth/auth-context";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { SplashScreen } from "@/components/ui/splash-screen";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#faf8f5",
};

export const metadata: Metadata = {
  title: "Sentry | Early Warning Platform for Climate-Driven Epidemics",
  description:
    "Sentry: Early Warning Platform for Climate-Driven Epidemics — Sistem prediksi kerentanan epidemiologi berbasis anomali iklim dan risiko lingkungan di Kota Semarang (DSDC 2026).",
  keywords: [
    "Sentry",
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
  authors: [{ name: "Sentry Engineering Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth light" suppressHydrationWarning>
      <body className={`${poppins.variable} font-sans min-h-[100dvh] antialiased bg-background text-foreground selection:bg-[#181818] selection:text-[#FAF8F5]`}>
        <AuthProvider>
          <SplashScreen />
          <SmoothScrollProvider>
            {children}
          </SmoothScrollProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
