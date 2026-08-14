import { generateMemoryGrid, MEMORY_GRID_SIZE, MemoryGridData } from './memory-grid';

describe('generateMemoryGrid', () => {
  it('scales the number of highlighted cells with difficulty', () => {
    const easy = generateMemoryGrid('easy').data as MemoryGridData;
    const expert = generateMemoryGrid('expert').data as MemoryGridData;
    expect(easy.highlightedPositions.length).toBeLessThan(expert.highlightedPositions.length);
  });

  it('never highlights the same cell twice', () => {
    const data = generateMemoryGrid('expert').data as MemoryGridData;
    expect(new Set(data.highlightedPositions).size).toBe(data.highlightedPositions.length);
  });

  it('keeps every highlighted position within the grid bounds', () => {
    const data = generateMemoryGrid('expert').data as MemoryGridData;
    const totalCells = MEMORY_GRID_SIZE * MEMORY_GRID_SIZE;
    for (const position of data.highlightedPositions) {
      expect(position).toBeGreaterThanOrEqual(0);
      expect(position).toBeLessThan(totalCells);
    }
  });

  it('sets correctAnswer to the same positions as the highlighted cells', () => {
    const content = generateMemoryGrid('medium');
    const data = content.data as MemoryGridData;
    expect(content.correctAnswer).toEqual(data.highlightedPositions);
  });

  it('always asks the same fixed-point prompt', () => {
    const content = generateMemoryGrid('hard');
    expect(content.prompt).toBe('Reproduce the highlighted pattern.');
  });
});
