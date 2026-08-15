'use client';

import { useEffect, useState } from 'react';
import { gameCatalog } from '@cerebro-play/games';
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
};

const DISABLED_TABS = ['Global', 'Profession', 'Country', 'Weekly'];

export default function LeaderboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [history, setHistory] = useState<GameResult[]>([]);

  useEffect(() => {
    getOrCreateGuestUser().then(setUser).catch(console.error);
    gameResultsStore.getAll().then(setHistory).catch(console.error);
  }, []);

  const personalBests = gameCatalog
    .map((game) => {
      const results = history.filter((entry) => entry.gameId === game.id);
      const bestScore = results.reduce((max, entry) => Math.max(max, entry.score), 0);
      return { game, bestScore, hasPlayed: results.length > 0 };
    })
    .sort((a, b) => b.bestScore - a.bestScore);

  const totalScore = personalBests.reduce((sum, entry) => sum + entry.bestScore, 0);

  return (
    <AppShell streak={user?.streak}>
      <main className="w-full max-w-content mx-auto px-margin-mobile pt-sm md:pt-lg pb-lg flex flex-col gap-lg">
        <section>
          <h1 className="font-display text-headline-md text-on-surface mb-md">Leaderboard</h1>
          <div className="flex gap-sm overflow-x-auto pb-xs">
            {DISABLED_TABS.map((tab) => (
              <span
                key={tab}
                title="Available once accounts launch"
                className="bg-surface-container text-outline-variant px-md py-sm rounded-full font-label-md text-label-md whitespace-nowrap flex items-center gap-1 cursor-default"
              >
                <span aria-hidden="true" className="material-symbols-outlined text-[16px]">lock</span>
                {tab}
              </span>
            ))}
          </div>
        </section>

        <section className="bg-primary-container text-on-primary-container rounded-xl p-md flex items-center justify-between shadow-[0_12px_32px_rgba(65,42,231,0.2)]">
          <div className="flex items-center gap-md">
            <div className="w-12 h-12 rounded-full bg-surface/20 flex items-center justify-center">
              <span aria-hidden="true" className="material-symbols-outlined filled">person</span>
            </div>
            <div>
              <div className="font-label-bold text-label-bold">You</div>
              <div className="font-label-md text-label-md text-primary-fixed opacity-90">Guest Player</div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-display text-headline-sm">{totalScore}</div>
            <div className="font-label-md text-label-md text-primary-fixed text-[10px] uppercase tracking-wider">
              Total Best Score
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-base">
          <h2 className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider text-xs px-1">
            Your Personal Bests
          </h2>
          {personalBests.map(({ game, bestScore, hasPlayed }) => (
            <div
              key={game.id}
              className="bg-surface-container-lowest rounded-xl p-sm flex items-center justify-between shadow-[0_4px_16px_rgba(65,42,231,0.06)]"
            >
              <div className="flex items-center gap-md">
                <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center">
                  <span aria-hidden="true" className="material-symbols-outlined text-primary text-[20px]">
                    {GAME_ICONS[game.id] ?? 'extension'}
                  </span>
                </div>
                <div>
                  <div className="font-label-bold text-label-bold text-on-surface">{game.name}</div>
                  <div className="font-label-md text-label-md text-on-surface-variant text-xs capitalize">
                    {game.skill}
                  </div>
                </div>
              </div>
              <div className="font-display text-headline-sm text-on-surface">
                {hasPlayed ? bestScore : '—'}
              </div>
            </div>
          ))}
        </section>
      </main>
    </AppShell>
  );
}
