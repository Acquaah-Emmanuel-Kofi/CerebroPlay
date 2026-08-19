import { generateOddOneOut } from '@cerebro-play/game-data';
import { GameContent, GameContentGenerator, GameGenerationContext } from '@cerebro-play/shared-models';

export const oddOneOutGenerator: GameContentGenerator = {
  generate(context: GameGenerationContext): GameContent {
    return generateOddOneOut(context.difficulty);
  },
};
