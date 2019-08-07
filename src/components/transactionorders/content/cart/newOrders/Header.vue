<template>
  <div class="transaction-cart">
    <div class="transaction-payment">
      <div class="trans-cash-payment">

      </div>
      <div class="trans-cash-price">

      </div>
    </div>
  </div>
</template>

<script>
/* global $ */
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  name: 'Header',
  props: {},

  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState('order', ['items', 'cartType']),
    ...mapState('checkoutForm', ['msg']),
    ...mapState({ selectedCustomer: state => state.customer.customer }),
  },
  methods: {
    removeSelectedCustomer() {
      this.$store.commit('location/SET_MODAL', '#manage-customer')
      this.$store.dispatch('customer/resetCustomer')
    },
    hold() {
      $('#holdorder').hide()
      this.$store
        .dispatch('checkout/pay', { action: 'on-hold' })
        .then(() => {
          if (this.msg) {
            $('#payment-msg').modal('show')
          }
          setTimeout(function() {
            $('#payment-screen-footer').prop('disabled', false)
          }, 1000)
        })
        .catch(() => {
          setTimeout(() => {
            $('#payment-msg').modal('hide')
            $('#payment-screen-footer').prop('disabled', false)
          }, 500)
        })
    },
    ...mapActions('checkout', ['orderOnHold']),
  },
}
</script>
<style lang="sass" scoped>
.hide
  display : none
</style>
