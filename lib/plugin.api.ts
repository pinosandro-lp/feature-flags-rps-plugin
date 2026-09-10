/**
 * Feature Flags Plugin API
 * Defines the interface for interacting with feature flags within the application.
 */
export interface FeatureFlagsApi {
  /**
   * Checks if a feature flag is enabled.
   * @param key The key of the feature flag.
   * @returns True if the feature flag is enabled, false otherwise.
   */
  isEnabled(key: string): boolean;
  /**
   * Gets the value of a feature flag.
   * @param key The key of the feature flag.
   * @returns The value of the feature flag, or undefined if it doesn't exist.
   */
  get(key: string): boolean | undefined;
  /**
   * Gets all feature flags.
   * @returns An object containing all feature flags and their values.
   */
  getAll(): Record<string, boolean>;
  /**
   * Sets the value of a feature flag.
   * @param key The key of the feature flag.
   * @param value The value to set for the feature flag.
   */
  set(key: string, value: boolean): void;
  /**
   * Toggles the value of a feature flag.
   * @param key The key of the feature flag.
   */
  toggle(key: string): void;
  /**
   * Removes a feature flag.
   * @param key The key of the feature flag.
   */
  remove(key: string): void;
  /**
   * Clears all feature flags.
   */
  clear(): void;
  /**
   * Subscribes to changes for a specific feature flag.
   * @param key The key of the feature flag.
   * @param callback The callback to invoke when the feature flag changes.
   * @returns A function to unsubscribe from the changes.
   */
  subscribe(key: string, callback: () => void): () => void;
}
