'use client';

import { useEffect, useRef, useState } from 'react';
import { GameEngine } from '@cerebro-play/game-engine';
import { spotTheDifferenceDefinition } from '@cerebro-play/games';
import { calculateLevel } from '@cerebro-play/progression';
import { getOrCreateGuestUser } from '@cerebro-play/user';
import { Achievement, GameAttempt, GameContent, GameResult, User } from '@cerebro-play/shared-models';
import { completeGameSession } from '@/lib/complete-game-session';
import { GameShell } from '@/components/game-shell';
import { GameResultCard } from '@/components/game-result-card';

const DIFFICULTY = 'easy';

interface SpotTheDifferenceData {
  gridSize: number;
  stateA: string[];
  stateB: string[];
}

type Phase = 'idle' | 'answering' | 'result';

function Grid({
  colors,
  gridSize,
  onCellClick,
  testPrefix,
}: {
  colors: string[];
  gridSize: number;
  onCellClick?: (index: number) => void;
  testPrefix: string;
}) {
  return (
    <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${gridSize}, 36px)` }}>
      {colors.map((color, index) => (
        <button
          key={index}
          type="button"
          data-testid={`${testPrefix}-${index}`}
          onClick={() => onCellClick?.(index)}
          className={`w-9 h-9 rounded-md ${onCellClick ? 'cursor-pointer active:scale-90 transition-transform' : ''}`}
          style={{ backgroundColor: color }}
          disabled={!onCellClick}
        />
      ))}
    </div>
  );
}

export default function SpotTheDifferenceHarnessPage() {
  const engineRef = useRef<GameEngine | null>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [content, setContent] = useState<GameContent | null>(null);
  const [attempt, setAttempt] = useState<GameAttempt | null>(null);
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
    const engine = new GameEngine(spotTheDifferenceDefinition, sessionId);
    engineRef.current = engine;

    engine.on('challengePresented', ({ content: presentedContent }) => {
      setContent(presentedContent);
      setPhase('answering');
    });

    engine.on('attemptCompleted', ({ attempt: completedAttempt }) => {
      setAttempt(completedAttempt);
      if (!user) return;
      completeGameSession(
        { sessionId, gameId: spotTheDifferenceDefinition.id, skill: spotTheDifferenceDefinition.skill, difficulty: DIFFICULTY, attempts: [completedAttempt] },
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

    engine.start({ difficulty: DIFFICULTY });
  }

  function submit(index: number) {
    engineRef.current?.submitAnswer(index);
  }

  function playAgain() {
    engineRef.current = null;
    setContent(null);
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

  const data = content?.data as SpotTheDifferenceData | undefined;
  const level = user ? calculateLevel(user.xp) : null;

  return (
    <GameShell gameName="Spot the Difference">
      {phase === 'idle' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-md text-center">
          <p className="font-body text-body-md text-on-surface-variant">
            Find the cell that changed between the two grids.
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
          <p className="font-body text-body-md text-on-surface-variant text-center">
            Click the cell that changed in the right grid
          </p>
          <div className="flex gap-lg">
            <Grid colors={data.stateA} gridSize={data.gridSize} testPrefix="a" />
            <Grid colors={data.stateB} gridSize={data.gridSize} onCellClick={submit} testPrefix="b" />
          </div>
        </div>
      )}

      {phase === 'result' && attempt && result && (
        <div className="flex-1 flex flex-col items-center justify-center py-md">
          <GameResultCard
            gameName="Spot the Difference"
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
