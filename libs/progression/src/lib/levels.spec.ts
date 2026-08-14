import { calculateLevel } from './levels';

describe('calculateLevel', () => {
  it('returns Level 1 Curious at 0 XP', () => {
    expect(calculateLevel(0)).toEqual({ level: 1, name: 'Curious', minXp: 0 });
  });

  it('returns Level 2 Explorer at exactly the 500 XP threshold', () => {
    expect(calculateLevel(500).level).toBe(2);
  });

  it('stays at Level 1 just below the next threshold', () => {
    expect(calculateLevel(499).level).toBe(1);
  });

  it('returns Level 4 Strategist at 4999 XP', () => {
    expect(calculateLevel(4999).level).toBe(4);
  });

  it('returns Level 5 Master at and above 5000 XP', () => {
    expect(calculateLevel(5000).level).toBe(5);
    expect(calculateLevel(50000).level).toBe(5);
  });
});
