<template>
  <button
    v-show="orderType.OTApi === 'dine_in'"
    class="buttoned colorwhite discountitembutton"
    id="select-item-time"
    @click="showTimeSlot"
  >
    {{ _t('Serving Time') }}
  </button>
</template>
<script>
/* global showModal hideModal */
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'BtnItemDeliveryTime',
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState('order', ['orderType']),
  },
  methods: {
    showTimeSlot() {
      hideModal('#POSOrderItemOptions')
      showModal('#item-delivery-time-selection')
    },
  },
}
</script>
