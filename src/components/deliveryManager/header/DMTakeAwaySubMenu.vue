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
          <a role="button">New Order</a
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
          <a role="button">Waiting for Collections</a
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
          <a role="button">Collected</a
          ><span v-if="orderCount">{{ orderCount.take_away.collected }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
/*global $, deliveryTabs*/
import { mapState, mapGetters } from 'vuex'
import DateTime from '@/mixins/DateTime'

export default {
  name: 'DMTakeAwaySubMenu',
  methods: {
    updateOrderStatus: function(orderStatus) {
      this.$store.commit('deliveryManager/LIST_TYPE', orderStatus.title)
      this.$store.commit('deliveryManager/SECTION', orderStatus.section)
      this.$store.dispatch('deliveryManager/updateDMOrderStatus', orderStatus)
      deliveryTabs(orderStatus.dataRelated)
      var gt = this
      $('.dm-ready-order-wrapper table tbody tr').each(function() {
        let orderTime = $(this)
          .find('#storerunningtime')
          .val()
        let orderTimer = gt.getTimer(orderTime)
        $(this)
          .find('.order-delivery-area')
          .text(orderTimer)
        // eslint-disable-next-line no-console
        console.log(orderTimer)
      })
    },
    getTimer(dateTime) {
      return this.orderTimer(dateTime, this.timezoneString)
    },
  },
  mixins: [DateTime],
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
