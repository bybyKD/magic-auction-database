# Magic Auction Database

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19-61DAFB)](auction_predictor/)
[![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-4-FF6F00)](auction_predictor/)

Treasure database, extraction tools, and the **Magic Auction Predictor** app for the Magic Auction mini-game in Mobile Legends: Go Go.

## Repo Structure

```
├── auction_predictor/       # React app (see its README for full docs)
├── data/
│   ├── raw/                 # Raw data & extraction scripts
│   ├── archive/             # Newly discovered items
│   ├── extract.py           # Item definitions used to build databases
│   └── treasure_database.json   # 306 items with name, price, type, shape, color
├── get_files.py             # Utility to list files by index range
├── LICENSE                  # MIT License
├── README.id.md             # Dokumentasi Bahasa Indonesia
└── README.md
```

## Quick Start

```bash
cd auction_predictor
npm install
npm run dev
```

See [`auction_predictor/README.md`](auction_predictor/README.md) for full app documentation.

---

[Bahasa Indonesia](README.id.md)
