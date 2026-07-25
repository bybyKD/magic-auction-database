import {
  TOTAL_SPAWN_BLOCKS,
  AVERAGE_VALUE_PER_BLOCK,
  GENERIC_COLOR_EVS,
} from './constants';

export function computeBoardStats(appraisals, clues) {
  let totalRevealedEV = 0;
  let paintedBlocksCount = 0;

  const paintedColorEVs = {};
  const paintedColorCounts = {};

  appraisals.forEach((a) => {
    totalRevealedEV += a.ev;
    paintedBlocksCount += a.group.length;

    const color = a.kb.color;
    if (color !== 'All') {
      paintedColorEVs[color] = (paintedColorEVs[color] || 0) + a.ev;
      paintedColorCounts[color] = (paintedColorCounts[color] || 0) + 1;
    }
  });

  let extraExactValue = 0;
  if (clues && clues.exactValues) {
    Object.keys(clues.exactValues).forEach((color) => {
      const exactTotal = clues.exactValues[color];
      const paintedSoFar = paintedColorEVs[color] || 0;
      if (exactTotal > paintedSoFar) {
        extraExactValue += exactTotal - paintedSoFar;
      }
    });
  }

  let extraQuantityValue = 0;
  let remainingQuantityBlocks = 0;

  if (clues && clues.colorQuantities) {
    Object.keys(clues.colorQuantities).forEach((color) => {
      const requiredQty = clues.colorQuantities[color];
      if (requiredQty > 0) {
        const paintedQty = paintedColorCounts[color] || 0;
        const remainingQty = Math.max(0, requiredQty - paintedQty);
        if (remainingQty > 0) {
          extraQuantityValue +=
            remainingQty * (GENERIC_COLOR_EVS[color] || 4000);
          remainingQuantityBlocks += remainingQty * 3;
        }
      }
    });
  }

  const remainingGenericHiddenBlocks = Math.max(
    0,
    TOTAL_SPAWN_BLOCKS - paintedBlocksCount - remainingQuantityBlocks
  );

  let hiddenBoardEV =
    remainingGenericHiddenBlocks * AVERAGE_VALUE_PER_BLOCK;
  hiddenBoardEV += extraExactValue + extraQuantityValue;

  let totalBoardEV = totalRevealedEV + hiddenBoardEV;

  if (clues && clues.minTotalValue && totalBoardEV < clues.minTotalValue) {
    totalBoardEV = clues.minTotalValue;
    hiddenBoardEV = totalBoardEV - totalRevealedEV;
  }

  return {
    totalRevealedEV,
    hiddenBoardEV,
    totalBoardEV,
    paintedBlocksCount,
    remainingGenericHiddenBlocks,
  };
}
