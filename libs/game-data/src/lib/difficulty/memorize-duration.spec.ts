import { difficultyToMemorizeDurationMs } from './memorize-duration';

describe('difficultyToMemorizeDurationMs', () => {
  it('scales down as difficulty increases (less time to memorize)', () => {
    expect(difficultyToMemorizeDurationMs('easy')).toBeGreaterThan(difficultyToMemorizeDurationMs('medium'));
    expect(difficultyToMemorizeDurationMs('medium')).toBeGreaterThan(difficultyToMemorizeDurationMs('hard'));
    expect(difficultyToMemorizeDurationMs('hard')).toBeGreaterThan(difficultyToMemorizeDurationMs('expert'));
  });
});
