<script>
import VariantButton from "./VariantButton.vue";
import Swiper, { Navigation, Pagination } from "swiper";
import "swiper/swiper-bundle.css";

export default {
  name: "PlanTable",
  components: {
    VariantButton,
  },
  props: {
    plans: {
      type: Array,
      required: true,
    },
  },
  methods: {
    handleClick() {
      event.preventDefault();
      this.$emit("click", event);
    },
    translateMe(message) {
      return this.$translations.hasOwnProperty(message)
        ? this.$translations[message]
        : message;
    },
    hasFeature(plan, feature) {
      const featuresArray = Array.isArray(plan.features)
        ? plan.features
        : Object.values(plan.features);
      return featuresArray.some((f) => f.feature_id === feature.feature_id);
    },
    syncHeights() {
      console.log("Syncing heights");
      const featureNames = document.querySelectorAll(".table-feature-name");
      const features = document.querySelectorAll(".table-feature");

      featureNames.forEach((featureName, index) => {
        const feature = features[index];
        if (featureName && feature) {
          // Set the height of the `.feature` element to match the `.feature-name`
          feature.style.height = `${featureName.offsetHeight}px`;
        }
      });
    },
  },

  computed: {
    monthlyPlans() {
      return this.plans.filter((plan) => plan.interval === "EVERY_30_DAYS");
    },
    annualPlans() {
      return this.plans.filter((plan) => plan.interval === "ANNUAL");
    },
    annualPlansFeatures() {
      let plansWithFeatures = this.annualPlans.flatMap((plan) => plan.features);
      let allFeatures = [];
      let seenIds = new Set();
      plansWithFeatures.forEach((plan) => {
        Object.keys(plan).forEach((featureKey) => {
          const feature = plan[featureKey];
          if (!seenIds.has(feature.feature_id)) {
            allFeatures.push(feature);
            seenIds.add(feature.feature_id);
          }
        });
      });
      return allFeatures;
    },
  },

  mounted() {
    new Swiper(this.$refs.swiperAnnuallyTable, {
      modules: [Navigation, Pagination],
      loop: false,
      slidesPerView: 3,
      speed: 500,
      pagination: {
        el: ".swiper-table-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper-plan-next",
        prevEl: ".swiper-plan-prev",
      },
      // After Swiper initialization, synchronize the heights
      on: {
        slideChange: this.syncHeights, // Sync heights after each slide change
      },
    });

    // Sync heights once on mount as well
    this.syncHeights();
  },
};
</script>

<template>
  <div class="container">
    <div class="pricing-table">
      <div class="pricing-table-inner__left">
        <div class="table-header">
          {{ plans.length }} {{ translateMe("Plans available") }}
        </div>
        <div
          class="plan-feature-name"
          v-for="(feature, index) in annualPlansFeatures"
          :key="feature.id"
        >
          {{ feature.name }}
        </div>
      </div>
      <div class="swiper plans annually" ref="swiperAnnuallyTable">
        <div class="swiper-wrapper">
          <div
            v-for="(plan, index) in annualPlans"
            :key="plan.id"
            class="swiper-slide"
          >
            <h1>
              {{ plan.name }}
            </h1>
            <div
              class="plan-feature"
              v-for="(feature, index) in annualPlansFeatures"
              :key="feature.id"
            >
              <img
                src="../../assets/CheckTrue.svg"
                alt="Checkmark True"
                class="plan-table-checkmark"
                v-if="hasFeature(plan, feature)"
              />
              <img
                src="../../assets/CheckFalse.svg"
                alt="Checkmark False"
                class="plan-table-checkmark"
                v-if="!hasFeature(plan, feature)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  padding-right: 20px;
}
.pricing-table {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(3, 1fr);
  padding: 16px;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0px 4px 6px -1px #0000001a;
}
.plans {
  grid-column: span 2;
}
.pricing-table-inner__left {
  display: flex;
  flex-direction: column;
}
.swiper {
  width: 100%;
  height: 100%;
}
.table-header {
  font-size: 13px;
  font-weight: 700;
  line-height: 20px;
  color: #303030;
  background-color: #f1f1f1;
  padding: 16px;
  border-bottom: 1px solid #e3e3e3;
}
.plan-feature-name {
  font-size: 13px;
  font-weight: 450;
  padding: 12px;
  border-bottom: 1px solid #e3e3e3;
  border-left: 1px solid #e3e3e3;
}
.plan-table-checkmark {
  width: 20px;
  height: 20px;
}
</style>
