<script>
import VariantButton from "./VariantButton";

export default {
  name: "BundlePlanCard",
  components: {
    VariantButton,
  },
  props: {
    plan: {
      type: Object,
      required: true,
    },
    plan_details: {
      type: Array,
      required: true,
    },
  },
  methods: {
    handlePlanClick(plan) {
      this.$emit("plan-clicked", 'bundle');
    },
    translateMe(message) {
      return this.$translations.hasOwnProperty(message)
        ? this.$translations[message]
        : message;
    },
  },
  computed: {
    allApps() {
      return this.plan_details.flatMap((category) => category.apps_relation);
    },
    totalAppsCount() {
      return this.allApps.length;
    },
  },
  // computed: {
  //   isSlotEmpty() {
  //     return !this.$slots.default;
  //   },
  // },
};
</script>

<template>
  <div class="block">
    <div class="bundle-header">
      <h3>{{ translateMe("Bundle") }}</h3>
      <div class="bundle-price-wrapper">
        <div style="display: flex; align-items: center; gap: 4px">
          <h2>${{ Number(plan.price - plan.discount).toFixed(2) }}</h2>
          <span class="mo-label">/{{ translateMe("mo") }}</span>
          <h4>${{ Number(plan.price).toFixed(2) }}</h4>
        </div>
        <span class="apps-count">{{ allApps.length }} {{ translateMe("Apps") }}</span>
      </div>
    </div>
    <div class="apps-list">
      <div v-for="(app, index) in allApps" :key="app.id + '_' + index" class="app">
        <template v-if="index <= 10">
          <img
            :src="app.app_logo_url"
            :alt="`${app.app_name} Logo`"
            width="24"
            height="24"
          />
          <h5>{{ translateMe(app.app_name) }}</h5>
        </template>
        <template v-else-if="index === 11">
          <h5 class="more-apps-label">+ {{ allApps.length - 11 }} {{ translateMe('More apps') }}</h5>
        </template>
      </div>
    </div>
    <VariantButton @click="handlePlanClick('bundle')" variant="primary" class="button">{{
      translateMe("Start saving now")
    }}</VariantButton>
  </div>
</template>

<style scoped>
.block {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  gap: 16px;
  padding: 20px;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0px 4px 6px -1px #0000001a;
  border: 1px solid #e5e5e5;
}
.button {
  /* width: 261px !important; */
  width: 100% !important;
  display: flex !important;
  height: fit-content !important;
  justify-content: center !important;
}
.bundle-header {
  display: flex;
  gap: 8px;
  border-bottom: 1px solid #e3e3e3;
  padding-bottom: 12px;
  align-items: center;
}
.bundle-price-wrapper {
  display: flex;
  gap: 8px;
  align-items: center;
  width: 100%;
}
.bundle-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: #1A1A1A;
}
.bundle-header h2 {
  font-size: 30px;
  font-weight: 700;
  color: #1A1A1A;
}
.bundle-header .mo-label {
  font-size: 13px;
  font-weight: 400;
  color: #4A4A4A;
}
.bundle-header h4 {
  font-size: 13.5px;
  font-weight: 700;
  color: #4A4A4A;
  text-decoration: line-through;
}
.bundle-header .apps-count {
  background-color: #91d0ff;
  border-radius: 8px;
  padding: 2px 8px;
  font-size: 12px;
  line-height: 16px;
  font-weight: 550;
  color: #00527c;
}
.apps-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.apps-list .app {
  display: flex;
  flex-basis: calc(33% - 8px);
  align-items: center;
  gap: 8px;
}
.more-apps-label {
    font-size: 13px;
    font-weight: 700;
    color: #1A1A1A;
}
@media (max-width: 767px) {
  .apps-list .app {
    flex-basis: calc(50% - 8px);
  }
}
@media (max-width: 540px) {
  .apps-list .app {
    flex-basis: 100%;
  }

  .bundle-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
}
</style>
