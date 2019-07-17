<template>
  <div class="main-orders-total color-text-invert">
    <div class="item sub-total">
      <div class="sub-total-text">{{ _t('Sub Total') }}</div>
      <div class="sub-total-num">{{ formatPrice(subTotal || 0) }}</div>
    </div>
    <div class="item surcharges">
      <div class="sub-total-text">{{ _t('Surcharges') }}</div>
      <div class="sub-total-num">{{ formatPrice(surcharge || 0) }}</div>
    </div>
    <div class="item discounts">
      <div class="sub-total-text">
        {{ _t('Discounts') }}
        <span v-if="appliedOrderDiscount">
          ({{ appliedOrderDiscount.name }})</span
        >
      </div>
      <div class="sub-total-num">
        {{ formatPrice(orderDiscountWithoutTax || 0) }}
      </div>
    </div>
    <div class="item tax">
      <div class="sub-total-text">{{ _t('Tax') }}</div>
      <div class="sub-total-num">{{ formatPrice(totalTax || 0) }}</div>
    </div>
    <div class="total color-text">
      <div class="sub-total-text">{{ _t('Total') }}</div>
      <div class="sub-total-num">{{ formatPrice(orderTotal || 0) }}</div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'CartFooter',
  props: {},
  computed: {
    ...mapGetters('order', ['orderTotal', 'subTotal']),
    ...mapGetters('tax', ['totalTax']),
    ...mapGetters('surcharge', ['surcharge']),
    ...mapGetters('location', ['formatPrice', '_t']),
    ...mapGetters('discount', ['orderDiscountWithoutTax']),
    ...mapState('discount', ['appliedOrderDiscount']),
  },
}
</script>
