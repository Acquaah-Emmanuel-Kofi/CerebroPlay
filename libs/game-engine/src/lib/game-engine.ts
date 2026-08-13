import { Difficulty, GameAttempt, GameContent, GameDefinition, RoleTheme } from '@cerebro-play/shared-models';
import { GameEngineEventEmitter } from './events.js';
import { GameEngineState } from './state.js';
import { GameTimer } from './timer.js';

export interface StartOptions {
  difficulty: Difficulty;
  roleTheme?: RoleTheme;
  timeLimitMs?: number;
}

export class GameEngine extends GameEngineEventEmitter {
  private readonly definition: GameDefinition;
  private readonly sessionId: string;
  private readonly timer = new GameTimer();
  private state: GameEngineState = 'idle';
  private currentContent?: GameContent;
  private presentedAt?: string;

  constructor(definition: GameDefinition, sessionId: string) {
    super();
    this.definition = definition;
    this.sessionId = sessionId;
  }

  getState(): GameEngineState {
    return this.state;
  }

  start(options: StartOptions): void {
    this.setState('generating');
    const content = this.definition.generator.generate({
      difficulty: options.difficulty,
      roleTheme: options.roleTheme,
    });
    this.currentContent = content;

    this.setState('presenting');
    this.presentedAt = new Date().toISOString();
    this.emit('challengePresented', { content });

    this.setState('awaitingInput');
    if (options.timeLimitMs !== undefined) {
      this.timer.start(options.timeLimitMs, {
        onExpire: () => this.handleTimerExpired(),
      });
    }
  }

  submitAnswer(answer: unknown): GameAttempt {
    if (this.state !== 'awaitingInput') {
      throw new Error(`Cannot submit an answer while engine is in state "${this.state}"`);
    }
    this.timer.stop();
    this.emit('answerSubmitted', { answer });
    return this.completeAttempt(answer);
  }

  private handleTimerExpired(): void {
    if (this.state !== 'awaitingInput') {
      return;
    }
    this.emit('timerExpired', undefined);
    this.completeAttempt(undefined);
  }

  private completeAttempt(submittedAnswer: unknown): GameAttempt {
    if (!this.currentContent || !this.presentedAt) {
      throw new Error('Cannot complete an attempt before a challenge has been presented');
    }

    this.setState('validating');
    const isCorrect = this.definition.validator.validate(this.currentContent, submittedAnswer);
    const answeredAt = new Date().toISOString();
    const attempt: GameAttempt = {
      sessionId: this.sessionId,
      content: this.currentContent,
      submittedAnswer,
      isCorrect,
      presentedAt: this.presentedAt,
      answeredAt,
      responseTimeMs: Date.parse(answeredAt) - Date.parse(this.presentedAt),
    };

    this.setState('completed');
    this.emit('attemptCompleted', { attempt });
    return attempt;
  }

  private setState(state: GameEngineState): void {
    this.state = state;
    this.emit('stateChanged', { state });
  }
}
