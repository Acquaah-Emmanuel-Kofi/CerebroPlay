import { matrixReasoningGenerator } from './matrix-reasoning.generator';

interface MatrixReasoningData {
  grid: string[];
  options: string[];
}

describe('matrixReasoningGenerator', () => {
  it('produces an 8-cell grid and 4 options containing the correctAnswer', () => {
    const content = matrixReasoningGenerator.generate({ difficulty: 'medium' });
    const data = content.data as MatrixReasoningData;
    expect(data.grid).toHaveLength(8);
    expect(data.options).toHaveLength(4);
    expect(data.options).toContain(content.correctAnswer);
  });
});
