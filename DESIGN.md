# Design System: EcoHealth Pulse (DSDC 2026) - Crucible B2B Edition

## 1. Visual Theme & Atmospheric Architecture
Antarmuka komando epidemiologi B2B kelas enterprise yang terinspirasi oleh Crucible Design System: **Warm-Luminous Ivory & Laboratory Cockpit Dense** (Density 8, Variance 7, Motion 4). Mengutamakan kejelasan analitik klinis, ketegasan tipografi editorial, dan keandalan keputusan bagi pimpinan Dinas Kesehatan Kota Semarang dan Bappeda.

Menghilangkan seluruh signature klise AI (*zero purple gradients, zero Inter-everywhere, zero glassmorphism, zero floating blobs, zero emoji, zero em-dashes*) dan menggantikannya dengan palet monokromatik terkalibrasi tinggi bernuansa champagne warm-luminous, kontras WCAG AA 4.5:1, tipografi data matriks, dan visualisasi spasial berbasis WebGL vector map.

## 2. Color Palette & Tokens (Crucible Warm-Luminous 60-30-10 Rule)
- **60% Base Canvas (Atmospheric Canvas):** Warm Ivory / Obsidian Dark
  - Light Canvas Default: `#FAF8F5` (`--crucible-canvas`, `--background`)
  - Dark Canvas: `#080C14` (Deep Obsidian Cockpit)
  - Ambient Aura Glow: Champagne Warmth (`#F4EEE3` / `rgba(244, 238, 227, 0.65)` Light, `#1F1B14` / `rgba(31, 27, 20, 0.45)` Dark)
- **30% Structural Hierarchy & Containers (Crisp Elevated Panels):**
  - Panel Surfaces: `#FFFFFF` (`--crucible-card`) / `#0E1420` (Elevated Obsidian Dark)
  - Elevated Popovers / Modals: `#FFFFFF` (`--crucible-card-elevated`) / `#131B2C` (Dark)
  - Subtle Structural Borders: `#E5E0D8` (Warm Stone Light) / `#1E2638` (Deep Slate Dark)
  - Subtle Dividers: `#EEECE6` (Light) / `#171F30` (Dark)
  - Muted Metadata Text: `#645E54` (Warm Muted Light) / `#94A3B8` (Cool Muted Dark)
  - Deep Text: `#1B1916` / `#141824` (Light) / `#F8FAFC` (Dark)
- **Primary & Secondary Action CTA Tokens:**
  - **Solid Charcoal/Black Pill CTA (Primary):** `#181818` (Light) / `#FFFFFF` (Dark), hover `#000000` / `#F1F5F9`, text `#FFFFFF` / `#080C14`
  - **Warm White Sand Pill CTA (Secondary):** `#FFFFFF` (Light) / `#0E1420` (Dark), border `#DCD6CA` / `#1E2638`, hover `#FAF8F5` / `#131B2C`
- **10% Clinical & Triage Accents (Saved strictly for epidemiological status):**
  - **Bio-Emerald (Surgical Status):** `#059669` (Light) / `#10B981` (Dark) — Status Normal, Active Scrubber, Baseline Epidemiologi
  - **Amber Alert / Champagne Warmth:** `#D97706` (Light) / `#F59E0B` (Dark) — Skor EHV 45 - 69, Anomali Suhu Briere 28.5°C
  - **Crimson Hazard (Critical Rob/Epidemic):** `#DC2626` (Light) / `#EF4444` (Dark) — Skor EHV >= 70, Intrusi Rob Pesisir

### Banned Color & UI Patterns:
- ❌ Dilarang menggunakan gradient ungu/indigo/pink (`#6366f1`, `#8b5cf6`, `#a855f7`).
- ❌ Dilarang menggunakan neon glow blur pada border/card (`box-shadow: 0 0 30px rgba(139, 92, 246, 0.5)`).
- ❌ Dilarang menggunakan generic gray tanpa warm undertone pada landing page.
- ❌ Dilarang menggunakan tombol primer hijau neon berlebihan (hijau dikhususkan untuk status klinis dan triage).

## 3. Typography Architecture
- **Display & Headings:** `Geist`, sans-serif. Tight tracking (`tracking-tight`), relaxed leading, berbobot tegas dan presisi editorial.
- **Body Text:** `Geist`, sans-serif. Leading-relaxed, max 65ch per paragraf, kontras minimal 4.5:1.
- **Data Matrix & Numerik:** `Geist Mono`, `JetBrains Mono`. Menggunakan `font-variant-numeric: tabular-nums lining-nums` untuk skor risiko, koordinat spasial, presipitasi, dan suhu.
- **Banned:** Penggunaan default font `Inter`, font serif generic, dan font script dekoratif.

## 4. Page Architecture & Functional Separation
- **Landing Page (`/`):** Value proposition, interactive mock prompt bar / spatial preview, institutional trust logos (Kemendagri 33.74, DSDC 2026, Dinkes, BMKG), dual platform capabilities (Cockpit vs API), multi-source ingestion highlights, and policy outcome proofs.
- **Dashboard (`/dashboard`):** High-density clinical telemetry console (MapLibre vector map, H-7 timeline scrubber, disease breakdown HUD, 16-district triage table).
- **Login Portal (`/login`):** Secure auth portal with ASN operator/epidemiologist presets and WebAuthn / MFA flows.

## 5. Component Behaviors & Map Styling
- **Command Metrics:** Card berstruktur asimetris dengan indikator tren delta, sparkline micro-bar, dan klasifikasi triage.
- **Spatial MapView:** MapLibre GL WebGL dengan marker berlabel skor EHV numerik, ring seleksi dinamis, dan popup klinis ringkas.
- **MapLibre Dark Cockpit Popup:**
  - Background: `#0B111A`
  - Border: `1px solid #1E293B`
  - Text: `#F1F5F9`
  - Box Shadow: `0 12px 28px -5px rgba(0, 0, 0, 0.6)`
  - Pointers/Tips: Dynamic directional pointer border matching `#0B111A`
- **Timeline Scrubber:** Scrubber presisi rentang 8-hari ($H-7$ s.d $H-0$) dengan kontrol play/pause 1.8s interval dan touch slider.
- **Data Matrix Table:** Tabel triage 16 kecamatan dengan badge status rawan rob, indikator bahaya multi-penyakit (DBD, Lepto, ISPA), dan sorting terarah.
- **Export Actions:** Download streaming PDF executive brief & Excel dataset dengan state loading eksplisit.

## 6. Accessibility & Motion Guidelines
- **WCAG AA Compliance:** Rasio kontras teks minimal 4.5:1 dan komponen interaktif minimal 3:1.
- **Keyboard Navigation:** `:focus-visible` ring warna Bio-Emerald dengan outline offset 2px, serta skip link ke konten utama.
- **Prefers-Reduced-Motion:** Transisi mikro maksimal 150ms (`transform`, `opacity`), dan menonaktifkan animasi berulang saat `prefers-reduced-motion: reduce` aktif.
- **Viewport Safety:** Memakai `min-h-[100dvh]` untuk mencegah pergeseran layout (CLS) pada browser mobile.
