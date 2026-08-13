import { GameDefinition } from '@cerebro-play/shared-models';
import { rapidRecallGenerator } from './rapid-recall.generator';
import { rapidRecallValidator } from './rapid-recall.validator';

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
  validator: rapidRecallValidator,
  roleThemes: ['general', 'software', 'design', 'finance', 'marketing'],
};
