<template>
  <div id="delivery-area-address" v-if="deliveryAddresses">
    <div class="order-address-details">
      <p>Select Delivery Address</p>
      <button
        id="cu-add-address"
        data-toggle="modal"
        data-target="#add_address"
        data-dismiss="modal"
      >
        + Add address
      </button>
    </div>
    <div class="location-delivery-area-address">
      <CustomerDeliveryArea
        v-for="(address, index) in deliveryAddresses"
         class="cu-delivery-area-location"
        :buttons="true"
        :address="address"
        :index="index"
        :key="index"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import CustomerDeliveryArea from '../CustomerAddress/customerDeliveryArea'
export default {
  name: 'CustomerDeliveryAddress',
  components: {
    CustomerDeliveryArea,
  },
  computed: {
    ...mapState({
      deliveryAddresses: state =>
        state.customer.customer.customer_list
          ? state.customer.customer.customer_list.customer_details
          : false,
    }),
  },
}
</script>
