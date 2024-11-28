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
.button {
  display: flex;
  width: fit-content !important;
  height: 28px !important;
  align-items: center !important;
  gap: 8px !important;
  padding: 4px 12px !important;
  text-decoration: none !important;
  font-size: 13px !important;
  font-weight: 450 !important;
  color: rgb(74, 74, 74) !important;
}
.button:hover {
  background-color: #0000000d !important;
  border-radius: 8px !important;
}
.button-primary {
  background-color: #f2f2f2 !important;
  color: #303030 !important;
  border-radius: 8px !important;
}
.button-primary:hover {
  background-color: #f6f6f6 !important;  
}
.button-primary:active {
  background-color: #f2f2f2 !important;
}
.button-secondary {
  color: black !important;
}
.additional-info-primary {
  background-color: rgba(0, 0, 0, 0.06) !important;
  color: #616161 !important;
  padding: 0px 6px !important;
  border-radius: 8px !important;
  font-size: 13px !important;
  font-weight: 550 !important;
}
.additional-info-secondary {
  background-color: rgba(0, 0, 0, 0.06) !important;
  color: #616161 !important;
  padding: 0px 6px !important;
  border-radius: 8px !important;
  font-weight: 550 !important;
}
.disabled {
  background-color: rgba(0, 0, 0, 0.15) !important;
  font-size: 13px !important;
  font-weight: 450 !important;
  color: rgb(74, 74, 74) !important;
  cursor: not-allowed !important;
  pointer-events: none !important;
}
</style>
