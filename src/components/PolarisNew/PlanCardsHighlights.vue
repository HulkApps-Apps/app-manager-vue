<script>
import VariantButton from "./VariantButton";
import Swiper, { Navigation, Pagination } from "swiper";
import "swiper/swiper-bundle.css";

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
    };
  },
  computed: {
    monthlyPlans() {
      return this.plans.filter((plan) => plan.interval === "EVERY_30_DAYS");
    },
    annualPlans() {
      return this.plans.filter((plan) => plan.interval === "ANNUAL");
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
  },
  watch: {
    selectedInterval() {
      if (this.selectedInterval === "monthly") {
        this.interval = "EVERY_30_DAYS";
      } else if (this.selectedInterval === "annually") {
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
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      breakpoints: {
        640: {
          slidesPerView: 2,
        },
        768: {
          slidesPerView: 3,
        },
        1024: {
          slidesPerView: 4,
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
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      breakpoints: {
        640: {
          slidesPerView: 2,
        },
        768: {
          slidesPerView: 3,
        },
        1024: {
          slidesPerView: 4,
        },
      },
    });
  },
};
</script>

<template>
  <div class="container">
    <div
      ref="swiperMonthly"
      class="swiper cards monthly"
      v-if="interval == 'EVERY_30_DAYS'"
    >
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
              {
                'card-border':
                  index !== 0 &&
                  index !== 2 &&
                  !(annualPlans[index - 1] && index - 1 === 2),
              },
            ]"
          >
            <div class="most-popular" v-if="index == 2">
              <div class="most-popular-label">
                {{ translateMe("Most Popular") }}
              </div>
            </div>
            <h3 class="title">
              {{ plan.name }}
            </h3>
            <h2 class="price">
              {{ plan.price !== 0 ? "$" + plan.price : "Free" }}
              <span v-if="plan.price !== 0">
                {{ translateMe("/mo") }}
              </span>
            </h2>
            <h6 class="description">
              {{
                plan.description ? plan.description : placeholder.description
              }}
            </h6>
            <VariantButton
              :variant="'primary'"
              @click="handlePlanClick(plan)"
              class="button"
              >{{ translateMe("Choose Plan") }}</VariantButton
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
      ref="swiperAnnually"
      class="swiper cards annually"
      v-if="interval == 'ANNUAL'"
    >
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
              {
                'card-border':
                  index !== 0 &&
                  index !== 2 &&
                  !(annualPlans[index - 1] && index - 1 === 2),
              },
            ]"
          >
            <div class="most-popular" v-if="index == 2">
              <div class="most-popular-label">
                {{ translateMe("Most Popular") }}
              </div>
            </div>
            <h3 class="title">
              {{ plan.name }}
            </h3>
            <h2 class="price">
              {{ plan.price !== 0 ? "$" + plan.price : "Free" }}
              <span v-if="plan.price !== 0">
                {{ translateMe("/yr") }}
              </span>
            </h2>
            <h6 class="description">
              {{
                plan.description ? plan.description : placeholder.description
              }}
            </h6>
            <VariantButton
              :variant="'primary'"
              @click="handlePlanClick(plan)"
              class="button"
              >{{ translateMe("Choose Plan") }}</VariantButton
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
    <div class="swiper-pagination"></div>
  </div>
</template>

<style scoped>
.container {
  padding: 40px 0px 0px 20px;
  width: 100%;
}
.swiper.cards.annually {
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
}
.card {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
}
.card-border {
  border-left: 1px solid #cccccc;
}
.card .title {
  font-size: 16px;
  font-weight: 700;
  color: black;
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
  background: none;
  background-color: #757575;
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
