<template>
  <div class="dm-btn-wrap">
    <div class="left-btn-wrap">
      <button
        class="active btn btn-success"
        data-related="home-delivery-order"
        @click="
          updateDMOrderStatus({ orderStatus: 'running', collected: 'no' })
        "
      >
        Home Delivery Orders
      </button>
      <button
        class="btn btn-success"
        data-related="take-away-order"
        @click="updateDMOrderStatus({ orderStatus: 'new', collected: 'no' })"
      >
        Take Away Orders
      </button>
      <button
        class="btn btn-success"
        data-related="future-order"
        @click="
          updateDMOrderStatus({ orderStatus: 'future-order', collected: 'no' })
        "
      >
        Future Orders
      </button>
    </div>

    <Branches />
  </div>
</template>

<script>
import Branches from '@/components/deliveryManager/partial/Branches'
import { mapActions } from 'vuex'

export default {
  name: 'DMMenu',
  components: {
    Branches,
  },
  methods: {
    ...mapActions('deliveryManager', ['updateDMOrderStatus']),
  },
}
</script>

<style scoped></style>
