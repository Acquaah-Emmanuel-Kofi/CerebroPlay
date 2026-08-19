import { generateWordScramble } from '@cerebro-play/game-data';
import { GameContent, GameContentGenerator, GameGenerationContext } from '@cerebro-play/shared-models';

export const wordScrambleGenerator: GameContentGenerator = {
  generate(context: GameGenerationContext): GameContent {
    return generateWordScramble(context.difficulty);
  },
};
