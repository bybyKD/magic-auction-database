import { ROWS, COLS } from './constants';

export function computeAppraisals(grid, db, clues, selectedHouse) {
  const knownBlocks = [];
  const emptyBlocks = [];

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = grid[r][c];
      if (!cell) continue;
      if (cell.kind === 'Known') knownBlocks.push({ r, c, ...cell });
      if (cell.kind === 'Empty') emptyBlocks.push({ r, c });
    }
  }

  if (knownBlocks.length === 0) return [];

  const appraisals = [];

  const groupedBlocksMap = new Map();
  let fallbackIdCounter = 0;

  knownBlocks.forEach((kb) => {
    const gId = kb.groupId || `fallback-${fallbackIdCounter++}`;
    if (!groupedBlocksMap.has(gId)) {
      groupedBlocksMap.set(gId, []);
    }
    groupedBlocksMap.get(gId).push(kb);
  });

  const groupedBlocks = Array.from(groupedBlocksMap.values());

  groupedBlocks.forEach((group) => {
    const possibleItemsMap = new Map();
    let totalPlacements = 0;
    let heroPlaces = 0;
    let maxHeroValue = 0;

    const displayBlock = group[0];
    const targetSize = displayBlock.size;

    const houseRules = db._houseRules || {};
    const activeHouseRules = houseRules[selectedHouse] || {};
    const minVal = activeHouseRules.minItemValue || 0;
    const maxVal = activeHouseRules.maxItemValue || Infinity;

    const items = db._items || db;

    items.forEach((item) => {
      if (!item.shape) return;
      if (item.price < minVal || item.price > maxVal) return;

      if (item.name_color && clues.colorQuantities) {
        const capitalizedColor =
          item.name_color.charAt(0).toUpperCase() +
          item.name_color.slice(1).toLowerCase();
        if (clues.colorQuantities[capitalizedColor] === 0) return;
      }

      const parts = item.shape.split('x');
      if (parts.length !== 2) return;

      const w = parseInt(parts[0], 10);
      const h = parseInt(parts[1], 10);

      if (targetSize !== 'All') {
        const targetParts = targetSize.split('x');
        const tw = parseInt(targetParts[0], 10);
        const th = parseInt(targetParts[1], 10);
        if (w !== tw || h !== th) return;
      }

      let validPlacements = 0;

      for (let r = 0; r <= ROWS - h; r++) {
        for (let c = 0; c <= COLS - w; c++) {
          let coversAllGroupBlocks = true;
          for (const gb of group) {
            if (gb.r < r || gb.r >= r + h || gb.c < c || gb.c >= c + w) {
              coversAllGroupBlocks = false;
              break;
            }
          }
          if (!coversAllGroupBlocks) continue;

          let hitsEmpty = false;
          for (const eb of emptyBlocks) {
            if (eb.r >= r && eb.r < r + h && eb.c >= c && eb.c < c + w) {
              hitsEmpty = true;
              break;
            }
          }
          if (hitsEmpty) continue;

          let itemSatisfiesAllCoveredBlocks = true;
          for (const kb of knownBlocks) {
            if (kb.r >= r && kb.r < r + h && kb.c >= c && kb.c < c + w) {
              if (kb.color !== 'All') {
                if (
                  !item.name_color ||
                  item.name_color.toLowerCase() !== kb.color.toLowerCase()
                ) {
                  itemSatisfiesAllCoveredBlocks = false;
                  break;
                }
              }
              if (kb.type !== 'All') {
                if (
                  !item.type ||
                  item.type.toLowerCase() !== kb.type.toLowerCase()
                ) {
                  itemSatisfiesAllCoveredBlocks = false;
                  break;
                }
              }
              if (kb.size !== 'All' && kb !== displayBlock) {
                const kbParts = kb.size.split('x');
                const kw = parseInt(kbParts[0], 10);
                const kh = parseInt(kbParts[1], 10);
                if (w !== kw || h !== kh) {
                  itemSatisfiesAllCoveredBlocks = false;
                  break;
                }
              }
            }
          }

          if (!itemSatisfiesAllCoveredBlocks) continue;
          validPlacements++;
        }
      }

      if (validPlacements > 0) {
        possibleItemsMap.set(item, validPlacements);
        totalPlacements += validPlacements;
      }
    });

    if (totalPlacements > 0) {
      const possibleItemsArray = [];
      const expandedPriceList = [];

      possibleItemsMap.forEach((placements, item) => {
        const isHero =
          item.type &&
          (item.type.toLowerCase().includes('hero') ||
            item.type.toLowerCase().includes('figure') ||
            item.type.toLowerCase().includes('figurine'));
        if (isHero) {
          heroPlaces += placements;
          if ((item.price || 0) > maxHeroValue) {
            maxHeroValue = item.price;
          }
        }

        for (let i = 0; i < placements; i++) {
          expandedPriceList.push(item.price || 0);
        }

        possibleItemsArray.push({ ...item, validPlacements: placements });
      });

      expandedPriceList.sort((a, b) => a - b);
      const mid = Math.floor(expandedPriceList.length / 2);
      const medianEV =
        expandedPriceList.length % 2 !== 0
          ? expandedPriceList[mid]
          : Math.floor(
              (expandedPriceList[mid - 1] + expandedPriceList[mid]) / 2
            );

      possibleItemsArray.sort((a, b) => (b.price || 0) - (a.price || 0));

      const numItems = possibleItemsArray.length;
      const confidence =
        numItems === 1
          ? 100
          : Math.max(1, Math.round(100 - Math.log10(numItems) * 35));

      appraisals.push({
        group,
        kb: displayBlock,
        ev: medianEV,
        safeBid: Math.floor(medianEV * 0.7),
        heroSnipe: maxHeroValue,
        heroProb: (heroPlaces / totalPlacements) * 100,
        totalPlacements,
        possibleItems: possibleItemsArray,
        confidence,
      });
    } else {
      appraisals.push({
        group,
        kb: displayBlock,
        ev: 0,
        safeBid: 0,
        heroSnipe: 0,
        heroProb: 0,
        totalPlacements: 0,
        possibleItems: [],
        confidence: 0,
      });
    }
  });

  return appraisals;
}
