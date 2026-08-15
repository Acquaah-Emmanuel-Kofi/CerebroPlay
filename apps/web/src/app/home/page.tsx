'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { gameCatalog } from '@cerebro-play/games';
import { calculateBrainProfile, calculateLevel, LEVELS } from '@cerebro-play/progression';
import { getOrCreateGuestUser } from '@cerebro-play/user';
import { CognitiveSkill, Game, GameResult, User } from '@cerebro-play/shared-models';
import { AppShell } from '@/components/app-shell';
import { gameResultsStore } from '@/lib/game-results-store';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function pickRecommendedGame(brainProfile: Partial<Record<CognitiveSkill, number>>): Game {
  const entries = Object.entries(brainProfile) as [CognitiveSkill, number][];
  if (entries.length === 0) return gameCatalog[0];

  const weakestSkill = entries.reduce((weakest, entry) => (entry[1] < weakest[1] ? entry : weakest))[0];
  return gameCatalog.find((game) => game.skill === weakestSkill) ?? gameCatalog[0];
}

function levelProgress(xp: number): { fraction: number; nextLevelXp: number | null } {
  const currentLevel = calculateLevel(xp);
  const currentIndex = LEVELS.findIndex((level) => level.level === currentLevel.level);
  const nextLevel = LEVELS[currentIndex + 1];
  if (!nextLevel) return { fraction: 1, nextLevelXp: null };

  const fraction = (xp - currentLevel.minXp) / (nextLevel.minXp - currentLevel.minXp);
  return { fraction: Math.max(0, Math.min(1, fraction)), nextLevelXp: nextLevel.minXp };
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [history, setHistory] = useState<GameResult[]>([]);

  useEffect(() => {
    getOrCreateGuestUser().then(setUser).catch(console.error);
    gameResultsStore.getAll().then(setHistory).catch(console.error);
  }, []);

  const brainProfile = calculateBrainProfile(history);
  const brainProfileEntries = Object.entries(brainProfile) as [CognitiveSkill, number][];
  const recommendedGame = pickRecommendedGame(brainProfile);
  const strongestEntry = brainProfileEntries.length
    ? brainProfileEntries.reduce((strongest, entry) => (entry[1] > strongest[1] ? entry : strongest))
    : null;

  const level = user ? calculateLevel(user.xp) : null;
  const progress = user ? levelProgress(user.xp) : null;

  return (
    <AppShell streak={user?.streak}>
      <main className="w-full max-w-content mx-auto px-margin-mobile pt-sm md:pt-lg pb-lg flex flex-col gap-lg">
        <section className="flex justify-between items-end mt-md md:mt-0">
          <div>
            <h1 className="font-display text-display-lg-mobile md:text-display-lg text-on-surface mb-xs">
              {getGreeting()} 👋
            </h1>
            <p className="font-body text-body-md text-on-surface-variant">Train the skills you use every day.</p>
          </div>
          {typeof user?.streak === 'number' && (
            <div className="hidden md:flex items-center gap-xs bg-secondary-fixed/20 px-md py-sm rounded-full">
              <span aria-hidden="true" className="material-symbols-outlined filled text-secondary-container text-2xl">
                local_fire_department
              </span>
              <span className="font-display text-headline-sm text-secondary-container font-bold">
                {user.streak} Day Streak
              </span>
            </div>
          )}
        </section>

        <section className="bg-surface-container-lowest rounded-[24px] p-md md:p-lg shadow-[0_12px_32px_rgba(65,42,231,0.08)] relative overflow-hidden">
          <div className="relative z-10 flex flex-col gap-md">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-display text-headline-md text-on-surface">Recommended Next</h2>
                <p className="font-body text-body-md text-on-surface-variant mt-xs">
                  {brainProfileEntries.length === 0 ? 'Start with your first game' : `Sharpen your ${recommendedGame.skill}`}
                </p>
              </div>
              <span className="bg-primary-container/10 text-primary px-sm py-xs rounded-full font-label-bold text-label-bold">
                {recommendedGame.name}
              </span>
            </div>
            <Link
              href={`/games/${recommendedGame.id}`}
              className="w-full h-14 bg-primary text-on-primary rounded-full font-label-bold text-label-bold flex items-center justify-center gap-sm active:scale-[0.98] transition-all duration-200 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30"
            >
              Start Training <span aria-hidden="true" className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-md">
          <div className="bg-surface-container-lowest rounded-[24px] p-md shadow-[0_12px_32px_rgba(65,42,231,0.08)] flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <h3 className="font-display text-headline-sm text-on-surface">XP</h3>
              <div className="bg-surface-container-high p-xs rounded-full">
                <span aria-hidden="true" className="material-symbols-outlined text-primary text-xl">monitoring</span>
              </div>
            </div>
            <div className="mt-md flex items-baseline gap-sm">
              <span className="font-display text-display-lg-mobile text-primary">{user?.xp ?? 0}</span>
            </div>
            <div className="mt-md w-full bg-surface-container-highest rounded-full h-3 overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-700"
                style={{ width: `${(progress?.fraction ?? 0) * 100}%` }}
              />
            </div>
            <p className="font-label-md text-label-md text-on-surface-variant mt-sm text-right">
              Level {level?.level ?? 1} — {level?.name ?? 'Curious'}
            </p>
          </div>

          <Link
            href="/profile"
            className="bg-primary-container rounded-[24px] p-md shadow-[0_12px_32px_rgba(65,42,231,0.08)] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-xs mb-sm">
                <span aria-hidden="true" className="material-symbols-outlined filled text-secondary-fixed text-xl">workspace_premium</span>
                <span className="font-label-bold text-label-bold text-secondary-fixed uppercase tracking-wider text-xs">
                  {strongestEntry ? 'Strongest Skill' : 'Brain Profile'}
                </span>
              </div>
              <h4 className={`font-display text-headline-sm text-on-primary-container ${strongestEntry ? 'capitalize' : ''}`}>
                {strongestEntry ? strongestEntry[0] : 'Play a game to begin'}
              </h4>
            </div>
            <div className="mt-lg bg-surface/10 rounded-xl p-sm border border-surface/20 flex items-center justify-between">
              <p className="font-label-bold text-label-bold text-on-primary-container">View full profile</p>
              <span aria-hidden="true" className="material-symbols-outlined text-on-primary-container bg-surface/20 p-xs rounded-full">
                arrow_forward
              </span>
            </div>
          </Link>
        </section>
      </main>
    </AppShell>
  );
}
