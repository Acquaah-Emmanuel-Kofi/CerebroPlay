import { rapidRecallDefinition } from './rapid-recall/rapid-recall.definition';
import { patternBreakerDefinition } from './pattern-breaker/pattern-breaker.definition';
import { gameCatalog, gameDefinitionsById } from './game-catalog';

describe('gameCatalog', () => {
  it('contains the Rapid Recall and Pattern Breaker entries with the right id/type/skill', () => {
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
});
