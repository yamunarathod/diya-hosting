export const GRID_SIZE = 20;
export const MAX_ROWS = 10;
export const CELL_COUNT = GRID_SIZE * MAX_ROWS; // 200 cells

export const findEmptyGridIndex = (usedCells) => {
  const emptyIndices = [];
  for (let i = 0; i < CELL_COUNT; i++) {
    const row = Math.floor(i / GRID_SIZE);
    if (row >= MAX_ROWS) continue;
    if (!usedCells.has(i)) {
      emptyIndices.push(i);
    }
  }

  if (emptyIndices.length === 0) return null;
  const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  return randomIndex;
};