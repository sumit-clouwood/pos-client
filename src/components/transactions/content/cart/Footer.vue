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
      <div class="sub-total-num" @click="totalWrapperHendlerChange">
        {{ formatPrice(order.balance_due || 0) }}
        <i
          aria-hidden="true"
          :class="['fa', 'fa-angle-up', { active: totalWrapperHendler }]"
        ></i>
      </div>
    </div>
    <div class="btn-transaction text-right">
      <span>
        <button
          v-if="!isCancelled(order.order_system_status)"
          class="btn btn-large btn-success popup-btn-save color-text-invert color-main pos-button-design  btn-tans-mbl"
          data-toggle="modal"
          data-target=".cancel-order"
        >
          {{ _t('Cancel Transaction') }}
        </button>
        <button
          v-if="isUpdateAble(order)"
          class="btn btn-large btn-success popup-btn-save color-text-invert color-main pos-button-design ml-2 btn-tans-mbl"
          @click.prevent="updateOrder(order)"
        >
          {{ _t('Update Transaction') }}
        </button>
        <button
          v-else-if="!multistore && !isUpdateAble(order)"
          class="btn btn-large btn-success popup-btn-save color-text-invert color-main pos-button-design  btn-tans-mbl"
          @click="modifyOrder(1)"
        >
          {{ _t('Modify Transaction') }}
        </button>
      </span>
      <!--<button
        class="btn btn-large btn-success popup-btn-save color-text-invert color-main pos-button-design"
        @click="modifyOrder(0)"
      >
        {{ _t('Add More Items') }}
      </button>-->
    </div>
    <CancelOrderPopup :order="order" />
  </div>
</template>

<script>
import CancelOrderPopup from '@/components/transactions/content/orderDetails/CancelOrderPopup'
import { mapGetters, mapState } from 'vuex'
import * as CONST from '@/constants'
export default {
  name: 'CartFooter',
  props: {
    order: Object,
  },
  components: {
    CancelOrderPopup,
  },
  computed: {
    ...mapState('discount', ['appliedOrderDiscount']),
    ...mapState('dinein', ['allBookedTables']),
    ...mapState('order', ['selectedOrder']),
    ...mapGetters('order', ['orderTotal', 'subTotal', 'totalTax']),
    ...mapGetters('surcharge', ['surcharge']),
    ...mapGetters('location', ['formatPrice', '_t']),
    ...mapGetters('discount', ['orderDiscountWithoutTax']),
    ...mapGetters(['totalWrapperHendler']),
    ...mapGetters('auth', ['multistore']),
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
    isUpdateAble(order) {
      return (
        (order.order_type === CONST.ORDER_TYPE_DINE_IN ||
          order.order_type === CONST.ORDER_TYPE_CARHOP) &&
        order.order_status === CONST.ORDER_STATUS_IN_PROGRESS
      )
    },
    isCancelled(orderStatus) {
      return orderStatus === CONST.ORDER_SYSTEM_STATUS_CANCELLED
    },
    totalWrapperHendlerChange() {
      this.$store.dispatch('totalWrapperHendlerChange')
    },
    updateOrder(currentOrder) {
      if (currentOrder.order_type === CONST.ORDER_TYPE_CARHOP) {
        this.$router.push(
          '/carhop' +
            this.$store.getters['context/store'] +
            '/' +
            currentOrder._id
        )
      } else {
        this.$store.dispatch('dinein/fetchAll').then(() => {
          const tableData = this.allBookedTables.orders.filter(element =>
            element.related_orders_ids.includes(currentOrder._id)
          )
          this.updateDineinOrder(tableData[0], currentOrder)
        })
      }
    },
    updateDineinOrder(tableData, currentOrder) {
      this.$store.commit('dinein/SELECTED_TABLE', tableData)
      this.$store.commit('dinein/SELECTED_TABLE_RESERVATION', tableData.number)
      this.$store.commit(
        'dinein/RESERVATION_ID',
        currentOrder.table_reservation_id
      )
      this.$store.commit('dinein/NUMBER_GUESTS', false)
      this.$store.commit('dinein/TABLE_SPLIT', true)
      this.$store.commit('order/ORDER_SOURCE', 'dinein')
      this.$store.dispatch('dinein/getSelectedOrder', currentOrder._id, {
        root: true,
      })
      let URL =
        '/dine-in' +
        this.$store.getters['context/store'] +
        '/' +
        tableData.assigned_table_id +
        '/' +
        currentOrder._id
      this.$store.dispatch('order/updateOrderType', {
        OTview: 'Dine In',
        OTApi: 'dine_in',
      })
      this.$router.push(URL)
    },
    modifyOrder(is_modify) {
      this.$store.commit('order/IS_PAY', is_modify)
      this.$store.dispatch('order/modifyOrderTransaction').then(order => {
        //let scope = this
        this.$router.push({
          path: this.$store.getters['context/store'] + '/update/' + order._id,
        })

        // if (order.order_type === 'dine_in') {
        //   this.$store.dispatch('dinein/getDineInTables')
        //   this.$store.dispatch('dinein/getCovers').then(function() {
        //     let orderId = order._id
        //     let table_reservation_id = order.table_reservation_id
        //     if (scope.$store.state.dinein.tables && order.assigned_table_id) {
        //       let tableData = scope.$store.state.dinein.tables.find(
        //         table => table._id === order.assigned_table_id
        //       )
        //       scope.$store.commit('dinein/SELECTED_TABLE', tableData)
        //     }
        //     scope.$store.commit('dinein/RESERVATION_ID', table_reservation_id)
        //     scope.$store.commit('dinein/ORDER_RESERVATION_DATA', order)
        //     scope.$store.dispatch('dinein/getSelectedOrder', orderId, {
        //       root: true,
        //     })
        //     scope.$router.push({
        //       path:
        //         '/dine-in/' +
        //         scope.$store.getters['context/store'] +
        //         '/' +
        //         table_reservation_id +
        //         '/' +
        //         orderId,
        //     })
        //   })
        // } else {
        //   this.$router.push({
        //     path: this.$store.getters['context/store'] + '/update/' + order._id,
        //   })
        // }
      })
    },
  },
}
</script>
