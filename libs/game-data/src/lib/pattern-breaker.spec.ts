import { generatePatternBreaker } from './pattern-breaker';

describe('generatePatternBreaker', () => {
  it('shows a sequence of 4 numbers', () => {
    const content = generatePatternBreaker('easy');
    expect((content.data as number[]).length).toBe(4);
  });

  it('always asks the same fixed-point question', () => {
    const content = generatePatternBreaker('medium');
    expect(content.prompt).toBe('What comes next in the sequence?');
  });

  it('appending correctAnswer to the sequence continues a consistent pattern', () => {
    for (let i = 0; i < 25; i++) {
      const content = generatePatternBreaker('expert');
      const sequence = content.data as number[];
      const full = [...sequence, content.correctAnswer as number];

      const diffs = full.slice(1).map((v, idx) => v - full[idx]);
      const ratios = full.slice(1).map((v, idx) => (full[idx] !== 0 ? v / full[idx] : NaN));

      const isArithmetic = diffs.every((d) => d === diffs[0]);
      const isGeometric = ratios.every((r) => r === ratios[0]);
      const isAlternating = diffs.every((d, idx) => idx < 2 || d === diffs[idx % 2]);

      expect(isArithmetic || isGeometric || isAlternating).toBe(true);
    }
  });
});
