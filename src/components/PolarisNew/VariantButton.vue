<script>
export default {
  name: "VariantButton",
  props: {
    variant: {
      type: String,
      required: true,
      default() {
        return "primary";
      },
    },
    additionalText: {
      type: String,
      required: false,
    },
  },
  methods: {
    handleClick() {
      event.preventDefault();
      this.$emit("click", event);
    },
  },
};
</script>

<template>
  <a
    href="#"
    @click="handleClick"
    class="button"
    :class="`button-${variant}`"
  >
    <slot></slot>
    <span
      :class="`additional-info-${variant}`"
      v-if="additionalText"
    >
      {{ additionalText }}
    </span>
  </a>
</template>

<style scoped>
.button {
  display: flex;
  height: 32px;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  text-decoration: none;
  font-size: 12px;
  font-weight: 600;
}
.button-primary {
  background-color: rgb(48, 48, 48);
  background-image: linear-gradient(
      rgba(48, 48, 48, 0) 63.53%,
      rgba(255, 255, 255, 0.15)
    ),
    none;
  color: white;
  border-bottom-color: rgb(255, 255, 255);
  box-shadow: rgba(0, 0, 0, 0.8) 0px -1px 0px 1px inset,
    rgb(48, 48, 48) 0px 0px 0px 1px inset,
    rgba(255, 255, 255, 0.25) 0px 0.5px 0px 1.5px inset;
  border-radius: 8px;
}
.button-secondary {
  color: black;
  /* Add any other styling for the secondary button */
}
.additional-info-primary {
  background-color: #656565;
  color: white;
  padding: 0px 6px;
  border-radius: 6px;
  font-weight: 550;
}
.additional-info-secondary {
  background-color: #e3e3e3;
  color: #616161;
  padding: 0px 6px;
  border-radius: 6px;
  font-weight: 550;
}
</style>
