<template>
<!--<body class="fixed-nav sticky-footer bg-dark dm-manager" id="page-top">-->
    <!-- Navigation-->
    <div class="contain-body-class">
        <DeliveryManager />
    </div>
<!--</body>-->
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