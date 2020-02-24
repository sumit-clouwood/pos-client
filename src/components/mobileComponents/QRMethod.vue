<template>
  <div :class="['qr-method', { active: QRMethodChange }]">
    <mobile-pay-header
      :param="{ title: 'Order Payment', subtitle: 'Order ID #0213232' }"
    />
    <div class="qr-method-body">
      <div class="subtitle">Use camera to scan QR code</div>
    </div>
    <mobile-footer />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import mobilePayHeader from './mobilePayHeader.vue'
import mobileFooter from './mobileFooter.vue'

export default {
  name: 'QRMethod',
  components: {
    mobilePayHeader,
    mobileFooter,
  },
  computed: {
    ...mapGetters(['QRMethodChange']),
  },
}
</script>

<style lang="scss">
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';

.qr-method {
  position: fixed;
  top: 0;
  right: -100vw;
  bottom: 0;
  width: 100vw;
  background-color: #fff;
  z-index: 1055;
  display: none;
  grid-template-rows: min-content 1fr min-content;
  transition: 0.5s ease-out;
  @include responsive(mobile) {
    display: grid;
  }

  &.active {
    right: 0;
  }

  .pay-header {
    grid-template-rows: min-content;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

    hr {
      display: block;
    }

    .qr-footer {
      display: grid;
    }

    .total-amount {
      display: grid;
      padding: 0;
      border: none;
      background-color: transparent;

      .payment-amount-title {
        .total-amt {
          color: inherit;
        }
      }

      .payment-amount-digit {
        h2 {
          color: inherit;
        }
      }
    }

    .qr-block {
      display: grid;
    }

    .pay-header-title {
      display: none;
    }

    .pay-header-subtitle {
      display: none;
    }

    .pay-header-buttons {
      display: none;
    }
  }

  .qr-method-body {
    display: grid;

    .subtitle {
      align-self: end;
      text-align: center;
      margin-bottom: 20px;
      font-size: 16px;
      color: #4b4e53;
      font-weight: 600;
    }
  }

  .mobile-footer {
    width: 100%;
    height: 135px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

    .btn-cart {
      display: none;
    }

    .btn-next {
      display: none;
    }

    .qr-voucher-code {
      display: grid;
    }
  }
}
</style>
