import { JigsawData } from '@cerebro-play/game-data';
import { jigsawGenerator } from './jigsaw.generator';

describe('jigsawGenerator', () => {
  it('produces a shuffled arrangement different from the solved order', () => {
    const content = jigsawGenerator.generate({ difficulty: 'easy' });
    const data = content.data as JigsawData;
    const solved = content.correctAnswer as number[];

    expect(data.initialOrder).not.toEqual(solved);
    expect([...data.initialOrder].sort((a, b) => a - b)).toEqual(solved);
  });
});
