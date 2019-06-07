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
    $('body').removeAttr('class')
    $('body').attr('class', 'fixed-nav sticky-footer bg-dark dm-manager')
  },
}
</script>

<style lang="scss">
/*@import '../assets/sass/deliveryManager';*/
</style>
