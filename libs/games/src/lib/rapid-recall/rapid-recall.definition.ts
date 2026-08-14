import { GameDefinition } from '@cerebro-play/shared-models';
import { equalityValidator } from '../equality-validator';
import { rapidRecallGenerator } from './rapid-recall.generator';

export const rapidRecallDefinition: GameDefinition = {
  id: 'rapid-recall',
  type: 'memory',
  skill: 'memory',
  difficulties: [
    { difficulty: 'easy' },
    { difficulty: 'medium' },
    { difficulty: 'hard' },
    { difficulty: 'expert' },
  ],
  generator: rapidRecallGenerator,
  validator: equalityValidator,
  roleThemes: ['general', 'software', 'design', 'finance', 'marketing'],
};
