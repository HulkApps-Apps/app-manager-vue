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
    getPlanUrl: {
      type: Function,
      required: false,
    },
    plan: {
      type: Object,
      required: false,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  methods: {
    handleClick() {
      event.preventDefault();
      this.$emit("click", event);
    },
    handlePlanClick() {
      event.preventDefault();
      this.$emit("plan-clicked", event);
    },
    translateMe(message) {
      return this.$translations.hasOwnProperty(message)
        ? this.$translations[message]
        : message;
    },
  },
};
</script>

<template>
  <a
    href="#"
    @click="handleClick"
    class="button"
    :class="`button-${variant}` + (disabled ? ' disabled' : '')"
  >
    <slot></slot>
    <span
      :class="`additional-info-${variant}`"
      v-if="additionalText"
    >
      {{ translateMe(additionalText) }}
    </span>
  </a>
</template>

<style scoped>
.button, .button:hover {
  display: flex;
  height: 32px !important;
  align-items: center !important;
  gap: 8px !important;
  padding: 6px 12px !important;
  text-decoration: none !important;
  font-size: 12px !important;
  font-weight: 600 !important;
}
.button-primary, .button-primary:hover {
  background-color: rgb(48, 48, 48) !important;
  background-image: linear-gradient(
      rgba(48, 48, 48, 0) 63.53%,
      rgba(255, 255, 255, 0.15)
    ),
    none !important;
  color: white !important;
  border-bottom-color: rgb(255, 255, 255) !important;
  box-shadow: rgba(0, 0, 0, 0.8) 0px -1px 0px 1px inset,
    rgb(48, 48, 48) 0px 0px 0px 1px inset,
    rgba(255, 255, 255, 0.25) 0px 0.5px 0px 1.5px inset !important;
  border-radius: 8px !important;
}
.button-secondary {
  color: black !important;
}
.additional-info-primary {
  background-color: #656565 !important;
  color: white !important;
  padding: 0px 6px !important;
  border-radius: 6px !important;
  font-weight: 550 !important;
}
.additional-info-secondary {
  background-color: #e3e3e3 !important;
  color: #616161 !important;
  padding: 0px 6px !important;
  border-radius: 6px !important;
  font-weight: 550 !important;
}
.disabled {
  background-color: rgb(120, 120, 120) !important;
  color: white !important;
  cursor: not-allowed !important;
  pointer-events: none !important;
}
</style>
