import { generateSpotTheDifference } from '@cerebro-play/game-data';
import { GameContent, GameContentGenerator, GameGenerationContext } from '@cerebro-play/shared-models';

export const spotTheDifferenceGenerator: GameContentGenerator = {
  generate(context: GameGenerationContext): GameContent {
    return generateSpotTheDifference(context.difficulty);
  },
};
