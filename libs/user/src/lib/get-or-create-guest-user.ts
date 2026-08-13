import { User } from '@cerebro-play/shared-models';
import { userStore } from './user-store';

function createGuestUser(): User {
  return {
    id: crypto.randomUUID(),
    isGuest: true,
    skills: [],
    xp: 0,
    level: 1,
    createdAt: new Date().toISOString(),
  };
}

export async function getOrCreateGuestUser(): Promise<User> {
  const existingUsers = await userStore.getAll();
  if (existingUsers.length > 0) {
    return existingUsers[0];
  }

  const guestUser = createGuestUser();
  await userStore.put(guestUser);
  return guestUser;
}
