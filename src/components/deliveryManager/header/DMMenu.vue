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
      <button
        :disabled="!jeeblyOrder.length"
        v-if="
          (brand.jeebly && store.jeebly) ||
            (brand.tawseel && store.tawseel) ||
            (brand.one_click && store.one_click) ||
            (brand.careem && store.careem)
        "
        class="btn btn-success"
        data-related="future-order"
        data-toggle="modal"
        data-target="#Delivery-Service"
      >
        {{ _t('Assign To Delivery Services') }}
      </button>
    </div>

    <!-- <Branches /> -->
  </div>
</template>

<script>
/*global deliveryTabs*/
// import Branches from '@/components/deliveryManager/partial/Branches'
import { mapActions, mapGetters, mapState } from 'vuex'
import DMService from '@/services/data/DeliveryManagerService'

export default {
  name: 'DMMenu',
  components: {
    // Branches,
  },
  computed: {
    ...mapGetters('location', ['_t', 'jeeblyOrder']),
    ...mapState('deliveryManager', ['section', 'selectedDriver']),
    ...mapState('location', ['store', 'jeeblyOrder', 'brand']),
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
    SubmitOrder() {
      let orders = this.jeeblyOrder
      // eslint-disable-next-line no-console
      DMService.assignOrdersToDriver(this.selectedDriver, orders)
        .then(() => {
          this.$store.commit('location/SET_ORDER_JEEBLY', [])
          let dmautoloader = true
          this.$store.dispatch(
            'deliveryManager/fetchDMOrderDetail',
            dmautoloader
          )
        })
        .catch(er => {
          this.err = er.data.error
        })
        .finally()
    },
    ...mapActions('deliveryManager', ['updateDMOrderStatus']),
    ...mapActions('order', ['updateOrderAction']),
  },
}
</script>

<style scoped></style>
