import {
  configurePlugin,
  createPluginApp,
} from '@pinosandro/react-plugin-system';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { featureFlagsPlugin as ffp } from '../../../plugin';
import { useFeatureFlags } from '../FeatureFlag.hooks';

describe('useFeatureFlags hook', () => {
  const featureFlagsPlugin = configurePlugin(ffp, {
    type: 'memory',
    initialFlags: {
      someFeature: true,
    },
  });

  function TestComponent({ flag }: { flag: string }): React.ReactElement {
    const enabled = useFeatureFlags(flag);

    return (
      <div>
        {flag}: {String(enabled)}
      </div>
    );
  }

  const PluginApp = createPluginApp({
    plugins: [featureFlagsPlugin],
    App: () => {
      return (
        <>
          <TestComponent flag="someFeature" />
          <TestComponent flag="nonExistentFeature" />
        </>
      );
    },
  });

  it('should return the correct feature flag value', () => {
    render(<PluginApp />);

    expect(screen.getByText(/someFeature: true/i)).toBeInTheDocument();
  });

  it('should return false for a non-existent feature flag', () => {
    render(<PluginApp />);

    expect(screen.getByText(/nonExistentFeature: false/i)).toBeInTheDocument();
  });
});
