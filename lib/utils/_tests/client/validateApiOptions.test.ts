import { describe, expect, it } from 'vitest';
import { validateApiOptions } from '../../client';
import { createMemoryStore } from '../../memory';

describe('validateApiOptions function', () => {
  it('should return undefined for valid API options', () => {
    const result = validateApiOptions('sessionStorage', undefined);

    expect(result).toBeUndefined();
  });

  it('should return undefined for custom type used correctly', () => {
    expect(() => validateApiOptions('custom', createMemoryStore));
  });

  it('should throw an error if custom storage is used without proper configuration', () => {
    expect(() => validateApiOptions('custom', undefined)).toThrow();
  });
});
