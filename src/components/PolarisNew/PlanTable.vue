<script>
import Swiper, { Navigation, Pagination } from "swiper";
import "swiper/swiper-bundle.css";
import VariantButton from "./VariantButton";

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
    handlePlanClick(plan) {
      this.$emit("plan-clicked", plan);
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
    syncHeights(which = "features") {
      this.$nextTick(() => {
        setTimeout(() => {
          const slides = document.querySelectorAll(".swiper-slide");
          if (which === "features") {
            const featureNames =
              document.querySelectorAll(".plan-feature-name");
            slides.forEach((slide) => {
              const features = slide.querySelectorAll(".plan-feature");
              featureNames.forEach((featureName, index) => {
                const feature = features[index];
                if (featureName && feature) {
                  feature.style.height = `${featureName.offsetHeight}px`;
                }
              });
            });
          } else if (which === "plans") {
            const planNames = document.querySelectorAll(".plan-header-wrapper");
            const plansAvailableName =
              document.querySelector(".plans-available");
            let planNameHeight = 0;
            slides.forEach((slide, index) => {
              const planName = planNames[index];
              if (planName) {
                planNameHeight = Math.max(
                  planName.offsetHeight,
                  planNameHeight
                );
              }
              plansAvailableName.style.height = `${planNameHeight}px`;
            });
          }
        }, 0); // delay 0ms
      });
    },
    syncAllHeights() {
      this.syncHeights("features");
      this.syncHeights("plans");
    },
    syncNavigationWidth() {
      const swiperPlanNavigation = document.querySelector(
        ".swiper-plan-navigation"
      );
      const pricingTable = document.querySelector(".pricing-table");
      swiperPlanNavigation.style.width = `${pricingTable.offsetWidth + 100}px`;
      swiperPlanNavigation.style.left = `${pricingTable.offsetLeft - 50}px`;
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
    }
  },

  mounted() {
    new Swiper(this.$refs.swiperMonthlyTable, {
      modules: [Navigation, Pagination],
      loop: false,
      slidesPerView: 3,
      speed: 500,
      navigation: {
        nextEl: ".swiper-plan-next",
        prevEl: ".swiper-plan-prev",
      },
      breakpoints: {
        0: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        },
      },
      on: {
        slideChange: this.syncAllHeights, // Run syncHeights on each slide change
        afterInit: this.syncAllHeights, // Sync heights after initial Swiper setup
      },
    });
    new Swiper(this.$refs.swiperAnnuallyTable, {
      modules: [Navigation, Pagination],
      loop: false,
      slidesPerView: 3,
      speed: 500,
      navigation: {
        nextEl: ".swiper-plan-next",
        prevEl: ".swiper-plan-prev",
      },
      breakpoints: {
        0: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        },
      },
      on: {
        slideChange: this.syncAllHeights, // Run syncHeights on each slide change
        afterInit: this.syncAllHeights, // Sync heights after initial Swiper setup
      },
    });

    this.syncAllHeights(); // Run syncHeights once after mount
    this.syncNavigationWidth(); // Sync navigation width after mount
  },
};
</script>

<template>
  <div class="container">
    <div class="swiper-plan-navigation">
      <button class="swiper-plan-prev">
        <img src="../../assets/NavigationLeft.svg" alt="Nav Left" />
      </button>
      <button class="swiper-plan-next">
        <img src="../../assets/NavigationRight.svg" alt="Nav Right" />
      </button>
    </div>
    <div class="pricing-table">
      <div class="pricing-table-inner__left">
        <div class="table-header plans-available">
          <h3>{{ annualPlans.length }} {{ translateMe("Plans available") }}</h3>
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
            :class="{ 'last-slide': index === annualPlans.length - 1 }"
          >
            <div class="plan-header-wrapper">
              <div class="upper">
                <h4>{{ plan.name }}</h4>
                <h4>
                  ${{ plan.price }}
                  <h6>
                    {{
                      plan.interval === "EVERY_30_DAYS"
                        ? translateMe("/mo")
                        : translateMe("/yr")
                    }}
                  </h6>
                </h4>
              </div>
              <VariantButton
                :variant="'primary'"
                @click="handlePlanClick(plan)"
                class="choose-button"
                >{{ translateMe("Choose Plan") }}</VariantButton
              >
            </div>
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
  display: flex;
  align-items: center;
  background-color: #f1f1f1;
  padding: 16px;
  border-bottom: 1px solid #e3e3e3;
}
.table-header h3 {
  font-size: 13px;
  font-weight: 700;
  line-height: 20px;
  color: #303030;
}
.plan-header-wrapper {
  padding: 16px;
  border-bottom: 1px solid #e3e3e3;
}
.plan-feature {
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #e3e3e3;
  border-left: 1px solid #e3e3e3;
}

.last-slide .plan-feature {
  border-right: 1px solid #e3e3e3;
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
.plan-header-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
  background-color: #f1f1f1;
  border-left: 1px solid #f1f1f1;
  border-right: 1px solid #f1f1f1;
}
.plan-header-wrapper .upper h4 {
  display: inline;
  font-size: 16px;
  font-weight: 700;
  color: #303030;
}
.plan-header-wrapper .upper h4 h6 {
  display: inline;
  font-size: 13px;
  font-weight: 400;
  color: #00000080;
  margin-left: -4px;
  line-height: 0;
}
.swiper-plan-navigation {
  position: absolute;
  margin-top: 32px;
  display: flex;
  justify-content: space-between;
  padding: 16px 0px;
}
.swiper-plan-prev, .swiper-plan-next {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background-color: #1A1A1A;
  border-radius: 8px;
  cursor: pointer;
}
.swiper-plan-prev:disabled, .swiper-plan-next:disabled {
  visibility: hidden;
}
.choose-button {
  background-color: white !important;
}
.choose-button:hover {
  background-color: #f9f9f9 !important;
}

@media (max-width: 768px) {
  .swiper-plan-navigation {
    display: none;
  }
}
</style>
