<template>
    <PLayoutSection class="app-manager-plan-footer" v-if="mappedStaticContent && mappedStaticContent.length">
        <div v-for="(staticContent, key) in mappedStaticContent" :key="key">
            <div v-html="staticContent.content"></div>
        </div>
    </PLayoutSection>
    <span v-else>
        <p style="font-size: 17px; font-weight: 500" slot="default">{{translateMe('Annually')}}</p>
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
        methods: {
          translateMe(message) {
            return this.$translations.hasOwnProperty(message) ? this.$translations[message] : message;
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