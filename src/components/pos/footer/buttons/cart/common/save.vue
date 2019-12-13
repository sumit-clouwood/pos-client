<template>
  <div v-if="isPermitted(PERMISSIONS.ORDERS_PLACE_ORDER)">
    <div @click="$emit('save')">
      <div class="pay-button">
        <a role="button">
          <img src="img/pos/place_order.svg" :alt="_t('Place Order')" />
          <span class="pay-btn color-text-invert">
            {{ _t('Place Order') }}
          </span>
        </a>
      </div>
    </div>
  </div>
  <div v-else>
    <div class="pay-button">
      <a role="button">
        <img src="img/pos/place_order.svg" :alt="_t('Place Order')" />
        <span class="pay-btn color-text-invert">
          {{ _t("Can't Place Order") }}
        </span>
      </a>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'save',
  computed: {
    ...mapGetters('location', ['_t']),
  },
}
</script>
