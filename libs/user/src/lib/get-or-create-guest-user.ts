import { User } from '@cerebro-play/shared-models';
import { userStore } from './user-store';

function createGuestUser(): User {
  return {
    id: crypto.randomUUID(),
    isGuest: true,
    skills: [],
    xp: 0,
    level: 1,
    streak: 0,
    achievementIds: [],
    createdAt: new Date().toISOString(),
  };
}

function withBackfilledDefaults(user: User): User {
  return {
    ...user,
    streak: user.streak ?? 0,
    achievementIds: user.achievementIds ?? [],
  };
}

export async function getOrCreateGuestUser(): Promise<User> {
  const existingUsers = await userStore.getAll();
  if (existingUsers.length > 0) {
    return withBackfilledDefaults(existingUsers[0]);
  }

  const guestUser = createGuestUser();
  await userStore.put(guestUser);
  return guestUser;
}
