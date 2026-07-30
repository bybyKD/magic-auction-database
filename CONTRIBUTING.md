# Contributing to Magic Auction Database

Thank you for your interest in contributing! This document covers the workflow for bug reports, feature requests, code changes, and data contributions.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Style](#code-style)
- [Data Contributions](#data-contributions)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

This project is governed by the [Contributor Covenant](CODE_OF_CONDUCT.md). By participating, you agree to uphold its terms.

## Getting Started

```bash
git clone https://github.com/bybyKD/magic-chess-gogo-auction.git
cd magic-chess-gogo-auction/auction_predictor
npm install
npm run dev
```

## Development Workflow

1. **Find or create an issue** — check the [Issues](https://github.com/bybyKD/magic-chess-gogo-auction/issues) tab first
2. **Fork the repository** and create a branch from `main`
3. **Make your changes**, keeping them focused and atomic
4. **Run the linter** before committing: `npm run lint`
5. **Verify the build**: `npm run build`
6. **Open a pull request** against `main`

## Code Style

- Follow the existing conventions in the file you're editing (same naming, same patterns)
- Do **not** add comments unless the code is non-obvious
- Use existing imports and utilities rather than introducing new dependencies
- Component props: destructure in the function signature
- Hooks: prefix with `use`

## Data Contributions

The item database (`data/treasure_database.json`) is sourced from the actual game. Data PRs will only be accepted if:

- A new item has been added to the game
- A price has changed in a patch
- You can cite the in-game source as evidence

## Pull Request Process

1. Ensure your PR description clearly describes the change and links to any related issue
2. The PR template must be filled out completely
3. A maintainer will review your PR within a reasonable timeframe
4. Once approved, your PR will be squash-merged into `main`

---

*Questions? Open a [Discussion](https://github.com/bybyKD/magic-chess-gogo-auction/discussions).*
