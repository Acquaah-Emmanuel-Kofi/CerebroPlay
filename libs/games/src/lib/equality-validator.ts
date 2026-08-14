import { AnswerValidator } from '@cerebro-play/shared-models';

export const equalityValidator: AnswerValidator = {
  validate: (content, submittedAnswer) => submittedAnswer === content.correctAnswer,
};
