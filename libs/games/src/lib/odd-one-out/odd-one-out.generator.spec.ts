import { oddOneOutGenerator } from './odd-one-out.generator';

describe('oddOneOutGenerator', () => {
  it('produces content with a numeric correctAnswer', () => {
    const content = oddOneOutGenerator.generate({ difficulty: 'medium' });
    expect(typeof content.correctAnswer).toBe('number');
  });

  it('respects the requested difficulty', () => {
    const easyContent = oddOneOutGenerator.generate({ difficulty: 'easy' }).data as { items: number[] };
    const expertContent = oddOneOutGenerator.generate({ difficulty: 'expert' }).data as { items: number[] };
    expect(easyContent.items.length).toBeLessThan(expertContent.items.length);
  });
});
