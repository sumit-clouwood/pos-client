<template>
  <div @click="$emit('pay')" class="btn-charge">
    <div class="pay-button">
      <a role="button">
        <img
          src="https://d3jjfdwi6rnqlf.cloudfront.net/img/pos/payment.svg"
          :alt="_t('Pay Now')"
        />
        <span class="pay-btn color-text-invert">{{ _t('Pay Now') }}</span>
      </a>
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
