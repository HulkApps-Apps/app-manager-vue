
<template>
<!--    <PSkeletonPage :title="translateMe('Plans')"-->
<!--                   :fullWidth="false"-->
<!--                   primaryAction-->
<!--                   :secondaryActions="2"-->
<!--                   :breadcrumbs="false"-->
<!--                   v-if="planLoading">-->
<!--        <PLayout>-->
<!--            <PLayoutSection oneThird="">-->
<!--                <PCard sectioned="">-->
<!--                    <PTextContainer>-->
<!--                        <PSkeletonDisplayText size="small" />-->
<!--                        <PSkeletonBodyText />-->
<!--                    </PTextContainer>-->
<!--                </PCard>-->
<!--            </PLayoutSection>-->
<!--            <PLayoutSection oneThird="">-->
<!--                <PCard sectioned="">-->
<!--                    <PTextContainer>-->
<!--                        <PSkeletonDisplayText size="small" />-->
<!--                        <PSkeletonBodyText />-->
<!--                    </PTextContainer>-->
<!--                </PCard>-->
<!--            </PLayoutSection>-->
<!--            <PLayoutSection oneThird="">-->
<!--                <PCard sectioned="">-->
<!--                    <PTextContainer>-->
<!--                        <PSkeletonDisplayText size="small" />-->
<!--                        <PSkeletonBodyText />-->
<!--                    </PTextContainer>-->
<!--                </PCard>-->
<!--            </PLayoutSection>-->
<!--        </PLayout>-->
<!--        <PLayout style="margin-top: 20px">-->
<!--            <PLayoutSection>-->
<!--                <PCard sectioned=""><PSkeletonBodyText /></PCard>-->
<!--                <PCard sectioned=""><PSkeletonBodyText /></PCard>-->
<!--                <PCard sectioned=""><PSkeletonBodyText /></PCard>-->
<!--                <PCard sectioned=""><PSkeletonBodyText /></PCard>-->
<!--            </PLayoutSection>-->
<!--        </PLayout>-->
<!--    </PSkeletonPage>-->
    <PEmptyState
          :heading="translateMe('No Plans')"
            image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
            v-if="!this.planLoading && this.plans.length === 0"
    >
    </PEmptyState>
    <div v-else-if="!this.planLoading && this.plans.length > 0">
      <PlanBanners position="header" @handlePlanBannerClose="handlePlanBannerClose" class="app-manager-plan-banner"/>
      <div class="bill-cycle-select-group">
        <a class="bill-cycle-back" @click="selectPlan('monthly')">
            <img src="../../assets/ArrowLeft.svg" alt="Left Arrow">
            {{ translateMe('Back to App pricing') }}
        </a>
        <div class="bill-cycle-select-group__inner-left">
            <SelectButton id="pricing-tab" :variant="selectedPlan === 'monthly' ? 'primary' : 'secondary'" @click="selectPlan('monthly')">
                {{ translateMe('Billed Monthly') }}
            </SelectButton>
            <SelectButton id="pricing-tab" v-if="valid_annual_plans.length > 0" :variant="selectedPlan === 'annually' ? 'primary' : 'secondary'" @click="selectPlan('annually')">
                {{ translateMe('Billed Yearly') }}
                <strong style="white-space: pre;">{{ translateMe(' 17% Off') }}</strong>
            </SelectButton>
        </div>
        <ToggleButton id="pricing-tab" v-if="bundle_plan !== null" :toggled="selectedPlan === 'bundle' ? true : false" @click="selectPlan('bundle')">
            {{ translateMe('App Bundle Plan -') }}
            <strong style="white-space: pre; font-weight: 900;">{{ translateMe('70% Off') }}</strong>
        </ToggleButton>
    </div>
    <PlanShowcaseBanner :useCardStyle="true" :showcaseData="bundle_plan" :realPrice="parseFloat(calculateDiscountedPrice(bundle_plan)).toFixed(0)" :oldPrice="bundle_plan.price" @plan-clicked="handlePlanClicked(bundle_plan)" :isCurrentPlan="isCurrentPlanId(bundle_plan)"/>
    <PPage
            class="app-manager-plan-page-slider custom-title"
    >
        <!-- <hr style="width: 100%; margin-right: auto;margin-left: auto;margin-bottom: 20px;" /> -->
        <div class="promotional-banner">
            <VariantButton id="pricing-tab" :variant="'primary'" @click="selectPlan('bundle')">
                {{ translateMe('Start Saving Now') }}
            </VariantButton>
        </div>
        <!--=======================================================-->
        <PLayout class="custom-plan">
            <PlanCardsHighlights :plans="plans" :selectedInterval="selectedPlan" @plan-clicked="handlePlanClicked"/>
            <div style="display: flex; flex-direction: column; align-items: center;">
            <a href="#" class="toggle-plans-features" @click.prevent="togglePlansFeatures">
                {{ showPlansFeatures ? translateMe("Hide all features") : translateMe("Show all features") }}
            </a>
            <PlanTable v-if="showPlansFeatures" :plans="plans" @plan-clicked="handlePlanClicked" style="margin-left: 20px; margin-top: 20px;" />
            </div>
            <div class="customization-bundle-section">
                <GetCustomBlock :title="translateMe('Customization')" :description="translateMe('Check out all customization services that we offer')" :buttonText="translateMe('Get customization now')" style="margin-left: 20px; flex-basis: 30%; flex-grow: 1;" />
                <BundlePlanCard :plan="bundle_plan" :plan_details="bundle_details" @plan-clicked="selectPlan" style="margin-left: 20px; flex-basis: 62%; flex-grow: 1;" />
            </div>
            <!-- <PLayoutSection style="display: flex;border-radius: 20px;">
                <template style="margin-bottom: 20px; display: flex !important;">
                    <template >
                        <div class="Polaris-ResourceList__ResourceListWrapper features" style="width: 20%">
                            <div class="plan__price"></div>
                            <ul class="Polaris-ResourceList">
                                <li class="Polaris-ResourceList__ItemWrapper pro_title" :class="`${feature.value_type}__type__${feature.slug} feature__type__${feature.value_type} feature__class`" v-for="(feature, key) in features" :key="key">
                                    <div class="Polaris-ResourceList-Item__Container">
                                        <div class="Polaris-ResourceList-Item__Content">
                                            <h1 class="for-price-per-month"><span>{{ translateMe(feature.name) }}</span></h1>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </template>
                    <carousel style="width: 80%" :per-page="perPage" :mouseDrag="false" :navigation-enabled="true" :paginationEnabled="false" :navigateTo="[this.currentSlide,true]" @transition-start="handleNavigationClick($event)">
                        <template>
                            <slide :id="key" :class="`slide-${key}`" v-for="(plan, key) in selectedPlan === 'monthly' ? monthlyPlan : yearlyPlan" :key="`slide-${key}`" >
                                <div class="plan__price" :style="activePlanStyle(plan)">
                                    <div v-if="plan.price === 0">
                                        <b v-if="plan.name !== 'Free'" style="font-size: 16px">{{translateMe(plan.name)}}</b>
                                        <p style="display: flex;margin-top: 10px">
                                            <PHeading style="font-size: 23px;font-weight: 700;">{{translateMe('Free')}}</PHeading>
                                        </p>
                                    </div>
                                    <div v-else-if="plan.discount && plan.discount > 0 && !isCurrentPlan(plan)" >
                                        <b style="font-size: 16px">{{translateMe(plan.name)}}</b>
                                        <p style="display: flex;margin-top: 10px">
                                            <PHeading style="font-size: 23px;font-weight: 700;">${{parseFloat(calculateDiscountedPrice(plan)).toFixed(2)}}</PHeading>
                                            <b style="margin-top: 5px;font-size: 17px">/{{translateMe(selectedPlan === 'monthly' ? ("mo") : ("year"))}}</b>
                                        </p>
                                        <p style="display: flex;margin-top: 7px">
                                            <PHeading style="font-size: 18px;font-weight: 500; text-decoration:line-through;">${{parseFloat(plan.price).toFixed(2)}}</PHeading>
                                            <b style="margin-top: 3px;font-size: 14px">/{{translateMe(selectedPlan === 'monthly' ? ("mo") : ("year"))}}</b>
                                        </p>
                                    </div>
                                  <div v-else-if="promotional_discount && promotional_discount.length !== 0 && !promotional_discount.errors && !plan.is_global && promotional_discount.plan_relation.length > 0 && promotional_discount.plan_relation.includes(plan.id)  && !isCurrentPlan(plan)" >
                                    <b style="font-size: 16px">{{translateMe(plan.name)}}</b>
                                    <p style="display: flex;margin-top: 10px">
                                      <PHeading style="font-size: 23px;font-weight: 700;">${{parseFloat(calculatePromotionalDiscountedPrice(plan, promotional_discount)).toFixed(2)}}</PHeading>
                                      <b style="margin-top: 5px;font-size: 17px">/{{translateMe(selectedPlan === 'monthly' ? ("mo") : ("year"))}}</b>
                                    </p>
                                    <p style="display: flex;margin-top: 7px">
                                      <PHeading style="font-size: 18px;font-weight: 500; text-decoration:line-through;">${{parseFloat(plan.price).toFixed(2)}}</PHeading>
                                      <b style="margin-top: 3px;font-size: 14px">/{{translateMe(selectedPlan === 'monthly' ? ("mo") : ("year"))}}</b>
                                    </p>
                                  </div>
                                  <div v-else-if="promotional_discount && promotional_discount.length !== 0 && !promotional_discount.errors && !plan.is_global && promotional_discount.plan_relation.length === 0 && promotional_discount.value > 0 && !isCurrentPlan(plan)" >
                                    <b style="font-size: 16px">{{translateMe(plan.name)}}</b>
                                    <p style="display: flex;margin-top: 10px">
                                      <PHeading style="font-size: 23px;font-weight: 700;">${{parseFloat(calculatePromotionalDiscountedPrice(plan, promotional_discount)).toFixed(2)}}</PHeading>
                                      <b style="margin-top: 5px;font-size: 17px">/{{translateMe(selectedPlan === 'monthly' ? ("mo") : ("year"))}}</b>
                                    </p>
                                    <p style="display: flex;margin-top: 7px">
                                      <PHeading style="font-size: 18px;font-weight: 500; text-decoration:line-through;">${{parseFloat(plan.price).toFixed(2)}}</PHeading>
                                      <b style="margin-top: 3px;font-size: 14px">/{{translateMe(selectedPlan === 'monthly' ? ("mo") : ("year"))}}</b>
                                    </p>
                                  </div>
                                    <div v-else>
                                        <b style="font-size: 16px">{{translateMe(plan.name)}}</b>
                                        <p style="display: flex;margin-top: 10px">
                                            <PHeading style="font-size: 23px;font-weight: 700;">${{parseFloat(plan.price).toFixed(2)}}</PHeading>
                                               <b style="margin-top: 5px;font-size: 17px">/{{translateMe(selectedPlan === 'monthly' ? ("mo") : ("year"))}}</b>
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <ul>

                                        <li v-for="(feature, key) in features" :class="`${feature.value_type}__type__${feature.slug} feature__list feature__type__${feature.value_type}`" :key="key" :style="activePlanStyle(plan)">
                                            <div>
                                                <template v-if="plan.features && plan.features[feature.uuid]" style="display: flex">
                                                    <template v-if="plan.features[feature.uuid].value_type === 'boolean'">
                                                        <PIcon v-if="parseInt(plan.features[feature.uuid].value) === 1" color="success" source="TickMinor"/>
                                                        <PIcon v-else color="subdued" source="MinusMinor"/>
                                                    </template>
                                                    <template v-else style="display: flex">
                                                        <span v-if="plan.features[feature.uuid].value">{{ format(plan.features[feature.uuid]) }}</span>
                                                        <PIcon v-else color="subdued" source="MinusMinor"/>
                                                    </template>
                                                </template>
                                                <template v-else>
                                                    <PIcon color="subdued" source="MinusMinor"/>
                                                </template>
                                            </div>
                                          </li>
                                          <li v-if="features.length > 0" :class="`${features[features.length - 1].value_type}__type__${features[features.length - 1].slug} feature__list feature__type__${features[features.length - 1].value_type}`">
                                            <div>
                                              <PButton v-if="isCurrentPlan(plan)" :disabled="isCurrentPlan(plan)"
                                                       full-width
                                                       :pressed="isCurrentPlan(plan)">
                                                {{ translateMe('Current Plan') }}
                                              </PButton>
                                              <PButton v-else-if="(!plan.store_base_plan || plan.shopify_plans.includes(shop.shopify_plan))"
                                                       full-width
                                                       :disabled="isActivePlanGlobal() && !isActiveGlobalCharge()"
                                                       @click="plan ? getPlanUrl(plan) : 'javascript:void'"
                                                       class="custom-choose-button">
                                                {{ isActivePlanGlobal() ? (!isActiveGlobalCharge() ? translateMe('Not Applicable') : translateMe('Choose Plan')) : translateMe('Choose Plan') }}
                                              </PButton>
                                              <PButton v-else :disabled="true"
                                                       full-width
                                                       :pressed="true">
                                                {{ translateMe('Not applicable') }}
                                              </PButton>
                                            </div>
                                          </li>
                                      <li></li>
                                    </ul>
                                </div>
                            </slide>
                        </template>
                    </carousel>
                </template>
            </PLayoutSection> -->
        </PLayout>
        <div v-if="bundle_plan !== null" class="bundle-plan">
            <!-- <PlanShowcaseBanner :useCardStyle="true" :showcaseData="bundle_plan" :realPrice="parseFloat(calculateDiscountedPrice(bundle_plan)).toFixed(0)" :oldPrice="bundle_plan.price" @plan-clicked="handlePlanClicked(bundle_plan)" :isCurrentPlan="isCurrentPlanId(bundle_plan)"/> -->
            <div class="light-divider"></div>
            <div class="bundle-category" v-for="category in bundle_details">
                <CategoryHeading :headingData="category" />
                <div class="bundle-category-apps">
                    <AppCard v-for="app in category.apps_relation" :appData="app" />
                </div>
            </div>
            <CategoryHeading :headingData="additionalBenefitsHeading" />
            <BenefitsBanner />
        </div>
        <!--====================================================================-->
        <PStack v-if="onboard" class="choose-plan-btn" alignment="center" distribution="center" vertical>
            <PStackItem fill>
                <PButton plain @click="activePlan">{{ translateMe('I will choose the plan later') }}</PButton>
            </PStackItem>
        </PStack>
      <PlanBanners position="footer" @handlePlanBannerClose="handlePlanBannerClose" /> 
    </PPage>
</div>
</template>

<script>

    import axios from "axios";
    import PlanBanners from "./PlanBanners";
    import YearlyPlanPromotion from "./YearlyPlanPromotion";
    import PPage from "../polaris-vue/src/components/PPage/PPage";
    import PStack from "../polaris-vue/src/components/PStack/PStack";
    import PStackItem from "../polaris-vue/src/components/PStack/components/PStackItem/PStackItem";
    import {PButton} from "../polaris-vue/src/components/PButton";
    import {PButtonGroup} from "../polaris-vue/src/components/PButtonGroup";
    import {PHeading} from "../polaris-vue/src/components/PHeading";
    import {PLayout} from "../polaris-vue/src/components/PLayout";
    import {PLayoutSection} from "../polaris-vue/src/components/PLayout/components/PLayoutSection";
    import {PTextContainer} from "../polaris-vue/src/components/PTextContainer";
    import {PDataTable} from "../polaris-vue/src/components/PDataTable";
    import {PDataTableCol} from "../polaris-vue/src/components/PDataTable/components/PDataTableCol";
    import {PDataTableRow} from "../polaris-vue/src/components/PDataTable/components/PDataTableRow";
    import {PIcon} from "../polaris-vue/src/components/PIcon";
    import {PTextStyle} from "../polaris-vue/src/components/PTextStyle";
    import {PCard} from "../polaris-vue/src/components/PCard"
    import {PCardSection} from "../polaris-vue/src/components/PCard/components/PCardSection"
    import {PSkeletonPage} from "../polaris-vue/src/components/PSkeletonPage"
    import {PSkeletonDisplayText} from "../polaris-vue/src/components/PSkeletonDisplayText"
    import {PSkeletonBodyText} from "../polaris-vue/src/components/PSkeletonBodyText"
    import {PEmptyState} from "../polaris-vue/src/components/PEmptyState"
    import {Carousel, Slide} from 'vue-carousel';
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

    export default {
        name: "AppManagerSliderPlan",
        components: { Carousel, Slide, YearlyPlanPromotion, PlanBanners, PPage, PStack, PStackItem, PButton, PButtonGroup, PHeading, PLayout, PLayoutSection, PTextContainer, PDataTable, PDataTableCol, PDataTableRow, PIcon, PTextStyle, PCardSection, PCard, PSkeletonDisplayText, PSkeletonBodyText, PSkeletonPage, PEmptyState, AppCard, PlanShowcaseBanner, CategoryHeading, BenefitsBanner, VariantButton, SelectButton, ToggleButton, PlanCardsHighlights, GetCustomBlock, PlanTable, BundlePlanCard },
        props: ['shop_domain','host', 'discount_code'],
        data() {
            return {
                slideLength : 0,
                perPage: 0,
                currentSlide: 0,
                planLoading: false,
                plan: {},
                plans: [],
                valid_annual_plans: [],
                promotional_discount: [],
                features: [],
                featureValues:[],
                shopify_plan: '',
                default_plan_id: null,
                onboard: true,
                choose_later: false,
                has_active_charge: false,
                global_plan_charge: false,
                subtitleContent: '',
                checkList: [
                    "60 days free trial",
                ],
                selectedPlan:'monthly',
                monthlySelectedStyle:{
                    height: '60px',
                    backgroundColor:'#257f60',
                    color:'#fff',
                    position:'relative',
                    right:'-5px',
                    borderRadius:'8px',
                    zIndex: 1,
                },
                yearlySelectedStyle:{
                    height: '60px',
                    backgroundColor:'#257f60',
                    position:'relative',
                    left:'-5px',
                    borderRadius:'8px'
                },
                bundleSelectedSyle:{
                    height: '60px',
                    backgroundColor:'#257f60',
                    position:'relative',
                    left:'-5px',
                    borderRadius:'8px'
                },
                monthlyStyle:{
                    height: '55px',
                    backgroundColor:'#FFFFFF',
                    boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
                    border:'none',
                    borderRadius:'8px',
                    ZIndex: 11,
                },
                yearlyStyle:{
                    color:'#258060',
                    height: '55px',
                    backgroundColor:'#FFFFFF',
                    boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
                    border:'none',
                    borderRadius:'8px'
                },
                bundleStyle:{
                    color:'#258060',
                    height: '55px',
                    backgroundColor:'#FFFFFF',
                    boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
                    border:'none',
                    borderRadius:'8px'
                },
                additionalBenefitsHeading:{
                    category_name: "Unlock Additional Benefits"
                },
                "bundle_details": null,
                "bundle_plan": null,
                "showPlansFeatures": false,
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
            headings() {
                let headings = [this.translateMe('Plans & Features')];
                this.plans.forEach(plan => {

                    let heading = (plan.name);
                    if (plan.price > 0) heading += ` ($${plan.price}/mo)`;
                    headings.push(heading);
                });
                return headings;
            },
            monthlyPlan() {
                const plans = [];
                for(let planKey in this.plans) {
                    if(this.plans[planKey].interval === 'EVERY_30_DAYS') {
                        plans.push(this.plans[planKey]);
                    }
                }
                return plans;
            },
            yearlyPlan() {
                const plans = [];
                for(let planKey in this.plans) {
                    if(this.plans[planKey].interval === 'ANNUAL') {
                        plans.push(this.plans[planKey]);
                    }
                }
                return plans;
            },
        },
        methods: {
          translateMe(message){
            return this.$translations.hasOwnProperty(message)?this.$translations[message]:message;
          },
            handleNavigationClick($event) {
                const activeSlideIds = [];
                let activeSlides = document.getElementsByClassName('VueCarousel-slide-active')
                for (let i=0, max=activeSlides.length; i < max; i++) {
                    activeSlideIds.push(parseInt(activeSlides[i].id))
                }
                let last = activeSlideIds.pop();
                let first = last - (this.perPage - 1)

                let allSlides = document.getElementsByClassName('VueCarousel-slide');
                for (let i=0, max=allSlides.length; i < max; i++) {
                    let slide = document.getElementById(allSlides[i].id);
                    slide.classList.remove('first-slide')
                    slide.classList.remove('last-slide')
                }

                let firstSlideClassName = '.slide-' + first
                let element = document.querySelector(firstSlideClassName);
                element.classList.add('first-slide')

                let lastSlideClassName = '.slide-' + last
                element = document.querySelector(lastSlideClassName);
                element.classList.add('last-slide')

                if (document.querySelector('.VueCarousel-navigation-button.VueCarousel-navigation-prev')) {
                    document.querySelector('.VueCarousel-navigation-button.VueCarousel-navigation-prev').style.left = -document.querySelector('.Polaris-ResourceList__ResourceListWrapper.features').offsetWidth + 'px';
                }
            },
            activePlanStyle(plan) {
                return [plan.shopify_plans.includes(this.shop.shopify_plan) || !plan.store_base_plan ? {backgroundColor: '#FFF', color: '#202223'} : {}];
            },
            activePlanClass(plan) {
                return plan.shopify_plans.includes(this.shop.shopify_plan) || !plan.store_base_plan ? 'active-plan' : '';
            },
            isCurrentPlanId(plan) {
                return this.shop.plan && plan.id === this.shop.plan.id;
            },
            isCurrentPlan(plan) {
                return this.has_active_charge && this.shop.plan && (plan.id === this.shop.plan.id || (!plan.is_custom && plan.base_plan === this.shop.plan.id));
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
                }
                else if(feature?.value_type === 'array') {
                  let values= JSON.parse(feature.value);
                  let that = this;
                  values = values.map(function(value){
                    return that.translateMe(that.featureValues[feature.feature_id][value]);
                  });
                  return values.join(', ');
                }
                else if(feature?.value_type === 'string') {
                    return this.translateMe(feature.value.replace('"', '').replace('"', ''));
                }
            },
            calculateDiscountedPrice(plan) {
                if (plan.discount_type === 'percentage') {
                    return plan.price - (plan.price * plan.discount)/100
                }
                else if (plan.discount_type === 'amount') {
                  if(plan.discount > plan.price){
                    return 0.00;
                  }
                    return plan.price - plan.discount
                }
            },
            calculatePromotionalDiscountedPrice(plan, promotional_discount) {
              if (promotional_discount.type === 'percentage') {
                return plan.price - (plan.price * promotional_discount.value)/100
              }
              else if (promotional_discount.type === 'amount') {
                if(promotional_discount.value > plan.price){
                  return 0.00;
                }
                return plan.price - promotional_discount.value
              }
            },
            handlePlanClicked(plan) {
                console.log(plan.id);
                // this.getPlanUrl(plan);
            },
            async getPlanUrl(plan) {
                let shopName = this.shop.name;
                let host = this.host;
                let discount_code = this.discount_code;
                let queryString = `shop=${shopName}`;
                if(host != null){
                  queryString +=`&host=${host}`
                }
              if(discount_code != null){
                queryString +=`&discount_code=${discount_code}`
              }
                const response = await axios.get(`${this.app_manager_config.baseUrl}/api/app-manager/plan/process/${plan.id}?${queryString}`).catch(error => {
                    console.error(error)
                });
                if(response.data.plan_type === 'free_plan'){
                    this.$emit('handlePlanSelect', {free_plan: true})
                }else{
                    let redirectUrl = response.data.redirect_url;
                    if (redirectUrl) {
                        window.top.location.href = redirectUrl;
                    }
                }
            },
            async activePlan() {
                const response = await this.activeWithoutPlan()
                if (response.data.status === true && this.onboard) {
                    // Create the event
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
            async selectPlan(value){
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
                        promotionalBanner.style.display = 'none';
                        bundlePlanShowcaseBanner.style.display = 'flex';
                    } else {
                        bundleElement.style.display = 'none';
                        planElement.style.display = 'flex';
                        billCycleBack.style.display = 'none';
                        billCycleSelect.style.display = 'flex';
                        promotionalBanner.style.display = 'flex';
                        bundlePlanShowcaseBanner.style.display = 'none';
                    }
                }
                this.$nextTick(() => {

                    let elements = document.querySelectorAll('.plan__price');
                    let maxHeight = 0;
                    elements.forEach((item) => {
                        if (maxHeight < item.offsetHeight) {
                            maxHeight = item.offsetHeight
                        }
                    });
                    elements.forEach((item) => {
                        item.style.minHeight = maxHeight + 'px';
                    });

                    this.slideLength = this.selectedPlan === 'monthly' ? this.monthlyPlan.length : this.yearlyPlan.length;
                    this.perPage = this.slideLength >= 4 ? 4 : this.slideLength;

                    // calculate and reset height of rows
                    this.features.forEach((feature) => {
                        let className = feature.value_type + '__type__' + feature.slug;
                        let elements = document.querySelectorAll('.' + className);
                        let maxHeight = 0;
                        elements.forEach((item) => {
                            item.style.minHeight = 'unset';
                            if (maxHeight < item.offsetHeight) {
                                maxHeight = item.offsetHeight
                            }
                        });
                        elements.forEach((item) => {
                            item.style.minHeight = maxHeight + 'px';
                        });
                    })

                    // remove first-slide and last-slide classes
                    let allSlides = document.getElementsByClassName('VueCarousel-slide');
                    for (let i=0, max=allSlides.length; i < max; i++) {
                        let slide = document.getElementById(allSlides[i].id);
                        slide.classList.remove('first-slide')
                        slide.classList.remove('last-slide')
                    }

                    // add first-slide and last-slide classes
                    let pagesCount = this.slideLength;
                    setTimeout(() => {
                        let element = document.querySelector('.slide-0');
                        if (element) {
                            element.classList.add('first-slide')
                            if (pagesCount < 4) {
                                let lastSlideClass = '.slide-' + (pagesCount-1)
                                element = document.querySelector(lastSlideClass);
                                element.classList.add('last-slide')
                            }
                            else {
                                element = document.querySelector('.slide-3');
                                element.classList.add('last-slide')
                            }
                            if (document.querySelector('.VueCarousel-navigation-button.VueCarousel-navigation-prev')) {
                                document.querySelector('.VueCarousel-navigation-button.VueCarousel-navigation-prev').style.left = -document.querySelector('.Polaris-ResourceList__ResourceListWrapper.features').offsetWidth + 'px';
                            }
                        }
                    }, 100)

                });
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
                      if(feature.value_type == 'array'){
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
                let {data} = await axios.get(`${this.app_manager_config.baseUrl}/api/app-manager/plans`, { params:  params }).catch(error => {
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
                    this.promotional_discount = (data.promotional_discount !== undefined)?data.promotional_discount:[];
                    if (data.bundle_plan) {
                        this.bundle_plan = data.bundle_plan;
                    }
                    if (data.bundle_details) {
                        this.bundle_details = data.bundle_details;
                    }
                }
            },
            headerClasses(firstColumn) {
                return {
                    'Polaris-DataTable__Cell': true,
                    'Polaris-DataTable__Cell--header': true,
                    'Polaris-DataTable__Cell--verticalAlignMiddle': true,
                    'Polaris-DataTable__Cell--firstColumn': Boolean(firstColumn),
                };
            },
            isPlanButtonColor(plan){
                if(this.has_active_charge && this.shop.plan){
                    if(plan.price > this.shop.plan.price){
                        return true;
                    }
                }
                return false;
            },
            planChooseButtonClass(plan){
                if(this.has_active_charge && this.shop.plan){
                    if(plan.price > this.shop.plan.price){
                        return '';
                    }
                }
                return 'custom-choose-button';
            },
            handlePlanBannerClose(payload) {
              this.$emit('handlePlanBannerClose', payload)
              this.$emit('handle-plan-banner-close', payload)
            },
            togglePlansFeatures() {
                this.showPlansFeatures = !this.showPlansFeatures;
            },
        },
        async mounted() {
            this.planLoading = true;
            await this.fetchFeatures();
            await this.fetchPlans();
            this.planLoading = false;

            this.$nextTick(() => {

                // calculate height of cell
                setTimeout(() => {

                    let elements = document.querySelectorAll('.plan__price');
                    let maxHeight = 0;
                    elements.forEach((item) => {
                        item.style.minHeight = 'unset';
                        if (maxHeight < item.offsetHeight) {
                            maxHeight = item.offsetHeight
                        }
                    });
                    elements.forEach((item) => {
                        item.style.minHeight = maxHeight + 'px';
                    });

                    this.features.forEach((feature) => {
                        let className = feature.value_type + '__type__' + feature.slug;
                        elements = document.querySelectorAll('.' + className);
                        maxHeight = 0;
                        elements.forEach((item) => {
                            if (maxHeight < item.offsetHeight) {
                                maxHeight = item.offsetHeight
                            }
                        });
                        elements.forEach((item) => {
                            item.style.minHeight = maxHeight + 'px';
                        });
                    })
                }, 100);

                // remove fist-slide and last-slide classes from all slides
                let allSlides = document.getElementsByClassName('VueCarousel-slide');
                for (let i=0, max=allSlides.length; i < max; i++) {
                    let slide = document.getElementById(allSlides[i].id);
                    slide.classList.remove('first-slide')
                    slide.classList.remove('last-slide')
                }

                // add first-slide and last-slide
                this.slideLength = this.selectedPlan === 'monthly' ? this.monthlyPlan.length : this.yearlyPlan.length;
                this.perPage = this.slideLength >= 4 ? 4 : this.slideLength;

                let pagesCount = this.slideLength;
                setTimeout(() => {
                    let element = document.querySelector('.slide-0');
                    if (element) {
                        element.classList.add('first-slide')
                        if (pagesCount < 4) {
                            let lastSlideClass = '.slide-' + (pagesCount-1)
                            element = document.querySelector(lastSlideClass);
                            element.classList.add('last-slide')
                        }
                        else {
                            element = document.querySelector('.slide-3');
                            element.classList.add('last-slide')
                        }
                        if (document.querySelector('.VueCarousel-navigation-button.VueCarousel-navigation-prev')) {
                            document.querySelector('.VueCarousel-navigation-button.VueCarousel-navigation-prev').style.left = -document.querySelector('.Polaris-ResourceList__ResourceListWrapper.features').offsetWidth + 'px';
                        }
                    }
                }, 100)

              this.selectPlan(this.selectedPlan);

            });
        },
    }
</script>

<style lang="scss">

    @import url('https://fonts.googleapis.com/css2?family=Satisfy&display=swap');

    .app-manager .app-manager-plan-page-slider ul
    {
        list-style: none;
        margin: 0;
        padding: 0;
    }
    .app-manager .app-manager-plan-page-slider .Polaris-ResourceList__ResourceListWrapper.features li,
    .app-manager .app-manager-plan-page-slider .Polaris-Layout__Section .VueCarousel-slide li,
    .app-manager .app-manager-plan-page-slider .plan__price
    {
        padding: 16px 16px 16px 20px;
    }
    .app-manager .app-manager-plan-page-slider .Polaris-ResourceList__ResourceListWrapper.features li,
    .app-manager .app-manager-plan-page-slider .Polaris-Layout__Section .VueCarousel-slide li:not(:last-child),
    .app-manager .app-manager-plan-page-slider .Polaris-Layout.custom-plan .VueCarousel .plan__price
    {
        border-top: 1px solid #dddddd;
        border-right: 1px solid #dddddd;
        background: #fff;
    }
    .app-manager .app-manager-plan-page-slider .Polaris-ResourceList__ResourceListWrapper.features li{
        border-right: none;
        border-left: 1px solid #dddddd;
    }
    /*.app-manager .app-manager-plan-page-slider .plan__price{
        min-height:121px;
    }*/
    .app-manager .app-manager-plan-page-slider .Polaris-ResourceList__ResourceListWrapper.features li:last-child,
    .app-manager .app-manager-plan-page-slider .Polaris-Layout__Section .VueCarousel-slide li:nth-last-child(2)
    {
        border-bottom: 1px solid #dddddd;
    }
    .app-manager .app-manager-plan-page-slider .Polaris-ResourceList__ResourceListWrapper.features li:first-child
    {
        border-top-left-radius: 12px;
    }
    .app-manager .app-manager-plan-page-slider .Polaris-ResourceList__ResourceListWrapper.features li:last-child
    {
        border-bottom-left-radius: 12px;
    }
    .app-manager .app-manager-plan-page-slider .VueCarousel-inner .VueCarousel-slide.first-slide ul li:not(:last-child)
    {
        border-left: 1px solid #dddddd;
    }
    .app-manager .app-manager-plan-page-slider .VueCarousel-inner .VueCarousel-slide.first-slide .plan__price
    {
        border-left: 1px solid #dddddd;
        box-shadow: none;
        border-top-left-radius: 12px;
        overflow: hidden;
    }
    .app-manager .app-manager-plan-page-slider .VueCarousel-inner .VueCarousel-slide.last-slide ul li:nth-last-child(2)
    {
        border-bottom-right-radius: 12px;
    }
    .app-manager .app-manager-plan-page-slider .VueCarousel-inner .VueCarousel-slide.first-slide ul li:nth-last-child(2)
    {
      border-bottom-left-radius: 12px;
    }
    .app-manager .app-manager-plan-page-slider .VueCarousel-inner .VueCarousel-slide.last-slide .plan__price
    {
        border-right: 1px solid #dddddd;
        box-shadow: none;
        border-top-right-radius: 12px;
        overflow: hidden;
    }
    .app-manager .app-manager-plan-page-slider .VueCarousel-inner .VueCarousel-slide.last-slide
    {
        border-top-right-radius: 12px;
    }
    .app-manager .app-manager-plan-page-slider .VueCarousel-inner .VueCarousel-slide.first-slide
    {
        border-top-left-radius: 12px;
    }
    .app-manager .app-manager-plan-page-slider .VueCarousel .VueCarousel-inner li
    {
        text-align: center;
    }
    .app-manager .app-manager-plan-page-slider .VueCarousel-navigation-button
    {
        color: #257f60;
    }
    .app-manager .app-manager-plan-page-slider .btn-group .Polaris-ButtonGroup__Item
    {
        margin-left: 0px !important;
        z-index: unset !important;
    }
    .app-manager .Polaris-Button::after {
        box-shadow: none !important;
    }
    .app-manager .Polaris-Button:focus {
        box-shadow: none !important;
        border-color: black !important;
    }
    .app-manager .app-manager-plan-page-slider .feature__list,
    .app-manager .app-manager-plan-page-slider .feature__type__array
    {
        display: flex;
        align-items: center;
        word-spacing: 999px;
        justify-content: center;
    }
    .app-manager .app-manager-plan-page-slider .feature__type__array.feature__class
    {
        justify-content: left;
    }

    .app-manager .app-manager-plan-page-slider .plan-heading b{
        overflow-wrap: break-word;
        word-wrap: break-word;
        white-space: initial;
    }

    // .app-manager .app-manager-plan-page-slider .custom-choose-button:hover{
    //     background: #006e52;
    //     border-color: transparent;
    //     color: #fff;
    // }

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
        background-image: url('../../assets/25for70lessBanner.png');
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
        gap: 20px;
    }

    .toggle-plans-features {
        font-size: 13px;
        font-weight: 500;
        color: #303030;
        text-decoration: none;
        margin-left: 20px;
    }

    .customization-bundle-section {
        display: flex;
        width: 100%;
    }

    @media (min-width: 0px) and (max-width: 576px) {
      .custom-plan>.Polaris-Layout__Section>.VueCarousel>.VueCarousel-wrapper>.VueCarousel-inner {
        overflow-x: scroll;
      }
    }

    @media (max-width: 700px) {
      .Polaris-ButtonGroup__Item {
        width: auto !important;
      }
      .app-manager .Polaris-Button {
        padding: 7px 8px !important;
      }
    }

    @media (min-width: 0px) and (max-width: 467px) {

      .app-manager .Polaris-Page-Header__RightAlign {
        margin-left: -34px !important;
      }
      #app_manager > div > div.Polaris-Page-Header.Polaris-Page-Header--hasNavigation.Polaris-Page-Header--mediumTitle.Polaris-Page-Header--mobileView > div > div.Polaris-Page-Header__RightAlign > div > div > div > div > div > div:nth-child(2) > button > span > span > div > div > div > span > span > div{
        width: 222px !important;
      }
      .app-manager .app-manager-plan-page-slider .Polaris-Layout__Section .VueCarousel-slide li:nth-last-child(2) {
        min-height: 100px !important;
      }
      .app-manager .app-manager-plan-page-slider .Polaris-ResourceList__ResourceListWrapper.features li{
        padding: 16px 16px 16px 5px;
      }
      .app-manager .Polaris-Button {
        padding: 7px 8px !important;
      }
      .VueCarousel-slide {
        flex-basis: auto !important;
      }
      .Polaris-ResourceList__ResourceListWrapper.features{
        width: 30% !important;
      }
    }

    @media (min-width: 467px) and (max-width: 1003px) {
      #app_manager > div > div.Polaris-Page-Header.Polaris-Page-Header--hasNavigation.Polaris-Page-Header--mediumTitle.Polaris-Page-Header--mobileView > div > div.Polaris-Page-Header__RightAlign > div > div > div > div > div > div:nth-child(2) > button > span > span > div > div > div > span > span > div{
        width: 222px !important;
      }
      .app-manager .app-manager-plan-page-slider .Polaris-Layout__Section .VueCarousel-slide li:nth-last-child(2) {
        min-height: 100px !important;
      }
      .app-manager .Polaris-Button {
        padding: 7px 8px !important;
      }
    }

    @media (max-width: 767px) {
        .bill-cycle-select-group {
            flex-direction: column-reverse;
            gap: 10px;
        }
    }

    @media (max-width: 1023px) {
        .customization-bundle-section {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
    }
</style>
