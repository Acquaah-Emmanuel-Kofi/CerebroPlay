import { createIndexedDbStore } from '@cerebro-play/shared-utils';
import { GameResult } from '@cerebro-play/shared-models';

export const gameResultsStore = createIndexedDbStore<GameResult>({
  dbName: 'cerebro-play-game-results',
  storeName: 'results',
  keyPath: 'sessionId',
});
