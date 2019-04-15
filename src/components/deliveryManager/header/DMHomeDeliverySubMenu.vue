<template>
  <div class="dm-order-details-wrap">
    <div class="dm-delivery-details-btn">
      <ul class="dm-ullist">
        <li
          class="active"
          data-related="dm-new-order"
          @click="updateOrderStatus('running')"
        >
          <a href="#">New Orders</a
          ><span v-if="orderCount">{{ orderCount.running }}</span>
        </li>
        <li
          class="pick"
          data-related="dm-waiting-for-pick"
          @click="updateOrderStatus('ready')"
        >
          <a href="#">Waiting for Pick</a
          ><span v-if="orderCount">{{ orderCount.ready }}</span>
        </li>
        <li
          class="pick"
          data-related="dm-delivery-in-progress"
          @click="updateOrderStatus('in-progress')"
        >
          <a href="#">Delivery - In Progress</a
          ><span v-if="orderCount">{{ orderCount['in-progress'] }}</span>
        </li>
        <li
          class="dm-delivered"
          data-related="dm-delivered"
          @click="updateOrderStatus('delivered')"
        >
          <a href="#">Delivered</a
          ><span v-if="orderCount">{{ orderCount.delivered }}</span>
        </li>
      </ul>
    </div>
    <div class="dm-delivery-assistants">
      <button
        id="dm-assistant"
        data-toggle="modal"
        data-target="#delivery-assistant"
      >
        <span
          ><img src="img/other/delivery-assistant.png" alt="delivery"
        /></span>
        Delivery Assistant
      </button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'DMHomeDeliverySubMenu',
  methods: {
    updateOrderStatus: function(getOrderStatus) {
      this.$store.dispatch(
        'deliveryManager/updateDMOrderStatus',
        getOrderStatus
      )
    },
  },
  computed: {
    ...mapState({
      orderCount: state => state.deliveryManager.orderCounts,
    }),
  },
}
</script>

<style scoped></style>
