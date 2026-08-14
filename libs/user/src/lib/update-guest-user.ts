import { User } from '@cerebro-play/shared-models';
import { userStore } from './user-store';

export type GuestUserUpdates = Partial<
  Pick<
    User,
    | 'role'
    | 'skills'
    | 'trainingTimeMinutes'
    | 'displayName'
    | 'xp'
    | 'level'
    | 'streak'
    | 'lastPlayedDate'
    | 'achievementIds'
  >
>;

export async function updateGuestUser(userId: string, updates: GuestUserUpdates): Promise<User> {
  const existing = await userStore.get(userId);
  if (!existing) {
    throw new Error(`No guest user found with id "${userId}"`);
  }

  const updated: User = { ...existing, ...updates };
  await userStore.put(updated);
  return updated;
}
