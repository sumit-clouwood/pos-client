<template>
  <div v-if="orderSource === 'backend'">
    <div class="button">
      <div class="template-btn">
        <div class="pay-now">
          <pay class="pay-btn-holder" @pay="payNow"></pay>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="isPermitted(PERMISSIONS.CARHOP_USER)">
    <div class="button">
      <div class="template-btn">
        <div class="pay-now abc">
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
</template>
<script>
/* global $ clickPayNow */
import { mapState } from 'vuex'
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
    ...mapState('order', ['items', 'orderSource']),
  },
  methods: {
    payNow() {
      clickPayNow()
    },
    placeCarhop() {
      if (this.processing) {
        return false
      }

      this.processing = true

      if (this.items.length === 0) {
        return false
      }
      if (this.processing) {
        // eslint-disable-next-line no-console
        console.log('dual footer click')
        return false
      }

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
    },
  },
}
</script>
