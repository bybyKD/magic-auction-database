import React, { useState, useRef } from 'react';
import './GridArea.css';

const GridArea = ({ grid, setGrid, onGridChange, brushMode, brushColor, selectedShape }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [dragEnd, setDragEnd] = useState(null);
  const currentGroupId = useRef(null);

  const ROWS = grid.length;
  const COLS = grid[0].length;

  const handleMouseDown = (r, c, e) => {
    // Right-click: delete block at this cell
    if (e.button === 2) {
      e.preventDefault();
      const cell = grid[r][c];
      if (cell) {
        const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })));
        const targetGroupId = cell.groupId;
        for (let rr = 0; rr < ROWS; rr++) {
          for (let cc = 0; cc < COLS; cc++) {
            if (newGrid[rr][cc] && newGrid[rr][cc].groupId === targetGroupId) {
              newGrid[rr][cc] = null;
            }
          }
        }
        onGridChange(newGrid);
      }
      return;
    }

    // Place mode: click to place a preset shape
    if (selectedShape && brushMode === 'Known') {
      e.preventDefault();
      const [w, h] = selectedShape.split('x').map(Number);
      const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })));
      const groupId = Date.now().toString();

      for (let dr = 0; dr < h; dr++) {
        for (let dc = 0; dc < w; dc++) {
          const rr = r + dr;
          const cc = c + dc;
          if (rr < ROWS && cc < COLS) {
            newGrid[rr][cc] = {
              kind: 'Known',
              color: brushColor,
              type: 'All',
              groupId,
              size: selectedShape,
              isOrigin: dr === 0 && dc === 0,
            };
          }
        }
      }
      onGridChange(newGrid);
      return;
    }

    // Normal drag mode
    setIsDragging(true);
    setDragStart({ r, c });
    setDragEnd({ r, c });
    currentGroupId.current = Date.now().toString();

    if (brushMode === 'Empty' || brushMode === 'Erase') {
      applyCell(r, c, brushMode);
    }
  };

  const handleMouseEnter = (r, c) => {
    if (isDragging) {
      setDragEnd({ r, c });
      if (brushMode === 'Empty' || brushMode === 'Erase') {
        applyCell(r, c, brushMode);
      }
    }
  };

  const applyCell = (r, c, mode) => {
    const newGrid = grid.map((row) => row.map((cell) => (cell ? { ...cell } : null)));

    if (mode === 'Empty') {
      newGrid[r][c] = { kind: 'Empty' };
    } else if (mode === 'Erase') {
      newGrid[r][c] = null;
    }
    setGrid(newGrid);
  };

  const handleMouseUp = () => {
    if (isDragging && brushMode === 'Known' && dragStart && dragEnd) {
      const minR = Math.min(dragStart.r, dragEnd.r);
      const maxR = Math.max(dragStart.r, dragEnd.r);
      const minC = Math.min(dragStart.c, dragEnd.c);
      const maxC = Math.max(dragStart.c, dragEnd.c);

      const w = maxC - minC + 1;
      const h = maxR - minR + 1;
      const shapeSize = `${w}x${h}`;

      const newGrid = grid.map((row) => row.map((cell) => (cell ? { ...cell } : null)));

      for (let r = minR; r <= maxR; r++) {
        for (let c = minC; c <= maxC; c++) {
          newGrid[r][c] = {
            kind: 'Known',
            color: brushColor,
            type: 'All',
            groupId: currentGroupId.current,
            size: shapeSize,
            isOrigin: r === minR && c === minC,
          };
        }
      }
      onGridChange(newGrid);
    }

    setIsDragging(false);
    setDragStart(null);
    setDragEnd(null);
    currentGroupId.current = null;
  };

  // Extract distinct blocks for unified rendering
  const blocksMap = new Map();
  grid.forEach((row, r) => {
    row.forEach((cell, c) => {
      if (cell && cell.kind === 'Known') {
        if (!blocksMap.has(cell.groupId)) {
          blocksMap.set(cell.groupId, { cells: [], color: cell.color, size: cell.size });
        }
        blocksMap.get(cell.groupId).cells.push({ r, c });
      }
    });
  });

  const renderUnifiedBlocks = () => {
    const blockElements = [];

    blocksMap.forEach((block, groupId) => {
      let minR = ROWS, minC = COLS, maxR = -1, maxC = -1;
      block.cells.forEach((cell) => {
        if (cell.r < minR) minR = cell.r;
        if (cell.r > maxR) maxR = cell.r;
        if (cell.c < minC) minC = cell.c;
        if (cell.c > maxC) maxC = cell.c;
      });

      const colorClass = block.color === 'All' ? 'color-all' : `color-${block.color.toLowerCase()}`;

      blockElements.push(
        <div
          key={groupId}
          className={`unified-block ${colorClass}`}
          style={{
            gridRowStart: minR + 1,
            gridRowEnd: maxR + 2,
            gridColumnStart: minC + 1,
            gridColumnEnd: maxC + 2,
          }}
        >
          <span className="unified-size-label">{block.size}</span>
        </div>
      );
    });

    return blockElements;
  };

  const renderCurrentDragBox = () => {
    if (!isDragging || brushMode !== 'Known' || !dragStart || !dragEnd) return null;

    const minR = Math.min(dragStart.r, dragEnd.r);
    const maxR = Math.max(dragStart.r, dragEnd.r);
    const minC = Math.min(dragStart.c, dragEnd.c);
    const maxC = Math.max(dragStart.c, dragEnd.c);

    const w = maxC - minC + 1;
    const h = maxR - minR + 1;
    const colorClass = brushColor === 'All' ? 'color-all' : `color-${brushColor.toLowerCase()}`;

    return (
      <div
        className={`unified-block drag-preview ${colorClass}`}
        style={{
          gridRowStart: minR + 1,
          gridRowEnd: maxR + 2,
          gridColumnStart: minC + 1,
          gridColumnEnd: maxC + 2,
          opacity: 0.7,
          borderStyle: 'dashed',
        }}
      >
        <span className="unified-size-label">{w}x{h}</span>
      </div>
    );
  };

  return (
    <div
      className="grid-container"
      onMouseLeave={handleMouseUp}
      onMouseUp={handleMouseUp}
      onContextMenu={(e) => e.preventDefault()}
    >
      {grid.map((row, rIndex) =>
        row.map((cell, cIndex) => {
          let emptyClass = '';
          let icon = '';

          if (cell && cell.kind === 'Empty') {
            emptyClass = 'cell-empty';
            icon = '✕';
          }

          return (
            <div
              key={`base-${rIndex}-${cIndex}`}
              className={`grid-cell ${emptyClass} ${selectedShape ? 'place-mode-cell' : ''}`}
              style={{
                gridRowStart: rIndex + 1,
                gridColumnStart: cIndex + 1,
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                handleMouseDown(rIndex, cIndex, e);
              }}
              onMouseEnter={(e) => {
                e.preventDefault();
                handleMouseEnter(rIndex, cIndex);
              }}
            >
              {icon}
            </div>
          );
        })
      )}

      {renderUnifiedBlocks()}
      {renderCurrentDragBox()}
    </div>
  );
};

export default GridArea;
