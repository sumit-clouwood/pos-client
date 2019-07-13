<template>
  <div id="total-amount" class="total-amount color-secondary">
    <div class="payment-amount-title">
      <p class="tip-amopunt color-text-invert">{{ _t('Tip Amount') }}</p>
      <p class="total-amt color-text-invert">{{ _t('Total Amount') }}</p>
    </div>
    <div class="payment-amount-digit">
      <p class="color-text-invert">{{ formatPrice(tipAmount) }}</p>
      <h2 class="color-text-invert">{{ formatPrice(orderTotal) }}</h2>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'TotalAmount',
  computed: {
    ...mapGetters('order', ['orderTotal']),
    ...mapGetters('location', ['formatPrice', '_t']),
    ...mapState('checkoutForm', ['tipAmount']),
  },
  methods: {},
}
</script>
