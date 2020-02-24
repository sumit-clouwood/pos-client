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
    <div v-if="orderSource != 'backend'" class="carhop-cart-buttons">
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
    ...mapState('order', ['items', 'orderSource', 'selectedOrder']),
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
      if (this.processing) {
        // eslint-disable-next-line no-console
        console.log('dual footer click')
        return false
      }
      this.$store.commit('checkoutForm/SET_PROCESSING', true)

      if (this.items.length === 0) {
        return false
      }
      let action = 'carhop-place-order'
      if (this.selectedOrder && this.orderSource != 'backend') {
        action = 'carhop-update-order'
      }

      $('#payment-msg').modal('show')
      this.$store.dispatch('order/startOrder')
      this.$store.commit('checkoutForm/SET_PROCESSING', true)
      this.$store
        .dispatch('checkout/pay', { action: action })
        .then(() => {})
        .catch(() => {})
        .finally(() => {
          this.$store.commit('checkoutForm/SET_PROCESSING', false)
        })
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
