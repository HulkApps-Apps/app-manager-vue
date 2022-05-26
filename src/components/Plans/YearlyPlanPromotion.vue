<template>
    <PLayoutSection class="app-manager-plan-footer" v-if="mappedStaticContent && mappedStaticContent.length">
        <div v-for="(staticContent, key) in mappedStaticContent" :key="key">
            <div v-html="staticContent.content"></div>
        </div>
    </PLayoutSection>
    <span v-else>
        <p style="font-size: 17px; font-weight: 500" slot="default">{{('Annually')}}</p>
    </span>
</template>

<script>
    import axios from 'axios'
    import {PLayoutSection} from "../polaris-vue/src/components/PLayout/components/PLayoutSection";

    export default {
        components: { PLayoutSection },
        name: "YearlyPlanPromotion",
        data() {
            return {
                staticContent: {}
            }
        },
        computed: {
            mappedStaticContent() {
                return this.staticContent['yearlyPlanPromotions'];
            },
        },
        async mounted() {
            const { data } = await axios.get(`${this.app_manager_config.baseUrl}/api/app-manager/marketing-banners`).catch(error => {
                console.error(error)
            });
            this.staticContent = data.banners
        }
    }
</script>

<style scoped>

</style>