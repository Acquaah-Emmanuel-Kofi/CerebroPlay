'use client';

import { useEffect, useRef, useState } from 'react';
import { GameEngine } from '@cerebro-play/game-engine';
import { rapidRecallDefinition } from '@cerebro-play/games';
import { calculateLevel } from '@cerebro-play/progression';
import { getOrCreateGuestUser } from '@cerebro-play/user';
import { Achievement, GameAttempt, GameContent, GameResult, User } from '@cerebro-play/shared-models';
import { completeGameSession } from '@/lib/complete-game-session';
import { GameShell } from '@/components/game-shell';
import { GameResultCard } from '@/components/game-result-card';

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
  const [xpAwarded, setXpAwarded] = useState(0);
  const [leveledUp, setLeveledUp] = useState(false);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  const [isPersonalBest, setIsPersonalBest] = useState(false);

  useEffect(() => {
    getOrCreateGuestUser().then(setUser).catch(console.error);
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
        { sessionId, gameId: rapidRecallDefinition.id, skill: rapidRecallDefinition.skill, difficulty: DIFFICULTY, attempts: [completedAttempt] },
        user,
      )
        .then(({ gameResult, updatedUser, xpAwarded: awarded, leveledUp: didLevelUp, newAchievements: earned, isPersonalBest: personalBest }) => {
          setResult(gameResult);
          setUser(updatedUser);
          setXpAwarded(awarded);
          setLeveledUp(didLevelUp);
          setNewAchievements(earned);
          setIsPersonalBest(personalBest);
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
    setIsPersonalBest(false);
    setPhase('idle');
  }

  const level = user ? calculateLevel(user.xp) : null;

  return (
    <GameShell gameName="Rapid Recall">
      {phase === 'idle' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-md text-center">
          <p className="font-body text-body-md text-on-surface-variant">
            Memorize a short piece of data, then answer a question about it.
          </p>
          <button
            type="button"
            onClick={start}
            className="h-14 px-lg bg-primary text-on-primary rounded-full font-label-bold text-label-bold shadow-md shadow-primary/20 active:scale-[0.98] transition-transform"
          >
            Start
          </button>
        </div>
      )}

      {phase === 'memorizing' && content && (
        <div className="flex-1 flex flex-col items-center justify-center gap-md">
          <p className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider">
            Memorize this
          </p>
          <pre className="bg-surface-container-lowest rounded-xl p-md font-body text-body-md text-on-surface shadow-[0_4px_16px_rgba(65,42,231,0.06)] whitespace-pre-wrap">
            {JSON.stringify(content.data, null, 2)}
          </pre>
        </div>
      )}

      {phase === 'answering' && content && (
        <div className="flex-1 flex flex-col items-center justify-center gap-md">
          <p className="font-display text-headline-sm text-on-surface text-center">{content.prompt}</p>
          <input
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            autoFocus
            className="w-full h-14 px-md rounded-xl bg-surface-container border-2 border-transparent focus:border-primary focus:outline-none text-center font-body text-body-lg text-on-surface"
          />
          <button
            type="button"
            onClick={submit}
            className="w-full h-14 bg-primary text-on-primary rounded-full font-label-bold text-label-bold shadow-md shadow-primary/20 active:scale-[0.98] transition-transform"
          >
            Submit
          </button>
        </div>
      )}

      {phase === 'result' && attempt && result && (
        <div className="flex-1 flex flex-col items-center justify-center py-md">
          <GameResultCard
            gameName="Rapid Recall"
            result={result}
            xpAwarded={xpAwarded}
            leveledUp={leveledUp}
            levelName={level?.name}
            levelNumber={level?.level}
            newAchievements={newAchievements}
            isPersonalBest={isPersonalBest}
            onPlayAgain={playAgain}
          />
        </div>
      )}
    </GameShell>
  );
}
