import { Game, GameDefinition } from '@cerebro-play/shared-models';
import { rapidRecallDefinition } from './rapid-recall/rapid-recall.definition';
import { patternBreakerDefinition } from './pattern-breaker/pattern-breaker.definition';
import { memoryGridDefinition } from './memory-grid/memory-grid.definition';

export const gameCatalog: Game[] = [
  {
    id: rapidRecallDefinition.id,
    name: 'Rapid Recall',
    type: rapidRecallDefinition.type,
    skill: rapidRecallDefinition.skill,
  },
  {
    id: patternBreakerDefinition.id,
    name: 'Pattern Breaker',
    type: patternBreakerDefinition.type,
    skill: patternBreakerDefinition.skill,
  },
  {
    id: memoryGridDefinition.id,
    name: 'Memory Grid',
    type: memoryGridDefinition.type,
    skill: memoryGridDefinition.skill,
  },
];

export const gameDefinitionsById: Record<string, GameDefinition> = {
  [rapidRecallDefinition.id]: rapidRecallDefinition,
  [patternBreakerDefinition.id]: patternBreakerDefinition,
  [memoryGridDefinition.id]: memoryGridDefinition,
};
