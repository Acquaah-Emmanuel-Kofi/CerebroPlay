import { generateGeneralVerbalAnalogies } from './verbal-analogies';

interface VerbalAnalogyData {
  options: string[];
}

describe('generateGeneralVerbalAnalogies', () => {
  it('produces a prompt ending in a blank and a matching correctAnswer among the options', () => {
    for (let i = 0; i < 30; i++) {
      const content = generateGeneralVerbalAnalogies();
      const data = content.data as VerbalAnalogyData;
      expect(content.prompt).toContain('is to');
      expect(data.options).toContain(content.correctAnswer);
    }
  });

  it('always offers exactly 4 unique options', () => {
    for (let i = 0; i < 30; i++) {
      const data = generateGeneralVerbalAnalogies().data as VerbalAnalogyData;
      expect(data.options).toHaveLength(4);
      expect(new Set(data.options).size).toBe(4);
    }
  });
});
