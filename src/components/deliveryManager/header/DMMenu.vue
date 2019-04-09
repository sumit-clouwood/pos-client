<template>
    <div class="dm-btn-wrap">
        <div class="left-btn-wrap">
            <button class="active dm-btn" data-related="home-delivery-order">Home Delivery Orders</button>
            <button class="dm-btn" data-related="take-away-order">Take Away Orders</button>
            <button class="dm-btn" data-related="future-order">Future Orders</button>
        </div>

        <Branches />

    </div>
</template>

<script>
import Branches from '@/components/partial/Branches'

export default {
  name: 'DMMenu',
  components: {
    Branches,
  }
}
</script>

<style scoped>

</style>