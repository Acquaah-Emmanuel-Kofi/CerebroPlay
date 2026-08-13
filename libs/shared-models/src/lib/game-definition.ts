import { CognitiveSkill, Difficulty, GameType, RoleTheme } from './enums.js';
import { GameResult } from './entities.js';

export interface DifficultyConfig {
  difficulty: Difficulty;
  params?: Record<string, unknown>;
}

export interface GameGenerationContext {
  difficulty: Difficulty;
  roleTheme?: RoleTheme;
}

export interface GameContent {
  prompt?: string;
  data: unknown;
  correctAnswer: unknown;
}

export interface GameContentGenerator {
  generate(context: GameGenerationContext): GameContent;
}

export interface AnswerValidator {
  validate(content: GameContent, submittedAnswer: unknown): boolean;
}

export interface GameAttempt {
  sessionId: string;
  content: GameContent;
  submittedAnswer: unknown;
  isCorrect: boolean;
  presentedAt: string;
  answeredAt?: string;
  responseTimeMs?: number;
}

export interface GameDefinition {
  id: string;
  type: GameType;
  skill: CognitiveSkill;
  difficulties: DifficultyConfig[];
  generator: GameContentGenerator;
  validator: AnswerValidator;
  roleThemes?: RoleTheme[];
}

export interface DifficultyContext {
  userId: string;
  skill: CognitiveSkill;
  recentResults: GameResult[];
}

export interface DifficultyEngine {
  recommend(context: DifficultyContext): Difficulty;
}
