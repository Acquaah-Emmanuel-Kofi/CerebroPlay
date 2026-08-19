import { AnswerValidator } from '@cerebro-play/shared-models';

/**
 * Positional array equality -- unlike setEqualityValidator, order matters (e.g. jigsaw
 * pieces must each be in their own specific slot, not just "the right pieces present").
 */
export const arrayEqualityValidator: AnswerValidator = {
  validate: (content, submittedAnswer) => {
    const correct = content.correctAnswer;
    if (!Array.isArray(correct) || !Array.isArray(submittedAnswer)) {
      return false;
    }
    if (correct.length !== submittedAnswer.length) {
      return false;
    }

    return correct.every((value, index) => value === submittedAnswer[index]);
  },
};
