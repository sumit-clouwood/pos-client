<template>
  <div>
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
    let getBody = $('body')
    getBody.removeAttr('class')
    getBody.attr('class', 'fixed-nav sticky-footer bg-dark dm-manager')
  },
}
</script>

<style lang="css">
@import '../../src/assets/css/style.css';
@import '../../public/css/deliveryManager.css';
</style>
