'use client';

import { useEffect, useRef, useState } from 'react';
import { GameEngine } from '@cerebro-play/game-engine';
import { spotTheDifferenceDefinition } from '@cerebro-play/games';
import { calculateLevel } from '@cerebro-play/progression';
import { getOrCreateGuestUser } from '@cerebro-play/user';
import { Achievement, GameAttempt, GameContent, GameResult, User } from '@cerebro-play/shared-models';
import { completeGameSession } from '@/lib/complete-game-session';
import { gameResultsStore } from '@/lib/game-results-store';

const DIFFICULTY = 'easy';

interface SpotTheDifferenceData {
  gridSize: number;
  stateA: string[];
  stateB: string[];
}

type Phase = 'idle' | 'answering' | 'result';

function Grid({
  colors,
  gridSize,
  onCellClick,
  testPrefix,
}: {
  colors: string[];
  gridSize: number;
  onCellClick?: (index: number) => void;
  testPrefix: string;
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${gridSize}, 32px)`,
        gap: 2,
      }}
    >
      {colors.map((color, index) => (
        <div
          key={index}
          data-testid={`${testPrefix}-${index}`}
          onClick={() => onCellClick?.(index)}
          style={{
            width: 32,
            height: 32,
            backgroundColor: color,
            cursor: onCellClick ? 'pointer' : 'default',
          }}
        />
      ))}
    </div>
  );
}

export default function SpotTheDifferenceHarnessPage() {
  const engineRef = useRef<GameEngine | null>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [content, setContent] = useState<GameContent | null>(null);
  const [attempt, setAttempt] = useState<GameAttempt | null>(null);
  const [result, setResult] = useState<GameResult | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [history, setHistory] = useState<GameResult[]>([]);
  const [xpAwarded, setXpAwarded] = useState(0);
  const [leveledUp, setLeveledUp] = useState(false);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    getOrCreateGuestUser().then(setUser).catch(console.error);
    gameResultsStore.getAll().then(setHistory).catch(console.error);
  }, []);

  function start() {
    const sessionId = `session-${Date.now()}`;
    const engine = new GameEngine(spotTheDifferenceDefinition, sessionId);
    engineRef.current = engine;

    engine.on('challengePresented', ({ content: presentedContent }) => {
      setContent(presentedContent);
      setPhase('answering');
    });

    engine.on('attemptCompleted', ({ attempt: completedAttempt }) => {
      setAttempt(completedAttempt);
      if (!user) return;
      completeGameSession(
        {
          sessionId,
          gameId: spotTheDifferenceDefinition.id,
          skill: spotTheDifferenceDefinition.skill,
          difficulty: DIFFICULTY,
          attempts: [completedAttempt],
        },
        user,
      )
        .then(({ gameResult, updatedUser, xpAwarded: awarded, leveledUp: didLevelUp, newAchievements: earned }) => {
          setResult(gameResult);
          setUser(updatedUser);
          setXpAwarded(awarded);
          setLeveledUp(didLevelUp);
          setNewAchievements(earned);
          setHistory((prev) => [...prev, gameResult]);
          setPhase('result');
        })
        .catch(console.error);
    });

    engine.start({ difficulty: DIFFICULTY });
  }

  function submit(index: number) {
    engineRef.current?.submitAnswer(index);
  }

  function playAgain() {
    engineRef.current = null;
    setContent(null);
    setAttempt(null);
    setResult(null);
    setXpAwarded(0);
    setLeveledUp(false);
    setNewAchievements([]);
    setPhase('idle');
  }

  const data = content?.data as SpotTheDifferenceData | undefined;

  return (
    <main style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Spot the Difference (harness)</h1>

      <p>Player: {user?.id ?? 'loading...'}</p>

      {phase === 'idle' && <button onClick={start}>Start</button>}

      {phase === 'answering' && data && (
        <div>
          <p>{content?.prompt} (click the cell that changed in the right grid)</p>
          <div style={{ display: 'flex', gap: 24 }}>
            <Grid colors={data.stateA} gridSize={data.gridSize} testPrefix="a" />
            <Grid colors={data.stateB} gridSize={data.gridSize} onCellClick={submit} testPrefix="b" />
          </div>
        </div>
      )}

      {phase === 'result' && attempt && result && (
        <div>
          <p>{attempt.isCorrect ? 'Correct!' : 'Incorrect.'}</p>
          <p>Your answer: {String(attempt.submittedAnswer)}</p>
          <p>Correct answer: {String(attempt.content.correctAnswer)}</p>
          <p>
            Score: {result.score} | Accuracy: {result.accuracy}% | Speed: {result.speed}%
          </p>
          <p>+{xpAwarded} XP</p>
          {leveledUp && user && (
            <p>
              Level up! You&apos;re now Level {user.level} — {calculateLevel(user.xp).name}
            </p>
          )}
          {newAchievements.length > 0 && (
            <p>New achievement{newAchievements.length > 1 ? 's' : ''}: {newAchievements.map((a) => a.name).join(', ')}</p>
          )}
          <button onClick={playAgain}>Play again</button>
        </div>
      )}

      <h2>History</h2>
      <ul>
        {history.map((entry) => (
          <li key={entry.sessionId}>
            {entry.sessionId}: {entry.score} pts
          </li>
        ))}
      </ul>
    </main>
  );
}
