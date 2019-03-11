<template>
  <div id="total-order-wrap" class="total-order">
    <div class="order-notes">
      <p class="notes-title">NOTES</p>
      <p>
        {{ orderNotes }}
      </p>
    </div>
    <div class="order-confirm-amt" id="total-confirm-order">
      <div class="order-amt-title">
        <p>SUBTOTAL :</p>
        <p>SURCHARGE :</p>
        <p>ORDER DISCOUNT :</p>
        <p>TAX :</p>
        <p>BILL AMOUNT :</p>
      </div>
      <div class="order-amt-charges">
        <p>{{ formatPrice(subTotal || 0) }}</p>
        <p>{{ formatPrice(surcharge || 0) }}</p>
        <p>{{ formatPrice(orderDiscountWithoutTax || 0) }}</p>
        <p>{{ formatPrice(totalTax || 0) }}</p>
        <p>{{ formatPrice(orderTotal || 0) }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'SendToDeliveryContentPaymentDetails',
  props: {},
  computed: {
    ...mapState({
      orderNotes: state => state.order.orderNote,
    }),
    ...mapGetters('order', ['orderTotal', 'subTotal']),
    ...mapGetters('tax', ['totalTax']),
    ...mapGetters('surcharge', ['surcharge']),
    ...mapGetters('location', ['formatPrice']),
    ...mapGetters('discount', ['orderDiscountWithoutTax']),
  },
}
</script>
