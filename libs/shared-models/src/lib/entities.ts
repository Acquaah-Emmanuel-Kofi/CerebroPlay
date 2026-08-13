import { CognitiveSkill, Difficulty, GameType, LeaderboardScope, RoleTheme } from './enums.js';

export interface User {
  id: string;
  isGuest: boolean;
  displayName?: string;
  role?: RoleTheme;
  skills: CognitiveSkill[];
  trainingTimeMinutes?: number;
  xp: number;
  level: number;
  createdAt: string;
}

export interface Role {
  id: string;
  theme: RoleTheme;
  label: string;
}

export interface Skill {
  id: string;
  name: CognitiveSkill;
  label: string;
}

export interface Game {
  id: string;
  name: string;
  type: GameType;
  skill: CognitiveSkill;
}

export interface GameSession {
  id: string;
  userId: string;
  gameId: string;
  difficulty: Difficulty;
  startedAt: string;
  completedAt?: string;
}

export interface GameResult {
  sessionId: string;
  score: number;
  accuracy: number;
  speed: number;
  difficulty: Difficulty;
  skill: CognitiveSkill;
  completed: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
}

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  score: number;
  rank: number;
}

export interface Leaderboard {
  id: string;
  scope: LeaderboardScope;
  entries: LeaderboardEntry[];
}

export interface DailyChallenge {
  id: string;
  date: string;
  gameIds: string[];
}
