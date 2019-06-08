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
    <div class="dlt-btn" @click="dropHoldOrder(orderData)">
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
      $('.wrappers-order-block').toggleClass('show')
      $('.main-orders-list').toggleClass('hide')
      $('ul.ullist-icons > li#hold-order-box').toggleClass('active')
    },

    dropHoldOrder: function(order) {
      let actionDetails = {
        id: order._id,
        action: 'delete',
        model: 'orders',
        data: '',
      }
      if (confirm('Are you sure you want to delete this order!')) {
        this.$store.dispatch('customer/updateAction', actionDetails)
      }
    },
  },
}
</script>
