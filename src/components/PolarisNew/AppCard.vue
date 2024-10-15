<script>
import VariantButton from "@/components/PolarisNew/VariantButton.vue";

export default {
  name: "AppCard",
  components: {VariantButton},
  props: {
    appData: {
      type: Object,
      required: false,
      default() {
        return {
          app_name: "Releasit Form & Upsell",
          app_logo_url:
            "https://cdn.shopify.com/app-store/listing_images/59ff1b17b1415cf11af2ee0a00c68334/icon/CKKYs5695_ICEAE=.png",
          app_reviews_count: "3,881",
          app_tags: [
            {
              tag_name: "Cash/collect on delivery (COD)",
              tag_ext_url: "#",
            },
            {
              tag_name: "Upselling and cross-selling",
              tag_ext_url: "#",
            },
          ],
          app_bfs: false,
          app_option_types_count: "12",
          app_featured_option_types: [
            "Dynamic Checkout Button",
            "Color/Image Swatches",
            "Color/Image Swatches",
          ],
        };
      },
    },
  },
  methods: {
    translateMe(message) {
      return this.$translations.hasOwnProperty(message)
        ? this.$translations[message]
        : message;
    },
  },
};
</script>

<template>
  <div>
    <div class="app-card">
      <div class="logo">
        <img
          :src="appData.app_logo_url"
          alt="logo"
          width="auto"
          height="auto"
          class="logo-image"
        />
      </div>
      <div class="details">
        <div class="upper-details">
          <h3 class="app-name">
            {{ translateMe(appData.app_name) }}
          </h3>
          <div
            v-if="appData.app_bundle_details.built_for_shopify"
            class="app-tags"
          >
            <a class="app-tag bfs-tag">
              <svg
                width="16"
                height="14"
                viewBox="0 0 16 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_61_2350)">
                  <path
                    d="M13 0L12 5L8 14L16 4.5L13 0ZM3 0L4 5L8 14L0 4.5L3 0Z"
                    fill="#1495CC"
                  />
                  <path d="M3 0L4 5L8 14L12 5L13 0H3Z" fill="#58B7DF" />
                  <path
                    d="M8 14L4 5L0 4.5L8 14ZM8 14L12 5L16 4.5L8 14Z"
                    fill="#035F86"
                  />
                  <path d="M8 5.5L4 5L8 14L12 5L8 5.5Z" fill="#1495CC" />
                  <path d="M4 5L8 0L12 5L7.999 5.5L4 5Z" fill="#A9DEF4" />
                  <path d="M4 5L3 0H8L4 5ZM12 5L13 0H8L12 5Z" fill="#58B7DF" />
                </g>
                <defs>
                  <clipPath id="clip0_61_2350">
                    <rect width="16" height="14" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              {{ translateMe("Built For Shopify") }}
            </a>
          </div>
          <p class="app-reviews-count">
            {{ appData.app_bundle_details.reviews }}
            {{ translateMe("Reviews") }}
          </p>
          <div class="app-tags">
            <a
              class="app-tag"
              v-for="tag in appData.app_bundle_details.shopify_categories"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.99998 14C9.58577 14 9.24999 13.6642 9.25 13.25L9.25006 9.74999C9.25007 9.33577 9.58586 8.99999 10.0001 9C10.4143 9.00001 10.7501 9.3358 10.7501 9.75001L10.75 13.25C10.75 13.6642 10.4142 14 9.99998 14Z"
                  fill="#0094D5"
                />
                <path
                  d="M9 7C9 6.44772 9.44772 6 10 6C10.5523 6 11 6.44772 11 7C11 7.55228 10.5523 8 10 8C9.44772 8 9 7.55228 9 7Z"
                  fill="#0094D5"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10ZM15.5 10C15.5 13.0376 13.0376 15.5 10 15.5C6.96243 15.5 4.5 13.0376 4.5 10C4.5 6.96243 6.96243 4.5 10 4.5C13.0376 4.5 15.5 6.96243 15.5 10Z"
                  fill="#0094D5"
                />
              </svg>
              {{ translateMe(tag) }}
            </a>
          </div>
        </div>
        <div class="lower-details">
          <span
            class="featured-options"
            v-for="option in appData.app_bundle_details.features"
          >
            <svg
              width="4"
              height="4"
              viewBox="0 0 4 4"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="4" height="4" rx="2" fill="black" />
            </svg>
            {{ translateMe(option) }}</span
          >
        </div>
      </div>
      <div class="install-app-div">
        <a :href="appData.app_shopify_store_link" class="button-link">
          <button class="install-app-button">
            {{ translateMe('Install App') }}
          </button>
        </a>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<style scoped>
.app-card {
  display: flex;
  padding: 16px;
  background-color: white;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  border-radius: 12px;
  gap: 16px;
  align-items: center;
}
.logo-image,
.logo {
  width: 40px;
  height: 40px;
  border-radius: 4px;
}
.lower-details {
  margin-top: 8px;
}
.upper-details,
.lower-details {
  display: flex;
  flex-wrap: wrap;
  row-gap: 2px;
  column-gap: 8px;
}
.app-name {
  font-size: 14px;
  font-weight: 650;
  line-height: 20px;
}
.app-reviews-count {
  font-size: 13px;
  font-weight: 400;
  line-height: 20px;
  color: #5c5c5c;
}
.app-tag {
  background-color: #e0f0ff;
  width: fit-content;
  margin-right: 12px;
  padding: 3px 4px;
  border-radius: 8px;
  font-size: 12px;
  color: #00527c;
  line-height: 12px;
  font-weight: 550;
  text-decoration: none;
  white-space: nowrap;
}
.app-tag > svg {
  margin-bottom: -5.5px;
}
.bfs-tag {
  margin-right: 0px;
  margin-bottom: 0px !important;
}
.bfs-tag > svg {
  margin-bottom: -3px;
}
.app-option-type-count,
.featured-options {
  display: flex;
  gap: 4px;
  align-items: center;
  font-size: 13px;
  font-weight: 450;
  line-height: 20px;
  text-wrap: nowrap;
  color: #5c5c5c;
}
.install-app-div {
  margin-left: auto;
  display: flex;
  align-items: center;
  white-space: nowrap;
}
.install-app-button {
  display: flex;
  width: fit-content !important;
  height: 28px !important;
  align-items: center !important;
  gap: 8px !important;
  padding: 4px 12px !important;
  text-decoration: none !important;
  font-size: 13px !important;
  font-weight: 450 !important;
  background-color: rgba(0, 0, 0, 0.08) !important;
  color: #303030 !important;
  border-radius: 8px !important;
  border: none;
  font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif;
}
.install-app-button:hover {
  background-color: rgba(0, 0, 0, 0.05) !important;
  border-radius: 8px !important;
}
.button-link {
  text-decoration: none;
}



@media (max-width: 767px) {
  .featured-options {
    text-wrap: wrap;
  }
  .details {
    gap: 8px;
  }
  .app-tags {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 8px;
  }
  .upper-details,
  .lower-details {
    flex-direction: column;
    flex-wrap: wrap;
    row-gap: 2px;
    column-gap: 8px;
  }
  .install-app-button {
    margin-right: 0;
    margin-left: auto;
  }
}
</style>
