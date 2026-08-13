import { DataField, generateFieldPoolContent } from './field-pool';

const pool: DataField[] = [
  { key: 'a', label: 'Alpha', randomValue: () => 'alpha-value' },
  { key: 'b', label: 'Beta', randomValue: () => 'beta-value' },
  { key: 'c', label: 'Gamma', randomValue: () => 'gamma-value' },
  { key: 'd', label: 'Delta', randomValue: () => 'delta-value' },
];

describe('generateFieldPoolContent', () => {
  it('includes exactly `count` fields in the data payload', () => {
    const content = generateFieldPoolContent(pool, 2);
    expect(Object.keys(content.data as Record<string, unknown>)).toHaveLength(2);
  });

  it('clamps count to the pool size', () => {
    const content = generateFieldPoolContent(pool, 10);
    expect(Object.keys(content.data as Record<string, unknown>)).toHaveLength(pool.length);
  });

  it('asks about a field that is actually present in the data, with a matching correctAnswer', () => {
    const content = generateFieldPoolContent(pool, 3);
    const data = content.data as Record<string, unknown>;
    const askedKey = Object.entries(data).find(([, value]) => value === content.correctAnswer)?.[0];
    expect(askedKey).toBeDefined();
  });
});
