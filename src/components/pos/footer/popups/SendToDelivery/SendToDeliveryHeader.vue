<template>
  <div class="order-header">
    <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
    <h4 class="order-confirm-title color-text">
      {{ _t('Order Confirmation') }}
    </h4>
    <p class="color-text-invert">
      {{ _t('Please confirm the order below to delivered') }}:
    </p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'SendToDeliveryHeader',
  props: {},
  computed: {
    ...mapGetters('location', ['_t']),
  },
}
</script>
