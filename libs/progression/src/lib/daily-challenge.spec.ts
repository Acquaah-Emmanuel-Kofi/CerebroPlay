import { Game, GameResult } from '@cerebro-play/shared-models';
import {
  DAILY_CHALLENGE_SIZE,
  getDailyChallengeGames,
  getTodaysCompletedGameIds,
  isDailyChallengeNewlyComplete,
  selectDailyChallengeGames,
} from './daily-challenge';

function game(id: string, skill: Game['skill']): Game {
  return { id, name: id, type: 'memory', skill };
}

const GAMES: Game[] = [
  game('rapid-recall', 'memory'),
  game('memory-grid', 'memory'),
  game('pattern-breaker', 'logic'),
  game('spot-the-difference', 'visual'),
  game('sort-it', 'flexibility'),
  game('focus', 'focus'),
];

function result(overrides: Partial<GameResult> = {}): GameResult {
  return {
    sessionId: 's1',
    gameId: 'rapid-recall',
    score: 1000,
    accuracy: 100,
    speed: 100,
    difficulty: 'easy',
    skill: 'memory',
    completed: true,
    completedAt: '2026-08-14T12:00:00.000Z',
    ...overrides,
  };
}

describe('selectDailyChallengeGames', () => {
  it('caps the selection at DAILY_CHALLENGE_SIZE', () => {
    const selected = selectDailyChallengeGames({ games: GAMES, skills: [], brainProfile: {} });
    expect(selected.length).toBe(DAILY_CHALLENGE_SIZE);
  });

  it('prioritizes games matching the user preferred skills', () => {
    const selected = selectDailyChallengeGames({ games: GAMES, skills: ['focus'], brainProfile: {} });
    expect(selected[0].skill).toBe('focus');
  });

  it('within preferred skills, ranks the weakest brain-profile score first', () => {
    const selected = selectDailyChallengeGames({
      games: GAMES,
      skills: ['memory', 'logic'],
      brainProfile: { memory: 90, logic: 20 },
    });
    expect(selected[0].skill).toBe('logic');
    expect(selected[1].skill).toBe('memory');
  });
});

describe('getDailyChallengeGames', () => {
  it('stays stable across the day even as today\'s own results change the live brain profile', () => {
    // memory and logic are both preferred and both unplayed (score 0) at the start of the day.
    const skills: Game['skill'][] = ['memory', 'logic'];
    const beforePlaying = getDailyChallengeGames({ games: GAMES, skills, history: [], today: '2026-08-14' });

    // Now the player finishes a memory game today, scoring high enough to outrank logic
    // if the (buggy) live brain profile were used for ranking.
    const historyAfterOneGame = [
      result({ gameId: 'rapid-recall', skill: 'memory', score: 5000, completedAt: '2026-08-14T09:00:00.000Z' }),
    ];
    const afterPlaying = getDailyChallengeGames({
      games: GAMES,
      skills,
      history: historyAfterOneGame,
      today: '2026-08-14',
    });

    expect(afterPlaying.map((game) => game.id)).toEqual(beforePlaying.map((game) => game.id));
  });

  it("does let yesterday's results inform today's selection", () => {
    const skills: Game['skill'][] = ['memory', 'logic'];
    const history = [
      result({ gameId: 'rapid-recall', skill: 'memory', score: 9000, completedAt: '2026-08-13T09:00:00.000Z' }),
    ];
    const selected = getDailyChallengeGames({ games: GAMES, skills, history, today: '2026-08-14' });

    // logic (score 0) should now rank ahead of memory (yesterday's strong score).
    expect(selected[0].skill).toBe('logic');
  });
});

describe('getTodaysCompletedGameIds', () => {
  it('only counts results completed on the given date', () => {
    const history = [
      result({ gameId: 'rapid-recall', completedAt: '2026-08-14T09:00:00.000Z' }),
      result({ gameId: 'sort-it', completedAt: '2026-08-13T09:00:00.000Z' }),
    ];
    expect(getTodaysCompletedGameIds(history, '2026-08-14')).toEqual(new Set(['rapid-recall']));
  });

  it('ignores results missing a gameId or completedAt (pre-existing local records)', () => {
    const history = [result({ gameId: undefined }), result({ completedAt: undefined })];
    expect(getTodaysCompletedGameIds(history, '2026-08-14')).toEqual(new Set());
  });
});

describe('isDailyChallengeNewlyComplete', () => {
  it('is true when every challenge game is completed today and not already claimed', () => {
    expect(
      isDailyChallengeNewlyComplete({
        challengeGameIds: ['a', 'b'],
        todaysCompletedGameIds: new Set(['a', 'b']),
        dailyChallengeCompletedDate: undefined,
        today: '2026-08-14',
      }),
    ).toBe(true);
  });

  it('is false when some challenge games are still incomplete', () => {
    expect(
      isDailyChallengeNewlyComplete({
        challengeGameIds: ['a', 'b'],
        todaysCompletedGameIds: new Set(['a']),
        dailyChallengeCompletedDate: undefined,
        today: '2026-08-14',
      }),
    ).toBe(false);
  });

  it('is false when the bonus was already claimed today (no double-award on replay)', () => {
    expect(
      isDailyChallengeNewlyComplete({
        challengeGameIds: ['a', 'b'],
        todaysCompletedGameIds: new Set(['a', 'b']),
        dailyChallengeCompletedDate: '2026-08-14',
        today: '2026-08-14',
      }),
    ).toBe(false);
  });
});
