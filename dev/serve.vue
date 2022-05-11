<script>
import Vue from 'vue';
// Uncomment import and local "components" registration if library is not registered globally.
// import { Banners } from '@/entry.esm';
// import { AppManagerPlan } from '@/entry.esm';
// import { PlanBanners } from '@/entry.esm';
import { PBadge } from "../src/components/polaris-components/components/PBadge";

export default Vue.extend({
  name: 'ServeDev',
  components: {
    badge: PBadge,
    // PlanBanners,
    // Banners,
    // AppManagerPlan
  }
});
</script>

<template>
  <div id="app">
    <badge status="success">badge</badge>
<!--    <Banners type="header" />-->
<!--    -&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;-->
<!--    <Banners type="footer" />-->
<!--    <AppManagerPlan v-bind:shop_domain="'demo-chirag-parmar.myshopify.com'" />-->

  </div>
</template>
