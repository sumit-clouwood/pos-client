<template>
  <div class="main-orders-total color-text-invert">
    <h3 class="trans_head">{{ _t('TOTAL') }}</h3>
    <div :class="['total-wrapper', { active: totalWrapperHendler }]">
      <div class="item sub-total">
        <div class="sub-total-text">{{ _t('Sub Total') }}</div>
        <div class="sub-total-num">{{ formatPrice(order.sub_total || 0) }}</div>
      </div>
      <div class="item surcharges">
        <div class="sub-total-text">{{ _t('Surcharges') }}</div>
        <div class="sub-total-num">{{ formatPrice(order.total_surcharge || 0) }}</div>
      </div>
      <div class="item discounts">
        <div class="sub-total-text">
          {{ _t('Discounts') }}
        </div>
        <div class="sub-total-num">
          {{ formatPrice(order.total_discount || 0) }}
        </div>
      </div>
      <div class="item tax">
        <div class="sub-total-text">{{ _t('Tax') }}</div>
        <div class="sub-total-num">{{ formatPrice(order.total_tax || 0) }}</div>
      </div>
    </div>
    <div class="total color-text">
      <div class="sub-total-text">{{ _t('Total') }}</div>
      <div class="sub-total-num" @click="totalWrapperHendlerGhange">
        {{ formatPrice(order.balance_due || 0) }}
        <i
          aria-hidden="true"
          :class="['fa', 'fa-angle-up', { active: totalWrapperHendler }]"
        ></i>
      </div>
    </div>
    <div class="btn-transaction text-right">
    <button class="pos-button-design btn btn-success"
    data-toggle="modal"
    data-target=".cancel-order"
    >
        Cancel Transaction
      </button>
    </div>
    <CancelOrderPopup :order="order" />
  </div>
</template>

<script>
import CancelOrderPopup from '@/components/transactionorders/content/orderDetails/CancelOrderPopup'
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'CartFooter',
  props: {
    'order' : Object,
  },
  components: {
    CancelOrderPopup,
  },
  computed: {
    ...mapGetters('order', ['orderTotal', 'subTotal', 'totalTax']),
    ...mapGetters('surcharge', ['surcharge']),
    ...mapGetters('location', ['formatPrice', '_t']),
    ...mapGetters('discount', ['orderDiscountWithoutTax']),
    ...mapState('discount', ['appliedOrderDiscount']),
    ...mapGetters(['totalWrapperHendler']),
  },
  methods: {
    totalWrapperHendlerGhange() {
      this.$store.dispatch('totalWrapperHendlerGhange')
    },
  },
}
</script>
