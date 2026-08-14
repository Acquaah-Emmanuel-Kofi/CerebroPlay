import { sortItGenerator } from './sort-it.generator';

describe('sortItGenerator', () => {
  it('produces content with two categories and a matching correctAnswer', () => {
    const content = sortItGenerator.generate({ difficulty: 'easy' });
    const data = content.data as { categories: [string, string] };
    expect(data.categories).toContain(content.correctAnswer);
  });

  it('ignores roleTheme (no role variants for this game)', () => {
    const content = sortItGenerator.generate({ difficulty: 'easy', roleTheme: 'marketing' });
    expect(content.prompt).toContain('Which category does');
  });
});
