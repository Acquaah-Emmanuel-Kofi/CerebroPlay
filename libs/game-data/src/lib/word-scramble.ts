import { Difficulty, GameContent } from '@cerebro-play/shared-models';

const WORDS_BY_DIFFICULTY: Record<Difficulty, string[]> = {
  easy: ['WORD', 'GAME', 'BRAIN', 'LEARN', 'THINK', 'SPARK', 'QUICK', 'SMART'],
  medium: ['MEMORY', 'PUZZLE', 'CLEVER', 'MASTER', 'WISDOM', 'ENERGY', 'PATTERN', 'ANALYZE'],
  hard: ['STRATEGY', 'DISCOVER', 'CREATIVE', 'FUNCTION', 'CHALLENGE', 'COGNITIVE', 'KNOWLEDGE', 'RESILIENT'],
  expert: [
    'INTELLIGENCE',
    'CONCENTRATE',
    'PERSEVERANCE',
    'UNDERSTANDING',
    'VOCABULARY',
    'IMAGINATION',
    'OBSERVATION',
    'CALCULATION',
  ],
};

export interface WordScrambleData {
  scrambledLetters: string[];
}

function shuffleWord(word: string): string[] {
  const letters = word.split('');
  let shuffled: string[];
  do {
    shuffled = [...letters].sort(() => Math.random() - 0.5);
  } while (shuffled.join('') === word);
  return shuffled;
}

export function generateWordScramble(difficulty: Difficulty): GameContent {
  const words = WORDS_BY_DIFFICULTY[difficulty];
  const word = words[Math.floor(Math.random() * words.length)];
  const scrambledLetters = shuffleWord(word);

  const data: WordScrambleData = { scrambledLetters };

  return {
    prompt: `Unscramble the ${word.length}-letter word`,
    data,
    correctAnswer: word,
  };
}
