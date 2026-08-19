import { generateJigsaw, JigsawData } from './jigsaw';

describe('generateJigsaw', () => {
  it('shuffles every piece into a different arrangement than solved, using all pieces exactly once', () => {
    for (const difficulty of ['easy', 'medium', 'hard', 'expert'] as const) {
      const content = generateJigsaw(difficulty);
      const data = content.data as JigsawData;
      const solved = content.correctAnswer as number[];

      expect(data.initialOrder).toHaveLength(data.gridSize * data.gridSize);
      expect([...data.initialOrder].sort((a, b) => a - b)).toEqual(solved);
      expect(data.initialOrder).not.toEqual(solved);
    }
  });

  it('scales piece count up with difficulty', () => {
    const pieceCountAt = (difficulty: 'easy' | 'medium' | 'hard' | 'expert') =>
      (generateJigsaw(difficulty).data as JigsawData).gridSize;

    expect(pieceCountAt('easy')).toBeLessThan(pieceCountAt('medium'));
    expect(pieceCountAt('medium')).toBeLessThan(pieceCountAt('hard'));
    expect(pieceCountAt('hard')).toBeLessThan(pieceCountAt('expert'));
  });
});
