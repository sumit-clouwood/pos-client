<template>
  <div class="dm-order-details-wrap">
    <div class="dm-delivery-details-btn">
      <ul class="dm-ullist">
        <li
          v-if="
            permitted('home_delivery_new', 'delivery_home') &&
              availableModules.includes(CONST.MODULE_MANUAL_ACCEPTANCE)
          "
          data-related="dm-order-acceptance"
          :class="{ active: listType == _t('Awaiting Acceptance') }"
          @click="
            updateOrderStatus({
              orderStatus: 'in-progress',
              collected: 'no',
              pageId: 'home_delivery_acceptance',
              title: _t('Awaiting Acceptance'),
              dataRelated: 'dm-order-acceptance',
              section: 'crm',
            })
          "
        >
          <a role="button">{{ _t('Awaiting Acceptance') }}</a>
          <span v-if="orderCount">{{ orderCount.running }}</span>
        </li>
        <li
          v-if="permitted('home_delivery_new', 'delivery_home')"
          data-related="dm-new-order"
          :class="{ active: listType == _t('New Orders') }"
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
          <a role="button">{{ _t('Preparing') }}</a>
          <span v-if="orderCount">{{ orderCount.running }}</span>
        </li>
        <li
          v-if="permitted('home_delivery_pick', 'delivery_home')"
          class="pick"
          data-related="dm-waiting-for-pick"
          :class="{ active: listType == _t('Waiting for Pick') }"
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
          <a role="button">{{ _t('Waiting for Pick') }}</a>
          <span v-if="orderCount">{{ orderCount.ready }}</span>
        </li>
        <li
          v-if="permitted('home_delivery_in_progress', 'delivery_home')"
          class="pick"
          :class="{ active: listType == _t('Delivery - In Progress') }"
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
          <a role="button">{{ _t('Delivery - In Progress') }}</a>
          <span v-if="orderCount">{{ orderCount['in-progress'] }}</span>
        </li>
        <li
          v-if="permitted('home_delivery_finished', 'delivery_home')"
          class="dm-delivered"
          data-related="dm-delivered"
          :class="{ active: listType == _t('Delivered') }"
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
          <a role="button">{{ _t('Delivery - Finished') }}</a>
          <span v-if="orderCount">{{ orderCount.delivered }}</span>
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
    ...mapState('context', ['availableModules']),
    ...mapState({
      orderCount: state => state.deliveryManager.orderCounts,
    }),
  },
}
</script>

<style scoped></style>
