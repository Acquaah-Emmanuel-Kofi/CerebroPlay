import { difficultyToCount } from './count';

describe('difficultyToCount', () => {
  it('scales up as difficulty increases', () => {
    expect(difficultyToCount('easy')).toBeLessThan(difficultyToCount('medium'));
    expect(difficultyToCount('medium')).toBeLessThan(difficultyToCount('hard'));
    expect(difficultyToCount('hard')).toBeLessThan(difficultyToCount('expert'));
  });
});
