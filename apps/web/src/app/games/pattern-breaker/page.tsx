'use client';

import { useEffect, useRef, useState } from 'react';
import { GameEngine } from '@cerebro-play/game-engine';
import { patternBreakerDefinition } from '@cerebro-play/games';
import { calculateGameResult } from '@cerebro-play/scoring';
import { getOrCreateGuestUser } from '@cerebro-play/user';
import { GameAttempt, GameContent, GameResult, User } from '@cerebro-play/shared-models';
import { gameResultsStore } from '@/lib/game-results-store';

const DIFFICULTY = 'easy';

type Phase = 'idle' | 'answering' | 'result';

export default function PatternBreakerHarnessPage() {
  const engineRef = useRef<GameEngine | null>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [content, setContent] = useState<GameContent | null>(null);
  const [answer, setAnswer] = useState('');
  const [attempt, setAttempt] = useState<GameAttempt | null>(null);
  const [result, setResult] = useState<GameResult | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [history, setHistory] = useState<GameResult[]>([]);

  useEffect(() => {
    getOrCreateGuestUser().then(setUser).catch(console.error);
    gameResultsStore.getAll().then(setHistory).catch(console.error);
  }, []);

  function start() {
    const sessionId = `session-${Date.now()}`;
    const engine = new GameEngine(patternBreakerDefinition, sessionId);
    engineRef.current = engine;

    engine.on('challengePresented', ({ content: presentedContent }) => {
      setContent(presentedContent);
      setPhase('answering');
    });

    engine.on('attemptCompleted', ({ attempt: completedAttempt }) => {
      setAttempt(completedAttempt);
      const gameResult = calculateGameResult({
        sessionId,
        skill: patternBreakerDefinition.skill,
        difficulty: DIFFICULTY,
        attempts: [completedAttempt],
      });
      setResult(gameResult);
      gameResultsStore
        .put(gameResult)
        .then(() => setHistory((prev) => [...prev, gameResult]))
        .catch(console.error);
      setPhase('result');
    });

    engine.start({ difficulty: DIFFICULTY });
  }

  function submit() {
    engineRef.current?.submitAnswer(Number(answer));
  }

  function playAgain() {
    engineRef.current = null;
    setContent(null);
    setAnswer('');
    setAttempt(null);
    setResult(null);
    setPhase('idle');
  }

  return (
    <main style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Pattern Breaker (harness)</h1>

      <p>Player: {user?.id ?? 'loading...'}</p>

      {phase === 'idle' && <button onClick={start}>Start</button>}

      {phase === 'answering' && content && (
        <div>
          <p>{content.prompt}</p>
          <pre>{JSON.stringify(content.data)} → ?</pre>
          <input value={answer} onChange={(event) => setAnswer(event.target.value)} autoFocus />
          <button onClick={submit}>Submit</button>
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
