'use client';

import { useEffect, useState } from 'react';
import { gameCatalog } from '@cerebro-play/games';
import { achievementCatalog, calculateBrainProfile, calculateLevel } from '@cerebro-play/progression';
import { getOrCreateGuestUser } from '@cerebro-play/user';
import { CognitiveSkill, GameResult, User } from '@cerebro-play/shared-models';
import { AppShell } from '@/components/app-shell';
import { RadarChart } from '@/components/radar-chart';
import { AccountModal } from '@/components/account-modal';
import { gameResultsStore } from '@/lib/game-results-store';

const SKILL_LABELS: Record<CognitiveSkill, string> = {
  memory: 'Memory',
  speed: 'Speed',
  focus: 'Focus',
  logic: 'Logic',
  visual: 'Visual',
  numerical: 'Numerical',
  flexibility: 'Flexibility',
  problemSolving: 'Problem Solving',
};

const ALL_SKILLS = Object.keys(SKILL_LABELS) as CognitiveSkill[];

const ACHIEVEMENT_ICONS: Record<string, string> = {
  'first-challenge': 'flag',
  'seven-day-streak': 'local_fire_department',
  'perfect-round': 'workspace_premium',
  'hundred-games': 'military_tech',
};

const RECENT_GAMES_LIMIT = 5;

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [history, setHistory] = useState<GameResult[]>([]);
  const [accountModalOpen, setAccountModalOpen] = useState(false);

  useEffect(() => {
    getOrCreateGuestUser().then(setUser).catch(console.error);
    gameResultsStore.getAll().then(setHistory).catch(console.error);
  }, []);

  const brainProfile = calculateBrainProfile(history);
  const radarAxes = ALL_SKILLS.map((skill) => ({ label: SKILL_LABELS[skill], value: brainProfile[skill] ?? 0 }));

  const brainProfileEntries = Object.entries(brainProfile) as [CognitiveSkill, number][];
  const strongest = brainProfileEntries.length
    ? brainProfileEntries.reduce((best, entry) => (entry[1] > best[1] ? entry : best))
    : null;
  const focusArea = brainProfileEntries.length
    ? brainProfileEntries.reduce((worst, entry) => (entry[1] < worst[1] ? entry : worst))
    : null;

  const level = user ? calculateLevel(user.xp) : null;

  const recentGames = [...history]
    .sort((a, b) => (b.sessionId > a.sessionId ? 1 : -1))
    .slice(0, RECENT_GAMES_LIMIT);

  return (
    <AppShell streak={user?.streak}>
      <main className="w-full max-w-content mx-auto px-margin-mobile pt-sm md:pt-lg pb-lg flex flex-col gap-lg">
        <section className="flex items-center gap-md">
          <div className="w-16 h-16 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center">
            <span aria-hidden="true" className="material-symbols-outlined filled text-3xl">person</span>
          </div>
          <div>
            <h1 className="font-display text-headline-md text-on-surface">Guest Player</h1>
            <p className="font-label-md text-label-md text-on-surface-variant capitalize">
              {user?.role ?? 'General'} · Level {level?.level ?? 1} — {level?.name ?? 'Curious'}
            </p>
          </div>
        </section>

        <section className="bg-surface-container-lowest rounded-[24px] p-md shadow-[0_12px_32px_rgba(65,42,231,0.08)] flex flex-col items-center gap-sm">
          <h2 className="font-display text-headline-sm text-on-surface self-start">Brain Profile</h2>
          <RadarChart axes={radarAxes} size={260} />
          {brainProfileEntries.length === 0 && (
            <p className="font-label-md text-label-md text-on-surface-variant text-center">
              Play a game to start building your Brain Profile.
            </p>
          )}
          {brainProfileEntries.length > 0 && brainProfileEntries.length < ALL_SKILLS.length && (
            <p className="font-label-md text-label-md text-on-surface-variant text-center">
              Your profile fills in as you train more skills.
            </p>
          )}
        </section>

        {(strongest || focusArea) && (
          <section className="grid grid-cols-2 gap-md">
            <div className="bg-surface-container-lowest rounded-xl p-md shadow-[0_4px_16px_rgba(65,42,231,0.06)]">
              <h3 className="font-label-bold text-label-bold text-on-surface-variant text-xs uppercase tracking-wider">
                Strongest
              </h3>
              <p className="font-display text-headline-sm text-on-surface mt-xs">
                {strongest ? SKILL_LABELS[strongest[0]] : '—'}
              </p>
            </div>
            <div className="bg-surface-container-lowest rounded-xl p-md shadow-[0_4px_16px_rgba(65,42,231,0.06)]">
              <h3 className="font-label-bold text-label-bold text-on-surface-variant text-xs uppercase tracking-wider">
                Focus Area
              </h3>
              <p className="font-display text-headline-sm text-on-surface mt-xs">
                {focusArea ? SKILL_LABELS[focusArea[0]] : '—'}
              </p>
            </div>
          </section>
        )}

        <section className="flex flex-col gap-sm">
          <h2 className="font-display text-headline-sm text-on-surface">Achievements</h2>
          <div className="grid grid-cols-2 gap-sm">
            {achievementCatalog.map((achievement) => {
              const earned = user?.achievementIds.includes(achievement.id) ?? false;
              return (
                <div
                  key={achievement.id}
                  title={achievement.description}
                  className={`rounded-xl p-sm flex flex-col items-center text-center gap-xs ${
                    earned ? 'bg-secondary-fixed/30' : 'bg-surface-container opacity-50'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`material-symbols-outlined text-2xl ${earned ? 'filled text-secondary' : 'text-outline-variant'}`}
                  >
                    {ACHIEVEMENT_ICONS[achievement.id] ?? 'emoji_events'}
                  </span>
                  <span className="font-label-bold text-label-bold text-on-surface">{achievement.name}</span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="flex flex-col gap-sm">
          <h2 className="font-display text-headline-sm text-on-surface">Recent Games</h2>
          {recentGames.length === 0 ? (
            <p className="font-label-md text-label-md text-on-surface-variant">No games played yet.</p>
          ) : (
            <ul className="flex flex-col gap-base">
              {recentGames.map((entry) => {
                const game = gameCatalog.find((g) => g.id === entry.gameId);
                return (
                  <li
                    key={entry.sessionId}
                    className="bg-surface-container-lowest rounded-xl p-sm flex items-center justify-between shadow-[0_2px_8px_rgba(65,42,231,0.02)]"
                  >
                    <span className="font-label-bold text-label-bold text-on-surface">
                      {game?.name ?? `${SKILL_LABELS[entry.skill]} game`}
                    </span>
                    <span className="font-body text-body-md text-on-surface-variant">{entry.score} pts</span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <button
          type="button"
          onClick={() => setAccountModalOpen(true)}
          className="w-full h-14 bg-primary/10 text-primary rounded-full font-label-bold text-label-bold"
        >
          Create Account
        </button>
      </main>

      <AccountModal open={accountModalOpen} onClose={() => setAccountModalOpen(false)} />
    </AppShell>
  );
}
