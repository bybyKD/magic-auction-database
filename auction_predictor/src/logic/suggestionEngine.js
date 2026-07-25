import { ALL_COLORS } from './constants';

/**
 * Suggest likely block placements and highlight appraisal group confidence.
 *
 * @param {Array} appraisals - Current appraisal groups
 * @param {Object} clues - Current clues (colorQuantities, exactValues, minTotalValue)
 * @param {Array} grid - Current grid state
 * @returns {{ suggestions: Array, groupConfidence: Map }}
 */
export function computeSuggestions(appraisals, clues, _grid) {
  const suggestions = [];
  const groupConfidence = new Map();

  // Compute painted block counts per color
  const paintedColorCounts = {};
  appraisals.forEach((a) => {
    const color = a.kb.color;
    if (color !== 'All') {
      paintedColorCounts[color] = (paintedColorCounts[color] || 0) + 1;
    }
  });

  // Suggest based on quantity clues
  if (clues && clues.colorQuantities) {
    ALL_COLORS.forEach((color) => {
      const required = clues.colorQuantities[color];
      if (required !== undefined && required > 0) {
        const painted = paintedColorCounts[color] || 0;
        const remaining = required - painted;
        if (remaining > 0) {
          suggestions.push({
            type: 'quantity',
            color,
            remaining,
            message: `${remaining} more ${color} block${remaining > 1 ? 's' : ''} needed`,
            priority: remaining > 2 ? 'high' : 'medium',
          });
        } else if (remaining === 0) {
          suggestions.push({
            type: 'quantity_complete',
            color,
            remaining: 0,
            message: `All ${color} blocks found`,
            priority: 'low',
          });
        }
      }
    });
  }

  // Suggest based on banned colors (quantity = 0)
  if (clues && clues.colorQuantities) {
    ALL_COLORS.forEach((color) => {
      if (clues.colorQuantities[color] === 0) {
        const hasWrongBlocks = appraisals.some(
          (a) => a.kb.color === color
        );
        if (hasWrongBlocks) {
          suggestions.push({
            type: 'ban_warning',
            color,
            message: `Warning: ${color} is banned but painted blocks exist`,
            priority: 'high',
          });
        }
      }
    });
  }

  // Rate appraisal group confidence
  appraisals.forEach((a, index) => {
    let level;
    if (a.confidence >= 80) level = 'high';
    else if (a.confidence >= 50) level = 'medium';
    else if (a.confidence >= 20) level = 'low';
    else level = 'very_low';

    groupConfidence.set(index, {
      level,
      confidence: a.confidence,
      possibleCount: a.possibleItems?.length || 0,
    });
  });

  // Sort suggestions: high priority first
  suggestions.sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return (order[a.priority] || 2) - (order[b.priority] || 2);
  });

  return { suggestions, groupConfidence };
}
