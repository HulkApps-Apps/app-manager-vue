<template>
    <AppManagerGroupPlan @handlePlanSelect="handlePlanSelect" v-if="group_plan" :shop_domain="shop_domain" ></AppManagerGroupPlan>
    <AppManagerSliderPlan @handlePlanSelect="handlePlanSelect" v-else :shop_domain="shop_domain" ></AppManagerSliderPlan>
</template>

<script>
    import AppManagerGroupPlan from "./AppManagerGroupPlan";
    import AppManagerSliderPlan from "./AppManagerSliderPlan";
    export default {
        name: "AppManagerPlan",
        components: {AppManagerSliderPlan, AppManagerGroupPlan},
        props: {
            shop_domain: {
                type: String
            },
            group_plan: {
                type : Boolean,
                default : false
            }
        },
        methods: {
            handlePlanSelect(payload) {
                this.$emit('handlePlanSelect', payload)
            }
        }
    }
</script>

<style scoped>

</style>