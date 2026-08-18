import { GameContent } from '@cerebro-play/shared-models';
import { AnalogyPair, buildVerbalAnalogyContent } from '../general/verbal-analogies';

export const FINANCE_ANALOGY_PAIRS: AnalogyPair[] = [
  { wordA: 'Debit', wordB: 'Credit', wordC: 'Asset', correctAnswer: 'Liability' },
  { wordA: 'Revenue', wordB: 'Income', wordC: 'Expense', correctAnswer: 'Cost' },
  { wordA: 'Stock', wordB: 'Share', wordC: 'Bond', correctAnswer: 'Debt' },
  { wordA: 'Profit', wordB: 'Gain', wordC: 'Loss', correctAnswer: 'Deficit' },
  { wordA: 'Budget', wordB: 'Plan', wordC: 'Forecast', correctAnswer: 'Prediction' },
  { wordA: 'Invoice', wordB: 'Bill', wordC: 'Receipt', correctAnswer: 'Proof' },
  { wordA: 'Interest', wordB: 'Rate', wordC: 'Principal', correctAnswer: 'Amount' },
  { wordA: 'Bull', wordB: 'Rising', wordC: 'Bear', correctAnswer: 'Falling' },
  { wordA: 'Savings', wordB: 'Deposit', wordC: 'Loan', correctAnswer: 'Borrow' },
  { wordA: 'Audit', wordB: 'Review', wordC: 'Ledger', correctAnswer: 'Record' },
];

export function generateFinanceVerbalAnalogies(): GameContent {
  return buildVerbalAnalogyContent(FINANCE_ANALOGY_PAIRS);
}
