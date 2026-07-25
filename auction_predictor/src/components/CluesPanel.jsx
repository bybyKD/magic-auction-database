import React from 'react';
import './CluesPanel.css';

import { ALL_COLORS } from '../logic/constants';

const CluesPanel = ({ clues, setClues }) => {
  const handleQuantityChange = (color, value) => {
    const newQuants = { ...(clues.colorQuantities || {}) };
    const parsed = parseInt(value, 10);
    if (isNaN(parsed) || value === '') {
      delete newQuants[color];
    } else {
      newQuants[color] = parsed;
    }
    setClues({ ...clues, colorQuantities: newQuants });
  };

  const handleExactValueChange = (color, value) => {
    const newValues = { ...(clues.exactValues || {}) };
    const parsed = parseInt(value, 10);
    if (isNaN(parsed) || value === '') {
      delete newValues[color];
    } else {
      newValues[color] = parsed;
    }
    setClues({ ...clues, exactValues: newValues });
  };

  return (
    <div className="clues-panel">
      <h3 className="control-title">2. Board Clues & Constraints</h3>
      
      <div className="clue-section">
        <label className="clue-label">📦 Exact Color Quantities</label>
        <p className="clue-desc">If the game reveals "Quantity of Gold: 2", enter 2. (Enter 0 to ban a color).</p>
        <div className="exact-values-list">
          {ALL_COLORS.map(color => (
            <div key={`${color}-quant`} className="exact-value-row">
              <span className={`color-dot ${color.toLowerCase()}`}></span>
              <span className="color-name">{color} Qty:</span>
              <input 
                type="number" 
                min="0"
                placeholder="?" 
                value={(clues.colorQuantities && clues.colorQuantities[color] !== undefined) ? clues.colorQuantities[color] : ''}
                onChange={(e) => handleQuantityChange(color, e.target.value)}
                className="clue-input"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="clue-section">
        <label className="clue-label">💰 Exact Color Values</label>
        <p className="clue-desc">If the game reveals "Total value of Green Treasures: 3700", enter it here.</p>
        <div className="exact-values-list">
          {ALL_COLORS.map(color => (
            <div key={color} className="exact-value-row">
              <span className={`color-dot ${color.toLowerCase()}`}></span>
              <span className="color-name">{color} Value:</span>
              <input 
                type="number" 
                placeholder="e.g. 3700" 
                value={clues.exactValues[color] || ''}
                onChange={(e) => handleExactValueChange(color, e.target.value)}
                className="clue-input"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="clue-section">
        <label className="clue-label">📈 Minimum Total Value</label>
        <p className="clue-desc">Found at the bottom right of the game screen.</p>
        <div className="min-value-input">
          <span className="gold-icon">💰</span>
          <input 
            type="number" 
            placeholder="e.g. 16600" 
            value={clues.minTotalValue || ''}
            onChange={(e) => setClues({ ...clues, minTotalValue: parseInt(e.target.value, 10) || null })}
            className="clue-input large-input"
          />
        </div>
      </div>
    </div>
  );
};

export default CluesPanel;
