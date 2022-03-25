<template>
  <PLayoutSection v-if="mappedStaticContentHeaders.length">
    <PBanner
        v-for="(header, key) in mappedStaticContentHeaders" :key="key"
        :id="`static-content-header-${key}`"
        :status="header.status"
        @dismiss="() => dismissBanner(key)"
    >
      <span v-html="header.content"></span>
    </PBanner>
  </PLayoutSection>
</template>

<script>

import axios from 'axios'

export default {
  name: "Banners",
  props: {
    type: {
      type: String,
      validator(value) {
        return ['header', 'footer'].includes(value)
      },
      default() {
        return 'header'
      }
    }
  },
  data() {
    return {
      dismissedBanners: [],
      staticContent: {}
    }
  },
  computed: {
    mappedStaticContentHeaders: function() {
      const computed = [];
      const banner_type  = this.type === 'header' ? 'headers' : 'footers'

      for(var key in this.staticContent[banner_type]) {
        if(!this.dismissedBanners.includes(parseInt(key))) {
          computed.push(this.staticContent[banner_type][key]);
        }
      }
      return computed;
    }
  },
  methods: {
    dismissBanner(key) {
      this.dismissedBanners.push(key);
    }
  },
  async mounted() {

    const {data} = await axios.get(`${this.app_manager_config.baseUrl}/api/app-manager/marketing-banners`);

    this.staticContent = data.banners
  }
}
</script>

<style scoped>

</style>