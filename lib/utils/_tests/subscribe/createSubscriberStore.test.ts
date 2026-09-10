import { describe, expect, it } from 'vitest';
import { createSubscriberStore } from '../../subscribe';

describe('createSubscriberStore function', () => {
  it('should create a subscriber store', () => {
    const store = createSubscriberStore();

    expect(store).toBeDefined();
  });

  it('should subscribe and notify subscribers', () => {
    const store = createSubscriberStore();

    let notified = false;

    const subscriber: () => void = () => {
      notified = true;
    };

    store.subscribe('subscriber', subscriber);
    store.notify('subscriber');

    expect(notified).toBe(true);
  });

  it('should be return an unsubscribe function', () => {
    const store = createSubscriberStore();

    let notified = false;

    const subscriber: () => void = () => {
      notified = true;
    };

    const unsubscribe = store.subscribe('subscriber', subscriber);
    unsubscribe();
    store.notify('subscriber');

    expect(notified).toBe(false);
  });

  it('should notify all subscribers', () => {
    const store = createSubscriberStore();

    let notified1 = false;
    let notified2 = false;

    const subscriber1: () => void = () => {
      notified1 = true;
    };

    const subscriber2: () => void = () => {
      notified2 = true;
    };

    store.subscribe('subscriber', subscriber1);
    store.subscribe('subscriber', subscriber2);
    store.notifyAll();

    expect(notified1).toBe(true);
    expect(notified2).toBe(true);
  });
});
