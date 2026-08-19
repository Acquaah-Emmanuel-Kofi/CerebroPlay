import { Difficulty, GameContent } from '@cerebro-play/shared-models';

const GRID_SIZE_BY_DIFFICULTY: Record<Difficulty, number> = {
  easy: 3,
  medium: 4,
  hard: 5,
  expert: 5,
};

const CHECKPOINT_COUNT_BY_DIFFICULTY: Record<Difficulty, number> = {
  easy: 3,
  medium: 4,
  hard: 4,
  expert: 6,
};

export interface ZipCheckpoint {
  cellIndex: number;
  order: number;
}

export interface ZipPathData {
  gridSize: number;
  checkpoints: ZipCheckpoint[];
}

function neighborsOf(index: number, gridSize: number): number[] {
  const row = Math.floor(index / gridSize);
  const col = index % gridSize;
  const neighbors: number[] = [];
  if (row > 0) neighbors.push(index - gridSize);
  if (row < gridSize - 1) neighbors.push(index + gridSize);
  if (col > 0) neighbors.push(index - 1);
  if (col < gridSize - 1) neighbors.push(index + 1);
  return neighbors;
}

/**
 * Builds a random path that visits every cell of a gridSize x gridSize grid exactly
 * once (a Hamiltonian path), via randomized backtracking. Grid graphs this small
 * (<=25 cells) are Hamiltonian-connected enough that this reliably finds a path
 * within a handful of restarts.
 */
function generateHamiltonianPath(gridSize: number): number[] {
  const totalCells = gridSize * gridSize;

  function attempt(): number[] | null {
    const start = Math.floor(Math.random() * totalCells);
    const path = [start];
    const visited = new Set([start]);

    function backtrack(): boolean {
      if (path.length === totalCells) return true;
      const current = path[path.length - 1];
      const candidates = neighborsOf(current, gridSize)
        .filter((cell) => !visited.has(cell))
        .sort(() => Math.random() - 0.5);

      for (const next of candidates) {
        path.push(next);
        visited.add(next);
        if (backtrack()) return true;
        path.pop();
        visited.delete(next);
      }
      return false;
    }

    return backtrack() ? path : null;
  }

  for (let attemptCount = 0; attemptCount < 200; attemptCount++) {
    const result = attempt();
    if (result) return result;
  }
  throw new Error(`Could not generate a Hamiltonian path for a ${gridSize}x${gridSize} grid`);
}

function placeCheckpoints(path: number[], checkpointCount: number): ZipCheckpoint[] {
  const step = (path.length - 1) / (checkpointCount - 1);
  return Array.from({ length: checkpointCount }, (_, i) => ({
    cellIndex: path[Math.round(i * step)],
    order: i + 1,
  }));
}

export function generateZipPath(difficulty: Difficulty): GameContent {
  const gridSize = GRID_SIZE_BY_DIFFICULTY[difficulty];
  const path = generateHamiltonianPath(gridSize);
  const checkpoints = placeCheckpoints(path, CHECKPOINT_COUNT_BY_DIFFICULTY[difficulty]);

  const data: ZipPathData = { gridSize, checkpoints };

  return {
    prompt: 'Connect the dots in order, visiting every cell exactly once.',
    data,
    correctAnswer: path,
  };
}
