import { generateMarketingRapidRecall } from './rapid-recall';

describe('generateMarketingRapidRecall', () => {
  it('scales the number of campaign fields shown with difficulty', () => {
    const easyFieldCount = Object.keys(
      generateMarketingRapidRecall('easy').data as Record<string, unknown>,
    ).length;
    const expertFieldCount = Object.keys(
      generateMarketingRapidRecall('expert').data as Record<string, unknown>,
    ).length;
    expect(easyFieldCount).toBeLessThan(expertFieldCount);
  });

  it('asks about a field that is actually present in the data, with a matching correctAnswer', () => {
    const content = generateMarketingRapidRecall('medium');
    const data = content.data as Record<string, unknown>;
    expect(Object.values(data)).toContain(content.correctAnswer);
  });
});
