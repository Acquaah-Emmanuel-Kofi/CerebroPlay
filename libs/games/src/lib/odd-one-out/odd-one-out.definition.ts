import { GameDefinition } from '@cerebro-play/shared-models';
import { equalityValidator } from '../equality-validator';
import { oddOneOutGenerator } from './odd-one-out.generator';

export const oddOneOutDefinition: GameDefinition = {
  id: 'odd-one-out',
  type: 'classification',
  skill: 'problemSolving',
  difficulties: [
    { difficulty: 'easy' },
    { difficulty: 'medium' },
    { difficulty: 'hard' },
    { difficulty: 'expert' },
  ],
  generator: oddOneOutGenerator,
  validator: equalityValidator,
};
