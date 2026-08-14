'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getOrCreateGuestUser, updateGuestUser } from '@cerebro-play/user';
import { CognitiveSkill, RoleTheme } from '@cerebro-play/shared-models';

type Step = 'welcome' | 'profession' | 'skills' | 'time';

const STEP_ORDER: Step[] = ['welcome', 'profession', 'skills', 'time'];

const ROLE_OPTIONS: { value: RoleTheme; label: string; icon: string }[] = [
  { value: 'general', label: 'General', icon: 'public' },
  { value: 'software', label: 'Software & IT', icon: 'code' },
  { value: 'design', label: 'Design & Creative', icon: 'palette' },
  { value: 'finance', label: 'Finance & Business', icon: 'monitoring' },
  { value: 'marketing', label: 'Marketing & Sales', icon: 'campaign' },
];

const SKILL_OPTIONS: { value: CognitiveSkill; label: string; icon: string }[] = [
  { value: 'memory', label: 'Memory', icon: 'memory' },
  { value: 'speed', label: 'Speed', icon: 'bolt' },
  { value: 'focus', label: 'Focus', icon: 'center_focus_strong' },
  { value: 'logic', label: 'Logic', icon: 'psychology' },
  { value: 'visual', label: 'Visual reasoning', icon: 'visibility' },
  { value: 'numerical', label: 'Numerical reasoning', icon: 'calculate' },
  { value: 'flexibility', label: 'Cognitive flexibility', icon: 'sync_alt' },
  { value: 'problemSolving', label: 'Problem solving', icon: 'extension' },
];

const TRAINING_TIME_OPTIONS: { minutes: number | undefined; label: string; icon: string; recommended?: boolean }[] = [
  { minutes: 2, label: '2 minutes', icon: 'timer_2' },
  { minutes: 5, label: '5 minutes', icon: 'timer_5', recommended: true },
  { minutes: 10, label: '10 minutes', icon: 'timer_10' },
  { minutes: undefined, label: 'No limit', icon: 'all_inclusive' },
];

const STEP_HEADINGS: Record<Step, { title: string; subtitle?: string }> = {
  welcome: { title: 'Train the skills you use every day.' },
  profession: { title: 'What kind of work do you do?' },
  skills: { title: 'Which skills do you want to train?', subtitle: 'Select all that apply.' },
  time: { title: 'How much time do you have?' },
};

export default function OnboardingPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [step, setStep] = useState<Step>('welcome');
  const [role, setRole] = useState<RoleTheme | undefined>(undefined);
  const [skills, setSkills] = useState<CognitiveSkill[]>([]);
  const [trainingTimeIndex, setTrainingTimeIndex] = useState<number | undefined>(undefined);

  useEffect(() => {
    getOrCreateGuestUser()
      .then((user) => setUserId(user.id))
      .catch(console.error);
  }, []);

  function toggleSkill(skill: CognitiveSkill) {
    setSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]));
  }

  function canProceed(): boolean {
    if (step === 'welcome') return true;
    if (step === 'profession') return role !== undefined;
    if (step === 'skills') return skills.length > 0;
    return trainingTimeIndex !== undefined;
  }

  function back() {
    const index = STEP_ORDER.indexOf(step);
    if (index > 0) setStep(STEP_ORDER[index - 1]);
  }

  async function next() {
    if (!canProceed()) return;

    const index = STEP_ORDER.indexOf(step);
    if (index < STEP_ORDER.length - 1) {
      setStep(STEP_ORDER[index + 1]);
      return;
    }

    if (!userId || trainingTimeIndex === undefined) return;
    await updateGuestUser(userId, {
      role,
      skills,
      trainingTimeMinutes: TRAINING_TIME_OPTIONS[trainingTimeIndex].minutes,
    });
    router.push('/home');
  }

  const stepIndex = STEP_ORDER.indexOf(step);
  const heading = STEP_HEADINGS[step];

  return (
    <main className="min-h-screen bg-surface text-on-surface font-body flex flex-col">
      <div className="w-full max-w-content mx-auto px-margin-mobile py-md flex flex-col flex-1">
        <header className="w-full flex justify-between items-center mb-xl">
          <button
            type="button"
            onClick={back}
            disabled={stepIndex === 0}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high active:scale-95 transition-all text-on-surface-variant disabled:opacity-0"
            aria-label="Back"
          >
            <span aria-hidden="true" className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="flex items-center gap-base">
            {STEP_ORDER.map((s, index) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all duration-500 ease-out ${
                  index === stepIndex ? 'w-12 bg-primary' : 'w-8 bg-surface-container-highest'
                }`}
              />
            ))}
          </div>
          <div className="w-10 h-10" />
        </header>

        <section className={`flex-1 flex flex-col pb-24 ${step === 'welcome' ? 'justify-center' : ''}`}>
          <div className="mb-xl">
            <h1 className="font-display text-display-lg-mobile text-on-surface mb-xs">{heading.title}</h1>
            {heading.subtitle && (
              <p className="font-body text-body-md text-on-surface-variant">{heading.subtitle}</p>
            )}
          </div>

          {step === 'profession' && (
            <div className="flex flex-col gap-sm" role="radiogroup" aria-label="Profession">
              {ROLE_OPTIONS.map((option) => (
                <OptionRow
                  key={option.value}
                  icon={option.icon}
                  label={option.label}
                  selected={role === option.value}
                  onClick={() => setRole(option.value)}
                />
              ))}
            </div>
          )}

          {step === 'skills' && (
            <div className="flex flex-col gap-sm">
              {SKILL_OPTIONS.map((option) => (
                <OptionRow
                  key={option.value}
                  icon={option.icon}
                  label={option.label}
                  selected={skills.includes(option.value)}
                  onClick={() => toggleSkill(option.value)}
                />
              ))}
            </div>
          )}

          {step === 'time' && (
            <div className="flex flex-col gap-sm">
              {TRAINING_TIME_OPTIONS.map((option, index) => (
                <OptionRow
                  key={option.label}
                  icon={option.icon}
                  label={option.label}
                  caption={option.recommended ? 'Recommended baseline' : undefined}
                  selected={trainingTimeIndex === index}
                  onClick={() => setTrainingTimeIndex(index)}
                />
              ))}
            </div>
          )}
        </section>

        <div className="sticky bottom-0 pt-md pb-margin-mobile bg-linear-to-t from-surface via-surface to-transparent">
          <button
            type="button"
            onClick={next}
            disabled={!canProceed()}
            className="w-full h-14 rounded-full bg-primary text-on-primary font-label-bold text-label-bold shadow-[0_12px_24px_rgba(65,42,231,0.25)] hover:shadow-[0_16px_32px_rgba(65,42,231,0.35)] active:scale-[0.96] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-sm"
          >
            {step === 'welcome' ? 'Start Training' : step === 'time' ? 'Finish' : 'Next'}
            <span aria-hidden="true" className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </div>
    </main>
  );
}

function OptionRow({
  icon,
  label,
  caption,
  selected,
  onClick,
}: {
  icon: string;
  label: string;
  caption?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`group w-full flex items-center gap-md p-sm rounded-xl border-2 transition-colors text-left ${
        selected ? 'border-primary bg-primary-container/10' : 'border-transparent bg-surface-container hover:bg-surface-container-high'
      }`}
    >
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
          selected ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest text-primary'
        }`}
      >
        <span aria-hidden="true" className="material-symbols-outlined filled">{icon}</span>
      </div>
      <div className="flex-1">
        <h3 className="font-label-bold text-label-bold text-on-surface">{label}</h3>
        {caption && <p className="font-label-md text-label-md text-on-surface-variant">{caption}</p>}
      </div>
      <div
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
          selected ? 'bg-primary border-primary' : 'border-outline-variant'
        }`}
      >
        {selected && <span aria-hidden="true" className="material-symbols-outlined text-on-primary text-[16px] font-bold">check</span>}
      </div>
    </button>
  );
}
