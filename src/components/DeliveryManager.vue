<template>
  <div class="new-pos">
    <div class="dm-screen-wrap">
      <div class="left-fixed-menu">
        <h3 class="page-title" style="">{{ _t('New Orders') }}</h3>
        <div class="breadcrump-wrapper">
          <ul class="ullist-breadcrump">
            <li>
              <a href="javascript:void(0)">{{ _t('DELIVERY') }}</a>
            </li>
            <li>
              <a href="javascript:void(0)">{{ brand.name }}</a>
            </li>
            <li>
              <a href="javascript:void(0)">{{ _t('HOME DELIVERIES') }}</a>
            </li>
            <li class="active">
              <a href="javascript:void(0)">{{ listType }}</a>
            </li>
          </ul>
        </div>
      </div>

      <DMTopRightNav />
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

    <!-- End Delivery Assitant popup -->

    <div class="modal-backdrop fade show" id="transparent-screen"></div>
  </div>
</template>

<script>
import SystemNavigation from '@/components/SystemNavigation'
import DMMenu from '@/components/deliveryManager/header/DMMenu'
import DMOrderDetails from '@/components/deliveryManager/popups/DMOrderDetails'
import HomeDelivery from '@/components/deliveryManager/HomeDelivery'
import TakeAway from '@/components/deliveryManager/TakeAway'
import FutureOrder from '@/components/deliveryManager/FutureOrder'
import DMTopRightNav from '@/components/deliveryManager/DMTopRightNav'
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'DeliveryManager',
  components: {
    SystemNavigation,
    DMMenu,
    HomeDelivery,
    TakeAway,
    FutureOrder,
    DMOrderDetails,
    DMTopRightNav,
  },
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState('deliveryManager', ['listType']),
    ...mapState('location', ['brand']),
  },
}
</script>
