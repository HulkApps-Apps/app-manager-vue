<template>
  <PLayoutSection class="app-manager-plan-footer"
                  v-if="filteredPlans && filteredPlans.length">
    <div v-for="(plan, key) in filteredPlans" :key="key">
      <PBanner
          v-if="plan.type === 'banner'"
          :id="`static-content-${plan.position}-${key}`"
          :status="plan.status"
          @dismiss="() => dismissBanner(key)"
      >
        <div v-html="translateMe(plan.content)"></div>
      </PBanner>
      <div v-else v-html="translateMe(plan.content)"></div>
    </div>
  </PLayoutSection>
</template>

<script>
import axios from 'axios'
import { PLayoutSection } from "../polaris-vue/src/components/PLayout/components/PLayoutSection";
import { PBanner } from "../polaris-vue/src/components/PBanner";

export default {
  components: { PBanner, PLayoutSection },
  name: "PlanBanners",
  props: {
    position: {
      type: String,
      validator(value) {
        return ['header', 'footer'].includes(value)
      },
      default: 'header'
    },
  },
  data() {
    return {
      staticContent: {}
    }
  },
  computed: {
    filteredPlans() {
      if (!this.staticContent || !this.staticContent.plans) {
        return [];
      }
      return this.staticContent.plans
          .flat() // Flatten the array of plans if they are nested
          .filter(plan => plan.position === this.position);
    },
  },
  methods: {
    translateMe(message) {
      return this.$translations.hasOwnProperty(message) ? this.$translations[message] : message;
    },
    dismissBanner(key) {
      this.$emit('handlePlanBannerClose', { action: 'close', type: 'plan banners' });
      let planIndex = this.filteredPlans.findIndex((plan, index) => index === key);
      if (planIndex !== -1) {
        this.staticContent.plans.splice(planIndex, 1);
      }
    },
  },
  async mounted() {
    const { data } = await axios.get(`${this.app_manager_config.baseUrl}/api/app-manager/marketing-banners`).catch(error => {
      console.error(error)
    });

    this.staticContent = data.banners || {};
  }
}
</script>

<style scoped>
.app-manager-plan-footer.Polaris-Layout__Section {
  margin-bottom: 20px;
}
</style>
