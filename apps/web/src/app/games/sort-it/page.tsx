'use client';

import { useEffect, useRef, useState } from 'react';
import { GameEngine } from '@cerebro-play/game-engine';
import { sortItDefinition } from '@cerebro-play/games';
import { calculateGameResult } from '@cerebro-play/scoring';
import { getOrCreateGuestUser } from '@cerebro-play/user';
import { GameAttempt, GameContent, GameResult, User } from '@cerebro-play/shared-models';
import { gameResultsStore } from '@/lib/game-results-store';

const DIFFICULTY = 'easy';
const ROUNDS_PER_SESSION = 5;

interface SortItData {
  value: number;
  rule: string;
  categories: [string, string];
}

type Phase = 'idle' | 'answering' | 'result';

export default function SortItHarnessPage() {
  const engineRef = useRef<GameEngine | null>(null);
  const roundRef = useRef(0);
  const attemptsRef = useRef<GameAttempt[]>([]);
  const sessionIdRef = useRef('');

  const [phase, setPhase] = useState<Phase>('idle');
  const [content, setContent] = useState<GameContent | null>(null);
  const [round, setRound] = useState(0);
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);
  const [result, setResult] = useState<GameResult | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [history, setHistory] = useState<GameResult[]>([]);

  useEffect(() => {
    getOrCreateGuestUser().then(setUser).catch(console.error);
    gameResultsStore.getAll().then(setHistory).catch(console.error);
  }, []);

  function start() {
    const sessionId = `session-${Date.now()}`;
    sessionIdRef.current = sessionId;
    attemptsRef.current = [];
    setLastCorrect(null);
    setResult(null);

    const engine = new GameEngine(sortItDefinition, sessionId);
    engineRef.current = engine;

    engine.on('challengePresented', ({ content: presentedContent }) => {
      setContent(presentedContent);
      setPhase('answering');
    });

    engine.on('attemptCompleted', ({ attempt }) => {
      attemptsRef.current = [...attemptsRef.current, attempt];
      setLastCorrect(attempt.isCorrect);

      if (roundRef.current < ROUNDS_PER_SESSION) {
        engine.start({ difficulty: DIFFICULTY });
        roundRef.current += 1;
        setRound(roundRef.current);
      } else {
        const gameResult = calculateGameResult({
          sessionId: sessionIdRef.current,
          skill: sortItDefinition.skill,
          difficulty: DIFFICULTY,
          attempts: attemptsRef.current,
        });
        setResult(gameResult);
        gameResultsStore
          .put(gameResult)
          .then(() => setHistory((prev) => [...prev, gameResult]))
          .catch(console.error);
        setPhase('result');
      }
    });

    roundRef.current = 1;
    setRound(1);
    engine.start({ difficulty: DIFFICULTY });
  }

  function submit(category: string) {
    engineRef.current?.submitAnswer(category);
  }

  function playAgain() {
    engineRef.current = null;
    setContent(null);
    setRound(0);
    setLastCorrect(null);
    setResult(null);
    setPhase('idle');
  }

  const data = content?.data as SortItData | undefined;

  return (
    <main style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Sort It (harness)</h1>

      <p>Player: {user?.id ?? 'loading...'}</p>

      {phase === 'idle' && <button onClick={start}>Start</button>}

      {phase === 'answering' && data && (
        <div>
          <p>
            Round {round} of {ROUNDS_PER_SESSION}
          </p>
          {lastCorrect !== null && <p>Last answer: {lastCorrect ? 'Correct' : 'Incorrect'}</p>}
          <p>{content?.prompt}</p>
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            {data.categories.map((category) => (
              <button key={category} onClick={() => submit(category)}>
                {category}
              </button>
            ))}
          </div>
        </div>
      )}

      {phase === 'result' && result && (
        <div>
          <p>Session complete!</p>
          <p>
            Score: {result.score} | Accuracy: {result.accuracy}% | Speed: {result.speed}%
          </p>
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
