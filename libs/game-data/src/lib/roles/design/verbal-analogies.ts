import { GameContent } from '@cerebro-play/shared-models';
import { AnalogyPair, buildVerbalAnalogyContent } from '../general/verbal-analogies';

export const DESIGN_ANALOGY_PAIRS: AnalogyPair[] = [
  { wordA: 'Palette', wordB: 'Color', wordC: 'Typeface', correctAnswer: 'Font' },
  { wordA: 'Sketch', wordB: 'Pencil', wordC: 'Render', correctAnswer: 'Computer' },
  { wordA: 'Layout', wordB: 'Grid', wordC: 'Rhythm', correctAnswer: 'Pattern' },
  { wordA: 'Logo', wordB: 'Brand', wordC: 'Icon', correctAnswer: 'App' },
  { wordA: 'Wireframe', wordB: 'Structure', wordC: 'Mockup', correctAnswer: 'Visual' },
  { wordA: 'Vector', wordB: 'Scalable', wordC: 'Raster', correctAnswer: 'Pixelated' },
  { wordA: 'Kerning', wordB: 'Letters', wordC: 'Padding', correctAnswer: 'Elements' },
  { wordA: 'Hue', wordB: 'Color', wordC: 'Weight', correctAnswer: 'Font' },
  { wordA: 'Prototype', wordB: 'Test', wordC: 'Draft', correctAnswer: 'Review' },
  { wordA: 'Contrast', wordB: 'Legibility', wordC: 'Balance', correctAnswer: 'Harmony' },
];

export function generateDesignVerbalAnalogies(): GameContent {
  return buildVerbalAnalogyContent(DESIGN_ANALOGY_PAIRS);
}
