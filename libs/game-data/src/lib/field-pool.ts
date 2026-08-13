import { GameContent } from '@cerebro-play/shared-models';

export interface DataField {
  key: string;
  label: string;
  randomValue: () => string | number;
}

function randomFrom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function generateFieldPoolContent(pool: DataField[], count: number): GameContent {
  const fields = [...pool].sort(() => Math.random() - 0.5).slice(0, Math.min(count, pool.length));
  const data: Record<string, string | number> = {};
  fields.forEach((field) => {
    data[field.key] = field.randomValue();
  });

  const askedField = randomFrom(fields);

  return {
    prompt: `What was the ${askedField.label.toLowerCase()}?`,
    data,
    correctAnswer: data[askedField.key],
  };
}
