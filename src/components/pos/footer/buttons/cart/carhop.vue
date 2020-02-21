<template>
  <div v-if="(orderSource === 'backend' || selectedOrder) && !isCarhop()">
    <div class="button">
      <div class="template-btn">
        <div class="pay-now">
          <pay class="pay-btn-holder" @pay="payNow"></pay>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <div class="button">
      <div class="template-btn">
        <div class="pay-now">
          <save class="pay-btn-holder" @save="placeCarhop"></save>
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
/* global clickPayNow */
import CheckoutMixin from '@/mixins/Checkout'

import { mapState, mapGetters } from 'vuex'
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
    ...mapState('order', ['items', 'orderSource', 'selectedOrder']),
    ...mapGetters('auth', ['carhop']),
  },
  methods: {
    payNow() {
      clickPayNow()
    },
    placeCarhop() {
      if (this.items.length === 0) {
        return false
      }

      this.executePayment({ action: 'carhop-place-order' })
    },
  },
}
</script>
