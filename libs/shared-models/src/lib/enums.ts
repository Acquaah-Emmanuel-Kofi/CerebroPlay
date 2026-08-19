export type GameType =
  | 'memory'
  | 'pattern'
  | 'reaction'
  | 'classification'
  | 'visual'
  | 'logic'
  | 'numerical'
  | 'sequence'
  | 'attention';

export type CognitiveSkill =
  | 'memory'
  | 'speed'
  | 'focus'
  | 'logic'
  | 'visual'
  | 'numerical'
  | 'flexibility'
  | 'problemSolving'
  | 'verbal';

export type RoleTheme = 'general' | 'software' | 'design' | 'finance' | 'marketing';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export type LeaderboardScope = 'global' | 'profession' | 'country' | 'weekly';
