import { GameDefinition } from '@cerebro-play/shared-models';
import { equalityValidator } from '../equality-validator';
import { sortItGenerator } from './sort-it.generator';

export const sortItDefinition: GameDefinition = {
  id: 'sort-it',
  type: 'classification',
  skill: 'flexibility',
  difficulties: [
    { difficulty: 'easy' },
    { difficulty: 'medium' },
    { difficulty: 'hard' },
    { difficulty: 'expert' },
  ],
  generator: sortItGenerator,
  validator: equalityValidator,
};
