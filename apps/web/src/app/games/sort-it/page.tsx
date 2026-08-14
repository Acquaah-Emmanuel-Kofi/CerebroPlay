'use client';

import { useEffect, useRef, useState } from 'react';
import { GameEngine } from '@cerebro-play/game-engine';
import { sortItDefinition } from '@cerebro-play/games';
import { calculateLevel } from '@cerebro-play/progression';
import { getOrCreateGuestUser } from '@cerebro-play/user';
import { Achievement, GameAttempt, GameContent, GameResult, User } from '@cerebro-play/shared-models';
import { completeGameSession } from '@/lib/complete-game-session';
import { GameShell } from '@/components/game-shell';
import { GameResultCard } from '@/components/game-result-card';

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
  const [xpAwarded, setXpAwarded] = useState(0);
  const [leveledUp, setLeveledUp] = useState(false);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  const [isPersonalBest, setIsPersonalBest] = useState(false);

  useEffect(() => {
    getOrCreateGuestUser().then(setUser).catch(console.error);
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
        if (!user) return;
        completeGameSession(
          {
            sessionId: sessionIdRef.current,
            gameId: sortItDefinition.id,
            skill: sortItDefinition.skill,
            difficulty: DIFFICULTY,
            attempts: attemptsRef.current,
          },
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
    setXpAwarded(0);
    setLeveledUp(false);
    setNewAchievements([]);
    setIsPersonalBest(false);
    setPhase('idle');
  }

  const data = content?.data as SortItData | undefined;
  const level = user ? calculateLevel(user.xp) : null;

  return (
    <GameShell
      gameName="Sort It"
      headerRight={
        phase === 'answering' ? (
          <span className="font-label-bold text-label-bold text-on-surface-variant">
            {round}/{ROUNDS_PER_SESSION}
          </span>
        ) : undefined
      }
    >
      {phase === 'idle' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-md text-center">
          <p className="font-body text-body-md text-on-surface-variant">Sort each item into the right category.</p>
          <button
            type="button"
            onClick={start}
            className="h-14 px-lg bg-primary text-on-primary rounded-full font-label-bold text-label-bold shadow-md shadow-primary/20 active:scale-[0.98] transition-transform"
          >
            Start
          </button>
        </div>
      )}

      {phase === 'answering' && data && (
        <div className="flex-1 flex flex-col items-center justify-center gap-md">
          {lastCorrect !== null && (
            <p className={`font-label-bold text-label-bold ${lastCorrect ? 'text-primary' : 'text-error'}`}>
              {lastCorrect ? 'Correct!' : 'Incorrect'}
            </p>
          )}
          <p className="font-display text-headline-sm text-on-surface text-center">{content?.prompt}</p>
          <div className="flex gap-md w-full">
            {data.categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => submit(category)}
                className="flex-1 h-14 bg-surface-container-lowest border-2 border-surface-container-highest hover:border-primary rounded-xl font-label-bold text-label-bold text-on-surface transition-colors"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}

      {phase === 'result' && result && (
        <div className="flex-1 flex flex-col items-center justify-center py-md">
          <GameResultCard
            gameName="Sort It"
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
