import { GameDefinition } from '@cerebro-play/shared-models';
import { equalityValidator } from '../equality-validator';
import { mentalMathSprintGenerator } from './mental-math-sprint.generator';

export const mentalMathSprintDefinition: GameDefinition = {
  id: 'mental-math-sprint',
  type: 'numerical',
  skill: 'numerical',
  difficulties: [
    { difficulty: 'easy' },
    { difficulty: 'medium' },
    { difficulty: 'hard' },
    { difficulty: 'expert' },
  ],
  generator: mentalMathSprintGenerator,
  validator: equalityValidator,
};
