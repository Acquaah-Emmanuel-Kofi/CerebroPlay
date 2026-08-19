import { GameDefinition } from '@cerebro-play/shared-models';
import { arrayEqualityValidator } from '../array-equality-validator';
import { jigsawGenerator } from './jigsaw.generator';

export const jigsawDefinition: GameDefinition = {
  id: 'jigsaw',
  type: 'visual',
  skill: 'visual',
  difficulties: [
    { difficulty: 'easy' },
    { difficulty: 'medium' },
    { difficulty: 'hard' },
    { difficulty: 'expert' },
  ],
  generator: jigsawGenerator,
  validator: arrayEqualityValidator,
};
