<script>
import Vue from 'vue';
// Uncomment import and local "components" registration if library is not registered globally.
import { Banners } from '@/entry.esm';
import { AppManagerPlan } from '@/entry.esm';
import { AppManagerSliderPlan } from '@/entry.esm';
import { PlanBanners } from '@/entry.esm';
import { PBadge } from "../src/components/polaris-vue/src/components/PBadge";
import PCard from "@/components/polaris-vue/src/components/PCard/PCard";
import PPage from "@/components/polaris-vue/src/components/PPage/PPage";
import PDisplayText from "@/components/polaris-vue/src/components/PDisplayText/PDisplayText";

export default Vue.extend({
  name: 'ServeDev',
  components: {
    PDisplayText,
    PPage,
    PCard,
    PBadge,
    PlanBanners,
    Banners,
    AppManagerPlan,
    AppManagerSliderPlan
  },
  methods: {
    handlePlanSelect(payload) {

      if (payload.chose_later && payload.chose_later === true) {
        //handle chose_later
      }
    }
  }
});
</script>

<template>
  <div>
    <h1>Test</h1>
    <div id="app" class="app-manager">
      <div class="app-manager-body">
        <Banners type="header" />
        <Banners type="footer" />
        <AppManagerPlan @handlePlanSelect="handlePlanSelect" v-bind:shop_domain="'demo-chirag-parmar.myshopify.com'" />
        <AppManagerSliderPlan v-bind:shop_domain="'demo-chirag-parmar.myshopify.com'" />
      </div>
    </div>
  </div>
</template>
