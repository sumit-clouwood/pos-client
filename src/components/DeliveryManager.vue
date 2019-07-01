<template>
  <div class="new-pos">
    <div class="dm-screen-wrap">
      <div id="left-fixed-menu">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 32 32"
        >
          <path
            fill="#FFF"
            fill-rule="evenodd"
            d="M2 0h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm13 0h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm13 0h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zM2 13h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2zm13 0h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2zm13 0h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2zM2 26h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2zm13 0h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2zm13 0h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2z"
          />
        </svg>
      </div>

      <DMTopRightNav />

      <DMTopLeftNav />
    </div>
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
import DMTopRightNav from '@/components/deliveryManager/DMTopRightNav'
import DMTopLeftNav from '@/components/deliveryManager/DMTopLeftNav'
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
    DMTopRightNav,
    DMTopLeftNav,
  },
}
</script>
