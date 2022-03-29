<template>
  <PLayoutSection v-if="mappedStaticContentHeaders && mappedStaticContentHeaders.length">
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
    mappedStaticContentHeaders() {
      return this.staticContent[this.banner_type];
    },
    banner_type() {
      return this.type === 'header' ? 'headers' : 'footers'
    }
  },
  methods: {
    dismissBanner(key) {
      this.staticContent[this.banner_type].splice(key, 1);
    }
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