<script>
import Vue from 'vue';
// Uncomment import and local "components" registration if library is not registered globally.
import { Banners } from '@/entry.esm';
import { Plan } from '@/entry.esm';

export default Vue.extend({
  name: 'ServeDev',
  components: {
    Banners,
    Plan
  }
});
</script>

<template>
  <div id="app">
    <Banners type="header" />
    -------------------------------
    <Banners type="footer" />
    <Plan v-bind:shop_domain="'demo-chirag-parmar.myshopify.com'" />

  </div>
</template>
