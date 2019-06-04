<template>
  <div class="location-delivery-area-address" v-if="addresses.length">
    <div
      v-for="(address, index) in addresses"
      :key="index"
      class="order-location option-contain cu-delivery-area-location"
      :class="{ active: activeIndex === index }"
      @click="setActiveCustomer(address, index)"
    >
      <p>
        <span>{{ _t('Store:') }} {{ storeName }}</span
        ><br />
        <span
          >{{ _t('Area:') }}
          {{ getDeliveryArea(address.delivery_area_id) }}</span
        ><br />
        {{ address.flat_number }}, {{ address.building }}, {{ address.street }},
        {{ address.city }}
      </p>
      <Buttons v-if="buttons" :id="address._id.$oid" />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import Buttons from './Buttons'

export default {
  name: 'CustomerDeliveryArea',
  props: {
    buttons: Boolean,
  },
  components: {
    Buttons,
  },
  data: function() {
    return { activeIndex: null }
  },
  computed: {
    ...mapState('location', ['location']),
    ...mapState({
      addresses: state =>
        state.customer.customer
          ? state.customer.customer.customer_addresses
          : false,
    }),
    ...mapState({
      storeName: state => state.location.store.name,
    }),
    /*...mapState({
      country: state =>
        state.location.locationData
          ? state.location.locationData.country_name
          : '',
    }),*/
    ...mapGetters('customer', ['getDeliveryArea']),
    ...mapGetters('location', ['_t']),
  },
  methods: {
    setActiveCustomer(address, index) {
      const selectedCustomerAddressId = address.delivery_area_id
      const selectedCustomerAddressArea = this.getDeliveryArea(
        selectedCustomerAddressId
      )
      this.activeIndex = index
      this.selectedAddress({
        id: selectedCustomerAddressId,
        delivery_area: selectedCustomerAddressArea,
      })
    },
    ...mapActions('customer', ['selectedAddress']),
  },
}
</script>
<style scoped lang="scss">
.order-location.option-contain {
  padding: 10px;
}
.option-contain {
  width: unset;
}

.cu-location-select {
  position: absolute;
  bottom: 0;
  right: 5px;
}
</style>
