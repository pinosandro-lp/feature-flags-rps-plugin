# 🔌 @pinosandro/feature-flags-rps-plugin

A feature flags plugin for React applications built on top of [@pinosandro/react-plugin-system](https://github.com/pinosandro-lp/react-plugin-system).

A simple and flexible solution for managing **_feature flags_**, with support for **different persistence strategies**.

## Installation

```bash
npm install @pinosandro/feature-flags-rps-plugin
```

## Setup

### Default Configuration

The plugin can be registered without any custom configuration:

```js
import { createPluginApp } from '@pinosandro/react-plugin-system';
import { featureFlagsPlugin } from '@pinosandro/feature-flags-rps-plugin';
import { App } from './App';

const PluginApp = createPluginApp({
  plugins: [featureFlagsPlugin],
  App,
});
```

This approach is **not recommended** because it relies on the plugin's default configuration. By default, the plugin uses in-memory persistence and no initial feature flags are defined. This means that feature flags **must be explicitly initialized** before they can be used.

### Configured Plugin

The **recommended approach** is to configure the plugin explicitly using `configurePlugin`:

```js
import {
  configurePlugin,
  createPluginApp,
} from '@pinosandro/react-plugin-system';
import { featureFlagsPlugin as ffp } from '@pinosandro/feature-flags-rps-plugin';
import { App } from './App';

const featureFlagsPlugin = configurePlugin(ffp, {
  type: 'localStorage',
  initialFlags: {
    'example-flag': true,
  },
});

const PluginApp = createPluginApp({
  plugins: [featureFlagsPlugin],
  App,
});
```

This makes the plugin configuration explicit and allows you to define the persistence strategy, initial feature flags, and other options in one place.

### Configuration Recommendation

For larger applications, consider keeping plugin configuration in one or more dedicated files rather than defining everything directly in the application entry point.

A basic project structure could look like this:

```
src/
├── plugins/
│   ├── featureFlags.ts
│   └── index.ts
├── App.tsx
└── main.tsx
```

This keeps the application entry point clean and makes plugin configuration easier to find, review, and maintain as the number of plugins grows.

## Persistence Strategies

The plugin supports four persistence strategies through the `type` option:

- **memory**
- **sessionStorage**
- **localStorage**
- **custom**

Each strategy determines how and for how long feature flag values are stored.

When using a built-in strategy, `initialFlags` can be provided to define the feature flags available when the application starts.

### Choosing a Strategy

The appropriate strategy depends on how long feature flag values should persist:

| Strategy         | Persistence             | Typical use case                           |
| ---------------- | ----------------------- | ------------------------------------------ |
| `memory`         | Application instance    | Runtime-only flags                         |
| `sessionStorage` | Current browser session | Flags that should survive page reloads     |
| `localStorage`   | Across browser sessions | Flags that should persist between sessions |
| `custom`         | Application-defined     | Custom or overridden persistence behavior  |

### Memory

```js
const featureFlagsPlugin = configurePlugin(ffp, {
  type: 'memory',
  initialFlags: {
    'example-flag': true,
  },
});
```

### Session/Local Storage

When using `sessionStorage` or `localStorage`, the `storageKey` option specifies the key used to store the feature flags.

This allows you to control where the flags are stored and avoid conflicts with other data stored by the application.

```js
const featureFlagsPlugin = configurePlugin(ffp, {
  type: 'sessionStorage', // or "localStorage"
  storageKey: 'my-feature-flags',
  initialFlags: {
    'example-flag': true,
  },
});
```

### Custom

The `custom` strategy allows you to provide your own persistence implementation.

Use it when you need a persistence mechanism that is not covered by the built-in strategies, or when you want to redefine the behavior of one of the existing `memory`, `sessionStorage`, or `localStorage` strategies.

```js
const featureFlagsPlugin = configurePlugin(ffp, {
  type: 'custom',
  initialFlags: {
    'example-flag': true,
  },
  createCustomStore: initialFlags => {
    // This is a custom store implementation for the feature flags plugin.
  },
});
```

## Usage

Use the `FeatureFlag` component to conditionally render content based on a feature flag:

```jsx
<FeatureFlag flag={FEATURE_FLAG_EXAMPLE} fallback={<LegacyComponent />}>
  <NewComponent />
</FeatureFlag>
```

The `fallback` prop is optional. If it is not provided, `null` is rendered when the feature flag is disabled.

For programmatic access, use the **plugin API**:

```js
export function Example() {
  const featureFlagApi = usePluginApi(FEATURE_FLAGS_PLUGIN_ID);

  const handleToggle = () => {
    featureFlagApi.toggle(FEATURE_FLAG_EXAMPLE);
  };

  // ...
}
```

## APIs

| API                        | Description                                                                                                                                      |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `isEnabled(key)`           | Checks whether a feature flag is enabled.                                                                                                        |
| `get(key)`                 | Returns the value of a feature flag, or `undefined` if it does not exist.                                                                        |
| `getAll()`                 | Returns all feature flags and their values.                                                                                                      |
| `set(key, value)`          | Sets the value of a feature flag.                                                                                                                |
| `toggle(key)`              | Toggles the value of a feature flag.                                                                                                             |
| `remove(key)`              | Removes a feature flag.                                                                                                                          |
| `clear()`                  | Removes all feature flags.                                                                                                                       |
| `subscribe(key, callback)` | Subscribes to changes to a feature flag. This is primarily intended for internal use by `FeatureFlag` and should generally not be used directly. |

## TypeScript

The plugin is written in TypeScript and provides type definitions out of the box.

No additional **@types** package is required.

## License

Licensed under [MIT](./LICENSE).
