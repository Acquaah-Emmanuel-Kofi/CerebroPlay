import { updateStreak } from './update-streak';

const NOW = new Date('2026-08-14T12:00:00.000Z');

describe('updateStreak', () => {
  it('starts a streak of 1 on the very first play', () => {
    expect(updateStreak(0, undefined, NOW)).toEqual({ streak: 1, lastPlayedDate: '2026-08-14' });
  });

  it('leaves the streak unchanged if already played today', () => {
    expect(updateStreak(5, '2026-08-14', NOW)).toEqual({ streak: 5, lastPlayedDate: '2026-08-14' });
  });

  it('increments the streak when the last play was yesterday', () => {
    expect(updateStreak(5, '2026-08-13', NOW)).toEqual({ streak: 6, lastPlayedDate: '2026-08-14' });
  });

  it('resets to 1 when a day was missed', () => {
    expect(updateStreak(5, '2026-08-10', NOW)).toEqual({ streak: 1, lastPlayedDate: '2026-08-14' });
  });
});
