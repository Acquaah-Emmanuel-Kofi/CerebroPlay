import { generateGeneralRapidRecall } from './rapid-recall';

describe('generateGeneralRapidRecall', () => {
  it('scales the number list length with difficulty', () => {
    expect((generateGeneralRapidRecall('easy').data as number[]).length).toBeLessThan(
      (generateGeneralRapidRecall('expert').data as number[]).length,
    );
  });

  it('asks about a number that is actually in the list, with a matching correctAnswer', () => {
    const content = generateGeneralRapidRecall('medium');
    const numbers = content.data as number[];
    expect(numbers).toContain(content.correctAnswer);
  });

  it('phrases the prompt as an ordinal question', () => {
    const content = generateGeneralRapidRecall('easy');
    expect(content.prompt).toMatch(/What was the \d+(st|nd|rd|th) number\?/);
  });
});
