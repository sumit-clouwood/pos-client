<template>
  <div class="total-amount-wrapper">
    <div class="surcharge-amt">
      <div>
        <span class="total-charges">{{ _t('Sub Total') }}</span>
        <span class="aed-charges"> {{ formatPrice(subTotal || 0) }}</span>
      </div>
      <div>
        <span class="total-charges">{{ _t('Surcharges') }}</span>
        <span class="aed-charges"> {{ formatPrice(surcharge || 0) }}</span>
      </div>
      <div>
        <span class="total-charges">{{ _t('Discounts') }}</span>
        <span class="aed-charges">
          {{ formatPrice(orderDiscountWithoutTax || 0) }}</span
        >
      </div>
      <div>
        <span class="total-charges">{{ _t('Tax') }}</span>
        <span class="aed-charges"> {{ formatPrice(totalTax || 0) }}</span>
      </div>
    </div>
    <div class="total-amount">
      <div>
        <span class="total-charges"> {{ _t('Total') }}</span
        ><span class="aed-charges"> {{ formatPrice(orderTotal || 0) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'CartFooter',
  props: {},
  computed: {
    ...mapGetters('order', ['orderTotal', 'subTotal']),
    ...mapGetters('tax', ['totalTax']),
    ...mapGetters('surcharge', ['surcharge']),
    ...mapGetters('location', ['formatPrice', '_t']),
    ...mapGetters('discount', ['orderDiscountWithoutTax']),
  },
}
</script>
