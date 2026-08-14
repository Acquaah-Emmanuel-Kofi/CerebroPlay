import { GameResult } from '@cerebro-play/shared-models';
import { calculateBrainProfile } from './calculate-brain-profile';

function result(skill: GameResult['skill'], score: number): GameResult {
  return { sessionId: 's1', score, accuracy: 90, speed: 90, difficulty: 'easy', skill, completed: true };
}

describe('calculateBrainProfile', () => {
  it('returns an empty profile for no history', () => {
    expect(calculateBrainProfile([])).toEqual({});
  });

  it('averages scores per skill', () => {
    const profile = calculateBrainProfile([result('memory', 1000), result('memory', 500), result('logic', 800)]);
    expect(profile.memory).toBe(750);
    expect(profile.logic).toBe(800);
  });

  it('only includes skills that were actually played', () => {
    const profile = calculateBrainProfile([result('memory', 1000)]);
    expect(profile.logic).toBeUndefined();
  });
});
