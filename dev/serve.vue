<script>
import Vue from 'vue';
// Uncomment import and local "components" registration if library is not registered globally.
import { Banners } from '@/entry.esm';
import { AppManagerPlan } from '@/entry.esm';
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
    Banners,
    AppManagerPlan
  },
  data() {
    return {
      translations:{
        "Plans" : "Planss",
        "Unlimited Plan" : "Unlimited Plan My",
        "Free" : "Free 1",
        "Grid" : "Gridd",
        "mnb" : "MNB",
        "This is html" : "This is html 001",
        "Title" : "Title eng",
        '<p>Contents</p>' : '<p>Contents eng</p>',
      }
    };
  },
  methods: {
    handlePlanSelect(payload) {

      if (payload.choose_later && payload.choose_later === true) {
        //handle choose_later
      }
      if (payload.free_plan && payload.free_plan === true) {
        //handle free_plan selection
      }
    },
    beforeCreate() {
    }
  }
});
</script>

<template>
  <div>
    <h1>Test</h1>
    <div id="app" class="app-manager">
      <div class="app-manager-body">
        <Banners :translations="translations" type="header" base_url="https://redirects.localhost"/>
        <Banners :translations="translations" type="footer" base_url="https://redirects.localhost"/>
        <AppManagerPlan :translations="translations"  @handlePlanSelect="handlePlanSelect" :shop_domain="'demo-chirag-parmar.myshopify.com'" base_url="https://redirects.localhost" shop_host="asd"/>
      </div>
    </div>
  </div>
</template>
