# Magic Auction Database

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19-61DAFB)](auction_predictor/)
[![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-4-FF6F00)](auction_predictor/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)](CONTRIBUTING.md)
[![pages-build-deployment](https://github.com/bybyKD/magic-chess-gogo-auction/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/bybyKD/magic-chess-gogo-auction/deployments)

> **Treasure database + AI-powered predictor** for the *Magic Auction* mini-game in Mobile Legends: Go Go.

---

https://github.com/user-attachments/assets/980482aa-d5e4-40e7-b705-255e3d27a9d3

---

## Features

- **Smart Grid** — Paint treasure shapes on an 8×8 board with color-coded blocks
- **AI Prediction** — TensorFlow.js model estimates the expected value (EV) of your board state
- **Live Suggestions** — The suggestion engine tells you exactly what to pick next: a color, an item, or a random guess
- **Quick Entry** — Paste a board-notation string to load a position in one click
- **Training Simulator** — Run 1,000+ simulation games to train the model and watch progress in real time
- **Save / Load** — Export your current board as a JSON file and reload it later
- **Item Database** — 306 treasures with name, price, type, shape, and color data
- **Bilingual** — Full English and Indonesian (Bahasa Indonesia) documentation

---

## Table of Contents

- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Data Pipeline](#data-pipeline)
- [Contributing](#contributing)
- [License](#license)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     React App (Vite)                        │
│  ┌───────────┐  ┌────────────┐  ┌──────────────────────┐   │
│  │   Board   │  │  Results   │  │   AI Dashboard       │   │
│  │  (Grid)   │  │  (Appraisal)│  │  (Training / Stats)  │   │
│  └─────┬─────┘  └─────┬──────┘  └──────────┬───────────┘   │
│        │              │                     │               │
│  ┌─────┴──────────────┴─────────────────────┴───────────┐  │
│  │              Core Logic Layer                         │  │
│  │  appraisal.js  boardStats.js  suggestionEngine.js     │  │
│  └──────────────────────────┬───────────────────────────┘  │
│                             │                               │
│  ┌──────────────────────────┴───────────────────────────┐  │
│  │              ML Layer                                 │  │
│  │  model.js  dataProcessor.js  predict.js               │  │
│  └──────────────────────┬───────────────────────────────┘  │
│                         │                                   │
│  ┌──────────────────────┴───────────────────────────────┐  │
│  │              Data Store                               │  │
│  │  treasure_database.json  (306 items)                  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Quick Start

```bash
# Prerequisites: Node.js 18+ and npm
cd auction_predictor
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for production

```bash
npm run build
npm run preview
```

See [`auction_predictor/README.md`](auction_predictor/README.md) for full app documentation.

---

## Project Structure

```
.
├── auction_predictor/         → React app (Vite + React 19)
│   └── src/
│       ├── components/        → Board, QuickEntry, Results, AI Dashboard
│       ├── logic/             → appraisal, boardStats, suggestionEngine
│       ├── hooks/             → useBoardStats, useAppraisal, useColorSelection
│       ├── ml/                → TensorFlow.js model, training, prediction
│       └── configs/           → Constants, game configuration
├── data/
│   ├── treasure_database.json → 306 canonical items (name, price, type, shape, color)
│   ├── extract.py             → Item definition extraction script
│   ├── raw/                   → Raw export scripts and recovered data
│   └── archive/               → Archived item discoveries
├── assets/                    → Screenshots, branding, favicon
├── docs/                      → Extended documentation
├── LICENSE                    → MIT License
├── README.id.md               → Dokumentasi Bahasa Indonesia
└── README.md
```

---

## Data Pipeline

The treasure database is built from raw game data exports:

1. **Raw exports** (`data/raw/`) — scraped or manually extracted item records
2. **Extraction** (`data/extract.py`) — transforms raw data into the canonical JSON format
3. **Canonical DB** (`data/treasure_database.json`) — 306 items with fields:
   - `name` — Treasure name (e.g. "Chaos Orb")
   - `price` — Gold value in the auction house
   - `type` — Category (e.g. "weapon", "armor", "magic")
   - `shape` — Board footprint (e.g. `"2x2"`, `"1x3"`)
   - `description` — Flavor text
   - `name_color` — Color key for grid painting

---

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) to get started.

Note: The item database is sourced from the actual game. Pull requests that change item metadata will generally not be accepted unless you can cite the game as the source.

---

## License

[MIT](LICENSE) © bybyKD

---

[Bahasa Indonesia](README.id.md)
