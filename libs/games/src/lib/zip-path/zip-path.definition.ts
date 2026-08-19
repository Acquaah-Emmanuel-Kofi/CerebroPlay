import { GameDefinition } from '@cerebro-play/shared-models';
import { zipPathValidator } from '../zip-path-validator';
import { zipPathGenerator } from './zip-path.generator';

export const zipPathDefinition: GameDefinition = {
  id: 'zip-path',
  type: 'sequence',
  skill: 'problemSolving',
  difficulties: [
    { difficulty: 'easy' },
    { difficulty: 'medium' },
    { difficulty: 'hard' },
    { difficulty: 'expert' },
  ],
  generator: zipPathGenerator,
  validator: zipPathValidator,
};
