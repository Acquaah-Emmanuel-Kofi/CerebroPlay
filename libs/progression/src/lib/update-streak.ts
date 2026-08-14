const MS_PER_DAY = 24 * 60 * 60 * 1000;

function toDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export interface UpdatedStreak {
  streak: number;
  lastPlayedDate: string;
}

export function updateStreak(currentStreak: number, lastPlayedDate: string | undefined, now: Date = new Date()): UpdatedStreak {
  const today = toDateOnly(now);

  if (lastPlayedDate === today) {
    return { streak: currentStreak, lastPlayedDate: today };
  }

  const yesterday = toDateOnly(new Date(now.getTime() - MS_PER_DAY));
  const streak = lastPlayedDate === yesterday ? currentStreak + 1 : 1;

  return { streak, lastPlayedDate: today };
}
