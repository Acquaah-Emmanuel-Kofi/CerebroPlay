import { GameResult, User } from '@cerebro-play/shared-models';
import { checkNewAchievements } from './achievement-catalog';

function user(achievementIds: string[] = []): User {
  return {
    id: 'u1',
    isGuest: true,
    skills: [],
    xp: 0,
    level: 1,
    streak: 0,
    achievementIds,
    createdAt: new Date().toISOString(),
  };
}

function result(overrides: Partial<GameResult> = {}): GameResult {
  return {
    sessionId: 's1',
    score: 1000,
    accuracy: 90,
    speed: 90,
    difficulty: 'easy',
    skill: 'memory',
    completed: true,
    ...overrides,
  };
}

describe('checkNewAchievements', () => {
  it('awards First Challenge when history has exactly one entry', () => {
    const latest = result();
    const earned = checkNewAchievements({ user: user(), latestResult: latest, history: [latest], streak: 1 });
    expect(earned.map((a) => a.id)).toContain('first-challenge');
  });

  it('does not award First Challenge on a later game', () => {
    const latest = result();
    const earned = checkNewAchievements({
      user: user(),
      latestResult: latest,
      history: [result(), latest],
      streak: 1,
    });
    expect(earned.map((a) => a.id)).not.toContain('first-challenge');
  });

  it('awards 7-Day Streak once the streak reaches 7, and never again', () => {
    const latest = result();
    const earnedFirstTime = checkNewAchievements({ user: user(), latestResult: latest, history: [latest], streak: 7 });
    expect(earnedFirstTime.map((a) => a.id)).toContain('seven-day-streak');

    const earnedAgain = checkNewAchievements({
      user: user(['seven-day-streak']),
      latestResult: latest,
      history: [latest],
      streak: 8,
    });
    expect(earnedAgain.map((a) => a.id)).not.toContain('seven-day-streak');
  });

  it('awards Perfect Round only when accuracy is 100', () => {
    const perfect = result({ accuracy: 100 });
    const earned = checkNewAchievements({ user: user(), latestResult: perfect, history: [perfect], streak: 1 });
    expect(earned.map((a) => a.id)).toContain('perfect-round');

    const imperfect = result({ accuracy: 90 });
    const notEarned = checkNewAchievements({ user: user(), latestResult: imperfect, history: [imperfect], streak: 1 });
    expect(notEarned.map((a) => a.id)).not.toContain('perfect-round');
  });

  it('awards 100 Games once history reaches 100 entries', () => {
    const latest = result();
    const history = Array.from({ length: 100 }, () => result());
    const earned = checkNewAchievements({ user: user(), latestResult: latest, history, streak: 1 });
    expect(earned.map((a) => a.id)).toContain('hundred-games');
  });
});
