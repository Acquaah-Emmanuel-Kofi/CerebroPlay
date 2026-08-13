import { rapidRecallGenerator } from './rapid-recall.generator';

describe('rapidRecallGenerator', () => {
  it('defaults to general content when no roleTheme is given', () => {
    const content = rapidRecallGenerator.generate({ difficulty: 'easy' });
    expect(content.prompt).toMatch(/number\?$/);
  });

  it('dispatches to the software role content', () => {
    const content = rapidRecallGenerator.generate({ difficulty: 'easy', roleTheme: 'software' });
    expect(content.data).toBeInstanceOf(Object);
    expect(Array.isArray(content.data)).toBe(false);
  });

  it('dispatches to the design role content', () => {
    const content = rapidRecallGenerator.generate({ difficulty: 'easy', roleTheme: 'design' });
    expect(content.prompt).toMatch(/^Which color was/);
  });

  it('dispatches to the finance role content', () => {
    const content = rapidRecallGenerator.generate({ difficulty: 'easy', roleTheme: 'finance' });
    expect(content.prompt).toBe('Which transaction had the highest amount?');
  });

  it('dispatches to the marketing role content', () => {
    const content = rapidRecallGenerator.generate({ difficulty: 'easy', roleTheme: 'marketing' });
    expect(content.data).toBeInstanceOf(Object);
    expect(Array.isArray(content.data)).toBe(false);
  });
});
