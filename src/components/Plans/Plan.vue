<template>

    <PPage
           class="custom-title"
           title="Choose plan"
           :subtitle = "('App plans are based on your existing shopify plan')"
    >

        <PStack slot="primaryAction">
            <PStackItem style="margin-top: 20px">
                <PButtonGroup class="btn-group" segmented>
                    <PButton :style="selectedPlan === 'monthly' ? monthlySelectedStyle : monthlyStyle "  @click="selectPlan('monthly')">
                        <p style="font-size: 17px; font-weight: 500" slot="default">{{('Monthly')}}</p>
                    </PButton>
                    <PButton :style="selectedPlan === 'annually' ? yearlySelectedStyle : yearlyStyle " @click="selectPlan('annually')" :primary="selectedPlan === 'annually' " >

                        <PStack slot="default">
                            <PStackItem>
                                <PTextContainer spacing="tight" style="margin-top:0">
                                    <PHeading>{{('Annually')}}</PHeading>
                                    <p style="margin-top: -3px; color: #E2C138;font-family: inherit "><b style="font-size: 12px;">{{('save')}} 20%</b></p>
                                </PTextContainer>
                            </PStackItem>
                            <PStackItem >
                                <PHeading class="annual_heading"  variation="subdued">{{('get_2_month_free')}}</PHeading>
                            </PStackItem>
                        </PStack>
                    </PButton>

                </PButtonGroup>
            </PStackItem>
        </PStack>
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
                                    <PDataTableCol style="opacity: 0;visibility: hidden; border: 0 !important;" class="plan-heading">
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
                                    <PDataTableCol v-for="(plan, cIndex) in selectedPlan === 'monthly' ? monthlyPlan : yearlyPlan" :key="`cell-${cIndex}-row-${rIndex}`" :style="activePlanStyle(plan)">
                                        <template v-if="feature.value_type === 'boolean'">
                                            <PIcon v-if="plan.features[feature.uuid]" color="success"
                                                   source="TickMinor"/>
                                            <PIcon v-else color="subdued" source="MinusMinor"/>
                                        </template>
                                        <template v-else>
                                            <span v-if="plan.features[feature.uuid]">{{ format(plan.features[feature.uuid]) }}</span>
                                            <PIcon v-else color="subdued" source="MinusMinor"/>
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
                plans: [],
                features: [],
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
            shop() {
                return {
                    "name": "",
                    "shopify_plan": "",
                    "plan_id": null,
                    "has_plan": false,
                    "plan": null,
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
            getPlanUrl(plan) {
                let shopName = this.shop.name;
                return `/billing/${plan.id}?shop=${shopName}`
            },
            async activePlan() {
                const response = await this.activeAccount()
                if (response.data.status === true) {
                    await this.NextStep()
                    await this.bootstrap();
                    this.$router.push('/onboard/install-theme')
                }
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

            const plansData = await axios.get(`${this.app_manager_config.baseUrl}/api/app-manager/plans`).catch(error => {
                console.error(error)
            });
            this.plans = plansData.data.plans;
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
