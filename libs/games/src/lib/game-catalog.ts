import { Game, GameDefinition } from '@cerebro-play/shared-models';
import { rapidRecallDefinition } from './rapid-recall/rapid-recall.definition';
import { patternBreakerDefinition } from './pattern-breaker/pattern-breaker.definition';
import { memoryGridDefinition } from './memory-grid/memory-grid.definition';
import { spotTheDifferenceDefinition } from './spot-the-difference/spot-the-difference.definition';
import { sortItDefinition } from './sort-it/sort-it.definition';
import { focusDefinition } from './focus/focus.definition';
import { mentalMathSprintDefinition } from './mental-math-sprint/mental-math-sprint.definition';
import { oddOneOutDefinition } from './odd-one-out/odd-one-out.definition';

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
  {
    id: spotTheDifferenceDefinition.id,
    name: 'Spot the Difference',
    type: spotTheDifferenceDefinition.type,
    skill: spotTheDifferenceDefinition.skill,
  },
  {
    id: sortItDefinition.id,
    name: 'Sort It',
    type: sortItDefinition.type,
    skill: sortItDefinition.skill,
  },
  {
    id: focusDefinition.id,
    name: 'Focus',
    type: focusDefinition.type,
    skill: focusDefinition.skill,
  },
  {
    id: mentalMathSprintDefinition.id,
    name: 'Mental Math Sprint',
    type: mentalMathSprintDefinition.type,
    skill: mentalMathSprintDefinition.skill,
  },
  {
    id: oddOneOutDefinition.id,
    name: 'Odd One Out',
    type: oddOneOutDefinition.type,
    skill: oddOneOutDefinition.skill,
  },
];

export const gameDefinitionsById: Record<string, GameDefinition> = {
  [rapidRecallDefinition.id]: rapidRecallDefinition,
  [patternBreakerDefinition.id]: patternBreakerDefinition,
  [memoryGridDefinition.id]: memoryGridDefinition,
  [spotTheDifferenceDefinition.id]: spotTheDifferenceDefinition,
  [sortItDefinition.id]: sortItDefinition,
  [focusDefinition.id]: focusDefinition,
  [mentalMathSprintDefinition.id]: mentalMathSprintDefinition,
  [oddOneOutDefinition.id]: oddOneOutDefinition,
};
