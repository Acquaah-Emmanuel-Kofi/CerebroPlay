import 'fake-indexeddb/auto';
import { getOrCreateGuestUser } from './get-or-create-guest-user';

describe('getOrCreateGuestUser', () => {
  it('creates a new guest user with sane defaults', async () => {
    const user = await getOrCreateGuestUser();

    expect(user.isGuest).toBe(true);
    expect(user.xp).toBe(0);
    expect(user.level).toBe(1);
    expect(user.skills).toEqual([]);
    expect(typeof user.id).toBe('string');
    expect(user.id.length).toBeGreaterThan(0);
  });

  it('returns the same user on a second call instead of creating a duplicate', async () => {
    const first = await getOrCreateGuestUser();
    const second = await getOrCreateGuestUser();

    expect(second.id).toBe(first.id);
  });
});
