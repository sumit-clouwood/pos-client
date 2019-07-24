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
          })
        "
      >
        {{ _t('Home Delivery Orders') }}
      </button>
      <button
        class="btn btn-success"
        data-related="take-away-order"
        @click="
          updateDMOrderStatus({
            orderStatus: 'new',
            collected: 'no',
            pageId: 'takeaway_new',
            title: _t('New Orders'),
            dataRelated: 'take-away-order',
          })
        "
      >
        {{ _t('Take Away Orders') }}
      </button>
      <button
        class="btn btn-success"
        data-related="future-order"
        @click="
          updateDMOrderStatus({
            orderStatus: 'future-order',
            collected: 'no',
            pageId: 'future',
            title: _t('Future Orders'),
            dataRelated: 'future-order',
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
// import Branches from '@/components/deliveryManager/partial/Branches'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'DMMenu',
  components: {
    // Branches,
  },
  computed: {
    ...mapGetters('location', ['_t', 'permitted']),
  },
  methods: {
    ...mapActions('deliveryManager', ['updateDMOrderStatus']),
  },
}
</script>

<style scoped></style>
