export interface LevelInfo {
  level: number;
  name: string;
  minXp: number;
}

export const LEVELS: LevelInfo[] = [
  { level: 1, name: 'Curious', minXp: 0 },
  { level: 2, name: 'Explorer', minXp: 500 },
  { level: 3, name: 'Challenger', minXp: 1500 },
  { level: 4, name: 'Strategist', minXp: 3000 },
  { level: 5, name: 'Master', minXp: 5000 },
];

export function calculateLevel(xp: number): LevelInfo {
  let current = LEVELS[0];
  for (const level of LEVELS) {
    if (xp >= level.minXp) {
      current = level;
    }
  }
  return current;
}
