<script>
import VariantButton from "./VariantButton.vue";

export default {
  name: "GetCustomBlock",
    components: {
        VariantButton
    },
  props: {
    title: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    buttonText: {
      type: String,
      required: false,
    },
  },
  methods: {
    handleClick() {
      event.preventDefault();
      this.$emit("click", event);
    },
    translateMe(message) {
      return this.$translations.hasOwnProperty(message)
        ? this.$translations[message]
        : message;
    },
    handleCustomizePlan(){
      this.$emit('handleCustomizePlan')
    }
  },
};
</script>

<template>
  <div class="block">
    <img
      src="../../assets/cogsettings.svg"
      alt="Settings"
      width="76"
      height="78"
    />
    <h3>{{ title }}</h3>
    <h6>{{ description }}</h6>
    <VariantButton @click="handleClick" variant="primary" class="button">{{
      buttonText
    }}</VariantButton>
  </div>
</template>

<style scoped>
.block {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 16px;
  padding: 20px;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0px 4px 6px -1px #0000001a;
}
.block img {
    width: auto;
    height: auto;
}
.block h3 {
    font-size: 16px;
    font-weight: 700;
    color: black;
}
.block h6 {
    font-size: 13px;
    font-weight: 400;
    color: #00000080;
    max-width: 186px;
    text-align: center;
}
.button {
    /* width: 261px !important; */
    width: 100% !important;
    display: flex !important;
    height: fit-content !important;
    justify-content: center !important;
}
</style>
