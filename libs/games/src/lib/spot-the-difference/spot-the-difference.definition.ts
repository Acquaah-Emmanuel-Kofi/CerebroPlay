import { GameDefinition } from '@cerebro-play/shared-models';
import { equalityValidator } from '../equality-validator';
import { spotTheDifferenceGenerator } from './spot-the-difference.generator';

export const spotTheDifferenceDefinition: GameDefinition = {
  id: 'spot-the-difference',
  type: 'visual',
  skill: 'visual',
  difficulties: [
    { difficulty: 'easy' },
    { difficulty: 'medium' },
    { difficulty: 'hard' },
    { difficulty: 'expert' },
  ],
  generator: spotTheDifferenceGenerator,
  validator: equalityValidator,
};
