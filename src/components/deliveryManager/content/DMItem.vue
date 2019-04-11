<template>
<div class="ready-order-wraper-left" v-if="orderDetails">
    <div class="dm-contain-order" v-for="(order, index) in orderDetails" :key="index">
        <div v-if="order.order_status == orderStatus">
            <div class="dm-deliver-detail">
                <h4>{{ order.order_no }}</h4>
                <p>
                    <span v-for="i in orderCount" :key="i">
                        {{
                          typeof order.items[i] != 'undefined'
                            ? order.items[i].item_name
                            : ''
                        }}
                    </span>
                </p>
                <h4> {{ order.delivery_area }}</h4>
                <p>  {{ order.order_address.street }}, {{ locationName }}, {{ order.order_address.city }}</p>
            </div>
            <div class="dm-deliver-detail-right">
                <p class="dm-amt">{{ order.balance_due }} {{ order.currency_code }}</p>
                <p class="dm-time">{{ order.order_taken_at }}</p>

                <button class="ready" @click="showOrderDetails(order)">
                    <span v-if="actionDetails.moreDetails" data-toggle="modal" data-target="#delivery-manager">More details</span>
                </button>
                <a href="#" v-if="actionDetails.action" class="btn btn-success"
                   @click="DMOrderStatus({
                   actionDetails: actionDetails,
                   orderId: order._id,
                   })"
                >{{ actionDetails.action }}</a>
            </div>
        </div>
    </div>
</div>
</template>

<script>
/* global $ */
import { mapState, mapActions } from 'vuex'
export default {
  name: 'DMItem',
  data(){
    return {
      orderCount: 2
    }
  },
  props: {
    actionDetails: Object,
  },
  computed: {
    ...mapState({
      orderStatus: state => state.deliveryManager.deliveryOrderStatus
    }),
    ...mapState({
      orderDetails: state => state.deliveryManager.orders
    }),
    ...mapState({
      locationName: state => state.location.locationName,
    }),
  },
  methods: {
    ...mapActions('deliveryManager',['showOrderDetails']),
    DMOrderStatus: function({actionDetails, orderId}){
      let timestamp = Date.now()
      if(typeof actionDetails.driverId != 'undefined') {
        this.$store.dispatch('deliveryManager/attachOrderDriver', {'orderId': orderId, 'driverId': actionDetails.driverId, 'timestamp': timestamp})
      } else {
        this.$store.dispatch('checkout/updateOrderStatus', {'orderStatus': actionDetails.nextOrderStatus, 'orderId': orderId, 'timestamp': timestamp, 'orderType': 'delivery'})
      }
      $(this)
        .parent()
        .parent()
        .parent()
        .addClass('active')
      $('.dm-contain-order.active').hide(800)
    }
  }
}
</script>

<style scoped>

</style>