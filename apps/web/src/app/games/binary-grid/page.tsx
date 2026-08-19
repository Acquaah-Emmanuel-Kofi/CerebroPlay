'use client';

import { useEffect, useRef, useState } from 'react';
import { GameEngine } from '@cerebro-play/game-engine';
import { binaryGridDefinition } from '@cerebro-play/games';
import { calculateLevel } from '@cerebro-play/progression';
import { getOrCreateGuestUser } from '@cerebro-play/user';
import { Achievement, Difficulty, GameAttempt, GameContent, GameResult, User } from '@cerebro-play/shared-models';
import { completeGameSession } from '@/lib/complete-game-session';
import { useDifficultyRecommendation } from '@/lib/use-difficulty-recommendation';
import { GameShell } from '@/components/game-shell';
import { GameResultCard } from '@/components/game-result-card';
import { DifficultyPicker } from '@/components/difficulty-picker';

interface BinaryGridData {
  size: number;
  clues: (0 | 1 | null)[];
}

type Phase = 'idle' | 'answering' | 'result';

const SYMBOLS = ['☀', '🌙'];

export default function BinaryGridHarnessPage() {
  const engineRef = useRef<GameEngine | null>(null);
  const difficultyTouchedRef = useRef(false);

  const [phase, setPhase] = useState<Phase>('idle');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [content, setContent] = useState<GameContent | null>(null);
  const [answers, setAnswers] = useState<Record<number, 0 | 1>>({});
  const [attempt, setAttempt] = useState<GameAttempt | null>(null);
  const [result, setResult] = useState<GameResult | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [xpAwarded, setXpAwarded] = useState(0);
  const [leveledUp, setLeveledUp] = useState(false);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  const [isPersonalBest, setIsPersonalBest] = useState(false);
  const [dailyChallengeCompletedNow, setDailyChallengeCompletedNow] = useState(false);
  const [dailyChallengeBonusXp, setDailyChallengeBonusXp] = useState(0);

  const recommendedDifficulty = useDifficultyRecommendation(user?.id, binaryGridDefinition.skill);

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
    const engine = new GameEngine(binaryGridDefinition, sessionId);
    engineRef.current = engine;

    engine.on('challengePresented', ({ content: presentedContent }) => {
      setContent(presentedContent);
      setAnswers({});
      setPhase('answering');
    });

    engine.on('attemptCompleted', ({ attempt: completedAttempt }) => {
      setAttempt(completedAttempt);
      if (!user) return;
      completeGameSession(
        { sessionId, gameId: binaryGridDefinition.id, skill: binaryGridDefinition.skill, difficulty, attempts: [completedAttempt] },
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
    });

    engine.start({ difficulty });
  }

  function cycleCell(index: number) {
    const data = content?.data as BinaryGridData | undefined;
    if (!data || data.clues[index] !== null) return;
    setAnswers((prev) => {
      const next = { ...prev };
      if (!(index in next)) next[index] = 0;
      else if (next[index] === 0) next[index] = 1;
      else delete next[index];
      return next;
    });
  }

  function submit() {
    const data = content?.data as BinaryGridData | undefined;
    if (!data) return;
    const grid = data.clues.map((clue, index) => (clue !== null ? clue : answers[index]));
    engineRef.current?.submitAnswer(grid);
  }

  function playAgain() {
    engineRef.current = null;
    setContent(null);
    setAnswers({});
    setAttempt(null);
    setResult(null);
    setXpAwarded(0);
    setLeveledUp(false);
    setNewAchievements([]);
    setIsPersonalBest(false);
    setDailyChallengeCompletedNow(false);
    setDailyChallengeBonusXp(0);
    setPhase('idle');
  }

  const data = content?.data as BinaryGridData | undefined;
  const level = user ? calculateLevel(user.xp) : null;
  const filledCount = data ? data.clues.filter((c, i) => c !== null || i in answers).length : 0;
  const totalCells = data ? data.size * data.size : 0;
  const isComplete = data ? filledCount === totalCells : false;

  return (
    <GameShell
      gameName="Binary Grid"
      headerRight={
        phase === 'answering' && data ? (
          <span className="font-label-bold text-label-bold text-on-surface-variant">
            {filledCount}/{totalCells}
          </span>
        ) : undefined
      }
    >
      {phase === 'idle' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-md text-center">
          <p className="font-body text-body-md text-on-surface-variant">
            Fill every cell with {SYMBOLS[0]} or {SYMBOLS[1]}. Each row and column needs an equal
            split, and no more than 2 of the same symbol in a row.
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
          <p className="font-body text-body-md text-on-surface-variant text-center">{content?.prompt}</p>
          <div
            className="grid gap-1 bg-surface-container-lowest rounded-xl p-sm shadow-[0_4px_16px_rgba(65,42,231,0.06)]"
            style={{ gridTemplateColumns: `repeat(${data.size}, minmax(0, 1fr))` }}
          >
            {data.clues.map((clue, index) => {
              const isClue = clue !== null;
              const value = isClue ? clue : answers[index];
              return (
                <button
                  key={index}
                  type="button"
                  data-testid={`binary-cell-${index}`}
                  disabled={isClue}
                  onClick={() => cycleCell(index)}
                  className={`w-9 h-9 flex items-center justify-center rounded-md text-lg transition-colors ${
                    isClue
                      ? 'bg-surface-container-high text-on-surface cursor-default'
                      : value !== undefined
                        ? 'bg-primary-container text-on-primary-container'
                        : 'bg-surface border-2 border-surface-container-highest hover:border-primary'
                  }`}
                >
                  {value !== undefined ? SYMBOLS[value] : ''}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={submit}
            disabled={!isComplete}
            className="w-full h-14 bg-primary text-on-primary rounded-full font-label-bold text-label-bold shadow-md shadow-primary/20 active:scale-[0.98] transition-transform disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Submit
          </button>
        </div>
      )}

      {phase === 'result' && attempt && result && (
        <div className="flex-1 flex flex-col items-center justify-center py-md">
          <GameResultCard
            gameName="Binary Grid"
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
