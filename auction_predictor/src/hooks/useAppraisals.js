import { useMemo } from 'react';
import { computeAppraisals } from '../logic/appraisal';
import db from '../data/treasure_database.json';
import gameRules from '../data/game_rules.json';

export function useAppraisals(grid, clues, selectedHouse) {
  const dbWithRules = useMemo(
    () => ({
      _items: db,
      _houseRules: gameRules.houses,
    }),
    []
  );

  return useMemo(
    () => computeAppraisals(grid, dbWithRules, clues, selectedHouse),
    [grid, clues, selectedHouse, dbWithRules]
  );
}
