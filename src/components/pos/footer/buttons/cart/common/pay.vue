<template>
  <div>
    <div
      @click="$emit('pay')"
      v-if="isPermitted(PERMISSIONS.CAN_RECEIVE_PAYMENTS)"
    >
      <div class="pay-button">
        <a role="button">
          <img src="img/pos/payment.svg" :alt="_t('Pay Now')" />
          <span class="pay-btn color-text-invert">{{ _t('Pay Now') }}</span>
        </a>
      </div>
    </div>
    <div v-else>
      <div class="pay-button">
        <a role="button">
          <img src="img/pos/payment.svg" :alt="_t('Pay Now')" />
          <span class="pay-btn color-text-invert">{{ _t("Can't Pay") }}</span>
        </a>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'pay',
  computed: {
    ...mapGetters('location', ['_t']),
  },
}
</script>
