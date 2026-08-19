import { generateJigsaw } from '@cerebro-play/game-data';
import { GameContent, GameContentGenerator, GameGenerationContext } from '@cerebro-play/shared-models';

export const jigsawGenerator: GameContentGenerator = {
  generate(context: GameGenerationContext): GameContent {
    return generateJigsaw(context.difficulty);
  },
};
