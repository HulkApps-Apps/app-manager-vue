<template>

    <PPage
           class="custom-title"
           title="Choose plan"
           :subtitle = "('App plans are based on your existing shopify plan')"
    >

        <hr style="width: 100%; margin-right: auto;margin-left: auto;margin-bottom: 20px;" />
        <!--=======================================================-->

        <PLayout class="custom-plan">
            <PLayoutSection>
                <template style="margin-bottom: 20px;">
                    <template>
                        <PDataTable class="plan-table">
                            <template slot="head">
                                <PDataTableRow v-if="selectedPlan === 'monthly'" style="box-shadow: none!important;">
                                    <PDataTableCol style="opacity: 0;visibility: hidden;border: 0 !important;" class="plan-heading">
                                        <b>{{('features')}}</b>
                                    </PDataTableCol>
                                    <template v-for="(plan, key) in monthlyPlan" >
                                        <PDataTableCol :class="{'first-column': key === 0, 'plan-heading': true, 'last-column': (key+1) === monthlyPlan.length}" :style="activePlanStyle(plan)">
                                            <b style="font-size: 16px">{{(plan.name)}}</b>
                                            <p style="display: flex;margin-top: 10px">
                                                <PHeading style="font-size: 25px;font-weight: 700;">${{plan.price.toFixed(2)}}</PHeading>
                                                <b style="margin-top: 5px;font-size: 17px">/{{("mo")}}</b>
                                            </p>
                                        </PDataTableCol>
                                    </template>
                                </PDataTableRow>
                                <PDataTableRow v-else>
                                    <PDataTableCol style="opacity: 0;visibility: hidden; border: 0px !important;" class="plan-heading">
                                        <b>{{('features')}}</b>
                                    </PDataTableCol>
                                    <template v-for="(plan,key) in yearlyPlan">
                                        <PDataTableCol :class="{'first-column': key === 0, 'plan-heading': true, 'last-column': (key+1) === yearlyPlan.length}" :style="activePlanStyle(plan)">
                                            <b style="font-size: 16px">{{(plan.name)}}</b>
                                            <p style="display: flex;margin-top: 10px">
                                                <PHeading style="font-size: 25px; font-weight: 700;">${{plan.price.toFixed(2)}}</PHeading>
                                                <b style="margin-top: 5px;font-size: 17px">/{{("year")}}</b>
                                            </p>
                                        </PDataTableCol>
                                    </template>
                                </PDataTableRow>
                            </template>
                            <template slot="body">
                                <PDataTableRow
                                        v-for="(feature, rIndex) in features" :key="`row-${rIndex}`"
                                >
                                    <PDataTableCol>{{ (feature.name) }}</PDataTableCol>
                                    <PDataTableCol v-for="(plan, cIndex) in monthlyPlan" :key="`cell-${cIndex}-row-${rIndex}`" :style="activePlanStyle(plan)">
                                        <template v-if="feature.type === 'boolean'">
                                            <PIcon v-if="plan.features[feature.slug] && plan.features[feature.slug].value > 0" color="success"
                                                   source="TickMinor"/>
                                            <PIcon v-if="!plan.features[feature.slug] || plan.features[feature.slug].value === 0"
                                                   color="subdued" source="MinusMinor"/>
                                        </template>
                                        <template v-else>
                                            {{ format(plan.features[feature.slug]) }}
                                        </template>
                                    </PDataTableCol>
                                </PDataTableRow>
                                <PDataTableRow v-if="plans.length" class="row-alignment"  >
                                    <PDataTableCol></PDataTableCol>
                                    <PDataTableCol v-for="(plan, cIndex) in selectedPlan === 'monthly' ? monthlyPlan : yearlyPlan" :key="`cell-${cIndex}-row-plan`" style="max-width: 0">
                                        <PButton v-if="plan.shopify_plans.includes(shop.shopify_plan)" :disabled="isCurrentPlan(plan)"
                                                 full-width
                                                 :href="plan ? getPlanUrl(plan):'javascript:void'"
                                                 :pressed="isCurrentPlan(plan)"
                                                 :primary="!isCurrentPlan(plan)">
                                            {{ (isCurrentPlan(plan)) ? ('Current Plan') : 'Choose Plan' }}
                                        </PButton>
                                        <PButton v-else :disabled="true"
                                                 full-width
                                                 :pressed="true">
                                            {{ ('Not applicable') }}
                                        </PButton>
                                        <PTextContainer v-if="shop.plan && plan.shopify_plans.includes(shop.shopify_plan) && !isCurrentPlan(plan)" class="footer-note-container">
                                            <PTextStyle class="text-break" v-if="!plan.shopify_plans.includes(shop.shopify_plan) && !(isCurrentPlan(plan)) && !isSamePlanInOtherInterval(plan)">Note: On account of your recent Shopify plan upgrade, you should consider upgrading your current app plan</PTextStyle>
                                        </PTextContainer>
                                    </PDataTableCol>
                                </PDataTableRow>
                            </template>
                        </PDataTable>
                    </template>
                </template>
                <PStack v-if="onboard && !shop.has_plan" class="choose-plan-btn" alignment="center" distribution="center" vertical>
                    <PStackItem fill>
                        <PButton plain @click="activePlan">{{ ('I will choose the plan later') }}</PButton>
                    </PStackItem>
                </PStack>
            </PLayoutSection>
        </PLayout>
        <!--====================================================================-->
    </PPage>
</template>

<script>

    import axios from "axios";

    export default {
        data() {
            return {
                onboard: false,
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
            featuresOld() {
                return [
                    {
                        "id": 1,
                        "name": "Transaction fee",
                        "slug": "transaction_fee",
                        "type": "double",
                        "format": "percentage",
                        "description": null,
                        "display_order": 2,
                        "created_at": "2022-03-08T11:48:56.000000Z",
                        "updated_at": "2022-03-08T11:48:56.000000Z"
                    },
                    {
                        "id": 2,
                        "name": "Subscriptions",
                        "slug": "subscriptions",
                        "type": "integer",
                        "format": "count",
                        "description": null,
                        "display_order": 3,
                        "created_at": "2022-03-08T11:48:56.000000Z",
                        "updated_at": "2022-03-08T11:48:56.000000Z"
                    },
                    {
                        "id": 3,
                        "name": "Subscription Management",
                        "slug": "subscription_management",
                        "type": "boolean",
                        "format": null,
                        "description": null,
                        "display_order": 4,
                        "created_at": "2022-03-08T11:48:56.000000Z",
                        "updated_at": "2022-03-08T11:48:56.000000Z"
                    },
                    {
                        "id": 4,
                        "name": "Email notification",
                        "slug": "email_notification",
                        "type": "boolean",
                        "format": null,
                        "description": null,
                        "display_order": 5,
                        "created_at": "2022-03-08T11:48:56.000000Z",
                        "updated_at": "2022-03-08T11:48:56.000000Z"
                    }
                ];
            },
            async features() {
                // const { data } = await axios.get(`${this.app_manager_config.baseUrl}/api/app-manager/features`, {
                //     headers: {
                //         'token': '30293a94-145b-4383-8f51-506eb8d87bc2'
                //     }
                // }).catch(error => {
                //     console.error(error)
                // });
                this.plans = this.app_manager_config;
            },
            plansOld() {
                return [
                    {
                        "id": 5,
                        "type": 0,
                        "name": "Basic",
                        "price": 4.9,
                        "offer_text": null,
                        "actual_price": 9.9,
                        "interval": "EVERY_30_DAYS",
                        "capped_amount": null,
                        "terms": null,
                        "trial_days": 60,
                        "test": true,
                        "on_install": false,
                        "created_at": "2022-04-15T10:09:39.000000Z",
                        "updated_at": "2022-04-15T10:09:39.000000Z",
                        "color": "#212b36",
                        "background": "#cce7e0",
                        "public": true,
                        "shopify_plans": [
                            "basic",
                            "affiliate",
                            "npo_full",
                            "open_learning",
                            "partner_test",
                            "staff",
                            "shopify_alumni",
                            "npo_lite",
                            "trial"
                        ],
                        "is_custom": 0,
                        "base_plan": null,
                        "subscribed": false,
                        "features": {
                            "transaction_fee": {
                                "id": 1,
                                "name": "Transaction fee",
                                "slug": "transaction_fee",
                                "type": "double",
                                "format": "percentage",
                                "description": null,
                                "display_order": 2,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": 0
                            },
                            "subscriptions": {
                                "id": 2,
                                "name": "Subscriptions",
                                "slug": "subscriptions",
                                "type": "integer",
                                "format": "count",
                                "description": null,
                                "display_order": 3,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": -1
                            },
                            "subscription_management": {
                                "id": 3,
                                "name": "Subscription Management",
                                "slug": "subscription_management",
                                "type": "boolean",
                                "format": null,
                                "description": null,
                                "display_order": 4,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": true
                            },
                            "email_notification": {
                                "id": 4,
                                "name": "Email notification",
                                "slug": "email_notification",
                                "type": "boolean",
                                "format": null,
                                "description": null,
                                "display_order": 5,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": true
                            },
                            "dashboard_analytics": {
                                "id": 5,
                                "name": "Dashboard Analytics",
                                "slug": "dashboard_analytics",
                                "type": "boolean",
                                "format": null,
                                "description": null,
                                "display_order": 6,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": true
                            },
                            "advance_reporting": {
                                "id": 6,
                                "name": "Advance Reporting",
                                "slug": "advance_reporting",
                                "type": "boolean",
                                "format": null,
                                "description": null,
                                "display_order": 7,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": true
                            },
                            "retention_engine": {
                                "id": 7,
                                "name": "Retention Engine (Coming soon)",
                                "slug": "retention_engine",
                                "type": "boolean",
                                "format": null,
                                "description": null,
                                "display_order": 8,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": true
                            },
                            "gifting": {
                                "id": 8,
                                "name": "Gifting (Coming soon)",
                                "slug": "gifting",
                                "type": "boolean",
                                "format": null,
                                "description": null,
                                "display_order": 9,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": true
                            },
                            "api": {
                                "id": 9,
                                "name": "API (Coming soon)",
                                "slug": "api",
                                "type": "boolean",
                                "format": null,
                                "description": null,
                                "display_order": 10,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": true
                            },
                            "24h_support": {
                                "id": 10,
                                "name": "24x7 Support",
                                "slug": "24h_support",
                                "type": "boolean",
                                "format": null,
                                "description": null,
                                "display_order": 11,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": true
                            }
                        }
                    },
                    {
                        "id": 6,
                        "type": 0,
                        "name": "Shopify",
                        "price": 9.9,
                        "offer_text": null,
                        "actual_price": 19.9,
                        "interval": "EVERY_30_DAYS",
                        "capped_amount": null,
                        "terms": null,
                        "trial_days": 60,
                        "test": true,
                        "on_install": false,
                        "created_at": "2022-04-15T10:09:39.000000Z",
                        "updated_at": "2022-04-15T10:09:39.000000Z",
                        "color": "#212b36",
                        "background": "#cce7e0",
                        "public": true,
                        "shopify_plans": [
                            "professional",
                            "staff_business"
                        ],
                        "is_custom": 0,
                        "base_plan": null,
                        "subscribed": false,
                        "features": {
                            "transaction_fee": {
                                "id": 1,
                                "name": "Transaction fee",
                                "slug": "transaction_fee",
                                "type": "double",
                                "format": "percentage",
                                "description": null,
                                "display_order": 2,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": 0
                            },
                            "subscriptions": {
                                "id": 2,
                                "name": "Subscriptions",
                                "slug": "subscriptions",
                                "type": "integer",
                                "format": "count",
                                "description": null,
                                "display_order": 3,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": -1
                            },
                            "subscription_management": {
                                "id": 3,
                                "name": "Subscription Management",
                                "slug": "subscription_management",
                                "type": "boolean",
                                "format": null,
                                "description": null,
                                "display_order": 4,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": true
                            },
                            "email_notification": {
                                "id": 4,
                                "name": "Email notification",
                                "slug": "email_notification",
                                "type": "boolean",
                                "format": null,
                                "description": null,
                                "display_order": 5,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": true
                            },
                            "dashboard_analytics": {
                                "id": 5,
                                "name": "Dashboard Analytics",
                                "slug": "dashboard_analytics",
                                "type": "boolean",
                                "format": null,
                                "description": null,
                                "display_order": 6,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": true
                            },
                            "advance_reporting": {
                                "id": 6,
                                "name": "Advance Reporting",
                                "slug": "advance_reporting",
                                "type": "boolean",
                                "format": null,
                                "description": null,
                                "display_order": 7,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": true
                            },
                            "retention_engine": {
                                "id": 7,
                                "name": "Retention Engine (Coming soon)",
                                "slug": "retention_engine",
                                "type": "boolean",
                                "format": null,
                                "description": null,
                                "display_order": 8,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": true
                            },
                            "gifting": {
                                "id": 8,
                                "name": "Gifting (Coming soon)",
                                "slug": "gifting",
                                "type": "boolean",
                                "format": null,
                                "description": null,
                                "display_order": 9,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": true
                            },
                            "api": {
                                "id": 9,
                                "name": "API (Coming soon)",
                                "slug": "api",
                                "type": "boolean",
                                "format": null,
                                "description": null,
                                "display_order": 10,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": true
                            },
                            "24h_support": {
                                "id": 10,
                                "name": "24x7 Support",
                                "slug": "24h_support",
                                "type": "boolean",
                                "format": null,
                                "description": null,
                                "display_order": 11,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": true
                            }
                        }
                    },
                    {
                        "id": 7,
                        "type": 0,
                        "name": "Advanced",
                        "price": 14.9,
                        "offer_text": null,
                        "actual_price": 29.9,
                        "interval": "EVERY_30_DAYS",
                        "capped_amount": null,
                        "terms": null,
                        "trial_days": 60,
                        "test": true,
                        "on_install": false,
                        "created_at": "2022-04-15T10:09:39.000000Z",
                        "updated_at": "2022-04-15T10:09:39.000000Z",
                        "color": "#212b36",
                        "background": "#cce7e0",
                        "public": true,
                        "shopify_plans": [
                            "unlimited"
                        ],
                        "is_custom": 0,
                        "base_plan": null,
                        "subscribed": false,
                        "features": {
                            "transaction_fee": {
                                "id": 1,
                                "name": "Transaction fee",
                                "slug": "transaction_fee",
                                "type": "double",
                                "format": "percentage",
                                "description": null,
                                "display_order": 2,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": 0
                            },
                            "subscriptions": {
                                "id": 2,
                                "name": "Subscriptions",
                                "slug": "subscriptions",
                                "type": "integer",
                                "format": "count",
                                "description": null,
                                "display_order": 3,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": -1
                            },
                            "subscription_management": {
                                "id": 3,
                                "name": "Subscription Management",
                                "slug": "subscription_management",
                                "type": "boolean",
                                "format": null,
                                "description": null,
                                "display_order": 4,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": true
                            },
                            "email_notification": {
                                "id": 4,
                                "name": "Email notification",
                                "slug": "email_notification",
                                "type": "boolean",
                                "format": null,
                                "description": null,
                                "display_order": 5,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": true
                            },
                            "dashboard_analytics": {
                                "id": 5,
                                "name": "Dashboard Analytics",
                                "slug": "dashboard_analytics",
                                "type": "boolean",
                                "format": null,
                                "description": null,
                                "display_order": 6,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": true
                            },
                            "advance_reporting": {
                                "id": 6,
                                "name": "Advance Reporting",
                                "slug": "advance_reporting",
                                "type": "boolean",
                                "format": null,
                                "description": null,
                                "display_order": 7,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": true
                            },
                            "retention_engine": {
                                "id": 7,
                                "name": "Retention Engine (Coming soon)",
                                "slug": "retention_engine",
                                "type": "boolean",
                                "format": null,
                                "description": null,
                                "display_order": 8,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": true
                            },
                            "gifting": {
                                "id": 8,
                                "name": "Gifting (Coming soon)",
                                "slug": "gifting",
                                "type": "boolean",
                                "format": null,
                                "description": null,
                                "display_order": 9,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": true
                            },
                            "api": {
                                "id": 9,
                                "name": "API (Coming soon)",
                                "slug": "api",
                                "type": "boolean",
                                "format": null,
                                "description": null,
                                "display_order": 10,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": true
                            },
                            "24h_support": {
                                "id": 10,
                                "name": "24x7 Support",
                                "slug": "24h_support",
                                "type": "boolean",
                                "format": null,
                                "description": null,
                                "display_order": 11,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": true
                            }
                        }
                    },
                    {
                        "id": 8,
                        "type": 0,
                        "name": "Shopify plus",
                        "price": 19.9,
                        "offer_text": null,
                        "actual_price": 49.9,
                        "interval": "EVERY_30_DAYS",
                        "capped_amount": null,
                        "terms": null,
                        "trial_days": 60,
                        "test": true,
                        "on_install": false,
                        "created_at": "2022-04-15T10:09:39.000000Z",
                        "updated_at": "2022-04-15T10:09:39.000000Z",
                        "color": "#212b36",
                        "background": "#cce7e0",
                        "public": true,
                        "shopify_plans": [
                            "shopify_plus",
                            "enterprise",
                            "custom"
                        ],
                        "is_custom": 0,
                        "base_plan": null,
                        "subscribed": false,
                        "features": {
                            "transaction_fee": {
                                "id": 1,
                                "name": "Transaction fee",
                                "slug": "transaction_fee",
                                "type": "double",
                                "format": "percentage",
                                "description": null,
                                "display_order": 2,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": 0
                            },
                            "subscriptions": {
                                "id": 2,
                                "name": "Subscriptions",
                                "slug": "subscriptions",
                                "type": "integer",
                                "format": "count",
                                "description": null,
                                "display_order": 3,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": -1
                            },
                            "subscription_management": {
                                "id": 3,
                                "name": "Subscription Management",
                                "slug": "subscription_management",
                                "type": "boolean",
                                "format": null,
                                "description": null,
                                "display_order": 4,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": true
                            },
                            "email_notification": {
                                "id": 4,
                                "name": "Email notification",
                                "slug": "email_notification",
                                "type": "boolean",
                                "format": null,
                                "description": null,
                                "display_order": 5,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": true
                            },
                            "dashboard_analytics": {
                                "id": 5,
                                "name": "Dashboard Analytics",
                                "slug": "dashboard_analytics",
                                "type": "boolean",
                                "format": null,
                                "description": null,
                                "display_order": 6,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": true
                            },
                            "advance_reporting": {
                                "id": 6,
                                "name": "Advance Reporting",
                                "slug": "advance_reporting",
                                "type": "boolean",
                                "format": null,
                                "description": null,
                                "display_order": 7,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": true
                            },
                            "retention_engine": {
                                "id": 7,
                                "name": "Retention Engine (Coming soon)",
                                "slug": "retention_engine",
                                "type": "boolean",
                                "format": null,
                                "description": null,
                                "display_order": 8,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": true
                            },
                            "gifting": {
                                "id": 8,
                                "name": "Gifting (Coming soon)",
                                "slug": "gifting",
                                "type": "boolean",
                                "format": null,
                                "description": null,
                                "display_order": 9,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": true
                            },
                            "api": {
                                "id": 9,
                                "name": "API (Coming soon)",
                                "slug": "api",
                                "type": "boolean",
                                "format": null,
                                "description": null,
                                "display_order": 10,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": true
                            },
                            "24h_support": {
                                "id": 10,
                                "name": "24x7 Support",
                                "slug": "24h_support",
                                "type": "boolean",
                                "format": null,
                                "description": null,
                                "display_order": 11,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": true
                            }
                        }
                    },
                    {
                        "id": 13,
                        "type": 0,
                        "name": "Basic",
                        "price": 49.9,
                        "offer_text": null,
                        "actual_price": 99.9,
                        "interval": "ANNUAL",
                        "capped_amount": null,
                        "terms": null,
                        "trial_days": 60,
                        "test": true,
                        "on_install": false,
                        "created_at": "2022-04-15T10:09:39.000000Z",
                        "updated_at": "2022-04-15T10:09:39.000000Z",
                        "color": "#212b36",
                        "background": "#cce7e0",
                        "public": true,
                        "shopify_plans": [
                            "basic",
                            "affiliate",
                            "npo_full",
                            "open_learning",
                            "partner_test",
                            "staff",
                            "shopify_alumni",
                            "npo_lite",
                            "trial"
                        ],
                        "is_custom": 0,
                        "base_plan": null,
                        "subscribed": false,
                        "features": {
                            "transaction_fee": {
                                "id": 1,
                                "name": "Transaction fee",
                                "slug": "transaction_fee",
                                "type": "double",
                                "format": "percentage",
                                "description": null,
                                "display_order": 2,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": 0
                            },
                            "subscriptions": {
                                "id": 2,
                                "name": "Subscriptions",
                                "slug": "subscriptions",
                                "type": "integer",
                                "format": "count",
                                "description": null,
                                "display_order": 3,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": -1
                            },
                            "subscription_management": {
                                "id": 3,
                                "name": "Subscription Management",
                                "slug": "subscription_management",
                                "type": "boolean",
                                "format": null,
                                "description": null,
                                "display_order": 4,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": true
                            },
                            "email_notification": {
                                "id": 4,
                                "name": "Email notification",
                                "slug": "email_notification",
                                "type": "boolean",
                                "format": null,
                                "description": null,
                                "display_order": 5,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": true
                            },
                            "dashboard_analytics": {
                                "id": 5,
                                "name": "Dashboard Analytics",
                                "slug": "dashboard_analytics",
                                "type": "boolean",
                                "format": null,
                                "description": null,
                                "display_order": 6,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": true
                            },
                            "advance_reporting": {
                                "id": 6,
                                "name": "Advance Reporting",
                                "slug": "advance_reporting",
                                "type": "boolean",
                                "format": null,
                                "description": null,
                                "display_order": 7,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": true
                            },
                            "retention_engine": {
                                "id": 7,
                                "name": "Retention Engine (Coming soon)",
                                "slug": "retention_engine",
                                "type": "boolean",
                                "format": null,
                                "description": null,
                                "display_order": 8,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": true
                            },
                            "gifting": {
                                "id": 8,
                                "name": "Gifting (Coming soon)",
                                "slug": "gifting",
                                "type": "boolean",
                                "format": null,
                                "description": null,
                                "display_order": 9,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": true
                            },
                            "api": {
                                "id": 9,
                                "name": "API (Coming soon)",
                                "slug": "api",
                                "type": "boolean",
                                "format": null,
                                "description": null,
                                "display_order": 10,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": true
                            },
                            "24h_support": {
                                "id": 10,
                                "name": "24x7 Support",
                                "slug": "24h_support",
                                "type": "boolean",
                                "format": null,
                                "description": null,
                                "display_order": 11,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": true
                            }
                        }
                    },
                    {
                        "id": 14,
                        "type": 0,
                        "name": "Shopify",
                        "price": 99.9,
                        "offer_text": null,
                        "actual_price": 199.9,
                        "interval": "ANNUAL",
                        "capped_amount": null,
                        "terms": null,
                        "trial_days": 60,
                        "test": true,
                        "on_install": false,
                        "created_at": "2022-04-15T10:09:39.000000Z",
                        "updated_at": "2022-04-15T10:09:39.000000Z",
                        "color": "#212b36",
                        "background": "#cce7e0",
                        "public": true,
                        "shopify_plans": [
                            "professional",
                            "staff_business"
                        ],
                        "is_custom": 0,
                        "base_plan": null,
                        "subscribed": false,
                        "features": {
                            "transaction_fee": {
                                "id": 1,
                                "name": "Transaction fee",
                                "slug": "transaction_fee",
                                "type": "double",
                                "format": "percentage",
                                "description": null,
                                "display_order": 2,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": 0
                            },
                            "subscriptions": {
                                "id": 2,
                                "name": "Subscriptions",
                                "slug": "subscriptions",
                                "type": "integer",
                                "format": "count",
                                "description": null,
                                "display_order": 3,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": -1
                            },
                            "subscription_management": {
                                "id": 3,
                                "name": "Subscription Management",
                                "slug": "subscription_management",
                                "type": "boolean",
                                "format": null,
                                "description": null,
                                "display_order": 4,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": true
                            },
                            "email_notification": {
                                "id": 4,
                                "name": "Email notification",
                                "slug": "email_notification",
                                "type": "boolean",
                                "format": null,
                                "description": null,
                                "display_order": 5,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": true
                            },
                            "dashboard_analytics": {
                                "id": 5,
                                "name": "Dashboard Analytics",
                                "slug": "dashboard_analytics",
                                "type": "boolean",
                                "format": null,
                                "description": null,
                                "display_order": 6,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": true
                            },
                            "advance_reporting": {
                                "id": 6,
                                "name": "Advance Reporting",
                                "slug": "advance_reporting",
                                "type": "boolean",
                                "format": null,
                                "description": null,
                                "display_order": 7,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": true
                            },
                            "retention_engine": {
                                "id": 7,
                                "name": "Retention Engine (Coming soon)",
                                "slug": "retention_engine",
                                "type": "boolean",
                                "format": null,
                                "description": null,
                                "display_order": 8,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": true
                            },
                            "gifting": {
                                "id": 8,
                                "name": "Gifting (Coming soon)",
                                "slug": "gifting",
                                "type": "boolean",
                                "format": null,
                                "description": null,
                                "display_order": 9,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": true
                            },
                            "api": {
                                "id": 9,
                                "name": "API (Coming soon)",
                                "slug": "api",
                                "type": "boolean",
                                "format": null,
                                "description": null,
                                "display_order": 10,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": true
                            },
                            "24h_support": {
                                "id": 10,
                                "name": "24x7 Support",
                                "slug": "24h_support",
                                "type": "boolean",
                                "format": null,
                                "description": null,
                                "display_order": 11,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": true
                            }
                        }
                    },
                    {
                        "id": 15,
                        "type": 0,
                        "name": "Advanced",
                        "price": 149.9,
                        "offer_text": null,
                        "actual_price": 299.9,
                        "interval": "ANNUAL",
                        "capped_amount": null,
                        "terms": null,
                        "trial_days": 60,
                        "test": true,
                        "on_install": false,
                        "created_at": "2022-04-15T10:09:39.000000Z",
                        "updated_at": "2022-04-15T10:09:39.000000Z",
                        "color": "#212b36",
                        "background": "#cce7e0",
                        "public": true,
                        "shopify_plans": [
                            "unlimited"
                        ],
                        "is_custom": 0,
                        "base_plan": null,
                        "subscribed": false,
                        "features": {
                            "transaction_fee": {
                                "id": 1,
                                "name": "Transaction fee",
                                "slug": "transaction_fee",
                                "type": "double",
                                "format": "percentage",
                                "description": null,
                                "display_order": 2,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": 0
                            },
                            "subscriptions": {
                                "id": 2,
                                "name": "Subscriptions",
                                "slug": "subscriptions",
                                "type": "integer",
                                "format": "count",
                                "description": null,
                                "display_order": 3,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": -1
                            },
                            "subscription_management": {
                                "id": 3,
                                "name": "Subscription Management",
                                "slug": "subscription_management",
                                "type": "boolean",
                                "format": null,
                                "description": null,
                                "display_order": 4,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": true
                            },
                            "email_notification": {
                                "id": 4,
                                "name": "Email notification",
                                "slug": "email_notification",
                                "type": "boolean",
                                "format": null,
                                "description": null,
                                "display_order": 5,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": true
                            },
                            "dashboard_analytics": {
                                "id": 5,
                                "name": "Dashboard Analytics",
                                "slug": "dashboard_analytics",
                                "type": "boolean",
                                "format": null,
                                "description": null,
                                "display_order": 6,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": true
                            },
                            "advance_reporting": {
                                "id": 6,
                                "name": "Advance Reporting",
                                "slug": "advance_reporting",
                                "type": "boolean",
                                "format": null,
                                "description": null,
                                "display_order": 7,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": true
                            },
                            "retention_engine": {
                                "id": 7,
                                "name": "Retention Engine (Coming soon)",
                                "slug": "retention_engine",
                                "type": "boolean",
                                "format": null,
                                "description": null,
                                "display_order": 8,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": true
                            },
                            "gifting": {
                                "id": 8,
                                "name": "Gifting (Coming soon)",
                                "slug": "gifting",
                                "type": "boolean",
                                "format": null,
                                "description": null,
                                "display_order": 9,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": true
                            },
                            "api": {
                                "id": 9,
                                "name": "API (Coming soon)",
                                "slug": "api",
                                "type": "boolean",
                                "format": null,
                                "description": null,
                                "display_order": 10,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": true
                            },
                            "24h_support": {
                                "id": 10,
                                "name": "24x7 Support",
                                "slug": "24h_support",
                                "type": "boolean",
                                "format": null,
                                "description": null,
                                "display_order": 11,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": true
                            }
                        }
                    },
                    {
                        "id": 16,
                        "type": 0,
                        "name": "Shopify plus",
                        "price": 199.9,
                        "offer_text": null,
                        "actual_price": 499.9,
                        "interval": "ANNUAL",
                        "capped_amount": null,
                        "terms": null,
                        "trial_days": 60,
                        "test": true,
                        "on_install": false,
                        "created_at": "2022-04-15T10:09:39.000000Z",
                        "updated_at": "2022-04-15T10:09:39.000000Z",
                        "color": "#212b36",
                        "background": "#cce7e0",
                        "public": true,
                        "shopify_plans": [
                            "shopify_plus",
                            "enterprise",
                            "custom"
                        ],
                        "is_custom": 0,
                        "base_plan": null,
                        "subscribed": false,
                        "features": {
                            "transaction_fee": {
                                "id": 1,
                                "name": "Transaction fee",
                                "slug": "transaction_fee",
                                "type": "double",
                                "format": "percentage",
                                "description": null,
                                "display_order": 2,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": 0
                            },
                            "subscriptions": {
                                "id": 2,
                                "name": "Subscriptions",
                                "slug": "subscriptions",
                                "type": "integer",
                                "format": "count",
                                "description": null,
                                "display_order": 3,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": -1
                            },
                            "subscription_management": {
                                "id": 3,
                                "name": "Subscription Management",
                                "slug": "subscription_management",
                                "type": "boolean",
                                "format": null,
                                "description": null,
                                "display_order": 4,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": true
                            },
                            "email_notification": {
                                "id": 4,
                                "name": "Email notification",
                                "slug": "email_notification",
                                "type": "boolean",
                                "format": null,
                                "description": null,
                                "display_order": 5,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": true
                            },
                            "dashboard_analytics": {
                                "id": 5,
                                "name": "Dashboard Analytics",
                                "slug": "dashboard_analytics",
                                "type": "boolean",
                                "format": null,
                                "description": null,
                                "display_order": 6,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": true
                            },
                            "advance_reporting": {
                                "id": 6,
                                "name": "Advance Reporting",
                                "slug": "advance_reporting",
                                "type": "boolean",
                                "format": null,
                                "description": null,
                                "display_order": 7,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": true
                            },
                            "retention_engine": {
                                "id": 7,
                                "name": "Retention Engine (Coming soon)",
                                "slug": "retention_engine",
                                "type": "boolean",
                                "format": null,
                                "description": null,
                                "display_order": 8,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": true
                            },
                            "gifting": {
                                "id": 8,
                                "name": "Gifting (Coming soon)",
                                "slug": "gifting",
                                "type": "boolean",
                                "format": null,
                                "description": null,
                                "display_order": 9,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": true
                            },
                            "api": {
                                "id": 9,
                                "name": "API (Coming soon)",
                                "slug": "api",
                                "type": "boolean",
                                "format": null,
                                "description": null,
                                "display_order": 10,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": true
                            },
                            "24h_support": {
                                "id": 10,
                                "name": "24x7 Support",
                                "slug": "24h_support",
                                "type": "boolean",
                                "format": null,
                                "description": null,
                                "display_order": 11,
                                "created_at": "2022-03-08T11:48:56.000000Z",
                                "updated_at": "2022-03-08T11:48:56.000000Z",
                                "value": true
                            }
                        }
                    }
                ];
            },
            async plans() {
                const { data } = await axios.get(`${this.app_manager_config.baseUrl}/api/app-manager/plans`, {
                    headers: {
                        'token': '30293a94-145b-4383-8f51-506eb8d87bc2'
                    }
                }).catch(error => {
                    console.error(error)
                });
                this.plans = data;
                return this.plans;
            },
            shop() {
                return {
                    "id": 3,
                    "name": "demo-anil.myshopify.com",
                    "email": "shop@demo-anil.myshopify.com",
                    "email_verified_at": null,
                    "shopify_id": null,
                    "shopify_name": null,
                    "shopify_email": null,
                    "shopify_owner": null,
                    "shopify_plan": "partner_test",
                    "shopify_settings": null,
                    "deleted_at": null,
                    "restored_at": null,
                    "created_at": "2022-04-26T12:03:16.000000Z",
                    "updated_at": "2022-04-26T12:56:44.000000Z",
                    "trial_days": 60,
                    "activated_at": "2022-04-26 12:55:56",
                    "shopify_grandfathered": 0,
                    "shopify_namespace": null,
                    "shopify_freemium": 0,
                    "plan_id": null,
                    "password_updated_at": "2022-04-26",
                    "last_charge_date": null,
                    "plan_upgraded": null,
                    "upgrade_notify": null,
                    "terms_accepted": 1,
                    "onboarded": 4,
                    "published_theme": 1,
                    "installation_stated_at": "2022-04-26 12:33:08",
                    "steps_completed": false,
                    "has_autopilot_error": null,
                    "help_popup_triggered_at": "2022-04-26 12:56:44",
                    "help_popup_count": 1,
                    "ga_registered": 0,
                    "highest_order_value": null,
                    "trial_extend": null,
                    "url": "https://demo-chirag-parmar.myshopify.com",
                    "has_plan": true,
                    "remaining_trial_days": 59,
                    "settings": {
                        "id": 3,
                        "shop_id": 3,
                        "retry_interval": 5,
                        "max_tries": 3,
                        "customer_control": {
                            "shipping_details": true,
                            "update_quantity": false,
                            "add_more_subscription_products": true,
                            "add_more_onetime_products": true,
                            "onetime_product_collection": "all",
                            "change_variant": false,
                            "swap_product": false,
                            "skip_shipment": true,
                            "edit_frequency": true,
                            "cancel_subscription": true,
                            "discount_code": false,
                            "text_color": "#000000",
                            "theme": "light"
                        },
                        "custom_js": null,
                        "custom_css": null,
                        "default_option": "onetime",
                        "text_color": "#000000",
                        "show_term_checkbox": false,
                        "tnc_url": "",
                        "language": {
                            "product-page": {
                                "terms-and-condition": "Terms and Condition",
                                "i-agree-to": "I agree to"
                            },
                            "my-subscriptions-page": {
                                "subscription-history": "Subscription history",
                                "total-spent": "Total spent",
                                "total-orders": "Total orders",
                                "member-since": "Member since",
                                "your-subscriptions": "Your subscriptions",
                                "more-items": "More items",
                                "no-Subscriptions-found": "No subscriptions found"
                            },
                            "individual-subscription-page": {
                                "apply": "Apply",
                                "status": "Status",
                                "deliver-every": "Deliver every",
                                "pay-every": "Pay every",
                                "one-time-purchase": "One time purchase ",
                                "billing-every": "Billing every",
                                "next-billing-date": "Next billing",
                                "subscription-status": "Subscription status",
                                "next-charge-date": "Next charge date",
                                "billing-frequency": "Billing frequency",
                                "order-frequency": "Order frequency",
                                "swap-products": "Swap products",
                                "choose-products": "Choose products",
                                "add-new-card": "Add new card",
                                "payment-method": "Payment method",
                                "expires-on": "Expires on",
                                "button-text": "Button text",
                                "cancel": "Cancel",
                                "save": "Save",
                                "please-wait": "Please wait",
                                "add-more-subscription-item": "Add more subscription items",
                                "add-more-onetime-item": "Add more onetime items",
                                "load-more": "Load more",
                                "login": "Login",
                                "login-to-see-your-subscriptions": "Login to see your subscriptions",
                                "first-name": "First name",
                                "last-name": "Last name",
                                "company-name": "Company name",
                                "address-line-1": "Address line 1",
                                "address-line-2": "Address line 2",
                                "city": "City",
                                "zip": "Zip",
                                "contact-number": "Contact number",
                                "shipping-address": "Shipping address",
                                "total-price": "Total price",
                                "discount": "Discount",
                                "order-total": "Order total",
                                "excluding-tax-and-shipping-charges": "Tax and shipping cost excluded",
                                "one-time": "One time",
                                "discount-code": "Discount code",
                                "enter-code": "Enter code",
                                "orders": "Orders",
                                "order-date": "Order & Date",
                                "total": "Total",
                                "note": "Note",
                                "title": "Title",
                                "fulfillment-status": "Fulfillment status",
                                "updating-prepaid-subscription": "Updating prepaid subscription",
                                "updating-prepaid-subscription-warning-message": "You are updating prepaid subscription. All Changes done will reflect in your subscription after next charge date.",
                                "add": "Add",
                                "payment-method-title": "Select card",
                                "shipping-address-error-message": "Oops! It looks like you are trying to subscribe to a physical product that requires a shipping address.",
                                "ship-now": "Ship now",
                                "ship-now-title": "Ship now",
                                "ship-now-message": "Next shipment is scheduled on {{date}}, would you like to overwrite as per current shipment? It will reflect on all future shipments according to selected frequency.",
                                "yes": "Yes",
                                "no": "No",
                                "cancellation-reason": "Cancellation reason",
                                "select-reason": "Please select reason for cancellation",
                                "track-shipment": "Track Shipment",
                                "shipment": "Shipment"
                            },
                            "order-confirmation": {
                                "subscription-title": "Subscription information",
                                "manage-subscription-button": "Manage subscription",
                                "manage-subscription-description": "You can view, edit or cancel your subscriptions by logging into your account or through the direct link you receive in the email."
                            }
                        },
                        "created_at": "2022-04-26T12:58:25.000000Z",
                        "updated_at": "2022-04-26T12:58:25.000000Z",
                        "app_proxy_prefix": "apps",
                        "app_proxy_path": "subscription-plus",
                        "layout": false,
                        "show_pricing": 1,
                        "branding_color": "#000000",
                        "cancellation_reasons": null,
                        "cancellation_reason_status": false,
                        "order_tags": null,
                        "customer_tags": null
                    },
                    "plan": null,
                    "custom_plans": []
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
                for(var planKey in this.plans) {
                    if(this.plans[planKey].interval === 'EVERY_30_DAYS') {
                        plans.push(this.plans[planKey]);
                    }
                }
                return plans;
            },
            yearlyPlan() {
                const plans = [];
                for(var planKey in this.plans) {
                    if(this.plans[planKey].interval === 'ANNUAL') {
                        plans.push(this.plans[planKey]);
                    }
                }
                return plans;
            }
        },
        methods: {

            activePlanStyle(plan) {
                return [plan.shopify_plans.includes(this.shop.shopify_plan) ? {backgroundColor: '#f0f8f5', color: '#257f60'} : {}];
            },
            isCurrentPlan(plan) {
                return this.shop.plan && (plan.id === this.shop.plan.id || (!plan.is_custom && plan.base_plan === this.shop.plan.id));
            },
            isSamePlanInOtherInterval(plan) {
                return this.shop.plan && (plan.shopify_plans === this.shop.plan.shopify_plans)
            },
            // planPrice(plan) {
            //     if (plan.actual_price > 0) {
            //         return `${this.moneyFormat(plan.price,"${{amount}}")} <span style="text-decoration: line-through">${this.moneyFormat(plan.actual_price,"${{amount}}")}</span>`
            //     } else return `${this.moneyFormat(plan.price,"${{amount}}")}`
            // },
            format(feature) {
                if (['double', 'integer'].includes(feature.type)) {
                     if (feature.format === 'percentage') {
                        return `${feature.value}%`
                    } else if (feature.format === 'count') {
                        return (feature.value < 0 ? (`Unlimited`) : feature.value)
                    } else return feature.value
                }
            },
            getPlanUrl(plan) {
                const url_params = new URLSearchParams(this.query).toString();
                return `/billing/${plan.id}?shop='anil`
            },
            // async activePlan() {
            //     const response = await this.activeAccount()
            //     if (response.data.status === true) {
            //         await this.NextStep()
            //         await this.bootstrap();
            //         this.$router.push('/onboard/install-theme')
            //     }
            // },
            // async selectPlan(value){
            //     this.selectedPlan= value;
            // },
            headerClasses(firstColumn) {

                return {
                    'Polaris-DataTable__Cell': true,
                    'Polaris-DataTable__Cell--header': true,
                    'Polaris-DataTable__Cell--verticalAlignMiddle': true,
                    'Polaris-DataTable__Cell--firstColumn': Boolean(firstColumn),
                };
            }
        }
    }
</script>

<style>

    @import url('https://fonts.googleapis.com/css2?family=Satisfy&display=swap');

    .plan-table  td:last-child>*[data-v-7d902277] {
        float:none;
    }
    .active {
        background: #f0f8f5;
    }
    .plan-table  td:last-child>*[data-v-0d1b0d63] {
        float:none;
    }
    .plan-table td {
        border: 0.01px solid #ececee !important;
        border-collapse: collapse !important;
    }
    .plan-table .Polaris-DataTable__ScrollContainer{
        border-radius:12px;
        overflow: visible;
    }
    .plan-table table {
        border-collapse: collapse !important;
    }
    .custom-plan table {
        border-collapse: collapse !important;
    }
    .custom-plan table thead .first-column {
        border-radius: 12px 0 0 0;
        border-top: 0px !important;
        border-left: 0px !important;
    }
    .custom-plan table thead .plan-heading.last-column {
        text-align: left !important;
        border-radius: 0 12px 0 0;
        border-top: 0px !important;
    }
    .custom-plan table thead .plan-heading {
        background-color: rgb(255, 255, 255);
        box-shadow: rgb(23 24 24 / 5%) 1px 0px 8px, rgb(0 0 0 / 15%) 0px 0px 2px;
    }
    .custom-plan table tbody tr:first-child {
        background-color: #fff;
        box-shadow: 0 0 5px rgb(23 24 24 / 5%), 0 1px 2px rgb(0 0 0 / 15%);
        border-radius: 12px 0 0 0;
        overflow: hidden;
    }
    .custom-plan table tbody tr:not(:first-child :last-child ) {
        background-color: #fff;
        overflow: hidden;
    }
    .custom-plan table tbody tr:not(:first-child :last-child) {
        background-color: #fff;
        box-shadow: 0 0 5px rgb(23 24 24 / 5%), 0 1px 2px rgb(0 0 0 / 15%);
        overflow: hidden;
    }
    .custom-plan table tbody tr:not( :nth-last-child(2) ) {
        background-color: #fff;
        overflow: hidden;
    }
    .custom-plan table tbody tr:not( :nth-last-child(2) ) {
        border-bottom: 0;
    }
    .custom-plan table tbody tr:last-child {
        border-bottom: 0;
        background-color: transparent;
    }
    .custom-plan table tbody tr:not(:last-child) {
        pointer-events: none;
    }
    .custom-plan table thead tr td{
        pointer-events: none;
    }
    .custom-plan table tbody tr:first-child td:first-child {
        overflow: hidden;
        border-radius: 12px 0 0 0;
    }
    .custom-plan table tbody tr:nth-last-child(2) {
        overflow: hidden;
        border-bottom-right-radius: 12px;
        border-bottom-left-radius: 12px;
    }
    .custom-plan table tbody tr:nth-last-child(2) td:first-child {
        overflow: hidden;
        border-radius: 0 0 0 12px;
    }
    .custom-plan table tbody tr:nth-last-child(2) td:last-child {
        overflow: hidden;
        border-radius: 0 0 12px;
    }
    .custom-plan table tbody tr td:first-child {
        border-left: 0px !important;
        padding-left: 20px;
    }
    .custom-plan table tbody tr td:last-child {
        border-right: 0px !important;
        text-align: center !important;
    }
    .custom-plan table thead tr td:last-child {
        border-right: 0px !important;
        text-align: center !important;
    }
    .custom-plan table tbody td:not(:first-child) {
        text-align: center !important;
    }
    .custom-plan table tbody tr:last-child td:last-child {
        background: transparent;
        border-radius: 0 0 12px 0;
    }
    .custom-plan table tbody tr:last-child td {
        border: 0 !important;
        background: transparent;
    }
    .custom-plan table tbody tr:last-child td:hover {
        border: 0 !important;
        background: transparent;
    }
    .custom-plan tbody tr:last-child td.Polaris-DataTable__Cell--verticalAlignTop{
        background: transparent !important;
    }
    .custom-plan table tbody tr:last-child {
        background: transparent;
        opacity:1.0;
    }
    .custom-plan table tbody tr:last-child  td:first-child{
        visibility: hidden;
    }
    .plan-heading {
        padding-top: 30px;
    }
    .custom-plan .Polaris-Layout__Section{
        max-width: calc(100% - 2rem) !important;
    }
    .later-link {
        text-align: center;
        clear: both;
        padding-top: 15px;
    }
    .plan-badge ul {
        text-align: center;
        padding-top: 2rem;
        border-top: 0.1rem solid #e1e3e5;
    }
    .plan-badge ul li {
        list-style: none;
        display: inline-block;
        padding-right: 25px;
    }
    .plan-badge ul li img {
        max-width: 133px;
    }
    .btn-group .Polaris-ButtonGroup__Item{
        margin-left: 0px !important;
        z-index: unset !important;
    }
    .custom-title .Polaris-HorizontalDivider{
        background-color: #e2e3e4;
    }
    .annual_heading{
        margin-top: 2px !important;
        color: #E2C138;
        border: 2px dotted #E2C138;
        padding: 5px;
        font-size: 16px !important;
        font-weight: normal !important;
        font-family: 'Satisfy', cursive;
    }
    .Polaris-Page__Content hr{
        border: 1px solid #e2e3e4;
    }
</style>
