import { memoryGridGenerator } from './memory-grid.generator';

describe('memoryGridGenerator', () => {
  it('produces grid data with a matching correctAnswer', () => {
    const content = memoryGridGenerator.generate({ difficulty: 'easy' });
    const data = content.data as { gridSize: number; highlightedPositions: number[] };
    expect(data.gridSize).toBeGreaterThan(0);
    expect(content.correctAnswer).toEqual(data.highlightedPositions);
  });

  it('ignores roleTheme (no role variants for this game)', () => {
    const withRole = memoryGridGenerator.generate({ difficulty: 'easy', roleTheme: 'finance' });
    const withoutRole = memoryGridGenerator.generate({ difficulty: 'easy' });
    expect(withRole.prompt).toBe(withoutRole.prompt);
  });
});
