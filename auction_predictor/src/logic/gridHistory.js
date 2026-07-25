const MAX_HISTORY = 30;

/**
 * Simple undo/redo stack for grid state.
 * Each snapshot is a deep copy of the grid 2D array.
 */
export class GridHistory {
  constructor() {
    this.undoStack = [];
    this.redoStack = [];
  }

  /**
   * Push the current grid state onto the undo stack before making a change.
   * Clears the redo stack (new action invalidates future redo).
   */
  push(grid) {
    const snapshot = grid.map((row) => row.map((cell) => (cell ? { ...cell } : null)));
    this.undoStack.push(snapshot);
    if (this.undoStack.length > MAX_HISTORY) {
      this.undoStack.shift();
    }
    this.redoStack = [];
  }

  /**
   * Undo: pop from undo stack, push current to redo stack, return previous state.
   * Returns null if nothing to undo.
   */
  undo(currentGrid) {
    if (this.undoStack.length === 0) return null;
    const currentSnapshot = currentGrid.map((row) => row.map((cell) => (cell ? { ...cell } : null)));
    this.redoStack.push(currentSnapshot);
    return this.undoStack.pop();
  }

  /**
   * Redo: pop from redo stack, push current to undo stack, return next state.
   * Returns null if nothing to redo.
   */
  redo(currentGrid) {
    if (this.redoStack.length === 0) return null;
    const currentSnapshot = currentGrid.map((row) => row.map((cell) => (cell ? { ...cell } : null)));
    this.undoStack.push(currentSnapshot);
    return this.redoStack.pop();
  }

  canUndo() {
    return this.undoStack.length > 0;
  }

  canRedo() {
    return this.redoStack.length > 0;
  }

  clear() {
    this.undoStack = [];
    this.redoStack = [];
  }
}
