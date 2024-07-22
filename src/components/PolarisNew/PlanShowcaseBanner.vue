<script>
import VariantButton from "./VariantButton";

export default {
  name: "PlanShowcaseBanner",
  components: {
    VariantButton,
  },
  props: {
    showcaseData: {
      type: Object,
      required: false,
    },
    realPrice: {
      type: String,
      required: false,
    },
    oldPrice: {
      type: Number,
      required: false,
    },
    showDescription: {
      type: Boolean,
      required: false,
      default: true,
    },
    getPlanUrl: {
      type: Function,
      required: false,
    },
    plan: {
      type: Object,
      required: false,
    },
    isCurrentPlan: {
      type: Boolean,
      required: false,
      default: false,
    },
    useCardStyle: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  methods: {
    handlePlanClick() {
      this.$emit("plan-clicked");
    },
    translateMe(message) {
      return this.$translations.hasOwnProperty(message)
        ? this.$translations[message]
        : message;
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
  <div>
    <div :class="`plan-showcase-banner` + (useCardStyle ? ' banner-card' : '')">
      <div v-if="showDescription" class="plan-left">
        <p>
          {{ translateMe("Get 24 Shopify apps and save more than") }}
          <strong>{{ translateMe("$1000") }}</strong>
          {{ translateMe("per month!") }}
        </p>
        <p>
          {{
            translateMe(
              "No hidden costs. Just your store getting supercharged!"
            )
          }}
        </p>
      </div>
      <div class="plan-right">
        <h3 class="plan-name">{{ translateMe("Monthly Bundle:") }}</h3>
        <div class="prices">
          <span class="discounted-amount">${{ translateMe(realPrice) }}</span>
          <span class="original-amount">${{ translateMe(oldPrice) }}</span>
        </div>
        <VariantButton
          v-if="!isCurrentPlan"
          :buttonData="{ button_url: showcaseData.button_url }"
          @click="handlePlanClick"
          variant="primary"
        >
          {{ translateMe("Choose this plan") }}
        </VariantButton>
        <VariantButton
          v-if="isCurrentPlan"
          :buttonData="{ button_url: showcaseData.button_url }"
          :disabled="true"
          @click="handlePlanClick"
          variant="primary"
        >
          {{ translateMe("Current Plan") }}
        </VariantButton>
      </div>
    </div>
  </div>
</template>

<style scoped>

.banner-card {
  display: flex;
  padding: 16px;
  background-color: white;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  border-radius: 12px;
  gap: 16px;
}
.plan-showcase-banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.plan-name {
  font-size: 14px;
  font-weight: 450;
  color: #303030;
}

.plan-left {
  flex: 1;
}

.plan-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.prices {
  display: flex;
  gap: 8px;
}

.discounted-amount {
  font-size: 30px;
  font-weight: bold;
  color: #303030;
}

.original-amount {
  text-decoration: line-through;
  color: #616161;
  font-size: 14px;
  font-weight: 650;
}

.choose-button {
  padding: 6px 12px;
  background-color: rgb(48, 48, 48);
  background-image: linear-gradient(
      rgba(48, 48, 48, 0) 63.53%,
      rgba(255, 255, 255, 0.15)
    ),
    none;
  color: white;
  border-bottom-color: rgb(255, 255, 255);
  box-shadow: rgba(0, 0, 0, 0.8) 0px -1px 0px 1px inset,
    rgb(48, 48, 48) 0px 0px 0px 1px inset,
    rgba(255, 255, 255, 0.25) 0px 0.5px 0px 1.5px inset;
  border-radius: 8px;
  text-decoration: none;
  font-size: 13px;
  font-weight: 650;
}

@media (max-width: 767px) {
  .plan-showcase-banner {
    flex-direction: column;
    gap: 12px;
  }
  .plan-showcase-banner {
    align-items: unset;
  }
  .choose-button {
    margin-right: 0;
    margin-left: auto;
  }
}
@media (max-width: 480px) {
  .plan-right {
    flex-direction: column;
    gap: 8px;
    align-items: unset;
  }
  .plan-showcase-banner {
    flex-direction: column;
    gap: 12px;
  }
  .plan-showcase-banner {
    align-items: unset;
  }
  .choose-button {
    margin-right: auto;
    margin-left: 0;
  }
}
</style>
