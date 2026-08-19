import { Difficulty, GameContent } from '@cerebro-play/shared-models';

const GRID_SIZE_BY_DIFFICULTY: Record<Difficulty, number> = {
  easy: 3,
  medium: 4,
  hard: 5,
  expert: 6,
};

// The app's own maskable icon: solid edge-to-edge background (no transparency), which
// slices cleanly into pieces without any piece showing a transparent corner.
const IMAGE_URL = '/icon-maskable-512.png';

export interface JigsawData {
  gridSize: number;
  imageUrl: string;
  initialOrder: number[];
}

function shuffledOrder(pieceCount: number): number[] {
  const order = Array.from({ length: pieceCount }, (_, i) => i);
  let isShuffled = false;
  while (!isShuffled) {
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    isShuffled = order.some((value, index) => value !== index);
  }
  return order;
}

export function generateJigsaw(difficulty: Difficulty): GameContent {
  const gridSize = GRID_SIZE_BY_DIFFICULTY[difficulty];
  const pieceCount = gridSize * gridSize;
  const initialOrder = shuffledOrder(pieceCount);
  const solvedOrder = Array.from({ length: pieceCount }, (_, i) => i);

  const data: JigsawData = { gridSize, imageUrl: IMAGE_URL, initialOrder };

  return {
    prompt: 'Swap the pieces to reassemble the picture.',
    data,
    correctAnswer: solvedOrder,
  };
}
