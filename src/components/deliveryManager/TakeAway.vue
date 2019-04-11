<template>
  <div class="dm-order-take-away dm-order-screen-change" id="take-away-order">
    <DMTakeAwaySubMenu />

    <div class="dm-ready-order-wrapper" id="Waiting-for-Collections">
      <DMItem :actionDetails="actionDetailsWaiting" />
    </div>
    <div class="dm-ready-order-wrapper" id="collected">
      <DMItem :actionDetails="actionDetailsCollected" />
    </div>
  </div>
</template>

<script>
import DMItem from '@/components/deliveryManager/content/DMItem'
import DMTakeAwaySubMenu from '@/components/deliveryManager/header/DMTakeAwaySubMenu'
export default {
  name: 'TakeAway',
  data() {
    return {
      actionDetailsWaiting: { moreDetails: true, action: 'Collected' },
      actionDetailsCollected: { moreDetails: true, action: 'Delivered' },
    }
  },
  components: {
    DMTakeAwaySubMenu,
    DMItem,
  },
}
</script>

<style scoped></style>
