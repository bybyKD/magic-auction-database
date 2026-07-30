# Treasure Database

## Location

The canonical database lives at `data/treasure_database.json`. A working copy is maintained at `auction_predictor/src/data/treasure_database.json` for the app's import.

## Schema

```typescript
interface TreasureItem {
  name: string;        // Display name (e.g. "Chaos Orb")
  price: number;       // Gold value (0–5,000,000)
  type: string;        // Category enum
  shape: string;       // Board footprint "WxH" (e.g. "2x2")
  description: string; // Flavor text (may be empty)
  name_color: string;  // Rarity tier enum
}
```

## Color Tiers

| Tier   | Price Range      | Rarity  |
|--------|------------------|---------|
| Red    | 100,000–5,000,000 | Legendary |
| Gold   | 45,000–100,000   | Epic     |
| Purple | 15,000–45,000    | Rare     |
| Blue   | 6,000–15,000     | Uncommon |
| Green  | 2,000–6,000      | Common   |
| Gray   | 100–2,000        | Trash    |

## Shape Notation

The `shape` field is formatted as `{rows}x{columns}`. For example:

- `"1x1"` — 1×1 single block
- `"2x1"` — 2 rows × 1 column (vertical 2-block)
- `"1x3"` — 1 row × 3 columns (horizontal 3-block)
- `"2x2"` — 2×2 square
- `"2x3"` — 2×3 rectangle
- `"3x1"` — 3×1 vertical column

## Item Types

- Accessory, Armor, Auction Item, Collection, Food, Gem, Material, Mineral, Potion, Weapon

## Item Count

306 items as of v0.1.0.

## Data Maintenance

To add or modify items:
1. Edit `data/extract.py`
2. Run `python data/extract.py` to regenerate `data/treasure_database.json`
3. Copy the new database to `auction_predictor/src/data/treasure_database.json`
