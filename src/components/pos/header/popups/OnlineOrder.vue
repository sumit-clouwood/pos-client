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
        <div class="modal-body online-order-wrapper" v-if="getLatestOnlineOrders">
          <div class="add-order-area">
            <div
              v-for="(order, index) in getLatestOnlineOrders.orders"
              class="online-order"
            >
              <div class="online-order-header">
                <h4 class="customer-title">Upcoming Order # {{ ++index }}</h4>
                <p
                  class="online-order-amount"
                  v-if="getPaymentStatus() === 'unpaid'"
                >
                  unpaid
                </p>
                <p
                  class="online-order-amount paid-amt"
                  v-if="getPaymentStatus() === 'paid'"
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
                    data-dismiss="modal"
                  >
                    <span>Order No</span>#{{ order.order_no }}
                  </p>
                  <p><span>Wait Time</span>{{ order.created_timestamp }}</p>
                  <p>
                    <span>Customer</span
                    >{{
                      getCustomerInformation(
                        fetchAddress.customer_list,
                        order.customer_id,
                        order.address_id
                      )
                    }}
                  </p>
                </div>
                <div class="online-order-address">
                  <p>
                    <span v-if="customerAddress">
                      {{
                        getDeliveryArea(customerAddress.delivery_area)
                      }},<br />
                      {{ customerAddress.street }}, {{ locationName }}, <br />
                      {{ customerAddress.city }},
                    </span>
                    {{ country }}
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
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'OnlineOrder',
  props: {},
  data() {
    return {
      customerName: '',
      customerAddress: false,
      paymentStatus: 'unpaid',
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
    ...mapGetters('location', ['getDeliveryArea']),
    ...mapGetters('order', ['getLatestOnlineOrders']),
  },
  methods: {

    getCustomerInformation(addressList, customerId, addressId) {
      if (typeof addressList != 'undefined') {
        addressList.forEach(customerAddress => {
          if (customerAddress._id == customerId) {
            this.customerName = customerAddress.customer_name
            customerAddress.customer_details.forEach(address => {
              if (addressId == address._id) {
                this.customerAddress = address
              }
            })
          }
          return this.customerName
        })
      }
    },

    getPaymentStatus(orderId) {
      let orderStatus = 'unpaid'
      this.getLatestOnlineOrders.order_payment_status.forEach(payment => {
        if (payment.order_id == orderId) {
          orderStatus == payment.payment_mode
        }
      })
      return orderStatus
    },
  },
}
</script>
