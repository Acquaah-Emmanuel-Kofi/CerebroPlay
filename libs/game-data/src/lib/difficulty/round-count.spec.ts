import { difficultyToRoundCount } from './round-count';

describe('difficultyToRoundCount', () => {
  it('scales up as difficulty increases', () => {
    expect(difficultyToRoundCount('easy')).toBeLessThan(difficultyToRoundCount('medium'));
    expect(difficultyToRoundCount('medium')).toBeLessThan(difficultyToRoundCount('hard'));
    expect(difficultyToRoundCount('hard')).toBeLessThan(difficultyToRoundCount('expert'));
  });
});
