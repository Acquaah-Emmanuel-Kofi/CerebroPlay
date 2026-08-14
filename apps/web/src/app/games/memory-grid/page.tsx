'use client';

import { useEffect, useRef, useState } from 'react';
import { GameEngine } from '@cerebro-play/game-engine';
import { memoryGridDefinition } from '@cerebro-play/games';
import { calculateGameResult } from '@cerebro-play/scoring';
import { getOrCreateGuestUser } from '@cerebro-play/user';
import { GameAttempt, GameContent, GameResult, User } from '@cerebro-play/shared-models';
import { gameResultsStore } from '@/lib/game-results-store';

const MEMORIZE_DURATION_MS = 4000;
const DIFFICULTY = 'easy';

interface MemoryGridData {
  gridSize: number;
  highlightedPositions: number[];
}

type Phase = 'idle' | 'memorizing' | 'answering' | 'result';

export default function MemoryGridHarnessPage() {
  const engineRef = useRef<GameEngine | null>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [content, setContent] = useState<GameContent | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
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
    const engine = new GameEngine(memoryGridDefinition, sessionId);
    engineRef.current = engine;

    engine.on('challengePresented', ({ content: presentedContent }) => {
      setContent(presentedContent);
      setSelected([]);
      setPhase('memorizing');
      setTimeout(() => setPhase('answering'), MEMORIZE_DURATION_MS);
    });

    engine.on('attemptCompleted', ({ attempt: completedAttempt }) => {
      setAttempt(completedAttempt);
      const gameResult = calculateGameResult({
        sessionId,
        skill: memoryGridDefinition.skill,
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

  function toggleCell(index: number) {
    setSelected((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]));
  }

  function submit() {
    engineRef.current?.submitAnswer(selected);
  }

  function playAgain() {
    engineRef.current = null;
    setContent(null);
    setSelected([]);
    setAttempt(null);
    setResult(null);
    setPhase('idle');
  }

  const gridData = content?.data as MemoryGridData | undefined;

  return (
    <main style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Memory Grid (harness)</h1>

      <p>Player: {user?.id ?? 'loading...'}</p>

      {phase === 'idle' && <button onClick={start}>Start</button>}

      {(phase === 'memorizing' || phase === 'answering') && gridData && (
        <div>
          <p>{phase === 'memorizing' ? 'Memorize the highlighted cells:' : content?.prompt}</p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${gridData.gridSize}, 40px)`,
              gap: 4,
              marginTop: 8,
            }}
          >
            {Array.from({ length: gridData.gridSize * gridData.gridSize }, (_, index) => {
              const isHighlighted = phase === 'memorizing' && gridData.highlightedPositions.includes(index);
              const isSelected = phase === 'answering' && selected.includes(index);
              return (
                <div
                  key={index}
                  onClick={() => phase === 'answering' && toggleCell(index)}
                  data-testid={`cell-${index}`}
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: isHighlighted ? '#1e3a5f' : isSelected ? '#4a90d9' : '#e5e7eb',
                    cursor: phase === 'answering' ? 'pointer' : 'default',
                  }}
                />
              );
            })}
          </div>
          {phase === 'answering' && (
            <button onClick={submit} style={{ marginTop: 12 }}>
              Submit
            </button>
          )}
        </div>
      )}

      {phase === 'result' && attempt && result && (
        <div>
          <p>{attempt.isCorrect ? 'Correct!' : 'Incorrect.'}</p>
          <p>Your answer: {JSON.stringify(attempt.submittedAnswer)}</p>
          <p>Correct answer: {JSON.stringify(attempt.content.correctAnswer)}</p>
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
