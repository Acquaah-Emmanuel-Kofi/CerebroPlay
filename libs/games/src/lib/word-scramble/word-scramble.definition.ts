import { GameDefinition } from '@cerebro-play/shared-models';
import { equalityValidator } from '../equality-validator';
import { wordScrambleGenerator } from './word-scramble.generator';

export const wordScrambleDefinition: GameDefinition = {
  id: 'word-scramble',
  type: 'sequence',
  skill: 'verbal',
  difficulties: [
    { difficulty: 'easy' },
    { difficulty: 'medium' },
    { difficulty: 'hard' },
    { difficulty: 'expert' },
  ],
  generator: wordScrambleGenerator,
  validator: equalityValidator,
};
