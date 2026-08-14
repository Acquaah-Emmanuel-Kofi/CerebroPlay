import { rapidRecallDefinition } from './rapid-recall/rapid-recall.definition';
import { patternBreakerDefinition } from './pattern-breaker/pattern-breaker.definition';
import { memoryGridDefinition } from './memory-grid/memory-grid.definition';
import { gameCatalog, gameDefinitionsById } from './game-catalog';

describe('gameCatalog', () => {
  it('contains the Rapid Recall, Pattern Breaker, and Memory Grid entries with the right id/type/skill', () => {
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
});
