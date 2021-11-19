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
      <div class="item tax">
        <div class="sub-total-text">{{ _t('Special Delivery Surcharge') }}</div>
        <div class="sub-total-num">
          {{ formatPrice(order.delivery_surcharge || 0) }}
        </div>
      </div>
      <div class="item tax">
        <div class="sub-total-text">{{ _t('Tips') }}</div>
        <div class="sub-total-num">
          {{ formatPrice(order.tip_amount || 0) }}
        </div>
      </div>
    </div>
    <div class="total color-text">
      <div class="sub-total-text">{{ _t('Total') }}</div>
      <div class="sub-total-num" @click="totalWrapperHendlerChange">
        {{ formatPrice(orderGrandTotal(order) || 0) }}
        <i
          aria-hidden="true"
          :class="['fa', 'fa-angle-up', { active: totalWrapperHendler }]"
        ></i>
      </div>
    </div>
    <div class="btn-transaction text-right">
      <div class="v-menu v-menu--inline">
        <div class="v-menu__activator">
          <div class="dropdown">
            <button
              v-if="allowed(PERMS.REPRINT_ORDER)"
              class="btn btn-large btn-success popup-btn-save color-text-invert color-main pos-button-design ml-2 btn-tans-mbl dropdown-toggle"
              type="button"
              id="dropdownMenuButton"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              {{ _t('Reprint') }}
            </button>
            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <a
                class="dropdown-item"
                role="button"
                v-for="(template, index) in selectedOrder.invoice"
                :key="index"
                @click="
                  printInvoiceDisableKitchenPrint({
                    templateId: template._id,
                    order: selectedOrder,
                  })
                "
                >{{ template.name }}</a
              >
            </div>
          </div>
        </div>
      </div>

      <span
        v-if="
          order.order_type === 'dine_in' &&
            order.order_system_status !== 'cancelled'
        "
      >
        <button
          class="btn btn-large btn-success popup-btn-save color-text-invert color-main pos-button-design ml-2 btn-tans-mbl"
          data-toggle="modal"
          data-target=".cancel-order"
        >
          {{ _t('Cancel Transaction') }}
        </button>
        <button
          v-if="
            allowed(PERMS.MODIFY_ORDER) &&
              !multistore &&
              !order.credit &&
              order.order_source !== 'aggregator'
          "
          class="btn btn-large btn-success popup-btn-save color-text-invert color-main pos-button-design btn-tans-mbl"
          @click="modifyOrder(1)"
        >
          {{ _t('Modify Transaction') }}
        </button>
      </span>
      <span
        v-if="
          order.order_type !== 'dine_in' &&
            order.order_system_status !== 'cancelled'
        "
      >
        <button
          class="btn btn-large btn-success popup-btn-save color-text-invert color-main pos-button-design  btn-tans-mbl"
          data-toggle="modal"
          data-target=".cancel-order"
        >
          {{ _t('Cancel Transaction') }}
        </button>
        <!-- aggregator will only come from zometo and talabat.
          we will add few handles like when online order modify and
          than we remove all items and remove customer 
          than chnage order type to takeaway and add new items 
          it will take order source as aggergator for takeaway order
          for that we need to add few handle and
          reset rootState.order.selectedOrder.item.order_source this as well 
          when remove all data
         -->
        <button
          v-if="
            allowed(PERMS.MODIFY_ORDER) &&
              !multistore &&
              !order.credit &&
              order.order_source !== 'aggregator'
          "
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
    <Invoice />
    <CancelOrderPopup :order="order" />
  </div>
</template>

<script>
import CancelOrderPopup from '@/components/transactions/content/orderDetails/CancelOrderPopup'
import { mapActions, mapGetters, mapState } from 'vuex'
import Invoice from '@/components/pos/content/cart/payNow/Invoice'

export default {
  name: 'CartFooter',
  props: {
    order: Object,
  },
  components: {
    Invoice,
    CancelOrderPopup,
  },
  computed: {
    ...mapGetters('order', [
      'orderTotal',
      'subTotal',
      'totalTax',
      'orderGrandTotal',
    ]),
    ...mapState('order', ['selectedOrder']),
    ...mapGetters('surcharge', ['surcharge']),
    ...mapGetters('location', ['formatPrice', '_t']),
    ...mapGetters('discount', ['orderDiscountWithoutTax']),
    ...mapState('discount', ['appliedOrderDiscount']),
    ...mapGetters(['totalWrapperHendler']),
    ...mapGetters('auth', ['multistore', 'allowed']),
  },
  methods: {
    ...mapActions('deliveryManager', ['printInvoice']),
    printInvoiceDisableKitchenPrint(details) {
      if (details.order.item && details.order.customer) {
        let customer = {
          customerData: details.order.customer,
          pastOrders: '',
          deliveryAreas: details.order.item.order_delivery_area,
        }
        this.$store.commit('customer/SELECTED_CUSTOMER', customer)
      }
      // this.$store.commit('checkout/PRINT', true)

      if (window.PrintHandle == null) {
        this.printInvoice(details)
      } else {
        this.$store.dispatch(
          'printingServer/printingServerInvoiceRaw',
          details.order.item
        )
      }
      this.$store.commit('dinein/KITCHEN_PRINT', false)
    },
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
    totalWrapperHendlerChange() {
      this.$store.dispatch('totalWrapperHendlerChange')
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
