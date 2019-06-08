<template>
  <div class="dm-order-screens dm-order-screen-change" id="home-delivery-order">
    <DMHomeDeliverySubMenu />
    <div class="dm-ready-order-wrapper" id="dm-new-order">
      <DMItem :actionDetails="readyDetails" />
    </div>
    <div class="dm-ready-order-wrapper" id="dm-waiting-for-pick">
      <div class="select-driver">
        <button
          type="button"
          class="btn dropdown-toggle"
          data-toggle="dropdown"
        >
          Select Driver
        </button>
        <ul class="dropdown-menu">
          <li v-for="(driver, index) in driverList" :key="index">
            <!--<img
              :src="driver.driverImagePath"
              class="pull-left driverImg"
              @error="imageLoadError()"
            />-->
            <a href="#" @click="selectedDriver(driver)">{{ driver.name }}</a>
          </li>
        </ul>
        <!-- <p>Show Available Drivers</p> -->
      </div>

      <DMItem :actionDetails="waitingOrder" />
    </div>
    <div class="dm-ready-order-wrapper" id="dm-delivery-in-progress">
      <DMItem :actionDetails="deliveredDetails" />
    </div>

    <DMDeliveredItem />
  </div>
</template>

<script>
import DMHomeDeliverySubMenu from '@/components/deliveryManager/header/DMHomeDeliverySubMenu'
import DMItem from '@/components/deliveryManager/content/DMItem'
import DMDeliveredItem from '@/components/deliveryManager/content/DMDeliveredItem'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'HomeDelivery',
  data() {
    return {
      readyDetails: {
        moreDetails: true,
        action: 'Ready',
        nextOrderStatus: 'ready',
      },
      waitingOrder: {
        moreDetails: false,
        action: '',
        driverId: '',
        nextOrderStatus: 'in-progress',
      },
      deliveredDetails: {
        moreDetails: true,
        action: 'Ready',
        nextOrderStatus: 'delivered',
      },
    }
  },
  components: {
    DMHomeDeliverySubMenu,
    DMItem,
    DMDeliveredItem,
  },
  computed: {
    ...mapState({
      driverList: state => state.location.locationData.drivers,
    }),
  },

  mounted() {
    this.$store.dispatch('deliveryManager/fetchDMOrderDetail')
  },

  methods: {
    selectedDriver: function(driver) {
      this.waitingOrder.action = driver.name
      this.waitingOrder.driverId = driver._id
      this.selectDriver(driver)
    },
    ...mapActions('deliveryManager', ['selectDriver']),
    /*imageLoadError() {
      for (let i = 0; i < document.images.length; i++) {
        document.images[i].remove()
      }
    },*/
  },
}
</script>

<style scoped>
.driverImg {
  padding-left: 14px;
  float: left;
}
</style>
