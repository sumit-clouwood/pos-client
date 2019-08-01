<template>
  <div class="wrappers-orders color-dashboard-background">
    <div
      class="orders-name cursor-pointer color-text"
      @click="setHoldOrderCart(orderData)"
    >
      <p class="color-text">
        {{ orderData.order_no }}
      </p>
    </div>
    <div class="aed-amt">
      <span class="color-text">{{
        formatPrice(orderData.balance_due || 0)
      }}</span>
    </div>
    <div class="dlt-btn" @click="dropHoldOrder({ orderData: orderData })">
      <i class="fa fa-trash color-text-invert"></i>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
/* global $ */
import { mapGetters, mapState, mapActions } from 'vuex'
export default {
  name: 'Items',
  props: {
    orderData: Object,
  },
  computed: {
    ...mapGetters('location', ['formatPrice', '_t']),
    ...mapState('checkoutForm', ['msg']),
  },
  methods: {
    setHoldOrderCart: function(orderData) {
      this.$store.commit('order/SET_CART_TYPE', 'new')
      this.$store.dispatch('holdOrders/fetchOrder', orderData)
      if (orderData.customer != null) {
        this.updateModalSelectionDelivery('#order-confirmation')
      }
    },
    ...mapActions('location', ['updateModalSelectionDelivery']),

    dropHoldOrder: function(data) {
      $('#payment-msg').modal('show')
      let msgStr = this._t('Are you really want to delete this record?')
      this.$store.commit(
        'checkoutForm/SET_MSG',
        {
          result: 'confirm',
          message: msgStr,
          record: data.orderData,
          flag: 'hold order',
        },
        {
          root: true,
        }
      )
    },
  },
}
</script>
