import { CognitiveSkill, Game, GameResult } from '@cerebro-play/shared-models';
import { BrainProfile, calculateBrainProfile } from './calculate-brain-profile';
import { toDateOnly } from './update-streak';

export const DAILY_CHALLENGE_SIZE = 5;
export const DAILY_CHALLENGE_BONUS_XP = 30;

export interface SelectDailyChallengeInput {
  games: Game[];
  skills: CognitiveSkill[];
  brainProfile: BrainProfile;
}

export function selectDailyChallengeGames({ games, skills, brainProfile }: SelectDailyChallengeInput): Game[] {
  const preferredSkills = new Set(skills);

  const ranked = [...games].sort((a, b) => {
    const aPreferred = preferredSkills.has(a.skill);
    const bPreferred = preferredSkills.has(b.skill);
    if (aPreferred !== bPreferred) {
      return aPreferred ? -1 : 1;
    }
    const aScore = brainProfile[a.skill] ?? 0;
    const bScore = brainProfile[b.skill] ?? 0;
    return aScore - bScore;
  });

  return ranked.slice(0, DAILY_CHALLENGE_SIZE);
}

export interface GetDailyChallengeGamesInput {
  games: Game[];
  skills: CognitiveSkill[];
  history: GameResult[];
  today: string;
}

/**
 * Selects today's 5 using performance from *before* today, not live data — otherwise a
 * game's own score (once played) could shift the ranking and knock it back out of "today's
 * 5" later the same day, or pull in a still-unplayed game mid-session.
 */
export function getDailyChallengeGames({ games, skills, history, today }: GetDailyChallengeGamesInput): Game[] {
  const priorHistory = history.filter(
    (result) => !result.completedAt || toDateOnly(new Date(result.completedAt)) !== today,
  );
  const brainProfile = calculateBrainProfile(priorHistory);
  return selectDailyChallengeGames({ games, skills, brainProfile });
}

export function getTodaysCompletedGameIds(history: GameResult[], today: string): Set<string> {
  const completed = new Set<string>();
  for (const result of history) {
    if (!result.gameId || !result.completedAt) {
      continue;
    }
    if (toDateOnly(new Date(result.completedAt)) === today) {
      completed.add(result.gameId);
    }
  }
  return completed;
}

export interface DailyChallengeBonusInput {
  challengeGameIds: string[];
  todaysCompletedGameIds: Set<string>;
  dailyChallengeCompletedDate: string | undefined;
  today: string;
}

export function isDailyChallengeNewlyComplete({
  challengeGameIds,
  todaysCompletedGameIds,
  dailyChallengeCompletedDate,
  today,
}: DailyChallengeBonusInput): boolean {
  if (dailyChallengeCompletedDate === today) {
    return false;
  }
  return challengeGameIds.every((gameId) => todaysCompletedGameIds.has(gameId));
}
