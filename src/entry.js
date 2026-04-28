// iife/cjs usage extends esm default export - so import it all
import plugin, * as components from '@/entry.esm';

// Attach named exports directly to plugin. IIFE/CJS will
// only expose one global var, with component exports exposed as properties of
// that global var (eg. plugin.component)
Object.entries(components).forEach(([componentName, component]) => {
  if (componentName !== 'default') {
    plugin[componentName] = component;
  }
});

export const SDK_VERSION = "3.1.18";
if (typeof window !== 'undefined') {
  window.APP_MANAGER_SDK_VERSION = SDK_VERSION;
}

export default plugin;
