import { generateBinaryGrid } from '@cerebro-play/game-data';
import { GameContent, GameContentGenerator, GameGenerationContext } from '@cerebro-play/shared-models';

export const binaryGridGenerator: GameContentGenerator = {
  generate(context: GameGenerationContext): GameContent {
    return generateBinaryGrid(context.difficulty);
  },
};
