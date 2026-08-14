import { generateFocus } from '@cerebro-play/game-data';
import { GameContent, GameContentGenerator } from '@cerebro-play/shared-models';

export const focusGenerator: GameContentGenerator = {
  generate(): GameContent {
    return generateFocus();
  },
};
