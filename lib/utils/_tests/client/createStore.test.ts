import { describe, expect, it } from 'vitest';
import { createStore } from '../../client';
import { createMemoryStore } from '../../memory';

describe('createStore function', () => {
  it('should create a store with memory type', () => {
    const store = createStore('memory', {});

    expect(store).toBeDefined();
  });

  it('should create a store with sessionStorage type', () => {
    const store = createStore('sessionStorage', {});

    expect(store).toBeDefined();
  });

  it('should create a store with localStorage type', () => {
    const store = createStore('localStorage', {});

    expect(store).toBeDefined();
  });

  it('should create a store with custom type', () => {
    const store = createStore('custom', {
      createCustomStore: createMemoryStore,
    });

    expect(store).toBeDefined();
  });

  it('should throw an error with custom type and no createCustomStore function', () => {
    expect(() => createStore('custom', {})).toThrow();
  });
});
