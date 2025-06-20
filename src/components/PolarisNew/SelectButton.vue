<script>
export default {
  name: "SelectButton",
  props: {
    variant: {
      type: String,
      required: true,
      default() {
        return "primary";
      },
    }
  },
  methods: {
    handleClick() {
      event.preventDefault();
      this.$emit("click", event);
    },
    handlePlanClick() {
      event.preventDefault();
      this.$emit("plan-clicked", event);
    }
  },
};
</script>

<template>
  <a
    @click="handleClick"
    class="button"
    :class="`button-${variant}`"
  >
    <slot></slot>
</a>
</template>

<style scoped>
.button {
  display: flex;
  width: fit-content !important;
  height: 28px !important;
  align-items: center !important;
  padding: 4px 12px !important;
  text-decoration: none !important;
  font-size: 13px !important;
  font-weight: 450 !important;
  color: rgb(74, 74, 74) !important;
  border-radius: 40px !important;
  transition: all 0.3s !important;
}
.button:hover {
  background-color: #0000000d !important;
  border-radius: 8px !important;
}
.button-primary {
  background-color: #3F3F3F !important;
  color: #FAFAFA !important;
}
.button-primary:hover {
    cursor: pointer !important;
  background-color: rgba(0, 0, 0, 0.5) !important;
  border-radius: 40px !important;
}
.button-secondary {
  color: #1A1A1A !important;
  background-color: none;
}
.button-secondary:hover {
    cursor: pointer !important;
    background-color: rgba(0, 0, 0, 0.08) !important;
    border-radius: 40px !important;
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
  background-color: rgba(0, 0, 0, 0.08) !important;
  font-size: 13px !important;
  font-weight: 450 !important;
  color: rgb(74, 74, 74) !important;
  cursor: not-allowed !important;
  pointer-events: none !important;
}
</style>
