import { createIndexedDbStore } from '@cerebro-play/shared-utils';
import { User } from '@cerebro-play/shared-models';

export const userStore = createIndexedDbStore<User>({
  dbName: 'cerebro-play-user',
  storeName: 'users',
  keyPath: 'id',
});
