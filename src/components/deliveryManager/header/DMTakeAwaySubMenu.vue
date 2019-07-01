<template>
  <div class="dm-order-details-wrap">
    <div class="dm-delivery-details-btn">
      <ul class="dm-ullist">
        <li
          class="active"
          data-related="new-Collections"
          @click="
            updateOrderStatus({ orderStatus: 'in-progress', collected: 'no' })
          "
        >
          <a href="javascript:void(0)">New Order</a
          ><span v-if="orderCount">{{ orderCount.take_away.new_order }}</span>
        </li>
        <li
          class="pick"
          data-related="Waiting-for-Collections"
          @click="updateOrderStatus({ orderStatus: 'ready', collected: 'no' })"
        >
          <a href="javascript:void(0)">Waiting for Collections</a
          ><span v-if="orderCount">{{
            orderCount.take_away.Waiting_for_collection
          }}</span>
        </li>
        <li
          class="pick"
          data-related="collected"
          @click="
            updateOrderStatus({ orderStatus: 'finished', collected: 'yes' })
          "
        >
          <a href="javascript:void(0)">Collected</a
          ><span v-if="orderCount">{{ orderCount.take_away.collected }}</span>
        </li>
      </ul>
    </div>
    <div class="dm-delivery-assistants">
      <p style="height: 34px;"></p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'DMTakeAwaySubMenu',
  methods: {
    updateOrderStatus: function(orderStatus) {
      this.$store.dispatch('deliveryManager/updateDMOrderStatus', orderStatus)
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
