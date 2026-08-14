import { GameDefinition } from '@cerebro-play/shared-models';
import { equalityValidator } from '../equality-validator';
import { focusGenerator } from './focus.generator';

export const focusDefinition: GameDefinition = {
  id: 'focus',
  type: 'attention',
  skill: 'focus',
  difficulties: [
    { difficulty: 'easy' },
    { difficulty: 'medium' },
    { difficulty: 'hard' },
    { difficulty: 'expert' },
  ],
  generator: focusGenerator,
  validator: equalityValidator,
};
