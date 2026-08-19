'use client';

import { useEffect, useRef, useState } from 'react';
import { GameEngine } from '@cerebro-play/game-engine';
import { jigsawDefinition } from '@cerebro-play/games';
import { calculateLevel } from '@cerebro-play/progression';
import { getOrCreateGuestUser } from '@cerebro-play/user';
import { Achievement, Difficulty, GameAttempt, GameContent, GameResult, User } from '@cerebro-play/shared-models';
import { completeGameSession } from '@/lib/complete-game-session';
import { useDifficultyRecommendation } from '@/lib/use-difficulty-recommendation';
import { GameShell } from '@/components/game-shell';
import { GameResultCard } from '@/components/game-result-card';
import { DifficultyPicker } from '@/components/difficulty-picker';

interface JigsawData {
  gridSize: number;
  imageUrl: string;
  initialOrder: number[];
}

type Phase = 'idle' | 'answering' | 'result';

const PUZZLE_SIZE_PX = 288;

export default function JigsawHarnessPage() {
  const engineRef = useRef<GameEngine | null>(null);
  const difficultyTouchedRef = useRef(false);

  const [phase, setPhase] = useState<Phase>('idle');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [content, setContent] = useState<GameContent | null>(null);
  const [order, setOrder] = useState<number[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);
  const [attempt, setAttempt] = useState<GameAttempt | null>(null);
  const [result, setResult] = useState<GameResult | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [xpAwarded, setXpAwarded] = useState(0);
  const [leveledUp, setLeveledUp] = useState(false);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  const [isPersonalBest, setIsPersonalBest] = useState(false);
  const [dailyChallengeCompletedNow, setDailyChallengeCompletedNow] = useState(false);
  const [dailyChallengeBonusXp, setDailyChallengeBonusXp] = useState(0);

  const recommendedDifficulty = useDifficultyRecommendation(user?.id, jigsawDefinition.skill);

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
    const engine = new GameEngine(jigsawDefinition, sessionId);
    engineRef.current = engine;

    engine.on('challengePresented', ({ content: presentedContent }) => {
      const data = presentedContent.data as JigsawData;
      setContent(presentedContent);
      setOrder(data.initialOrder);
      setSelectedPosition(null);
      setPhase('answering');
    });

    engine.on('attemptCompleted', ({ attempt: completedAttempt }) => {
      setAttempt(completedAttempt);
      if (!user) return;
      completeGameSession(
        { sessionId, gameId: jigsawDefinition.id, skill: jigsawDefinition.skill, difficulty, attempts: [completedAttempt] },
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

  function tapPiece(position: number) {
    if (selectedPosition === null) {
      setSelectedPosition(position);
      return;
    }
    if (selectedPosition === position) {
      setSelectedPosition(null);
      return;
    }

    const next = [...order];
    [next[selectedPosition], next[position]] = [next[position], next[selectedPosition]];
    setSelectedPosition(null);
    setOrder(next);

    const isSolved = next.every((value, index) => value === index);
    if (isSolved) {
      engineRef.current?.submitAnswer(next);
    }
  }

  function playAgain() {
    engineRef.current = null;
    setContent(null);
    setOrder([]);
    setSelectedPosition(null);
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

  const data = content?.data as JigsawData | undefined;
  const level = user ? calculateLevel(user.xp) : null;
  const pieceSize = data ? PUZZLE_SIZE_PX / data.gridSize : 0;

  return (
    <GameShell gameName="Jigsaw">
      {phase === 'idle' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-md text-center">
          <p className="font-body text-body-md text-on-surface-variant">
            Tap two pieces to swap them until the picture is whole again.
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
            className="grid rounded-xl overflow-hidden shadow-[0_4px_16px_rgba(65,42,231,0.06)]"
            style={{
              gridTemplateColumns: `repeat(${data.gridSize}, ${pieceSize}px)`,
              width: PUZZLE_SIZE_PX,
              height: PUZZLE_SIZE_PX,
            }}
          >
            {order.map((pieceValue, position) => {
              const row = Math.floor(pieceValue / data.gridSize);
              const col = pieceValue % data.gridSize;
              const denominator = data.gridSize - 1 || 1;
              return (
                <button
                  key={position}
                  type="button"
                  data-testid={`jigsaw-piece-${position}`}
                  onClick={() => tapPiece(position)}
                  className={`transition-all ${
                    selectedPosition === position ? 'ring-4 ring-primary ring-inset scale-95' : ''
                  }`}
                  style={{
                    width: pieceSize,
                    height: pieceSize,
                    backgroundImage: `url(${data.imageUrl})`,
                    backgroundSize: `${data.gridSize * 100}% ${data.gridSize * 100}%`,
                    backgroundPosition: `${(col * 100) / denominator}% ${(row * 100) / denominator}%`,
                  }}
                />
              );
            })}
          </div>
        </div>
      )}

      {phase === 'result' && attempt && result && (
        <div className="flex-1 flex flex-col items-center justify-center py-md">
          <GameResultCard
            gameName="Jigsaw"
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
