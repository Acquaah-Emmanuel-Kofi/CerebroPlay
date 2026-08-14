import { GameResult } from '@cerebro-play/shared-models';
import { calculateXpAward } from './calculate-xp-award';

function result(score: number): GameResult {
  return { sessionId: 's1', score, accuracy: 100, speed: 100, difficulty: 'easy', skill: 'memory', completed: true };
}

describe('calculateXpAward', () => {
  it('awards base XP proportional to score, rounded', () => {
    expect(calculateXpAward({ result: result(1000), isPersonalBest: false })).toBe(100);
    expect(calculateXpAward({ result: result(1234), isPersonalBest: false })).toBe(123);
  });

  it('adds a flat personal-best bonus when flagged', () => {
    expect(calculateXpAward({ result: result(1000), isPersonalBest: true })).toBe(150);
  });

  it('does not add the bonus when not a personal best', () => {
    expect(calculateXpAward({ result: result(1000), isPersonalBest: false })).toBe(100);
  });
});
