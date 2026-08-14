import { generatePatternBreaker } from '@cerebro-play/game-data';
import { GameContent, GameContentGenerator, GameGenerationContext } from '@cerebro-play/shared-models';

export const patternBreakerGenerator: GameContentGenerator = {
  generate(context: GameGenerationContext): GameContent {
    return generatePatternBreaker(context.difficulty);
  },
};
