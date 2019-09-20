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
      <span
        v-if="
          order.order_type === 'dine_in' && order.order_status === 'finished'
        "
      >
        <button
          class="btn btn-large btn-success popup-btn-save color-text-invert color-main pos-button-design"
          data-toggle="modal"
          v-if="order.order_system_status !== 'cancelled'"
          data-target=".cancel-order"
        >
          {{ _t('Cancel Transaction') }}
        </button>
        <button
          class="btn btn-large btn-success popup-btn-save color-text-invert color-main pos-button-design"
          @click="modifyOrder(1)"
        >
          {{ _t('Modify Transaction') }}
        </button>
      </span>
      <span v-if="order.order_type !== 'dine_in'">
        <button
          class="btn btn-large btn-success popup-btn-save color-text-invert color-main pos-button-design"
          data-toggle="modal"
          v-if="order.order_system_status !== 'cancelled'"
          data-target=".cancel-order"
        >
          {{ _t('Cancel Transaction') }}
        </button>
        <button
          class="btn btn-large btn-success popup-btn-save color-text-invert color-main pos-button-design"
          @click="modifyOrder(1)"
        >
          {{ _t('Modify Transaction') }}
        </button>
      </span>
      <button
        class="btn btn-large btn-success popup-btn-save color-text-invert color-main pos-button-design"
        @click="modifyOrder(0)"
      >
        {{ _t('Add More Items') }}
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
    modifyOrder(is_modify) {
      this.$store
        .dispatch('order/modifyOrderTransaction', is_modify)
        .then(response => {
          let scope = this
          if (response.order_type === 'dine_in') {
            this.$store.dispatch('dinein/getDineInTables')
            this.$store.dispatch('dinein/getCovers').then(function() {
              let orderId = response._id
              let table_reservation_id = response.table_reservation_id
              scope.$router.push({
                path:
                  '/dine-in/' +
                  scope.$store.getters['context/store'] +
                  '/' +
                  table_reservation_id +
                  '/' +
                  orderId,
              })
            })
          } else {
            this.$router.push({ path: this.$store.getters['context/store'] })
          }
        })
    },
  },
}
</script>
