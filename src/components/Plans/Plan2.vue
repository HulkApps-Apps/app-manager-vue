<template>
    <PPage class="custom-title"
           :title="'Choose Plan'"
           :subtitle = "'App plans are based on your existing shopify plan'"
    >

        <hr style="width: 100%; margin-right: auto;margin-left: auto;margin-bottom: 20px;" />
        <PCard>
            <PDataTable
                    footerContent="Showing 3 of 3"
                    :headings='headings'
                    :rows='rows'
            />
        </PCard>
    </PPage>
</template>

<script>
    import axios from "axios";

    export default {
        name: "Plan",
        data() {
            return {
                headings: [
                    {
                        content:"Feature",
                        value:"feature",
                        type:"text",
                    },
                    {
                        content:"Basic",
                        value:"basic",
                        type:"numeric"
                    },
                    {
                        content:"Shopify",
                        value:"shopify",
                        type:"numeric"
                    },
                    {
                        content:"Advanced",
                        value:"advanced",
                        type:"numeric"
                    },
                    {
                        content:"Shopify Plus",
                        value:"shopify-plus",
                        type:"numeric"
                    }
                ],
                plans: [],
                rows: [
                    {
                        "feature":"Emerald Silk Gown",
                        "basic":"$875.00",
                        "shopify":124689,
                        "advanced":124689,
                        "shopify-plus":"critical"
                    },
                    {
                        "feature":"Emerald Silk Gown",
                        "basic":"$875.00",
                        "shopify":124689,
                        "advanced":124689,
                        "shopify-plus":"critical"
                    },
                    {
                        "feature":"Emerald Silk Gown",
                        "basic":"$875.00",
                        "shopify":124689,
                        "advanced":124689,
                        "shopify-plus":"critical"
                    }
                ]
            }
        },
        computed: {

        },
        methods: {
            async fetchPlans() {
                const { data } = await axios.get(`${this.app_manager_config.baseUrl}/api/app-manager/plans`, {
                    headers: {
                        'token': '30293a94-145b-4383-8f51-506eb8d87bc2'
                    }
                }).catch(error => {
                    console.error(error)
                });
                this.plans = data;
            }
        },
        async created() {
            console.log('-----------')
            console.log(this.fetchPlans())
            console.log('-----------')
        }

    }
</script>

<style scoped>

</style>