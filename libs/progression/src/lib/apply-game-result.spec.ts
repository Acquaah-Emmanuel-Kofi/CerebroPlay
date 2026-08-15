import { GameResult, User } from '@cerebro-play/shared-models';
import { applyGameResultToUser } from './apply-game-result';

function user(overrides: Partial<User> = {}): User {
  return {
    id: 'u1',
    isGuest: true,
    skills: [],
    xp: 0,
    level: 1,
    streak: 0,
    achievementIds: [],
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

function result(overrides: Partial<GameResult> = {}): GameResult {
  return {
    sessionId: 's1',
    score: 1000,
    accuracy: 100,
    speed: 100,
    difficulty: 'easy',
    skill: 'memory',
    completed: true,
    ...overrides,
  };
}

describe('applyGameResultToUser', () => {
  it('awards XP, starts a streak, and grants First Challenge + Perfect Round on a first, perfect game', () => {
    const latest = result();
    const output = applyGameResultToUser({ user: user(), result: latest, history: [latest] });

    expect(output.xpAwarded).toBe(150); // 100 base + 50 personal-best (first result for the skill)
    expect(output.isPersonalBest).toBe(true);
    expect(output.user.xp).toBe(150);
    expect(output.user.streak).toBe(1);
    expect(output.user.achievementIds.sort()).toEqual(['first-challenge', 'perfect-round']);
    expect(output.newAchievements.map((a) => a.id).sort()).toEqual(['first-challenge', 'perfect-round']);
  });

  it('detects a level-up when XP crosses a threshold', () => {
    const existingUser = user({ xp: 490 });
    const latest = result({ score: 1000, sessionId: 's2' }); // +100 xp -> 590, crosses the 500 threshold into Level 2
    const output = applyGameResultToUser({
      user: existingUser,
      result: latest,
      history: [result({ score: 400, sessionId: 's1' }), latest],
    });

    expect(output.leveledUp).toBe(true);
    expect(output.user.level).toBe(2);
  });

  it('does not re-award an already-earned achievement', () => {
    const existingUser = user({ achievementIds: ['first-challenge'] });
    const latest = result({ accuracy: 90, sessionId: 's2' });
    const output = applyGameResultToUser({
      user: existingUser,
      result: latest,
      history: [result({ sessionId: 's1' }), latest],
    });

    expect(output.newAchievements.map((a) => a.id)).not.toContain('first-challenge');
  });
});
