import { useMemo, useEffect } from 'react';
import { computeBoardStats } from '../logic/boardStats';
import { getCommanderInfo } from '../logic/commanderInfo';
import { HOUSES, normalizeMoney } from '../ml/DatasetManager';
import { auctionBrain } from '../ml/AuctionBrain';

export function useBoardStats(
  appraisals,
  clues,
  currentRound,
  selectedHouse,
  selectedCommander,
  onBoardStatsChange
) {
  const commanderInfo = useMemo(
    () => getCommanderInfo(selectedCommander, currentRound),
    [selectedCommander, currentRound]
  );

  const stats = useMemo(
    () => computeBoardStats(appraisals, clues, commanderInfo.infoScore),
    [appraisals, clues, commanderInfo.infoScore]
  );

  const fullStats = useMemo(() => {
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
        hiddenEVNorm,
        commanderInfo.infoScore
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

    return {
      ...stats,
      aiPredictedBid,
      aiPredictedActualValue,
      aiConfidence,
      commanderInfo,
    };
  }, [stats, selectedHouse, currentRound, commanderInfo]);

  useEffect(() => {
    if (onBoardStatsChange) {
      onBoardStatsChange(fullStats);
    }
  }, [fullStats, onBoardStatsChange]);

  return fullStats;
}
