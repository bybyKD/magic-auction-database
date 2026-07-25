import React, { useState, useCallback } from 'react';
import './App.css';
import GridArea from './components/GridArea';
import Controls from './components/Controls';
import CluesPanel from './components/CluesPanel';
import ResultsPanel from './components/ResultsPanel';
import StrategyGuide from './components/StrategyGuide';
import CommanderAssistant from './components/CommanderAssistant';
import MLDashboard from './components/MLDashboard';
import MatchLogger from './components/MatchLogger';
import gameRules from './data/game_rules.json';
import { useAppraisals } from './hooks/useAppraisals';
import { useBoardStats } from './hooks/useBoardStats';
import { ROWS, COLS } from './logic/constants';

function App() {
  const [grid, setGrid] = useState(
    Array(ROWS).fill().map(() => Array(COLS).fill(null))
  );
  const [brushMode, setBrushMode] = useState('Known');
  const [brushColor, setBrushColor] = useState('Gold');
  const [currentRound, setCurrentRound] = useState(1);
  const [selectedCommander, setSelectedCommander] = useState('None');
  const [selectedHouse, setSelectedHouse] = useState('Eruditio');
  const [showGuide, setShowGuide] = useState(false);
  const [showML, setShowML] = useState(false);
  const [showLogger, setShowLogger] = useState(false);

  const [clues, setClues] = useState({
    colorQuantities: {},
    exactValues: {},
    minTotalValue: null,
  });

  const [boardStats, setBoardStats] = useState({
    paintedBlocksCount: 0,
    totalRevealedEV: 0,
    hiddenBoardEV: 0,
    totalBoardEV: 0,
    remainingGenericHiddenBlocks: 0,
    aiPredictedBid: null,
    aiPredictedActualValue: null,
    aiConfidence: null,
  });

  const squareAppraisals = useAppraisals(grid, clues, selectedHouse);
  const stats = useBoardStats(
    squareAppraisals,
    clues,
    currentRound,
    selectedHouse,
    selectedCommander,
    setBoardStats
  );

  const roundRule = gameRules.rounds[currentRound];
  const instantWinMultiplier = roundRule ? roundRule.instantWinMultiplier : 1.0;
  const baselineOpponentBid = stats.totalBoardEV * 0.75;
  const instantWinBid = Math.floor(baselineOpponentBid * instantWinMultiplier);

  const handleClear = useCallback(() => {
    setGrid(Array(ROWS).fill().map(() => Array(COLS).fill(null)));
  }, []);

  return (
    <div className="app-container">
      {showGuide && <StrategyGuide onClose={() => setShowGuide(false)} />}
      {showML && <MLDashboard onClose={() => setShowML(false)} />}
      {showLogger && (
        <MatchLogger
          onClose={() => setShowLogger(false)}
          currentRound={currentRound}
          selectedHouse={selectedHouse}
          boardStats={boardStats}
        />
      )}
      <div className="glass-panel main-panel">
        <div className="header-section">
          <h1 className="title">Magic Auction Predictor</h1>
          <p className="description">
            Match the in-game clues to find the perfect bid.
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className="guide-btn color-btn"
              onClick={() => setShowGuide(true)}
            >
              Strategy Guide
            </button>
            <button
              className="guide-btn"
              style={{ background: '#7a28cb' }}
              onClick={() => setShowML(true)}
            >
              AI Dashboard
            </button>
            <button
              className="guide-btn"
              style={{ background: '#28a745' }}
              onClick={() => setShowLogger(true)}
            >
              Log Match
            </button>
          </div>
        </div>

        <div className="layout-columns">
          <div className="left-column">
            <Controls
              brushMode={brushMode}
              setBrushMode={setBrushMode}
              brushColor={brushColor}
              setBrushColor={setBrushColor}
              currentRound={currentRound}
              setCurrentRound={setCurrentRound}
              selectedCommander={selectedCommander}
              setSelectedCommander={setSelectedCommander}
              selectedHouse={selectedHouse}
              setSelectedHouse={setSelectedHouse}
            />
            <CommanderAssistant
              selectedCommander={selectedCommander}
              currentRound={currentRound}
            />
          </div>

          <div className="center-column">
            <div className="grid-section">
              <div
                className="grid-header"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <h2 className="subtitle">{selectedHouse} Board</h2>
                <div
                  className="house-stats"
                  style={{
                    display: 'flex',
                    gap: '20px',
                    fontSize: '0.9rem',
                    color: '#aaa',
                    marginTop: '5px',
                  }}
                >
                  <span>
                    <strong>Value:</strong>{' '}
                    {gameRules.houses[selectedHouse].treasureValue}
                  </span>
                  <span>
                    <strong>Entry Cost:</strong>{' '}
                    {new Intl.NumberFormat('en-US').format(
                      gameRules.houses[selectedHouse].entryCost
                    )}
                  </span>
                  <span>
                    <strong>Required:</strong>{' '}
                    {new Intl.NumberFormat('en-US').format(
                      gameRules.houses[selectedHouse].requiredCoins
                    )}
                  </span>
                </div>
              </div>
              <GridArea
                grid={grid}
                setGrid={setGrid}
                brushMode={brushMode}
                brushColor={brushColor}
              />
              <button className="clear-btn" onClick={handleClear}>
                Clear Board
              </button>
            </div>

            <div className="results-section">
              <h2 className="subtitle">Board Appraisals</h2>
              <ResultsPanel
                appraisals={squareAppraisals}
                hasKnownBlocks={grid.some((row) =>
                  row.some((cell) => cell && cell.kind === 'Known')
                )}
                currentRound={currentRound}
                selectedHouse={selectedHouse}
                totalRevealedEV={stats.totalRevealedEV}
                hiddenBoardEV={stats.hiddenBoardEV}
                totalBoardEV={stats.totalBoardEV}
                paintedBlocksCount={stats.paintedBlocksCount}
                remainingGenericHiddenBlocks={stats.remainingGenericHiddenBlocks}
                instantWinMultiplier={instantWinMultiplier}
                instantWinBid={instantWinBid}
                aiPredictedBid={stats.aiPredictedBid}
                aiConfidence={stats.aiConfidence}
              />
            </div>
          </div>

          <div className="right-column">
            <CluesPanel clues={clues} setClues={setClues} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
