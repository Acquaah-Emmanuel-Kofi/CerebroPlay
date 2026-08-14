import { CognitiveSkill, GameResult } from '@cerebro-play/shared-models';

export type BrainProfile = Partial<Record<CognitiveSkill, number>>;

export function calculateBrainProfile(history: GameResult[]): BrainProfile {
  const scoresBySkill = new Map<CognitiveSkill, number[]>();

  for (const result of history) {
    const scores = scoresBySkill.get(result.skill) ?? [];
    scores.push(result.score);
    scoresBySkill.set(result.skill, scores);
  }

  const profile: BrainProfile = {};
  for (const [skill, scores] of scoresBySkill) {
    profile[skill] = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  }

  return profile;
}
