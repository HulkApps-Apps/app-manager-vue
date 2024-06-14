<script>
export default {
  name: "BenefitsBanner",
  props: {
    benefitsData: {
      type: Object,
      required: false,
      default() {
        return {
          benefits: [
            {
              benefit_description:
                "<strong>Unlimited</strong> Access to Enterprise Features",
              benefit_image_url:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTw_HeSzHfBorKS4muw4IIeVvvRgnhyO8Gn8w&s",
            },
            {
              benefit_description:
                "<strong>Unlimited</strong> Access to Enterprise Features",
              benefit_image_url:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTw_HeSzHfBorKS4muw4IIeVvvRgnhyO8Gn8w&s",
            },
            {
              benefit_description:
                "<strong>Unlimited</strong> Access to Enterprise Features",
              benefit_image_url:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTw_HeSzHfBorKS4muw4IIeVvvRgnhyO8Gn8w&s",
            },
            {
              benefit_description:
                "<strong>Unlimited</strong> Access to Enterprise Features",
              benefit_image_url:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTw_HeSzHfBorKS4muw4IIeVvvRgnhyO8Gn8w&s",
            },
            {
              benefit_description:
                "<strong>Unlimited</strong> Access to Enterprise Features",
              benefit_image_url:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTw_HeSzHfBorKS4muw4IIeVvvRgnhyO8Gn8w&s",
            },
          ],
        };
      },
    },
  },
};
</script>

<template>
  <div class="benefits-banner">
    <div class="benefits">
      <div v-for="benefit in benefitsData.benefits" class="benefit">
        <img
          :src="benefit.benefit_image_url"
          alt="benefit"
          width="auto"
          height="auto"
          class="benefit-image"
        />
        <p class="benefit-description" v-html="benefit.benefit_description"></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.benefits-banner {
  padding: 20px;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}
.benefits {
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 20px;
}
.benefit {
  display: flex;
  flex-basis: 25%;
  flex-grow: 0;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  text-align: center;
}
.benefit-description {
  font-size: 14px;
  font-weight: 450;
  color: #303030;
}
.benefit-image {
  width: 42px;
  height: 42px;
}
</style>
