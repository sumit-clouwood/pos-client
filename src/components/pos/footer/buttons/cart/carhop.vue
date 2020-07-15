<template>
  <div v-if="isCarhop()">
    <div class="button">
      <div class="template-btn">
        <div class="pay-now">
          <save class="pay-btn-holder" @save="placeCarhop"></save>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <div
      v-if="orderSource != 'backend'"
      style="grid-template-columns: 1fr 1fr; display: grid; column-gap: 10px;"
    >
      <div class="button">
        <div class="template-btn">
          <div class="pay-now">
            <pay class="pay-btn-holder" @pay="payNow"></pay>
          </div>
        </div>
      </div>
      <div class="button">
        <div class="template-btn">
          <div class="pay-now">
            <save class="pay-btn-holder" @save="placeCarhop"></save>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="button">
        <div class="template-btn">
          <div class="pay-now">
            <pay class="pay-btn-holder" @pay="payNow"></pay>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- <div v-else>
    <div style="grid-template-columns: 1fr 1fr; display: grid;">
      <div class="button">
        <div class="template-btn">
          <div class="pay-now">
            <pay class="pay-btn-holder" @pay="payNow"></pay>
          </div>
        </div>
      </div>
      <div class="button">
        <div class="template-btn">
          <div class="pay-now">
            <save class="pay-btn-holder" @save="placeCarhop"></save>
          </div>
        </div>
      </div>
    </div>
  </div> -->
</template>
<script>
/* global clickPayNow showModal */
import CheckoutMixin from '@/mixins/Checkout'

import { mapState } from 'vuex'
import save from './common/save'
import pay from './common/pay'
export default {
  name: 'CarhopBtn',
  mixins: [CheckoutMixin],
  components: {
    save,
    pay,
  },
  computed: {
    ...mapState('checkoutForm', ['processing']),
    ...mapState('order', [
      'items',
      'orderSource',
      'selectedOrder',
      'needSupervisorAccess',
    ]),
  },
  methods: {
    payNow() {
      if (this.$store.state.mobile.device === 'mobile') {
        this.$store.dispatch('paymentMethodsChange')
      } else {
        clickPayNow()
      }
    },
    placeCarhop() {
      if (this.items.length === 0) {
        return false
      }
      let action = 'carhop-place-order'
      if (this.selectedOrder && this.orderSource != 'backend') {
        action = 'carhop-update-order'
        this.$store.commit('checkoutForm/setAction', 'add')
      }
      if (this.needSupervisorAccess) {
        showModal('#modificationReason')
      } else {
        this.executePayment({ action: action })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/mixins.scss';
.carhop-cart-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  @include responsive(mobile) {
    grid-gap: 10px !important;
    font-size: 15px;
    font-weight: 500;
  }
}
</style>
