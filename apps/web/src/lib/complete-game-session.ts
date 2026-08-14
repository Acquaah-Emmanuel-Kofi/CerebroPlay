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
}

export async function completeGameSession(
  scoringInput: CalculateGameResultInput,
  user: User,
): Promise<CompleteGameSessionResult> {
  const gameResult = calculateGameResult(scoringInput);
  await gameResultsStore.put(gameResult);
  const history = await gameResultsStore.getAll();

  const { user: updatedUser, xpAwarded, leveledUp, newAchievements } = applyGameResultToUser({
    user,
    result: gameResult,
    history,
  });

  await updateGuestUser(user.id, {
    xp: updatedUser.xp,
    level: updatedUser.level,
    streak: updatedUser.streak,
    lastPlayedDate: updatedUser.lastPlayedDate,
    achievementIds: updatedUser.achievementIds,
  });

  return { gameResult, updatedUser, xpAwarded, leveledUp, newAchievements };
}
