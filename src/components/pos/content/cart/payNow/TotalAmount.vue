<template>
  <div id="total-amount">
    <div class="payment-amount-title">
      <p class="tip-amopunt">Tip Amount</p>
      <p class="total-amt">Total Amount</p>
    </div>
    <div class="payment-amount-digit">
      <p>AED 20.00</p>
      <h2>{{ formatPrice(orderTotal) }}</h2>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'TotalAmount',
  computed: {
    ...mapGetters('order', ['orderTotal']),
    ...mapGetters('location', ['formatPrice']),
  },
  methods: {},
}
</script>
