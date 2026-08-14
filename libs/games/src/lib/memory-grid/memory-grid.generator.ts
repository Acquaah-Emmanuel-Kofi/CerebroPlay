import { generateMemoryGrid } from '@cerebro-play/game-data';
import { GameContent, GameContentGenerator, GameGenerationContext } from '@cerebro-play/shared-models';

export const memoryGridGenerator: GameContentGenerator = {
  generate(context: GameGenerationContext): GameContent {
    return generateMemoryGrid(context.difficulty);
  },
};
