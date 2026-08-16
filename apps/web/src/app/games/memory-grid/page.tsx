'use client';

import { useEffect, useRef, useState } from 'react';
import { GameEngine } from '@cerebro-play/game-engine';
import { memoryGridDefinition } from '@cerebro-play/games';
import { calculateLevel } from '@cerebro-play/progression';
import { getOrCreateGuestUser } from '@cerebro-play/user';
import { Achievement, GameAttempt, GameContent, GameResult, User } from '@cerebro-play/shared-models';
import { completeGameSession } from '@/lib/complete-game-session';
import { GameShell } from '@/components/game-shell';
import { GameResultCard } from '@/components/game-result-card';

const MEMORIZE_DURATION_MS = 4000;
const DIFFICULTY = 'easy';

interface MemoryGridData {
  gridSize: number;
  highlightedPositions: number[];
}

type Phase = 'idle' | 'memorizing' | 'answering' | 'result';

export default function MemoryGridHarnessPage() {
  const engineRef = useRef<GameEngine | null>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [content, setContent] = useState<GameContent | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
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
    const engine = new GameEngine(memoryGridDefinition, sessionId);
    engineRef.current = engine;

    engine.on('challengePresented', ({ content: presentedContent }) => {
      setContent(presentedContent);
      setSelected([]);
      setPhase('memorizing');
      setTimeout(() => setPhase('answering'), MEMORIZE_DURATION_MS);
    });

    engine.on('attemptCompleted', ({ attempt: completedAttempt }) => {
      setAttempt(completedAttempt);
      if (!user) return;
      completeGameSession(
        { sessionId, gameId: memoryGridDefinition.id, skill: memoryGridDefinition.skill, difficulty: DIFFICULTY, attempts: [completedAttempt] },
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

  function toggleCell(index: number) {
    setSelected((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]));
  }

  function submit() {
    engineRef.current?.submitAnswer(selected);
  }

  function playAgain() {
    engineRef.current = null;
    setContent(null);
    setSelected([]);
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

  const gridData = content?.data as MemoryGridData | undefined;
  const level = user ? calculateLevel(user.xp) : null;

  return (
    <GameShell gameName="Memory Grid">
      {phase === 'idle' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-md text-center">
          <p className="font-body text-body-md text-on-surface-variant">Memorize the highlighted cells, then select them.</p>
          <button
            type="button"
            onClick={start}
            className="h-14 px-lg bg-primary text-on-primary rounded-full font-label-bold text-label-bold shadow-md shadow-primary/20 active:scale-[0.98] transition-transform"
          >
            Start
          </button>
        </div>
      )}

      {(phase === 'memorizing' || phase === 'answering') && gridData && (
        <div className="flex-1 flex flex-col items-center justify-center gap-md">
          <p className="font-display text-headline-sm text-on-surface text-center">
            {phase === 'memorizing' ? 'Memorize the highlighted cells' : content?.prompt}
          </p>
          <div
            className="grid gap-2"
            style={{ gridTemplateColumns: `repeat(${gridData.gridSize}, 48px)` }}
          >
            {Array.from({ length: gridData.gridSize * gridData.gridSize }, (_, index) => {
              const isHighlighted = phase === 'memorizing' && gridData.highlightedPositions.includes(index);
              const isSelected = phase === 'answering' && selected.includes(index);
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => phase === 'answering' && toggleCell(index)}
                  data-testid={`cell-${index}`}
                  className={`w-12 h-12 rounded-lg transition-colors ${
                    isHighlighted
                      ? 'bg-primary'
                      : isSelected
                        ? 'bg-primary-container'
                        : 'bg-surface-container-highest hover:bg-surface-container-high'
                  }`}
                />
              );
            })}
          </div>
          {phase === 'answering' && (
            <button
              type="button"
              onClick={submit}
              className="h-14 px-lg bg-primary text-on-primary rounded-full font-label-bold text-label-bold shadow-md shadow-primary/20 active:scale-[0.98] transition-transform mt-sm"
            >
              Submit
            </button>
          )}
        </div>
      )}

      {phase === 'result' && attempt && result && (
        <div className="flex-1 flex flex-col items-center justify-center py-md">
          <GameResultCard
            gameName="Memory Grid"
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
