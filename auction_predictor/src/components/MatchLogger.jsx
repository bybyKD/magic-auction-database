import React, { useState } from 'react';
import { datasetManager } from '../ml/DatasetManager';
import './ResultsPanel.css'; 

const MatchLogger = ({ onClose, currentRound, selectedHouse, boardStats }) => {
  const [winningBid, setWinningBid] = useState('');
  const [actualValue, setActualValue] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!winningBid || !actualValue) return;
    
    datasetManager.addMatch(
      parseInt(currentRound, 10), 
      selectedHouse, 
      boardStats?.paintedBlocksCount || 0,
      boardStats?.totalRevealedEV || 0,
      boardStats?.hiddenBoardEV || 0,
      parseFloat(winningBid),
      parseFloat(actualValue),
      boardStats?.commanderInfo?.infoScore || 0
    );
    
    setSaved(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="guide-modal-overlay">
      <div className="guide-modal" style={{ maxWidth: '400px' }}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2 className="modal-title">📝 Log Match Result</h2>
        
        {saved ? (
          <div style={{ textAlign: 'center', padding: '20px', color: '#00ff80' }}>
            <h3>✓ Saved to AI Dataset!</h3>
            <p>Your model is getting smarter.</p>
          </div>
        ) : (
          <div className="guide-section">
            <p style={{ marginBottom: '15px' }}>
              Log what just happened in your game to teach the AI how people bid.
            </p>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>What was the final winning bid?</label>
              <input 
                type="number" 
                value={winningBid} 
                onChange={e => setWinningBid(e.target.value)}
                style={{ width: '100%', padding: '8px', background: '#333', color: 'white', border: '1px solid #555' }}
                placeholder="e.g. 420000"
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>What was the ACTUAL final board value?</label>
              <input 
                type="number" 
                value={actualValue} 
                onChange={e => setActualValue(e.target.value)}
                style={{ width: '100%', padding: '8px', background: '#333', color: 'white', border: '1px solid #555' }}
                placeholder="e.g. 500000"
              />
            </div>

            <button className="guide-btn color-btn" style={{ width: '100%' }} onClick={handleSave}>
              Save Match Data
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchLogger;
