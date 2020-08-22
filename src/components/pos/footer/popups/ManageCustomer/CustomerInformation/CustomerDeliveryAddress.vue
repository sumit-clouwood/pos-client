<template>
  <div id="delivery-area-address">
    <div class="order-address-details color-main add-address-wrapper ">
      <button
        class="color-main color-text-invert add-address-wrapper"
        id="cu-add-address"
        data-toggle="modal"
        data-target="#add_address"
        data-dismiss="modal"
        @click="
          setDefaultSettingsGlobalAddUpdate({
            nearest_landmark: '',
            location_coordinates: { lat: 0, lng: 0 },
          })
        "
      >
        {{ _t('+ Add Address') }}
      </button>
    </div>
    <CustomerDeliveryArea :buttons="true" classAccess />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import CustomerDeliveryArea from '../CustomerAddress/CustomerDeliveryArea'

export default {
  name: 'CustomerDeliveryAddress',
  components: {
    CustomerDeliveryArea,
  },
  computed: {
    ...mapGetters('location', ['_t']),
  },
  methods: {
    ...mapActions('customer', ['setDefaultSettingsGlobalAddUpdate']),
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/pixels_rem.scss';
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';

@include responsive(mobile) {
  .add-address-wrapper {
    width: 100% !important;
  }
}
</style>
