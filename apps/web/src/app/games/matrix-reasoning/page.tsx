'use client';

import { useEffect, useRef, useState } from 'react';
import { GameEngine } from '@cerebro-play/game-engine';
import { difficultyToRoundCount, matrixReasoningDefinition } from '@cerebro-play/games';
import { calculateLevel } from '@cerebro-play/progression';
import { getOrCreateGuestUser } from '@cerebro-play/user';
import { Achievement, Difficulty, GameAttempt, GameContent, GameResult, User } from '@cerebro-play/shared-models';
import { completeGameSession } from '@/lib/complete-game-session';
import { useDifficultyRecommendation } from '@/lib/use-difficulty-recommendation';
import { GameShell } from '@/components/game-shell';
import { GameResultCard } from '@/components/game-result-card';
import { DifficultyPicker } from '@/components/difficulty-picker';

interface MatrixReasoningData {
  grid: string[];
  options: string[];
}

type Phase = 'idle' | 'answering' | 'result';

export default function MatrixReasoningHarnessPage() {
  const engineRef = useRef<GameEngine | null>(null);
  const roundRef = useRef(0);
  const totalRoundsRef = useRef(0);
  const attemptsRef = useRef<GameAttempt[]>([]);
  const sessionIdRef = useRef('');
  const difficultyTouchedRef = useRef(false);

  const [phase, setPhase] = useState<Phase>('idle');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [content, setContent] = useState<GameContent | null>(null);
  const [round, setRound] = useState(0);
  const [totalRounds, setTotalRounds] = useState(difficultyToRoundCount('easy'));
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);
  const [result, setResult] = useState<GameResult | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [xpAwarded, setXpAwarded] = useState(0);
  const [leveledUp, setLeveledUp] = useState(false);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  const [isPersonalBest, setIsPersonalBest] = useState(false);
  const [dailyChallengeCompletedNow, setDailyChallengeCompletedNow] = useState(false);
  const [dailyChallengeBonusXp, setDailyChallengeBonusXp] = useState(0);

  const recommendedDifficulty = useDifficultyRecommendation(user?.id, matrixReasoningDefinition.skill);

  useEffect(() => {
    getOrCreateGuestUser().then(setUser).catch(console.error);
  }, []);

  useEffect(() => {
    if (recommendedDifficulty && !difficultyTouchedRef.current) {
      setDifficulty(recommendedDifficulty);
    }
  }, [recommendedDifficulty]);

  function start() {
    const sessionId = `session-${Date.now()}`;
    sessionIdRef.current = sessionId;
    attemptsRef.current = [];
    setLastCorrect(null);
    setResult(null);

    const engine = new GameEngine(matrixReasoningDefinition, sessionId);
    engineRef.current = engine;

    engine.on('challengePresented', ({ content: presentedContent }) => {
      setContent(presentedContent);
      setPhase('answering');
    });

    engine.on('attemptCompleted', ({ attempt }) => {
      attemptsRef.current = [...attemptsRef.current, attempt];
      setLastCorrect(attempt.isCorrect);

      if (roundRef.current < totalRoundsRef.current) {
        engine.start({ difficulty });
        roundRef.current += 1;
        setRound(roundRef.current);
      } else {
        if (!user) return;
        completeGameSession(
          {
            sessionId: sessionIdRef.current,
            gameId: matrixReasoningDefinition.id,
            skill: matrixReasoningDefinition.skill,
            difficulty,
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

    totalRoundsRef.current = difficultyToRoundCount(difficulty);
    setTotalRounds(totalRoundsRef.current);
    roundRef.current = 1;
    setRound(1);
    engine.start({ difficulty });
  }

  function submit(value: string) {
    engineRef.current?.submitAnswer(value);
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
    setDailyChallengeCompletedNow(false);
    setDailyChallengeBonusXp(0);
    setPhase('idle');
  }

  const data = content?.data as MatrixReasoningData | undefined;
  const level = user ? calculateLevel(user.xp) : null;

  return (
    <GameShell
      gameName="Matrix Reasoning"
      headerRight={
        phase === 'answering' ? (
          <span className="font-label-bold text-label-bold text-on-surface-variant">
            {round}/{totalRounds}
          </span>
        ) : undefined
      }
    >
      {phase === 'idle' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-md text-center">
          <p className="font-body text-body-md text-on-surface-variant">
            Find the piece that completes the 3x3 pattern.
          </p>
          <DifficultyPicker
            value={difficulty}
            onChange={(value) => {
              difficultyTouchedRef.current = true;
              setDifficulty(value);
            }}
            recommended={recommendedDifficulty ?? undefined}
          />
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
          <p className="font-body text-body-md text-on-surface-variant text-center">{content?.prompt}</p>
          <div className="grid grid-cols-3 gap-1 bg-surface-container-lowest rounded-xl p-sm shadow-[0_4px_16px_rgba(65,42,231,0.06)]">
            {data.grid.map((cell, index) => (
              <div
                key={index}
                className="w-20 h-20 flex items-center justify-center bg-surface rounded-lg text-2xl tracking-tighter text-primary"
              >
                {cell}
              </div>
            ))}
            <div className="w-20 h-20 flex items-center justify-center bg-surface-container-high rounded-lg text-2xl font-label-bold text-on-surface-variant border-2 border-dashed border-outline-variant">
              ?
            </div>
          </div>
          <div className="grid grid-cols-2 gap-md w-full">
            {data.options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => submit(option)}
                className="h-14 bg-surface-container-lowest border-2 border-surface-container-highest hover:border-primary rounded-xl font-label-bold text-label-bold text-primary text-lg tracking-tighter transition-colors"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      {phase === 'result' && result && (
        <div className="flex-1 flex flex-col items-center justify-center py-md">
          <GameResultCard
            gameName="Matrix Reasoning"
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
