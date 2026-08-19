import { difficultyToTimeLimitMs } from './time-limit';

describe('difficultyToTimeLimitMs', () => {
  it('scales down as difficulty increases (less time to react)', () => {
    expect(difficultyToTimeLimitMs('easy')).toBeGreaterThan(difficultyToTimeLimitMs('medium'));
    expect(difficultyToTimeLimitMs('medium')).toBeGreaterThan(difficultyToTimeLimitMs('hard'));
    expect(difficultyToTimeLimitMs('hard')).toBeGreaterThan(difficultyToTimeLimitMs('expert'));
  });
});
