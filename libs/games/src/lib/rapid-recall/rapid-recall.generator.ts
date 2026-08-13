import {
  generateDesignRapidRecall,
  generateFinanceRapidRecall,
  generateGeneralRapidRecall,
  generateMarketingRapidRecall,
  generateSoftwareRapidRecall,
} from '@cerebro-play/game-data';
import { Difficulty, GameContent, GameContentGenerator, GameGenerationContext, RoleTheme } from '@cerebro-play/shared-models';

const GENERATORS_BY_ROLE: Record<RoleTheme, (difficulty: Difficulty) => GameContent> = {
  general: generateGeneralRapidRecall,
  software: generateSoftwareRapidRecall,
  design: generateDesignRapidRecall,
  finance: generateFinanceRapidRecall,
  marketing: generateMarketingRapidRecall,
};

export const rapidRecallGenerator: GameContentGenerator = {
  generate(context: GameGenerationContext): GameContent {
    const roleTheme = context.roleTheme ?? 'general';
    return GENERATORS_BY_ROLE[roleTheme](context.difficulty);
  },
};
