'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getOrCreateGuestUser, updateGuestUser } from '@cerebro-play/user';
import { CognitiveSkill, RoleTheme } from '@cerebro-play/shared-models';
import styles from './page.module.scss';

type Step = 'welcome' | 'profession' | 'skills' | 'time';

const STEP_ORDER: Step[] = ['welcome', 'profession', 'skills', 'time'];

const ROLE_OPTIONS: { value: RoleTheme; label: string }[] = [
  { value: 'general', label: 'General' },
  { value: 'software', label: 'Software & IT' },
  { value: 'design', label: 'Design & Creative' },
  { value: 'finance', label: 'Finance & Business' },
  { value: 'marketing', label: 'Marketing & Sales' },
];

const SKILL_OPTIONS: { value: CognitiveSkill; label: string }[] = [
  { value: 'memory', label: 'Memory' },
  { value: 'speed', label: 'Speed' },
  { value: 'focus', label: 'Focus' },
  { value: 'logic', label: 'Logic' },
  { value: 'visual', label: 'Visual reasoning' },
  { value: 'numerical', label: 'Numerical reasoning' },
  { value: 'flexibility', label: 'Cognitive flexibility' },
  { value: 'problemSolving', label: 'Problem solving' },
];

const TRAINING_TIME_OPTIONS: { minutes: number | undefined; label: string }[] = [
  { minutes: 2, label: '2 minutes' },
  { minutes: 5, label: '5 minutes' },
  { minutes: 10, label: '10 minutes' },
  { minutes: undefined, label: 'No limit' },
];

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

  return (
    <main className={styles.page}>
      {step === 'welcome' && (
        <>
          <h1 className={styles.headline}>Train the skills you use every day.</h1>
          <div className={styles.actions}>
            <span />
            <button className={styles.button} onClick={next}>
              Start Training
            </button>
          </div>
        </>
      )}

      {step === 'profession' && (
        <>
          <h1 className={styles.headline}>What kind of work do you do?</h1>
          <div className={styles.optionList}>
            {ROLE_OPTIONS.map((option) => (
              <div
                key={option.value}
                className={`${styles.option} ${role === option.value ? styles.optionSelected : ''}`}
                onClick={() => setRole(option.value)}
              >
                <input type="radio" checked={role === option.value} onChange={() => setRole(option.value)} />
                {option.label}
              </div>
            ))}
          </div>
          <div className={styles.actions}>
            <button className={`${styles.button} ${styles.buttonSecondary}`} onClick={back}>
              Back
            </button>
            <button className={styles.button} onClick={next} disabled={!canProceed()}>
              Next
            </button>
          </div>
        </>
      )}

      {step === 'skills' && (
        <>
          <h1 className={styles.headline}>Which skills do you want to train?</h1>
          <p className={styles.question}>Select all that apply.</p>
          <div className={styles.optionList}>
            {SKILL_OPTIONS.map((option) => (
              <div
                key={option.value}
                className={`${styles.option} ${skills.includes(option.value) ? styles.optionSelected : ''}`}
                onClick={() => toggleSkill(option.value)}
              >
                <input type="checkbox" checked={skills.includes(option.value)} onChange={() => toggleSkill(option.value)} />
                {option.label}
              </div>
            ))}
          </div>
          <div className={styles.actions}>
            <button className={`${styles.button} ${styles.buttonSecondary}`} onClick={back}>
              Back
            </button>
            <button className={styles.button} onClick={next} disabled={!canProceed()}>
              Next
            </button>
          </div>
        </>
      )}

      {step === 'time' && (
        <>
          <h1 className={styles.headline}>How much time do you have?</h1>
          <div className={styles.optionList}>
            {TRAINING_TIME_OPTIONS.map((option, index) => (
              <div
                key={option.label}
                className={`${styles.option} ${trainingTimeIndex === index ? styles.optionSelected : ''}`}
                onClick={() => setTrainingTimeIndex(index)}
              >
                <input type="radio" checked={trainingTimeIndex === index} onChange={() => setTrainingTimeIndex(index)} />
                {option.label}
              </div>
            ))}
          </div>
          <div className={styles.actions}>
            <button className={`${styles.button} ${styles.buttonSecondary}`} onClick={back}>
              Back
            </button>
            <button className={styles.button} onClick={next} disabled={!canProceed()}>
              Finish
            </button>
          </div>
        </>
      )}
    </main>
  );
}
