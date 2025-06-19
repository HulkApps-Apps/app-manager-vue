<template>
  <PEmptyState
    :heading="translateMe('No Plans')"
    image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
    v-if="!this.planLoading && this.plans.length === 0"
  >
  </PEmptyState>
  <div class="app-manager-wrapper" v-else-if="!this.planLoading && this.plans.length > 0">
    <PlanBanners position="header" @handlePlanBannerClose="handlePlanBannerClose" class="app-manager-plan-banner"/>
    <div
      :class="[
        'bill-cycle-select-group',
        this.full_width ? 'full-width' : '',
        this.narrow_width ? 'narrow-width' : '',
      ]"
    >
      <a class="bill-cycle-back" @click="selectPlan('monthly')">
        <svg
          width="16"
          height="14"
          viewBox="0 0 16 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M1 7H15H1Z" fill="#006FBB"/>
          <path d="M1 7H15" stroke="#006FBB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M1 7L7 13L1 7Z" fill="#006FBB"/>
          <path d="M1 7L7 13" stroke="#006FBB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M1 7L7 1L1 7Z" fill="#006FBB"/>
          <path d="M1 7L7 1" stroke="#006FBB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        {{ translateMe('Back to app pricing') }}
      </a>
      <div class="bill-cycle-select-group__inner-left">
        <SelectButton
          id="pricing-tab"
          :variant="selectedPlan === 'monthly' ? 'primary' : 'secondary'"
          @click="selectPlan('monthly')"
        >
          {{ translateMe('Billed monthly') }}
        </SelectButton>
        <SelectButton
          id="pricing-tab"
          v-if="valid_annual_plans.length > 0"
          :variant="selectedPlan === 'annually' ? 'primary' : 'secondary'"
          @click="selectPlan('annually')"
        >
          {{ translateMe('Billed yearly') }}
          <strong style="white-space: pre; display: inline-flex; gap: 3px; margin-left: 4px;">
            <span>{{ translateMe('17%') }}</span>
            <span>{{ translateMe('Off') }}</span>
          </strong>
        </SelectButton>
      </div>
      <ToggleButton
        id="pricing-tab"
        v-if="bundle_plan !== null"
        :toggled="selectedPlan === 'bundle'"
        @click="selectPlan('bundle')"
      >
        {{ translateMe('App Bundle Plan') }}
        -
        <strong style="white-space: pre; font-weight: 900; display: inline-flex; gap: 3px; margin-left: 4px;">
          <span>{{ translateMe('70%') }}</span>
          <span>{{ translateMe('Off') }}</span>
        </strong>
      </ToggleButton>
    </div>
    <PlanShowcaseBanner
      v-if="bundle_plan"
      :useCardStyle="true"
      :fullWidth="this.full_width"
      :narrowWidth="this.narrow_width"
      :showcaseData="bundle_plan"
      :realPrice="parseFloat(calculateDiscountedPrice(bundle_plan)).toFixed(0)"
      :oldPrice="bundle_plan.price" @plan-clicked="handlePlanClicked(bundle_plan)"
      :isCurrentPlan="isCurrentPlanId(bundle_plan)"
    />
    <PPage
      class="app-manager-plan-page-slider custom-title"
      :full-width="this.full_width"
      :narrow-width="this.narrow_width"
    >
      <!-- -------------------- Bundle Plan Banner -------------------- -->
      <!-- <div class="promotional-banner">
        <VariantButton id="pricing-tab" :variant="'primary'" @click="selectPlan('bundle')">
          {{ translateMe('Start Saving Now') }}
        </VariantButton>
      </div> -->

      <PLayout class="custom-plan">
        <PlanCardsHighlights
          :plans="plans"
          :features="features"
          :currentPlan="plan"
          :shopifyPlan="shopify_plan"
          :promotionalDiscount="promotional_discount"
          :selectedInterval="selectedPlan"
          @plan-clicked="handlePlanClicked"
        />
        <div style="display: flex; flex-direction: column; align-items: center; gap: 16px;">
          <a href="#" class="toggle-plans-features" @click.prevent="togglePlansFeatures">
            {{ showPlansFeatures ? translateMe("Hide all features") : translateMe("Show all features") }}
          </a>
          <PlanTable
            :plans="plans"
            :currentPlan="plan"
            :shopifyPlan="shopify_plan"
            :promotionalDiscount="promotional_discount"
            :selectedInterval="selectedPlan"
            :features="features"
            :narrowWidth="this.narrow_width"
            @plan-clicked="handlePlanClicked"
            :class="{ 'hide-all-features': !showPlansFeatures }"
          />
        </div>

        <PStack v-if="onboard" class="choose-plan-btn" alignment="center" distribution="center" vertical>
          <PStackItem fill>
            <PButton plain @click="activePlan">{{ translateMe('I will choose the plan later') }}</PButton>
          </PStackItem>
        </PStack>

        <div class="customization-bundle-section">
          <!-- -------------------- Customization Block -------------------- -->
          <!-- <GetCustomBlock
            v-if="is_customizable"
            @click="handleCustomizePlan"
            :title="translateMe('Customization')"
            :description="translateMe('Check out all customization services that we offer')"
            :buttonText="translateMe('Get customization now')"
            style="flex-basis: 30%; flex-grow: 1;"
          /> -->
          <BundlePlanCard
            v-if="bundle_plan"
            :plan="bundle_plan"
            :plan_details="bundle_details"
            @plan-clicked="selectPlan"
          />
        </div>
        <CustomizationModal
          :visible="this.showCustomizationModal"
          @cancel="handleCustomizePlanClose"
          @submit=""
        />
      </PLayout>
      <div v-if="bundle_plan !== null" class="bundle-plan">
        <div class="light-divider"></div>
        <div class="bundle-category" v-for="category in bundle_details">
          <CategoryHeading :headingData="category"/>
          <div class="bundle-category-apps">
            <AppCard v-for="app in category.apps_relation" :appData="app"/>
          </div>
        </div>
        <CategoryHeading :headingData="additionalBenefitsHeading"/>
        <BenefitsBanner/>
      </div>
      <PlanBanners position="footer" @handlePlanBannerClose="handlePlanBannerClose"/>
    </PPage>
  </div>
</template>

<script>

import axios from "axios";
import PPage from "../polaris-vue/src/components/PPage/PPage";
import PStack from "../polaris-vue/src/components/PStack/PStack";
import PStackItem from "../polaris-vue/src/components/PStack/components/PStackItem/PStackItem";
import {PButton} from "../polaris-vue/src/components/PButton";
import {PButtonGroup} from "../polaris-vue/src/components/PButtonGroup";
import {PHeading} from "../polaris-vue/src/components/PHeading";
import {PLayout} from "../polaris-vue/src/components/PLayout";
import {PEmptyState} from "../polaris-vue/src/components/PEmptyState"
import AppCard from "../PolarisNew/AppCard";
import PlanShowcaseBanner from "../PolarisNew/PlanShowcaseBanner";
import CategoryHeading from "../PolarisNew/CategoryHeading";
import BenefitsBanner from "../PolarisNew/BenefitsBanner";
import VariantButton from "../PolarisNew/VariantButton";
import SelectButton from "../PolarisNew/SelectButton.vue";
import ToggleButton from "../PolarisNew/ToggleButton.vue";
import PlanCardsHighlights from "../PolarisNew/PlanCardsHighlights.vue";
import GetCustomBlock from "../PolarisNew/GetCustomBlock.vue";
import PlanTable from "../PolarisNew/PlanTable.vue";
import BundlePlanCard from "../PolarisNew/BundlePlanCard.vue";
import CustomizationModal from "@/components/PolarisNew/CustomizationModal.vue";
import { calculatePlanPriceWithDiscounts } from "@/helpers";
import PlanBanners from "@/components/Plans/PlanBanners.vue";

export default {
  name: "AppManagerSliderPlan",
  components: {
    PlanBanners,
    CustomizationModal,
    PPage,
    PStack,
    PStackItem,
    PButton,
    PButtonGroup,
    PHeading,
    PLayout,
    PEmptyState,
    AppCard,
    PlanShowcaseBanner,
    CategoryHeading,
    BenefitsBanner,
    VariantButton,
    SelectButton,
    ToggleButton,
    PlanCardsHighlights,
    GetCustomBlock,
    PlanTable,
    BundlePlanCard
  },
  props: ['shop_domain', 'host', 'discount_code', 'is_customizable', 'full_width', 'narrow_width'],
  data() {
    return {
      planLoading: false,
      plan: {},
      plans: [],
      valid_annual_plans: [],
      promotional_discount: {},
      features: [],
      featureValues: [],
      shopify_plan: '',
      default_plan_id: null,
      onboard: true,
      choose_later: false,
      has_active_charge: false,
      global_plan_charge: false,
      subtitleContent: '',
      selectedPlan: 'monthly',
      bundle_details: null,
      bundle_plan: null,
      showPlansFeatures: false,
      showCustomizationModal: false,
      additionalBenefitsHeading:{
        category_name: "Unlock additional benefits"
      },
    }
  },
  computed: {
    shop() {
      return {
        "name": this.shop_domain,
        "shopify_plan": this.shopify_plan,
        "has_plan": !!this.plan,
        "plan": this.plan,
        "default_plan_id": this.default_plan_id,
      };
    },
    monthlyPlan() {
      return this.plans.filter(plan => plan.interval === 'EVERY_30_DAYS');
    },
    yearlyPlan() {
      return this.plans.filter(plan => plan.interval === 'ANNUAL');
    },
  },
  methods: {
    translateMe(message) {
      return this.$translations.hasOwnProperty(message) ? this.$translations[message] : message;
    },
    isCurrentPlanId(plan) {
      return this.shop.plan && plan.id === this.shop.plan.id;
    },
    isActivePlanGlobal() {
      return Boolean(this.shop.plan?.is_global);
    },
    isActiveGlobalCharge() {
      return Boolean(this.global_plan_charge);
    },
    isSamePlanInOtherInterval(plan) {
      return this.shop.plan && (plan.shopify_plans === this.shop.plan.shopify_plans)
    },
    format(feature) {
      if (['double', 'integer'].includes(feature?.value_type)) {
        if (feature.format === 'percentage') {
          return `${feature.value}%`
        } else if (feature.format === 'count') {
          return (feature.value < 0 ? this.translateMe(`Unlimited`) : feature.value)
        } else return this.translateMe(feature.value);
      } else if (feature?.value_type === 'array') {
        let values = JSON.parse(feature.value);
        let that = this;
        values = values.map(function (value) {
          return that.translateMe(that.featureValues[feature.feature_id][value]);
        });
        return values.join(', ');
      } else if (feature?.value_type === 'string') {
        return this.translateMe(feature.value.replace('"', '').replace('"', ''));
      }
    },
    calculateDiscountedPrice(plan) {
      const planDetails = calculatePlanPriceWithDiscounts(plan, this.promotional_discount);
      return planDetails.price;
    },
    handlePlanClicked(plan) {
      this.getPlanUrl(plan);
    },
    async getPlanUrl(plan) {
      let shopName = this.shop.name;
      let host = this.host;
      let discount_code = this.discount_code;
      let queryString = `shop=${shopName}`;
      if (host != null) {
        queryString += `&host=${host}`
      }
      if (discount_code != null) {
        queryString += `&discount_code=${discount_code}`
      }
      const response = await axios.get(`${this.app_manager_config.baseUrl}/api/app-manager/plan/process/${plan.id}?${queryString}`).catch(error => {
        console.error(error)
      });
      if (response.data.plan_type === 'free_plan') {
        this.$emit('handlePlanSelect', {free_plan: true})
      } else {
        let redirectUrl = response.data.redirect_url;
        if (redirectUrl) {
          window.top.location.href = redirectUrl;
        }
      }
    },
    async activePlan() {
      const response = await this.activeWithoutPlan()
      if (response.data.status === true && this.onboard) {
        this.$emit('handlePlanSelect', {choose_later: true})
        this.onboard = false;
      }
    },
    async activeWithoutPlan() {
      return await axios.post(`${this.app_manager_config.baseUrl}/api/app-manager/active-without-plan`, {
        shop_domain: this.shop.name,
        plan_id: this.shop.default_plan_id
      }).catch(error => {
        console.error(error)
      });
    },
    async selectPlan(value) {
      this.selectedPlan = value;
      if (this.bundle_plan !== null) {
        let planElement = document.querySelector('.custom-plan');
        let bundleElement = document.querySelector('.bundle-plan');
        let billCycleBack = document.querySelector('.bill-cycle-back');
        let billCycleSelect = document.querySelector('.bill-cycle-select-group__inner-left');
        let promotionalBanner = document.querySelector('.promotional-banner');
        let bundlePlanShowcaseBanner = document.querySelector('.bundle-plan-showcase-banner');
        if (this.selectedPlan == 'bundle') {
          planElement.style.display = 'none';
          bundleElement.style.display = 'flex';
          billCycleBack.style.display = 'flex';
          billCycleSelect.style.display = 'none';
          if (promotionalBanner) {
            promotionalBanner.style.display = 'none';
          }
          bundlePlanShowcaseBanner.style.display = 'flex';
        } else {
          bundleElement.style.display = 'none';
          planElement.style.display = 'flex';
          billCycleBack.style.display = 'none';
          billCycleSelect.style.display = 'flex';
          if (promotionalBanner) {
            promotionalBanner.style.display = 'flex';
          }
          bundlePlanShowcaseBanner.style.display = 'none';
        }
      }
    },
    async fetchFeatures() {
      let {data} = await axios.get(`${this.app_manager_config.baseUrl}/api/app-manager/plan-features`).catch(error => {
        console.error(error)
      });
      if (data.features.length) {
        this.features = data.features;
        this.features = this.features?.filter((item) => item.hidden_feature !== true)
        this.features = this.features?.sort((featureA, featureB) => parseInt(featureA.display_order) - parseInt(featureB.display_order));
        //Get feature array time values
        this.features.forEach((feature) => {
          if (feature.value_type == 'array') {
            this.featureValues[feature.uuid] = feature.values;
          }
        });
      }
    },
    async fetchPlans() {
      let params = {
        'shop_domain': this.shop_domain
      };
      if (this.discount_code !== null) {
        params['discount_code'] = this.discount_code;
      }
      let {data} = await axios.get(`${this.app_manager_config.baseUrl}/api/app-manager/plans`, {params: params}).catch(error => {
        console.error(error)
      });
      if (data.plans.length) {
        for (let i = 0; i < data.plans.length; i++) {
          if (data.plans[i].interval === 'ANNUAL') {
            this.valid_annual_plans.push(data.plans[i]);
          }
        }
        this.plans = data.plans;
        this.plans = this.plans?.sort((planA, planB) => parseFloat(planA.price) - parseFloat(planB.price));

        if (this.plans[0].store_base_plan) {
          this.subtitleContent = this.translateMe('App plans are based on your existing shopify plan');
        }

        this.plan = data.plan;
        if (this.plan?.interval === 'ANNUAL') {
          this.selectedPlan = 'annually'
        }
        if (this.plan?.is_global) {
          this.selectedPlan = 'bundle'
        }
        this.shopify_plan = data.shopify_plan;
        this.default_plan_id = data.default_plan_id;
        this.choose_later = data.choose_later;
        this.onboard = this.default_plan_id && this.choose_later;
        this.has_active_charge = data.has_active_charge;
        this.global_plan_charge = data.global_plan_charge;
        this.promotional_discount =
          data.promotional_discount
          && typeof data.promotional_discount === 'object'
          && Object.keys(data.promotional_discount).length > 0
            ? data.promotional_discount
            : {};
        if (data.bundle_plan) {
          this.bundle_plan = data.bundle_plan;
        }
        if (data.bundle_details) {
          this.bundle_details = data.bundle_details;
        }
      }
    },
    handlePlanBannerClose(payload) {
      this.$emit('handlePlanBannerClose', payload)
      this.$emit('handle-plan-banner-close', payload)
    },
    togglePlansFeatures() {
      this.showPlansFeatures = !this.showPlansFeatures;
    },
    handleCustomizePlan() {
      this.showCustomizationModal = true
      this.$emit('handleCustomizePlan')
    },
    handleCustomizePlanClose() {
      this.showCustomizationModal = false
    }
  },
  async mounted() {
    this.planLoading = true;
    await this.fetchFeatures();
    await this.fetchPlans();
    this.planLoading = false;
  },
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Satisfy&display=swap');

/* ------------- Swiper Css ------------ */
/**
 * Swiper 8.4.7
 * Most modern mobile touch slider and framework with hardware accelerated transitions
 * https://swiperjs.com
 *
 * Copyright 2014-2023 Vladimir Kharlampidi
 *
 * Released under the MIT License
 *
 * Released on: January 30, 2023
 */

@font-face {
  font-family: 'swiper-icons';
  src: url('data:application/font-woff;charset=utf-8;base64, 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');
  font-weight: 400;
  font-style: normal;
}
:root {
  --swiper-theme-color: #007aff;
}
.swiper {
  margin-left: auto;
  margin-right: auto;
  position: relative;
  overflow: hidden;
  list-style: none;
  padding: 0;
  /* Fix of Webkit flickering */
  z-index: 1;
}
.swiper-vertical > .swiper-wrapper {
  flex-direction: column;
}
.swiper-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 1;
  display: flex;
  transition-property: transform;
  box-sizing: content-box;
}
.swiper-android .swiper-slide,
.swiper-wrapper {
  transform: translate3d(0px, 0, 0);
}
.swiper-pointer-events {
  touch-action: pan-y;
}
.swiper-pointer-events.swiper-vertical {
  touch-action: pan-x;
}
.swiper-slide {
  flex-shrink: 0;
  width: 100%;
  height: 100%;
  position: relative;
  transition-property: transform;
}
.swiper-slide-invisible-blank {
  visibility: hidden;
}
/* Auto Height */
.swiper-autoheight,
.swiper-autoheight .swiper-slide {
  height: auto;
}
.swiper-autoheight .swiper-wrapper {
  align-items: flex-start;
  transition-property: transform, height;
}
.swiper-backface-hidden .swiper-slide {
  transform: translateZ(0);
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}
/* 3D Effects */
.swiper-3d,
.swiper-3d.swiper-css-mode .swiper-wrapper {
  perspective: 1200px;
}
.swiper-3d .swiper-wrapper,
.swiper-3d .swiper-slide,
.swiper-3d .swiper-slide-shadow,
.swiper-3d .swiper-slide-shadow-left,
.swiper-3d .swiper-slide-shadow-right,
.swiper-3d .swiper-slide-shadow-top,
.swiper-3d .swiper-slide-shadow-bottom,
.swiper-3d .swiper-cube-shadow {
  transform-style: preserve-3d;
}
.swiper-3d .swiper-slide-shadow,
.swiper-3d .swiper-slide-shadow-left,
.swiper-3d .swiper-slide-shadow-right,
.swiper-3d .swiper-slide-shadow-top,
.swiper-3d .swiper-slide-shadow-bottom {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
}
.swiper-3d .swiper-slide-shadow {
  background: rgba(0, 0, 0, 0.15);
}
.swiper-3d .swiper-slide-shadow-left {
  background-image: linear-gradient(to left, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));
}
.swiper-3d .swiper-slide-shadow-right {
  background-image: linear-gradient(to right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));
}
.swiper-3d .swiper-slide-shadow-top {
  background-image: linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));
}
.swiper-3d .swiper-slide-shadow-bottom {
  background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));
}
/* CSS Mode */
.swiper-css-mode > .swiper-wrapper {
  overflow: auto;
  scrollbar-width: none;
  /* For Firefox */
  -ms-overflow-style: none;
  /* For Internet Explorer and Edge */
}
.swiper-css-mode > .swiper-wrapper::-webkit-scrollbar {
  display: none;
}
.swiper-css-mode > .swiper-wrapper > .swiper-slide {
  scroll-snap-align: start start;
}
.swiper-horizontal.swiper-css-mode > .swiper-wrapper {
  scroll-snap-type: x mandatory;
}
.swiper-vertical.swiper-css-mode > .swiper-wrapper {
  scroll-snap-type: y mandatory;
}
.swiper-centered > .swiper-wrapper::before {
  content: '';
  flex-shrink: 0;
  order: 9999;
}
.swiper-centered.swiper-horizontal > .swiper-wrapper > .swiper-slide:first-child {
  margin-inline-start: var(--swiper-centered-offset-before);
}
.swiper-centered.swiper-horizontal > .swiper-wrapper::before {
  height: 100%;
  min-height: 1px;
  width: var(--swiper-centered-offset-after);
}
.swiper-centered.swiper-vertical > .swiper-wrapper > .swiper-slide:first-child {
  margin-block-start: var(--swiper-centered-offset-before);
}
.swiper-centered.swiper-vertical > .swiper-wrapper::before {
  width: 100%;
  min-width: 1px;
  height: var(--swiper-centered-offset-after);
}
.swiper-centered > .swiper-wrapper > .swiper-slide {
  scroll-snap-align: center center;
  scroll-snap-stop: always;
}
.swiper-virtual .swiper-slide {
  -webkit-backface-visibility: hidden;
  transform: translateZ(0);
}
.swiper-virtual.swiper-css-mode .swiper-wrapper::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: none;
}
.swiper-virtual.swiper-css-mode.swiper-horizontal .swiper-wrapper::after {
  height: 1px;
  width: var(--swiper-virtual-size);
}
.swiper-virtual.swiper-css-mode.swiper-vertical .swiper-wrapper::after {
  width: 1px;
  height: var(--swiper-virtual-size);
}
:root {
  --swiper-navigation-size: 44px;
  /*
  --swiper-navigation-color: var(--swiper-theme-color);
  */
}
.swiper-button-prev,
.swiper-button-next {
  position: absolute;
  top: 50%;
  width: calc(var(--swiper-navigation-size) / 44 * 27);
  height: var(--swiper-navigation-size);
  margin-top: calc(0px - (var(--swiper-navigation-size) / 2));
  z-index: 10;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--swiper-navigation-color, var(--swiper-theme-color));
}
.swiper-button-prev.swiper-button-disabled,
.swiper-button-next.swiper-button-disabled {
  opacity: 0.35;
  cursor: auto;
  pointer-events: none;
}
.swiper-button-prev.swiper-button-hidden,
.swiper-button-next.swiper-button-hidden {
  opacity: 0;
  cursor: auto;
  pointer-events: none;
}
.swiper-navigation-disabled .swiper-button-prev,
.swiper-navigation-disabled .swiper-button-next {
  display: none !important;
}
.swiper-button-prev:after,
.swiper-button-next:after {
  font-family: swiper-icons;
  font-size: var(--swiper-navigation-size);
  text-transform: none !important;
  letter-spacing: 0;
  font-variant: initial;
  line-height: 1;
}
.swiper-button-prev,
.swiper-rtl .swiper-button-next {
  left: 10px;
  right: auto;
}
.swiper-button-prev:after,
.swiper-rtl .swiper-button-next:after {
  content: 'prev';
}
.swiper-button-next,
.swiper-rtl .swiper-button-prev {
  right: 10px;
  left: auto;
}
.swiper-button-next:after,
.swiper-rtl .swiper-button-prev:after {
  content: 'next';
}
.swiper-button-lock {
  display: none;
}
:root {
  /*
  --swiper-pagination-color: var(--swiper-theme-color);
  --swiper-pagination-bullet-size: 8px;
  --swiper-pagination-bullet-width: 8px;
  --swiper-pagination-bullet-height: 8px;
  --swiper-pagination-bullet-inactive-color: #000;
  --swiper-pagination-bullet-inactive-opacity: 0.2;
  --swiper-pagination-bullet-opacity: 1;
  --swiper-pagination-bullet-horizontal-gap: 4px;
  --swiper-pagination-bullet-vertical-gap: 6px;
  */
}
.swiper-pagination {
  position: absolute;
  text-align: center;
  transition: 300ms opacity;
  transform: translate3d(0, 0, 0);
  z-index: 10;
}
.swiper-pagination.swiper-pagination-hidden {
  opacity: 0;
}
.swiper-pagination-disabled > .swiper-pagination,
.swiper-pagination.swiper-pagination-disabled {
  display: none !important;
}
/* Common Styles */
.swiper-pagination-fraction,
.swiper-pagination-custom,
.swiper-horizontal > .swiper-pagination-bullets,
.swiper-pagination-bullets.swiper-pagination-horizontal {
  bottom: 10px;
  left: 0;
  width: 100%;
}
/* Bullets */
.swiper-pagination-bullets-dynamic {
  overflow: hidden;
  font-size: 0;
}
.swiper-pagination-bullets-dynamic .swiper-pagination-bullet {
  transform: scale(0.33);
  position: relative;
}
.swiper-pagination-bullets-dynamic .swiper-pagination-bullet-active {
  transform: scale(1);
}
.swiper-pagination-bullets-dynamic .swiper-pagination-bullet-active-main {
  transform: scale(1);
}
.swiper-pagination-bullets-dynamic .swiper-pagination-bullet-active-prev {
  transform: scale(0.66);
}
.swiper-pagination-bullets-dynamic .swiper-pagination-bullet-active-prev-prev {
  transform: scale(0.33);
}
.swiper-pagination-bullets-dynamic .swiper-pagination-bullet-active-next {
  transform: scale(0.66);
}
.swiper-pagination-bullets-dynamic .swiper-pagination-bullet-active-next-next {
  transform: scale(0.33);
}
.swiper-pagination-bullet {
  width: var(--swiper-pagination-bullet-width, var(--swiper-pagination-bullet-size, 8px));
  height: var(--swiper-pagination-bullet-height, var(--swiper-pagination-bullet-size, 8px));
  display: inline-block;
  border-radius: 50%;
  background: var(--swiper-pagination-bullet-inactive-color, #000);
  opacity: var(--swiper-pagination-bullet-inactive-opacity, 0.2);
}
button.swiper-pagination-bullet {
  border: none;
  margin: 0;
  padding: 0;
  box-shadow: none;
  -webkit-appearance: none;
  appearance: none;
}
.swiper-pagination-clickable .swiper-pagination-bullet {
  cursor: pointer;
}
.swiper-pagination-bullet:only-child {
  display: none !important;
}
.swiper-pagination-bullet-active {
  opacity: var(--swiper-pagination-bullet-opacity, 1);
  background: var(--swiper-pagination-color, var(--swiper-theme-color));
}
.swiper-vertical > .swiper-pagination-bullets,
.swiper-pagination-vertical.swiper-pagination-bullets {
  right: 10px;
  top: 50%;
  transform: translate3d(0px, -50%, 0);
}
.swiper-vertical > .swiper-pagination-bullets .swiper-pagination-bullet,
.swiper-pagination-vertical.swiper-pagination-bullets .swiper-pagination-bullet {
  margin: var(--swiper-pagination-bullet-vertical-gap, 6px) 0;
  display: block;
}
.swiper-vertical > .swiper-pagination-bullets.swiper-pagination-bullets-dynamic,
.swiper-pagination-vertical.swiper-pagination-bullets.swiper-pagination-bullets-dynamic {
  top: 50%;
  transform: translateY(-50%);
  width: 8px;
}
.swiper-vertical > .swiper-pagination-bullets.swiper-pagination-bullets-dynamic .swiper-pagination-bullet,
.swiper-pagination-vertical.swiper-pagination-bullets.swiper-pagination-bullets-dynamic .swiper-pagination-bullet {
  display: inline-block;
  transition: 200ms transform, 200ms top;
}
.swiper-horizontal > .swiper-pagination-bullets .swiper-pagination-bullet,
.swiper-pagination-horizontal.swiper-pagination-bullets .swiper-pagination-bullet {
  margin: 0 var(--swiper-pagination-bullet-horizontal-gap, 4px);
}
.swiper-horizontal > .swiper-pagination-bullets.swiper-pagination-bullets-dynamic,
.swiper-pagination-horizontal.swiper-pagination-bullets.swiper-pagination-bullets-dynamic {
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
}
.swiper-horizontal > .swiper-pagination-bullets.swiper-pagination-bullets-dynamic .swiper-pagination-bullet,
.swiper-pagination-horizontal.swiper-pagination-bullets.swiper-pagination-bullets-dynamic .swiper-pagination-bullet {
  transition: 200ms transform, 200ms left;
}
.swiper-horizontal.swiper-rtl > .swiper-pagination-bullets-dynamic .swiper-pagination-bullet {
  transition: 200ms transform, 200ms right;
}
/* Progress */
.swiper-pagination-progressbar {
  background: rgba(0, 0, 0, 0.25);
  position: absolute;
}
.swiper-pagination-progressbar .swiper-pagination-progressbar-fill {
  background: var(--swiper-pagination-color, var(--swiper-theme-color));
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  transform: scale(0);
  transform-origin: left top;
}
.swiper-rtl .swiper-pagination-progressbar .swiper-pagination-progressbar-fill {
  transform-origin: right top;
}
.swiper-horizontal > .swiper-pagination-progressbar,
.swiper-pagination-progressbar.swiper-pagination-horizontal,
.swiper-vertical > .swiper-pagination-progressbar.swiper-pagination-progressbar-opposite,
.swiper-pagination-progressbar.swiper-pagination-vertical.swiper-pagination-progressbar-opposite {
  width: 100%;
  height: 4px;
  left: 0;
  top: 0;
}
.swiper-vertical > .swiper-pagination-progressbar,
.swiper-pagination-progressbar.swiper-pagination-vertical,
.swiper-horizontal > .swiper-pagination-progressbar.swiper-pagination-progressbar-opposite,
.swiper-pagination-progressbar.swiper-pagination-horizontal.swiper-pagination-progressbar-opposite {
  width: 4px;
  height: 100%;
  left: 0;
  top: 0;
}
.swiper-pagination-lock {
  display: none;
}
/* Scrollbar */
.swiper-scrollbar {
  border-radius: 10px;
  position: relative;
  -ms-touch-action: none;
  background: rgba(0, 0, 0, 0.1);
}
.swiper-scrollbar-disabled > .swiper-scrollbar,
.swiper-scrollbar.swiper-scrollbar-disabled {
  display: none !important;
}
.swiper-horizontal > .swiper-scrollbar,
.swiper-scrollbar.swiper-scrollbar-horizontal {
  position: absolute;
  left: 1%;
  bottom: 3px;
  z-index: 50;
  height: 5px;
  width: 98%;
}
.swiper-vertical > .swiper-scrollbar,
.swiper-scrollbar.swiper-scrollbar-vertical {
  position: absolute;
  right: 3px;
  top: 1%;
  z-index: 50;
  width: 5px;
  height: 98%;
}
.swiper-scrollbar-drag {
  height: 100%;
  width: 100%;
  position: relative;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  left: 0;
  top: 0;
}
.swiper-scrollbar-cursor-drag {
  cursor: move;
}
.swiper-scrollbar-lock {
  display: none;
}
.swiper-zoom-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.swiper-zoom-container > img,
.swiper-zoom-container > svg,
.swiper-zoom-container > canvas {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
.swiper-slide-zoomed {
  cursor: move;
}
/* Preloader */
:root {
  /*
  --swiper-preloader-color: var(--swiper-theme-color);
  */
}
.swiper-lazy-preloader {
  width: 42px;
  height: 42px;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -21px;
  margin-top: -21px;
  z-index: 10;
  transform-origin: 50%;
  box-sizing: border-box;
  border: 4px solid var(--swiper-preloader-color, var(--swiper-theme-color));
  border-radius: 50%;
  border-top-color: transparent;
}
.swiper:not(.swiper-watch-progress) .swiper-lazy-preloader,
.swiper-watch-progress .swiper-slide-visible .swiper-lazy-preloader {
  animation: swiper-preloader-spin 1s infinite linear;
}
.swiper-lazy-preloader-white {
  --swiper-preloader-color: #fff;
}
.swiper-lazy-preloader-black {
  --swiper-preloader-color: #000;
}
@keyframes swiper-preloader-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
/* a11y */
.swiper .swiper-notification {
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: none;
  opacity: 0;
  z-index: -1000;
}
.swiper-free-mode > .swiper-wrapper {
  transition-timing-function: ease-out;
  margin: 0 auto;
}
.swiper-grid > .swiper-wrapper {
  flex-wrap: wrap;
}
.swiper-grid-column > .swiper-wrapper {
  flex-wrap: wrap;
  flex-direction: column;
}
.swiper-fade.swiper-free-mode .swiper-slide {
  transition-timing-function: ease-out;
}
.swiper-fade .swiper-slide {
  pointer-events: none;
  transition-property: opacity;
}
.swiper-fade .swiper-slide .swiper-slide {
  pointer-events: none;
}
.swiper-fade .swiper-slide-active,
.swiper-fade .swiper-slide-active .swiper-slide-active {
  pointer-events: auto;
}
.swiper-cube {
  overflow: visible;
}
.swiper-cube .swiper-slide {
  pointer-events: none;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  z-index: 1;
  visibility: hidden;
  transform-origin: 0 0;
  width: 100%;
  height: 100%;
}
.swiper-cube .swiper-slide .swiper-slide {
  pointer-events: none;
}
.swiper-cube.swiper-rtl .swiper-slide {
  transform-origin: 100% 0;
}
.swiper-cube .swiper-slide-active,
.swiper-cube .swiper-slide-active .swiper-slide-active {
  pointer-events: auto;
}
.swiper-cube .swiper-slide-active,
.swiper-cube .swiper-slide-next,
.swiper-cube .swiper-slide-prev,
.swiper-cube .swiper-slide-next + .swiper-slide {
  pointer-events: auto;
  visibility: visible;
}
.swiper-cube .swiper-slide-shadow-top,
.swiper-cube .swiper-slide-shadow-bottom,
.swiper-cube .swiper-slide-shadow-left,
.swiper-cube .swiper-slide-shadow-right {
  z-index: 0;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}
.swiper-cube .swiper-cube-shadow {
  position: absolute;
  left: 0;
  bottom: 0px;
  width: 100%;
  height: 100%;
  opacity: 0.6;
  z-index: 0;
}
.swiper-cube .swiper-cube-shadow:before {
  content: '';
  background: #000;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  filter: blur(50px);
}
.swiper-flip {
  overflow: visible;
}
.swiper-flip .swiper-slide {
  pointer-events: none;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  z-index: 1;
}
.swiper-flip .swiper-slide .swiper-slide {
  pointer-events: none;
}
.swiper-flip .swiper-slide-active,
.swiper-flip .swiper-slide-active .swiper-slide-active {
  pointer-events: auto;
}
.swiper-flip .swiper-slide-shadow-top,
.swiper-flip .swiper-slide-shadow-bottom,
.swiper-flip .swiper-slide-shadow-left,
.swiper-flip .swiper-slide-shadow-right {
  z-index: 0;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}
.swiper-creative .swiper-slide {
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  overflow: hidden;
  transition-property: transform, opacity, height;
}
.swiper-cards {
  overflow: visible;
}
.swiper-cards .swiper-slide {
  transform-origin: center bottom;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  overflow: hidden;
}

.app-manager .app-manager-wrapper {
  padding-top: 16px;
}

.app-manager .app-manager-plan-page-slider ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.app-manager .app-manager-plan-page-slider .Polaris-ResourceList__ResourceListWrapper.features li,
.app-manager .app-manager-plan-page-slider .plan__price {
  padding: 16px 16px 16px 20px;
}

.app-manager .app-manager-plan-page-slider .Polaris-ResourceList__ResourceListWrapper.features li {
  border-top: 1px solid #dddddd;
  border-right: 1px solid #dddddd;
  background: #fff;
  border-right: none;
  border-left: 1px solid #dddddd;
}

.app-manager .app-manager-plan-page-slider .Polaris-ResourceList__ResourceListWrapper.features li:last-child {
  border-bottom: 1px solid #dddddd;
}

.app-manager .app-manager-plan-page-slider .Polaris-ResourceList__ResourceListWrapper.features li:first-child {
  border-top-left-radius: 12px;
}

.app-manager .app-manager-plan-page-slider .Polaris-ResourceList__ResourceListWrapper.features li:last-child {
  border-bottom-left-radius: 12px;
}

.app-manager .app-manager-plan-page-slider .plan__price {
  border-left: 1px solid #dddddd;
  box-shadow: none;
  border-top-left-radius: 12px;
  overflow: hidden;
}

.app-manager .app-manager-plan-page-slider .feature__list,
.app-manager .app-manager-plan-page-slider .feature__type__array {
  display: flex;
  align-items: center;
  word-spacing: 999px;
  justify-content: center;
}

.app-manager .app-manager-plan-page-slider .feature__type__array.feature__class {
  justify-content: left;
}

.app-manager .app-manager-plan-page-slider .plan-heading b {
  overflow-wrap: break-word;
  word-wrap: break-word;
  white-space: initial;
}

.app-manager-plan-banner {
  margin-right: 30px;
  margin-left: 30px;
}

.bundle-plan {
  display: none;
  flex-direction: column;
  gap: 20px;
}

.bundle-category {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 10px;
}

.bundle-category-apps {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.light-divider {
  border-top: 1px solid #E3E3E3;
  margin-top: 10px;
  margin-bottom: 10px;
}

.app-manager .Polaris-Icon--colorSuccess svg {
  fill: black !important;
}

.button-group-new {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.bill-cycle-select-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  max-width: 1200px !important;
  margin-left: auto;
  margin-right: auto;
  padding: 0 96px;
}

.bill-cycle-select-group.full-width {
  max-width: none !important;
}

.bill-cycle-select-group.narrow-width {
  max-width: 840px !important;
}

.bill-cycle-select-group__inner-left {
  width: fit-content;
  display: flex;
  gap: 4px;
  align-items: center;
  justify-content: center;
  border-radius: 40px;
  padding: 4px;
  border: 1px solid black;
}

.bill-cycle-back {
  display: none;
  align-items: center;
  color: rgba(48, 48, 48, 1);
  cursor: pointer;
  gap: 4px;
  font-weight: 450;
  font-size: 14px;
}

.promotional-banner {
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: end;
  padding-right: 36px;
  //background-image: url('../../assets/25for70lessBanner.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 8px;
  margin-bottom: 22px;
}

.custom-plan {
  display: flex;
  flex-direction: column;
  align-items: center !important;
  gap: 24px;
  margin-left: 0 !important;
  margin-right: 0 !important;
}

.toggle-plans-features {
  font-size: 13px;
  font-weight: 500;
  color: rgba(48, 48, 48, 1);
  text-decoration: none;
}

.hide-all-features {
  visibility: hidden;
  overflow: hidden;
  height: 0px;
  margin-top: 0px !important;
}

.customization-bundle-section {
  display: flex;
  flex-direction: row;
  gap: 24px;
  width: 100%;
}

.app-manager .app-manager-plan-page-slider {
  padding-left: 96px !important;
  padding-right: 96px !important;
  max-width: 1200px !important;
}

.app-manager .app-manager-plan-page-slider.Polaris-Page--fullWidth {
  max-width: none !important;
}

.app-manager .app-manager-plan-page-slider.Polaris-Page--narrowWidth {
  max-width: 840px !important;
}

@media (max-width: 1023px) {
  .customization-bundle-section {
    flex-direction: column;
    gap: 20px;
  }
}

@media (max-width: 992px) {
  .bill-cycle-select-group.full-width,
  .app-manager .app-manager-plan-page-slider.Polaris-Page--fullWidth {
    max-width: none !important;
  }
}

@media (max-width: 767px) {
  .bill-cycle-select-group.full-width,
  .app-manager .app-manager-plan-page-slider.Polaris-Page--fullWidth {
    max-width: 100% !important;
  }
  .bill-cycle-select-group {
    flex-direction: column;
    gap: 10px;
  }
}

@media (max-width: 700px) {
  .Polaris-ButtonGroup__Item {
    width: auto !important;
  }
  .app-manager .Polaris-Button {
    padding: 7px 8px !important;
  }
  .bill-cycle-select-group {
    padding: 0 8px;
  }
}

@media (max-width: 640px) {
  .app-manager .app-manager-plan-page-slider {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
}
</style>
