'use client';

import { useRef, useState } from 'react';
import { GameEngine } from '@cerebro-play/game-engine';
import { rapidRecallDefinition } from '@cerebro-play/games';
import { calculateGameResult } from '@cerebro-play/scoring';
import { GameAttempt, GameContent, GameResult, RoleTheme } from '@cerebro-play/shared-models';

const MEMORIZE_DURATION_MS = 5000;
const DIFFICULTY = 'easy';

// Manual test toggle: set to 'software' | 'design' | 'finance' | 'marketing' | 'general' while play-testing,
// then leave undefined (defaults to 'general') before calling this done.
const ROLE_THEME: RoleTheme | undefined = undefined;

type Phase = 'idle' | 'memorizing' | 'answering' | 'result';

export default function RapidRecallHarnessPage() {
  const engineRef = useRef<GameEngine | null>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [content, setContent] = useState<GameContent | null>(null);
  const [answer, setAnswer] = useState('');
  const [attempt, setAttempt] = useState<GameAttempt | null>(null);
  const [result, setResult] = useState<GameResult | null>(null);

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
      setResult(
        calculateGameResult({
          sessionId,
          skill: rapidRecallDefinition.skill,
          difficulty: DIFFICULTY,
          attempts: [completedAttempt],
        }),
      );
      setPhase('result');
    });

    engine.start({ difficulty: DIFFICULTY, roleTheme: ROLE_THEME });
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
    setPhase('idle');
  }

  return (
    <main style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Rapid Recall (harness)</h1>

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
          <button onClick={playAgain}>Play again</button>
        </div>
      )}
    </main>
  );
}
