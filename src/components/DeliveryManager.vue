<template>
  <div>
    <!-- Breadcrumbs-->
    <SystemNavigation />

    <!--body content left-->
    <div class="content-wrapper" id="dm-content-wrapper">
      <div class="inner-content-dm">
        <DMMenu />

        <HomeDelivery />

        <TakeAway />

        <FutureOrder />
      </div>
    </div>

    <!-- Delivery Manager screen -->
    <DMOrderDetails />
    <!-- End Delivery maanger screen -->

    <!-- Delivery Assistant popup -->
    <DeliveryAssistant />
    <!-- End Delivery Assitant popup -->

    <div class="modal-backdrop fade show" id="transparent-screen"></div>
  </div>
</template>

<script>
import SystemNavigation from '@/components/SystemNavigation'
import DMMenu from '@/components/deliveryManager/header/DMMenu'
import DeliveryAssistant from '@/components/deliveryManager/popups/DeliveryAssistant'
import DMOrderDetails from '@/components/deliveryManager/popups/DMOrderDetails'
import HomeDelivery from '@/components/deliveryManager/HomeDelivery'
import TakeAway from '@/components/deliveryManager/TakeAway'
import FutureOrder from '@/components/deliveryManager/FutureOrder'

export default {
  name: 'DeliveryManager',
  components: {
    SystemNavigation,
    DMMenu,
    HomeDelivery,
    TakeAway,
    FutureOrder,
    DeliveryAssistant,
    DMOrderDetails,
  }
}
</script>
