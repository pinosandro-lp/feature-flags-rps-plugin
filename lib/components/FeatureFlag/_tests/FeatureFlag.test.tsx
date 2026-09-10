import {
  configurePlugin,
  createPluginApp,
} from '@pinosandro/react-plugin-system';
import { render, screen } from '@testing-library/react';
import { FeatureFlag } from '../FeatureFlag.component';
import { describe, expect, it } from 'vitest';
import { featureFlagsPlugin as ffp } from '../../../plugin';

describe('FeatureFlag Component', () => {
  const featureFlagsPlugin = configurePlugin(ffp, {
    type: 'memory',
    initialFlags: {
      someFeature: true,
      anotherFeature: false,
      yetAnotherFeature: false,
    },
  });

  const PluginApp = createPluginApp({
    plugins: [featureFlagsPlugin],
    App: () => (
      <div>
        <FeatureFlag flag="someFeature">
          <div>Some Feature Enabled</div>
        </FeatureFlag>
        <FeatureFlag
          flag="anotherFeature"
          fallback={<div>Another Feature Disabled</div>}
        >
          <div>Another Feature Enabled</div>
        </FeatureFlag>
        <FeatureFlag flag="yetAnotherFeature">
          <div>Yet Another Feature Enabled</div>
        </FeatureFlag>
      </div>
    ),
  });

  it('should render children when the feature flag is enabled', () => {
    render(<PluginApp />);

    expect(screen.getByText(/some feature enabled/i)).toBeInTheDocument();
  });

  it('should render fallback when the feature flag is disabled', () => {
    render(<PluginApp />);

    expect(screen.getByText(/another feature disabled/i)).toBeInTheDocument();
  });

  it('should not render children when the feature flag is disabled', () => {
    render(<PluginApp />);

    expect(
      screen.queryByText(/yet another feature enabled/i),
    ).not.toBeInTheDocument();
  });
});
