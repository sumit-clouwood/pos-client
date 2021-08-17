<template>
  <div class="dropdown">
    <button
      class="button btn btn-success color-main color-text-invert dropdown-toggle"
      type="button"
      id="dropdownMenuButton"
      @click="getOrderDetails(orderId)"
      data-toggle="dropdown"
      aria-haspopup="true"
      aria-expanded="false"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="19"
        viewBox="0 0 22 19"
      >
        <g fill="#fff" fill-rule="nonzero">
          <path
            d="M2.68 7.096c0-2.825-.274-2.568 1.51-2.568V1.113c0-.53.438-.963.968-.963h11.684c.53 0 .967.433.967.963v3.415c1.785 0 1.511-.257 1.511 2.568.832 0 2.44-.26 2.44.95v5.993a.96.96 0 0 1-.963.946h-2.988v2.832a.971.971 0 0 1-.967.963H5.158a.971.971 0 0 1-.967-.963v-2.832H1.203a.96.96 0 0 1-.964-.946V8.046c0-.527.44-.95.964-.95H2.68zM3.702 5.55v1.546h.489V5.55h-.489zm14.596 0h-.489v1.546h.489V5.55zm-.489 7.425v.987h2.93V8.12H1.261v5.843H4.19c0-.499-.177-1.951.967-1.951h11.684c.593 0 .964.596.964.964h.003zm-1.022 4.78l-.007-4.718H5.217l-.004 4.717h11.574zM5.213 1.171v5.924h11.574V1.172H5.213z"
          />
          <path
            d="M17.518 9.8c-.672 0-.672-1.023 0-1.023h1.643c.676 0 .676 1.023 0 1.023h-1.643z"
          />
        </g>
      </svg>
      {{ _t(printing) }}
    </button>
    <div
      class="dropdown-menu dropdown-menu-right v_hide"
      :class="[
        {
          'animate slideIn':
            selectedOrder.invoice && selectedOrder.invoice.length <= 1,
        },
      ]"
      aria-labelledby="dropdownMenuButton"
    >
      <a
        class="dropdown-item"
        role="button"
        v-for="(template, index) in selectedOrder.invoice"
        :key="index"
        @click="
          printInvoice({
            templateId: template._id,
            order: selectedOrder,
          })
        "
        >{{ template.name }}</a
      >
    </div>
  </div>
</template>
<script>
import { mapActions, mapState, mapGetters } from 'vuex'
/* global $ */
export default {
  name: 'PrintAction',
  data() {
    return {
      printing: 'Print',
    }
  },
  props: {
    orderId: String,
  },
  computed: {
    ...mapState('order', ['selectedOrder']),
    ...mapGetters('location', ['_t']),
  },
  methods: {
    ...mapActions('deliveryManager', ['printInvoice']),
    ...mapActions('order', ['selectedOrderDetails']),
    getOrderDetails(orderId) {
      this.printing = 'Wait'
      this.selectedOrderDetails(orderId).then(() => {
        if (this.selectedOrder.invoice.length === 1) {
          this.printInvoice({
            templateId: this.selectedOrder.invoice[0]._id,
            order: this.selectedOrder,
          })
          this.printing = 'Print'
        } else {
          $('.dropdown-menu-right').removeClass('v_hide')
          this.printing = 'Print'
        }
      })
    },
  },
}
</script>
<style scoped lang="scss">
.v_hide {
  visibility: hidden;
}
.v_show {
  visibility: visible;
}
#dropdownMenuButton {
  svg {
    height: 1.25rem;
    width: 1.5rem;
    vertical-align: middle;
    margin-right: 0.125rem;
  }
}
</style>
