import React, { useState, useRef } from 'react';
import { ROWS, COLS } from '../logic/constants';
import './QuickEntry.css';

const COL_LETTERS = 'ABCDEFGHIJKL';

const parseEntry = (input) => {
  const lines = input.trim().split('\n').filter(Boolean);
  const results = [];
  const errors = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Format: [col1][row1]-[col2][row2] [color]
    // e.g., "A1-B2 gold" or "D4-D4 red"
    const match = trimmed.match(
      /^([A-L])(\d{1,2})-([A-L])(\d{1,2})\s+(bronze|silver|white|gold|red)$/i
    );

    if (!match) {
      errors.push(`Invalid format: "${trimmed}" — use e.g. A1-B2 gold`);
      continue;
    }

    const [, c1, r1, c2, r2, colorRaw] = match;
    const col1 = COL_LETTERS.indexOf(c1.toUpperCase());
    const row1 = parseInt(r1, 10) - 1;
    const col2 = COL_LETTERS.indexOf(c2.toUpperCase());
    const row2 = parseInt(r2, 10) - 1;

    if (col1 < 0 || col1 >= COLS || col2 < 0 || col2 >= COLS) {
      errors.push(`Column out of range: ${c1} or ${c2} (use A-L)`);
      continue;
    }
    if (row1 < 0 || row1 >= ROWS || row2 < 0 || row2 >= ROWS) {
      errors.push(`Row out of range: ${r1} or ${r2} (use 1-${ROWS})`);
      continue;
    }

    const minR = Math.min(row1, row2);
    const maxR = Math.max(row1, row2);
    const minC = Math.min(col1, col2);
    const maxC = Math.max(col1, col2);
    const w = maxC - minC + 1;
    const h = maxR - minR + 1;
    const size = `${w}x${h}`;

    const colorMap = {
      bronze: 'Bronze',
      silver: 'White',
      white: 'White',
      gold: 'Gold',
      red: 'Red',
    };
    const color = colorMap[colorRaw.toLowerCase()];

    results.push({ minR, maxR, minC, maxC, color, size });
  }

  return { results, errors };
};

const QuickEntry = ({ onPlaceBlocks, onClose }) => {
  const [input, setInput] = useState('');
  const [errors, setErrors] = useState([]);
  const [placedCount, setPlacedCount] = useState(0);
  const textareaRef = useRef(null);

  const handlePlace = () => {
    const { results, errors: parseErrors } = parseEntry(input);

    if (parseErrors.length > 0) {
      setErrors(parseErrors);
      return;
    }

    if (results.length === 0) {
      setErrors(['No valid blocks to place']);
      return;
    }

    onPlaceBlocks(results);
    setPlacedCount((prev) => prev + results.length);
    setErrors([]);
    setInput('');
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handlePlace();
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="quick-entry-bar">
      <div className="quick-entry-header">
        <span className="quick-entry-title">Quick Entry</span>
        {placedCount > 0 && (
          <span className="placed-count">{placedCount} placed</span>
        )}
        <button className="quick-entry-close" onClick={onClose} title="Close (Esc)">
          ×
        </button>
      </div>
      <textarea
        ref={textareaRef}
        className="quick-entry-input"
        value={input}
        onChange={(e) => { setInput(e.target.value); setErrors([]); }}
        onKeyDown={handleKeyDown}
        placeholder="A1-B2 gold&#10;D4-F6 red&#10;Ctrl+Enter to place"
        rows={3}
        autoFocus
      />
      {errors.length > 0 && (
        <div className="quick-entry-errors">
          {errors.map((err, i) => (
            <div key={i} className="quick-entry-error">{err}</div>
          ))}
        </div>
      )}
      <div className="quick-entry-footer">
        <span className="quick-entry-hint">
          Format: <code>A1-B2 gold</code> — Columns A-L, Rows 1-{ROWS}
        </span>
        <button className="quick-entry-place-btn" onClick={handlePlace}>
          Place (Ctrl+Enter)
        </button>
      </div>
    </div>
  );
};

export default QuickEntry;
