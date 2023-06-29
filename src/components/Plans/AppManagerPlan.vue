<template>
  <AppManagerGroupPlan @handlePlanSelect="handlePlanSelect" v-if="group_plan"
                       :shop_domain="shop_domain"></AppManagerGroupPlan>
  <AppManagerSliderPlan @handlePlanSelect="handlePlanSelect" v-else :shop_domain="shop_domain"></AppManagerSliderPlan>
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
    }
  },
  methods: {
    handlePlanSelect(payload) {
      this.$emit('handlePlanSelect', payload)
      this.$emit('handle-plan-select', payload)

    }
  },
  created() {
    if(this.base_url != null){
      let config = {
        baseUrl: this.base_url
      }
      install(Vue,config)
    };
  }
}
</script>

<style scoped>

</style>