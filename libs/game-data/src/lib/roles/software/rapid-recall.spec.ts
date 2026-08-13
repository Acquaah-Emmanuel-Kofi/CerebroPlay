import { generateSoftwareRapidRecall } from './rapid-recall';

describe('generateSoftwareRapidRecall', () => {
  it('scales the number of API fields shown with difficulty', () => {
    const easyFieldCount = Object.keys(generateSoftwareRapidRecall('easy').data as Record<string, unknown>).length;
    const expertFieldCount = Object.keys(
      generateSoftwareRapidRecall('expert').data as Record<string, unknown>,
    ).length;
    expect(easyFieldCount).toBeLessThan(expertFieldCount);
  });

  it('asks about a field that is actually present in the data, with a matching correctAnswer', () => {
    const content = generateSoftwareRapidRecall('medium');
    const data = content.data as Record<string, unknown>;
    expect(Object.values(data)).toContain(content.correctAnswer);
  });
});
