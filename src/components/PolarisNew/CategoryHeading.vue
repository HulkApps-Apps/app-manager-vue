<script>
export default {
  name: "CategoryHeading",
  props: {
    headingData: {
      type: Object,
      required: false,
      default() {
        return {
          category_name: "Bestsellers",
          category_description: "Make a big impact with our top-selling apps.",
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
    <div class="category-heading">
      <h4 class="category-name">
        {{ translateMe(headingData.category_name) }}
        <span v-if="headingData.apps_relation != null">
          ({{ translateMe(headingData.apps_relation.length) }})
        </span>
      </h4>
      <p class="category-description">
        {{ translateMe(headingData.category_description) }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.category-heading {
  display: flex;
  flex-direction: column;
  align-items: left;
  gap: 4px;
}
.category-name {
  font-size: 13px;
  font-weight: 750;
  line-height: 20px;
  color: black;
}
.category-description {
  font-size: 12px;
  font-weight: 450;
  font-variation-settings: "slnt" 0;
  color: #303030;
}
</style>
