import { GameAttempt, GameContent } from '@cerebro-play/shared-models';
import { GameEngineState } from './state';

export interface GameEngineEventMap {
  stateChanged: { state: GameEngineState };
  challengePresented: { content: GameContent };
  answerSubmitted: { answer: unknown };
  timerExpired: undefined;
  attemptCompleted: { attempt: GameAttempt };
}

export type GameEngineEventName = keyof GameEngineEventMap;

type Listener<K extends GameEngineEventName> = (payload: GameEngineEventMap[K]) => void;

type AnyListener = (payload: unknown) => void;

export class GameEngineEventEmitter {
  private listeners: Partial<Record<GameEngineEventName, Set<AnyListener>>> = {};

  on<K extends GameEngineEventName>(event: K, listener: Listener<K>): void {
    let set = this.listeners[event];
    if (!set) {
      set = new Set();
      this.listeners[event] = set;
    }
    set.add(listener as AnyListener);
  }

  off<K extends GameEngineEventName>(event: K, listener: Listener<K>): void {
    this.listeners[event]?.delete(listener as AnyListener);
  }

  protected emit<K extends GameEngineEventName>(event: K, payload: GameEngineEventMap[K]): void {
    this.listeners[event]?.forEach((listener) => listener(payload));
  }
}
