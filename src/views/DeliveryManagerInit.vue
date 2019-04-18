<template>
  <div class="contain-body-class">
    <DeliveryManager />
  </div>
</template>

<script>
/* global $ */
import DeliveryManager from '@/components/DeliveryManager'
export default {
  name: 'DeliveryManagerInit',
  components: {
    DeliveryManager,
  },
  mounted() {
    $('body').addClass('dm-manager')
    $('body').removeClass('dinein')
  },
}
</script>

<style lang="scss">
@import '../assets/sass/deliveryManager';
</style>
