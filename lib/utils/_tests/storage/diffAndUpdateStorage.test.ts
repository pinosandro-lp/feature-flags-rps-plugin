import { beforeEach, describe, expect, it } from 'vitest';
import { diffAndUpdateStorage } from '../../storage';

const STORAGE_KEY = 'featureFlags';
const INITIAL_STORAGE_KEY = 'featureFlags_initial_flags';

describe('diffAndUpdateStorage', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('should correctly diff and update storage', () => {
    const initialStorage = { feature1: true, feature2: false };

    localStorage.setItem(INITIAL_STORAGE_KEY, JSON.stringify(initialStorage));

    const newValues = { feature1: false, feature3: true };

    diffAndUpdateStorage(
      localStorage,
      STORAGE_KEY,
      INITIAL_STORAGE_KEY,
      newValues,
    );

    const updatedStorage = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || '{}',
    );

    expect(updatedStorage).toEqual({
      feature1: false,
      feature3: true,
    });

    expect(
      JSON.parse(localStorage.getItem(INITIAL_STORAGE_KEY) || '{}'),
    ).toEqual({
      feature1: false,
      feature3: true,
    });
  });

  it('should handle empty initial storage', () => {
    const newValues = { feature1: true };

    diffAndUpdateStorage(
      localStorage,
      STORAGE_KEY,
      INITIAL_STORAGE_KEY,
      newValues,
    );

    const updatedStorage = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || '{}',
    );

    expect(updatedStorage).toEqual({
      feature1: true,
    });

    expect(
      JSON.parse(localStorage.getItem(INITIAL_STORAGE_KEY) || '{}'),
    ).toEqual({
      feature1: true,
    });
  });

  it('should handle missing new values', () => {
    const initialStorage = { feature1: true };

    localStorage.setItem(INITIAL_STORAGE_KEY, JSON.stringify(initialStorage));

    diffAndUpdateStorage(localStorage, STORAGE_KEY, INITIAL_STORAGE_KEY, {});

    const updatedStorage = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || '{}',
    );

    expect(updatedStorage).toEqual({});

    expect(
      JSON.parse(localStorage.getItem(INITIAL_STORAGE_KEY) || '{}'),
    ).toEqual({});
  });

  it('should handle both empty initial storage and missing new values', () => {
    diffAndUpdateStorage(localStorage, STORAGE_KEY, INITIAL_STORAGE_KEY, {});

    const updatedStorage = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || '{}',
    );

    expect(updatedStorage).toEqual({});

    expect(
      JSON.parse(localStorage.getItem(INITIAL_STORAGE_KEY) || '{}'),
    ).toEqual({});
  });

  it('should handle a change in initial storage', () => {
    const initialStorage = { feature1: true };
    localStorage.setItem(INITIAL_STORAGE_KEY, JSON.stringify(initialStorage));

    const newValues = { feature1: false, feature2: true };

    diffAndUpdateStorage(
      localStorage,
      STORAGE_KEY,
      INITIAL_STORAGE_KEY,
      newValues,
    );

    const updatedStorage = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || '{}',
    );

    expect(updatedStorage).toEqual({
      feature1: false,
      feature2: true,
    });

    expect(
      JSON.parse(localStorage.getItem(INITIAL_STORAGE_KEY) || '{}'),
    ).toEqual({
      feature1: false,
      feature2: true,
    });
  });
});
