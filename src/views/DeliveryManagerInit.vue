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
    getBody.attr('class', 'fixed-nav sticky-footer dm-manager')
  },
}
</script>

<style lang="css">
/*@import '../../src/assets/css/style.css?var=1.0.0';*/
@import '../../src/assets/css/delivery-manager/delivery_manager.css?var=1.0.0';
</style>
