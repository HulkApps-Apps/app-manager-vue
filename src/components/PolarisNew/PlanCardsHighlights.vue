<script>
import VariantButton from "./VariantButton";
import Swiper, {Navigation, Pagination} from "swiper";
import "swiper/swiper-bundle.css";
import { getPlanPriceDetails } from "@/helpers";

export default {
  name: "PlanCardsHighlights",
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
    promotionalDiscount: {
      type: Object,
      required: false,
    },
    selectedInterval: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      interval: "EVERY_30_DAYS",
      placeholder: {
        description: "Perfect for everything",
      },
      remainingPlansMonthly: {
        before: 0,
        after: 0
      },
      remainingPlansAnnually: {
        before: 0,
        after: 0
      },
      anyMonthlyPlanHasDiscount: false,
      anyAnnuallyPlanHasDiscount: false,
      loadingPlanId: null
    };
  },
  computed: {
    monthlyPlans() {
      return this.plans
        .filter(plan => plan.interval === "EVERY_30_DAYS")
        .map(plan => {
          const planDetails = getPlanPriceDetails(plan, this.promotionalDiscount);
          if (planDetails.has_discount && !this.anyMonthlyPlanHasDiscount) {
            this.anyMonthlyPlanHasDiscount = true;
          }
          return planDetails;
        });
    },
    annualPlans() {
      return this.plans
        .filter(plan => plan.interval === "ANNUAL")
        .map(plan => {
          const planDetails = getPlanPriceDetails(plan, this.promotionalDiscount);
          if (planDetails.has_discount && !this.anyAnnuallyPlanHasDiscount) {
            this.anyAnnuallyPlanHasDiscount = true;
          }
          return planDetails;
        });
    },
  },
  methods: {
    async handlePlanClick(plan) {
      this.loadingPlanId = plan.id;
      try {
        await this.$emit("plan-clicked", plan);
      } catch (error) {
        console.error('Error handling plan click:', error);
        this.loadingPlanId = null;
      }
    },
    translateMe(message) {
      return this.$translations.hasOwnProperty(message)
        ? this.$translations[message]
        : message;
    },
    syncNavigationWidth() {
      const swiperPlanNavigations = document.querySelectorAll(
        ".swiper-plan-h-navigation"
      );
      const pricingTable = document.querySelector(".plans-h-cards");
      if (!pricingTable) {
        console.error("No `.plans-h-cards` element found.");
        return;
      }
      swiperPlanNavigations.forEach((navigation) => {
        navigation.style.width = `${pricingTable.offsetWidth + 130}px`;
        navigation.style.left = `${pricingTable.offsetLeft - 65}px`;
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
        this.remainingPlansAnnually = {after, before};
      } else {
        this.remainingPlansMonthly = {after, before};
      }
    },
  },
  watch: {
    selectedInterval() {
      let monthlyPlanCards = document.querySelector(".monthly");
      let annuallyPlanCards = document.querySelector(".annually");
      let monthlyPlanNavigation = document.querySelector(".nav-monthly");
      let annuallyPlanNavigation = document.querySelector(".nav-annually");
      if (this.selectedInterval === "monthly") {
        monthlyPlanCards.style.visibility = "visible";
        monthlyPlanCards.style.height = "auto";
        monthlyPlanCards.style.border = "1px solid #e5e5e5";
        annuallyPlanCards.style.visibility = "hidden";
        annuallyPlanCards.style.height = "0px";
        annuallyPlanCards.style.border = "0px";
        monthlyPlanNavigation.style.display = "flex";
        annuallyPlanNavigation.style.display = "none";
        this.interval = "EVERY_30_DAYS";
      } else if (this.selectedInterval === "annually") {
        monthlyPlanCards.style.visibility = "hidden";
        monthlyPlanCards.style.height = "0px";
        monthlyPlanCards.style.border = "0px";
        annuallyPlanCards.style.visibility = "visible";
        annuallyPlanCards.style.height = "auto";
        annuallyPlanCards.style.border = "1px solid #e5e5e5";
        monthlyPlanNavigation.style.display = "none";
        annuallyPlanNavigation.style.display = "flex";
        this.interval = "ANNUAL";
      }
    },
  },
  mounted() {
    new Swiper(this.$refs.swiperMonthly, {
      modules: [Navigation, Pagination],
      loop: false,
      slidesPerView: 1,
      speed: 500,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper-plan-h-next-monthly",
        prevEl: ".swiper-plan-h-prev-monthly",
      },
      breakpoints: {
        640: {
          slidesPerView: 2,
        },
        768: {
          slidesPerView: Math.min(this.monthlyPlans.length, 3),
        },
        1024: {
          slidesPerView: Math.min(this.monthlyPlans.length, 4),
        },
      },
      on: {
        slideChange: (swiper) => {
          this.updateRemainingPlans(swiper)
        },
        afterInit: (swiper) => {
          this.updateRemainingPlans(swiper)
        },
      },
    });
    new Swiper(this.$refs.swiperAnnually, {
      modules: [Navigation, Pagination],
      loop: false,
      slidesPerView: 1,
      speed: 500,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper-plan-h-next-annually",
        prevEl: ".swiper-plan-h-prev-annually",
      },
      breakpoints: {
        640: {
          slidesPerView: 2,
        },
        768: {
          slidesPerView: Math.min(this.annualPlans.length, 3),
        },
        1024: {
          slidesPerView: Math.min(this.annualPlans.length, 4),
        },
      },
      on: {
        slideChange: (swiper) => {
          this.updateRemainingPlans(swiper, 'annually')
        },
        afterInit: (swiper) => {
          this.updateRemainingPlans(swiper, 'annually')
        },
      },
    });
    this.syncNavigationWidth(); // Sync navigation width after mount

    console.log('Plans:', this.plans);
    console.log('Monthly Plans:', this.monthlyPlans);
    console.log('Annually Plans:', this.annualPlans);
  },
};
</script>

<template>
  <div class="container">
    <div class="swiper-plan-h-navigation nav-monthly">
      <button class="swiper-plan-h-prev-monthly">
        <span class="plans-remaining" v-if="this.remainingPlansMonthly.before > 0">+{{
            this.remainingPlansMonthly.before
          }} Plans</span>
        <img src="../../assets/NavigationLeft.svg" alt="Nav Left"/>
      </button>
      <button class="swiper-plan-h-next-monthly">
        <span class="plans-remaining" v-if="this.remainingPlansMonthly.after > 0">+{{
            this.remainingPlansMonthly.after
          }} Plans</span>
        <img src="../../assets/NavigationRight.svg" alt="Nav Right"/>
      </button>
    </div>
    <div class="swiper-plan-h-navigation nav-annually">
      <button class="swiper-plan-h-prev-annually">
        <span class="plans-remaining"
              v-if="this.remainingPlansAnnually.before > 0">+{{ this.remainingPlansAnnually.before }} Plans</span>
        <img src="../../assets/NavigationLeft.svg" alt="Nav Left"/>
      </button>
      <button class="swiper-plan-h-next-annually">
        <span class="plans-remaining" v-if="this.remainingPlansAnnually.after > 0">+{{
            this.remainingPlansAnnually.after
          }} Plans</span>
        <img src="../../assets/NavigationRight.svg" alt="Nav Right"/>
      </button>
    </div>
    <div ref="swiperMonthly" class="swiper cards monthly plans-h-cards">
      <div class="swiper-wrapper">
        <div
          v-for="(plan, index) in monthlyPlans"
          v-if="plan.interval === 'EVERY_30_DAYS'"
          :key="plan.id"
          class="swiper-slide"
        >
          <div
            :class="[
              'card',
              'card-border'
            ]"
          >
            <div class="most-popular" v-if="plan.is_popular">
              <div class="most-popular-label">
                {{ translateMe("Most Popular") }}
              </div>
            </div>
            <h3 class="title">
              {{ plan.name }}
            </h3>
            <div
              :class="[
                'price-wrapper',
                anyMonthlyPlanHasDiscount ? 'has-discount' : ''
              ]"
            >
              <template v-if="plan.strike_price">
                <h5 class="strike-price">
                  <span style="text-decoration: line-through;">${{ plan.strike_price }}</span>
                  <span style="color: #999;" v-if="plan.strike_price !== 0">
                {{ translateMe("/mo") }}
              </span>
                </h5>
              </template>
              <h2 class="price">
                {{ plan.price !== 0 ? "$" + plan.price : "Free" }}
                <span v-if="plan.price !== 0">
                {{ translateMe("/mo") }}
              </span>
              </h2>
            </div>
            <h6 class="description">
              {{
                plan.description ? plan.description : placeholder.description
              }}
            </h6>
            <VariantButton
                :variant="'secondary'"
                :disabled="currentPlan && currentPlan.id === plan.id"
                :loading="loadingPlanId === plan.id"
                @click="handlePlanClick(plan)"
            >{{
                currentPlan && currentPlan.id === plan.id
                    ? translateMe("Selected Plan")
                    : (
                      plan.price > currentPlan.price 
                      ? translateMe("Upgrade") 
                      : translateMe("Choose Plan")
                    )
              }}
            </VariantButton
            >
            <div class="features">
              <ul>
                <li
                   class="feature"
                  v-for="(featureKey, index) in Object.entries(
                    plan.features
                  ).slice(0, 4)"
                  :key="featureKey[0]"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M15.7803 5.96967C16.0732 6.26256 16.0732 6.73744 15.7803 7.03033L9.28033 13.5303C8.98744 13.8232 8.51256 13.8232 8.21967 13.5303L4.96967 10.2803C4.67678 9.98744 4.67678 9.51256 4.96967 9.21967C5.26256 8.92678 5.73744 8.92678 6.03033 9.21967L8.75 11.9393L14.7197 5.96967C15.0126 5.67678 15.4874 5.67678 15.7803 5.96967Z"
                      fill="#303030"
                    />
                  </svg>

                  <span>
                    {{ featureKey[1].name }}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div ref="swiperAnnually" class="swiper cards annually">
      <div class="swiper-wrapper">
        <div
          v-for="(plan, index) in annualPlans"
          v-if="plan.interval === 'ANNUAL'"
          :key="plan.id"
          class="swiper-slide"
        >
          <div
            :class="[
              'card',
              'card-border'
            ]"
          >
            <div class="most-popular" v-if="plan.is_popular">
              <div class="most-popular-label">
                {{ translateMe("Most Popular") }}
              </div>
            </div>
            <h3 class="title">
              {{ plan.name }}
            </h3>
            <div
              :class="[
                'price-wrapper',
                anyAnnuallyPlanHasDiscount ? 'has-discount' : ''
              ]"
            >
              <template v-if="plan.strike_price">
                <h5 class="strike-price">
                  <span style="text-decoration: line-through;">${{ plan.strike_price }}</span>
                  <span style="color: #999;" v-if="plan.strike_price !== 0">
                {{ translateMe("/mo") }}
              </span>
                </h5>
              </template>
              <h2 class="price">
                {{ plan.price !== 0 ? "$" + plan.price : "Free" }}
                <span v-if="plan.price !== 0">
                {{ translateMe("/mo") }}
              </span>
              </h2>
            </div>
            <h6 class="description">
              {{
                plan.description ? plan.description : placeholder.description
              }}
            </h6>
            <VariantButton
                :variant="'secondary'"
                :disabled="currentPlan && currentPlan.id === plan.id"
                :loading="loadingPlanId === plan.id"
                @click="handlePlanClick(plan)"
            >{{
                currentPlan && currentPlan.id === plan.id
                    ? translateMe("Selected Plan")
                    : (
                      plan.price > currentPlan.price 
                      ? translateMe("Upgrade") 
                      : translateMe("Choose Plan")
                    )
              }}
            </VariantButton
            >
            <div class="features">
              <ul>
                <li
                    class="feature"
                  v-for="(featureKey, index) in Object.entries(
                    plan.features
                  ).slice(0, 4)"
                  :key="featureKey[0]"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M15.7803 5.96967C16.0732 6.26256 16.0732 6.73744 15.7803 7.03033L9.28033 13.5303C8.98744 13.8232 8.51256 13.8232 8.21967 13.5303L4.96967 10.2803C4.67678 9.98744 4.67678 9.51256 4.96967 9.21967C5.26256 8.92678 5.73744 8.92678 6.03033 9.21967L8.75 11.9393L14.7197 5.96967C15.0126 5.67678 15.4874 5.67678 15.7803 5.96967Z"
                      fill="#303030"
                    />
                  </svg>
                  <span>
                    {{ featureKey[1].name }}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="swiper-pagination"
      :style="{
        display:
          (interval === 'ANNUAL' && annualPlans.length <= 4) ||
          (interval === 'EVERY_30_DAYS' && monthlyPlans.length <= 4)
            ? 'none'
            : 'block',
      }"
    ></div>
  </div>
</template>

<style scoped>
.container {
  padding: 40px 0px 0px 20px;
  width: 100%;
}

.swiper.cards.annually {
  visibility: hidden;
  height: 0px;
  position: relative;
}

.swiper-pagination {
  height: 12px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 0px;
  margin-top: 26px;
}

.cards {
  display: flex;
  background-color: white;
  flex-grow: 1;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  overflow-x: clip;
  overflow-y: visible;
  box-shadow: 0 4px 6px -1px #0000001a;
}

.card {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 16px;
}

.swiper-wrapper .swiper-slide:not(.swiper-slide-active) .card-border {
  border-left: 1px solid #cccccc;
}

.card .title {
  font-size: 16px;
  font-weight: 700;
  color: black;
}

.card .price-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
}

.card .price-wrapper.has-discount {
  min-height: 44px;
}

.card .price {
  font-size: 30px;
  font-weight: 700;
  color: black;
}

.card .price span {
  font-size: 13px;
  font-weight: 400;
  color: #00000080;
  margin-left: -6px;
  line-height: 0;
}

.card .description {
  font-size: 13px;
  font-weight: 400;
  color: #00000080;
}

.button {
  display: flex;
  justify-content: center;
  width: 100% !important;
  text-align: center !important;
}

.features {
  margin-top: 19px;
}

.features ul {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  flex-direction: column;
}

.features .feature {
  display: flex;
  align-items: center;
  gap: 4px;
}

.features .feature svg {
  min-width: 20px;
  min-height: 20px;
}

.feature span {
  font-size: 13px;
  font-weight: 400;
  color: #00000080;
}

.most-popular {
  position: absolute;
  z-index: -1;
  top: -20px;
  width: 100%;
  height: calc(100% + 20px);
  border-radius: 12px 12px 0 0;
  border-left: 1px solid #91d0ff;
  border-right: 1px solid #91d0ff;
  overflow: hidden;
}

.most-popular .most-popular-label {
  background-color: #91d0ff;
  color: #00527c;
  font-size: 12px;
  font-weight: 600;
  width: 100%;
  text-align: center;
}

.swiper-plan-h-navigation {
  position: absolute;
  margin-top: 32px;
  display: flex;
  justify-content: space-between;
  padding: 16px 0px;
}

.nav-annually {
  display: none;
}

.swiper-plan-h-prev-monthly,
.swiper-plan-h-prev-annually,
.swiper-plan-h-next-monthly,
.swiper-plan-h-next-annually {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background-color: #1a1a1a;
  border-radius: 8px;
  cursor: pointer;
}

.swiper-plan-h-prev-monthly:disabled,
.swiper-plan-h-next-monthly:disabled,
.swiper-plan-h-next-annually:disabled,
.swiper-plan-h-prev-annually:disabled {
  visibility: hidden;
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

@media (max-width: 640px) {
  .card-border {
    border-left: none;
  }

  .most-popular {
    border: 1px solid #91d0ff;
    border-radius: 12px;
  }
}
</style>

<style>
.swiper-pagination .swiper-pagination-bullet {
  background: #757575 none;
  opacity: 1;
  transition: all 0.5s;
  width: 8px;
  height: 8px;
}

.swiper-pagination .swiper-pagination-bullet-active {
  background-color: #0094d5;
  width: 12px;
  height: 12px;
}
</style>
