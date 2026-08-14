'use client';

import { useEffect, useRef, useState } from 'react';
import { GameEngine } from '@cerebro-play/game-engine';
import { rapidRecallDefinition } from '@cerebro-play/games';
import { calculateLevel } from '@cerebro-play/progression';
import { getOrCreateGuestUser } from '@cerebro-play/user';
import { Achievement, GameAttempt, GameContent, GameResult, User } from '@cerebro-play/shared-models';
import { completeGameSession } from '@/lib/complete-game-session';
import { gameResultsStore } from '@/lib/game-results-store';

const MEMORIZE_DURATION_MS = 5000;
const DIFFICULTY = 'easy';

type Phase = 'idle' | 'memorizing' | 'answering' | 'result';

export default function RapidRecallHarnessPage() {
  const engineRef = useRef<GameEngine | null>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [content, setContent] = useState<GameContent | null>(null);
  const [answer, setAnswer] = useState('');
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
    const engine = new GameEngine(rapidRecallDefinition, sessionId);
    engineRef.current = engine;

    engine.on('challengePresented', ({ content: presentedContent }) => {
      setContent(presentedContent);
      setPhase('memorizing');
      setTimeout(() => setPhase('answering'), MEMORIZE_DURATION_MS);
    });

    engine.on('attemptCompleted', ({ attempt: completedAttempt }) => {
      setAttempt(completedAttempt);
      if (!user) return;
      completeGameSession(
        {
          sessionId,
          gameId: rapidRecallDefinition.id,
          skill: rapidRecallDefinition.skill,
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

    engine.start({ difficulty: DIFFICULTY, roleTheme: user?.role });
  }

  function submit() {
    const correctAnswer = content?.correctAnswer;
    const value = typeof correctAnswer === 'number' ? Number(answer) : answer;
    engineRef.current?.submitAnswer(value);
  }

  function playAgain() {
    engineRef.current = null;
    setContent(null);
    setAnswer('');
    setAttempt(null);
    setResult(null);
    setXpAwarded(0);
    setLeveledUp(false);
    setNewAchievements([]);
    setPhase('idle');
  }

  return (
    <main style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Rapid Recall (harness)</h1>

      <p>Player: {user?.id ?? 'loading...'}</p>

      {phase === 'idle' && <button onClick={start}>Start</button>}

      {phase === 'memorizing' && content && (
        <div>
          <p>Memorize this:</p>
          <pre>{JSON.stringify(content.data, null, 2)}</pre>
        </div>
      )}

      {phase === 'answering' && content && (
        <div>
          <p>{content.prompt}</p>
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
