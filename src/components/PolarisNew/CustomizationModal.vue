<template>
  <transition name="modal-fade">
    <div v-if="visible" class="customization-modal modal-overlay" @click.self="onCancel">
      <div class="modal-container" tabindex="0" @keydown.esc="onCancel">
        <div class="modal-header">
          <h2 class="modal-title">{{ title }}</h2>
          <button class="close-button" @click="onCancel">
            <svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4L4 12" stroke="currentColor" stroke-width="1" />
              <path d="M4 4L12 12" stroke="currentColor" stroke-width="1" />
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="grid">
            <div
                v-for="(item, index) in items"
                :key="index"
                class="card"
                :class="{ selected: selectedIndex === index }"
                @click="selectItem(index)"
            >
              <div v-if="item.icon" class="icon">
                <svg width="51" height="52" viewBox="0 0 51 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_840_1701)">
                    <path d="M10.625 9H19.125L23.375 19.625L18.0625 22.8125C20.3383 27.427 24.073 31.1617 28.6875 33.4375L31.875 28.125L42.5 32.375V40.875C42.5 42.0022 42.0522 43.0832 41.2552 43.8802C40.4582 44.6772 39.3772 45.125 38.25 45.125C29.9609 44.6213 22.1428 41.1013 16.2708 35.2292C10.3987 29.3572 6.87873 21.5391 6.375 13.25C6.375 12.1228 6.82277 11.0418 7.6198 10.2448C8.41683 9.44777 9.49783 9 10.625 9Z" stroke="#303030" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M31.875 15.375C33.0022 15.375 34.0832 15.8228 34.8802 16.6198C35.6772 17.4168 36.125 18.4978 36.125 19.625" stroke="#303030" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M31.875 6.875C35.2565 6.875 38.4995 8.2183 40.8906 10.6094C43.2817 13.0005 44.625 16.2435 44.625 19.625" stroke="#303030" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_840_1701">
                      <rect width="51" height="51" fill="white" transform="translate(0 0.5)"/>
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <strong>{{ item.title }}</strong>
              <div v-if="item.price" class="price">${{ item.price }}</div>
              <p class="description">{{ item.description }}</p>
              <a v-if="item.demo" :href="item.demo" class="demo-link" target="_blank">View demo</a>
              <VariantButton variant="secondary" :full-width="true">
                {{ item.buttonText || (item.price ? "Select" : "Schedule a Call") }}
              </VariantButton>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <span class="total">
            <span>Total:</span> ${{ total }}
          </span>
          <VariantButton variant="primary">Submit</VariantButton>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import VariantButton from "@/components/PolarisNew/VariantButton.vue";

export default {
  name: "CustomizationModal",
  components: {VariantButton},
  props: {
    visible: Boolean,
    title: {
      type: String,
      default: "Book A Call",
    },
  },
  data() {
    return {
      selectedIndex: null,
      items: [
        {
          title: "Options Block on Collection Page",
          price: 199,
          description: "Lorem ipsum description for section",
          demo: "#",
        },
        {
          title: "Accordion Setup",
          price: 79,
          description: "Lorem ipsum description for section",
          demo: "#",
        },
        {
          title: "Step-by-Step Product Form",
          price: 129,
          description: "Lorem ipsum description for section",
          demo: "#",
        },
        {
          title: "Swatches with Drawer",
          price: 199,
          description: "Lorem ipsum description for section",
          demo: "#",
        },
        {
          title: "Options Block Customization",
          price: 79,
          description: "Lorem ipsum description for section",
          demo: "#",
        },
        {
          title: "Font Preview Block",
          price: 99,
          description: "Lorem ipsum description for section",
          demo: "#",
        },
        {
          title: "Didn't Find What You're Looking For?",
          description: "Discuss with our experts!",
          icon: true,
          buttonText: "Schedule a Call",
        },
      ],
    };
  },
  computed: {
    total() {
      const selected = this.items[this.selectedIndex];
      return selected && selected.price ? selected.price : 0;
    },
  },
  methods: {
    selectItem(index) {
      this.selectedIndex = index;
    },
    onCancel() {
      this.$emit("cancel");
    },
    onSubmit() {
      this.$emit("submit", this.items[this.selectedIndex] || null);
    },
  },
};
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
}

.customization-modal.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.customization-modal .modal-container {
  background: #fff;
  width: 90%;
  max-width: 960px;
  border-radius: 10px;
  overflow: hidden;
  outline: none;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.customization-modal .modal-header {
  padding: 12px 16px;
  background: #F3F3F3;
  border-bottom: 1px solid #E3E3E3;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.customization-modal .modal-title {
  margin: 0;
  font-size: 13px;
  line-height: 20px;
  font-weight: 600;
}

.customization-modal .close-button {
  border: none;
  cursor: pointer;
  position: absolute;
  top: calc(50% + 2px);
  transform: translateY(-50%);
  right: 10px;
  background: #F3F3F3;
}

.customization-modal .modal-body {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

.customization-modal .grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 32px 44px;
}

.customization-modal .card {
  border: 1px solid #dcdcdc;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  transition: border 0.2s;
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 6px;
}

.customization-modal .card.selected,
.card:hover {
  box-shadow:
      #e3e3e3 0 1px 0 0 inset,
      #e3e3e3 1px 0 0 0 inset,
      #e3e3e3 -1px 0 0 0 inset,
      #b5b5b5 0 -1px 0 0 inset;
}

.customization-modal .card .price {
  font-weight: 500;
  font-size: 20px;
  line-height: 28px;
  letter-spacing: 0;
}

.customization-modal .card .description {
  font-weight: 400;
  font-size: 13px;
  line-height: 20px;
  letter-spacing: 0;
  text-align: center;
}

.customization-modal .card .demo-link {
  font-weight: 400;
  font-size: 13px;
  line-height: 20px;
  letter-spacing: 0;
  text-align: center;
  color: #0094D5;
  text-decoration: none;
}

.customization-modal .card .action-btn {
  margin-top: auto;
  border: 1px solid #dcdcdc;
  background: #fff;
  border-radius: 6px;
  padding: 8px;
  cursor: pointer;
}

.customization-modal .icon img {
  height: 36px;
  margin-bottom: 8px;
}

.customization-modal .modal-footer {
  border-top: 1px solid #E3E3E3;
  padding: 12px 16px;
  display: flex;
  gap: 8px;
  justify-content: right;
  align-items: center;
}

.customization-modal .total {
  font-weight: 500;
  font-size: 13px;
  line-height: 20px;
  letter-spacing: 0;
  text-align: center;
  color: #00000080;
}

.customization-modal .total span {
  font-weight: 700;
  color: #000000;
}

</style>
