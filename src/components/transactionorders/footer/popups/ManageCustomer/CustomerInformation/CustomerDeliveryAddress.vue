<template>
  <div id="delivery-area-address">
    <div class="order-address-details color-main ">
      <button
        class="color-main color-text-invert"
        id="cu-add-address"
        data-toggle="modal"
        data-target="#add_address"
        data-dismiss="modal"
        @click="setDefaultSettingsGlobalAddUpdate({ nearest_landmark: '' })"
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
