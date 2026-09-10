/**
 * Creates a subscriber store for managing subscriptions to feature flag changes.
 * Each key can have multiple subscribers, and subscribers are notified when the corresponding key changes.
 * @returns An object with `subscribe`, `notify`, and `notifyAll` methods for managing subscriptions.
 */
export function createSubscriberStore(): {
  subscribe: (key: string, subscriber: () => void) => () => void;
  notify: (key: string) => void;
  notifyAll: () => void;
} {
  const subscribers = new Map<string, Set<() => void>>();

  return {
    subscribe(key: string, subscriber: () => void) {
      let keySubscribers = subscribers.get(key);

      if (!keySubscribers) {
        keySubscribers = new Set();
        subscribers.set(key, keySubscribers);
      }

      keySubscribers.add(subscriber);

      return () => {
        keySubscribers.delete(subscriber);

        if (keySubscribers.size === 0) {
          subscribers.delete(key);
        }
      };
    },

    notify(key: string): void {
      subscribers.get(key)?.forEach(subscriber => subscriber());
    },

    notifyAll(): void {
      subscribers.forEach(subscriberSet => {
        subscriberSet.forEach(subscriber => subscriber());
      });
    },
  };
}
