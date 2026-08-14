import { AnswerValidator } from '@cerebro-play/shared-models';

export const setEqualityValidator: AnswerValidator = {
  validate: (content, submittedAnswer) => {
    const correct = content.correctAnswer;
    if (!Array.isArray(correct) || !Array.isArray(submittedAnswer)) {
      return false;
    }
    if (correct.length !== submittedAnswer.length) {
      return false;
    }

    const sortedCorrect = [...correct].sort();
    const sortedSubmitted = [...submittedAnswer].sort();
    return sortedCorrect.every((value, index) => value === sortedSubmitted[index]);
  },
};
