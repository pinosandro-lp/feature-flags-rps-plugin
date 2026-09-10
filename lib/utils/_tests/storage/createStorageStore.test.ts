import { beforeEach, describe, expect, it } from 'vitest';
import { createStorageStore } from '../../storage';
import type { PersistenceTypeWithStorageKey } from '../../../types/persistence';

describe('createStorageStore function', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('should create a storage store', () => {
    const store = createStorageStore('localStorage', 'featureFlags', {});

    expect(store).toBeDefined();
  });

  it('should throw an error if window is not defined', () => {
    const originalWindow = globalThis.window;
    // @ts-expect-error: window is not defined in this test scenario
    delete globalThis.window;

    expect(() =>
      createStorageStore('localStorage', 'featureFlags', {}),
    ).toThrow();

    globalThis.window = originalWindow;
  });

  it('should throw an error if the storage type is invalid', () => {
    expect(() =>
      createStorageStore(
        'invalidStorageType' as PersistenceTypeWithStorageKey,
        'featureFlags',
        {},
      ),
    ).toThrow();
  });

  it('should return a boolean to indicate if a key exists', () => {
    const initialValues = { feature1: true, feature2: false };
    const store = createStorageStore(
      'localStorage',
      'featureFlags',
      initialValues,
    );

    expect(store.has('feature1')).toBe(true);
    expect(store.has('feature3')).toBe(false);
  });

  it('should create a storage store with initial values', () => {
    const initialValues = { feature1: true, feature2: false };
    const store = createStorageStore(
      'localStorage',
      'featureFlags',
      initialValues,
    );

    expect(store.get('feature1')).toBe(true);
    expect(store.get('feature2')).toBe(false);
  });

  it('should update a value in the storage store', () => {
    const initialValues = { feature1: true, feature2: false };
    const store = createStorageStore(
      'localStorage',
      'featureFlags',
      initialValues,
    );

    store.set('feature1', false);

    expect(store.get('feature1')).toBe(false);
    expect(store.get('feature2')).toBe(false);
  });

  it('should remove a value from the storage store', () => {
    const initialValues = { feature1: true, feature2: false };
    const store = createStorageStore(
      'localStorage',
      'featureFlags',
      initialValues,
    );

    store.delete('feature1');

    expect(store.get('feature1')).toBe(undefined);
    expect(store.get('feature2')).toBe(false);
  });

  it('should clear all values from the storage store', () => {
    const initialValues = { feature1: true, feature2: false };
    const store = createStorageStore(
      'localStorage',
      'featureFlags',
      initialValues,
    );

    store.clear();

    expect(store.get('feature1')).toBe(undefined);
    expect(store.get('feature2')).toBe(undefined);
  });

  it('should return all values from the storage store', () => {
    const initialValues = { feature1: true, feature2: false };
    const store = createStorageStore(
      'localStorage',
      'featureFlags',
      initialValues,
    );

    const allValues = store.getAll();

    expect(allValues).toEqual(initialValues);
  });

  it('should return undefined for a non-existent key', () => {
    const initialValues = { feature1: true, feature2: false };
    const store = createStorageStore(
      'localStorage',
      'featureFlags',
      initialValues,
    );

    expect(store.get('feature3')).toBe(undefined);
  });

  it('should return the correct value after updating it', () => {
    const initialValues = { feature1: true, feature2: false };
    const store = createStorageStore(
      'localStorage',
      'featureFlags',
      initialValues,
    );

    store.set('feature1', false);

    expect(store.get('feature1')).toBe(false);
    expect(store.get('feature2')).toBe(false);
  });

  it('should reset the storage store to initial values', () => {
    const initialValues = { feature1: true, feature2: false };
    const store = createStorageStore(
      'localStorage',
      'featureFlags',
      initialValues,
    );

    store.set('feature1', false);
    store.set('feature2', true);

    store.reset();

    expect(store.get('feature1')).toBe(true);
    expect(store.get('feature2')).toBe(false);
  });

  it('reset should remove keys in the storage if a initialValues is not provided', () => {
    const store = createStorageStore('localStorage', 'featureFlags');

    store.set('feature1', false);
    store.set('feature2', true);

    store.reset();

    expect(store.get('feature1')).toBe(undefined);
    expect(store.get('feature2')).toBe(undefined);
  });
});
