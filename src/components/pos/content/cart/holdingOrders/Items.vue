<template>
  <div class="wrappers-orders">
    <div
      class="orders-name cursor-pointer"
      @click="setHoldOrderCart(orderData)"
    >
      <p>
        {{ orderData.order_no }}
      </p>
    </div>
    <div class="aed-amt">
      <span>{{ formatPrice(orderData.balance_due || 0) }}</span>
    </div>
    <div class="dlt-btn" @click="dropHoldOrder({ orderData: orderData })">
      <img src="img/pos/delete-icon.svg" alt="delete" />
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
/* global $ */
import { mapGetters, mapState } from 'vuex'
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
    },

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
