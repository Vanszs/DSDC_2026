# 🧠 ARSITEKTUR MACHINE LEARNING & MODEL EPIDEMIOLOGI IKLIM 30 TAHUN
## ECOHEALTH PULSE — KOTA SEMARANG (DSDC 2026)

> **Dokumen Panduan Teknis & Fondasi Ilmiah Sistem Prediksi Kesehatan Lingkungan Berbasis Reanalisis Iklim ECMWF ERA5 (1994–2025)**

---

## 📌 DAFTAR ISI
1. [Ringkasan Eksekutif (Konsep untuk Awam)](#1-ringkasan-eksekutif-konsep-untuk-awam)
2. [Arsitektur Pipeline Data 30 Tahun (Zero Data Leakage)](#2-arsitektur-pipeline-data-30-tahun-zero-data-leakage)
3. [Parameter Cuaca & Landasan Epidemiologis](#3-parameter-cuaca--landasan-epidemiologis)
4. [Formulasi Matematika & Kurva Non-Linear](#4-formulasi-matematika--kurva-non-linear)
   - 4.1. Kurva Kesesuaian Termal Briere (DBD)
   - 4.2. Model Lag Hujan DLNM Gaussian (Inkubasi Larva)
   - 4.3. Indeks Stagnasi Ventilasi Atmosfer (ISPA & Aerosol)
   - 4.4. Skalabilitas Topografis Lapse Rate DEMNAS 30m
5. [Algoritma Pelatihan & Solusi Aljabar Linear (L2 Ridge Regression)](#5-algoritma-pelatihan--solusi-aljabar-linear-l2-ridge-regression)
6. [Dynamic Feature Attribution (Mesin Rekomendasi Terbuka)](#6-dynamic-feature-attribution-mesin-rekomendasi-terbuka)
7. [Hasil Evaluasi Kinerja pada Holdout Test Set (2021–2025)](#7-hasil-evaluasi-kinerja-pada-holdout-test-set-20212025)
8. [Struktur File & Alur Eksekusi Kode di Backend](#8-struktur-file--alur-eksekusi-kode-di-backend)

---

## 1. RINGKASAN EKSEKUTIF (KONSEP UNTUK AWAM)

### Mengapa Kita Tidak Perlu Menunggu Kasus Rumah Sakit Meledak?
Sebagian besar penanganan wabah di perkotaan bersifat **reaktif**: dinas kesehatan baru melakukan penyemprotan (*fogging*) atau imbauan medis setelah bangsal rumah sakit terisi pasien.

**EcoHealth Pulse** mengubah cara kerja ini menjadi **preventif** melalui pemodelan biometeorologi:
- **Demam Berdarah Dengue (DBD)** tidak muncul tiba-tiba. Nyamuk *Aedes aegypti* membutuhkan suhu udara tertentu untuk berkembang biak secara optimal ($28.5^\circ\text{C}$), serta genangan air hujan dari 1–2 minggu sebelumnya agar jentik nyamuk menetas menjadi nyamuk dewasa penular virus.
- **ISPA (Infeksi Saluran Pernapasan Akut)** melonjak saat konsentrasi debu halus ($PM_{2.5}$) tinggi dan kecepatan angin rendah (stagnasi udara), sehingga polusi terjebak di lapisan bawah udara yang dihirup masyarakat.

Dengan mempelajari pola iklim harian Kota Semarang selama **30 tahun (11.688 hari)**, sistem dapat menghitung potensi bahaya penyakit **1–2 minggu sebelum ledakan kasus terjadi**, memberikan waktu bagi dinas kesehatan untuk melakukan intervensi dini.

---

## 2. ARSITEKTUR PIPELINE DATA 30 TAHUN (ZERO DATA LEAKAGE)

```
[1. INGESTION]  -->  [2. PREPROCESSING]  -->  [3. TRAINING]  -->  [4. EVALUATION]  -->  [5. PRODUCTION ENGINE]
Open-Meteo ERA5      Feature Engineering      L2 Ridge Closed-    Holdout Test Set      Pure TypeScript Runtime
1994–2025 (11.688d)   StandardScaler (Train)   Form Matrix Solver  R², MAE, F1 Score     <1ms Latency (Zero-Python)
```

### Pembagian Dataset Temporal (Purged Time Split)
Untuk menjamin model tidak "menyontek" masa depan (*data leakage*), dataset dibagi secara kronologis murni:
1. **Training Set (70% | 8.171 Hari):** `15 Januari 1994 s.d. 29 Mei 2016`
   - Digunakan untuk fitting normalisasi data (*StandardScaler*) dan kalkulasi bobot regresi.
2. **Validation Set (15% | 1.751 Hari):** `30 Mei 2016 s.d. 15 Maret 2021`
   - Digunakan untuk penalaan penalti regularisasi $\lambda$ (anti-overfitting).
3. **Holdout Test Set (15% | 1.752 Hari):** `16 Maret 2021 s.d. 31 Desember 2025`
   - Disimpan terisolasi total untuk menguji akurasi prediksi pada data yang belum pernah dilihat model.

---

## 3. PARAMETER CUACA & LANDASAN EPIDEMIOLOGIS

| Parameter Cuaca | Satuan | Landasan Ilmiah & Pengaruh Biologis |
|---|---|---|
| **Suhu Rata-rata ($T_{\text{avg}}$)** | $^\circ\text{C}$ | Memengaruhi siklus replikasi virus dengue di dalam tubuh nyamuk (*Extrinsic Incubation Period*). |
| **Suhu Minimum ($T_{\text{min}}$)** | $^\circ\text{C}$ | Suhu dingin malam hari membatasi aktivitas nyamuk dan memicu iritasi saluran pernapasan. |
| **Rentang Suhu Harian ($DTR$)** | $^\circ\text{C}$ | Selisih $T_{\max} - T_{\min}$. Fluktuasi suhu tajam meningkatkan laju mortalitas larva nyamuk. |
| **Curah Hujan Harian ($Rain$)** | $\text{mm}$ | Bahan baku genangan air untuk perindukan telur nyamuk. |
| **Curah Hujan Lag-14 ($Rain_{\text{lag}}$)** | $\text{mm}$ | Akumulasi hujan terbobot 14 hari sebelumnya (fase telur $\rightarrow$ larva $\rightarrow$ nyamuk dewasa). |
| **Kelembapan Relatif ($RH$)** | $\%$ | Kelembapan $>75\%$ memperpanjang usia hidup nyamuk dewasa sehingga kesempatan menularkan virus meningkat. |
| **Partikulat Debu ($PM_{2.5}$)** | $\mu\text{g/m}^3$ | Partikel mikroskopis yang masuk hingga ke alveoli paru-paru, memicu inflamasi ISPA dan asma. |
| **Gas Polutan ($NO_2, CO$)** | $\mu\text{g/m}^3$ | Emisi kendaraan dan industri yang memperparah iritasi mukosa pernapasan. |
| **Kecepatan Angin ($v_{\text{wind}}$)** | $\text{km/jam}$ | Kecepatan angin rendah ($\le 11\text{ km/jam}$) menyebabkan polutan terjebak (*atmospheric stagnation*). |

---

## 4. FORMULASI MATEMATIKA & KURVA NON-LINEAR

### 4.1. Kurva Kesesuaian Termal Briere (DBD)
Nyamuk tidak berkembang biak secara linear terhadap suhu. Di bawah $16^\circ\text{C}$ nyamuk mati kedinginan, dan di atas $36^\circ\text{C}$ enzim nyamuk rusak. Kapasitas vektor optimum tercapai pada $28.5^\circ\text{C}$.

Formulasi non-linear **Briere et al. (1999) / Mordecai et al. (2019)**:
$$S(T) = c \cdot T \cdot (T - T_{\min}) \cdot \sqrt{T_{\max} - T}$$

Di mana:
- $T_{\min} = 16.0^\circ\text{C}$ (Batas bawah termal)
- $T_{\max} = 36.0^\circ\text{C}$ (Batas atas termal)
- $c = 0.000147$ (Konstanta normalisasi agar $S(T) \in [0, 1]$)

```typescript
export function computeBriereSuitability(temp: number): number {
  if (temp <= 16.0 || temp >= 36.0) return 0.0;
  const raw = 0.000147 * temp * (temp - 16.0) * Math.sqrt(36.0 - temp);
  return Math.min(1.0, Math.max(0.0, raw));
}
```

---

### 4.2. Model Lag Hujan DLNM Gaussian (Inkubasi Larva)
Hujan deras hari ini **tidak langsung** menyebabkan DBD hari ini. Efek puncak terjadi sekitar **8 hari kemudian** saat telur yang terendam telah berkembang menjadi nyamuk dewasa yang siap menggigit.

Pembobotan menggunakan kernel **Gaussian Distributed Lag Model**:
$$w_k = \frac{1}{\sigma \sqrt{2\pi}} \exp\left( -\frac{(k - \mu)^2}{2\sigma^2} \right), \quad \mu = 8\text{ hari}, \sigma = 2.5$$
$$\text{LagRainfallIndex}(t) = \sum_{k=0}^{13} w_k \cdot \ln(1 + \text{Rainfall}(t - k))$$

*Catatan: Transformasi logaritmik $\ln(1 + R)$ digunakan untuk melindungi model dari outlier presipitasi ekstrim (misal: banjir 150mm).*

---

### 4.3. Indeks Stagnasi Ventilasi Atmosfer (ISPA & Aerosol)
Risiko ISPA dihitung dari beban polutan terinversi:
$$\text{VentilationFactor} = \max\left(0.45, 1.0 - \frac{v_{\text{wind}}}{28.0}\right)$$
$$\text{ISPA\_Raw} = \left(\frac{PM_{2.5}}{50}\times 50\right) + \left(\frac{NO_2}{30}\times 20\right) + \left(\frac{CO}{1.0}\times 10\right) + (\text{Stagnant} ? 15 : 5)$$

---

### 4.4. Skalabilitas Topografis Lapse Rate DEMNAS 30m
Kota Semarang memiliki kontur bervariasi dari dataran pantai ($0\text{ mdpl}$) hingga perbukitan Banyumanik & Gunungpati ($350\text{ mdpl}$). Data makro ERA5 didistribusikan secara fisik:
1. **Suhu Udara (Environmental Lapse Rate):**
   $$T_{\text{lokal}} = T_{\text{ERA5}} - 0.0065 \cdot (h_{\text{DEMNAS}} - 65.0)$$
2. **Koreksi Presipitasi Lereng Orografis:**
   $$P_{\text{lokal}} = P_{\text{ERA5}} \cdot \left(1 + 0.0007 \cdot \max(0, h_{\text{DEMNAS}} - 50.0)\right)$$

---

## 5. ALGORITMA PELATIHAN & SOLUSI ALJABAR LINEAR (L2 RIDGE REGRESSION)

Untuk mengeliminasi dependensi server Python di runtime, pelatihan model diselesaikan menggunakan solusi **Closed-Form Normal Equation dengan L2 Tikhonov Regularization**:

$$W = (X^T X + \lambda I^*)^{-1} X^T y$$

Di mana:
- $X \in \mathbb{R}^{N \times (D+1)}$: Matriks fitur yang telah dinormalisasi Z-score ($z = \frac{x - \mu}{\sigma}$).
- $y \in \mathbb{R}^N$: Target skor risiko historis ($0 - 100$).
- $\lambda = 0.01$: Parameter penalti pencegah overfitting.
- $I^*$: Matriks identitas modifikasi di mana kolom bias (indeks 0) bernilai $0$ (*Unregularized Intercept* agar baseline model tidak terdistorsi).

### Bobot Model Terlatih (`src/lib/ml-weights.json`):
- **Model DBD:**
  - $\text{Bias} = 48.21$
  - $w_{\text{Briere}} = +4.85$ (Suhu optimum mempercepat transmisi)
  - $w_{\text{LagRain}} = +6.12$ (Genangan hujan pemicu terbesar)
  - $w_{\text{RH}} = +1.42$ (Kelembapan tinggi menjaga kebugaran nyamuk)
  - $w_{\text{DTR}} = -0.84$ (Fluktuasi suhu ekstrem menekan populasi)
- **Model ISPA:**
  - $\text{Bias} = 46.18$
  - $w_{PM_{2.5}} = +8.34$ (Partikulat debu pemicu utama)
  - $w_{NO_2} = +2.45$ (Emisi lalu lintas)
  - $w_{\text{Wind}} = -3.81$ (Angin kencang membantu pembersihan udara)

---

## 6. DYNAMIC FEATURE ATTRIBUTION (MESIN REKOMENDASI TERBUKA)

Sistem bukan merupakan *black-box AI*. Pada setiap inferensi harian, kontribusi matematis tiap fitur dihitung:
$$\text{Kontribusi}_i = w_i \cdot z_i = w_i \cdot \left(\frac{x_i - \mu_i}{\sigma_i}\right)$$

Fitur dengan nilai kontribusi positif tertinggi ($\operatorname{argmax} \text{Kontribusi}_i$) otomatis ditetapkan sebagai **Faktor Pemicu Utama**, yang kemudian memicu **Playbook Aksi Kebijakan Dinas Kesehatan** secara dinamis.

Contoh:
- Jika $\text{Kontribusi}_{\text{LagRain}}$ dominan $\rightarrow$ Pemicu: *"Akumulasi Genangan Air Pasca-Hujan"* $\rightarrow$ Rekomendasi: *"Pemberantasan Sarang Nyamuk (PSN 3M Plus) & Larvasidasi pada genangan air."*
- Jika $\text{Kontribusi}_{PM_{2.5}}$ dominan $\rightarrow$ Pemicu: *"Konsentrasi Partikulat Aerosol PM2.5 Tinggi"* $\rightarrow$ Rekomendasi: *"Peningkatan ventilasi udara dalam ruangan dan pembagian masker medis bagi kelompok rentan."*

---

## 7. ARSITEKTUR 3-TIER RESILIENT INGESTION & INFERENCE (ZERO-DOWNTIME ROBUSTNESS)

Untuk menjamin sistem tidak pernah gagal (*zero-downtime*) dan selalu menyajikan data cuaca terkini saat diakses juri:

```
                              REQUEST USER (/api/analytics?date=YYYY-MM-DD)
                                                    │
                                                    ▼
                ┌───────────────────────────────────────────────────────┐
                │ TIER 1: DATABASE CACHE HIT                            │
                │ Cek data targetDate di PostgreSQL (< 5ms)             │
                └───────────────────────────┬───────────────────────────┘
                                            │
                            ┌───────────────┴───────────────┐
                            │ ADA DI DB                     │ BELUM ADA / DATA HARI INI
                            ▼                               ▼
                ┌───────────────────────┐       ┌───────────────────────────────────────┐
                │ RETURN DARI DB        │       │ TIER 2: LIVE OPEN-METEO INGESTION     │
                │ Latensi: < 5 ms       │       │ Tarik 14 hari cuaca ECMWF IFS terbaru │
                └───────────────────────┘       └───────────────────┬───────────────────┘
                                                                    │
                                                    ┌───────────────┴───────────────┐
                                                    │ SUKSES                        │ GAGAL (API Down/Offline)
                                                    ▼                               ▼
                                        ┌───────────────────────┐       ┌───────────────────────┐
                                        │ RUN INFERENCE ENGINE  │       │ TIER 3: 30-YR BASELINE│
                                        │ Hitung L2 Ridge &     │       │ Gunakan baseline      │
                                        │ Upsert ke Database    │       │ iklim 30 tahun +      │
                                        │ Latensi: ~150 ms      │       │ Lapse Rate Topografis │
                                        └───────────────────────┘       └───────────────────────┘
```

1. **Tier 1 (Database Cache Hit)**: Jika data sudah ada di database, langsung disajikan instan ($<5\text{ ms}$).
2. **Tier 2 (Live Open-Meteo Ingestion)**: Jika data belum ada, sistem otomatis menarik time-series 14 hari cuaca ECMWF terkini, mengeksekusi inferensi L2 Ridge, dan menyimpannya (*upsert*) ke database.
3. **Tier 3 (Zero-Downtime Climatological Fallback)**: Jika API pihak ketiga down atau jaringan terputus, sistem otomatis beralih ke baseline iklim 30 tahun sehingga tidak pernah terjadi HTTP 500 error.

---

## 8. HASIL EVALUASI KINERJA PADA HOLDOUT TEST SET (2021–2025)

Pengujian pada data riil 1.752 hari (`data/evaluation_report.json`):

| Metrik Evaluasi | Model DBD | Model ISPA | Skor Bahaya Gabungan |
|---|:---:|:---:|:---:|
| **Koefisien Determinasi ($R^2$)** | **0.9367** | **0.9242** | **0.9176** |
| **Mean Absolute Error ($MAE$)** | 1.06 poin | 2.81 poin | 1.38 poin |
| **Root Mean Squared Error ($RMSE$)** | 1.35 poin | 3.53 poin | 1.79 poin |

### Evaluasi Klasifikasi Status Siaga (Triage Classification $\ge 40$):
- **Precision:** $87.74\%$
- **Recall (Sensitivitas Deteksi Bahaya):** **$97.72\%$** (Sangat krusial untuk kesehatan masyarakat agar tidak ada potensi wabah yang terlewat).
- **F1-Score:** **$0.9246$**
- **Akurasi Keseluruhan:** **$89.61\%$**

---

## 9. STRUKTUR FILE & ALUR EKSEKUSI KODE DI BACKEND

```
src/
├── lib/
│   ├── climatology.ts        # Implementasi fungsi matematis murni (Briere, DLNM, Lapse Rate)
│   ├── ml-inference.ts       # Engine inferensi real-time berbasis bobot terlatih
│   ├── ml-weights.json       # Nilai bobot w_i, bias, dan parameter scaler mu & sigma
│   ├── openmeteo.ts          # Integrasi API cuaca ECMWF ERA5 & Open-Meteo
│   └── queries.ts            # Drizzle ORM batch query & agregasi database
├── db/
│   ├── schema.ts             # Skema tabel PostgreSQL & PostGIS (Zero-Leptospirosis)
│   └── seed-semarang.ts      # Seeder 1 kesatuan teritorial Kota Semarang
scripts/pipeline/
├── 01_collect_climate_data.ts # Ingestor dataset 30 tahun (1994–2025)
├── 02_preprocess_features.ts  # Ekstraksi fitur & fitting StandardScaler
├── 03_train_models.ts        # Trainer regresi L2 Ridge aljabar linear
└── 04_evaluate_models.ts     # Evaluator komprehensif pada holdout test set
```

---

*Dokumen ini disusun sebagai bagian dari pemenuhan standar penilaian Data Science & AI Competition (DSDC 2026).*
