import { describe, expect, it } from 'vitest';
import { createMemoryStore } from '../../memory';

describe('createMemoryStore function', () => {
  it('should create a memory store', () => {
    const store = createMemoryStore();

    expect(store).toBeDefined();
  });

  it('should store the initialFlags', () => {
    const initialFlags = { key: true };
    const store = createMemoryStore(initialFlags);

    const value = store.get('key');

    expect(value).toBe(true);
  });

  it('should return undefined for a non-existent key', () => {
    const store = createMemoryStore();

    const value = store.get('key');

    expect(value).toBeUndefined();
  });

  it('should store and retrieve a value', () => {
    const store = createMemoryStore();

    store.set('key', true);
    const value = store.get('key');

    expect(value).toBe(true);
  });

  it('should delete a value', () => {
    const store = createMemoryStore();

    store.set('key', true);
    store.delete('key');
    const value = store.get('key');

    expect(value).toBeUndefined();
  });

  it('should clear all values', () => {
    const store = createMemoryStore();

    store.set('key1', true);
    store.set('key2', true);
    store.clear();
    const value1 = store.get('key1');
    const value2 = store.get('key2');

    expect(value1).toBeUndefined();
    expect(value2).toBeUndefined();
  });

  it('should check if a key exists', () => {
    const store = createMemoryStore();

    store.set('key', true);
    const exists = store.has('key');
    const notExists = store.has('non-existent-key');

    expect(exists).toBe(true);
    expect(notExists).toBe(false);
  });

  it('should return all keys', () => {
    const store = createMemoryStore();

    store.set('key1', true);
    store.set('key2', true);
    const keys = store.getAll();

    expect(keys).haveOwnPropertyDescriptor('key1');
    expect(keys).haveOwnPropertyDescriptor('key2');
  });

  it('should reset the store to its initial state', () => {
    const initialFlags = { key: true };
    const store = createMemoryStore(initialFlags);

    store.set('key', false);
    store.set('anotherKey', true);
    store.reset();
    const value = store.get('key');
    const anotherValue = store.get('anotherKey');

    expect(value).toBe(true);
    expect(anotherValue).toBeUndefined();
  });
});
