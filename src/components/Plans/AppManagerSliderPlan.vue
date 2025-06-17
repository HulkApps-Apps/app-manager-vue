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
          <strong style="white-space: pre;">{{ translateMe(' 17% Off') }}</strong>
        </SelectButton>
      </div>
      <ToggleButton
        id="pricing-tab"
        v-if="bundle_plan !== null"
        :toggled="selectedPlan === 'bundle'"
        @click="selectPlan('bundle')"
      >
        {{ translateMe('App Bundle Plan -') }}
        <strong style="white-space: pre; font-weight: 900;">{{ translateMe('70% Off') }}</strong>
      </ToggleButton>
    </div>
    <PlanShowcaseBanner
      v-if="bundle_plan"
      :useCardStyle="true"
      :fullWidth="this.full_width"
      :showcaseData="bundle_plan"
      :realPrice="parseFloat(calculateDiscountedPrice(bundle_plan)).toFixed(0)"
      :oldPrice="bundle_plan.price" @plan-clicked="handlePlanClicked(bundle_plan)"
      :isCurrentPlan="isCurrentPlanId(bundle_plan)"
    />
    <PPage
      class="app-manager-plan-page-slider custom-title"
      :full-width="this.full_width"
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
  props: ['shop_domain', 'host', 'discount_code', 'is_customizable', 'full_width'],
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
@import url('https://cdnjs.cloudflare.com/ajax/libs/Swiper/8.4.7/swiper-bundle.css');

.app-manager .app-manager-wrapper {
  padding-top: 16px;
}

.app-manager .app-manager-plan-page-slider ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.app-manager .Polaris-Page--fullWidth {
  max-width: calc(100% - 200px) !important;
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
  max-width: 998px;
  margin-left: auto;
  margin-right: auto;
  padding: 0px 32px;
}

.bill-cycle-select-group.full-width {
  max-width: calc(100% - 200px);
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
  color: #006FBB;
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
  color: #303030;
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

@media (max-width: 1023px) {
  .customization-bundle-section {
    flex-direction: column;
    gap: 20px;
  }
}

@media (max-width: 992px) {
  .bill-cycle-select-group.full-width,
  .app-manager .Polaris-Page--fullWidth {
    max-width: calc(100% - 64px) !important;
  }
}

@media (max-width: 767px) {
  .bill-cycle-select-group.full-width,
  .app-manager .Polaris-Page--fullWidth {
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
</style>
