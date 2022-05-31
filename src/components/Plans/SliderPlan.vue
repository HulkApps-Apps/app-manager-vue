<template>
    <PPage
            class="app-manager-plan-page custom-title"
            title="Choose plan"
            :subtitle = "subtitleContent"
    >

        <PStack slot="primaryAction">
            <PStackItem style="margin-top: 20px">
                <PButtonGroup class="btn-group" segmented>
                    <PButton v-if="monthlyPlan.length && yearlyPlan.length" :style="selectedPlan === 'monthly' ? monthlySelectedStyle : monthlyStyle "  @click="selectPlan('monthly')">
                        <p style="font-size: 17px; font-weight: 500" slot="default">{{('Monthly')}}</p>
                    </PButton>

                    <PButton v-if="yearlyPlan.length && monthlyPlan.length" :style="selectedPlan === 'annually' ? yearlySelectedStyle : yearlyStyle " @click="selectPlan('annually')" :primary="selectedPlan === 'annually' " >
                        <YearlyPlanPromotion />
                    </PButton>
                </PButtonGroup>
            </PStackItem>
        </PStack>
        <hr style="width: 100%; margin-right: auto;margin-left: auto;margin-bottom: 20px;" />
        <!--=======================================================-->

        <PLayout class="custom-plan">
            <PLayoutSection style="display: flex;border-radius: 20px;">
                <template style="margin-bottom: 20px; display: flex !important;">
                    <template >
                        <div class="Polaris-ResourceList__ResourceListWrapper features" style="width: 30%">
                            <div class="plan__price"></div>
                            <ul class="Polaris-ResourceList">
                                <li class="Polaris-ResourceList__ItemWrapper pro_title" v-for="(features, key) in plans[0].features" :key="key">
                                    <div class="Polaris-ResourceList-Item__Container">
                                        <div class="Polaris-ResourceList-Item__Content">
                                            <h1 class="for-price-per-month"><span>{{ features.name }}</span></h1>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </template>
                    <carousel style="width: 70%" :per-page="3" :navigation-enabled="true">
                        <template v-if="selectedPlan === 'monthly'">
                            <slide class="class=Polaris-Layout__Section" v-for="(plan, key) in monthlyPlan" :style="activePlanStyle(plan)">
                                <div class="plan__price">
                                    <b style="font-size: 16px">{{(plan.name)}}</b>
                                    <div v-if="plan.discount && plan.discount > 0" >
                                        <p style="display: flex;margin-top: 10px">
                                            <PHeading style="font-size: 25px;font-weight: 700;">${{parseFloat(calculateDiscountedPrice(plan)).toFixed(2)}}</PHeading>
                                            <b style="margin-top: 5px;font-size: 17px">/{{("mo")}}</b>
                                        </p>
                                        <p style="display: flex;margin-top: 7px">
                                            <PHeading style="font-size: 18px;font-weight: 500; text-decoration:line-through;">${{parseFloat(plan.price).toFixed(2)}}</PHeading>
                                            <b style="margin-top: 3px;font-size: 14px">/{{("mo")}}</b>
                                        </p>
                                    </div>
                                    <div v-else>
                                        <p style="display: flex;margin-top: 10px">
                                            <PHeading style="font-size: 25px;font-weight: 700;">${{parseFloat(plan.price).toFixed(2)}}</PHeading>
                                            <b style="margin-top: 5px;font-size: 17px">/{{("mo")}}</b>
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <ul>
                                        <li v-for="(feature, key) in plan.features" :key="key" :style="activePlanStyle(plan)">
                                            <div>
                                                <template v-if="feature.value_type === 'boolean'" style="display: flex">
                                                    <PIcon v-if="parseInt(feature.value) === 1" color="success" source="TickMinor"/>
                                                    <PIcon v-else color="subdued" source="MinusMinor"/>
                                                </template>
                                                <template v-else style="display: flex">
                                                    <span v-if="parseInt(feature.value) !== 0">{{ format(feature) }}</span>
                                                    <PIcon v-else color="subdued" source="MinusMinor"/>
                                                </template>
                                            </div>
                                        </li>
                                        <li>
                                            <PButton v-if="isCurrentPlan(plan)" :disabled="isCurrentPlan(plan)"
                                                     full-width
                                                     :pressed="isCurrentPlan(plan)">
                                                {{ ('Current Plan') }}
                                            </PButton>
                                            <PButton v-else-if="!plan.store_base_plan || plan.shopify_plans.includes(shop.shopify_plan)"
                                                     full-width
                                                     @click="plan ? getPlanUrl(plan):'javascript:void'"
                                                     :primary="true" >
                                                {{ ('Choose Plan') }}
                                            </PButton>
                                            <PButton v-else :disabled="true"
                                                     full-width
                                                     :pressed="true">
                                                {{ ('Not applicable') }}
                                            </PButton>
                                        </li>
                                    </ul>
                                </div>
                            </slide>
                        </template>
                    </carousel>
                </template>
            </PLayoutSection>
        </PLayout>
        <!--====================================================================-->
    </PPage>
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
    import { Carousel, Slide } from 'vue-carousel';

    export default {
        name: "SliderPlan",
        components: { Carousel, Slide, YearlyPlanPromotion, PlanBanners, PPage, PStack, PStackItem, PButton, PButtonGroup, PHeading, PLayout, PLayoutSection, PTextContainer, PDataTable, PDataTableCol, PDataTableRow, PIcon, PTextStyle },
        props: ['shop_domain'],
        data() {
            return {
                plan: {},
                plans: [],
                features: [],
                shopify_plan: '',
                default_plan_id: null,
                onboard: true,
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
                    backgroundColor:'#f0f8f5',
                    boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
                    border:'none',
                    borderRadius:'8px',
                    ZIndex: 11,
                },
                yearlyStyle:{
                    color:'#258060',
                    height: '55px',
                    backgroundColor:'#f0f8f5',
                    boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
                    border:'none',
                    borderRadius:'8px'
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
            headings() {
                let headings = [('Plans & Features')];
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
                if (plans.length === 0) {
                    this.selectedPlan = 'annually';
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
                if (plans.length === 0) {
                    this.selectedPlan = 'monthly';
                }
                return plans;
            }
        },
        methods: {

            activePlanStyle(plan) {
                return [plan.shopify_plans.includes(this.shop.shopify_plan) || !plan.store_base_plan ? {backgroundColor: '#f0f8f5', color: '#257f60'} : {}];
            },
            isCurrentPlan(plan) {
                return this.shop.plan && (plan.id === this.shop.plan.id || (!plan.is_custom && plan.base_plan === this.shop.plan.id));
            },
            isSamePlanInOtherInterval(plan) {
                return this.shop.plan && (plan.shopify_plans === this.shop.plan.shopify_plans)
            },
            format(feature) {
                if (['double', 'integer'].includes(feature?.value_type)) {
                    if (feature.format === 'percentage') {
                        return `${feature.value}%`
                    } else if (feature.format === 'count') {
                        return (feature.value < 0 ? (`Unlimited`) : feature.value)
                    } else return feature.value
                }
                else if(['string', 'array'].includes(feature?.value_type)) {
                    return feature.value
                }
            },
            calculateDiscountedPrice(plan) {
                if (plan.discount_type === 'percentage') {
                    return plan.price - (plan.price/plan.discount)
                }
                else if (plan.discount_type === 'amount') {
                    return plan.price - plan.discount
                }
            },
            async getPlanUrl(plan) {
                let shopName = this.shop.name;
                const response = await axios.get(`${this.app_manager_config.baseUrl}/api/app-manager/plan/process/${plan.id}?shop=${shopName}`).catch(error => {
                    console.error(error)
                });
                let redirectUrl = response.data.redirect_url;
                if (redirectUrl) {
                    window.top.location.href = redirectUrl;
                }
            },
            async activePlan() {
                const response = await this.activeWithoutPlan()
                if (response.data.status === true && this.onboard) {
                    // Create the event
                    this.$emit('handlePlanSelect', {chose_later: true})
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
            },
            headerClasses(firstColumn) {
                return {
                    'Polaris-DataTable__Cell': true,
                    'Polaris-DataTable__Cell--header': true,
                    'Polaris-DataTable__Cell--verticalAlignMiddle': true,
                    'Polaris-DataTable__Cell--firstColumn': Boolean(firstColumn),
                };
            }
        },
        async mounted() {

            const featuresData = await axios.get(`${this.app_manager_config.baseUrl}/api/app-manager/plan-features`).catch(error => {
                console.error(error)
            });
            this.features = featuresData.data.features;
            this.features = this.features.sort((featureA, featureB) => parseInt(featureA.display_order) - parseInt(featureB.display_order))

            const plansData = await axios.get(`${this.app_manager_config.baseUrl}/api/app-manager/plans`, { params: { 'shop_domain': this.shop_domain } }).catch(error => {
                console.error(error)
            });
            this.plans = plansData.data.plans;
            this.plans = this.plans.sort((planA, planB) => parseFloat(planA.price) - parseFloat(planB.price));
            if (this.plans && this.plans[0].store_base_plan) {
                this.subtitleContent = 'App plans are based on your existing shopify plan';
            }
            this.shopify_plan = plansData.data.shopify_plan;
            this.plan = plansData.data.plan;
            if (this.plan.interval === 'ANNUAL') {
                this.selectedPlan = 'annually'
            }
            this.default_plan_id = plansData.data.default_plan_id;
            this.onboard = !this.plan
        }
    }
</script>

<style lang="scss">

    @import url('https://fonts.googleapis.com/css2?family=Satisfy&display=swap');

    .app-manager-plan-page ul {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .Polaris-ResourceList__ResourceListWrapper.features li,
    .Polaris-Layout__Section .VueCarousel-slide li,
    .plan__price
    {
        padding: 16px 16px 16px 20px;
    }
    .Polaris-ResourceList__ResourceListWrapper.features li,
    .Polaris-Layout__Section .VueCarousel-slide li:not(:last-child),
    .Polaris-Layout.custom-plan .VueCarousel .plan__price
    {
        border-top: 1px solid #ccc;
        border-right: 1px solid #ccc;
        box-shadow: rgba(23, 24, 24, 0.05) 1px 0px 8px, rgba(0, 0, 0, 0.15) 0px 0px 2px;
        background: #fff;
    }
    .plan__price{
        min-height:121px;
    }
    .Polaris-ResourceList__ResourceListWrapper.features li
    {
        border-left: 1px solid #ccc;
    }
    .Polaris-ResourceList__ResourceListWrapper.features li:last-child,
    .Polaris-Layout__Section .VueCarousel-slide li:nth-last-child(2)
    {
        border-bottom: 1px solid #ccc;
    }
    .Polaris-ResourceList__ResourceListWrapper.features .plan__price
    {
        border-right: 1px solid #ccc;
    }

</style>
