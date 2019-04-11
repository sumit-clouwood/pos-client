<template>
    <div class="contain-body-class">
        <DeliveryManager />
    </div>
</template>

<script>
import DeliveryManager from '@/components/DeliveryManager'
export default {
  name: 'DeliveryManagerInit',
  components: {
    DeliveryManager

  }
}
</script>

<style lang="scss">
   @import '../assets/sass/deliveryManager';
</style>