<template>
  <div class="dm-btn-wrap">
    <div class="left-btn-wrap">
      <button
        class="active btn btn-success"
        data-related="home-delivery-order"
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
        {{ _t('Home Delivery Orders') }}
      </button>
      <button
        class="btn btn-success"
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
        {{ _t('Take Away Orders') }}
      </button>
      <button
        class="btn btn-success"
        data-related="future-order"
        @click="
          updateOrderStatus({
            orderStatus: 'future-order',
            collected: 'no',
            pageId: 'future',
            title: _t('Future Orders'),
            dataRelated: 'future-order',
            section: 'future',
          })
        "
      >
        {{ _t('Future Orders') }}
      </button>
    </div>

    <!-- <Branches /> -->
  </div>
</template>

<script>
/*global deliveryTabs*/
// import Branches from '@/components/deliveryManager/partial/Branches'
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  name: 'DMMenu',
  components: {
    // Branches,
  },
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState('deliveryManager', ['section']),
  },
  methods: {
    updateOrderStatus(orderStatus) {
      this.$store.commit('deliveryManager/LIST_TYPE', orderStatus.title)
      this.$store.commit('deliveryManager/SECTION', orderStatus.section)
      if (orderStatus.section) {
        this.$store.dispatch('deliveryManager/updateDMOrderStatus', orderStatus)
        deliveryTabs(orderStatus.dataRelated)
      }
    },
    ...mapActions('deliveryManager', ['updateDMOrderStatus']),
  },
}
</script>

<style scoped></style>
