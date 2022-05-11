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

    export default {
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
        }
    }
</script>

<style scoped>

</style>