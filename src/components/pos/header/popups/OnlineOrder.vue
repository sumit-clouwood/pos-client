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
          <div class="add-order-area">
            <div
              v-for="(order, index) in onlineOrders.orders"
              class="online-order"
            >
              <div class="online-order-header">
                <h4 class="customer-title">Upcoming Order # {{ index }}</h4>
                <p class="online-order-amount">unpaid</p>
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
import { mapState } from 'vuex'
export default {
  name: 'OnlineOrder',
  props: {},
  data() {
    return {
      onlineOrders: false,
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
    this.onlineOrder()
  },
  computed: {
    ...mapState({
      locationId: state => state.location.location,
    }),
    ...mapState({
      /*    onlineOrder: state =>
 /*       typeof state.order.onlineOrders.orders != 'undefined'
             ? state.order.onlineOrders
             : false,*/
    }),
  },
  methods: {
    onlineOrder() {
      if (JSON.parse(localStorage.getItem('onlineOrders')) != null) {
        this.onlineOrders = JSON.parse(localStorage.getItem('onlineOrders'))
      }
    },

    playSound(onlineOrders) {
      if (this.locationId == onlineOrders.orders.locationId) {
        alert(locationId)
        var onlineNewOrderAudioRing = new Audio(
          'https://int.erp-pos.com/sound/doorbell.ogg'
        )
        onlineNewOrderAudioRing.load()
        if (onlineOrders.orders && onlineOrders.orders.length) {
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
