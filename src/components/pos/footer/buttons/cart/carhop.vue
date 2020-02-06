<template>
  <!-- <div v-if="isPayAction">
    <div class="button">
      <div class="template-btn">
        <div class="pay-now">
          <pay class="pay-btn-holder" @pay="payNow"></pay>
        </div>
      </div>
    </div>
  </div> -->
  <!-- <div v-else> -->
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
  </div>
  <!-- </div> -->
</template>
<script>
/* global $ clickPayNow */
import { mapState, mapGetters } from 'vuex'
import save from './common/save'
import pay from './common/pay'
export default {
  name: 'CarhopBtn',
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
      if (this.processing) {
        // eslint-disable-next-line no-console
        console.log('dual footer click')
        return false
      }
      this.$store.commit('checkoutForm/SET_PROCESSING', true)

      if (this.items.length === 0) {
        return false
      }

      if (this.orderSource === 'backend' && this.selectedOrder) {
        $('#modificationReason').modal('show')
      } else {
        $('#payment-msg').modal('show')
        this.$store.dispatch('order/startOrder')
        this.$store.commit('checkoutForm/SET_PROCESSING', true)
        this.$store
          .dispatch('checkout/pay', { action: 'carhop-place-order' })
          .then(() => {})
          .catch(() => {})
          .finally(() => {
            this.$store.commit('checkoutForm/SET_PROCESSING', false)
          })
      }
    },
  },
}
</script>
