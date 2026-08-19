import { GameDefinition } from '@cerebro-play/shared-models';
import { equalityValidator } from '../equality-validator';
import { verbalAnalogiesGenerator } from './verbal-analogies.generator';

export const verbalAnalogiesDefinition: GameDefinition = {
  id: 'verbal-analogies',
  type: 'logic',
  skill: 'logic',
  difficulties: [
    { difficulty: 'easy' },
    { difficulty: 'medium' },
    { difficulty: 'hard' },
    { difficulty: 'expert' },
  ],
  generator: verbalAnalogiesGenerator,
  validator: equalityValidator,
  roleThemes: ['general', 'software', 'design', 'finance', 'marketing'],
};
