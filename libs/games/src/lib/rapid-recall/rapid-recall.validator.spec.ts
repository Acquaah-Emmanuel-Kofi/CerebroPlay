import { GameContent } from '@cerebro-play/shared-models';
import { rapidRecallValidator } from './rapid-recall.validator';

const content: GameContent = { prompt: 'What was it?', data: {}, correctAnswer: 42 };

describe('rapidRecallValidator', () => {
  it('returns true when the submitted answer matches correctAnswer', () => {
    expect(rapidRecallValidator.validate(content, 42)).toBe(true);
  });

  it('returns false when the submitted answer does not match', () => {
    expect(rapidRecallValidator.validate(content, 43)).toBe(false);
  });

  it('returns false when no answer was submitted', () => {
    expect(rapidRecallValidator.validate(content, undefined)).toBe(false);
  });
});
