import { Difficulty, GameContent } from '@cerebro-play/shared-models';
import { difficultyToCount } from '../../difficulty/count';

function randomAmount(): number {
  return Math.round((Math.random() * 950 + 10) * 100) / 100;
}

function formatAmount(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function generateFinanceRapidRecall(difficulty: Difficulty): GameContent {
  const count = difficultyToCount(difficulty);
  const amounts = Array.from({ length: count }, randomAmount);
  const maxAmount = Math.max(...amounts);

  return {
    prompt: 'Which transaction had the highest amount?',
    data: amounts.map(formatAmount),
    correctAnswer: formatAmount(maxAmount),
  };
}
