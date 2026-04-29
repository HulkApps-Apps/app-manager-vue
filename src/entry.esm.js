
// Import vue components
import * as components from '@/components';

const defaultConfig = {
  baseUrl: ''
}
// install function executed by Vue.use()
const install = function installAppManagerVue(Vue, config = {}) {
  Object.entries(components).forEach(([componentName, component]) => {
    Vue.component(componentName, component);
  });

  Vue.prototype.app_manager_config = {...defaultConfig, ...config}
};

// Create module definition for Vue.use()
export default install;

export const SDK_VERSION = "3.1.18";
if (typeof window !== 'undefined') {
  window.APP_MANAGER_FRONTEND_SDK_VERSION = SDK_VERSION;
}

// To allow individual component use, export components
// each can be registered via Vue.component()
export * from '@/components';
