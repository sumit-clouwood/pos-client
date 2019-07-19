<template>
  <div class="dm-order-details-wrap">
    <div class="dm-delivery-details-btn">
      <ul class="dm-ullist">
        <li
          :class="{ active: listType == _t('NEW TAKEAWAY ORDERS') }"
          data-related="new-Collections"
          @click="
            updateOrderStatus({
              orderStatus: 'in-progress',
              collected: 'no',
              pageId: 'takeaway_new',
              title: _t('NEW TAKEAWAY ORDERS'),
              dataRelated: 'new-Collections',
              section: 'takeaway',
            })
          "
        >
          <a href="javascript:void(0)">New Order</a
          ><span v-if="orderCount">{{ orderCount.take_away.new_order }}</span>
        </li>
        <li
          class="pick"
          data-related="Waiting-for-Collections"
          :class="{ active: listType == _t('WAITING FOR COLLECTION') }"
          @click="
            updateOrderStatus({
              orderStatus: 'ready',
              collected: 'no',
              pageId: 'takeaway_waiting',
              title: _t('WAITING FOR COLLECTION'),
              dataRelated: 'Waiting-for-Collections',
              section: 'takeaway',
            })
          "
        >
          <a href="javascript:void(0)">Waiting for Collections</a
          ><span v-if="orderCount">{{
            orderCount.take_away.Waiting_for_collection
          }}</span>
        </li>
        <li
          class="pick"
          data-related="collected"
          :class="{ active: listType == _t('COLLECTED') }"
          @click="
            updateOrderStatus({
              orderStatus: 'finished',
              collected: 'yes',
              pageId: 'takeaway_collected',
              title: _t('COLLECTED'),
              dataRelated: 'collected',
              section: 'takeaway',
            })
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
/*global deliveryTabs*/
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'DMTakeAwaySubMenu',
  methods: {
    updateOrderStatus: function(orderStatus) {
      this.$store.commit('deliveryManager/LIST_TYPE', orderStatus.title)
      this.$store.commit('deliveryManager/SECTION', orderStatus.section)
      this.$store.dispatch('deliveryManager/updateDMOrderStatus', orderStatus)
      deliveryTabs(orderStatus.dataRelated)
    },
  },
  computed: {
    ...mapState({
      orderCount: state => state.deliveryManager.orderCounts,
    }),
    ...mapState('deliveryManager', ['listType']),
    ...mapGetters('location', ['_t']),
  },
}
</script>

<style scoped></style>
