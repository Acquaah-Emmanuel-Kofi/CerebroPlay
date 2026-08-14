import { generateSortIt, SortItData } from './sort-it';

describe('generateSortIt', () => {
  it('produces a value with two categories and a correctAnswer matching one of them', () => {
    const content = generateSortIt('easy');
    const data = content.data as SortItData;
    expect(data.categories).toHaveLength(2);
    expect(data.categories).toContain(content.correctAnswer);
  });

  it('scales the value range with difficulty', () => {
    const values = { easy: [] as number[], expert: [] as number[] };
    for (let i = 0; i < 40; i++) {
      values.easy.push((generateSortIt('easy').data as SortItData).value);
      values.expert.push((generateSortIt('expert').data as SortItData).value);
    }
    expect(Math.max(...values.easy)).toBeLessThanOrEqual(10);
    expect(Math.max(...values.expert)).toBeGreaterThan(10);
  });

  it('the rule changes across repeated calls (mid-game rule switching)', () => {
    const rules = new Set<string>();
    for (let i = 0; i < 40; i++) {
      rules.add((generateSortIt('medium').data as SortItData).rule);
    }
    expect(rules.size).toBeGreaterThan(1);
  });

  it('correctAnswer is genuinely consistent with the stated rule', () => {
    for (let i = 0; i < 40; i++) {
      const content = generateSortIt('medium');
      const data = content.data as SortItData;
      if (data.rule.includes('parity')) {
        expect(content.correctAnswer).toBe(data.value % 2 === 0 ? 'Even' : 'Odd');
      } else if (data.rule.includes('size')) {
        expect(content.correctAnswer).toBe(data.value < 10 ? 'Small (< 10)' : 'Large (>= 10)');
      } else {
        expect(content.correctAnswer).toBe(data.value % 3 === 0 ? 'Divisible by 3' : 'Not divisible by 3');
      }
    }
  });
});
