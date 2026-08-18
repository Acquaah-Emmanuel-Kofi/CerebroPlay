import { GameResult } from '@cerebro-play/shared-models';
import { difficultyEngine, stepDifficultyWithinSession } from './difficulty-engine';

function result(overrides: Partial<GameResult> = {}): GameResult {
  return {
    sessionId: 's1',
    score: 0,
    accuracy: 0,
    speed: 0,
    difficulty: 'easy',
    skill: 'memory',
    completed: true,
    ...overrides,
  };
}

describe('difficultyEngine.recommend', () => {
  it('recommends easy with no history for the skill', () => {
    expect(difficultyEngine.recommend({ userId: 'u1', skill: 'memory', recentResults: [] })).toBe('easy');
  });

  it('steps up after consistently high accuracy at the current difficulty', () => {
    const recentResults = [
      result({ difficulty: 'medium', accuracy: 95 }),
      result({ difficulty: 'medium', accuracy: 92 }),
      result({ difficulty: 'medium', accuracy: 100 }),
    ];
    expect(difficultyEngine.recommend({ userId: 'u1', skill: 'memory', recentResults })).toBe('hard');
  });

  it('steps down after consistently low accuracy at the current difficulty', () => {
    const recentResults = [
      result({ difficulty: 'hard', accuracy: 30 }),
      result({ difficulty: 'hard', accuracy: 40 }),
    ];
    expect(difficultyEngine.recommend({ userId: 'u1', skill: 'memory', recentResults })).toBe('medium');
  });

  it('holds steady for middling accuracy', () => {
    const recentResults = [result({ difficulty: 'medium', accuracy: 70 })];
    expect(difficultyEngine.recommend({ userId: 'u1', skill: 'memory', recentResults })).toBe('medium');
  });

  it('never recommends above expert or below easy', () => {
    expect(
      difficultyEngine.recommend({
        userId: 'u1',
        skill: 'memory',
        recentResults: [result({ difficulty: 'expert', accuracy: 100 })],
      }),
    ).toBe('expert');
    expect(
      difficultyEngine.recommend({
        userId: 'u1',
        skill: 'memory',
        recentResults: [result({ difficulty: 'easy', accuracy: 0 })],
      }),
    ).toBe('easy');
  });

  it('ignores results for other skills', () => {
    const recentResults = [result({ skill: 'logic', difficulty: 'expert', accuracy: 100 })];
    expect(difficultyEngine.recommend({ userId: 'u1', skill: 'memory', recentResults })).toBe('easy');
  });
});

describe('stepDifficultyWithinSession', () => {
  it('steps up after 3 consecutive correct answers', () => {
    expect(
      stepDifficultyWithinSession({ current: 'easy', consecutiveCorrect: 3, consecutiveIncorrect: 0 }),
    ).toBe('medium');
  });

  it('steps down after 2 consecutive incorrect answers', () => {
    expect(
      stepDifficultyWithinSession({ current: 'medium', consecutiveCorrect: 0, consecutiveIncorrect: 2 }),
    ).toBe('easy');
  });

  it('holds steady below the streak thresholds', () => {
    expect(
      stepDifficultyWithinSession({ current: 'medium', consecutiveCorrect: 2, consecutiveIncorrect: 0 }),
    ).toBe('medium');
    expect(
      stepDifficultyWithinSession({ current: 'medium', consecutiveCorrect: 0, consecutiveIncorrect: 1 }),
    ).toBe('medium');
  });

  it('does not step up past expert or down past easy', () => {
    expect(
      stepDifficultyWithinSession({ current: 'expert', consecutiveCorrect: 5, consecutiveIncorrect: 0 }),
    ).toBe('expert');
    expect(
      stepDifficultyWithinSession({ current: 'easy', consecutiveCorrect: 0, consecutiveIncorrect: 5 }),
    ).toBe('easy');
  });
});
