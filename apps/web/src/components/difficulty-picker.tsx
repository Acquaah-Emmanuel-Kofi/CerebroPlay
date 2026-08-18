import { Difficulty } from '@cerebro-play/shared-models';

const DIFFICULTY_OPTIONS: { value: Difficulty; label: string }[] = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
  { value: 'expert', label: 'Expert' },
];

interface DifficultyPickerProps {
  value: Difficulty;
  onChange: (difficulty: Difficulty) => void;
  recommended?: Difficulty;
}

export function DifficultyPicker({ value, onChange, recommended }: DifficultyPickerProps) {
  const recommendedLabel = DIFFICULTY_OPTIONS.find((option) => option.value === recommended)?.label;

  return (
    <div className="flex flex-col items-center gap-xs">
      <div className="flex gap-1 bg-surface-container rounded-full p-1" role="radiogroup" aria-label="Difficulty">
        {DIFFICULTY_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={value === option.value}
            onClick={() => onChange(option.value)}
            className={`px-md py-xs rounded-full font-label-md text-label-md transition-colors ${
              value === option.value
                ? 'bg-primary text-on-primary'
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
      {recommendedLabel && recommended !== value && (
        <p className="font-label-md text-label-md text-on-surface-variant">
          Recommended: <span className="text-primary font-label-bold">{recommendedLabel}</span>
        </p>
      )}
    </div>
  );
}
