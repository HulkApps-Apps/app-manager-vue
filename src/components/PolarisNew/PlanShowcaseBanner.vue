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
    fullWidth: {
      type: Boolean,
      required: false,
      default: false,
    },
    bundleApps: {
      type: Number,
      required: false,
      default: 18
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
  <div class="bundle-plan-showcase-banner banner-card">
    <div
      :class="[
        'banner__inner',
        this.fullWidth ? 'full-width' : '',
      ]"
    >
      <div v-if="showDescription" class="plan-left">
        <p class="bundle-offer-label">
          {{ translateMe("Bundle offer") }}
        </p>
        <p class="bundle-desc-label">
          {{ translateMe("Get") }}
          {{bundleApps}}
          {{ translateMe("Shopify apps and save more than") }}
          <strong>{{ translateMe("$1000") }}</strong>
          {{ translateMe("per month!") }}
        </p>
      </div>
      <div class="plan-right">
        <div class="plan-content">
          <h3 class="plan-name">{{ translateMe("Monthly bundle:") }}</h3>
          <div class="prices">
            <span class="discounted-amount">${{ translateMe(realPrice) }}</span>
            <span class="original-amount" v-if="realPrice < oldPrice"
            >${{ translateMe(oldPrice) }}</span
            >
          </div>
        </div>
        <VariantButton
          id="choose-bundle"
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
  padding: 16px 0;
  background-color: white;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  gap: 16px;
}
.bundle-plan-showcase-banner {
  display: none;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 32px;
  position: sticky;
  top: 0;
}

.banner__inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 998px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding: 0 96px;
}

.banner__inner.full-width {
  max-width: calc(100% - 64px);
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
  gap: 16px;
}

.prices {
  display: flex;
  gap: 8px;
  align-items: center;
}

.bundle-offer-label {
  font-size: 20px;
  font-weight: 600;
  color: #202223;
  margin-bottom: 4px;
}

.bundle-desc-label {
  font-size: 14px;
  font-weight: 450;
  color: #303030;
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

.plan-content {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
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

@media (max-width: 992px) {

  .banner__inner.full-width {
    max-width: calc(100% - 64px);
  }

  .banner__inner {
    flex-direction: column;
    gap: 32px;
    align-items: flex-start;
  }

  .plan-right {
    justify-content: space-between;
    width: 100%;
  }
}

@media (max-width: 767px) {
  .banner__inner {
    padding: 16px;
  }
  .banner__inner.full-width {
    max-width: 100%;
  }
  .bundle-plan-showcase-banner {
    flex-direction: column;
    gap: 12px;
  }
  .bundle-plan-showcase-banner {
    align-items: unset;
  }
  .choose-button {
    margin-right: 0;
    margin-left: auto;
  }
}
@media (max-width: 480px) {
  .plan-content {
    flex-direction: column;
    align-items: flex-start;
  }
  .plan-right {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  .bundle-plan-showcase-banner {
    flex-direction: column;
    gap: 12px;
  }
  .bundle-plan-showcase-banner {
    align-items: unset;
  }
  .choose-button {
    margin-right: auto;
    margin-left: 0;
  }
}
</style>
