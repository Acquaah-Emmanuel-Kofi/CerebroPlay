import {
  generateDesignVerbalAnalogies,
  generateFinanceVerbalAnalogies,
  generateGeneralVerbalAnalogies,
  generateMarketingVerbalAnalogies,
  generateSoftwareVerbalAnalogies,
} from '@cerebro-play/game-data';
import { GameContent, GameContentGenerator, GameGenerationContext, RoleTheme } from '@cerebro-play/shared-models';

const GENERATORS_BY_ROLE: Record<RoleTheme, () => GameContent> = {
  general: generateGeneralVerbalAnalogies,
  software: generateSoftwareVerbalAnalogies,
  design: generateDesignVerbalAnalogies,
  finance: generateFinanceVerbalAnalogies,
  marketing: generateMarketingVerbalAnalogies,
};

export const verbalAnalogiesGenerator: GameContentGenerator = {
  generate(context: GameGenerationContext): GameContent {
    const roleTheme = context.roleTheme ?? 'general';
    return GENERATORS_BY_ROLE[roleTheme]();
  },
};
