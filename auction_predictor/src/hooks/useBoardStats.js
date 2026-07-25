import { useMemo, useEffect } from 'react';
import { computeBoardStats } from '../logic/boardStats';
import { HOUSES, normalizeMoney } from '../ml/DatasetManager';
import { auctionBrain } from '../ml/AuctionBrain';

export function useBoardStats(
  appraisals,
  clues,
  currentRound,
  selectedHouse,
  onBoardStatsChange
) {
  const stats = useMemo(
    () => computeBoardStats(appraisals, clues),
    [appraisals, clues]
  );

  let aiPredictedBid = null;
  let aiPredictedActualValue = null;
  let aiConfidence = null;

  if (auctionBrain.isTrained) {
    const houseNorm = HOUSES[selectedHouse] || 0.5;
    const revealedEVNorm = normalizeMoney(stats.totalRevealedEV);
    const hiddenEVNorm = normalizeMoney(stats.hiddenBoardEV);
    const paintedBlocksNorm = stats.paintedBlocksCount / 48.0;

    const predictions = auctionBrain.predict(
      currentRound,
      houseNorm,
      paintedBlocksNorm,
      revealedEVNorm,
      hiddenEVNorm
    );
    aiPredictedBid = predictions.predictedBid;
    aiPredictedActualValue = predictions.predictedActualValue;

    if (stats.totalBoardEV > 0) {
      const errorMargin =
        Math.abs(aiPredictedActualValue - stats.totalBoardEV) /
        stats.totalBoardEV;
      aiConfidence = Math.max(1, Math.floor(100 - errorMargin * 100));
    } else {
      aiConfidence = 0;
    }
  }

  const fullStats = {
    ...stats,
    aiPredictedBid,
    aiPredictedActualValue,
    aiConfidence,
  };

  useEffect(() => {
    if (onBoardStatsChange) {
      onBoardStatsChange(fullStats);
    }
  });

  return fullStats;
}
