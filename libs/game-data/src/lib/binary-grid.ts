import { Difficulty, GameContent } from '@cerebro-play/shared-models';

const SIZE_BY_DIFFICULTY: Record<Difficulty, number> = {
  easy: 4,
  medium: 6,
  hard: 6,
  expert: 8,
};

const CLUE_FRACTION_BY_DIFFICULTY: Record<Difficulty, number> = {
  easy: 0.6,
  medium: 0.5,
  hard: 0.4,
  expert: 0.35,
};

export interface BinaryGridData {
  size: number;
  clues: (0 | 1 | null)[];
}

/**
 * Fills the grid cell by cell (row-major) via randomized backtracking, enforcing the
 * "binary puzzle" / Tango-style rules as it goes: no 3 consecutive identical symbols in
 * any row or column, and each row/column ends up with an equal split of both symbols.
 * Tractable for the sizes used here (4x4 up to 8x8) -- these puzzles are dense enough
 * that backtracking rarely needs deep restarts.
 */
function generateSolutionGrid(size: number): (0 | 1)[] {
  const grid: (0 | 1 | -1)[] = new Array(size * size).fill(-1);
  const half = size / 2;

  function countInRow(row: number, symbol: 0 | 1, beforeCol: number): number {
    let count = 0;
    for (let c = 0; c < beforeCol; c++) if (grid[row * size + c] === symbol) count++;
    return count;
  }

  function countInCol(col: number, symbol: 0 | 1, beforeRow: number): number {
    let count = 0;
    for (let r = 0; r < beforeRow; r++) if (grid[r * size + col] === symbol) count++;
    return count;
  }

  function isValid(row: number, col: number, symbol: 0 | 1): boolean {
    if (col >= 2 && grid[row * size + col - 1] === symbol && grid[row * size + col - 2] === symbol) return false;
    if (row >= 2 && grid[(row - 1) * size + col] === symbol && grid[(row - 2) * size + col] === symbol) return false;
    if (countInRow(row, symbol, col) >= half) return false;
    if (countInCol(col, symbol, row) >= half) return false;
    return true;
  }

  function backtrack(index: number): boolean {
    if (index === size * size) return true;
    const row = Math.floor(index / size);
    const col = index % size;
    const symbols: (0 | 1)[] = Math.random() < 0.5 ? [0, 1] : [1, 0];

    for (const symbol of symbols) {
      if (isValid(row, col, symbol)) {
        grid[index] = symbol;
        if (backtrack(index + 1)) return true;
        grid[index] = -1;
      }
    }
    return false;
  }

  if (!backtrack(0)) {
    throw new Error(`Could not generate a ${size}x${size} binary grid`);
  }
  return grid as (0 | 1)[];
}

function removeClues(solution: (0 | 1)[], clueFraction: number): (0 | 1 | null)[] {
  const totalCells = solution.length;
  const clueCount = Math.round(totalCells * clueFraction);
  const shuffledIndices = Array.from({ length: totalCells }, (_, i) => i).sort(() => Math.random() - 0.5);
  const clueIndices = new Set(shuffledIndices.slice(0, clueCount));

  return solution.map((value, index) => (clueIndices.has(index) ? value : null));
}

export function generateBinaryGrid(difficulty: Difficulty): GameContent {
  const size = SIZE_BY_DIFFICULTY[difficulty];
  const solution = generateSolutionGrid(size);
  const clues = removeClues(solution, CLUE_FRACTION_BY_DIFFICULTY[difficulty]);

  const data: BinaryGridData = { size, clues };

  return {
    prompt: 'Fill every cell so each row and column has an equal split, with no more than 2 in a row.',
    data,
    correctAnswer: solution,
  };
}
