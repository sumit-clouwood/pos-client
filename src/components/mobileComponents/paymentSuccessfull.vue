<template>
  <div :class="['payment-successfull', { active: successfullHendler }]">
    <div class="header">
      <mobile-pay-header
        :param="{
          title: 'Order Payment',
          subtitle: 'Order ID #0213232',
          method: 'successfull',
        }"
      />
    </div>
    <div class="body">
      <total-amount :param="{ totalAmountBlock: true }" />
    </div>
    <pay-footer />
  </div>
</template>

<script>
import payFooter from '../pos/content/cart/payNow/Footer.vue'
import totalAmount from '../pos/content/cart/payNow/TotalAmount.vue'
import mobilePayHeader from './mobilePayHeader.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'paymentSuccessfull',
  components: {
    payFooter,
    totalAmount,
    mobilePayHeader,
  },
  computed: {
    ...mapGetters(['successfullHendler']),
  },
}
</script>

<style lang="scss">
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';

.payment-successfull {
  position: fixed;
  top: 0;
  right: -100vw;
  bottom: 0;
  width: 100vw;
  height: 100%;
  z-index: 50;
  background-color: #fff;
  display: none;
  grid-template-rows: max-content 1fr max-content;
  z-index: 1060;
  transition: 0.5s ease-out;
  .btn-next-s {
    display: flex !important;
  }
  @include responsive(mobile) {
    display: grid;
  }
  &.active {
    right: 0;
  }

  .header {
    border: none;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    height: 90px;
    .pay-header {
      height: 90px;
    }

    .mobile-pay-header {
      border: none;
    }
  }

  .body {
    padding: 20px;

    .total-amount {
      hr {
        display: none;
      }

      .total-amount-method {
        display: none;
      }
    }
  }

  .payment-screen-footer {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px;
    padding: 20px;
    min-width: auto;

    .footer-wrap {
      color: #fff;
      background-color: $btn-bg-black;
      display: grid;
      align-items: center;
      justify-content: center;
      padding: 10px;
      border-radius: $btn-border-radius;

      &:last-child {
        background-color: $green-middle;
      }

      img {
        margin: 0 auto;
        margin-bottom: 5px;
      }
    }
  }
}
</style>
