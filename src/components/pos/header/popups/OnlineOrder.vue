<template>
  <!-- Online order popup -->
  <div class="modal fade" id="online-order" role="dialog">
    <div class="modal-dialog modal-dialog-centered">
      <!-- Modal content-->
      <!-- <div class="modal-content color-dashboard-background">
        <div class="modal-header customer-header">
          <h4 class="customer-title color-text-invert">
            Additional order are almost ready. Would you like to take them with
            you ?
          </h4>
          <button
            type="button"
            class="close pull-right color-text"
            data-dismiss="modal"
          >
            &times;
          </button>
        </div>
        <div
          class="modal-body online-order-wrapper"
          v-if="getLatestOnlineOrders.length"
        >
          <div class="add-order-area">
            <div
              v-for="(order, index) in getLatestOnlineOrders"
              class="online-order"
              :key="index"
            >
              <div class="online-order-header">
                <h4 class="customer-title">Upcoming Order # {{ ++index }}</h4>
                <p
                  class="online-order-amount"
                  v-if="getPaymentStatus(order._id) === 'unpaid'"
                >
                  unpaid
                </p>
                <p
                  class="online-order-amount paid-amt"
                  v-if="getPaymentStatus(order._id) === 'paid'"
                >
                  paid
                </p>
              </div>
              <div class="online-order-content">
                <div class="online-order-content-wrap">
                  <p
                    class="online-order-id cursor-pointer online-order-head"
                    data-toggle="modal"
                    @click="selectedOrder(order)"
                  >
                    <span class="online-order-txt">Order No:</span> #{{
                      order.order_no
                    }}
                  </p>
                  <div>
                    <p class="online-order-head">
                      <span class="online-order-txt">Wait Time:</span>
                    </p>
                    {{ humanDateTime(order) }}
                    <p :id="order.order_no" class="online-order-head"></p>
                    <p class="online-order-head">
                      <span class="online-order-txt">Customer: </span>
                      {{ order.customer.customer_name }}
                    </p>
                  </div>
                </div>
                <div class="online-order-address">
                  <p>
                    <span>
                      {{ order.delivery_area }},<br />
                      {{ order.order_address.street }}, {{ locationName }},
                      <br />
                      {{ order.order_address.city }},
                    </span>
                    {{ country }}
                  </p>
                </div>
                <div class="online-order-btn">
                  <button
                    class="reject-order"
                    data-toggle="modal"
                    data-target="#cancel-reason"
                    @click="
                      updateOrderStatus({
                        orderStatus: 'cancel',
                        orderId: order._id,
                        timestamp: order.created_timestamp,
                        orderType: 'call_center',
                        orderQueue: 0,
                      })
                    "
                  >
                    Reject
                  </button>
                  <button
                    class="add-to-delivery"
                    @click="
                      updateOrderStatus({
                        orderStatus: 'running',
                        orderId: order._id,
                        timestamp: order.created_timestamp,
                        orderType: 'call_center',
                        orderQueue: 0,
                      })
                    "
                  >
                    Add to Delivery
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <div class="btn-announce pull-right">
            <button
              type="button"
              class="btn btn-danger cancel-announce"
              data-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div> -->
    </div>
  </div>
  <!-- End online order popup -->
</template>

<script>
/* global $  */
import moment from 'moment-timezone'
import DateTime from '@/mixins/DateTime'
import * as CONST from '@/constants.js'
// import * as utils from '@/utils/main_utils'
import { mapState, mapGetters, mapActions } from 'vuex'
// var debouncedGetData = utils.debounce(function () {
//         // eslint-disable-next-line no-console
//         console.log(route)
//         api_utils.execute_get(route, business_entity_id, brand_id, store_id, params).then((response) => {
//             var results = response.data.data;
//             if (results.length > 0) {
//                 var final_results = [];
//                 for (var item of results) {
//                     final_results.push({
//                         'value': item.currency,
//                         'text': item.currency,
//                         'full': item
//                     })
//                 }
//                 component.onlineOrders = final_results;
//                 if (action == CONST.ACTION_ID_ADD) {
//                     component.showNotification();
//                 }
//             } else {
//                 component.onlineOrders = [];
//                 component.pauseSound();
//                 component.hideNotification();
//             }
//         }).catch(err => {
//             utils.process_error(err.response.data);
//         })
//     }, 500);

export default {
  name: 'OnlineOrder',
  props: {},
  mixins: [DateTime],
  data() {
    return {
      customerName: '',
    }
  },
  mounted() {
    if (this.$store.getters['modules/enabled'](CONST.MODULE_DELIVERY)) {
      // const store = this.$store
      /*if (typeof io !== 'undefined') {
        let socket = io('https://websocket-int.erp-pos.com')
        socket.on('sound-channel:App\\Events\\SocketBroadcast', function(
          orderData
        ) {
          store.dispatch('order/setOnlineOrders', orderData.data)
        })
      }*/
    }
  },
  computed: {
    ...mapState({
      locationId: state => state.location.location,
    }),
    ...mapState({
      fetchAddress: state => state.customer.allOnlineAddress,
    }),
    ...mapState({
      locationName: state => state.location.locationName,
    }),
    ...mapState({
      country: state =>
        typeof state.location.locationData !== 'undefined'
          ? state.location.locationData.country_name
          : '',
    }),
    // ...mapGetters('location', ['getDeliveryArea']),
    ...mapGetters('order', ['getLatestOnlineOrders']),
  },
  methods: {
    moment: function(date) {
      moment.tz.setDefault(this.$store.state.location.setTimeZone)
      // moment.tz.setDefault('Asia/Jakarta')
      return moment(date).format('MMM Do YYYY, h:mm')
    },
    getPaymentStatus(orderId) {
      let orderStatus = 'unpaid'
      this.getLatestOnlineOrders.forEach(order => {
        if (order.payment_info.length) {
          order.payment_info.forEach(payment => {
            if (payment.order_id == orderId) {
              orderStatus = payment.status
            }
          })
        }
      })
      return orderStatus
    },
    ...mapActions('checkout', ['updateOrderStatus']),
    selectedOrder(order) {
      this.$store.dispatch('order/selectedOrderDetails', order._id)
      $('#past-order').modal('toggle')
    },
    ...mapActions('order', ['selectedOrderDetails', 'updateOrderAction']),
  },
}
</script>
