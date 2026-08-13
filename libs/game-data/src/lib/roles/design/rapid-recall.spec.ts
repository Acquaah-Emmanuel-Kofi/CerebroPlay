import { generateDesignRapidRecall } from './rapid-recall';

describe('generateDesignRapidRecall', () => {
  it('scales the palette length with difficulty', () => {
    expect((generateDesignRapidRecall('easy').data as string[]).length).toBeLessThan(
      (generateDesignRapidRecall('expert').data as string[]).length,
    );
  });

  it('asks about a color that is actually in the palette, with a matching correctAnswer', () => {
    const content = generateDesignRapidRecall('medium');
    const palette = content.data as string[];
    expect(palette).toContain(content.correctAnswer);
  });

  it('never repeats a color within one palette', () => {
    const palette = generateDesignRapidRecall('expert').data as string[];
    expect(new Set(palette).size).toBe(palette.length);
  });
});
