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
     />

    <div v-else-if="!this.planLoading && this.plans.length > 0"> <PlanBanners position="header" @handlePlanBannerClose="handlePlanBannerClose" />

    <PPage
           class="app-manager-plan-page custom-title"
           :title="selectedPlan === 'bundle' ? '' : translateMe('Plans')"
           :subtitle = "subtitleContent"
    >

        <PStack slot="primaryAction">
            <PStackItem style="margin-top: 20px">
                <!-- <PButtonGroup class="btn-group" segmented> -->
                    <!-- <PButton v-if="monthlyPlan.length && yearlyPlan.length" :class="selectedPlan === 'monthly' ? 'plan-active-tab' : '' " :style="selectedPlan === 'monthly' ? monthlySelectedStyle : monthlyStyle "  @click="selectPlan('monthly')">
                        <p style="font-size: 17px; font-weight: 500" slot="default">{{translateMe('Monthly')}}</p>
                    </PButton>

                    <PButton v-if="yearlyPlan.length && monthlyPlan.length" :class="selectedPlan === 'annually'? 'plan-active-tab' : '' " :style="selectedPlan === 'annually' ? yearlySelectedStyle : yearlyStyle " @click="selectPlan('annually')" :primary="selectedPlan === 'annually' " >
                        <YearlyPlanPromotion />
                    </PButton> -->
                <div class="button-group-new">    
                    <VariantButton id="pricing-tab" :variant="selectedPlan === 'monthly' ? 'primary' : 'secondary'" @click="selectPlan('monthly')" :additionalText="'1 App'">
                        {{ translateMe('Monthly') }}
                    </VariantButton>
                    <VariantButton id="pricing-tab" v-if="valid_annual_plans.length > 0" :variant="selectedPlan === 'annually' ? 'primary' : 'secondary'" @click="selectPlan('annually')">
                        {{ translateMe('Annually') }}
                    </VariantButton>
                    <VariantButton id="pricing-tab" v-if="bundle_plan !== null" :variant="selectedPlan === 'bundle' ? 'primary' : 'secondary'" @click="selectPlan('bundle')" :additionalText="'25 Apps'">
                        {{ translateMe('Bundle') }}
                    </VariantButton>
                </div>
                <!-- </PButtonGroup> -->
            </PStackItem>
        </PStack>
        <!-- <hr style="width: 100%; margin-right: auto;margin-left: auto;margin-bottom: 20px;" /> -->
        <div class="light-divider" style="margin: 20px 0;"></div>
        <!--=======================================================-->
        <PLayout class="custom-plan">
            <PLayoutSection>
                <template style="margin-bottom: 20px;">
                    <template>
                        <PDataTable class="plan-table">
                            <template slot="head">
                                <PDataTableRow v-if="selectedPlan === 'monthly'" style="box-shadow: none!important;">
                                    <PDataTableCol style="opacity: 0;visibility: hidden;border: 0 !important;" class="plan-heading">
                                        <b>{{translateMe('features')}}</b>
                                    </PDataTableCol>
                                    <template v-for="(plan, key) in monthlyPlan" >
                                        <PDataTableCol :class="{'first-column': key === 0, 'plan-heading': true, 'last-column': (key+1) === monthlyPlan.length}" :style="activePlanStyle(plan)">
                                            <b v-if="plan.name !== 'Free'" style="font-size: 16px">{{translateMe(plan.name)}}</b>
                                            <div v-if="plan.price === 0">
                                                <p style="display: flex;margin-top: 10px">
                                                    <PHeading style="font-size: 25px;font-weight: 700;">{{ translateMe('Free') }}</PHeading>
                                                </p>
                                            </div>
                                            <div v-else-if="plan.discount && plan.discount > 0 && !isCurrentPlan(plan)" >
                                                <p style="display: flex;margin-top: 10px">
                                                    <PHeading style="font-size: 25px;font-weight: 700;">${{parseFloat(calculateDiscountedPrice(plan)).toFixed(2)}}</PHeading>
                                                    <b style="margin-top: 5px;font-size: 17px">/{{translateMe("mo")}}</b>
                                                </p>
                                                <p style="display: flex;margin-top: 7px">
                                                    <PHeading style="font-size: 18px;font-weight: 500; text-decoration:line-through;">${{parseFloat(plan.price).toFixed(2)}}</PHeading>
                                                    <b style="margin-top: 3px;font-size: 14px">/{{translateMe("mo")}}</b>
                                                </p>
                                            </div>
                                            <div v-else-if="promotional_discount && promotional_discount.length !== 0 && !promotional_discount.errors && !plan.is_global && promotional_discount.plan_relation.length > 0 && promotional_discount.plan_relation.includes(plan.id)  && !isCurrentPlan(plan)" >
                                              <p style="display: flex;margin-top: 10px">
                                                <PHeading style="font-size: 25px;font-weight: 700;">${{parseFloat(calculatePromotionalDiscountedPrice(plan, promotional_discount)).toFixed(2)}}</PHeading>
                                                <b style="margin-top: 5px;font-size: 17px">/{{translateMe("mo")}}</b>
                                              </p>
                                              <p style="display: flex;margin-top: 7px">
                                                <PHeading style="font-size: 18px;font-weight: 500; text-decoration:line-through;">${{parseFloat(plan.price).toFixed(2)}}</PHeading>
                                                <b style="margin-top: 3px;font-size: 14px">/{{translateMe("mo")}}</b>
                                              </p>
                                            </div>
                                            <div v-else-if="promotional_discount && promotional_discount.length !== 0 && !promotional_discount.errors && !plan.is_global && promotional_discount.plan_relation.length === 0 && promotional_discount.value > 0 && !isCurrentPlan(plan)" >
                                              <p style="display: flex;margin-top: 10px">
                                                <PHeading style="font-size: 25px;font-weight: 700;">${{parseFloat(calculatePromotionalDiscountedPrice(plan, promotional_discount)).toFixed(2)}}</PHeading>
                                                <b style="margin-top: 5px;font-size: 17px">/{{translateMe("mo")}}</b>
                                              </p>
                                              <p style="display: flex;margin-top: 7px">
                                                <PHeading style="font-size: 18px;font-weight: 500; text-decoration:line-through;">${{parseFloat(plan.price).toFixed(2)}}</PHeading>
                                                <b style="margin-top: 3px;font-size: 14px">/{{translateMe("mo")}}</b>
                                              </p>
                                            </div>
                                            <div v-else>
                                                <p style="display: flex;margin-top: 10px">
                                                    <PHeading style="font-size: 25px;font-weight: 700;">${{parseFloat(plan.price).toFixed(2)}}</PHeading>
                                                    <b style="margin-top: 5px;font-size: 17px">/{{translateMe("mo")}}</b>
                                                </p>
                                            </div>
                                        </PDataTableCol>
                                    </template>
                                </PDataTableRow>
                                <PDataTableRow v-else>
                                    <PDataTableCol style="opacity: 0;visibility: hidden; border: 0 !important;" class="plan-heading">
                                        <b>{{translateMe('features')}}</b>
                                    </PDataTableCol>
                                    <template v-for="(plan,key) in yearlyPlan">
                                        <PDataTableCol :class="{'first-column': key === 0, 'plan-heading': true, 'last-column': (key+1) === yearlyPlan.length}" :style="activePlanStyle(plan)">
                                            <b v-if="plan.name !== 'Free'"  style="font-size: 16px">{{translateMe(plan.name)}}</b>
                                            <div v-if="plan.price === 0">
                                                <p style="display: flex;margin-top: 10px">
                                                    <PHeading style="font-size: 25px;font-weight: 700;">{{ translateMe('Free') }}</PHeading>
                                                </p>
                                            </div>
                                            <div v-else-if="plan.discount && plan.discount > 0 && !isCurrentPlan(plan)" >
                                                <p style="display: flex;margin-top: 10px">
                                                    <PHeading style="font-size: 25px;font-weight: 700;">${{parseFloat(calculateDiscountedPrice(plan)).toFixed(2)}}</PHeading>
                                                    <b style="margin-top: 5px;font-size: 17px">/{{translateMe("year")}}</b>
                                                </p>
                                                <p style="display: flex;margin-top: 7px">
                                                    <PHeading style="font-size: 18px;font-weight: 500; text-decoration:line-through;">${{parseFloat(plan.price).toFixed(2)}}</PHeading>
                                                    <b style="margin-top: 3px;font-size: 14px">/{{translateMe("year")}}</b>
                                                </p>
                                            </div>
                                          <div v-else-if="promotional_discount && promotional_discount.length !== 0 && !promotional_discount.errors && promotional_discount.plan_relation.length > 0 && promotional_discount.plan_relation.includes(plan.id)  && !isCurrentPlan(plan)">
                                            <p style="display: flex;margin-top: 10px">
                                              <PHeading style="font-size: 25px;font-weight: 700;">${{parseFloat(calculatePromotionalDiscountedPrice(plan, promotional_discount)).toFixed(2)}}</PHeading>
                                              <b style="margin-top: 5px;font-size: 17px">/{{translateMe("year")}}</b>
                                            </p>
                                            <p style="display: flex;margin-top: 7px">
                                              <PHeading style="font-size: 18px;font-weight: 500; text-decoration:line-through;">${{parseFloat(plan.price).toFixed(2)}}</PHeading>
                                              <b style="margin-top: 3px;font-size: 14px">/{{translateMe("year")}}</b>
                                            </p>
                                          </div>
                                          <div v-else-if="promotional_discount && promotional_discount.length !== 0 && !promotional_discount.errors && promotional_discount.plan_relation.length === 0 && promotional_discount.value > 0 && !isCurrentPlan(plan)"  >
                                            <p style="display: flex;margin-top: 10px">
                                              <PHeading style="font-size: 25px;font-weight: 700;">${{parseFloat(calculatePromotionalDiscountedPrice(plan, promotional_discount)).toFixed(2)}}</PHeading>
                                              <b style="margin-top: 5px;font-size: 17px">/{{translateMe("year")}}</b>
                                            </p>
                                            <p style="display: flex;margin-top: 7px">
                                              <PHeading style="font-size: 18px;font-weight: 500; text-decoration:line-through;">${{parseFloat(plan.price).toFixed(2)}}</PHeading>
                                              <b style="margin-top: 3px;font-size: 14px">/{{translateMe("year")}}</b>
                                            </p>
                                          </div>
                                          <div v-else>
                                            <p style="display: flex;margin-top: 10px">
                                              <PHeading style="font-size: 25px;font-weight: 700;">${{parseFloat(plan.price).toFixed(2)}}</PHeading>
                                              <b style="margin-top: 5px;font-size: 17px">/{{translateMe("year")}}</b>
                                            </p>
                                          </div>
                                        </PDataTableCol>
                                    </template>
                                </PDataTableRow>
                            </template>
                            <template slot="body">
                                <template v-for="(featureGroup, groupKey) in featuresByGroup">
                                    <PDataTableRow v-if="groupKey !== 'null'" class="app-manager-group-row">
                                        <PDataTableCol :colspan="selectedPlan === 'monthly' ? monthlyPlan.length + 1 : yearlyPlan.length + 1" class="app-manager-group-cell">{{ translateMe(groupKey) }}</PDataTableCol>
                                    </PDataTableRow>
                                    <PDataTableRow v-for="(feature, rIndex) in featureGroup" :key="`row-${rIndex + groupKey}`">
                                        <PDataTableCol :class="`feature__type__${feature.value_type} feature__class`">{{ translateMe(feature.name) }}</PDataTableCol>
                                        <PDataTableCol :class="`feature__type__${feature.value_type}`" v-for="(plan, cIndex) in selectedPlan === 'monthly' ? monthlyPlan : yearlyPlan" :key="`cell-${cIndex}-row-${rIndex}`" :style="activePlanStyle(plan)">
                                            <template v-if="plan.features">
                                                <template v-if="feature.value_type === 'boolean'">
                                                    <PIcon v-if="plan.features[feature.uuid]" color="success"
                                                           source="TickMinor"/>
                                                    <PIcon v-else color="subdued" source="MinusMinor"/>
                                                </template>
                                                <template v-else>
                                                    <span v-if="plan.features[feature.uuid]">{{ translateMe(format(plan.features[feature.uuid])) }}</span>
                                                    <PIcon v-else color="subdued" source="MinusMinor"/>
                                                </template>
                                            </template>
                                            <template v-else>
                                                <PIcon color="subdued" source="MinusMinor"/>
                                            </template>
                                        </PDataTableCol>
                                    </PDataTableRow>
                                </template>
                                <PDataTableRow v-if="plans.length" class="row-alignment"  >
                                    <PDataTableCol></PDataTableCol>
                                    <PDataTableCol v-for="(plan, cIndex) in selectedPlan === 'monthly' ? monthlyPlan : yearlyPlan" :key="`cell-${cIndex}-row-plan`" style="max-width: 0" >
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
                                        <PTextContainer v-if="plan.store_base_plan && shop.plan && plan.shopify_plans.includes(shop.shopify_plan) && !isCurrentPlan(plan)" class="footer-note-container">
                                            <PTextStyle class="text-break" v-if="plan.store_base_plan && !plan.shopify_plans.includes(shop.shopify_plan) && !(isCurrentPlan(plan)) && !isSamePlanInOtherInterval(plan)">{{ translateMe('Note: On account of your recent Shopify plan upgrade, you should consider upgrading your current app plan')}}</PTextStyle>
                                        </PTextContainer>
                                    </PDataTableCol>
                                </PDataTableRow>
                            </template>
                        </PDataTable>
                    </template>
                </template>
                <PStack v-if="onboard" class="choose-plan-btn" alignment="center" distribution="center" vertical>
                    <PStackItem fill>
                        <PButton plain @click="activePlan">{{ translateMe('I will choose the plan later') }}</PButton>
                    </PStackItem>
                </PStack>
              <PlanBanners position="footer" @handlePlanBannerClose="handlePlanBannerClose" />
            </PLayoutSection>
        </PLayout>
        <div v-if="bundle_plan !== null" class="bundle-plan">
            <PlanShowcaseBanner useCardStyle="true" :showcaseData="bundle_plan" :realPrice="parseFloat(calculateDiscountedPrice(bundle_plan)).toFixed(0)" :oldPrice="bundle_plan.price" @plan-clicked="handlePlanClicked(bundle_plan)" :isCurrentPlan="isCurrentPlanId(bundle_plan)"/>
            <div class="light-divider"></div>
            <div class="bundle-category" v-for="category in bundle_details">
                <CategoryHeading :headingData="category" />
                <div class="bundle-category-apps">
                    <AppCard v-for="app in category.apps_relation" :appData="app" />
                </div>
            </div>
            <CategoryHeading :headingData="additionalBenefitsHeading" />
            <BenefitsBanner />
            <PlanShowcaseBanner style="margin-top: 20px;" :showcaseData="bundle_plan" :realPrice="parseFloat(calculateDiscountedPrice(bundle_plan)).toFixed(0)" :oldPrice="bundle_plan.price" :showDescription="false" :isCurrentPlan="isCurrentPlanId(bundle_plan)" @plan-clicked="handlePlanClicked(bundle_plan)"/>
        </div>
        <!--====================================================================-->
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
    import {PCard} from "../polaris-vue/src/components/PCard"
    import {PCardSection} from "../polaris-vue/src/components/PCard/components/PCardSection"
    import {PSkeletonPage} from "../polaris-vue/src/components/PSkeletonPage"
    import {PSkeletonDisplayText} from "../polaris-vue/src/components/PSkeletonDisplayText"
    import {PSkeletonBodyText} from "../polaris-vue/src/components/PSkeletonBodyText"
    import {PTextStyle} from "../polaris-vue/src/components/PTextStyle";
    import {PEmptyState} from "../polaris-vue/src/components/PEmptyState";
    import AppCard from "../PolarisNew/AppCard";
    import PlanShowcaseBanner from "../PolarisNew/PlanShowcaseBanner";
    import CategoryHeading from "../PolarisNew/CategoryHeading";
    import BenefitsBanner from "../PolarisNew/BenefitsBanner";
    import VariantButton from "../PolarisNew/VariantButton";

    export default {
        name: "AppManagerGroupPlan",
        components: { YearlyPlanPromotion, PlanBanners, PPage, PStack, PStackItem, PButton, PButtonGroup, PHeading, PLayout, PLayoutSection, PTextContainer, PDataTable, PDataTableCol, PDataTableRow, PIcon, PTextStyle, PCard, PCardSection, PSkeletonPage, PSkeletonBodyText, PSkeletonDisplayText, PEmptyState, AppCard, PlanShowcaseBanner, CategoryHeading, BenefitsBanner, VariantButton },
        props: ['shop_domain','host', 'discount_code'],
        data() {
            return {
                plan: {},
                plans: [],
                valid_annual_plans: [],
                promotional_discount: [],
                features: [],
                featureValues: [],
                featuresByGroup: [],
                shopify_plan: '',
                default_plan_id: null,
                onboard: true,
                choose_later: false,
                has_active_charge: false,
                global_plan_charge: false,
                planLoading: false,
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
                "bundle_plan": null
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
                    if (plan.price > 0) heading += ` ($${plan.price}/` + this.translateMe('mo') + ')';
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
            translateMe(message) {
              return this.$translations.hasOwnProperty(message) ? this.$translations[message] : message;
            },
            activePlanStyle(plan) {
                return [plan.shopify_plans.includes(this.shop.shopify_plan) || !plan.store_base_plan ? {backgroundColor: '#FFF', color: '#202223'} : {}];
            },
            isCurrentPlan(plan) {
                return this.has_active_charge && this.shop.plan && (plan.id === this.shop.plan.id || (!plan.is_custom && plan.base_plan === this.shop.plan.id));
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
                    } else return feature.value
                }
                else if(feature?.value_type === 'array') {
                  let values= JSON.parse(feature.value);
                  let that = this;
                  values = values.map(function(value){
                    return that.translateMe(that.featureValues[feature.feature_id][value]);
                  });
                  return values.join(', ')
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
            headerClasses(firstColumn) {
                return {
                    'Polaris-DataTable__Cell': true,
                    'Polaris-DataTable__Cell--header': true,
                    'Polaris-DataTable__Cell--verticalAlignMiddle': true,
                    'Polaris-DataTable__Cell--firstColumn': Boolean(firstColumn),
                };
            },
            groupBy(objectArray, property) {
                return objectArray.reduce((acc, obj) => {
                    const key = obj[property];
                    if (!acc[key]) {
                        acc[key] = [];
                    }
                    acc[key].push(obj);
                    return acc;
                }, {});
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
                this.selectedPlan= value;
                if (this.bundle_plan !== null) {
                    let planElement = document.querySelector('.custom-plan');
                    let bundleElement = document.querySelector('.bundle-plan');
                    if (this.selectedPlan == 'bundle') {
                        planElement.style.display = 'none';
                        bundleElement.style.display = 'flex';
                    } else {
                        bundleElement.style.display = 'none';
                        planElement.style.display = 'flex';
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
                    this.features = this.features?.sort((featureA, featureB) => parseInt(featureA.display_order) - parseInt(featureB.display_order))
                    this.features = this.features?.sort((featureA, featureB) => parseInt(featureA.group_order) - parseInt(featureB.group_order))
                    this.featuresByGroup = this.groupBy(this.features, 'group')

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
                let {data} = await axios.get(`${this.app_manager_config.baseUrl}/api/app-manager/plans`, { params: params }).catch(error => {
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
            /*cellColor(plan) {
                let greenCell = { backgroundColor: 'rgb(240, 248, 245)',color: 'rgb(37, 127, 96)'};
                let disableCell = { backgroundColor: '#fafbfb',color: 'rgb(37, 127, 96)'};
                if(this.has_active_charge && this.shop.plan){
                    if((plan.id === this.shop.plan.id || (!plan.is_custom && plan.base_plan === this.shop.plan.id))){
                       return disableCell;
                    }else if(plan.price > this.shop.plan.price){
                        return greenCell;
                    }
                }
                return;
            },*/
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
            handlePlanClicked(plan) {
                this.getPlanUrl(plan);
            }
        },
        async mounted() {
            this.planLoading = true;
            await this.fetchFeatures();
            await this.fetchPlans();
            this.planLoading = false;

          this.$nextTick(() => {
            this.selectPlan(this.selectedPlan);

          });

        }
    }
</script>

<style lang="scss">

    @import url('https://fonts.googleapis.com/css2?family=Satisfy&display=swap');

    .app-manager .app-manager-plan-page .plan-table  td:last-child>*[data-v-7d902277],
    .app-manager .app-manager-plan-page .plan-table  td:last-child>*[data-v-5a078dbb] {
        float:none;
    }
    .app-manager .app-manager-plan-page .active {
        background: #f0f8f5;
    }
    .app-manager .app-manager-plan-page .plan-table  td:last-child>*[data-v-0d1b0d63] {
        float:none;
    }
    .app-manager .app-manager-plan-page .plan-table td {
        border: 0.01px solid #ececee !important;
        border-collapse: collapse !important;
    }
    .app-manager .app-manager-plan-page .plan-table .Polaris-DataTable__ScrollContainer{
        border-radius:12px;
        overflow: visible;
    }
    .app-manager .app-manager-plan-page .plan-table table {
        border-collapse: collapse !important;
    }
    .app-manager .app-manager-plan-page .custom-plan table {
        border-collapse: collapse !important;
    }
    .app-manager .app-manager-plan-page .custom-plan table thead .first-column {
        border-radius: 12px 0 0 0;
        border-top: 0px !important;
        border-left: 0px !important;
    }
    .app-manager .app-manager-plan-page .custom-plan table thead .plan-heading.last-column {
        text-align: left !important;
        border-radius: 0 12px 0 0;
        border-top: 0px !important;
    }
    .app-manager .app-manager-plan-page .custom-plan table thead .plan-heading {
        background-color: rgb(255, 255, 255);
        box-shadow: rgb(23 24 24 / 5%) 1px 0px 8px, rgb(0 0 0 / 15%) 0px 0px 2px;
    }
    .app-manager .app-manager-plan-page .custom-plan table tbody tr:first-child {
        background-color: #fff;
        box-shadow: 0 0 5px rgb(23 24 24 / 5%), 0 1px 2px rgb(0 0 0 / 15%);
        border-radius: 12px 0 0 0;
        overflow: hidden;
    }
    .app-manager .app-manager-plan-page .custom-plan table tbody tr:not(:first-child :last-child ) {
        background-color: #fff;
        overflow: hidden;
    }
    .app-manager .app-manager-plan-page .custom-plan table tbody tr:not(:first-child :last-child) {
        background-color: #fff;
        box-shadow: 0 0 5px rgb(23 24 24 / 5%), 0 1px 2px rgb(0 0 0 / 15%);
        overflow: hidden;
    }
    .app-manager .app-manager-plan-page .custom-plan table tbody tr:not( :nth-last-child(2) ) {
        background-color: #fff;
        overflow: hidden;
    }
    .app-manager .app-manager-plan-page .custom-plan table tbody tr:not( :nth-last-child(2) ) {
        border-bottom: 0;
    }
    .app-manager .app-manager-plan-page .custom-plan table tbody tr:last-child {
        border-bottom: 0;
        background-color: transparent !important;
        box-shadow: none !important;
    }
    .app-manager .app-manager-plan-page .custom-plan table tbody tr:not(:last-child) {
        pointer-events: none;
    }
    .app-manager .app-manager-plan-page .custom-plan table thead tr td{
        pointer-events: none;
    }
    .app-manager .app-manager-plan-page .custom-plan table tbody tr:first-child td:first-child {
        overflow: hidden;
        border-radius: 12px 0 0 0;
    }
    .app-manager .app-manager-plan-page .custom-plan table tbody tr:nth-last-child(2) {
        overflow: hidden;
        border-bottom-right-radius: 0;
        border-bottom-left-radius: 12px;
    }
    .app-manager .app-manager-plan-page .custom-plan table tbody tr:nth-last-child(2) td:first-child {
        overflow: hidden;
        border-bottom: 0px !important;
        border-radius: 0 0 0 12px;
    }
    .app-manager .app-manager-plan-page .custom-plan table tbody tr:nth-last-child(2) td:last-child {
        overflow: hidden;
        border-radius: 0 0 0;
    }
    .app-manager .app-manager-plan-page .custom-plan table tbody tr td:first-child {
        border-left: 0px !important;
        border-top: 0px !important;
        padding-left: 20px;
    }
    .app-manager .app-manager-plan-page .custom-plan table tbody tr td:last-child {
        text-align: center !important;
    }
    .app-manager .app-manager-plan-page .custom-plan table thead tr td:last-child {

        text-align: center !important;
    }
    .app-manager .app-manager-plan-page .custom-plan table tbody td:not(:first-child) {
        text-align: center !important;
    }
    .app-manager .app-manager-plan-page .custom-plan table tbody tr:last-child td:last-child {
        background: transparent;
        border-radius: 0 0 12px 0;
    }
    .app-manager .app-manager-plan-page .custom-plan table tbody tr:last-child td:nth-child(2){
      border-radius: 0 0 0 12px !important;
    }
    .app-manager .app-manager-plan-page .custom-plan table tbody tr:last-child td {
        background: transparent;
    }
    .app-manager .app-manager-plan-page .custom-plan table tbody tr:last-child td:hover {
        border: 0 !important;
        background: transparent;
    }
    .app-manager .app-manager-plan-page .custom-plan tbody tr:last-child td.Polaris-DataTable__Cell--verticalAlignTop{
        background: transparent !important;
    }
    .app-manager .app-manager-plan-page .custom-plan table tbody tr:last-child {
        background: #fff!important;
        opacity:1.0;
    }
    .app-manager .app-manager-plan-page .custom-plan table tbody tr:last-child  td:first-child{
        visibility: hidden;
        border-bottom: none!important;
    }
    .app-manager .app-manager-plan-page .plan-heading {
        padding-top: 30px;
    }
    .app-manager .app-manager-plan-page .custom-plan .Polaris-Layout__Section{
        max-width: calc(100% - 2rem) !important;
    }
    .app-manager .app-manager-plan-page .later-link {
        text-align: center;
        clear: both;
        padding-top: 15px;
    }
    .app-manager .app-manager-plan-page .plan-badge ul {
        text-align: center;
        padding-top: 2rem;
        border-top: 0.1rem solid #e1e3e5;
    }
    .app-manager .app-manager-plan-page .plan-badge ul li {
        list-style: none;
        display: inline-block;
        padding-right: 25px;
    }
    .app-manager .app-manager-plan-page .plan-badge ul li img {
        max-width: 133px;
    }
    .app-manager .app-manager-plan-page .btn-group .Polaris-ButtonGroup__Item{
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
    .app-manager .app-manager-plan-page.custom-title .Polaris-HorizontalDivider{
        background-color: #e2e3e4;
    }
    /*.app-manager .app-manager-plan-page .annual_heading{
        margin-top: 2px !important;
        color: #E2C138;
        border: 2px dotted #E2C138;
        padding: 5px;
        font-size: 16px !important;
        font-weight: normal !important;
        font-family: 'Satisfy', cursive;
    }*/
    .app-manager .app-manager-plan-page .Polaris-Page__Content hr{
        border: 1px solid #e2e3e4;
    }

    .app-manager .app-manager-plan-page .app-manager-group-row {
        background: transparent !important;
        padding: 16px 16px 16px 20px !important;
    }

    .app-manager .app-manager-plan-page .feature__type__array {
        vertical-align: middle !important;
        word-spacing: 999px;
        white-space: pre-line !important;
    }

    .app-manager .app-manager-plan-page .Polaris-DataTable__Table {
        table-layout: fixed !important;
    }

    .app-manager .app-manager-plan-page td {
        vertical-align: middle !important;
    }

    .app-manager .app-manager-plan-page td.feature__class {
        word-wrap:break-word !important;
        white-space: normal !important;
    }
    .app-manager .app-manager-plan-page .light-green-cell{
        background-color: rgb(240, 248, 245);
        color: rgb(37, 127, 96);
    }

    .app-manager .app-manager-plan-page .plan-heading b{
        overflow-wrap: break-word;
        word-wrap: break-word;
        white-space: initial;
    }

    .app-manager .app-manager-plan-page .custom-choose-button:hover{
        // background: #006e52;
        // border-color: transparent;
        // color: #fff;
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

    @media (min-width: 0px) and (max-width: 576px) {
      .app-manager .app-manager, .app-manager .app-manager-body {
        overflow-x: scroll;
      }
    }

    @media (max-width: 700px) {
      .app-manager .Polaris-DataTable__Table{
        width: auto !important;
      }
    }



</style>
