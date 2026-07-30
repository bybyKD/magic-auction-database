# FAQ

## General

### What is Magic Auction?
Magic Auction is a mini-game in Mobile Legends: Go Go where players bid on treasure items hidden on an 8×8 board. By painting discovered shapes and tracking clues, players can estimate the board's total value and place optimal bids.

### Is this an official ML: Go Go tool?
No. This is a community-built fan project. It is not affiliated with or endorsed by Moonton or any Mobile Legends publisher.

### Is my data sent anywhere?
No. Everything runs in your browser. No data is sent to any server.

## Usage

### How do I use the grid?
Select a brush color and click/drag on the grid to paint blocks. Each color represents a rarity tier matching the game's color-coded items.

### What do the suggestions mean?
The suggestion engine analyzes your current board state and recommends the most valuable next move: a specific item to search for, a color to target, or a random guess.

### How does the AI prediction work?
The TensorFlow.js model is trained on simulated games. It predicts the optimal bid amount and expected actual value based on the board state, round number, and selected house.

### How do I train the AI?
Open the AI Dashboard and click "Run Simulation" to generate training data, then "Train Model" to train on that data.

## Technical

### What browsers are supported?
Any modern browser (Chrome, Firefox, Safari, Edge) that supports ES modules and WebGL (for TensorFlow.js).

### Does it work offline?
After the initial load, most features work offline (the app is a single-page static site). The AI model can be trained and used offline once loaded.

### Can I contribute?
Yes. See [CONTRIBUTING.md](../CONTRIBUTING.md).

## Troubleshooting

### The grid doesn't paint
Make sure you're in "Known" mode (not Erase or Empty mode). Select a color from the color buttons.

### The AI shows NaN values
The model may not be trained yet. Open the AI Dashboard and run a simulation + training cycle.
