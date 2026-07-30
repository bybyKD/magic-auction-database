# Architecture

## Overview

The project is a single-page React 19 application bootstrapped with Vite. It uses TensorFlow.js for the AI prediction engine and runs entirely in the browser. There is no backend server.

## Layer Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                      Presentation Layer                       │
│  GridArea  Controls  CluesPanel  ResultsPanel  MLDashboard   │
│  QuickEntry  StrategyGuide  CommanderAssistant  MatchLogger   │
└──────────────────────────┬───────────────────────────────────┘
                           │ props / callbacks
┌──────────────────────────┴───────────────────────────────────┐
│                       Hooks Layer                             │
│  useBoardStats  useAppraisals  useColorSelection              │
│  (state management, memoization, side effects)                │
└──────────────────────────┬───────────────────────────────────┘
                           │
┌──────────────────────────┴───────────────────────────────────┐
│                       Logic Layer                             │
│  appraisal.js      — EV computation per cell                  │
│  boardStats.js     — aggregate board statistics               │
│  suggestionEngine.js — optimal next-pick suggestions          │
│  constants.js      — game dimensions, color map               │
│  gridHistory.js    — undo/redo stack                          │
│  matching.js       — shape matching against database          │
└──────────────────────────┬───────────────────────────────────┘
                           │
┌──────────────────────────┴───────────────────────────────────┐
│                        ML Layer                               │
│  model.js           — TensorFlow.js model definition           │
│  dataProcessor.js   — feature engineering for training         │
│  predict.js         — inference wrapper                       │
│  trainingManager.js — training loop (web workers?)            │
└──────────────────────────┬───────────────────────────────────┘
                           │
┌──────────────────────────┴───────────────────────────────────┐
│                       Data Layer                              │
│  treasure_database.json  (306 items)                          │
│  game_rules.json         (rounds, houses, commanders)         │
│  commanders.json         (commander abilities)                │
└──────────────────────────────────────────────────────────────┘
```

## Key Data Flow

1. User paints blocks on the grid (or uses QuickEntry)
2. `useBoardStats` hook triggers `appraisal.js` to compute EV for each cell
3. Results feed into `suggestionEngine.js` for optimal moves
4. ML model optionally predicts bid amounts based on board state
5. All state is React-managed; no persistence beyond localStorage save/load

## ML Training Pipeline

The AI Dashboard (`MLDashboard`) exposes:
- **Simulation**: runs N random games to generate training data
- **Training**: trains the TensorFlow.js model on simulated data
- **Prediction**: uses the trained model to predict optimal bids

The model is a simple feedforward neural network with:
- Input: board state features (painted blocks, hidden blocks, round, house)
- Output: predicted optimal bid and expected actual value

## Dependencies

- **React 19** — UI framework
- **TensorFlow.js 4** — ML inference and training
- **Vite 8** — build tool and dev server
- **Oxlint** — linter (zero-config)
