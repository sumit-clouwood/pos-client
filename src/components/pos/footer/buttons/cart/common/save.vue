<template>
  <div @click="$emit('save')" class="btn-charge">
    <div class="pay-button">
      <a role="button">
        <img
          src="https://d3jjfdwi6rnqlf.cloudfront.net/img/pos/place_order.svg"
          :alt="_t('Place Order')"
        />
        <span class="pay-btn color-text-invert">
          {{ _t('Place Order') }}
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
<style lang="scss" scoped>
@import '@/assets/scss/mixins.scss';
.pay-button {
  a {
    img {
      @include responsive(mobile) {
        display: none !important;
      }
    }
  }
}
</style>
