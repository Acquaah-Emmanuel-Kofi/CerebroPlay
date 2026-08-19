import { generateSoftwareVerbalAnalogies } from './verbal-analogies';

interface VerbalAnalogyData {
  options: string[];
}

describe('generateSoftwareVerbalAnalogies', () => {
  it('produces a prompt with a matching correctAnswer among 4 unique options', () => {
    for (let i = 0; i < 30; i++) {
      const content = generateSoftwareVerbalAnalogies();
      const data = content.data as VerbalAnalogyData;
      expect(data.options).toContain(content.correctAnswer);
      expect(data.options).toHaveLength(4);
      expect(new Set(data.options).size).toBe(4);
    }
  });
});
