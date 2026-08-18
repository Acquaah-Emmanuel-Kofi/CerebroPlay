'use client';

import { useEffect, useState } from 'react';
import { difficultyEngine } from '@cerebro-play/progression';
import { CognitiveSkill, Difficulty } from '@cerebro-play/shared-models';
import { gameResultsStore } from './game-results-store';

/** Recommends a starting difficulty from the player's history for this skill (see difficultyEngine). */
export function useDifficultyRecommendation(userId: string | undefined, skill: CognitiveSkill): Difficulty | null {
  const [recommended, setRecommended] = useState<Difficulty | null>(null);

  useEffect(() => {
    if (!userId) return;
    gameResultsStore
      .getAll()
      .then((history) => {
        setRecommended(difficultyEngine.recommend({ userId, skill, recentResults: history }));
      })
      .catch(console.error);
  }, [userId, skill]);

  return recommended;
}
