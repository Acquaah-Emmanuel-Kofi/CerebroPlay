import { generateFinanceRapidRecall } from './rapid-recall';

describe('generateFinanceRapidRecall', () => {
  it('scales the number of transactions with difficulty', () => {
    expect((generateFinanceRapidRecall('easy').data as string[]).length).toBeLessThan(
      (generateFinanceRapidRecall('expert').data as string[]).length,
    );
  });

  it('always asks for the highest amount, and the correctAnswer really is the max', () => {
    const content = generateFinanceRapidRecall('medium');
    const amounts = (content.data as string[]).map((formatted) => parseFloat(formatted.replace('$', '')));
    const expectedMax = `$${Math.max(...amounts).toFixed(2)}`;

    expect(content.prompt).toBe('Which transaction had the highest amount?');
    expect(content.correctAnswer).toBe(expectedMax);
    expect(content.data).toContain(content.correctAnswer);
  });
});
