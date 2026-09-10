import { describe, expect, it, vi } from 'vitest';
import { createApiClient } from './plugin.client';

describe('createApiClient function', () => {
  it('should create an API client with default options', () => {
    const apiClient = createApiClient({}, {});

    expect(apiClient).toHaveProperty('isEnabled');
    expect(apiClient).toHaveProperty('get');
    expect(apiClient).toHaveProperty('getAll');
    expect(apiClient).toHaveProperty('set');
    expect(apiClient).toHaveProperty('remove');
    expect(apiClient).toHaveProperty('clear');
    expect(apiClient).toHaveProperty('toggle');
  });

  it('should create an API client with initial flags', () => {
    const initialFlags = { featureA: true, featureB: false };
    const apiClient = createApiClient({}, { initialFlags });

    expect(apiClient.get('featureA')).toBe(true);
    expect(apiClient.get('featureB')).toBe(false);
  });

  it('should check if a feature flag is enabled', () => {
    const initialFlags = { featureA: true, featureB: false };
    const apiClient = createApiClient({}, { initialFlags });

    expect(apiClient.isEnabled('featureA')).toBe(true);
    expect(apiClient.isEnabled('featureB')).toBe(false);
    expect(apiClient.isEnabled('featureC')).toBe(false);
  });

  it('should get a feature flag value', () => {
    const initialFlags = { featureA: true, featureB: false };
    const apiClient = createApiClient({}, { initialFlags });

    expect(apiClient.get('featureA')).toBe(true);
    expect(apiClient.get('featureB')).toBe(false);
    expect(apiClient.get('featureC')).toBeUndefined();
  });

  it('should get all feature flags', () => {
    const initialFlags = { featureA: true, featureB: false };
    const apiClient = createApiClient({}, { initialFlags });

    expect(apiClient.getAll()).toEqual(initialFlags);
  });

  it('should set a feature flag', () => {
    const apiClient = createApiClient({}, {});

    apiClient.set('featureA', true);

    expect(apiClient.get('featureA')).toBe(true);
  });

  it('should toggle a feature flag', () => {
    const initialFlags = { featureA: true };
    const apiClient = createApiClient({}, { initialFlags });

    apiClient.toggle('featureA');
    expect(apiClient.get('featureA')).toBe(false);

    apiClient.toggle('featureA');
    expect(apiClient.get('featureA')).toBe(true);
  });

  it('should remove a feature flag', () => {
    const initialFlags = { featureA: true };
    const apiClient = createApiClient({}, { initialFlags });

    apiClient.remove('featureA');

    expect(apiClient.get('featureA')).toBeUndefined();
  });

  it('should clear all feature flags', () => {
    const initialFlags = { featureA: true, featureB: false };
    const apiClient = createApiClient({}, { initialFlags });

    apiClient.clear();

    expect(apiClient.getAll()).toEqual({});
  });

  it('should subscribe to feature flag changes', () => {
    const initialFlags = { featureA: true };
    const apiClient = createApiClient({}, { initialFlags });

    const callback = vi.fn();
    const unsubscribe = apiClient.subscribe('featureA', callback);

    apiClient.set('featureA', false);
    expect(callback).toHaveBeenCalled();

    unsubscribe();

    apiClient.set('featureA', true);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should not notify subscribers if the value does not change', () => {
    const initialFlags = { featureA: true };
    const apiClient = createApiClient({}, { initialFlags });

    const callback = vi.fn();
    apiClient.subscribe('featureA', callback);

    apiClient.set('featureA', true);

    expect(callback).not.toHaveBeenCalled();
  });

  it('should return undefined for non-existent feature flags', () => {
    const apiClient = createApiClient({}, {});

    expect(apiClient.get('nonExistentFlag')).toBeUndefined();
  });

  it('should remove and toggle not notify subscribers if the value does not change', () => {
    const initialFlags = { featureA: true };
    const apiClient = createApiClient({}, { initialFlags });

    const callback = vi.fn();
    apiClient.subscribe('featureA', callback);

    apiClient.remove('featureA');

    expect(callback).toHaveBeenCalledTimes(1);

    apiClient.remove('featureA');
    apiClient.toggle('featureA');

    expect(callback).toHaveBeenCalledTimes(1);
  });
});
