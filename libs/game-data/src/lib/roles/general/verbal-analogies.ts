import { GameContent } from '@cerebro-play/shared-models';

export interface AnalogyPair {
  wordA: string;
  wordB: string;
  wordC: string;
  correctAnswer: string;
}

export const GENERAL_ANALOGY_PAIRS: AnalogyPair[] = [
  { wordA: 'Bird', wordB: 'Fly', wordC: 'Fish', correctAnswer: 'Swim' },
  { wordA: 'Hot', wordB: 'Cold', wordC: 'Up', correctAnswer: 'Down' },
  { wordA: 'Doctor', wordB: 'Hospital', wordC: 'Teacher', correctAnswer: 'School' },
  { wordA: 'Pen', wordB: 'Write', wordC: 'Knife', correctAnswer: 'Cut' },
  { wordA: 'Puppy', wordB: 'Dog', wordC: 'Kitten', correctAnswer: 'Cat' },
  { wordA: 'Author', wordB: 'Book', wordC: 'Composer', correctAnswer: 'Symphony' },
  { wordA: 'Ocean', wordB: 'Wave', wordC: 'Desert', correctAnswer: 'Dune' },
  { wordA: 'Key', wordB: 'Lock', wordC: 'Password', correctAnswer: 'Account' },
  { wordA: 'Chef', wordB: 'Kitchen', wordC: 'Pilot', correctAnswer: 'Cockpit' },
  { wordA: 'Winter', wordB: 'Snow', wordC: 'Summer', correctAnswer: 'Heat' },
];

export function generateGeneralVerbalAnalogies(): GameContent {
  return buildVerbalAnalogyContent(GENERAL_ANALOGY_PAIRS);
}

export function buildVerbalAnalogyContent(pairs: AnalogyPair[]): GameContent {
  const pair = pairs[Math.floor(Math.random() * pairs.length)];

  const distractorPool = pairs
    .filter((candidate) => candidate.correctAnswer !== pair.correctAnswer)
    .map((candidate) => candidate.correctAnswer);
  const distractors = new Set<string>();
  while (distractors.size < 3 && distractors.size < distractorPool.length) {
    distractors.add(distractorPool[Math.floor(Math.random() * distractorPool.length)]);
  }

  const options = [pair.correctAnswer, ...distractors].sort(() => Math.random() - 0.5);

  return {
    prompt: `${pair.wordA} is to ${pair.wordB} as ${pair.wordC} is to ___?`,
    data: { options },
    correctAnswer: pair.correctAnswer,
  };
}
