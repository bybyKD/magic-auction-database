import React, { useState, useRef } from 'react';
import './GridArea.css';

const GridArea = ({ grid, setGrid, brushMode, brushColor }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [dragEnd, setDragEnd] = useState(null);
  const currentGroupId = useRef(null);

  const ROWS = grid.length;
  const COLS = grid[0].length;

  const handleMouseDown = (r, c) => {
    setIsDragging(true);
    setDragStart({ r, c });
    setDragEnd({ r, c });
    currentGroupId.current = Date.now().toString();

    // If erasing or marking empty, we can just apply it immediately on drag
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
    const newGrid = [...grid];
    newGrid[r] = [...newGrid[r]];
    
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
      
      const newGrid = grid.map(row => [...row]);
      
      for (let r = minR; r <= maxR; r++) {
        for (let c = minC; c <= maxC; c++) {
          newGrid[r][c] = {
            kind: 'Known',
            color: brushColor,
            type: 'All',
            groupId: currentGroupId.current,
            size: shapeSize,
            isOrigin: (r === minR && c === minC)
          };
        }
      }
      setGrid(newGrid);
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
      // Find minR, minC, maxR, maxC for this block
      let minR = ROWS, minC = COLS, maxR = -1, maxC = -1;
      block.cells.forEach(cell => {
        if (cell.r < minR) minR = cell.r;
        if (cell.r > maxR) maxR = cell.r;
        if (cell.c < minC) minC = cell.c;
        if (cell.c > maxC) maxC = cell.c;
      });

      const _w = maxC - minC + 1;
      const _h = maxR - minR + 1;
      const colorClass = block.color === 'All' ? 'color-all' : `color-${block.color.toLowerCase()}`;
      
      blockElements.push(
        <div 
          key={groupId}
          className={`unified-block ${colorClass}`}
          style={{
            gridRowStart: minR + 1,
            gridRowEnd: maxR + 2,
            gridColumnStart: minC + 1,
            gridColumnEnd: maxC + 2
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

      const _w = maxC - minC + 1;
      const _h = maxR - minR + 1;
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
          borderStyle: 'dashed'
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
    >
      {/* 1. Render base cells (Empty markers and background) */}
      {grid.map((row, rIndex) => (
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
              className={`grid-cell ${emptyClass}`}
              style={{
                gridRowStart: rIndex + 1,
                gridColumnStart: cIndex + 1
              }}
              onMouseDown={(e) => { e.preventDefault(); handleMouseDown(rIndex, cIndex); }}
              onMouseEnter={(e) => { e.preventDefault(); handleMouseEnter(rIndex, cIndex); }}
            >
              {icon}
            </div>
          );
        })
      ))}
      
      {/* 2. Render unified painted blocks overlaying the base cells */}
      {renderUnifiedBlocks()}

      {/* 3. Render the live drag box */}
      {renderCurrentDragBox()}
    </div>
  );
};

export default GridArea;
