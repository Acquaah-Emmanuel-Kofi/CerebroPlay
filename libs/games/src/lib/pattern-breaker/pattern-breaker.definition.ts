import { GameDefinition } from '@cerebro-play/shared-models';
import { equalityValidator } from '../equality-validator';
import { patternBreakerGenerator } from './pattern-breaker.generator';

export const patternBreakerDefinition: GameDefinition = {
  id: 'pattern-breaker',
  type: 'pattern',
  skill: 'logic',
  difficulties: [
    { difficulty: 'easy' },
    { difficulty: 'medium' },
    { difficulty: 'hard' },
    { difficulty: 'expert' },
  ],
  generator: patternBreakerGenerator,
  validator: equalityValidator,
};
