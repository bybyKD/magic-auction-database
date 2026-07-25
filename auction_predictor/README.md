# Magic Auction Predictor

A smart bidding assistant for the **Magic Auction** mini-game in Mobile Legends: Go Go. Paint the treasure grid as clues are revealed, and get real-time expected value calculations, optimal bid recommendations, and AI-powered opponent bid predictions.

## Features

### Core
- **Interactive Grid Painter** — Drag-to-paint a 10x12 board to mirror the in-game treasure layout
- **Real-Time Appraisal Engine** — Instantly calculates expected values for each painted group using a 306-item database
- **Clue Integration** — Input exact color quantities, color values, and minimum total value clues to narrow predictions
- **AI Prediction Dashboard** — TensorFlow.js neural network that learns from your match history to predict opponent bids
- **Commander-Aware AI** — Neural network includes commander info score as input, so predictions account for how much information each commander reveals
- **Smart Hidden EV** — Uses conditional distributions from clue data to estimate unrevealed block values
- **Strategy Guide** — Built-in reference for instant-win mechanics, round multipliers, and commander abilities
- **Commander Assistant** — Displays selected commander's auction-specific abilities with info level indicator
- **Match Logger** — Record winning bids and actual values to continuously improve AI accuracy

### Input Speed (Desktop-Optimized)
- **Undo/Redo** — Full undo/redo stack (30 actions) via `Ctrl+Z` / `Ctrl+Shift+Z` or toolbar buttons
- **Keyboard Shortcuts** — `1-4` switch colors, `E` mark empty, `R` eraser, `Esc` cancel
- **Preset Shape Palette** — 12 common shapes (1x1 through 4x2) for one-tap placement
- **Place Mode** — Select a shape, click the grid to place instantly (no dragging needed)
- **Quick Entry** — Type coordinates like `A1-B2 gold` to place blocks without touching the grid
- **Right-Click Delete** — Right-click any block to remove it instantly

### Intelligence
- **Suggestions Engine** — Analyzes clues and suggests remaining blocks needed
- **Group Confidence** — Color-coded confidence badges on each appraisal (high/medium/low)
- **Commander Info Score** — Shows how much info your commander provides at the current round

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 |
| Build | Vite 8 |
| ML | TensorFlow.js 4 |
| Linting | OxLint |

## Project Structure

```
auction_predictor/
├── src/
│   ├── main.jsx                 # Entry point
│   ├── App.jsx                  # Root component (layout + state + keyboard shortcuts)
│   ├── App.css                  # Global styles & glassmorphism theme
│   ├── index.css                # Base reset
│   │
│   ├── data/                    # Static game data (DATABASE)
│   │   ├── treasure_database.json   # 306 items (name, price, type, shape, color)
│   │   ├── game_rules.json          # Houses, rounds, multipliers
│   │   └── commanders.json          # 12 commander abilities
│   │
│   ├── logic/                   # Pure business logic (no React)
│   │   ├── constants.js             # Grid dimensions, color EVs, type icons
│   │   ├── appraisal.js             # computeAppraisals() — item matching & EV
│   │   ├── boardStats.js            # computeBoardStats() — board-level estimates
│   │   ├── commanderInfo.js         # Commander info curves for all 12 commanders
│   │   ├── gridHistory.js           # Undo/redo stack (30 actions)
│   │   └── suggestionEngine.js      # Suggests remaining blocks from clues
│   │
│   ├── hooks/                   # React hooks (state + logic bridge)
│   │   ├── useAppraisals.js         # Memoized appraisal computation
│   │   └── useBoardStats.js         # Memoized board stats + AI + commander info
│   │
│   ├── ml/                      # Machine learning layer
│   │   ├── AuctionBrain.js          # TensorFlow.js model (6 inputs, 2 outputs)
│   │   └── DatasetManager.js        # localStorage dataset + normalization
│   │
│   ├── components/              # UI components
│   │   ├── GridArea.jsx/css         # Interactive grid (drag, place mode, right-click)
│   │   ├── Controls.jsx/css         # Brush palette, shapes, shortcuts, round/house
│   │   ├── QuickEntry.jsx/css       # Coordinate text input (A1-B2 gold)
│   │   ├── CluesPanel.jsx/css       # Color quantity & value inputs
│   │   ├── ResultsPanel.jsx/css     # Dashboard + suggestions + appraisals
│   │   ├── StrategyGuide.jsx/css    # Game rules modal
│   │   ├── CommanderAssistant.jsx/css  # Commander ability panel
│   │   ├── MLDashboard.jsx          # AI training interface
│   │   └── MatchLogger.jsx          # Match result logger
│   │
│   └── assets/                  # Static assets
│       ├── hero.png
│       ├── react.svg
│       └── vite.svg
│
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── index.html
├── package.json
└── vite.config.js
```

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Lint
npm run lint
```

## How It Works

### Appraisal Algorithm

1. The player paints cells on the 10x12 grid to match what they see in-game
2. Each painted group is matched against all 306 items in the database
3. For each item, the algorithm checks every possible board placement:
   - Does the placement cover all painted cells in the group?
   - Does it avoid any cells marked as empty?
   - Do all overlapping painted cells match in color and type?
4. The **Median Expected Value** is calculated across all valid placements (using median instead of mean to eliminate outlier skew from 5M hero figurines)
5. A confidence score is derived from the number of possible items (fewer = more confident)

### Commander-Aware AI

The neural network takes **6 normalized inputs**:
- **Round** (1-5)
- **House** (Eruditio/Dawnlight/World/Cosmic)
- **Painted Blocks** (0-48)
- **Revealed EV** (sum of painted group EVs)
- **Hidden EV** (estimated value of unpainted cells)
- **Commander Info Score** (0-1, how much info the commander reveals at this round)

Each commander has a hard-coded info curve based on what they reveal:
- **Layla**: R1 start=3 full reveals, then +1/round (infoScore: 0.19 → 0.44)
- **Aurora**: R5=ALL qualities revealed (infoScore: 0 → 0.70)
- **Johnson**: R3=all sizes revealed (infoScore: 0.08 → 0.50)
- **Lunox**: R1=5 qualities, then +2/round (infoScore: 0.21 → 0.54)

High-info commanders cause the AI to predict bids closer to true EV (players with more info bid more accurately).

### Smart Hidden EV

Instead of a flat 583 gold per hidden block, the system uses conditional distributions:
- If clues say "Red = 3" and you've found 1, 2 more Red blocks exist (valued at 150K each)
- Generic hidden blocks are weighted by unconstrained colors' average values
- Commander info discount reduces hidden EV uncertainty proportionally to info score

### Instant Win Mechanics

Each round has a multiplier that determines when a bid guarantees a win:

| Round | Multiplier | Description |
|-------|-----------|-------------|
| 1 | 2.0x | Win instantly if bid is 2x higher than 2nd place |
| 2 | 1.5x | Win instantly if bid is 1.5x higher than 2nd place |
| 3 | 1.3x | Win instantly if bid is 1.3x higher than 2nd place |
| 4 | 1.1x | Win instantly if bid is 1.1x higher than 2nd place |
| 5 | 1.0x | Highest bidder wins |

## Database

The treasure database contains **306 items** across 6 rarity tiers:

| Rarity | Value Range | Example |
|--------|-----------|---------|
| Red | 100K - 5M | Magic Hero Figurine (5M), Chaos Orb (3M) |
| Gold | 55K - 100K | Divine Crossbow (100K), Dark System (99K) |
| Purple | 15K - 54K | Thread of Fate (54K), Autobot Shield (45K) |
| Blue | 5.8K - 14K | Sacred Sand (14K), Crystal Lamp (12K) |
| Green | 2K - 5.5K | Rockcore Stone (5.5K), Knight's Medal (5K) |
| Gray | 100 - 1.8K | Common Clay (100), Healing Herb (200) |

Each item has: name, price, type (Weapon/Armor/Potion/Gem/etc.), grid shape (e.g. 2x2), and rarity color.

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `1` | Switch to Bronze color |
| `2` | Switch to Silver color |
| `3` | Switch to Gold color |
| `4` | Switch to Red color |
| `E` | Mark Empty mode |
| `R` | Eraser mode |
| `Esc` | Cancel shape / close Quick Entry |
| `Ctrl+Z` | Undo |
| `Ctrl+Shift+Z` | Redo |
| `Ctrl+Y` | Redo |
| `Right-click` | Delete block at cursor |
