<template>
  <div
    class="location-delivery-area-address color-dashboard-background"
    :class="classAccess"
    v-if="getCustomerAddresses.length"
  >
    <div
      v-for="(address, index) in getCustomerAddresses"
      :key="index"
      class="order-location option-contain cu-delivery-area-location color-dashboard-background"
      :class="{ active: activeIndex === index }"
      @click="setActiveCustomer(address, index)"
    >
      <div>
        <p class="color-text-invert">
          <!--<span
            v-if="!getDeliveryArea(address.delivery_area_id)"
            class="text-danger pull-right"
          >
            Inactive
          </span>-->
          <span class="color-text">{{ _t('Store:') }} {{ storeName }}</span
          ><br />
          <span class="color-text-invert">
            {{ _t('Area:') }}
            {{ getDeliveryArea(address.delivery_area_id) }}
          </span>
          <br />
          {{ address.flat_number }}, {{ address.building }},
          {{ address.street }},
          {{ address.city }}
        </p>
        <Buttons v-if="buttons" :id="address._id.$oid" />
      </div>
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
    classAccess: String,
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
    ...mapState('checkoutForm', ['msg']),

    /*...mapState({
      country: state =>
        state.location.locationData
          ? state.location.locationData.country_name
          : '',
    }),*/
    ...mapGetters('customer', ['getDeliveryArea']),
    ...mapGetters('location', ['_t']),
    ...mapGetters('customer', ['getCustomerAddresses']),
  },
  methods: {
    setActiveCustomer(address, index) {
      address.delivery_area = this.getDeliveryArea(address.delivery_area_id)
      this.activeIndex = index
      this.selectedAddress(address)
      if (this.msg && this.msg.data.length > 0) {
        this.msg.data = ''
      }
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
.addOrders {
  overflow-y: auto !important;
  max-height: 21rem;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  touch-action: auto;
  display: inline-grid;
  grid-template-columns: 1fr 1fr;
  margin: 0 auto;
  text-align: center;
  width: 100%;
  position: relative;
  grid-gap: 1.25rem;
}
</style>
