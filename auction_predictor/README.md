# Magic Auction Predictor

A smart bidding assistant for the **Magic Auction** mini-game in Mobile Legends. Paint the treasure grid as clues are revealed, and get real-time expected value calculations, optimal bid recommendations, and AI-powered opponent bid predictions.

## Features

- **Interactive Grid Painter** — Drag-to-paint a 10x12 board to mirror the in-game treasure layout
- **Real-Time Appraisal Engine** — Instantly calculates expected values for each painted group using a 306-item database
- **Clue Integration** — Input exact color quantities, color values, and minimum total value clues to narrow predictions
- **AI Prediction Dashboard** — TensorFlow.js neural network that learns from your match history to predict opponent bids
- **Strategy Guide** — Built-in reference for instant-win mechanics, round multipliers, and commander abilities
- **Commander Assistant** — Displays selected commander's auction-specific abilities
- **Match Logger** — Record winning bids and actual values to continuously improve AI accuracy

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
│   ├── App.jsx                  # Root component (layout + state wiring)
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
│   │   └── boardStats.js            # computeBoardStats() — board-level estimates
│   │
│   ├── hooks/                   # React hooks (state + logic bridge)
│   │   ├── useAppraisals.js         # Memoized appraisal computation
│   │   └── useBoardStats.js         # Memoized board stats + AI predictions
│   │
│   ├── ml/                      # Machine learning layer
│   │   ├── AuctionBrain.js          # TensorFlow.js model (train/predict)
│   │   └── DatasetManager.js        # localStorage dataset + normalization
│   │
│   ├── components/              # UI components
│   │   ├── GridArea.jsx/css         # Interactive drag-to-paint grid
│   │   ├── Controls.jsx/css         # Brush palette, round/house/commander
│   │   ├── CluesPanel.jsx/css       # Color quantity & value inputs
│   │   ├── ResultsPanel.jsx/css     # Dashboard + per-group appraisals
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

### AI Predictions

The neural network takes 5 normalized inputs:
- **Round** (1-5)
- **House** (Eruditio/Dawnlight/World/Cosmic)
- **Painted Blocks** (0-48)
- **Revealed EV** (sum of painted group EVs)
- **Hidden EV** (estimated value of unpainted cells)

It outputs 2 predictions:
- **Predicted Opponent Bid** — what the AI thinks the winning bid will be
- **Predicted Actual Value** — what the AI thinks the board is actually worth

Train the model by logging match results over time. Data is stored in localStorage.

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
