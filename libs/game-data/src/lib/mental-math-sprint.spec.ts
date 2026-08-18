import { generateMentalMathSprint, MentalMathData } from './mental-math-sprint';

function parseOperands(expression: string): { a: number; b: number; symbol: string } {
  const match = expression.match(/^(-?\d+) ([+\-×÷]) (-?\d+)$/);
  if (!match) throw new Error(`Could not parse expression: ${expression}`);
  return { a: Number(match[1]), symbol: match[2], b: Number(match[3]) };
}

describe('generateMentalMathSprint', () => {
  it('the correctAnswer matches evaluating the shown expression', () => {
    for (let i = 0; i < 100; i++) {
      const content = generateMentalMathSprint('medium');
      const data = content.data as MentalMathData;
      const { a, symbol, b } = parseOperands(data.expression);
      const expected = symbol === '+' ? a + b : symbol === '-' ? a - b : symbol === '×' ? a * b : a / b;
      expect(content.correctAnswer).toBe(expected);
    }
  });

  it('provides exactly 4 unique options including the correct answer', () => {
    const content = generateMentalMathSprint('hard');
    const data = content.data as MentalMathData;
    expect(data.options).toHaveLength(4);
    expect(new Set(data.options).size).toBe(4);
    expect(data.options).toContain(content.correctAnswer);
  });

  it('never produces a negative subtraction result', () => {
    for (let i = 0; i < 50; i++) {
      const content = generateMentalMathSprint('medium');
      if (typeof content.correctAnswer === 'number') {
        expect(content.correctAnswer).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it('division always produces a whole-number answer', () => {
    for (let i = 0; i < 50; i++) {
      const content = generateMentalMathSprint('expert');
      expect(Number.isInteger(content.correctAnswer)).toBe(true);
    }
  });

  it('easy only ever uses addition', () => {
    for (let i = 0; i < 20; i++) {
      const content = generateMentalMathSprint('easy');
      const data = content.data as MentalMathData;
      expect(data.expression).toContain('+');
    }
  });
});
