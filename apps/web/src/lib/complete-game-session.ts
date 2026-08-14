import { calculateGameResult, CalculateGameResultInput } from '@cerebro-play/scoring';
import { applyGameResultToUser } from '@cerebro-play/progression';
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
}

export async function completeGameSession(
  scoringInput: CalculateGameResultInput,
  user: User,
): Promise<CompleteGameSessionResult> {
  const history = await gameResultsStore.getAll();
  const gameResult = calculateGameResult(scoringInput);

  const { user: updatedUser, xpAwarded, leveledUp, newAchievements, isPersonalBest } = applyGameResultToUser({
    user,
    result: gameResult,
    history,
  });

  const enrichedResult: GameResult = { ...gameResult, xpAwarded };
  await gameResultsStore.put(enrichedResult);

  await updateGuestUser(user.id, {
    xp: updatedUser.xp,
    level: updatedUser.level,
    streak: updatedUser.streak,
    lastPlayedDate: updatedUser.lastPlayedDate,
    achievementIds: updatedUser.achievementIds,
  });

  return { gameResult: enrichedResult, updatedUser, xpAwarded, leveledUp, newAchievements, isPersonalBest };
}
