import { generateWordScramble, WordScrambleData } from './word-scramble';

describe('generateWordScramble', () => {
  it('scrambles the correctAnswer word into a different letter order using the same letters', () => {
    for (let i = 0; i < 30; i++) {
      const content = generateWordScramble('medium');
      const data = content.data as WordScrambleData;
      const word = content.correctAnswer as string;

      expect(data.scrambledLetters.join('')).not.toBe(word);
      expect([...data.scrambledLetters].sort()).toEqual([...word].sort());
    }
  });

  it('scales word length up with difficulty', () => {
    const lengthAt = (difficulty: 'easy' | 'medium' | 'hard' | 'expert') =>
      (generateWordScramble(difficulty).correctAnswer as string).length;

    expect(lengthAt('easy')).toBeLessThan(lengthAt('hard'));
    expect(lengthAt('hard')).toBeLessThan(lengthAt('expert'));
  });

  it('the prompt states the word length', () => {
    const content = generateWordScramble('easy');
    const word = content.correctAnswer as string;
    expect(content.prompt).toContain(`${word.length}-letter`);
  });
});
