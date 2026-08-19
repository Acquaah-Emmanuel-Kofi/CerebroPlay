'use client';

import { useEffect, useRef, useState } from 'react';
import { GameEngine } from '@cerebro-play/game-engine';
import { difficultyToRoundCount, wordScrambleDefinition } from '@cerebro-play/games';
import { calculateLevel } from '@cerebro-play/progression';
import { getOrCreateGuestUser } from '@cerebro-play/user';
import { Achievement, Difficulty, GameAttempt, GameContent, GameResult, User } from '@cerebro-play/shared-models';
import { completeGameSession } from '@/lib/complete-game-session';
import { useDifficultyRecommendation } from '@/lib/use-difficulty-recommendation';
import { GameShell } from '@/components/game-shell';
import { GameResultCard } from '@/components/game-result-card';
import { DifficultyPicker } from '@/components/difficulty-picker';

interface WordScrambleData {
  scrambledLetters: string[];
}

type Phase = 'idle' | 'answering' | 'result';

export default function WordScrambleHarnessPage() {
  const engineRef = useRef<GameEngine | null>(null);
  const roundRef = useRef(0);
  const totalRoundsRef = useRef(0);
  const attemptsRef = useRef<GameAttempt[]>([]);
  const sessionIdRef = useRef('');
  const difficultyTouchedRef = useRef(false);

  const [phase, setPhase] = useState<Phase>('idle');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [content, setContent] = useState<GameContent | null>(null);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
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

  const recommendedDifficulty = useDifficultyRecommendation(user?.id, wordScrambleDefinition.skill);

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

    const engine = new GameEngine(wordScrambleDefinition, sessionId);
    engineRef.current = engine;

    engine.on('challengePresented', ({ content: presentedContent }) => {
      setContent(presentedContent);
      setSelectedIndices([]);
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
            gameId: wordScrambleDefinition.id,
            skill: wordScrambleDefinition.skill,
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

  function tapLetter(index: number) {
    if (selectedIndices.includes(index)) return;
    setSelectedIndices((prev) => [...prev, index]);
  }

  function backspace() {
    setSelectedIndices((prev) => prev.slice(0, -1));
  }

  function submit() {
    const data = content?.data as WordScrambleData | undefined;
    if (!data) return;
    const guess = selectedIndices.map((index) => data.scrambledLetters[index]).join('');
    engineRef.current?.submitAnswer(guess);
  }

  function playAgain() {
    engineRef.current = null;
    setContent(null);
    setSelectedIndices([]);
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

  const data = content?.data as WordScrambleData | undefined;
  const level = user ? calculateLevel(user.xp) : null;
  const isComplete = data ? selectedIndices.length === data.scrambledLetters.length : false;

  return (
    <GameShell
      gameName="Word Scramble"
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
            Tap the letters in order to unscramble the word.
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

          <div className="flex gap-1 min-h-12 items-center">
            {selectedIndices.length === 0 && (
              <span className="font-label-md text-label-md text-outline-variant">Your guess</span>
            )}
            {selectedIndices.map((index, position) => (
              <div
                key={position}
                className="w-10 h-12 flex items-center justify-center bg-primary-container text-on-primary-container rounded-lg font-label-bold text-label-bold text-lg uppercase"
              >
                {data.scrambledLetters[index]}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {data.scrambledLetters.map((letter, index) => (
              <button
                key={index}
                type="button"
                disabled={selectedIndices.includes(index)}
                onClick={() => tapLetter(index)}
                className="w-10 h-12 flex items-center justify-center bg-surface-container-lowest border-2 border-surface-container-highest hover:border-primary rounded-lg font-label-bold text-label-bold text-lg uppercase text-on-surface transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
              >
                {letter}
              </button>
            ))}
          </div>

          <div className="flex gap-md w-full">
            <button
              type="button"
              onClick={backspace}
              disabled={selectedIndices.length === 0}
              className="flex-1 h-14 bg-surface-container-lowest border-2 border-surface-container-highest hover:border-primary rounded-full font-label-bold text-label-bold text-on-surface transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Backspace
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

      {phase === 'result' && result && (
        <div className="flex-1 flex flex-col items-center justify-center py-md">
          <GameResultCard
            gameName="Word Scramble"
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
