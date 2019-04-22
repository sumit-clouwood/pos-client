<template>
  <div class="select-driver">
    <button type="button" class="btn dropdown-toggle" data-toggle="dropdown">
      Select Driver
    </button>
    <ul class="dropdown-menu">
      <li v-for="(driver, index) in driverList" :key="index">
        <img
          :src="driver.driverImagePath"
          class="pull-left driverImg"
          @error="imageLoadError()"
        />
        <a href="#" @click="selectedDriver(driver)">{{ driver.name }}</a>
      </li>
    </ul>
    <!-- <p>Show Available Drivers</p> -->
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'DMDrivers',
  data() {
    return {
      waitingOrder: {
        moreDetails: false,
        action: '',
        driverId: '',
        nextOrderStatus: 'in-progress',
      },
    }
  },
  computed: {
    ...mapState({
      driverList: state => state.location.locationData.drivers,
    }),
  },
  methods: {
    selectedDriver: function(driver) {
      this.waitingOrder.action = driver.name
      this.waitingOrder.driverId = driver._id
      this.selectDriver(driver)
    },
    ...mapActions('deliveryManager', ['selectDriver']),
  },
}
</script>

<style scoped></style>
