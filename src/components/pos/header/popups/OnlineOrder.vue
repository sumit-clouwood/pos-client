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
            {{ onlineOrders }}
          </h4>
        </div>
        <div class="modal-body online-order-wrapper" v-if="onlineOrders">
          <div
            class="add-order-area"
            v-for="(orders, index) in Math.ceil(onlineOrders.orders.length / 3)"
          >
            <div
              class="online-order"
              v-for="order in items.slice((orders - 1) * 3, orders * 3)"
            >
              <div class="online-order-header">
                <h4 class="customer-title">Upcoming Order # {{ index }}</h4>
                <p class="online-order-amount">unpaid {{ order._id }}</p>
              </div>
              <div class="online-order-content">
                <div class="online-order-content-wrap">
                  <p
                    class="online-order-id"
                    data-toggle="modal"
                    data-target="#past-order"
                    data-dismiss="modal"
                  >
                    <span>Order No</span>#{{ order.order_no }}
                  </p>
                  <p><span>Wait Time</span>{{ order.created_timestamp }}</p>
                  <p><span>Customer</span>{{ order.customer_id }}</p>
                </div>
                <div class="online-order-address">
                  <p>
                    555, Test-555<br />
                    Test, 555<br />
                    Alimps Campus, Binaker
                  </p>
                </div>
                <div class="online-order-btn">
                  <button
                    class="reject-order"
                    data-toggle="modal"
                    data-target="#cancel-reason"
                  >
                    Reject
                  </button>
                  <button class="add-to-delivery">Add to Delivery</button>
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
import { mapState, mapActions } from 'vuex'
export default {
  name: 'OnlineOrder',
  props: {},
  data() {
    return {
      onlineOrders: false,
      orderCount: 0,
    }
  },
  mounted() {
    let socket = io('https://websocket-int.erp-pos.com')
    socket.on('sound-channel:App\\Events\\SocketBroadcast', function(
      orderData
    ) {
      this.onlineOrders = orderData
      console.log(this.locationId)
      console.log(this.onlineOrders)

      localStorage.setItem(
        'order_payment_status',
        JSON.stringify(this.onlineOrders.data.order_payment_status)
      )
      localStorage.setItem(
        'orders',
        JSON.stringify(this.onlineOrders.data.orders)
      )
      localStorage.setItem('site_url', this.onlineOrders.data.siteurl)

      if (this.locationId == orderData.locationId) {
        var onlineNewOrderAudioRing = new Audio(
          'https://int.erp-pos.com/sound/doorbell.ogg'
        )
        onlineNewOrderAudioRing.load()
        if (orderData.orders && orderData.orders.length) {
          console.log('play')
          onlineNewOrderAudioRing.addEventListener(
            'ended',
            function() {
              this.currentTime = 0
              ;(this.play() || nopromise).catch(function() {})
            },
            false
          )
          ;(onlineNewOrderAudioRing.play() || nopromise).catch(function() {})
        } else {
          console.log('pause')
          onlineNewOrderAudioRing.pause()
          onlineNewOrderAudioRing.currentTime = 0
        }
      }
    })
  },
  computed: {
    ...mapState({
      locationId: state => state.location.location,
    }),

    /*orderPaymentStatus:
      this.onlineOrders != '' && typeof this.onlineOrders != 'undefined'
        ? this.onlineOrders.order_payment_status
        : [],

    orders: this.onlineOrders.length > 0 ? this.onlineOrders.orders : [],

    OnlineOrderLocation:
      this.onlineOrders.length > 0 ? this.onlineOrders.locationId : '',*/

    collectOrderCollection: function(orderData) {
      let onlineOrderList = []
      alert(this.locationId)
      if (this.locationId == orderData.locationId) {
        console.log(orderData)
        console.log(this.onlineOrders)
        var onlineNewOrderAudioRing = new Audio(
          'https://int.erp-pos.com/sound/doorbell.ogg'
        )
        onlineNewOrderAudioRing.load()
        if (orderData.orders && orderData.orders.length) {
          console.log('play')
          onlineNewOrderAudioRing.addEventListener(
            'ended',
            function() {
              this.currentTime = 0
              ;(this.play() || nopromise).catch(function() {})
            },
            false
          )
          ;(onlineNewOrderAudioRing.play() || nopromise).catch(function() {})
        } else {
          console.log('pause')
          onlineNewOrderAudioRing.pause()
          onlineNewOrderAudioRing.currentTime = 0
        }
      }
    },
  },
}
</script>
