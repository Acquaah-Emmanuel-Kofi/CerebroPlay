import { rapidRecallDefinition } from './rapid-recall/rapid-recall.definition';
import { patternBreakerDefinition } from './pattern-breaker/pattern-breaker.definition';
import { memoryGridDefinition } from './memory-grid/memory-grid.definition';
import { spotTheDifferenceDefinition } from './spot-the-difference/spot-the-difference.definition';
import { sortItDefinition } from './sort-it/sort-it.definition';
import { focusDefinition } from './focus/focus.definition';
import { mentalMathSprintDefinition } from './mental-math-sprint/mental-math-sprint.definition';
import { oddOneOutDefinition } from './odd-one-out/odd-one-out.definition';
import { verbalAnalogiesDefinition } from './verbal-analogies/verbal-analogies.definition';
import { gameCatalog, gameDefinitionsById } from './game-catalog';

describe('gameCatalog', () => {
  it('contains every game with the right id/type/skill', () => {
    expect(gameCatalog).toEqual([
      {
        id: 'rapid-recall',
        name: 'Rapid Recall',
        type: rapidRecallDefinition.type,
        skill: rapidRecallDefinition.skill,
      },
      {
        id: 'pattern-breaker',
        name: 'Pattern Breaker',
        type: patternBreakerDefinition.type,
        skill: patternBreakerDefinition.skill,
      },
      {
        id: 'memory-grid',
        name: 'Memory Grid',
        type: memoryGridDefinition.type,
        skill: memoryGridDefinition.skill,
      },
      {
        id: 'spot-the-difference',
        name: 'Spot the Difference',
        type: spotTheDifferenceDefinition.type,
        skill: spotTheDifferenceDefinition.skill,
      },
      {
        id: 'sort-it',
        name: 'Sort It',
        type: sortItDefinition.type,
        skill: sortItDefinition.skill,
      },
      {
        id: 'focus',
        name: 'Focus',
        type: focusDefinition.type,
        skill: focusDefinition.skill,
      },
      {
        id: 'mental-math-sprint',
        name: 'Mental Math Sprint',
        type: mentalMathSprintDefinition.type,
        skill: mentalMathSprintDefinition.skill,
      },
      {
        id: 'odd-one-out',
        name: 'Odd One Out',
        type: oddOneOutDefinition.type,
        skill: oddOneOutDefinition.skill,
      },
      {
        id: 'verbal-analogies',
        name: 'Verbal Analogies',
        type: verbalAnalogiesDefinition.type,
        skill: verbalAnalogiesDefinition.skill,
      },
    ]);
  });
});

describe('gameDefinitionsById', () => {
  it('maps rapid-recall to the same rapidRecallDefinition object', () => {
    expect(gameDefinitionsById['rapid-recall']).toBe(rapidRecallDefinition);
  });

  it('maps pattern-breaker to the same patternBreakerDefinition object', () => {
    expect(gameDefinitionsById['pattern-breaker']).toBe(patternBreakerDefinition);
  });

  it('maps memory-grid to the same memoryGridDefinition object', () => {
    expect(gameDefinitionsById['memory-grid']).toBe(memoryGridDefinition);
  });

  it('maps spot-the-difference to the same spotTheDifferenceDefinition object', () => {
    expect(gameDefinitionsById['spot-the-difference']).toBe(spotTheDifferenceDefinition);
  });

  it('maps sort-it to the same sortItDefinition object', () => {
    expect(gameDefinitionsById['sort-it']).toBe(sortItDefinition);
  });

  it('maps focus to the same focusDefinition object', () => {
    expect(gameDefinitionsById['focus']).toBe(focusDefinition);
  });

  it('maps mental-math-sprint to the same mentalMathSprintDefinition object', () => {
    expect(gameDefinitionsById['mental-math-sprint']).toBe(mentalMathSprintDefinition);
  });

  it('maps odd-one-out to the same oddOneOutDefinition object', () => {
    expect(gameDefinitionsById['odd-one-out']).toBe(oddOneOutDefinition);
  });

  it('maps verbal-analogies to the same verbalAnalogiesDefinition object', () => {
    expect(gameDefinitionsById['verbal-analogies']).toBe(verbalAnalogiesDefinition);
  });
});
