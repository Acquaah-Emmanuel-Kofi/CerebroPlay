import { GameContent } from '@cerebro-play/shared-models';
import { AnalogyPair, buildVerbalAnalogyContent } from '../general/verbal-analogies';

export const SOFTWARE_ANALOGY_PAIRS: AnalogyPair[] = [
  { wordA: 'Function', wordB: 'Return', wordC: 'Loop', correctAnswer: 'Break' },
  { wordA: 'Bug', wordB: 'Fix', wordC: 'Bottleneck', correctAnswer: 'Optimize' },
  { wordA: 'Class', wordB: 'Object', wordC: 'Blueprint', correctAnswer: 'House' },
  { wordA: 'Compile', wordB: 'Error', wordC: 'Runtime', correctAnswer: 'Exception' },
  { wordA: 'Git', wordB: 'Commit', wordC: 'Database', correctAnswer: 'Transaction' },
  { wordA: 'Frontend', wordB: 'UI', wordC: 'Backend', correctAnswer: 'API' },
  { wordA: 'Array', wordB: 'Index', wordC: 'Dictionary', correctAnswer: 'Key' },
  { wordA: 'CPU', wordB: 'Process', wordC: 'RAM', correctAnswer: 'Cache' },
  { wordA: 'Server', wordB: 'Request', wordC: 'Client', correctAnswer: 'Response' },
  { wordA: 'Encrypt', wordB: 'Decrypt', wordC: 'Compress', correctAnswer: 'Decompress' },
];

export function generateSoftwareVerbalAnalogies(): GameContent {
  return buildVerbalAnalogyContent(SOFTWARE_ANALOGY_PAIRS);
}
