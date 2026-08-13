'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { gameCatalog } from '@cerebro-play/games';
import { getOrCreateGuestUser } from '@cerebro-play/user';
import { GameResult, User } from '@cerebro-play/shared-models';
import { gameResultsStore } from '@/lib/game-results-store';
import styles from './page.module.scss';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [history, setHistory] = useState<GameResult[]>([]);

  useEffect(() => {
    getOrCreateGuestUser().then(setUser).catch(console.error);
    gameResultsStore.getAll().then(setHistory).catch(console.error);
  }, []);

  return (
    <main className={styles.page}>
      <h1 className={styles.greeting}>{getGreeting()} 👋</h1>
      <p className={styles.tagline}>Train the skills you use every day.</p>
      <p className={styles.player}>Guest Player: {user?.id ?? 'loading...'}</p>

      <h2 className={styles.sectionTitle}>Available Games</h2>
      <div className={styles.gameGrid}>
        {gameCatalog.map((game) => (
          <Link key={game.id} href={`/games/${game.id}`} className={styles.gameCard}>
            <div className={styles.gameCardName}>{game.name}</div>
            <div className={styles.gameCardSkill}>{game.skill}</div>
          </Link>
        ))}
      </div>

      <h2 className={styles.sectionTitle}>History</h2>
      {history.length === 0 ? (
        <p className={styles.emptyState}>No games played yet — pick one above to get started.</p>
      ) : (
        <ul className={styles.historyList}>
          {history.map((entry) => (
            <li key={entry.sessionId} className={styles.historyItem}>
              <span>{entry.sessionId}</span>
              <span>{entry.score} pts</span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
