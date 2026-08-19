import { generateOddOneOut, OddOneOutData } from './odd-one-out';

describe('generateOddOneOut', () => {
  it('the correctAnswer is present exactly once among the items', () => {
    for (let i = 0; i < 50; i++) {
      const content = generateOddOneOut('medium');
      const data = content.data as OddOneOutData;
      const occurrences = data.items.filter((item) => item === content.correctAnswer).length;
      expect(occurrences).toBe(1);
    }
  });

  it('all items are unique', () => {
    for (let i = 0; i < 50; i++) {
      const content = generateOddOneOut('hard');
      const data = content.data as OddOneOutData;
      expect(new Set(data.items).size).toBe(data.items.length);
    }
  });

  it('grows the item count as difficulty increases', () => {
    const easyCount = (generateOddOneOut('easy').data as OddOneOutData).items.length;
    const expertCount = (generateOddOneOut('expert').data as OddOneOutData).items.length;
    expect(easyCount).toBeLessThan(expertCount);
  });

  it('the prompt names the shared rule', () => {
    const content = generateOddOneOut('easy');
    const data = content.data as OddOneOutData;
    expect(content.prompt).toContain(data.ruleLabel);
  });
});
