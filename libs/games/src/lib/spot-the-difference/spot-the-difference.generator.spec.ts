import { spotTheDifferenceGenerator } from './spot-the-difference.generator';

describe('spotTheDifferenceGenerator', () => {
  it('produces two states with a numeric correctAnswer index', () => {
    const content = spotTheDifferenceGenerator.generate({ difficulty: 'easy' });
    const data = content.data as { stateA: string[]; stateB: string[] };
    expect(data.stateA.length).toBe(data.stateB.length);
    expect(typeof content.correctAnswer).toBe('number');
  });

  it('ignores roleTheme (no role variants for this game)', () => {
    const withRole = spotTheDifferenceGenerator.generate({ difficulty: 'easy', roleTheme: 'design' });
    const withoutRole = spotTheDifferenceGenerator.generate({ difficulty: 'easy' });
    expect(withRole.prompt).toBe(withoutRole.prompt);
  });
});
