import React from 'react';
import './Controls.css';

import commandersData from '../data/commanders.json';

const colors = [
  { name: 'Bronze', css: 'Bronze' },
  { name: 'Silver', css: 'White' }, // In previous CSS, silver was white
  { name: 'Gold', css: 'Gold' },
  { name: 'Red', css: 'Red' }
];

const Controls = ({ brushMode, setBrushMode, brushColor, setBrushColor, currentRound, setCurrentRound, selectedCommander, setSelectedCommander, selectedHouse, setSelectedHouse }) => {
  return (
    <div className="controls-container">
      
      <div className="game-state-container">
        <div className="state-row">
           <div className="state-select-group">
             <label className="control-title">Round</label>
             <select className="state-dropdown" value={currentRound} onChange={(e) => setCurrentRound(parseInt(e.target.value))}>
                <option value={1}>Round 1</option>
                <option value={2}>Round 2</option>
                <option value={3}>Round 3</option>
                <option value={4}>Round 4</option>
                <option value={5}>Round 5</option>
             </select>
           </div>
           <div className="state-select-group">
             <label className="control-title">House</label>
             <select className="state-dropdown" value={selectedHouse} onChange={(e) => setSelectedHouse(e.target.value)}>
                <option value="Eruditio">Eruditio</option>
                <option value="Dawnlight">Dawnlight</option>
                <option value="World">World</option>
                <option value="Cosmic">Cosmic</option>
             </select>
           </div>
           <div className="state-select-group">
             <label className="control-title">Commander</label>
             <select className="state-dropdown" value={selectedCommander} onChange={(e) => setSelectedCommander(e.target.value)}>
                <option value="None">None</option>
                {commandersData.map(cmd => (
                  <option key={cmd.name} value={cmd.name}>{cmd.name}</option>
                ))}
             </select>
           </div>
        </div>
      </div>
      
      <div className="divider"></div>

      <div className="brush-section">
        <h3 className="control-title">🎨 Quick Paint Palette</h3>
        <p style={{ fontSize: '0.8rem', color: '#aaa', marginBottom: '10px' }}>
          Select a color, then <strong>click and drag</strong> on the grid to draw the shape you see in-game!
        </p>
        
        <div className="color-buttons" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {colors.map(color => (
            <button
              key={color.name}
              className={`color-btn ${color.css.toLowerCase()} ${brushColor === color.css && brushMode === 'Known' ? 'selected' : ''}`}
              onClick={() => { setBrushColor(color.css); setBrushMode('Known'); }}
              style={{ width: '100%', minHeight: '50px', fontWeight: 'bold' }}
            >
              {color.name}
            </button>
          ))}
        </div>
      </div>
      
      <div className="divider"></div>
      
      <div className="brush-section">
        <h3 className="control-title">🛠️ Tools</h3>
        <div className="color-buttons tools-column">
          <button
            className={`color-btn tool-btn ${brushMode === 'Empty' ? 'selected' : ''}`}
            onClick={() => setBrushMode('Empty')}
            title="Mark a cell as definitely empty (missed bid)"
          >
            ❌ Mark Empty
          </button>
          <button
            className={`color-btn tool-btn ${brushMode === 'Erase' ? 'selected' : ''}`}
            onClick={() => setBrushMode('Erase')}
          >
            🧹 Eraser
          </button>
        </div>
      </div>
    </div>
  );
};

export default Controls;
