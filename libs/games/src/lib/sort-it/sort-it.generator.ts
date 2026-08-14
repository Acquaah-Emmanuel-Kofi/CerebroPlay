import { generateSortIt } from '@cerebro-play/game-data';
import { GameContent, GameContentGenerator, GameGenerationContext } from '@cerebro-play/shared-models';

export const sortItGenerator: GameContentGenerator = {
  generate(context: GameGenerationContext): GameContent {
    return generateSortIt(context.difficulty);
  },
};
