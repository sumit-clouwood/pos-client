<template>
  <div id="total-amount" class="total-amount">
    <div class="payment-amount-title">
      <p class="tip-amopunt">{{ _t('Tip Amount') }}</p>
      <p class="total-amt">{{ _t('Total Amount') }}</p>
    </div>
    <div class="payment-amount-digit">
      <p>{{ formatPrice(tipAmount) }}</p>
      <h2>{{ formatPrice(orderTotal) }}</h2>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'TotalAmount',
  computed: {
    ...mapGetters('checkoutForm', ['orderTotal']),
    ...mapGetters('location', ['formatPrice', '_t']),
    ...mapState('checkoutForm', ['tipAmount']),
  },
  methods: {},
}
</script>
