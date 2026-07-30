# Magic Auction Database

Treasure database, extraction tools, and the **Magic Auction Predictor** app for the Magic Auction mini-game in Mobile Legends: Go Go.

## Repo Structure

```
├── auction_predictor/       # React app (see its README for full docs)
├── 02 Treasure Collection/  # Raw data & extraction scripts
├── extract.py               # Item definitions used to build databases
├── get_files.py             # Utility to list files by index range
├── treasure_database.json   # 306 items with name, price, type, shape, color
├── new_items.json           # Newly discovered items
└── new_items_clean.json     # Cleaned/merged item data
```

## Quick Start

```bash
cd auction_predictor
npm install
npm run dev
```

See [`auction_predictor/README.md`](auction_predictor/README.md) for full app documentation.
