'use client';

import { useEffect, useRef, useState } from 'react';
import { GameEngine } from '@cerebro-play/game-engine';
import { zipPathDefinition } from '@cerebro-play/games';
import { calculateLevel } from '@cerebro-play/progression';
import { getOrCreateGuestUser } from '@cerebro-play/user';
import { Achievement, Difficulty, GameAttempt, GameContent, GameResult, User } from '@cerebro-play/shared-models';
import { completeGameSession } from '@/lib/complete-game-session';
import { useDifficultyRecommendation } from '@/lib/use-difficulty-recommendation';
import { GameShell } from '@/components/game-shell';
import { GameResultCard } from '@/components/game-result-card';
import { DifficultyPicker } from '@/components/difficulty-picker';

interface ZipCheckpoint {
  cellIndex: number;
  order: number;
}

interface ZipPathData {
  gridSize: number;
  checkpoints: ZipCheckpoint[];
}

type Phase = 'idle' | 'answering' | 'result';

function isAdjacent(a: number, b: number, gridSize: number): boolean {
  const rowA = Math.floor(a / gridSize);
  const colA = a % gridSize;
  const rowB = Math.floor(b / gridSize);
  const colB = b % gridSize;
  return Math.abs(rowA - rowB) + Math.abs(colA - colB) === 1;
}

export default function ZipPathHarnessPage() {
  const engineRef = useRef<GameEngine | null>(null);
  const difficultyTouchedRef = useRef(false);

  const [phase, setPhase] = useState<Phase>('idle');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [content, setContent] = useState<GameContent | null>(null);
  const [selectedPath, setSelectedPath] = useState<number[]>([]);
  const [attempt, setAttempt] = useState<GameAttempt | null>(null);
  const [result, setResult] = useState<GameResult | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [xpAwarded, setXpAwarded] = useState(0);
  const [leveledUp, setLeveledUp] = useState(false);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  const [isPersonalBest, setIsPersonalBest] = useState(false);
  const [dailyChallengeCompletedNow, setDailyChallengeCompletedNow] = useState(false);
  const [dailyChallengeBonusXp, setDailyChallengeBonusXp] = useState(0);

  const recommendedDifficulty = useDifficultyRecommendation(user?.id, zipPathDefinition.skill);

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
    const engine = new GameEngine(zipPathDefinition, sessionId);
    engineRef.current = engine;

    engine.on('challengePresented', ({ content: presentedContent }) => {
      setContent(presentedContent);
      setSelectedPath([]);
      setPhase('answering');
    });

    engine.on('attemptCompleted', ({ attempt: completedAttempt }) => {
      setAttempt(completedAttempt);
      if (!user) return;
      completeGameSession(
        { sessionId, gameId: zipPathDefinition.id, skill: zipPathDefinition.skill, difficulty, attempts: [completedAttempt] },
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

  function tapCell(index: number) {
    const data = content?.data as ZipPathData | undefined;
    if (!data) return;
    if (selectedPath.includes(index)) return;
    const last = selectedPath[selectedPath.length - 1];
    if (selectedPath.length > 0 && !isAdjacent(last, index, data.gridSize)) return;
    setSelectedPath((prev) => [...prev, index]);
  }

  function clearPath() {
    setSelectedPath([]);
  }

  function submit() {
    engineRef.current?.submitAnswer(selectedPath);
  }

  function playAgain() {
    engineRef.current = null;
    setContent(null);
    setSelectedPath([]);
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

  const data = content?.data as ZipPathData | undefined;
  const level = user ? calculateLevel(user.xp) : null;
  const totalCells = data ? data.gridSize * data.gridSize : 0;
  const isComplete = selectedPath.length === totalCells && totalCells > 0;

  const checkpointByCell = new Map(data?.checkpoints.map((c) => [c.cellIndex, c.order]) ?? []);

  return (
    <GameShell
      gameName="Zip Path"
      headerRight={
        phase === 'answering' && data ? (
          <span className="font-label-bold text-label-bold text-on-surface-variant">
            {selectedPath.length}/{totalCells}
          </span>
        ) : undefined
      }
    >
      {phase === 'idle' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-md text-center">
          <p className="font-body text-body-md text-on-surface-variant">
            Trace a single path through every cell, hitting the numbered dots in order.
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
            style={{ gridTemplateColumns: `repeat(${data.gridSize}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: totalCells }, (_, index) => {
              const stepNumber = selectedPath.indexOf(index);
              const isVisited = stepNumber !== -1;
              const checkpointOrder = checkpointByCell.get(index);
              return (
                <button
                  key={index}
                  type="button"
                  data-testid={`zip-cell-${index}`}
                  onClick={() => tapCell(index)}
                  className={`w-12 h-12 flex items-center justify-center rounded-lg font-label-bold text-label-bold transition-colors relative ${
                    isVisited
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface border-2 border-surface-container-highest hover:border-primary text-on-surface'
                  }`}
                >
                  {checkpointOrder !== undefined && (
                    <span
                      className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-label-bold ${
                        isVisited ? 'bg-secondary-container text-on-secondary-container' : 'bg-primary text-on-primary'
                      }`}
                    >
                      {checkpointOrder}
                    </span>
                  )}
                  {isVisited && <span className="text-xs">{stepNumber + 1}</span>}
                </button>
              );
            })}
          </div>
          <div className="flex gap-md w-full">
            <button
              type="button"
              onClick={clearPath}
              disabled={selectedPath.length === 0}
              className="flex-1 h-14 bg-surface-container-lowest border-2 border-surface-container-highest hover:border-primary rounded-full font-label-bold text-label-bold text-on-surface transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={!isComplete}
              className="flex-1 h-14 bg-primary text-on-primary rounded-full font-label-bold text-label-bold shadow-md shadow-primary/20 active:scale-[0.98] transition-transform disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Submit
            </button>
          </div>
        </div>
      )}

      {phase === 'result' && attempt && result && (
        <div className="flex-1 flex flex-col items-center justify-center py-md">
          <GameResultCard
            gameName="Zip Path"
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
