<template>
  <div class="new-pos">
    <div class="dm-screen-wrap toggle-nav-content dm-navbar">
      <div class="left-fixed-menu">
        <h3 class="page-title" style="">{{ _t('New Orders') }}</h3>
        <div class="breadcrump-wrapper">
          <ul class="ullist-breadcrump">
            <li>
              <a :href="baseurl('delivery')">{{ _t('DELIVERY') }}</a>
            </li>
            <li>
              <a role="button">{{ brand.name }}</a>
            </li>
            <li>
              <a role="button">{{ _t('HOME DELIVERIES') }}</a>
            </li>
            <li class="active">
              <a role="button">{{ listType }}</a>
            </li>
          </ul>
        </div>
      </div>

      <DMTopRightNav />
    </div>
    <!-- Breadcrumbs-->
    <SystemNavigation />

    <!--body content left-->
    <div class="content-wrapper toggle-nav-content" id="dm-content-wrapper">
      <div class="inner-content-dm">
        <DMMenu />
        <HomeDelivery v-if="section === 'crm'" />

        <TakeAway v-if="section === 'takeaway'" />

        <FutureOrder v-if="section === 'future'" />
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
  methods: {
    baseurl(link) {
      return window.location.href.replace(
        new RegExp('/pos/delivery-manager/.*'),
        '/' + link
      )
    },
  },
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState('deliveryManager', ['listType']),
    ...mapState('deliveryManager', ['section']),
    ...mapState('location', ['brand']),
  },
}
</script>
