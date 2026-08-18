import { GameContent } from '@cerebro-play/shared-models';
import { AnalogyPair, buildVerbalAnalogyContent } from '../general/verbal-analogies';

export const MARKETING_ANALOGY_PAIRS: AnalogyPair[] = [
  { wordA: 'Brand', wordB: 'Identity', wordC: 'Campaign', correctAnswer: 'Strategy' },
  { wordA: 'Lead', wordB: 'Prospect', wordC: 'Customer', correctAnswer: 'Buyer' },
  { wordA: 'Click', wordB: 'Engagement', wordC: 'Conversion', correctAnswer: 'Sale' },
  { wordA: 'Reach', wordB: 'Audience', wordC: 'Frequency', correctAnswer: 'Repetition' },
  { wordA: 'SEO', wordB: 'Search', wordC: 'SEM', correctAnswer: 'Ads' },
  { wordA: 'Funnel', wordB: 'Journey', wordC: 'Persona', correctAnswer: 'Profile' },
  { wordA: 'Impression', wordB: 'View', wordC: 'Engagement', correctAnswer: 'Interact' },
  { wordA: 'Organic', wordB: 'Free', wordC: 'Paid', correctAnswer: 'Sponsored' },
  { wordA: 'Retention', wordB: 'Loyalty', wordC: 'Acquisition', correctAnswer: 'Growth' },
  { wordA: 'Headline', wordB: 'Hook', wordC: 'CTA', correctAnswer: 'Action' },
];

export function generateMarketingVerbalAnalogies(): GameContent {
  return buildVerbalAnalogyContent(MARKETING_ANALOGY_PAIRS);
}
