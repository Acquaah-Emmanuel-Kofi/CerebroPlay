import { generateZipPath } from '@cerebro-play/game-data';
import { GameContent, GameContentGenerator, GameGenerationContext } from '@cerebro-play/shared-models';

export const zipPathGenerator: GameContentGenerator = {
  generate(context: GameGenerationContext): GameContent {
    return generateZipPath(context.difficulty);
  },
};
