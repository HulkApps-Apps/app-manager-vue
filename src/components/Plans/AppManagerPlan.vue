<template>
  <AppManagerGroupPlan  @handlePlanSelect="handlePlanSelect" @handlePlanBannerClose="handlePlanBannerClose" v-if="group_plan"
                       :shop_domain="shop_domain" :host="host"></AppManagerGroupPlan>
  <AppManagerSliderPlan @handlePlanSelect="handlePlanSelect" @handlePlanBannerClose="handlePlanBannerClose" v-else :shop_domain="shop_domain" :host="host"></AppManagerSliderPlan>
</template>

<script>
import AppManagerGroupPlan from "./AppManagerGroupPlan";
import AppManagerSliderPlan from "./AppManagerSliderPlan";
import Vue from "vue";
import install from "@/entry.esm";

export default {
  name: "AppManagerPlan",
  components: {AppManagerSliderPlan, AppManagerGroupPlan},
  props: {
    shop_domain: {
      type: String
    },
    group_plan: {
      type: Boolean,
      default: false
    },
    base_url: {
      type: String,
      default: null
    },
    host:{
      type: String,
      default: null
    },
    translations:{
      type: Object,
      default: {}
    }
  },
  methods: {
    handlePlanSelect(payload) {
      this.$emit('handlePlanSelect', payload)
      this.$emit('handle-plan-select', payload)
    },
    handlePlanBannerClose(payload) {
      this.$emit('handlePlanBannerClose', payload)
      this.$emit('handle-plan-banner-close', payload)
    }
  },
  created() {
    Vue.prototype.$translations = (Object.keys(this.translations).length > 0)?this.translations:{};
    if (this.base_url != null) {
      let config = {
        baseUrl: this.base_url
      }
      install(Vue, config)
    }
  }
}
</script>

<style scoped>

</style>