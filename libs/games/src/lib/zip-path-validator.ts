import { AnswerValidator } from '@cerebro-play/shared-models';
import { ZipPathData } from '@cerebro-play/game-data';

/**
 * Accepts any submitted path satisfying the puzzle's structural constraints (full
 * grid coverage, no revisits, each step grid-adjacent, checkpoints hit in order) --
 * not just the one reference path the generator happened to construct. A Hamiltonian
 * path through a fixed set of ordered checkpoints is rarely unique, so requiring an
 * exact match against the generator's own solution would unfairly reject other valid
 * solutions the player could have found.
 */
export const zipPathValidator: AnswerValidator = {
  validate(content, submittedAnswer) {
    if (!Array.isArray(submittedAnswer)) return false;
    const path = submittedAnswer as number[];
    const data = content.data as ZipPathData;
    const totalCells = data.gridSize * data.gridSize;

    if (path.length !== totalCells) return false;
    if (new Set(path).size !== totalCells) return false;

    for (let i = 1; i < path.length; i++) {
      const rowPrev = Math.floor(path[i - 1] / data.gridSize);
      const colPrev = path[i - 1] % data.gridSize;
      const rowCurr = Math.floor(path[i] / data.gridSize);
      const colCurr = path[i] % data.gridSize;
      const isAdjacent = Math.abs(rowPrev - rowCurr) + Math.abs(colPrev - colCurr) === 1;
      if (!isAdjacent) return false;
    }

    const sortedCheckpoints = [...data.checkpoints].sort((a, b) => a.order - b.order);
    let lastPosition = -1;
    for (const checkpoint of sortedCheckpoints) {
      const position = path.indexOf(checkpoint.cellIndex);
      if (position === -1 || position < lastPosition) return false;
      lastPosition = position;
    }

    return true;
  },
};
