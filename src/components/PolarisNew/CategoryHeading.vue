<script>
export default {
  name: "CategoryHeading",
  props: {
    showcaseData: {
      type: Object,
      required: false,
      default() {
        return {
          category_name: "Bestsellers",
          category_apps_count: 5,
          category_descrioption: "Make a big impact with our top-selling apps.",
        };
      },
    },
  },
};
</script>

<template>
  <div>
    <div class="category-heading">
      <h4 class="category-name">
        {{ showcaseData.category_name }}
        ({{ showcaseData.category_apps_count }})
      </h4>
      <p class="category-description">
        {{ showcaseData.category_descrioption }}
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
