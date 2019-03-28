<template>
  <!-- Online order popup -->
  <div class="modal fade" id="online-order" role="dialog">
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header customer-header">
          <h4 class="customer-title">
            Additional order are almost ready. Would you like to take them with
            you ?
          </h4>
          <button type="button" class="close pull-right" data-dismiss="modal">
            &times;
          </button>
        </div>
        <div
          class="modal-body online-order-wrapper"
          v-if="getLatestOnlineOrders"
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
                    class="online-order-id"
                    data-toggle="modal"
                    data-target="#past-order"
                  >
                    <span>Order No</span>#{{ order.order_no }}
                  </p>
                  <p>
                    <span>Wait Time</span>
                    {{ humenDateTime(order) }}
                    <p :id="order.order_no"></p>
                  </p>
                  <p><span>Customer</span>{{ order.customer.customer_name }}</p>
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
                        orderType: 'delivery',
                      })
                    "
                  >
                    Reject
                  </button>
                  <button
                    class="add-to-delivery"
                    @click="
                      updateOrderStatus({
                        orderStatus: 'new',
                        orderId: order._id,
                        timestamp: order.created_timestamp,
                        orderType: 'delivery',
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
      </div>
    </div>
  </div>
  <!-- End online order popup -->
</template>

<script>
/* global io */
import moment from 'moment-timezone'
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  name: 'OnlineOrder',
  props: {},
  data() {
    return {
      customerName: '',
    }
  },
  mounted() {
    const store = this.$store
    let socket = io('https://websocket-int.erp-pos.com')
    socket.on('sound-channel:App\\Events\\SocketBroadcast', function(
      orderData
    ) {
      store.dispatch('order/setOnlineOrders', orderData.data)
    })
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
    humenDateTime: function(data) {
      setInterval(function() {
        let time = data.created_timestamp
        let date = data.order_created

        let date_future = new Date(date)
        let date_now = new Date()

        let seconds = Math.floor((date_now - date_future) / 1000)
        let minutes = Math.floor(seconds / 60)
        let hours = Math.floor(minutes / 60)
        let days = Math.floor(hours / 24)

        hours = hours - days * 24
        minutes = minutes - days * 24 * 60 - hours * 60
        seconds = seconds - days * 24 * 60 * 60 - hours * 60 * 60 - minutes * 60

        let htmlElement =
          days +
          ' Days, ' +
          hours +
          ' Hours, ' +
          minutes +
          ' Minutes, ' +
          seconds +
          ' Seconds'
        $('p#' + data.order_no).html(htmlElement)
      }, 1000)
    },
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
  },
}
</script>
