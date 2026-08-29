# LAPORAN AUDIT SENIOR UI/UX DESIGNER & ANTI-AI-SLOP: ECOHEALTH PULSE

**Auditor:** Senior Staff UI/UX Designer & Anti-AI-Slop Specialist  
**Evaluasi Berdasarkan:** Standar B2B Minimalist Enterprise (Crucible, Palantir Foundry, Linear, Stripe), Kaidah Anti-AI-Slop, dan Desain Sistem 60-30-10.  
**Target URL:** `http://localhost:3300/` (`/`, `/dashboard`, `/login`)

---

## 1. EXECUTIVE SUMMARY & MATRIKS TEMUAN

Platform **EcoHealth Pulse** memiliki fondasi teknis dan model epidemiologi matematis (DLNM 14-Day Lag, Briere Thermal Function, PostGIS MVT) yang sangat solid. Namun, dari perspektif UI/UX Enterprise dan konsistensi desain B2B, terdapat **ketidaksesuaian arsitektur visual (product-form mismatch)**, polusi warna aksen neon, serta klise desain AI (*AI-slop tells*) yang menurunkan wibawa platform sebagai perangkat analitik otoritas publik.

### Matriks Kategori Temuan:
| Kategori | Tingkat Keparahan | Ringkasan Masalah Utama |
|---|---|---|
| **Product Form Mismatch** | **P0 (Kritis)** | Menaruh prompt box chatbot LLM (ikon mic, paperclip, textarea) pada sistem GIS epidemiologi deterministik. |
| **Color Palette & Theme Clashing** | **P0 (Kritis)** | Landing page tampil dalam dark mode dingin padahal konsep Crucible adalah warm ivory (`#FAF8F5`). Polusi warna hijau neon di 9 titik berbeda. |
| **Navbar Identity Crisis** | **P1 (Tinggi)** | Menaruh breadcrumb admin internal dan latency ping counter di navbar landing page publik. |
| **Action Overload (CTA Clutter)** | **P1 (Tinggi)** | 9 tombol dan chips interaktif berbeda dalam 1 viewport yang semuanya menuju ke tujuan yang sama (`/dashboard`). |
| **Typography & Numerics Drift** | **P2 (Sedang)** | Percampuran token Tailwind Zinc dan Slate; font display tidak konsisten antara landing dan sub-halaman. |
| **Form & Input Accessibility** | **P2 (Sedang)** | Kurangnya feedback visual state pada form input login dan ketiadaan click-outside dismissal pada modal dialog. |

---

## 2. DETAIL TEMUAN BERDASARKAN 10 AREA AUDIT

---

### AREA 1: LANDING PAGE HERO & VALUE PROPOSITION (`/`)
* **File:** `src/app/page.tsx`, `src/components/layout/interactive-prompt-bar.tsx`
* **Temuan Kritis (P0):**
  1. **Salah Analogi Produk (Cargo-Culting UI Chatbot AI):**
     - Komponen `InteractivePromptBar` merender textarea chat dengan tombol attachment (`Paperclip`), mikrofon (`Mic`), dan tombol submit bulat panah.
     - *Alasan:* Crucible di screenshot referensi menaruh prompt box karena produk mereka adalah AI Reasoning LLM. EcoHealth Pulse adalah **Sistem GIS & Surveilans Epidemiologi Spasial**. Pejabat Dinas Kesehatan tidak mengetik prompt bebas untuk memantau banjir rob; mereka membutuhkan **Peta Spasial Live, Indikator Risiko Wilayah, dan Kurva Prediksi DLNM**.
  2. **Hero Terlalu Penuh (Action Overload):**
     - Dalam 1 layar hero terdapat: tombol submit prompt, 4 preset chips, tombol `Buka Cockpit Realtime`, tombol `Portal Petugas`, tombol `Spesifikasi OpenAPI`, serta link navigasi atas. Ini memicu *Paradox of Choice*.
* **Rekomendasi Perbaikan:**
  - **Hapus prompt box chatbot.** Ganti dengan **Hero Interactive Spatial/Cockpit Preview Card** yang menampilkan potongan peta Semarang dan telemetri risiko wilayah secara live.
  - Sederhanakan CTA menjadi **1 Tombol Primer Solid Black Pill** (`Buka Cockpit Realtime ->`) dan **1 Tombol Sekunder White/Sand Pill** (`Dokumentasi & Spesifikasi API`).

---

### AREA 2: GLOBAL NAVIGATION & HEADER SYSTEM (`/` & `/dashboard`)
* **File:** `src/components/navigation/global-navbar.tsx`
* **Temuan (P1):**
  1. **Navbar Mengalami Krisis Identitas:**
     - Menampilkan breadcrumbs rute internal (`KOTA SEMARANG > EPIDEMIOLOGI IKLIM > IKHTISAR EKSEKUTIF`) dan badge latency geospasial (`POSTGIS MVT 44ms`) di halaman beranda publik (`/`).
     - *Dampak UX:* Membuat header publik terlihat padat, sempit, dan membingungkan pengunjung baru yang belum login.
  2. **Polusi Tombol Hijau:**
     - Tombol `Petugas` dan badge `IKHTISAR EKSEKUTIF` diberi background hijau neon yang bertabrakan dengan logo dan status dot.
* **Rekomendasi Perbaikan:**
  - Di halaman Landing (`/`), gunakan navbar B2B bersih: `[Logo EcoHealth Pulse]` $\rightarrow$ Link Menu: `Platform`, `Metodologi`, `Direktori 16 Kec`, `Spesifikasi API` $\rightarrow$ Tombol Kanan: `Masuk / Portal Petugas` (Pill Solid Black).
  - Pindahkan Breadcrumbs dan Latency Monitor **hanya ke dalam halaman `/dashboard`**.

---

### AREA 3: PALET WARNA & SUASANA ATMOSFERIK (60-30-10)
* **File:** `src/app/globals.css`, `tailwind.config.ts`, `DESIGN.md`
* **Temuan Kritis (P0):**
  1. **Warna Latar Meleset dari Crucible:**
     - Referensi Crucible menggunakan kanvas **Warm Luminous Ivory / Pearl (`#FAF8F5`)** dengan ambient champagne gold aura yang hangat dan elegan.
     - Saat ini aplikasi default ke **Dark Mode pekat (`#080C14`)**, sehingga terlihat seperti terminal hacker/dark-tech generik dan kehilangan estetika warm editorial Crucible.
  2. **Over-saturasi Hijau Emerald Neon:**
     - Warna hijau dipakai berlebihan pada tombol CTA, tombol bulat prompt, border badge, pill menu, dan ikon.
     - *Aturan Anti-AI-Slop:* Warna hijau (Emerald) dan merah (Crimson) harus disimpan **khusus sebagai indikator status risiko epidemiologi klinis**, bukan sebagai warna primer branding tombol.
* **Rekomendasi Perbaikan:**
  - Kunci halaman landing (`/`) pada warna dasar **Warm Ivory (`#FAF8F5`)** dengan ambient golden warmth lembut di hero background.
  - Ganti warna tombol CTA utama menjadi **Solid Charcoal/Black (`#181818`)** dengan teks putih.

---

### AREA 4: DUAL-CAPABILITY BENTO SECTION ("SATU MESIN DUA CARA KERJA")
* **File:** `src/components/layout/dual-engine-bento.tsx`
* **Temuan (P2):**
  1. **Fidelitas Visual Gradient Kartu:**
     - Kartu kiri (API & SDK) dan kartu kanan (Cockpit) saat ini kehilangan nuansa warna lembut di dark mode.
     - Sesuai referensi: Kartu kiri harus memiliki gradien hangat *Soft Peach-Amber* (`#FDF6ED` $\rightarrow$ `#FCEEE0`) dan kartu kanan memiliki gradien sejuk *Soft Lavender-Ice Blue* (`#EEF4FD` $\rightarrow$ `#E5EEFC`).
  2. **Kontras Terminal Kode:**
     - Kotak terminal hitam di kartu kiri terlihat terlalu gelap dan kontras tajam terhadap kartu di sekitarnya.
* **Rekomendasi Perbaikan:**
  - Berikan border tipis semi-transparan dan drop shadow halus pada kartu bento.
  - Perjelas fungsi tombol copy dan tab switcher (TypeScript, cURL, SQL) dengan font `Geist Mono` yang rapi.

---

### AREA 5: MULTI-SOURCE TELEMETRY INGESTION & OUTCOME METRICS
* **File:** `src/components/layout/telemetry-ingestion-section.tsx`, `src/components/landing/multi-source-ingestion.tsx`
* **Temuan (P2):**
  1. **Duplikasi Komponen:**
     - Terdapat dua berkas dengan fungsi serupa (`telemetry-ingestion-section.tsx` dan `multi-source-ingestion.tsx`).
  2. **Kerapian Spacing & Grid:**
     - Kartu sumber telemetri (BMKG, Polder DPU, E-Puskesmas) perlu disatukan dengan kartu pembuktian hasil kebijakan (Outcome Proofs: *42% Lead-time Peringatan*, *16/16 Kecamatan*, *< 18ms Latency*, *100% Kedaulatan Data*).
* **Rekomendasi Perbaikan:**
  - Konsolidasi menjadi satu komponen tunggal yang bersih dengan layout 3-kolom horizontal.

---

### AREA 6: INSTITUTIONAL TRUST & PARTNER MATRIX
* **File:** `src/components/layout/institutional-trust-wall.tsx`
* **Temuan (P2):**
  1. **Opasitas & Kontras Logo Otoritas:**
     - Logo institusi (Dinkes, Bappeda, BMKG, Kemenkes SatuSehat, UNDIP) saat ini memakai badge berbingkai tebal.
     - *Standar Minimalist B2B:* Logo institusi seharusnya tampil sebagai **monochrome lockup slate semi-transparan (opasitas 50-60%)** dengan transisi hover 100% opasitas, tanpa border kotak yang berat.
* **Rekomendasi Perbaikan:**
  - Ubah trust wall menjadi deretan logo tipografi monokrom yang rapi, berjarak seimbang, dan elegan di bawah hero.

---

### AREA 7: DIREKTORI KEMENDAGRI 33.74 (16 KECAMATAN)
* **File:** `src/app/page.tsx:300-360`
* **Temuan (P2):**
  1. **Search Bar Geometry:**
     - Input pencarian kecamatan berbentuk pill kecil yang kurang menyatu dengan tabel di bawahnya.
  2. **Visual Overflow pada Mobile:**
     - Tabel 8 kolom memerlukan scroll horizontal pada layar ponsel tanpa indikator visual yang jelas.
* **Rekomendasi Perbaikan:**
  - Berikan wrapper container dengan padding rapi dan indikator *swipeable table* pada layar `< 768px`.

---

### AREA 8: REALTIME COCKPIT DASHBOARD (`/dashboard`)
* **File:** `src/app/dashboard/page.tsx`
* **Temuan (P1):**
  1. **Kontras MapLibre Popup pada Dark Theme:**
     - Popup marker peta MapLibre menggunakan background putih default yang silau saat peta berada dalam dark mode.
  2. **Layout Kartu KPI:**
     - Kartu KPI 4 kolom di bagian atas dashboard membutuhkan hierarki yang lebih tajam antara angka metrik dan label referensi WHO.
* **Rekomendasi Perbaikan:**
  - Terapkan styling popup khusus tema gelap (`.dark .maplibregl-popup-content { background: #0B111A; border-color: #1E293B; color: #F1F5F9; }`).
  - Kunci dashboard `/dashboard` dalam mode Dark Cockpit penuh untuk kenyamanan monitoring 24/7 di command center Dinkes.

---

### AREA 9: AUTH & SECURE LOGIN PORTAL (`/login`)
* **File:** `src/app/login/page.tsx`
* **Temuan (P2):**
  1. **Bentuk Tombol Login & Role Persona:**
     - Tombol tab persona (Operator, Epidemiologist, Public Viewer) berbentuk kotak standar yang kurang mencerminkan gaya pill Crucible.
  2. **Animasi State Loading:**
     - Saat tombol login ditekan, animasi transisi perlu diperhalus dengan spring physics $\le 120\text{ms}$.
* **Rekomendasi Perbaikan:**
  - Samakan card login dengan elevated container berbingkai warm stone dan tombol aksi solid pill.

---

### AREA 10: AUDIT TIPOGRAFI & ATURAN ANTI-AI-SLOP GLOBAL
* **File:** Seluruh codebase `src/`
* **Temuan & Kepatuhan:**
  1. **Aturan Em-Dash (`—`/`–`):**
     - **LULUS (PASS):** Kode produksi bebas 100% dari karakter em-dash terlarang.
  2. **Angka Tabular:**
     - **LULUS (PASS):** Kelas `.font-mono-num` dengan `tabular-nums lining-nums` berjalan konsisten pada pembacaan skor dan koordinat.
  3. **Ikon AI Generik:**
     - Ikon `Sparkles` telah dibersihkan dari komponen diagnostik klinis dan digantikan dengan `ClipboardCheck` & `Compass`.

---

## 3. RENCANA AKSI PERBAIKAN PRIORITAS TINGGI

1. **Hapus Prompt Box Chatbot dari Landing Page** $\rightarrow$ Ganti dengan **Interactive Hero Product/Map Preview**.
2. **Kunci Warna Landing Page ke Warm Luminous Ivory (`#FAF8F5`)** $\rightarrow$ Terapkan ambient champagne aura dan tombol utama Solid Black Pill.
3. **Bersihkan Navbar Publik** $\rightarrow$ Pindahkan Breadcrumb dan Latency Ping ke `/dashboard`.
4. **Perhalus Dual-Bento Cards** $\rightarrow$ Terapkan warna gradien Soft Peach dan Soft Lavender sesuai referensi Crucible.
5. **Perbarui Dokumentasi Desain** di `DESIGN.md` dan sinkronkan seluruh test suite Vitest.
