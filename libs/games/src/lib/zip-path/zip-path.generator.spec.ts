import { ZipPathData } from '@cerebro-play/game-data';
import { zipPathGenerator } from './zip-path.generator';

describe('zipPathGenerator', () => {
  it('produces a full-coverage path and checkpoints matching the grid size', () => {
    const content = zipPathGenerator.generate({ difficulty: 'medium' });
    const data = content.data as ZipPathData;
    const path = content.correctAnswer as number[];

    expect(path).toHaveLength(data.gridSize * data.gridSize);
    for (const checkpoint of data.checkpoints) {
      expect(path).toContain(checkpoint.cellIndex);
    }
  });
});
