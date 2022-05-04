import Vue from 'vue';
import Dev from './serve.vue';
// To register individual components where they are used (serve.vue) instead of using the
// library as a whole, comment/remove this import and it's corresponding "Vue.use" call

import '@hulkapps/polaris-vue/dist/polaris-vue.css';
import PolarisVue from '@hulkapps/polaris-vue';

Vue.use(PolarisVue);

import AppManagerVue from '@/entry.esm';
Vue.use(AppManagerVue);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(Dev),
}).$mount('#app');
