import { Difficulty, GameContent } from '@cerebro-play/shared-models';
import { difficultyToCount } from '../../difficulty/count';
import { DataField, generateFieldPoolContent } from '../../field-pool';

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE'];
const ENDPOINTS = ['/users', '/orders', '/products', '/sessions'];
const STATUS_CODES = [200, 201, 204, 404, 500];

function randomFrom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

const FIELD_POOL: DataField[] = [
  { key: 'method', label: 'Method', randomValue: () => randomFrom(HTTP_METHODS) },
  { key: 'path', label: 'Path', randomValue: () => randomFrom(ENDPOINTS) },
  { key: 'status', label: 'Status', randomValue: () => randomFrom(STATUS_CODES) },
  { key: 'users', label: 'Users', randomValue: () => `${Math.floor(Math.random() * 500) + 1} users` },
  { key: 'responseTimeMs', label: 'Response time', randomValue: () => `${(Math.random() * 50).toFixed(1)}ms` },
  { key: 'requestId', label: 'Request ID', randomValue: () => `req-${Math.floor(Math.random() * 9000) + 1000}` },
];

export function generateSoftwareRapidRecall(difficulty: Difficulty): GameContent {
  return generateFieldPoolContent(FIELD_POOL, difficultyToCount(difficulty));
}
