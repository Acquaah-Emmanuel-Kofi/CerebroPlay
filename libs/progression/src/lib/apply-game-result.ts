import { Achievement, GameResult, User } from '@cerebro-play/shared-models';
import { calculateXpAward } from './calculate-xp-award';
import { calculateLevel } from './levels';
import { updateStreak } from './update-streak';
import { checkNewAchievements } from './achievement-catalog';

export interface ApplyGameResultInput {
  user: User;
  result: GameResult;
  history: GameResult[];
}

export interface ApplyGameResultOutput {
  user: User;
  xpAwarded: number;
  leveledUp: boolean;
  newAchievements: Achievement[];
  isPersonalBest: boolean;
}

function isPersonalBest(result: GameResult, history: GameResult[]): boolean {
  const previousBest = history
    .filter((entry) => entry.skill === result.skill && entry.sessionId !== result.sessionId)
    .reduce((max, entry) => Math.max(max, entry.score), 0);
  return result.score > previousBest;
}

export function applyGameResultToUser({ user, result, history }: ApplyGameResultInput): ApplyGameResultOutput {
  const personalBest = isPersonalBest(result, history);
  const xpAwarded = calculateXpAward({ result, isPersonalBest: personalBest });
  const newXp = user.xp + xpAwarded;

  const previousLevel = calculateLevel(user.xp).level;
  const newLevelInfo = calculateLevel(newXp);
  const leveledUp = newLevelInfo.level > previousLevel;

  const { streak, lastPlayedDate } = updateStreak(user.streak, user.lastPlayedDate);

  const newAchievements = checkNewAchievements({ user, latestResult: result, history, streak });

  const updatedUser: User = {
    ...user,
    xp: newXp,
    level: newLevelInfo.level,
    streak,
    lastPlayedDate,
    achievementIds: [...user.achievementIds, ...newAchievements.map((achievement) => achievement.id)],
  };

  return { user: updatedUser, xpAwarded, leveledUp, newAchievements, isPersonalBest: personalBest };
}
