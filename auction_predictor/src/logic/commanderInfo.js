// Hard-coded information curves for each commander.
// infoScore (0-1): how much of the board's information this commander reveals
//   at each round. Based on: (revealedBlocks / TOTAL_SPAWN_BLOCKS) * revealDepth.
//   Full info (name, color, type, size) = depth 1.0
//   Partial info (size only, quality only) = depth 0.3
//   Location hints (general area) = depth 0.15
// revealedBlocks: estimated number of grid blocks with any info revealed
// revealDescription: human-readable summary of what's known at this round
const COMMANDER_CURVES = {
  None: {
    infoScore: [0, 0, 0, 0, 0],
    revealedBlocks: [0, 0, 0, 0, 0],
    descriptions: [
      'No commander selected',
      'No commander selected',
      'No commander selected',
      'No commander selected',
      'No commander selected',
    ],
  },

  // R1 start: full info of 3 treasures. Then +1/round (prioritizing unknown).
  // ~2.5 blocks per treasure average.
  Layla: {
    infoScore: [0.19, 0.25, 0.31, 0.38, 0.44],
    revealedBlocks: [8, 10, 13, 15, 18],
    descriptions: [
      'Full info of 3 treasures revealed',
      'Full info of 4 treasures (1 new)',
      'Full info of 5 treasures (1 new)',
      'Full info of 6 treasures (1 new)',
      'Full info of 7 treasures (1 new)',
    ],
  },

  // R1-3: reveals sizes of 3 large treasures (6+ tiles each).
  // R4-5: reveals quality of 2 large treasures.
  // Sizes are partial info (know dimensions but not identity).
  Minotaur: {
    infoScore: [0.10, 0.10, 0.10, 0.17, 0.17],
    revealedBlocks: [5, 5, 5, 8, 8],
    descriptions: [
      'Sizes of 3 large treasures (6+ tiles) revealed',
      'Sizes of 3 large treasures (no new info)',
      'Sizes of 3 large treasures (no new info)',
      'Quality of 2 large treasures revealed (cumulative)',
      'Quality of 2 large treasures (no new info)',
    ],
  },

  // Start: general locations of white/green/blue treasures (area hints).
  // R3: reveals sizes of ALL treasures (huge info jump).
  Johnson: {
    infoScore: [0.08, 0.08, 0.50, 0.50, 0.50],
    revealedBlocks: [4, 4, 48, 48, 48],
    descriptions: [
      'General locations of white/green/blue treasures',
      'General locations of white/green/blue (no new)',
      'ALL treasure sizes revealed',
      'All sizes known (no new info)',
      'All sizes known (no new info)',
    ],
  },

  // Start: reveals total quantity of purple/gold/red treasures.
  // Useful for deduction but doesn't identify individual treasures.
  Harley: {
    infoScore: [0.10, 0.10, 0.10, 0.10, 0.10],
    revealedBlocks: [0, 0, 0, 0, 0],
    descriptions: [
      'Quantities of purple/gold/red revealed',
      'Quantities known (no new info)',
      'Quantities known (no new info)',
      'Quantities known (no new info)',
      'Quantities known (no new info)',
    ],
  },

  // Start: quality of 4 random treasures.
  // R3 start: quality of the highest quality treasure.
  Alice: {
    infoScore: [0.13, 0.13, 0.17, 0.17, 0.17],
    revealedBlocks: [6, 6, 8, 8, 8],
    descriptions: [
      'Quality of 4 random treasures revealed',
      'Quality of 4 treasures (no new info)',
      'Quality of 4 treasures + highest quality treasure',
      'Same (no new info)',
      'Same (no new info)',
    ],
  },

  // R1-4: 0 info. R5 start: reveals quality of ALL treasures.
  Aurora: {
    infoScore: [0, 0, 0, 0, 0.70],
    revealedBlocks: [0, 0, 0, 0, 48],
    descriptions: [
      'No info yet (waiting for round 5)',
      'No info yet (waiting for round 5)',
      'No info yet (waiting for round 5)',
      'No info yet (waiting for round 5)',
      'ALL treasure qualities revealed',
    ],
  },

  // Start: sizes of 4 types of treasures. Then reveals type of these each round.
  // Sizes are partial, types narrow down candidates significantly.
  Angela: {
    infoScore: [0.10, 0.20, 0.30, 0.40, 0.50],
    revealedBlocks: [8, 16, 24, 32, 40],
    descriptions: [
      'Sizes of 4 treasure types revealed',
      'Types of 4 treasures revealed',
      'Types of 8 treasures revealed',
      'Types of 12 treasures revealed',
      'Types of 16 treasures revealed',
    ],
  },

  // R1-3: reveals Size, Quality, Type of 3 treasures (one detail per round).
  // If 2/3 known, reveals the 3rd.
  Wanwan: {
    infoScore: [0.05, 0.10, 0.19, 0.19, 0.19],
    revealedBlocks: [3, 6, 8, 8, 8],
    descriptions: [
      'Sizes of 3 treasures revealed',
      'Sizes + Qualities of 3 treasures',
      'Sizes + Qualities + Types of 3 treasures (full info)',
      'Same (no new info)',
      'Same (no new info)',
    ],
  },

  // Sequentially reveals quality+size of gray/green/blue/purple treasures.
  // R1: gray, R2: green, R3: blue, R4: purple.
  Vale: {
    infoScore: [0.10, 0.20, 0.30, 0.40, 0.40],
    revealedBlocks: [5, 10, 15, 20, 20],
    descriptions: [
      'Quality + size of gray treasures revealed',
      'Gray + green treasures quality+size known',
      'Gray + green + blue quality+size known',
      'Gray + green + blue + purple quality+size known',
      'Same (no new info)',
    ],
  },

  // R1-4: each round reveals Quality/Size/Type/All of 3 treasures.
  Chou: {
    infoScore: [0.05, 0.10, 0.15, 0.31, 0.31],
    revealedBlocks: [3, 6, 9, 15, 15],
    descriptions: [
      'Quality of 3 treasures revealed',
      'Quality + Size of 3 treasures',
      'Quality + Size + Type of 3 treasures',
      'Full info of 3 + partial of 6 more treasures',
      'Same (no new info)',
    ],
  },

  // Start: quality of 5 treasures. Then +2/round (quality only).
  Lunox: {
    infoScore: [0.21, 0.29, 0.38, 0.46, 0.54],
    revealedBlocks: [10, 14, 18, 22, 26],
    descriptions: [
      'Quality of 5 treasures revealed',
      'Quality of 7 treasures (2 new)',
      'Quality of 9 treasures (2 new)',
      'Quality of 11 treasures (2 new)',
      'Quality of 13 treasures (2 new)',
    ],
  },

  // R1: sizes of last row. R2: quality of last row.
  // R3: sizes of 2 random columns. R4-5: type of those columns.
  Lancelot: {
    infoScore: [0.06, 0.12, 0.25, 0.38, 0.42],
    revealedBlocks: [3, 6, 12, 20, 22],
    descriptions: [
      'Sizes of treasures in last row',
      'Sizes + quality of last row treasures',
      'Last row + sizes of 2 random columns',
      'Last row + columns: sizes + types known',
      'Last row + columns: full info (sizes + types)',
    ],
  },
};

/**
 * Get commander information score for a given round.
 * @param {string} commanderName - Name of the selected commander
 * @param {number} currentRound - Current auction round (1-5)
 * @returns {{ infoScore: number, revealedBlocks: number, revealDescription: string }}
 */
export function getCommanderInfo(commanderName, currentRound) {
  const roundIdx = Math.max(0, Math.min(4, currentRound - 1));
  const curve = COMMANDER_CURVES[commanderName] || COMMANDER_CURVES.None;

  return {
    infoScore: curve.infoScore[roundIdx],
    revealedBlocks: curve.revealedBlocks[roundIdx],
    revealDescription: curve.descriptions[roundIdx],
  };
}

/**
 * Get the info level label for UI display.
 * @param {number} infoScore - 0 to 1
 * @returns {{ label: string, color: string }}
 */
export function getInfoLevel(infoScore) {
  if (infoScore >= 0.50) return { label: 'High', color: '#10b981' };
  if (infoScore >= 0.25) return { label: 'Medium', color: '#f59e0b' };
  if (infoScore > 0) return { label: 'Low', color: '#ef4444' };
  return { label: 'None', color: '#64748b' };
}

/**
 * Get all commander names with their info curves (for display/debugging).
 */
export function getAllCommanderInfo() {
  return Object.entries(COMMANDER_CURVES)
    .filter(([name]) => name !== 'None')
    .map(([name, curve]) => ({
      name,
      infoScore: curve.infoScore,
      revealedBlocks: curve.revealedBlocks,
    }));
}
