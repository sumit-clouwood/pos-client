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
      this.$store.dispatch('order/startOrder')
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
<style lang="scss">
@import '@/assets/scss/pixels_rem.scss';
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';

@include responsive(mobile) {
  .wrappers-orders {
    display: grid;
    grid-template-columns: 1fr max-content max-content;
    grid-gap: 20px;
    align-items: center;
    height: 65px;
    margin: 0;
    padding: 0 10px;
    margin-bottom: 10px;

    .orders-name {
      width: auto;
    }

    .aed-amt {
      width: auto;
    }

    .dlt-btn {
      width: auto;
      i {
        color: $red;
      }
    }
  }
}
</style>
