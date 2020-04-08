<template>
  <div :class="['mobile-payment-methods', { active: paymentMethodsHendler }]">
    <mobile-pay-header
      :param="{
        title: 'Order Payment',
        subtitle: 'Order ID #0213232',
        method: 'closePayMethods',
      }"
    />
    <div class="pay-body">
      <total-amount :param="{ totalAmountBlock: false }" />
      <payment-methods />
    </div>
    <div class="pay-footer">
      <mobile-footer :param="{ method: 'successfull' }" />
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import mobileFooter from './mobileFooter.vue'
import mobilePayHeader from './mobilePayHeader.vue'
import paymentMethods from '../pos/content/cart/payNow/PaymentMethods.vue'
import totalAmount from '../pos/content/cart/payNow/TotalAmount.vue'

export default {
  components: {
    mobileFooter,
    paymentMethods,
    totalAmount,
    mobilePayHeader,
  },
  computed: {
    ...mapGetters(['paymentMethodsHendler']),
  },
  watch: {
    paymentMethodsHendler(newVal, oldVal) {
      if (newVal != oldVal) {
        const header_height = document
          .querySelector('.pay-header')
          .getBoundingClientRect().height
        const amount_height = document
          .querySelector('.mobile-payment-methods .pay-body .total-amount')
          .getBoundingClientRect().height
        const footer_height = document
          .querySelector('.pay-footer')
          .getBoundingClientRect().height
        let carousel_height =
          document.body.clientHeight -
          (header_height + amount_height + footer_height + 20)
        document
          .querySelector(
            '.mobile-payment-methods .pay-body #payment-method .carousel-container .carousel'
          )
          .setAttribute('style', 'height:' + carousel_height + 'px')
      }
    },
  },
  methods: {},
}
</script>
<style lang="scss">
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';

@include responsive(mobile) {
  .mobile-payment-methods {
    z-index: 1051;
    position: absolute;
    top: 0;
    right: -100vw;
    bottom: 0;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    grid-template-rows: max-content 1fr max-content;
    width: 100vw;
    transition: 0.5s ease-out;

    &.active {
      right: 0;
    }

    .pay-body {
      padding: 5px 10px;
      padding-bottom: 0;
      display: grid;
      grid-template-rows: max-content 1fr;
      overflow: hidden;

      #payment-method {
        margin: 0;
        overflow: auto;
        display: grid;
        grid-template-rows: repeat(20, 65px);
        grid-gap: 15px;
        margin-top: 20px;
        @include responsive(mobile) {
          width: 100%;
        }

        &::-webkit-scrollbar {
          width: 0;
        }

        > div {
          display: grid;
          grid-template-columns: max-content 1fr;
          @include responsive(mobile) {
            grid-template-columns: 1fr;
            border: none;
          }
          align-items: center;
          grid-gap: 20px;
          border: 2px solid $gray-middle;
          transition: 0.3s ease-out;
          border-radius: 5px;
          position: relative;

          &.active {
            border: 2px solid $green-middle;

            &:after {
              display: flex;
              align-items: center;
              justify-content: center;
              content: '\f00c';
              font-family: FontAwesome;
              position: absolute;
              width: 20px;
              height: 20px;
              top: -2px;
              right: -2px;
              border-bottom-left-radius: 3px;
              border-top-right-radius: 3px;
              background-color: $green-middle;
              color: #fff;
            }
          }

          &:active {
            background-color: #eee;
          }

          br {
            display: none;
          }

          label {
            width: auto;
            text-align: left !important;
            margin: 0;
          }

          img {
            width: 50px;
            height: 50px;
            margin-left: 5px;
            border-radius: 3px;
          }
        }
      }
    }

    .pay-footer {
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      z-index: 1;

      .mobile-footer {
        .btn-cart {
          display: none;
        }
      }
    }
  }
  .total-amount {
    border: 1px dotted $green-middle;
    border-radius: $card-border-radius;
    padding: 5px 20px;
    background-color: $green-light;
    display: grid;
    grid-template-columns: 1fr max-content;
    font-weight: 600;
    .payment-amount-title {
      display: flex;
      justify-content: center;
      flex-direction: column;

      .tip-amopunt {
        margin-bottom: 5px;
      }

      .total-amt {
        color: $green-dark;
        margin-top: 3px;
      }
    }

    .payment-amount-digit {
      display: flex;
      justify-content: center;
      flex-direction: column;

      p {
        margin-bottom: 5px;
        text-align: right;
      }

      h2 {
        font-size: 20px;
        font-weight: 600;
        color: $green-dark;
        margin: 0;
        text-align: right;
      }
    }
  }
}
</style>
