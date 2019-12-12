<template>
  <div class="dm-order-details-wrap">
    <div class="dm-delivery-details-btn">
      <ul class="dm-ullist">
        <li
          v-if="permitted('home_delivery_new', 'delivery_home')"
          data-related="dm-new-order"
          :class="{
            active:
              listType == _t('New Orders') &&
              isPermitted(PERMISSIONS.ORDERS_HOME_DELIVERY_NEW),
          }"
          @click="
            updateOrderStatus({
              orderStatus: 'in-progress',
              collected: 'no',
              pageId: 'home_delivery_new',
              title: _t('New Orders'),
              dataRelated: 'dm-new-order',
              section: 'crm',
            })
          "
        >
          <a role="button">{{ _t('New Orders') }}</a
          ><span v-if="orderCount">{{ orderCount.running }}</span>
        </li>
        <li
          v-if="permitted('home_delivery_pick', 'delivery_home')"
          class="pick"
          data-related="dm-waiting-for-pick"
          :class="{
            active:
              listType == _t('Waiting for Pick') &&
              isPermitted(PERMISSIONS.ORDERS_HOME_DELIVERY_PICK),
          }"
          @click="
            updateOrderStatus({
              orderStatus: 'ready',
              collected: 'no',
              pageId: 'home_delivery_pick',
              title: _t('Waiting for Pick'),
              dataRelated: 'dm-waiting-for-pick',
              section: 'crm',
            })
          "
        >
          <a role="button">{{ _t('Waiting for Pick') }}</a
          ><span v-if="orderCount">{{ orderCount.ready }}</span>
        </li>
        <li
          v-if="permitted('home_delivery_in_progress', 'delivery_home')"
          class="pick"
          :class="{
            active:
              listType == _t('Delivery - In Progress') &&
              isPermitted(PERMISSIONS.ORDERS_HOME_DELIVERY_IN_PROGRESS),
          }"
          data-related="dm-delivery-in-progress"
          @click="
            updateOrderStatus({
              orderStatus: 'on-a-way',
              collected: 'no',
              pageId: 'home_delivery_in_progress',
              title: _t('Delivery - In Progress'),
              dataRelated: 'dm-delivery-in-progress',
              section: 'crm',
            })
          "
        >
          <a role="button">{{ _t('Delivery - In Progress') }}</a
          ><span v-if="orderCount">{{ orderCount['in-progress'] }}</span>
        </li>
        <li
          v-if="permitted('home_delivery_finished', 'delivery_home')"
          class="dm-delivered"
          data-related="dm-delivered"
          :class="{
            active:
              listType == _t('Delivered') &&
              isPermitted(PERMISSIONS.ORDERS_HOME_DELIVERY_FINISHED),
          }"
          @click="
            updateOrderStatus({
              orderStatus: 'finished',
              collected: 'no',
              pageId: 'home_delivery_finished',
              title: _t('Delivered'),
              dataRelated: 'dm-delivered',
              section: 'crm',
            })
          "
        >
          <a role="button">{{ _t('Delivered') }}</a
          ><span v-if="orderCount">{{ orderCount.delivered }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
/*global deliveryTabs*/
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'DMHomeDeliverySubMenu',
  methods: {
    updateOrderStatus: function(orderStatus) {
      this.$store.commit('deliveryManager/LIST_TYPE', orderStatus.title)
      this.$store.commit('deliveryManager/SECTION', orderStatus.section)
      this.$store.dispatch('deliveryManager/updateDMOrderStatus', orderStatus)
      deliveryTabs(orderStatus.dataRelated)
    },
  },
  computed: {
    ...mapGetters('location', ['_t', 'permitted']),
    ...mapState('deliveryManager', ['listType']),
    ...mapState({
      orderCount: state => state.deliveryManager.orderCounts,
    }),
  },
}
</script>

<style scoped></style>
