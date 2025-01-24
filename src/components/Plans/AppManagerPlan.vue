<template>
  <AppManagerGroupPlan  @handlePlanSelect="handlePlanSelect" @handlePlanBannerClose="handlePlanBannerClose" v-if="group_plan"
                       :shop_domain="shop_domain" :host="host" :discount_code="discount_code"></AppManagerGroupPlan>
  <AppManagerSliderPlan @handlePlanSelect="handlePlanSelect" @handlePlanBannerClose="handlePlanBannerClose" v-else :shop_domain="shop_domain" :host="host" :discount_code="discount_code"
                        :is_customizable="is_customizable"
                        @handleCustomizePlan="handleCustomizePlan"
  ></AppManagerSliderPlan>
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
    discount_code: {
      type: String,
      default: null
    },
    is_customizable: {
      type: Boolean,
      default: false
    },
    translations:{
      type: Object,
      default() {
        return {'hulkapps' : 'hulkapps'}
      }
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
    },
    handleCustomizePlan(){
      this.$emit('handleCustomizePlan')
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