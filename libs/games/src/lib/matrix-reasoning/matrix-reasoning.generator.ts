import { generateMatrixReasoning } from '@cerebro-play/game-data';
import { GameContent, GameContentGenerator } from '@cerebro-play/shared-models';

export const matrixReasoningGenerator: GameContentGenerator = {
  generate(): GameContent {
    return generateMatrixReasoning();
  },
};
