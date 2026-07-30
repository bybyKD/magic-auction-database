# Data Directory

This directory contains the canonical treasure database and related data files.

## Files

| File | Description |
|------|-------------|
| `treasure_database.json` | **Canonical database** — 306 treasures with `name`, `price`, `type`, `shape`, `description`, `name_color` |
| `extract.py` | Source-of-truth generator; defines all items as tuples and writes `treasure_database.json` |

## Directories

| Directory | Contents |
|-----------|----------|
| `raw/` | Raw export scripts and recovered/scraped item data |
| `archive/` | Archived item discoveries (pre-merge candidates) |

## Data Pipeline

1. Items are defined in `extract.py` as Python tuples
2. Running `extract.py` regenerates `treasure_database.json`
3. The predictor app (`auction_predictor/`) maintains its own copy at `src/data/treasure_database.json`

## Archive Status

The files in `archive/` contain items that may overlap with the main database. They are kept for historical reference and deduplication purposes. If you discover new items, add them to `extract.py`, regenerate the JSON, and update the predictor copy.
