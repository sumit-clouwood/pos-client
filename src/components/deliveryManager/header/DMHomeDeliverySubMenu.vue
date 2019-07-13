<template>
  <div class="dm-order-details-wrap">
    <div class="dm-delivery-details-btn">
      <ul class="dm-ullist">
        <li
          class="active"
          data-related="dm-new-order"
          @click="
            updateOrderStatus({
              orderStatus: 'in-progress',
              collected: 'no',
              pageId: 'home_delivery_new',
              title: _t('New Orders'),
            })
          "
        >
          <a href="javascript:void(0)">{{ _t('New Orders') }}</a
          ><span v-if="orderCount">{{ orderCount.running }}</span>
        </li>
        <li
          class="pick"
          data-related="dm-waiting-for-pick"
          @click="
            updateOrderStatus({
              orderStatus: 'ready',
              collected: 'no',
              pageId: 'home_delivery_pick',
              title: _t('Waiting for Pick'),
            })
          "
        >
          <a href="javascript:void(0)">{{ _t('Waiting for Pick') }}</a
          ><span v-if="orderCount">{{ orderCount.ready }}</span>
        </li>
        <li
          class="pick"
          data-related="dm-delivery-in-progress"
          @click="
            updateOrderStatus({
              orderStatus: 'on-a-way',
              collected: 'no',
              pageId: 'home_delivery_in_progress',
              title: _t('Delivery - In Progress'),
            })
          "
        >
          <a href="javascript:void(0)">{{ _t('Delivery - In Progress') }}</a
          ><span v-if="orderCount">{{ orderCount['in-progress'] }}</span>
        </li>
        <li
          class="dm-delivered"
          data-related="dm-delivered"
          @click="
            updateOrderStatus({
              orderStatus: 'finished',
              collected: 'no',
              pageId: 'home_delivery_finished',
              title: _t('Delivered'),
            })
          "
        >
          <a href="javascript:void(0)">{{ _t('Delivered') }}</a
          ><span v-if="orderCount">{{ orderCount.delivered }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'DMHomeDeliverySubMenu',
  methods: {
    updateOrderStatus: function(orderStatus) {
      this.$store.commit('deliveryManager/SET_DM_ORDERS', [])
      this.$store.commit('deliveryManager/LIST_TYPE', orderStatus.title)
      this.$store.dispatch('deliveryManager/updateDMOrderStatus', orderStatus)
    },
  },
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState('deliveryManager', ['listType']),
    ...mapState({
      orderCount: state => state.deliveryManager.orderCounts,
    }),
  },
}
</script>

<style scoped></style>
