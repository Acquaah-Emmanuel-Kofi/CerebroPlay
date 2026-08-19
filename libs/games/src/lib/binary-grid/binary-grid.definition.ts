import { GameDefinition } from '@cerebro-play/shared-models';
import { binaryGridValidator } from '../binary-grid-validator';
import { binaryGridGenerator } from './binary-grid.generator';

export const binaryGridDefinition: GameDefinition = {
  id: 'binary-grid',
  type: 'logic',
  skill: 'logic',
  difficulties: [
    { difficulty: 'easy' },
    { difficulty: 'medium' },
    { difficulty: 'hard' },
    { difficulty: 'expert' },
  ],
  generator: binaryGridGenerator,
  validator: binaryGridValidator,
};
