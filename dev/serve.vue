<script>
import Vue from 'vue';
// Uncomment import and local "components" registration if library is not registered globally.
import { Banners } from '@/entry.esm';
import { AppManagerPlan } from '@/entry.esm';
import { PlanBanners } from '@/entry.esm';
import { PBadge } from "../src/components/polaris-vue/src/components/PBadge";

export default Vue.extend({
  name: 'ServeDev',
  components: {
    PBadge,
    PlanBanners,
    Banners,
    AppManagerPlan
  }
});
</script>

<template>
  <div id="app">
    <PBadge status="success">badge</PBadge>
    <Banners type="header" />
    <Banners type="footer" />
    <AppManagerPlan v-bind:shop_domain="'demo-chirag-parmar.myshopify.com'" />

  </div>
</template>
