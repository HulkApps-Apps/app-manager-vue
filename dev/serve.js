import Vue from 'vue';
import Dev from './serve.vue';
// To register individual components where they are used (serve.vue) instead of using the
// library as a whole, comment/remove this import and it's corresponding "Vue.use" call

import '../dist/hulkapps-app-manager.css';

//import AppManagerVue from '@/entry.esm';
// Vue.use(AppManagerVue);
//Vue.use(AppManagerVue, {baseUrl: 'https://subscription-plus.localhost'});

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(Dev),
}).$mount('#app');
