<template>
  <div>
    <div
      class="button-block"
      v-if="
        processedOrder.includes(order._id) && loading_awating_order_response
      "
    >
      <button class="button text-button btn btn-success" type="button">
        <div class="button-content-container">
          <div class="button-icon-container">
            <!---->
          </div>
          <div class="button-caption" :style="{ opacity: 1 }">
            <i class="fa fa-circle-o-notch fa-spin"></i>
            {{ _t('wait') }}
          </div>
        </div>
      </button>
    </div>
    <div v-else>
      <span
        :key="LabelIndex"
        style="margin: 0.2rem"
        v-for="(label, LabelIndex) in actionDetails.actionLabel"
      >
        <a
          v-if="typeof orderTable !== 'string' && label == 'Update'"
          @click="
            setRouter({
              url:
                $route.path +
                '/' +
                orderTable.table.assigned_table_id +
                '/' +
                order._id,
              orderId: order._id,
              orderData: orderTable.table,
            })
          "
        >
          <div class="button text-button btn btn-success" type="button">
            <div class="button-content-container">
              <div class="button-icon-container"></div>
              <div class="button-caption">
                {{ actionDetails.actionLabel[LabelIndex] }}
              </div>
            </div>
          </div>
        </a>
        <button
          v-else-if="label !== 'Update'"
          @click.stop="
            updateOrder({
              order: order,
              orderType: order.order_type,
              actionTrigger: actionDetails.action[LabelIndex],
            })
          "
          class="button text-button btn btn-success"
          type="button"
        >
          <div class="button-content-container">
            <div class="button-icon-container"></div>
            <div class="button-caption">
              {{ actionDetails.actionLabel[LabelIndex] }}
            </div>
          </div>
        </button>
      </span>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  computed: {
    ...mapState({
      loading_awating_order_response: state => state.deliveryManager.loading,
    }),
    ...mapGetters('location', ['_t']),
    ...mapState('dinein', ['qrTableNotification', 'tables', 'orderDetails']),
    // orderTable() {
    //   return this.orderDetails.forEach(orderTable => {
    //     orderTable.table.assigned_table_id === this.order.assigned_table_id
    //   })
    // },
  },
  name: 'OrderAcceptReject',
  data() {
    return {
      actionDetails: {
        moreDetails: false,
        actionLabel: ['Accept', 'Reject', 'Update'],
        action: ['delivery_accept', 'delivery_reject', 'update'],
        nextOrderStatus: 'in-progress',
      },
      processedOrder: [],
    }
  },
  props: {
    order: Object,
    orderTable: [String, Object],
  },
  methods: {
    ...mapActions('order', ['updateOrderAction']),
    updateOrder(data) {
      this.processedOrder.push(data.order._id)
      this.$store.commit('deliveryManager/SET_LOADING', true)
      this.updateOrderAction(data).then(() => {
        this.updateQRNotificaitons(data.order)
        // this.$store.dispatch('dinein/dineInRunningOrders')
        // this.$store.dispatch('deliveryManager/getOnlineOrders')
      })
      // .catch(er => {
      //   this.err = er.data ? er.data.error : er.message
      //   if (this.err) $('.information-popup').modal('show')
      // })
    },
    setRouter(data) {
      let tableData = this.tables.find(
        table => table._id === data.orderData.assigned_table_id
      )
      this.$store.commit('dinein/SELECTED_TABLE', tableData)
      this.$store.commit('dinein/RESERVATION_ID', data.orderData._id)
      this.$store.commit('dinein/ORDER_RESERVATION_DATA', data.orderData)
      this.$store.dispatch('dinein/getSelectedOrder', data.orderId, {
        root: true,
      })
      this.$store.dispatch('order/updateOrderType', {
        OTview: 'Dine In',
        OTApi: 'dine_in',
      })
      this.$router.push({ path: data.url })
    },
    updateQRNotificaitons(order) {
      let notification = this.qrTableNotification
      let new_items_list = []
      if (!notification.length) return false
      notification.forEach(data => {
        if (data.order_no !== order.order_no) {
          new_items_list.push(data)
        }
      })
      this.$store.commit('dinein/QR_TABLE_NOTIFICATION', new_items_list)
      localStorage.setItem(
        'qr_table_notification',
        JSON.stringify(new_items_list)
      )
    },
  },
}
</script>
