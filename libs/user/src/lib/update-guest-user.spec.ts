import 'fake-indexeddb/auto';
import { getOrCreateGuestUser } from './get-or-create-guest-user';
import { updateGuestUser } from './update-guest-user';

describe('updateGuestUser', () => {
  it('persists updates without clobbering previously-set fields', async () => {
    const user = await getOrCreateGuestUser();

    await updateGuestUser(user.id, { role: 'software' });
    let refetched = await getOrCreateGuestUser();
    expect(refetched.role).toBe('software');

    await updateGuestUser(user.id, { skills: ['memory', 'logic'] });
    refetched = await getOrCreateGuestUser();
    expect(refetched.role).toBe('software');
    expect(refetched.skills).toEqual(['memory', 'logic']);
  });

  it('rejects for an unknown userId', async () => {
    await expect(updateGuestUser('nonexistent-id', { role: 'general' })).rejects.toThrow();
  });
});
