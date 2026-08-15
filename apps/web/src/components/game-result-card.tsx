import Link from 'next/link';
import { Achievement, GameResult } from '@cerebro-play/shared-models';

interface GameResultCardProps {
  gameName: string;
  result: GameResult;
  xpAwarded: number;
  leveledUp: boolean;
  levelName?: string;
  levelNumber?: number;
  newAchievements: Achievement[];
  isPersonalBest: boolean;
  onPlayAgain: () => void;
}

export function GameResultCard({
  gameName,
  result,
  xpAwarded,
  leveledUp,
  levelName,
  levelNumber,
  newAchievements,
  isPersonalBest,
  onPlayAgain,
}: GameResultCardProps) {
  return (
    <div className="w-full flex flex-col items-center gap-md">
      <div className="text-center">
        <h2 className="font-display text-display-lg-mobile text-primary mb-xs">Level Complete!</h2>
        <p className="font-body text-body-lg text-on-surface-variant">{gameName}</p>
      </div>

      <div className="bg-surface-container-lowest rounded-[24px] shadow-[0_12px_32px_rgba(65,42,231,0.08)] p-md w-full relative border border-surface-container-high">
        {isPersonalBest && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-secondary-container text-on-secondary-container px-4 py-1 rounded-full font-label-bold text-label-bold shadow-sm flex items-center gap-2 whitespace-nowrap">
            <span aria-hidden="true" className="material-symbols-outlined filled text-[16px]">workspace_premium</span>
            Personal Best!
          </div>
        )}

        <div className="flex flex-col items-center justify-center py-md border-b border-surface-container mt-4">
          <span className="font-body text-body-md text-on-surface-variant mb-2">Final Score</span>
          <div className="font-display text-display-lg-mobile text-on-surface">{result.score}</div>
          <div className="mt-4 bg-primary-container text-on-primary-container font-label-bold text-label-bold px-4 py-2 rounded-full flex items-center gap-2">
            <span aria-hidden="true" className="material-symbols-outlined filled text-[18px]">star</span>+{xpAwarded} XP
          </div>
        </div>

        <div className="grid grid-cols-2 gap-md pt-md">
          <div className="flex flex-col items-center p-sm bg-surface rounded-xl">
            <span aria-hidden="true" className="material-symbols-outlined text-tertiary mb-1 text-[28px]">track_changes</span>
            <span className="font-display text-headline-sm text-on-surface">{result.accuracy}%</span>
            <span className="font-label-md text-label-md text-outline">Accuracy</span>
          </div>
          <div className="flex flex-col items-center p-sm bg-surface rounded-xl">
            <span aria-hidden="true" className="material-symbols-outlined text-secondary-container mb-1 text-[28px]">timer</span>
            <span className="font-display text-headline-sm text-on-surface">{result.speed}%</span>
            <span className="font-label-md text-label-md text-outline">Speed</span>
          </div>
        </div>

        {leveledUp && (
          <p className="text-center font-label-bold text-label-bold text-primary mt-md">
            Level up! You&apos;re now Level {levelNumber} — {levelName}
          </p>
        )}
        {newAchievements.length > 0 && (
          <p className="text-center font-label-md text-label-md text-on-surface-variant mt-sm">
            New achievement{newAchievements.length > 1 ? 's' : ''}: {newAchievements.map((a) => a.name).join(', ')}
          </p>
        )}
      </div>

      <div className="w-full flex flex-col gap-sm">
        <button
          type="button"
          onClick={onPlayAgain}
          className="w-full h-14 bg-primary text-on-primary font-label-bold text-label-bold rounded-full shadow-[0_8px_16px_rgba(65,42,231,0.2)] flex justify-center items-center gap-2 active:scale-[0.98] transition-transform"
        >
          <span aria-hidden="true" className="material-symbols-outlined">replay</span>
          Play Again
        </button>
        <Link
          href="/home"
          className="w-full h-14 bg-primary/10 text-primary font-label-bold text-label-bold rounded-full flex justify-center items-center gap-2 active:scale-[0.98] transition-transform"
        >
          <span aria-hidden="true" className="material-symbols-outlined">arrow_back</span>
          Back to Home
        </Link>
      </div>
    </div>
  );
}
