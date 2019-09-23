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
        <div class="sub-total-num">
          {{ formatPrice(order.total_surcharge || 0) }}
        </div>
      </div>
      <div class="item discounts">
        <div class="sub-total-text">
          {{ _t('Discounts') }}
          {{ getOrderDiscount(order.order_discounts).name }}
        </div>
        <div class="sub-total-num">
          {{ formatPrice(getOrderDiscount(order.order_discounts).value || 0) }}
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
      <button
        class="pos-button-design btn btn-success"
        v-if="order.order_system_status != 'cancelled'"
        @click="modifyOrder"
      >
        {{ _t('Modify Transaction') }}
      </button>
      <button
        class="pos-button-design btn btn-success ml-2"
        data-toggle="modal"
        v-if="order.order_system_status != 'cancelled'"
        data-target=".cancel-order"
      >
        {{ _t('Cancel Transaction') }}
      </button>
    </div>
    <CancelOrderPopup :order="order" />
  </div>
</template>

<script>
import CancelOrderPopup from '@/components/transactions/content/orderDetails/CancelOrderPopup'
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'CartFooter',
  props: {
    order: Object,
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
    getOrderDiscount(discounts) {
      let value = ''
      let name = ''
      discounts.map(function(discount) {
        let type = discount.type === 'percentage' ? '%' : ''
        name += '(' + discount.name + ' (' + discount.rate + type + '))'
        value += discount.price
      })
      return { name, value }
    },
    totalWrapperHendlerGhange() {
      this.$store.dispatch('totalWrapperHendlerGhange')
    },
    modifyOrder() {
      this.$store.dispatch('order/modifyOrderTransaction').then(() => {
        this.$router.push({ path: this.$store.getters['context/store'] })
      })
    },
  },
}
</script>
