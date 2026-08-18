'use client';

import { useState } from 'react';
import Link from 'next/link';
import { gameCatalog } from '@cerebro-play/games';
import { CognitiveSkill } from '@cerebro-play/shared-models';
import { AppShell } from '@/components/app-shell';

const GAME_ICONS: Record<string, string> = {
  'rapid-recall': 'memory',
  'pattern-breaker': 'psychology',
  'memory-grid': 'grid_view',
  'spot-the-difference': 'compare',
  'sort-it': 'sync_alt',
  focus: 'center_focus_strong',
  'mental-math-sprint': 'calculate',
  'odd-one-out': 'search',
};

const SKILLS_WITH_GAMES = Array.from(new Set(gameCatalog.map((game) => game.skill))) as CognitiveSkill[];

export default function GameLibraryPage() {
  const [filter, setFilter] = useState<CognitiveSkill | 'all'>('all');

  const visibleGames = filter === 'all' ? gameCatalog : gameCatalog.filter((game) => game.skill === filter);

  return (
    <AppShell>
      <main className="w-full max-w-content mx-auto px-margin-mobile pt-sm md:pt-lg pb-lg flex flex-col gap-lg">
        <section>
          <h1 className="font-display text-headline-md text-on-surface">Game Library</h1>
          <p className="font-body text-body-md text-on-surface-variant mt-xs">Choose your cognitive workout.</p>
        </section>

        <section className="w-full -mx-margin-mobile px-margin-mobile overflow-x-auto">
          <div className="flex gap-sm w-max pb-2">
            <FilterChip label="All Games" active={filter === 'all'} onClick={() => setFilter('all')} />
            {SKILLS_WITH_GAMES.map((skill) => (
              <FilterChip
                key={skill}
                label={skill}
                active={filter === skill}
                onClick={() => setFilter(skill)}
                capitalize
              />
            ))}
          </div>
        </section>

        <section className="grid grid-cols-2 gap-gutter">
          {visibleGames.map((game) => (
            <Link
              key={game.id}
              href={`/games/${game.id}`}
              className="bg-surface-container-lowest rounded-xl p-md shadow-[0_4px_16px_rgba(65,42,231,0.06)] active:scale-[0.98] transition-all flex flex-col gap-sm group"
            >
              <div className="bg-surface-container-low w-12 h-12 rounded-xl flex items-center justify-center group-hover:bg-primary-container transition-colors">
                <span aria-hidden="true" className="material-symbols-outlined text-primary text-[28px]">
                  {GAME_ICONS[game.id] ?? 'extension'}
                </span>
              </div>
              <div className="flex flex-col gap-xs mt-2">
                <h3 className="font-display text-headline-sm text-on-surface leading-tight">{game.name}</h3>
                <p className="font-label-md text-label-md text-on-surface-variant capitalize">{game.skill}</p>
              </div>
            </Link>
          ))}
        </section>
      </main>
    </AppShell>
  );
}

function FilterChip({
  label,
  active,
  onClick,
  capitalize,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  capitalize?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-full font-label-md text-label-md whitespace-nowrap active:scale-95 transition-transform ${
        capitalize ? 'capitalize' : ''
      } ${active ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}
    >
      {label}
    </button>
  );
}
