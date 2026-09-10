import React from 'react';
import { usePluginApi } from '@pinosandro/react-plugin-system';
import { FEATURE_FLAGS_PLUGIN_ID } from '../../plugin';

/**
 * Hook to check the status of a feature flag.
 * @param flag - The name of the feature flag to check.
 * @returns A boolean indicating whether the feature flag is enabled.
 */
export function useFeatureFlags(flag: string): boolean {
  const featureFlagsApi = usePluginApi(FEATURE_FLAGS_PLUGIN_ID);

  return React.useSyncExternalStore(
    callback => featureFlagsApi.subscribe(flag, callback),
    () => featureFlagsApi.isEnabled(flag),
  );
}
