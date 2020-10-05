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
      <div v-if="address">
        <p class="color-text-invert">
          <!--<span
            v-if="!getDeliveryArea(address.delivery_area_id)"
            class="text-danger pull-right"
          >
            Inactive
          </span>-->
          <span class="color-text"> {{ _t('Store') }}: {{ storeName }} </span>
          <br />
          <span class="color-text-invert" v-if="address.delivery_area_id">
            {{ _t('Area') }}:
            {{ getDeliveryArea(address.delivery_area_id) }}
          </span>
          <br />
          <span v-if="address.flat_number">{{ address.flat_number }}, </span>
          <span v-if="address.building">{{ address.building }}, </span>
          <span v-if="address.street">{{ address.street }}, </span>
          <span v-if="address.city">{{ address.city }} </span>
          <span v-if="address.permanent_address">
            {{ address.permanent_address }}
          </span>
          <span class="color-text-invert" v-if="address.min_order_value">
            <br />
            {{ _t('Min order') }}
            {{ formatPrice(address.min_order_value) }}
          </span>
          <span
            class="color-text-invert"
            v-if="address.special_order_surcharge"
          >
            <br />
            {{ _t('Surcharge') }}
            {{ formatPrice(address.special_order_surcharge) }}
          </span>
        </p>
        <div class="text-danger" v-if="error">{{ error }}</div>
        <Buttons v-if="buttons" :id="address._id.$oid" />
      </div>
    </div>
  </div>
  <div v-else>
    <p>{{ _t('No address available') }}.</p>
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
    return { activeIndex: null, error: null }
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
    ...mapGetters('customer', [
      'getDeliveryArea',
      'crmAddressFields',
      'getCustomerAddresses',
    ]),
    ...mapGetters('location', ['_t', 'formatPrice']),
    // ...mapGetters('customer', ['getCustomerAddresses']),
  },
  methods: {
    setActiveCustomer(address, index) {
      if (address) {
        address.delivery_area = address.delivery_area_id
          ? this.getDeliveryArea(address.delivery_area_id)
          : ''
        this.activeIndex = index
        this.selectedAddress(address)
          .then(() => {
            if (this.msg && this.msg.message.length > 0) {
              this.msg.message = ''
            }
          })
          .catch(error => (this.error = error))
      }
    },
    ...mapActions('customer', ['selectedAddress']),
  },
}
</script>
<style scoped lang="scss">
@import '@/assets/scss/mixins.scss';

@include responsive(mobile) {
  .addOrders {
    grid-template-columns: 1fr !important;
    padding-bottom: 1rem;
  }
}
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
.order-location.option-contain.cu-delivery-area-location:empty {
  display: none;
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
