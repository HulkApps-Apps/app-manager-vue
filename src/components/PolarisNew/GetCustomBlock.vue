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
    <svg width="81" height="81" viewBox="0 0 81 81" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M49.6768 9.31236V2.68228C49.6768 2.02914 49.146 1.5 48.4918 1.5H34.5281C33.8735 1.5 33.3431 2.02914 33.3431 2.68228V9.31236C33.3431 9.83518 32.9983 10.2952 32.4964 10.4449C30.426 11.0617 28.4454 11.8862 26.5784 12.8936C26.1188 13.1415 25.5508 13.0558 25.1816 12.6874L20.481 7.9978C20.0183 7.53618 19.2678 7.53618 18.8051 7.9978L8.93175 17.8481C8.46905 18.3098 8.46905 19.0585 8.93175 19.5201L13.6323 24.2097C14.0016 24.5781 14.0875 25.1452 13.8389 25.6032C12.8292 27.4659 12.0028 29.4423 11.3846 31.5075C11.2345 32.0086 10.7734 32.3522 10.2494 32.3522H3.60301C2.94835 32.3522 2.41797 32.8813 2.41797 33.5345V47.4655C2.41797 48.1187 2.94835 48.6478 3.60301 48.6478H10.2486C10.7726 48.6478 11.2338 48.9918 11.3838 49.4925C12.002 51.5581 12.8285 53.5341 13.8382 55.3968C14.0867 55.8552 14.0008 56.4219 13.6315 56.7903L8.93095 61.4799C8.46826 61.9415 8.46826 62.6902 8.93095 63.1519L18.8043 73.0022C19.267 73.4638 20.0175 73.4638 20.4802 73.0022L25.1808 68.3126C25.5501 67.9441 26.1184 67.8585 26.5776 68.1064C28.4446 69.1138 30.4256 69.9383 32.4957 70.5551C32.9979 70.7048 33.3423 71.1648 33.3423 71.6876V78.3177C33.3423 78.9709 33.8727 79.5 34.5273 79.5H48.491C49.1456 79.5 49.676 78.9705 49.676 78.3177V71.6876" stroke="#1A1A1A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M37.2891 64.3588V32.7" stroke="#1A1A1A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M37.2891 23.9823V18.4764" stroke="#1A1A1A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M49.6777 64.3588V59.3118" stroke="#1A1A1A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M49.6777 50.1353V18.4764" stroke="#1A1A1A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M62.0645 64.3588V41.8765" stroke="#1A1A1A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M62.0645 33.1588V18.4764" stroke="#1A1A1A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M74.4531 64.3588V29.947" stroke="#1A1A1A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M74.4531 21.6882V18.4764" stroke="#1A1A1A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M41.4188 23.9824H32.7012V32.7001H41.4188V23.9824Z" stroke="#1A1A1A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M53.8055 50.1353H45.0879V59.3117H53.8055V50.1353Z" stroke="#1A1A1A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M66.1942 33.1588H57.4766V41.8765H66.1942V33.1588Z" stroke="#1A1A1A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M78.5829 21.6882H69.8652V29.9471H78.5829V21.6882Z" stroke="#1A1A1A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
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
  border: 1px solid #e5e5e5;
}
.block img {
    width: auto;
    height: auto;
}
.block h3 {
    font-size: 16px;
    font-weight: 700;
    color: #1A1A1A;
}
.block h6 {
    font-size: 13px;
    font-weight: 400;
    color: #1A1A1A80;
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
