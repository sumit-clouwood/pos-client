<template>
  <div v-if="addresses.length" class="add-to-order-wrapper">
    <div
      v-for="(address, index) in addresses"
      :key="index"
      class="order-location option-contain"
      :class="{ active: activeIndex === index }"
      @click="setActiveCustomer(address, index)"
    >
      <p>
        <span>{{ locationName }}</span>
        {{ address.flat_number }},{{ getDeliveryArea(address.delivery_area) }},
        {{ address.city }},
        {{ country }}
      </p>
    </div>
    <Buttons v-if="buttons" />
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import Buttons from './Buttons'
export default {
  name: 'CustomerDeliveryAreas',
  props: {
    buttons: Boolean,
    addresses: Array,
  },
  components: {
    Buttons,
  },
  data: function() {
    return { activeIndex: null }
  },
  computed: {
    ...mapState('location', ['locationName']),
    ...mapState({
      country: state =>
        state.location.locationData
          ? state.location.locationData.country_name
          : '',
    }),
    ...mapGetters('location', ['getDeliveryArea']),
  },
  methods: {
    setActiveCustomer(address, index) {
      const selectedCustomerAddressId = address._id
      const selectedCustomerAddressArea = this.getDeliveryArea(
        address.delivery_area
      )

      this.activeIndex = index
      this.selectedAddress(
        selectedCustomerAddressId,
        selectedCustomerAddressArea
      )
    },
    ...mapActions('customer', ['selectedAddress']),
  },
}
</script>
