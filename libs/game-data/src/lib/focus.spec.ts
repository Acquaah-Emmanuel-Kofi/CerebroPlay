import { generateFocus, FocusData } from './focus';

describe('generateFocus', () => {
  it('sets correctAnswer to "target" when the shown symbol matches the target', () => {
    for (let i = 0; i < 50; i++) {
      const content = generateFocus('easy');
      const data = content.data as FocusData;
      expect(content.correctAnswer).toBe(data.symbol === data.target ? 'target' : 'skip');
    }
  });

  it('shows the target symbol roughly half the time over many rounds', () => {
    let targetShown = 0;
    const total = 200;
    for (let i = 0; i < total; i++) {
      const data = generateFocus('easy').data as FocusData;
      if (data.symbol === data.target) targetShown++;
    }
    const ratio = targetShown / total;
    expect(ratio).toBeGreaterThan(0.3);
    expect(ratio).toBeLessThan(0.7);
  });

  it('the prompt names the target symbol', () => {
    const content = generateFocus('easy');
    const data = content.data as FocusData;
    expect(content.prompt).toContain(data.target);
  });

  it('grows the symbol pool as difficulty increases, widening the distractor pool', () => {
    const poolAt = (difficulty: 'easy' | 'medium' | 'hard' | 'expert') => {
      const seen = new Set<string>();
      for (let i = 0; i < 200; i++) {
        const data = generateFocus(difficulty).data as FocusData;
        seen.add(data.target);
      }
      return seen.size;
    };

    expect(poolAt('easy')).toBeLessThan(poolAt('expert'));
  });
});
