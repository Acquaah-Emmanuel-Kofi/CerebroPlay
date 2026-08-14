import { generateSpotTheDifference, SpotTheDifferenceData } from './spot-the-difference';

describe('generateSpotTheDifference', () => {
  it('scales the grid size with difficulty', () => {
    const easy = generateSpotTheDifference('easy').data as SpotTheDifferenceData;
    const expert = generateSpotTheDifference('expert').data as SpotTheDifferenceData;
    expect(easy.gridSize).toBeLessThan(expert.gridSize);
  });

  it('produces two states that differ in exactly one cell', () => {
    for (let i = 0; i < 25; i++) {
      const data = generateSpotTheDifference('medium').data as SpotTheDifferenceData;
      const differingIndexes = data.stateA
        .map((color, index) => (color !== data.stateB[index] ? index : -1))
        .filter((index) => index !== -1);
      expect(differingIndexes.length).toBe(1);
    }
  });

  it('sets correctAnswer to the index of the differing cell', () => {
    const content = generateSpotTheDifference('hard');
    const data = content.data as SpotTheDifferenceData;
    expect(data.stateA[content.correctAnswer as number]).not.toBe(data.stateB[content.correctAnswer as number]);
  });

  it('always asks the same fixed-point prompt', () => {
    const content = generateSpotTheDifference('easy');
    expect(content.prompt).toBe('Which cell changed?');
  });
});
