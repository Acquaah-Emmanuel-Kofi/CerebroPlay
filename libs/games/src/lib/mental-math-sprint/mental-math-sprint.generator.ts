import { generateMentalMathSprint } from '@cerebro-play/game-data';
import { GameContent, GameContentGenerator, GameGenerationContext } from '@cerebro-play/shared-models';

export const mentalMathSprintGenerator: GameContentGenerator = {
  generate(context: GameGenerationContext): GameContent {
    return generateMentalMathSprint(context.difficulty);
  },
};
