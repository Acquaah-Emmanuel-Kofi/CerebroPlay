import { GameDefinition } from '@cerebro-play/shared-models';
import { equalityValidator } from '../equality-validator';
import { matrixReasoningGenerator } from './matrix-reasoning.generator';

export const matrixReasoningDefinition: GameDefinition = {
  id: 'matrix-reasoning',
  type: 'pattern',
  skill: 'visual',
  difficulties: [
    { difficulty: 'easy' },
    { difficulty: 'medium' },
    { difficulty: 'hard' },
    { difficulty: 'expert' },
  ],
  generator: matrixReasoningGenerator,
  validator: equalityValidator,
};
