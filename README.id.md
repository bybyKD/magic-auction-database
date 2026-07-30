# Magic Auction Database

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19-61DAFB)](auction_predictor/)
[![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-4-FF6F00)](auction_predictor/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)](CONTRIBUTING.md)

> **Basis data harta karun + prediktor bertenaga AI** untuk mini-game *Magic Auction* di Mobile Legends: Go Go.

---

## Fitur

- **Grid Cerdas** — Gambar bentuk harta karun di papan 8x8 dengan blok berwarna
- **Prediksi AI** — Model TensorFlow.js memperkirakan nilai harapan (EV) dari kondisi papan Anda
- **Saran Langsung** — Mesin saran memberi tahu apa yang harus dipilih selanjutnya: warna, item, atau tebakan acak
- **Entri Cepat** — Tempel string notasi papan untuk memuat posisi dalam satu klik
- **Simulator Pelatihan** — Jalankan 1.000+ permainan simulasi untuk melatih model dan lihat kemajuan secara langsung
- **Simpan / Muat** — Ekspor papan Anda sebagai file JSON dan muat kembali nanti
- **Database Item** — 306 harta karun dengan nama, harga, tipe, bentuk, dan warna
- **Dua Bahasa** — Dokumentasi lengkap dalam Bahasa Inggris dan Indonesia

---

## Daftar Isi

- [Arsitektur](#arsitektur)
- [Mulai Cepat](#mulai-cepat)
- [Struktur Proyek](#struktur-proyek)
- [Kontribusi](#kontribusi)
- [Lisensi](#lisensi)

---

## Arsitektur

```
┌─────────────────────────────────────────────────────────────┐
│                     React App (Vite)                        │
│  ┌───────────┐  ┌────────────┐  ┌──────────────────────┐   │
│  │   Board   │  │  Results   │  │   AI Dashboard       │   │
│  │  (Grid)   │  │  (Appraisal)│  │  (Training / Stats)  │   │
│  └─────┬─────┘  └─────┬──────┘  └──────────┬───────────┘   │
│        │              │                     │               │
│  ┌─────┴──────────────┴─────────────────────┴───────────┐  │
│  │              Lapisan Logika Inti                      │  │
│  │  appraisal.js  boardStats.js  suggestionEngine.js     │  │
│  └──────────────────────────┬───────────────────────────┘  │
│                             │                               │
│  ┌──────────────────────────┴───────────────────────────┐  │
│  │              Lapisan ML                               │  │
│  │  model.js  dataProcessor.js  predict.js               │  │
│  └──────────────────────┬───────────────────────────────┘  │
│                         │                                   │
│  ┌──────────────────────┴───────────────────────────────┐  │
│  │              Penyimpanan Data                         │  │
│  │  treasure_database.json  (306 item)                   │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Mulai Cepat

```bash
# Prasyarat: Node.js 18+ dan npm
cd auction_predictor
npm install
npm run dev
```

Buka [http://localhost:5173](http://localhost:5173) di peramban Anda.

### Build untuk produksi

```bash
npm run build
npm run preview
```

Lihat [`auction_predictor/README.md`](auction_predictor/README.md) untuk dokumentasi aplikasi lengkap.

---

## Struktur Proyek

```
.
├── auction_predictor/         → App React (Vite + React 19)
│   └── src/
│       ├── components/        → Board, QuickEntry, Results, AI Dashboard
│       ├── logic/             → appraisal, boardStats, suggestionEngine
│       ├── hooks/             → useBoardStats, useAppraisal, useColorSelection
│       ├── ml/                → Model TensorFlow.js, training, prediksi
│       └── configs/           → Konstanta, konfigurasi game
├── data/
│   ├── treasure_database.json → 306 item kanonik (nama, harga, tipe, bentuk, warna)
│   ├── extract.py             → Skrip ekstraksi definisi item
│   ├── raw/                   → Skrip ekspor mentah dan data yang dipulihkan
│   └── archive/               → Arsip penemuan item
├── assets/                    → Tangkapan layar, merek, favicon
├── docs/                      → Dokumentasi lanjutan
├── LICENSE                    → Lisensi MIT
├── README.md                  → English documentation
└── README.id.md
```

---

## Kontribusi

Kontribusi sangat diterima! Silakan baca [CONTRIBUTING.md](CONTRIBUTING.md) untuk memulai.

Catatan: Database item bersumber dari game yang sebenarnya. Pull request yang mengubah metadata item umumnya tidak akan diterima kecuali Anda dapat menyebutkan game sebagai sumbernya.

---

## Lisensi

[MIT](LICENSE) © bybyKD

---

[English](README.md)
