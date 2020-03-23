<template>
  <div @click="$emit('delivery')">
    <div class="pay-button">
      <a class="footer-slider-list-item-link color-text-invert" role="button">
        <svg
          aria-hidden="true"
          focusable="false"
          data-prefix="fas"
          data-icon="suitcase"
          role="img"
          width="1.875rem"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          class="svg-inline--fa fa-suitcase fa-w-16 fa-2x"
        >
          <path
            fill="currentColor"
            d="M128 480h256V80c0-26.5-21.5-48-48-48H176c-26.5 0-48 21.5-48 48v400zm64-384h128v32H192V96zm320 80v256c0 26.5-21.5 48-48 48h-48V128h48c26.5 0 48 21.5 48 48zM96 480H48c-26.5 0-48-21.5-48-48V176c0-26.5 21.5-48 48-48h48v352z"
            class
          ></path>
        </svg>
        <span>{{ _t('Send to Delivery') }}</span>
      </a>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'delivery',
  computed: {
    ...mapGetters('location', ['_t']),
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/mixins.scss';
.pay-button {
  @include responsive(mobile) {
    background-color: #5ea000;
    text-align: center;
    color: white;
    font-size: 15px;
    font-weight: 500;
  }
  svg {
    @include responsive(mobile) {
      padding-top: 1px;
    }
  }
}
</style>
