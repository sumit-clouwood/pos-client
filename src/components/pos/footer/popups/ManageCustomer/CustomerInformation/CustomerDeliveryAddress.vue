<template>
  <div id="delivery-area-address">
    <div class="order-address-details">
      <p>{{ _t('Delivery Address:') }}</p>
      <button
        id="cu-add-address"
        data-toggle="modal"
        data-target="#add_address"
        data-dismiss="modal"
        @click="setDefaultSettingsGlobalAddUpdate({ nearest_landmark: '' })"
      >
        {{ _t('+ Add Address') }}
      </button>
    </div>
    <div class="location-delivery-area-address">
      <CustomerDeliveryArea :buttons="true" />
    </div>
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
