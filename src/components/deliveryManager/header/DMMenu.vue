<template>
    <div class="dm-btn-wrap">
        <div class="left-btn-wrap">
            <button class="active dm-btn" data-related="home-delivery-order" @click="updateDMOrderStatus('running')">Home Delivery Orders</button>
            <button class="dm-btn" data-related="take-away-order" @click="updateDMOrderStatus('takeaway')">Take Away Orders</button>
            <button class="dm-btn" data-related="future-order" @click="updateDMOrderStatus('future')">Future Orders</button>
        </div>

        <Branches />

    </div>
</template>

<script>
import Branches from '@/components/partial/Branches'
import { mapActions } from 'vuex'

export default {
  name: 'DMMenu',
  components: {
    Branches,
  },
  methods: {
    ...mapActions('deliveryManager', ['updateDMOrderStatus'])
  }
}
</script>

<style scoped>

</style>