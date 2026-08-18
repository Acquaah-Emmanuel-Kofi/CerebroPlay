import { mentalMathSprintGenerator } from './mental-math-sprint.generator';

describe('mentalMathSprintGenerator', () => {
  it('produces an arithmetic prompt with a numeric correctAnswer', () => {
    const content = mentalMathSprintGenerator.generate({ difficulty: 'medium' });
    expect(content.prompt).toContain('=');
    expect(typeof content.correctAnswer).toBe('number');
  });

  it('respects the requested difficulty', () => {
    const easyContent = mentalMathSprintGenerator.generate({ difficulty: 'easy' });
    expect(easyContent.prompt).toContain('+');
  });
});
