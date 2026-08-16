import { calculateGameResult, CalculateGameResultInput } from '@cerebro-play/scoring';
import {
  applyGameResultToUser,
  calculateLevel,
  DAILY_CHALLENGE_BONUS_XP,
  getDailyChallengeGames,
  getTodaysCompletedGameIds,
  isDailyChallengeNewlyComplete,
  toDateOnly,
} from '@cerebro-play/progression';
import { gameCatalog } from '@cerebro-play/games';
import { Achievement, GameResult, User } from '@cerebro-play/shared-models';
import { updateGuestUser } from '@cerebro-play/user';
import { gameResultsStore } from './game-results-store';

export interface CompleteGameSessionResult {
  gameResult: GameResult;
  updatedUser: User;
  xpAwarded: number;
  leveledUp: boolean;
  newAchievements: Achievement[];
  isPersonalBest: boolean;
  dailyChallengeCompletedNow: boolean;
  dailyChallengeBonusXp: number;
}

export async function completeGameSession(
  scoringInput: CalculateGameResultInput,
  user: User,
): Promise<CompleteGameSessionResult> {
  const previousHistory = await gameResultsStore.getAll();
  const gameResult = calculateGameResult(scoringInput);
  gameResult.completedAt = new Date().toISOString();
  // Achievement checks (e.g. history.length === 1 for "first challenge") expect history to
  // already include the result being scored, so include it here rather than after persisting.
  const historyIncludingCurrent = [...previousHistory, gameResult];

  const { user: updatedUser, xpAwarded, newAchievements, isPersonalBest } = applyGameResultToUser({
    user,
    result: gameResult,
    history: historyIncludingCurrent,
  });

  const today = toDateOnly(new Date());
  const challengeGames = getDailyChallengeGames({
    games: gameCatalog,
    skills: user.skills,
    history: historyIncludingCurrent,
    today,
  });
  const todaysCompletedGameIds = getTodaysCompletedGameIds(historyIncludingCurrent, today);
  const dailyChallengeCompletedNow = isDailyChallengeNewlyComplete({
    challengeGameIds: challengeGames.map((game) => game.id),
    todaysCompletedGameIds,
    dailyChallengeCompletedDate: user.dailyChallengeCompletedDate,
    today,
  });
  const dailyChallengeBonusXp = dailyChallengeCompletedNow ? DAILY_CHALLENGE_BONUS_XP : 0;

  const finalXp = updatedUser.xp + dailyChallengeBonusXp;
  const previousLevel = calculateLevel(user.xp).level;
  const leveledUp = calculateLevel(finalXp).level > previousLevel;

  const finalUser: User = {
    ...updatedUser,
    xp: finalXp,
    level: calculateLevel(finalXp).level,
    dailyChallengeCompletedDate: dailyChallengeCompletedNow ? today : updatedUser.dailyChallengeCompletedDate,
  };

  const enrichedResult: GameResult = { ...gameResult, xpAwarded };
  await gameResultsStore.put(enrichedResult);

  await updateGuestUser(user.id, {
    xp: finalUser.xp,
    level: finalUser.level,
    streak: finalUser.streak,
    lastPlayedDate: finalUser.lastPlayedDate,
    achievementIds: finalUser.achievementIds,
    dailyChallengeCompletedDate: finalUser.dailyChallengeCompletedDate,
  });

  return {
    gameResult: enrichedResult,
    updatedUser: finalUser,
    xpAwarded,
    leveledUp,
    newAchievements,
    isPersonalBest,
    dailyChallengeCompletedNow,
    dailyChallengeBonusXp,
  };
}
