import { Game, GameDefinition } from '@cerebro-play/shared-models';
import { rapidRecallDefinition } from './rapid-recall/rapid-recall.definition';
import { patternBreakerDefinition } from './pattern-breaker/pattern-breaker.definition';
import { memoryGridDefinition } from './memory-grid/memory-grid.definition';
import { spotTheDifferenceDefinition } from './spot-the-difference/spot-the-difference.definition';
import { sortItDefinition } from './sort-it/sort-it.definition';
import { focusDefinition } from './focus/focus.definition';
import { mentalMathSprintDefinition } from './mental-math-sprint/mental-math-sprint.definition';
import { oddOneOutDefinition } from './odd-one-out/odd-one-out.definition';
import { verbalAnalogiesDefinition } from './verbal-analogies/verbal-analogies.definition';
import { matrixReasoningDefinition } from './matrix-reasoning/matrix-reasoning.definition';
import { wordScrambleDefinition } from './word-scramble/word-scramble.definition';
import { zipPathDefinition } from './zip-path/zip-path.definition';
import { binaryGridDefinition } from './binary-grid/binary-grid.definition';
import { jigsawDefinition } from './jigsaw/jigsaw.definition';

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
  {
    id: verbalAnalogiesDefinition.id,
    name: 'Verbal Analogies',
    type: verbalAnalogiesDefinition.type,
    skill: verbalAnalogiesDefinition.skill,
  },
  {
    id: matrixReasoningDefinition.id,
    name: 'Matrix Reasoning',
    type: matrixReasoningDefinition.type,
    skill: matrixReasoningDefinition.skill,
  },
  {
    id: wordScrambleDefinition.id,
    name: 'Word Scramble',
    type: wordScrambleDefinition.type,
    skill: wordScrambleDefinition.skill,
  },
  {
    id: zipPathDefinition.id,
    name: 'Zip Path',
    type: zipPathDefinition.type,
    skill: zipPathDefinition.skill,
  },
  {
    id: binaryGridDefinition.id,
    name: 'Binary Grid',
    type: binaryGridDefinition.type,
    skill: binaryGridDefinition.skill,
  },
  {
    id: jigsawDefinition.id,
    name: 'Jigsaw',
    type: jigsawDefinition.type,
    skill: jigsawDefinition.skill,
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
  [verbalAnalogiesDefinition.id]: verbalAnalogiesDefinition,
  [matrixReasoningDefinition.id]: matrixReasoningDefinition,
  [wordScrambleDefinition.id]: wordScrambleDefinition,
  [zipPathDefinition.id]: zipPathDefinition,
  [binaryGridDefinition.id]: binaryGridDefinition,
  [jigsawDefinition.id]: jigsawDefinition,
};
