<template>
  <div id="delivery-area-address">
    <div class="order-address-details">
      <p>Select Delivery Address</p>
      <button
        id="cu-add-address"
        data-toggle="modal"
        data-target="#add_address"
        data-dismiss="modal"
        @click="setDefaultSettingsGlobalAddUpdate({ nearest_landmark: '' })"
      >
        + Add address
      </button>
    </div>
    <div class="location-delivery-area-address">
      <CustomerDeliveryArea :buttons="true" />
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import CustomerDeliveryArea from '../CustomerAddress/CustomerDeliveryArea'

export default {
  name: 'CustomerDeliveryAddress',
  components: {
    CustomerDeliveryArea,
  },
  methods: {
    ...mapActions('customer', ['setDefaultSettingsGlobalAddUpdate']),
  },
}
</script>
