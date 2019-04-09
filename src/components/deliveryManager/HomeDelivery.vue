<template>
<div class="dm-order-screens dm-order-screen-change" id="home-delivery-order">

    <DMHomeDeliverySubMenu />
    <div class="dm-ready-order-wrapper" id="dm-new-order">
        <DMItem :actionDetails="actionDetails" :itemDetails="itemDetails" />
    </div>

    <div class="dm-ready-order-wrapper" id="dm-waiting-for-pick">
        <div class="select-driver"><button type="button" class="btn dropdown-toggle" data-toggle="dropdown">Select Driver</button>
            <ul class="dropdown-menu">
                <li><a href="#">Test Branch</a></li>
                <li><a href="#">Test Branch</a></li>
                <li><a href="#">Test Branch</a></li>
            </ul>
            <!-- <p>Show Available Drivers</p> -->
        </div>

        <DMItem :actionDetails="actionDetails" :itemDetails="itemDetails" />
    </div>
    <div class="dm-ready-order-wrapper" id="dm-delivery-in-progress">
        <DMItem :actionDetails="actionDetails" :itemDetails="itemDetails" />
    </div>
    <div class="dm-ready-order-wrapper" id="dm-delivered">
        <DMDeliveredItem />
    </div>
</div>
</template>

<script>
import DMHomeDeliverySubMenu from '@/components/deliveryManager/header/DMHomeDeliverySubMenu'
import DMItem from '@/components/deliveryManager/content/DMItem'
import DMDeliveredItem from '@/components/deliveryManager/content/DMDeliveredItem'
export default {
  name: 'HomeDelivery',
  data() {
    return {
      itemDetails: {},
      actionDetails: {'moreDetails': true, 'action': 'Ready'}
    }
  },
  components: {
    DMHomeDeliverySubMenu,
    DMItem,
    DMDeliveredItem,
  }
}
</script>

<style scoped>

</style>