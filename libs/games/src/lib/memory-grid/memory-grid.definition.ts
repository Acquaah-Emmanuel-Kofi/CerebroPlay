import { GameDefinition } from '@cerebro-play/shared-models';
import { setEqualityValidator } from '../set-equality-validator';
import { memoryGridGenerator } from './memory-grid.generator';

export const memoryGridDefinition: GameDefinition = {
  id: 'memory-grid',
  type: 'memory',
  skill: 'memory',
  difficulties: [
    { difficulty: 'easy' },
    { difficulty: 'medium' },
    { difficulty: 'hard' },
    { difficulty: 'expert' },
  ],
  generator: memoryGridGenerator,
  validator: setEqualityValidator,
};
