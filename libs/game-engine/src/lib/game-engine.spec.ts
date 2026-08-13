import { GameDefinition } from '@cerebro-play/shared-models';
import { GameEngine } from './game-engine.js';

function createDefinition(overrides: Partial<GameDefinition> = {}): GameDefinition {
  return {
    id: 'test-game',
    type: 'memory',
    skill: 'memory',
    difficulties: [{ difficulty: 'easy' }],
    generator: {
      generate: () => ({ prompt: 'What is 2 + 2?', data: {}, correctAnswer: 4 }),
    },
    validator: {
      validate: (content, submittedAnswer) => submittedAnswer === content.correctAnswer,
    },
    ...overrides,
  };
}

describe('GameEngine', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('walks through the lifecycle and produces a correct attempt on the happy path', () => {
    const engine = new GameEngine(createDefinition(), 'session-1');
    const stateChanges: string[] = [];
    engine.on('stateChanged', ({ state }) => stateChanges.push(state));

    engine.start({ difficulty: 'easy' });
    expect(engine.getState()).toBe('awaitingInput');

    const attempt = engine.submitAnswer(4);

    expect(attempt.isCorrect).toBe(true);
    expect(attempt.sessionId).toBe('session-1');
    expect(attempt.submittedAnswer).toBe(4);
    expect(engine.getState()).toBe('completed');
    expect(stateChanges).toEqual([
      'generating',
      'presenting',
      'awaitingInput',
      'validating',
      'completed',
    ]);
  });

  it('produces an incorrect attempt when the submitted answer is wrong', () => {
    const engine = new GameEngine(createDefinition(), 'session-1');

    engine.start({ difficulty: 'easy' });
    const attempt = engine.submitAnswer(5);

    expect(attempt.isCorrect).toBe(false);
  });

  it('throws if submitAnswer is called outside awaitingInput', () => {
    const engine = new GameEngine(createDefinition(), 'session-1');

    expect(() => engine.submitAnswer(4)).toThrow(/state "idle"/);
  });

  it('auto-completes with an incorrect attempt when the timer expires', () => {
    const engine = new GameEngine(createDefinition(), 'session-1');
    const onAttemptCompleted = jest.fn();
    engine.on('attemptCompleted', onAttemptCompleted);
    const onTimerExpired = jest.fn();
    engine.on('timerExpired', onTimerExpired);

    engine.start({ difficulty: 'easy', timeLimitMs: 5000 });
    jest.advanceTimersByTime(5000);

    expect(onTimerExpired).toHaveBeenCalledTimes(1);
    expect(onAttemptCompleted).toHaveBeenCalledTimes(1);
    expect(engine.getState()).toBe('completed');

    const [{ attempt }] = onAttemptCompleted.mock.calls[0];
    expect(attempt.isCorrect).toBe(false);
    expect(attempt.submittedAnswer).toBeUndefined();
  });

  it('does not expire the timer once an answer has already been submitted', () => {
    const engine = new GameEngine(createDefinition(), 'session-1');
    const onAttemptCompleted = jest.fn();
    engine.on('attemptCompleted', onAttemptCompleted);

    engine.start({ difficulty: 'easy', timeLimitMs: 5000 });
    engine.submitAnswer(4);
    jest.advanceTimersByTime(5000);

    expect(onAttemptCompleted).toHaveBeenCalledTimes(1);
  });
});
