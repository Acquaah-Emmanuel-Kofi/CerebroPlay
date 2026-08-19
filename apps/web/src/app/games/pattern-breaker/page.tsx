'use client';

import { useEffect, useRef, useState } from 'react';
import { GameEngine } from '@cerebro-play/game-engine';
import { patternBreakerDefinition } from '@cerebro-play/games';
import { calculateLevel } from '@cerebro-play/progression';
import { getOrCreateGuestUser } from '@cerebro-play/user';
import { Achievement, Difficulty, GameAttempt, GameContent, GameResult, User } from '@cerebro-play/shared-models';
import { completeGameSession } from '@/lib/complete-game-session';
import { useDifficultyRecommendation } from '@/lib/use-difficulty-recommendation';
import { GameShell } from '@/components/game-shell';
import { GameResultCard } from '@/components/game-result-card';
import { DifficultyPicker } from '@/components/difficulty-picker';

type Phase = 'idle' | 'answering' | 'result';

export default function PatternBreakerHarnessPage() {
  const engineRef = useRef<GameEngine | null>(null);
  const difficultyTouchedRef = useRef(false);
  const [phase, setPhase] = useState<Phase>('idle');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [content, setContent] = useState<GameContent | null>(null);
  const [answer, setAnswer] = useState('');
  const [attempt, setAttempt] = useState<GameAttempt | null>(null);
  const [result, setResult] = useState<GameResult | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [xpAwarded, setXpAwarded] = useState(0);
  const [leveledUp, setLeveledUp] = useState(false);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  const [isPersonalBest, setIsPersonalBest] = useState(false);
  const [dailyChallengeCompletedNow, setDailyChallengeCompletedNow] = useState(false);
  const [dailyChallengeBonusXp, setDailyChallengeBonusXp] = useState(0);

  const recommendedDifficulty = useDifficultyRecommendation(user?.id, patternBreakerDefinition.skill);

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
    const engine = new GameEngine(patternBreakerDefinition, sessionId);
    engineRef.current = engine;

    engine.on('challengePresented', ({ content: presentedContent }) => {
      setContent(presentedContent);
      setPhase('answering');
    });

    engine.on('attemptCompleted', ({ attempt: completedAttempt }) => {
      setAttempt(completedAttempt);
      if (!user) return;
      completeGameSession(
        { sessionId, gameId: patternBreakerDefinition.id, skill: patternBreakerDefinition.skill, difficulty, attempts: [completedAttempt] },
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

  function submit() {
    engineRef.current?.submitAnswer(Number(answer));
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
    setDailyChallengeCompletedNow(false);
    setDailyChallengeBonusXp(0);
    setPhase('idle');
  }

  const level = user ? calculateLevel(user.xp) : null;

  return (
    <GameShell gameName="Pattern Breaker">
      {phase === 'idle' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-md text-center">
          <p className="font-body text-body-md text-on-surface-variant">
            Find the missing number in the sequence.
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

      {phase === 'answering' && content && (
        <div className="flex-1 flex flex-col items-center justify-center gap-md">
          <p className="font-display text-headline-sm text-on-surface text-center">{content.prompt}</p>
          <pre className="bg-surface-container-lowest rounded-xl p-md font-body text-body-lg text-on-surface shadow-[0_4px_16px_rgba(65,42,231,0.06)]">
            {JSON.stringify(content.data)} → ?
          </pre>
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
            gameName="Pattern Breaker"
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
