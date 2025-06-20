<template>
  <div
    class="polaris-tooltip-wrapper"
    @mouseenter="show = true"
    @mouseleave="show = false"
    @focusin="show = true"
    @focusout="show = false"
    @click="handleTap"
    tabindex="0"
  >
    <slot />
    <transition name="fade">
      <div v-if="show" class="polaris-tooltip-content" role="tooltip">
        <span>{{ text }}</span>
        <div class="polaris-tooltip-arrow"></div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'CustomTooltip',
  props: {
    text: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      show: false
    };
  },
  mounted() {
    document.addEventListener('touchstart', this.handleOutsideTap, true);
    document.addEventListener('mousedown', this.handleOutsideTap, true);
  },
  beforeUnmount() {
    document.removeEventListener('touchstart', this.handleOutsideTap, true);
    document.removeEventListener('mousedown', this.handleOutsideTap, true);
  },
  methods: {
    isMobile() {
      return window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    },
    handleTap(event) {
      if (this.isMobile()) {
        this.show = !this.show;
        event.stopPropagation();
      }
    },
    handleOutsideTap(event) {
      if (!this.$el.contains(event.target)) {
        this.show = false;
      }
    }
  }
};
</script>

<style scoped>
.polaris-tooltip-wrapper {
  display: block;
  width: 100%;
  position: relative;
}
.polaris-tooltip-content {
  position: absolute;
  left: 0;
  bottom: 100%;
  top: auto;
  margin-bottom: 8px;
  width: 100%;
  min-width: 0;
  max-width: none;
  background: #fff;
  color: #1A1A1A;
  font-size: 13px;
  font-weight: 400;
  padding: 8px 12px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(23,24,24,0.15);
  z-index: 1002;
  white-space: pre-line;
  word-break: break-word;
  overflow-wrap: break-word;
  text-align: left;
  transition: opacity 0.2s;
}
.polaris-tooltip-arrow {
  position: absolute;
  left: 16px;
  top: 100%;
  bottom: auto;
  transform: translateX(0);
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid #fff;
  filter: drop-shadow(0 2px 2px rgba(23,24,24,0.08));
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style> 