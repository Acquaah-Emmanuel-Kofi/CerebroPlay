import { generateFocus, FocusData } from './focus';

describe('generateFocus', () => {
  it('sets correctAnswer to "target" when the shown symbol matches the target', () => {
    for (let i = 0; i < 50; i++) {
      const content = generateFocus();
      const data = content.data as FocusData;
      expect(content.correctAnswer).toBe(data.symbol === data.target ? 'target' : 'skip');
    }
  });

  it('shows the target symbol roughly half the time over many rounds', () => {
    let targetShown = 0;
    const total = 200;
    for (let i = 0; i < total; i++) {
      const data = generateFocus().data as FocusData;
      if (data.symbol === data.target) targetShown++;
    }
    const ratio = targetShown / total;
    expect(ratio).toBeGreaterThan(0.3);
    expect(ratio).toBeLessThan(0.7);
  });

  it('the prompt names the target symbol', () => {
    const content = generateFocus();
    const data = content.data as FocusData;
    expect(content.prompt).toContain(data.target);
  });
});
