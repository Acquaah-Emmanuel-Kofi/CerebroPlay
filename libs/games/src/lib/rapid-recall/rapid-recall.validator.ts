import { AnswerValidator } from '@cerebro-play/shared-models';

export const rapidRecallValidator: AnswerValidator = {
  validate: (content, submittedAnswer) => submittedAnswer === content.correctAnswer,
};
