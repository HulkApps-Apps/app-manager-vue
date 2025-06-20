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
    loading: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  methods: {
    handleClick(event) {
      event.preventDefault();
      this.$emit("click", event);
    },
    handlePlanClick(event) {
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
        'button-fullwidth': fullWidth,
        'loading': loading
      }
    ]"
  >
    <div v-if="loading" class="Polaris-Spinner Polaris-Spinner--sizeSmall">
      <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.229 1.173a9.25 9.25 0 1011.655 11.412 1.25 1.25 0 10-2.4-.698 6.75 6.75 0 11-8.506-8.329 1.25 1.25 0 10-.75-2.385z" />
      </svg>
    </div>
    <div :class="{ 'invisible': loading }">
      <slot></slot>
    </div>
    <span
      :class="[
        `additional-info-${variant}`,
        { 'invisible': loading }
      ]"
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
  position: relative;
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
  color: #ffffff !important;
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
  color: #4A4A4A !important;
  padding: 0px 6px !important;
  border-radius: 8px !important;
  font-size: 13px !important;
  font-weight: 550 !important;
}

.additional-info-secondary {
  background-color: rgba(0, 0, 0, 0.06) !important;
  color: #4A4A4A !important;
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

.invisible {
  visibility: hidden;
}

.loading {
  cursor: wait !important;
  position: relative;
}

.Polaris-Spinner {
  animation: spin 1s linear infinite;
  width: 20px;
  height: 20px;
  position: absolute;
}

.Polaris-Spinner svg {
  fill: currentColor;
}

.button-primary .Polaris-Spinner svg {
  fill: #ffffff;
}

.button-secondary .Polaris-Spinner svg {
  fill: #000000;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.Polaris-Spinner {
  animation: spin 500ms linear infinite, fade 320ms ease-in;
}

@keyframes fade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
