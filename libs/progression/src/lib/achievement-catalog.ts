import { Achievement, GameResult, User } from '@cerebro-play/shared-models';

export const achievementCatalog: Achievement[] = [
  { id: 'first-challenge', name: 'First Challenge', description: 'Complete your first game.' },
  { id: 'seven-day-streak', name: '7-Day Streak', description: 'Play 7 days in a row.' },
  { id: 'perfect-round', name: 'Perfect Round', description: 'Score 100% accuracy in a round.' },
  { id: 'hundred-games', name: '100 Games', description: 'Complete 100 games.' },
];

export interface CheckNewAchievementsInput {
  user: User;
  latestResult: GameResult;
  history: GameResult[];
  streak: number;
}

export function checkNewAchievements({ user, latestResult, history, streak }: CheckNewAchievementsInput): Achievement[] {
  const alreadyEarned = new Set(user.achievementIds);
  const newlyEarned: Achievement[] = [];

  function award(id: string) {
    if (alreadyEarned.has(id)) {
      return;
    }
    const achievement = achievementCatalog.find((candidate) => candidate.id === id);
    if (achievement) {
      newlyEarned.push(achievement);
    }
  }

  if (history.length === 1) {
    award('first-challenge');
  }
  if (streak >= 7) {
    award('seven-day-streak');
  }
  if (latestResult.accuracy === 100) {
    award('perfect-round');
  }
  if (history.length >= 100) {
    award('hundred-games');
  }

  return newlyEarned;
}
