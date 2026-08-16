'use client';

import { useEffect, useRef, useState } from 'react';
import { GameEngine } from '@cerebro-play/game-engine';
import { focusDefinition } from '@cerebro-play/games';
import { calculateLevel } from '@cerebro-play/progression';
import { getOrCreateGuestUser } from '@cerebro-play/user';
import { Achievement, GameAttempt, GameContent, GameResult, User } from '@cerebro-play/shared-models';
import { completeGameSession } from '@/lib/complete-game-session';
import { GameShell } from '@/components/game-shell';
import { GameResultCard } from '@/components/game-result-card';

const DIFFICULTY = 'easy';
const TIME_LIMIT_MS = 3000;
const ROUNDS_PER_SESSION = 8;

interface FocusData {
  symbol: string;
  target: string;
}

type Phase = 'idle' | 'answering' | 'result';
type Outcome = 'correct' | 'incorrect' | 'timeout';

export default function FocusHarnessPage() {
  const engineRef = useRef<GameEngine | null>(null);
  const roundRef = useRef(0);
  const attemptsRef = useRef<GameAttempt[]>([]);
  const sessionIdRef = useRef('');

  const [phase, setPhase] = useState<Phase>('idle');
  const [content, setContent] = useState<GameContent | null>(null);
  const [round, setRound] = useState(0);
  const [lastOutcome, setLastOutcome] = useState<Outcome | null>(null);
  const [result, setResult] = useState<GameResult | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [xpAwarded, setXpAwarded] = useState(0);
  const [leveledUp, setLeveledUp] = useState(false);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  const [isPersonalBest, setIsPersonalBest] = useState(false);
  const [dailyChallengeCompletedNow, setDailyChallengeCompletedNow] = useState(false);
  const [dailyChallengeBonusXp, setDailyChallengeBonusXp] = useState(0);

  useEffect(() => {
    getOrCreateGuestUser().then(setUser).catch(console.error);
  }, []);

  function start() {
    const sessionId = `session-${Date.now()}`;
    sessionIdRef.current = sessionId;
    attemptsRef.current = [];
    setLastOutcome(null);
    setResult(null);

    const engine = new GameEngine(focusDefinition, sessionId);
    engineRef.current = engine;

    engine.on('challengePresented', ({ content: presentedContent }) => {
      setContent(presentedContent);
      setPhase('answering');
    });

    engine.on('attemptCompleted', ({ attempt }) => {
      attemptsRef.current = [...attemptsRef.current, attempt];
      const outcome: Outcome =
        attempt.submittedAnswer === undefined ? 'timeout' : attempt.isCorrect ? 'correct' : 'incorrect';
      setLastOutcome(outcome);

      if (roundRef.current < ROUNDS_PER_SESSION) {
        engine.start({ difficulty: DIFFICULTY, timeLimitMs: TIME_LIMIT_MS });
        roundRef.current += 1;
        setRound(roundRef.current);
      } else {
        if (!user) return;
        completeGameSession(
          {
            sessionId: sessionIdRef.current,
            gameId: focusDefinition.id,
            skill: focusDefinition.skill,
            difficulty: DIFFICULTY,
            attempts: attemptsRef.current,
          },
          user,
        )
          .then(
            ({
              gameResult,
              updatedUser,
              xpAwarded: awarded,
              leveledUp: didLevelUp,
              newAchievements: earned,
              isPersonalBest: personalBest,
              dailyChallengeCompletedNow: challengeCompleted,
              dailyChallengeBonusXp: bonusXp,
            }) => {
              setResult(gameResult);
              setUser(updatedUser);
              setXpAwarded(awarded);
              setLeveledUp(didLevelUp);
              setNewAchievements(earned);
              setIsPersonalBest(personalBest);
              setDailyChallengeCompletedNow(challengeCompleted);
              setDailyChallengeBonusXp(bonusXp);
              setPhase('result');
            },
          )
          .catch(console.error);
      }
    });

    roundRef.current = 1;
    setRound(1);
    engine.start({ difficulty: DIFFICULTY, timeLimitMs: TIME_LIMIT_MS });
  }

  function submit(answer: 'target' | 'skip') {
    engineRef.current?.submitAnswer(answer);
  }

  function playAgain() {
    engineRef.current = null;
    setContent(null);
    setRound(0);
    setLastOutcome(null);
    setResult(null);
    setXpAwarded(0);
    setLeveledUp(false);
    setNewAchievements([]);
    setIsPersonalBest(false);
    setDailyChallengeCompletedNow(false);
    setDailyChallengeBonusXp(0);
    setPhase('idle');
  }

  const data = content?.data as FocusData | undefined;
  const level = user ? calculateLevel(user.xp) : null;

  return (
    <GameShell
      gameName="Focus"
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
          <p className="font-body text-body-md text-on-surface-variant">
            Tap Target! when the symbol matches, or Skip when it doesn&apos;t.
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

      {phase === 'answering' && data && (
        <div className="flex-1 flex flex-col items-center justify-center gap-md">
          {lastOutcome !== null && (
            <p
              className={`font-label-bold text-label-bold ${
                lastOutcome === 'correct' ? 'text-primary' : 'text-error'
              }`}
            >
              {lastOutcome === 'timeout' ? "Time's up" : lastOutcome === 'correct' ? 'Correct!' : 'Incorrect'}
            </p>
          )}
          <p className="font-body text-body-md text-on-surface-variant text-center">{content?.prompt}</p>
          <div
            className="text-[64px] leading-none my-md"
            data-testid="focus-symbol"
          >
            {data.symbol}
          </div>
          <div className="flex gap-md w-full">
            <button
              type="button"
              onClick={() => submit('target')}
              className="flex-1 h-14 bg-primary text-on-primary rounded-full font-label-bold text-label-bold shadow-md shadow-primary/20 active:scale-[0.98] transition-transform"
            >
              Target!
            </button>
            <button
              type="button"
              onClick={() => submit('skip')}
              className="flex-1 h-14 bg-surface-container-lowest border-2 border-surface-container-highest hover:border-primary rounded-full font-label-bold text-label-bold text-on-surface transition-colors"
            >
              Skip
            </button>
          </div>
        </div>
      )}

      {phase === 'result' && result && (
        <div className="flex-1 flex flex-col items-center justify-center py-md">
          <GameResultCard
            gameName="Focus"
            result={result}
            xpAwarded={xpAwarded}
            leveledUp={leveledUp}
            levelName={level?.name}
            levelNumber={level?.level}
            newAchievements={newAchievements}
            isPersonalBest={isPersonalBest}
            dailyChallengeCompletedNow={dailyChallengeCompletedNow}
            dailyChallengeBonusXp={dailyChallengeBonusXp}
            onPlayAgain={playAgain}
          />
        </div>
      )}
    </GameShell>
  );
}
