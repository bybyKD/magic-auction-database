# Magic Auction Database

Basis data harta karun, alat ekstraksi, dan aplikasi **Magic Auction Predictor** untuk mini-game Magic Auction di Mobile Legends: Go Go.

## Struktur Repo

```
├── auction_predictor/       # Aplikasi React (lihat README-nya untuk dokumentasi lengkap)
├── data/
│   ├── raw/                 # Data mentah & skrip ekstraksi
│   ├── archive/             # Item baru yang ditemukan
│   ├── extract.py           # Definisi item yang digunakan untuk membangun database
│   └── treasure_database.json   # 306 item dengan nama, harga, tipe, bentuk, warna
├── get_files.py             # Utilitas untuk mendaftar file berdasarkan rentang indeks
├── LICENSE                  # Lisensi MIT
└── README.md
```

## Mulai Cepat

```bash
cd auction_predictor
npm install
npm run dev
```

Lihat [`auction_predictor/README.md`](auction_predictor/README.md) untuk dokumentasi aplikasi lengkap.
