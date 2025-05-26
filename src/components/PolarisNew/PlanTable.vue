<script>
import Swiper, { Navigation, Pagination } from "swiper";
import "swiper/swiper-bundle.css";
import VariantButton from "./VariantButton";

export default {
  data() {
    return {
      isSyncing: false,
      remainingPlansMonthly: {
        before: 0,
        after: 0
      },
      remainingPlansAnnually: {
        before: 0,
        after: 0
      },
    };
  },
  name: "PlanTable",
  components: {
    VariantButton,
  },
  props: {
    plans: {
      type: Array,
      required: true,
    },
    currentPlan: {
      type: Object,
      required: false,
    },
    selectedInterval: {
      type: String,
      required: false,
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
            const featureType = `-${this.selectedInterval}`; // Append '-monthly' or '-annually' based on selectedInterval
            const featureNames = document.querySelectorAll(
              `.plan-feature-name${featureType}`
            );
            slides.forEach((slide) => {
              const features = slide.querySelectorAll(
                `.plan-feature${featureType}`
              );
              featureNames.forEach((featureName, index) => {
                const feature = features[index];
                if (featureName && feature) {
                  feature.style.height = `${featureName.offsetHeight}px`;
                }
              });
            });
          } else if (which === "plans") {

            const planType = `-${this.selectedInterval}`;
            const planNames = document.querySelectorAll(
              `.plan-header-wrapper${planType}`
            );
            const plansAvailableName = document.querySelector(
              `.plans-available${planType}`
            );
            if (!plansAvailableName) return;
            let planNameHeight = 0;
            slides.forEach((slide, index) => {
              const planName = planNames[index];
              if (planName) {
                planNameHeight = Math.max(
                  planName.offsetHeight,
                  planNameHeight
                );
              }
            });
            // Set the minHeight for the plans available name
            plansAvailableName.style.minHeight = `${planNameHeight}px`;

            // Set the minHeight for all elements
            planNames.forEach((el) => {
              el.style.minHeight = `${planNameHeight}px`;
            });
          }
        }, 2); // delay 0ms
      });
    },
    syncAllHeights() {
      this.syncHeights("features");
      this.syncHeights("plans");
    },
    syncNavigationWidth() {
      const swiperPlanNavigations = document.querySelectorAll(
        ".swiper-plan-navigation"
      );
      const pricingTable = document.querySelector(".pricing-table");
      if (!pricingTable) return;
      swiperPlanNavigations.forEach((swiperPlanNavigation) => {
        swiperPlanNavigation.style.width = `${
          pricingTable.offsetWidth + 130
        }px`;
        swiperPlanNavigation.style.left = `${pricingTable.offsetLeft - 65}px`;
      });
    },
    syncScroll(source, targets) {
      if (this.isSyncing) return;
      this.isSyncing = true;
      const scrollTop = source.scrollTop;
      targets.forEach((target) => {
        if (target !== source) {
          target.scrollTop = scrollTop;
        }
      });
      this.isSyncing = false;
    },
    setupScrollListeners() {
      const tableLeftElements = document.querySelectorAll("#table-left");
      const plansTableElements = document.querySelectorAll("#plans-table");
      const allElements = [...tableLeftElements, ...plansTableElements];
      allElements.forEach((element) => {
        element.addEventListener("scroll", () => {
          this.syncScroll(element, allElements);
        });
      });
    },

    updateRemainingPlans(swiper, type = 'monthly') {
      if (!swiper) return;

      const totalSlides = swiper.slides.length;
      const currentIndex = swiper.activeIndex;

      let visibleSlides = 1;
      if (typeof swiper.params.slidesPerView === 'number') {
        visibleSlides = swiper.params.slidesPerView;
      } else if (swiper.params.breakpoints) {
        const viewport = window.innerWidth;
        const breakpoints = swiper.params.breakpoints;
        const sorted = Object.keys(breakpoints)
            .map(Number)
            .sort((a, b) => a - b);

        for (const bp of sorted) {
          if (viewport >= bp && typeof breakpoints[bp].slidesPerView === 'number') {
            visibleSlides = breakpoints[bp].slidesPerView;
          }
        }
      }

      const after = Math.max(totalSlides - (currentIndex + visibleSlides), 0);
      const before = currentIndex;

      if (type === 'annually') {
        this.remainingPlansAnnually = { after, before };
      } else {
        this.remainingPlansMonthly = { after, before };
      }
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
    monthlyPlansFeatures() {
      let plansWithFeatures = this.monthlyPlans.flatMap(
        (plan) => plan.features
      );
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

  watch: {
    selectedInterval() {
      let monthlyPlanTable = document.querySelector(".monthly-table");
      let annuallyPlanTable = document.querySelector(".annually-table");
      let monthlyPlanTableNavigation =
        document.querySelector(".nav-monthly-table");
      let annuallyPlanTableNavigation = document.querySelector(
        ".nav-annually-table"
      );
      if (this.selectedInterval === "monthly") {
        monthlyPlanTable.style.visibility = "visible";
        monthlyPlanTable.style.height = "auto";
        monthlyPlanTable.style.border = "1px solid #e5e5e5";
        monthlyPlanTable.style.padding = "16px";
        annuallyPlanTable.style.visibility = "hidden";
        annuallyPlanTable.style.height = "0px";
        annuallyPlanTable.style.border = "0px";
        monthlyPlanTableNavigation.style.display = "flex";
        annuallyPlanTableNavigation.style.display = "none";
        this.interval = "EVERY_30_DAYS";
        this.syncAllHeights();
      } else if (this.selectedInterval === "annually") {
        monthlyPlanTable.style.visibility = "hidden";
        monthlyPlanTable.style.height = "0px";
        monthlyPlanTable.style.border = "0px";
        monthlyPlanTable.style.padding = "0px";
        annuallyPlanTable.style.visibility = "visible";
        annuallyPlanTable.style.height = "auto";
        annuallyPlanTable.style.border = "1px solid #e5e5e5";
        monthlyPlanTableNavigation.style.display = "none";
        annuallyPlanTableNavigation.style.display = "flex";
        this.interval = "ANNUAL";
        this.syncAllHeights();
      }
    },
  },

  mounted() {
    new Swiper(this.$refs.swiperMonthlyTable, {
      modules: [Navigation, Pagination],
      loop: false,
      slidesPerView: 2,
      speed: 500,
      navigation: {
        nextEl: ".swiper-plan-monthly-next",
        prevEl: ".swiper-plan-monthly-prev",
      },
      breakpoints: {
        0: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: Math.min(this.monthlyPlans.length, 3),
        },
      },
      on: {
        slideChange: (swiper) => {
          this.syncAllHeights()
          this.updateRemainingPlans(swiper)
        }, // Run syncHeights on each slide change
        afterInit: (swiper) => {
          this.syncAllHeights()
          this.updateRemainingPlans(swiper)
        }, // Sync heights after initial Swiper setup
      },
    });
    new Swiper(this.$refs.swiperAnnuallyTable, {
      modules: [Navigation, Pagination],
      loop: false,
      slidesPerView: 2,
      speed: 500,
      navigation: {
        nextEl: ".swiper-plan-annually-next",
        prevEl: ".swiper-plan-annually-prev",
      },
      breakpoints: {
        0: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: Math.min(this.annualPlans.length, 3),
        },
      },
      on: {
        slideChange: (swiper) => {
          this.syncAllHeights()
          this.updateRemainingPlans(swiper, 'annually')
        }, // Run syncHeights on each slide change
        afterInit: (swiper) => {
          this.syncAllHeights()
          this.updateRemainingPlans(swiper, 'annually')
        }, // Sync heights after initial Swiper setup
      },
    });

    this.syncAllHeights(); // Run syncHeights once after mount
    this.syncNavigationWidth(); // Sync navigation width after mount
    this.setupScrollListeners();
  },
};
</script>

<template>
  <div class="container">
    <div class="swiper-plan-navigation nav-monthly-table">
      <button class="swiper-plan-monthly-prev">
        <span class="plans-remaining" v-if="this.remainingPlansMonthly.before > 0">+{{ this.remainingPlansMonthly.before }} Plans</span>
        <img src="../../assets/NavigationLeft.svg" alt="Nav Left" />
      </button>
      <button class="swiper-plan-monthly-next">
        <span class="plans-remaining" v-if="this.remainingPlansMonthly.after > 0">+{{ this.remainingPlansMonthly.after }} Plans</span>
        <img src="../../assets/NavigationRight.svg" alt="Nav Right" />
      </button>
    </div>
    <div class="swiper-plan-navigation nav-annually-table">
      <button class="swiper-plan-annually-prev">
        <span class="plans-remaining" v-if="this.remainingPlansAnnually.before > 0">+{{ this.remainingPlansAnnually.before }} Plans</span>
        <img src="../../assets/NavigationLeft.svg" alt="Nav Left" />
      </button>
      <button class="swiper-plan-annually-next">
        <span class="plans-remaining" v-if="this.remainingPlansAnnually.after > 0">+{{ this.remainingPlansAnnually.after }} Plans</span>
        <img src="../../assets/NavigationRight.svg" alt="Nav Right" />
      </button>
    </div>

    <div class="pricing-table monthly-table">
      <div class="pricing-table-inner__left" id="table-left">
        <div class="table-header plans-available plans-available-monthly">
          <h3>
            {{ monthlyPlans.length }} {{ translateMe("Plans available") }}
          </h3>
        </div>
        <div
          class="plan-feature-name plan-feature-name-monthly"
          v-for="(feature, index) in monthlyPlansFeatures"
          :key="feature.id"
        >
          {{ feature.name }}
        </div>
      </div>
      <div class="swiper plans monthly" ref="swiperMonthlyTable" id="plans-table">
        <div class="swiper-wrapper">
          <div
            v-for="(plan, index) in monthlyPlans"
            :key="plan.id"
            class="swiper-slide"
            :class="{ 'last-slide': index === monthlyPlans.length - 1 }"
          >
            <div class="plan-header-wrapper plan-header-wrapper-monthly">
              <div class="upper">
                <h4>{{ plan.name }}</h4>
                <h4 v-if="plan.name !== 'free' && plan.name !== 'FREE'">
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
                :variant="'secondary'"
                :disabled="currentPlan && currentPlan.id === plan.id"
                @click="handlePlanClick(plan)"
                class="button"
                >{{
                  currentPlan && currentPlan.id === plan.id
                    ? translateMe("Current Plan")
                    : translateMe("Choose Plan")
                }}</VariantButton
              >
            </div>
            <div
              class="plan-feature plan-feature-monthly"
              v-for="(feature, index) in monthlyPlansFeatures"
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
    <div class="pricing-table annually-table">
      <div class="pricing-table-inner__left" id="table-left">
        <div class="table-header plans-available plans-available-annually">
          <h3>{{ annualPlans.length }} {{ translateMe("Plans available") }}</h3>
        </div>
        <div
          class="plan-feature-name plan-feature-name-annually"
          v-for="(feature, index) in annualPlansFeatures"
          :key="feature.id"
        >
          {{ feature.name }}
        </div>
      </div>
      <div class="swiper plans annually" ref="swiperAnnuallyTable" id="plans-table">
        <div class="swiper-wrapper">
          <div
            v-for="(plan, index) in annualPlans"
            :key="plan.id"
            class="swiper-slide"
            :class="{ 'last-slide': index === annualPlans.length - 1 }"
          >
            <div class="plan-header-wrapper plan-header-wrapper-annually">
              <div class="upper">
                <h4>{{ plan.name }}</h4>
                <h4 v-if="plan.name !== 'free' && plan.name !== 'FREE'">
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
                :variant="'secondary'"
                :disabled="currentPlan && currentPlan.id === plan.id"
                @click="handlePlanClick(plan)"
                class="button"
                >{{
                  currentPlan && currentPlan.id === plan.id
                    ? translateMe("Current Plan")
                    : translateMe("Choose Plan")
                }}</VariantButton
              >
            </div>
            <div
              class="plan-feature plan-feature-annually"
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
  padding: 0 10px 0 10px;
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
  max-height: 360px;
  overflow-y: auto;
}
.annually-table {
  visibility: hidden;
  height: 0px;
  border: 0px;
}
.pricing-table-inner__left {
  display: flex;
  flex-direction: column;
  max-height: 360px;
  overflow-y: auto;
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
  position: sticky;
  top: 0;
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
  position: sticky;
  top: 0;
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
.nav-annually-table {
  display: none;
}
.swiper-plan-monthly-prev,
.swiper-plan-monthly-next,
.swiper-plan-annually-next,
.swiper-plan-annually-prev {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background-color: #1a1a1a;
  border-radius: 8px;
  cursor: pointer;
}
.swiper-plan-monthly-prev:disabled,
.swiper-plan-monthly-next:disabled,
.swiper-plan-annually-next:disabled,
.swiper-plan-annually-prev:disabled {
  visibility: hidden;
}
.choose-button {
  background-color: white !important;
}
.choose-button:hover {
  background-color: #f9f9f9 !important;
}
.choose-button.disabled {
  background-color: rgba(0, 0, 0, 0.15) !important;
}
#table-left {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
#table-left::-webkit-scrollbar {
  display: none;
}

.plans-remaining {
  position: absolute;
  top: -30px;
  background-color: white;
  color: #333;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 14px;
  white-space: nowrap;
  box-shadow: 0 4px 8px #00000026;
}

.plans-remaining::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid white;
  filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.1));
}

@media (max-width: 768px) {
  .swiper-plan-navigation {
    display: none;
  }
}
</style>
