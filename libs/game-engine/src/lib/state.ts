export type GameEngineState =
  | 'idle'
  | 'generating'
  | 'presenting'
  | 'awaitingInput'
  | 'validating'
  | 'completed';
