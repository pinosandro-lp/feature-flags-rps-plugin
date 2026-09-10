import React from 'react';
import { useFeatureFlags } from './FeatureFlag.hooks';

/**
 * Feature Flag Component Props
 * @property flag - The name of the feature flag to check.
 * @property fallback - Optional content to render if the feature flag is disabled.
 */
export interface FeatureFlagProps extends React.PropsWithChildren {
  /**
   * The name of the feature flag to check.
   */
  flag: string;
  /**
   * Optional content to render if the feature flag is disabled.
   */
  fallback?: React.ReactNode;
}

/**
 * Feature Flag Component
 * Renders its children if the specified feature flag is enabled.
 * Otherwise, it renders the optional fallback content or null if no fallback is provided.
 */
export function FeatureFlag(props: FeatureFlagProps): React.ReactElement {
  const { children, flag, fallback = null } = props;

  const isEnabled = useFeatureFlags(flag);

  return isEnabled ? <>{children}</> : <>{fallback}</>;
}
