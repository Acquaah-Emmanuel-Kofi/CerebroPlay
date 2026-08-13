import { Difficulty, GameContent } from '@cerebro-play/shared-models';
import { difficultyToCount } from '../../difficulty/count';
import { DataField, generateFieldPoolContent } from '../../field-pool';

const FIELD_POOL: DataField[] = [
  { key: 'impressions', label: 'Impressions', randomValue: () => Math.floor(Math.random() * 90000) + 1000 },
  { key: 'clicks', label: 'Clicks', randomValue: () => Math.floor(Math.random() * 5000) + 50 },
  { key: 'ctr', label: 'CTR', randomValue: () => `${(Math.random() * 8 + 0.5).toFixed(2)}%` },
  { key: 'budget', label: 'Budget', randomValue: () => `$${Math.floor(Math.random() * 4500 + 500)}` },
  { key: 'conversions', label: 'Conversions', randomValue: () => Math.floor(Math.random() * 300) + 5 },
];

export function generateMarketingRapidRecall(difficulty: Difficulty): GameContent {
  return generateFieldPoolContent(FIELD_POOL, difficultyToCount(difficulty));
}
