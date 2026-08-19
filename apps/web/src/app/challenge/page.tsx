'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { gameCatalog } from '@cerebro-play/games';
import {
  DAILY_CHALLENGE_BONUS_XP,
  getDailyChallengeGames,
  getTodaysCompletedGameIds,
  toDateOnly,
} from '@cerebro-play/progression';
import { getOrCreateGuestUser } from '@cerebro-play/user';
import { GameResult, User } from '@cerebro-play/shared-models';
import { AppShell } from '@/components/app-shell';
import { gameResultsStore } from '@/lib/game-results-store';

const GAME_ICONS: Record<string, string> = {
  'rapid-recall': 'memory',
  'pattern-breaker': 'psychology',
  'memory-grid': 'grid_view',
  'spot-the-difference': 'compare',
  'sort-it': 'sync_alt',
  focus: 'center_focus_strong',
  'mental-math-sprint': 'calculate',
  'odd-one-out': 'search',
  'verbal-analogies': 'translate',
  'matrix-reasoning': 'grid_on',
  'word-scramble': 'abc',
  'zip-path': 'polyline',
};

export default function ChallengePage() {
  const [user, setUser] = useState<User | null>(null);
  const [history, setHistory] = useState<GameResult[]>([]);

  useEffect(() => {
    getOrCreateGuestUser().then(setUser).catch(console.error);
    gameResultsStore.getAll().then(setHistory).catch(console.error);
  }, []);

  const today = toDateOnly(new Date());
  const challengeGames = getDailyChallengeGames({
    games: gameCatalog,
    skills: user?.skills ?? [],
    history,
    today,
  });
  const todaysCompletedGameIds = getTodaysCompletedGameIds(history, today);
  const completedCount = challengeGames.filter((game) => todaysCompletedGameIds.has(game.id)).length;
  const allComplete = challengeGames.length > 0 && completedCount === challengeGames.length;
  const progressFraction = challengeGames.length === 0 ? 0 : completedCount / challengeGames.length;

  return (
    <AppShell streak={user?.streak}>
      <main className="w-full max-w-content mx-auto px-margin-mobile pt-sm md:pt-lg pb-lg flex flex-col gap-lg">
        <section>
          <h1 className="font-display text-headline-md text-on-surface">Today&apos;s 5</h1>
          <p className="font-body text-body-md text-on-surface-variant mt-xs">
            {completedCount}/{challengeGames.length} complete today
          </p>
          <div className="mt-sm w-full bg-surface-container-highest rounded-full h-3 overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all duration-700"
              style={{ width: `${progressFraction * 100}%` }}
            />
          </div>
        </section>

        {allComplete && (
          <section className="bg-secondary-container text-on-secondary-container rounded-[24px] p-md flex items-center gap-md shadow-[0_12px_32px_rgba(65,42,231,0.08)]">
            <span aria-hidden="true" className="material-symbols-outlined filled text-3xl">
              emoji_events
            </span>
            <div>
              <h2 className="font-display text-headline-sm">Today&apos;s 5 complete!</h2>
              <p className="font-label-md text-label-md">You earned a +{DAILY_CHALLENGE_BONUS_XP} XP daily bonus.</p>
            </div>
          </section>
        )}

        <section className="flex flex-col gap-sm">
          {challengeGames.map((game) => {
            const isDone = todaysCompletedGameIds.has(game.id);
            return (
              <Link
                key={game.id}
                href={`/games/${game.id}`}
                className="bg-surface-container-lowest rounded-xl p-md shadow-[0_4px_16px_rgba(65,42,231,0.06)] flex items-center justify-between active:scale-[0.98] transition-all"
              >
                <div className="flex items-center gap-md">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isDone ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-primary'
                    }`}
                  >
                    <span aria-hidden="true" className="material-symbols-outlined text-[28px]">
                      {isDone ? 'check' : (GAME_ICONS[game.id] ?? 'extension')}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display text-headline-sm text-on-surface leading-tight">{game.name}</h3>
                    <p className="font-label-md text-label-md text-on-surface-variant capitalize">{game.skill}</p>
                  </div>
                </div>
                <span className="font-label-bold text-label-bold text-primary">{isDone ? 'Replay' : 'Play'}</span>
              </Link>
            );
          })}
        </section>
      </main>
    </AppShell>
  );
}
