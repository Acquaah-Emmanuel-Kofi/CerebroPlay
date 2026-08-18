import { focusGenerator } from './focus.generator';

describe('focusGenerator', () => {
  it('produces content with a target/skip correctAnswer', () => {
    const content = focusGenerator.generate({ difficulty: 'easy' });
    expect(['target', 'skip']).toContain(content.correctAnswer);
  });

  it('ignores role theme (no role variants for this game)', () => {
    const content = focusGenerator.generate({ difficulty: 'expert', roleTheme: 'software' });
    expect(content.prompt).toContain('Tap TARGET');
  });
});
