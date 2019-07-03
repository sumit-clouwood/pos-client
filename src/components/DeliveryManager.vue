<template>
  <div class="new-pos">
    <div class="dm-screen-wrap">
      <div class="left-fixed-menu">
        <h3 class="page-title" style="">New Orders</h3>
        <div class="breadcrump-wrapper">
          <ul class="ullist-breadcrump">
            <li><a href="#">DELIVERY</a></li>
            <li><a href="#">DEFAULT BRAND</a></li>
            <li><a href="#">HOME DELIVERIES</a></li>
            <li class="active"><a href="#">NEW ORDERS</a></li>
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
  },
}
</script>
<style lang="css" scoped>
.dm-screen-wrap {
  display: grid;
  grid-template-columns: 2fr 1fr;
  /* padding: 0.625rem 1.25rem 0.9375rem 2.1875rem; */
  -webkit-box-shadow: 0 0px 3px rgba(23,23,32,0.05), 0 0px 10px rgba(23,23,32,0.05), 0 0px 20px rgba(23,23,32,0.05);
  box-shadow: 0 0px 3px rgba(23,23,32,0.05), 0 0px 10px rgba(23,23,32,0.05), 0 0px 20px rgba(23,23,32,0.05);
  z-index: 2;
  overflow: hidden;
  background-color: #fff;
  padding: 0.625rem 1.25rem 0.9375rem 2.1875rem;
}
ul.ullist-breadcrump > li {
  display: inline-block;
  padding-right: 1.3rem;
  position:relative;
}
ul.ullist-breadcrump > li > a {
  color: rgba(63,74,74,0.3);
  text-transform: uppercase;
  font-size: 0.77rem;
  letter-spacing: 0.15rem;
  font-weight: 700;
}
ul.ullist-breadcrump > li:after {
  content: ">";
  position: absolute;
  right: 6px;
  top: 1px;
  color: rgba(63,74,74,0.3);
}
ul.ullist-breadcrump > li.active:after{
  content: none;
}
ul.ullist-breadcrump > li.active > a{
  color: rgba(63,74, 74, 0.8);
  text-decoration: underline;
}
</style>
