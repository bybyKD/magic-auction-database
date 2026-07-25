import {
  TOTAL_SPAWN_BLOCKS,
  AVERAGE_VALUE_PER_BLOCK,
  GENERIC_COLOR_EVS,
} from './constants';

export function computeBoardStats(appraisals, clues, commanderInfoScore = 0) {
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

  // Exact value clue adjustments
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

  // Quantity-based hidden value with conditional distributions
  let extraQuantityValue = 0;
  let remainingQuantityBlocks = 0;
  const colorQtyRemaining = {};

  if (clues && clues.colorQuantities) {
    Object.keys(clues.colorQuantities).forEach((color) => {
      const requiredQty = clues.colorQuantities[color];
      if (requiredQty > 0) {
        const paintedQty = paintedColorCounts[color] || 0;
        const remainingQty = Math.max(0, requiredQty - paintedQty);
        if (remainingQty > 0) {
          colorQtyRemaining[color] = remainingQty;
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

  // Commander info discount: high-info commanders reduce hidden EV uncertainty.
  // If the commander has revealed info about hidden blocks, those blocks are
  // partially or fully accounted for in the revealed + quantity deductions.
  // We apply a reduction to the generic hidden estimate based on info score.
  const commanderDiscount = 1.0 - (commanderInfoScore * 0.3);

  let hiddenBoardEV =
    remainingGenericHiddenBlocks * AVERAGE_VALUE_PER_BLOCK * commanderDiscount;
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
    commanderInfoScore,
  };
}
