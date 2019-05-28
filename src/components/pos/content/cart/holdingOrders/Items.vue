<template>
  <div class="wrappers-orders">
    <div class="orders-name">
      <p @click="setHoldOrderCart(orderData)" class="cursor-pointer">
        {{ orderData.order_no }}
      </p>
    </div>
    <div class="aed-amt">
      <span>{{ orderData.currency }} {{ orderData.balance_due }}</span>
    </div>
    <div class="dlt-btn">
      <img src="img/pos/delete-icon.svg" alt="delete" />
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
/* global $ */
export default {
  name: 'Items',
  props: {
    orderData: Object,
  },
  methods: {
    setHoldOrderCart: function(orderData) {
      this.$store.dispatch('holdOrders/fetchOrder', orderData)
      $('.holding-order-panel').toggle()
      $('.order-wrappers-panel').toggle()
      $('ul.ullist-icons > li#hold-order-box').toggleClass('active')
    },
  },
}
</script>
