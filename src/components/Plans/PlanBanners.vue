<template>
    <PLayoutSection class="app-manager-plan-footer"
                    v-if="mappedStaticContentPlan && mappedStaticContentPlan.length">
        <div v-for="(staticContent, key) in mappedStaticContentPlan" :key="key">

            <PBanner
                    v-if="staticContent.type === 'banner'"
                    :id="`static-content-header-${key}`"
                    :status="staticContent.status"
                    @dismiss="() => dismissBanner(key)"
            >
                <div v-html="staticContent.content"></div>
            </PBanner>
            <div v-else v-html="staticContent.content"></div>
        </div>
    </PLayoutSection>
</template>

<script>

    import axios from 'axios'
    import {PLayoutSection} from "../polaris-vue/src/components/PLayout/components/PLayoutSection";
    import {PBanner} from "../polaris-vue/src/components/PBanner";
    export default {
        components: { PBanner, PLayoutSection },
        name: "PlanBanners",
        data() {
            return {
                staticContent: {}
            }
        },
        computed: {
            mappedStaticContentPlan() {
                return this.staticContent['plans'];
            },
        },
        async mounted() {

            const { data } = await axios.get(`${this.app_manager_config.baseUrl}/api/app-manager/marketing-banners`).catch(error => {
                console.error(error)
            });

            this.staticContent = data.banners
            Object.keys(this.staticContent).map((key) => {
                if (this.staticContent[key].length) {
                    Object.keys(this.staticContent[key]).map((index) => {
                        if (this.staticContent[key][index].length) {
                            this.staticContent[key][index] = this.staticContent[key][index][Math.floor(Math.random()*this.staticContent[key][index].length)]
                        }
                    });
                }
            });
        }
    }
</script>

<style scoped>

</style>