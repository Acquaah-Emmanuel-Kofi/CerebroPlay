import { wordScrambleGenerator } from './word-scramble.generator';

interface WordScrambleData {
  scrambledLetters: string[];
}

describe('wordScrambleGenerator', () => {
  it('produces scrambled letters matching the correctAnswer word', () => {
    const content = wordScrambleGenerator.generate({ difficulty: 'medium' });
    const data = content.data as WordScrambleData;
    const word = content.correctAnswer as string;
    expect([...data.scrambledLetters].sort()).toEqual([...word].sort());
  });
});
