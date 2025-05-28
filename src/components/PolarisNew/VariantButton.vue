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
    fullWidth: {
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
    :class="[
      `button-${variant}`,
      {
        'disabled': disabled,
         'button-fullwidth': fullWidth
      }
    ]"
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
  justify-content: center;
  height: 28px !important;
  align-items: center !important;
  gap: 8px !important;
  padding: 4px 12px !important;
  text-decoration: none !important;
  font-size: 13px !important;
  font-weight: 450 !important;
  color: rgb(74, 74, 74);
}

.button:hover {
  background-color: #0000000d !important;
  border-radius: 8px !important;
}

.button-primary {
  padding: 6px 12px;
  background-color: #303030;
  background-image: linear-gradient(
      #30303000 63.53%,
      #ffffff26
  );
  color: #ffffff;
  border-bottom-color: #ffffff;
  border-radius: 8px;
  text-decoration: none;
  font-size: 13px;
  font-weight: 650;
  box-shadow:
      #000000cc 0 -1px 0 1px inset,
      #303030 0 0 0 1px inset,
      #ffffff40 0 0.5px 0 1.5px inset;
}

.button-primary:hover {
  background-color: #1a1a1a !important;
}

.button-primary:active,
.button-primary.disabled,
.button-secondary:active,
.button-secondary.disabled {
  background-color: #cccccc !important;
  box-shadow: 0 2px 1px 0 #1a1a1a33 inset;
}

.button-secondary {
  background-color: #ffffff !important;
  color: #000000 !important;
  border-radius: 8px !important;
  box-shadow:
      #e3e3e3 0 1px 0 0 inset,
      #e3e3e3 1px 0 0 0 inset,
      #e3e3e3 -1px 0 0 0 inset,
      #b5b5b5 0 -1px 0 0 inset;
}

.button-secondary:hover {
  background-color: #fafafa !important;
}

.button.button-fullwidth {
  width: 100% !important;
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
