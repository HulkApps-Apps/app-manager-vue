<template>
  <PLayoutSection v-if="mappedStaticContentHeaders && mappedStaticContentHeaders.length">
    <PBanner
            v-for="(header, key) in mappedStaticContentHeaders" :key="key"
            :id="`static-content-header-${key}`"
            :status="header.status"
            :title="translateMe(header.title)"
            @dismiss="() => dismissBanner(key)"
            v-if="date_compare(header.published_on) && (header.expired_on == null || !date_compare(header.expired_on))"
    >
      <span v-html="translateMe(header.content)"></span>
    </PBanner>
  </PLayoutSection>
</template>

<script>
  import {PLayoutSection} from "../polaris-vue/src/components/PLayout/components/PLayoutSection";
  import {PBanner} from "../polaris-vue/src/components/PBanner";

  import axios from 'axios'
  import install from "@/entry.esm";
  import Vue from "vue";

  export default {
    components: {PLayoutSection, PBanner},
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
      },
      base_url: {
        type: String,
        default: null
      },
      translations:{
        type: Object,
        default() {
          return {'hulkapps' : 'hulkapps'}
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
      },

    },
    methods: {
      dismissBanner(key) {
        this.$emit('handleBannerClose', {action:'close',type: this.banner_type});
        this.$emit('handle-banner-close', {action:'close',type: this.banner_type});
        this.staticContent[this.banner_type].splice(key, 1);
      },
      date_compare(published_on){
        var published_on_obj = published_on.split('/');
        var now = new Date();
        var compareDate = new Date(published_on_obj[2]+'/'+published_on_obj[0]+'/'+published_on_obj[1]);
        var isShow = now.getTime() >= compareDate.getTime();
        return isShow;
      },
      translateMe(message){
        return this.$translations.hasOwnProperty(message)?this.$translations[message]:message;
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
    },
    created() {
      Vue.prototype.$translations = (Object.keys(this.translations).length > 0)?this.translations:{};
      if (this.base_url != null) {
        let config = {
          baseUrl: this.base_url
        }
        install(Vue, config)
      }
    }
    }
</script>

<style scoped>

</style>