import { verbalAnalogiesGenerator } from './verbal-analogies.generator';

interface VerbalAnalogyData {
  options: string[];
}

describe('verbalAnalogiesGenerator', () => {
  it('defaults to the general role when none is given', () => {
    const content = verbalAnalogiesGenerator.generate({ difficulty: 'easy' });
    const data = content.data as VerbalAnalogyData;
    expect(data.options).toContain(content.correctAnswer);
  });

  it('produces role-specific content for each role theme', () => {
    const roles: Array<'general' | 'software' | 'design' | 'finance' | 'marketing'> = [
      'general',
      'software',
      'design',
      'finance',
      'marketing',
    ];
    for (const roleTheme of roles) {
      const content = verbalAnalogiesGenerator.generate({ difficulty: 'medium', roleTheme });
      const data = content.data as VerbalAnalogyData;
      expect(data.options).toHaveLength(4);
      expect(data.options).toContain(content.correctAnswer);
    }
  });
});
