import { CognitiveSkill, Difficulty, GameAttempt, GameResult } from '@cerebro-play/shared-models';
import { calculateAccuracy } from './accuracy';
import { calculateAverageSpeed } from './speed';
import { calculateScore } from './score';

export interface CalculateGameResultInput {
  sessionId: string;
  skill: CognitiveSkill;
  difficulty: Difficulty;
  attempts: GameAttempt[];
}

export function calculateGameResult(input: CalculateGameResultInput): GameResult {
  const { sessionId, skill, difficulty, attempts } = input;

  return {
    sessionId,
    skill,
    difficulty,
    score: calculateScore(attempts, difficulty),
    accuracy: calculateAccuracy(attempts),
    speed: calculateAverageSpeed(attempts, difficulty),
    completed: true,
  };
}
