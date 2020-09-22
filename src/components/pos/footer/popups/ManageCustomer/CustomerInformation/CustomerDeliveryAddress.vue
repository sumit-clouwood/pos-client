<template>
  <div id="delivery-area-address" v-if="isBrandHasDeliveryOrder">
    <div class="order-address-details color-main add-address-wrapper ">
      <button
        class="color-main color-text-invert add-address-wrapper"
        id="cu-add-address"
        data-toggle="modal"
        data-target="#add_address"
        data-dismiss="modal"
        @click="setDefaultSettingsGlobalAddUpdate('address')"
      >
        {{ _t('+ Add Address') }}
      </button>
    </div>
    <CustomerDeliveryArea :buttons="true" classAccess />
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import CustomerDeliveryArea from '../CustomerAddress/CustomerDeliveryArea'

export default {
  name: 'CustomerDeliveryAddress',
  components: {
    CustomerDeliveryArea,
  },
  computed: {
    ...mapState('customer', ['isBrandHasDeliveryOrder']),
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
