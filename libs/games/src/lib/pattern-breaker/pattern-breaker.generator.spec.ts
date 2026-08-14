import { patternBreakerGenerator } from './pattern-breaker.generator';

describe('patternBreakerGenerator', () => {
  it('produces a 4-number sequence with a numeric correctAnswer', () => {
    const content = patternBreakerGenerator.generate({ difficulty: 'easy' });
    expect((content.data as number[]).length).toBe(4);
    expect(typeof content.correctAnswer).toBe('number');
  });

  it('ignores roleTheme (no role variants for this game)', () => {
    const withRole = patternBreakerGenerator.generate({ difficulty: 'easy', roleTheme: 'software' });
    const withoutRole = patternBreakerGenerator.generate({ difficulty: 'easy' });
    expect((withRole.data as number[]).length).toBe((withoutRole.data as number[]).length);
    expect(withRole.prompt).toBe(withoutRole.prompt);
  });
});
