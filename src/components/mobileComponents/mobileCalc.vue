<template>
  <div :class="['mobile-calc', { active: payNowCalcHendler }]">
    <mobile-pay-header
      :param="{
        title: 'Order Payment',
        subtitle: 'Order ID #0213232',
        method: 'calcHendler',
      }"
    />
    <div class="calc-body">
      <total-amount />
      <div class="imput-block">
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M0 2C0 0.89543 0.895431 0 2 0H4C5.10457 0 6 0.895431 6 2V4C6 5.10457 5.10457 6 4 6H2C0.89543 6 0 5.10457 0 4V2ZM11 2C11 0.89543 11.8954 0 13 0H15C16.1046 0 17 0.895431 17 2V4C17 5.10457 16.1046 6 15 6H13C11.8954 6 11 5.10457 11 4V2ZM24 0C22.8954 0 22 0.89543 22 2V4C22 5.10457 22.8954 6 24 6H26C27.1046 6 28 5.10457 28 4V2C28 0.895431 27.1046 0 26 0H24ZM0 13C0 11.8954 0.895431 11 2 11H4C5.10457 11 6 11.8954 6 13V15C6 16.1046 5.10457 17 4 17H2C0.89543 17 0 16.1046 0 15V13ZM13 11C11.8954 11 11 11.8954 11 13V15C11 16.1046 11.8954 17 13 17H15C16.1046 17 17 16.1046 17 15V13C17 11.8954 16.1046 11 15 11H13ZM22 13C22 11.8954 22.8954 11 24 11H26C27.1046 11 28 11.8954 28 13V15C28 16.1046 27.1046 17 26 17H24C22.8954 17 22 16.1046 22 15V13ZM2 22C0.895431 22 0 22.8954 0 24V26C0 27.1046 0.89543 28 2 28H4C5.10457 28 6 27.1046 6 26V24C6 22.8954 5.10457 22 4 22H2ZM11 24C11 22.8954 11.8954 22 13 22H15C16.1046 22 17 22.8954 17 24V26C17 27.1046 16.1046 28 15 28H13C11.8954 28 11 27.1046 11 26V24ZM24 22C22.8954 22 22 22.8954 22 24V26C22 27.1046 22.8954 28 24 28H26C27.1046 28 28 27.1046 28 26V24C28 22.8954 27.1046 22 26 22H24Z"
            fill="#4B4E53"
          />
        </svg>
        <input
          type="text"
          name="payment"
          v-model.number="payableAmount"
          @click="showCalculator()"
          :placeholder="formatPrice(0.0)"
        />
      </div>
      <amount-calculator />
      <PaymentBreakdown v-show="showPayBreak" />
    </div>
    <div class="calc-footer">
      <mobile-footer :param="{ method: 'successfull' }" />
    </div>
  </div>
</template>
<script>
import { mapGetters, mapState } from 'vuex'
import mobileFooter from './mobileFooter'
import mobilePayHeader from './mobilePayHeader.vue'
import totalAmount from '../pos/content/cart/payNow/TotalAmount.vue'
import amountCalculator from '../pos/content/cart/payNow/AmountCalculator.vue'
import PaymentBreakdown from '../pos/content/cart/payNow/PaymentBreakdown'

export default {
  components: {
    mobileFooter,
    totalAmount,
    mobilePayHeader,
    amountCalculator,
    PaymentBreakdown,
  },
  computed: {
    payableAmount: {
      get() {
        return this.$store.state.checkoutForm.amount > 0
          ? this.$store.state.checkoutForm.amount
          : 0
      },
      set(amount) {
        this.$store.dispatch('checkoutForm/setAmount', amount)
      },
    },
    ...mapGetters(['payNowCalcHendler']),
    ...mapGetters('location', ['formatPrice', '_t']),
    ...mapGetters('checkoutForm', ['payable']),
    ...mapState('checkoutForm', ['error', 'showCalc', 'showPayBreak']),
  },
  methods: {
    showCalculator() {
      this.$store.commit('checkoutForm/showCalc', true)
    },
  },
  watch: {
    payable(newVal) {
      this.payableAmount = parseFloat(newVal).toFixed(2)
    },
  },
}
</script>
<style lang="scss">
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';

@include responsive(mobile) {
  .mobile-calc {
    z-index: 1052;
    width: 100vw;
    height: 100%;
    position: fixed;
    top: 0;
    right: -100vw;
    bottom: 0;
    background-color: #fff;
    display: grid;
    grid-template-rows: 90px 1fr max-content;
    transition: 0.5s ease-out;

    &.active {
      right: 0;
    }

    .calc-body {
      padding: 0 20px;
      display: flex;
      flex-direction: column;
      align-items: stretch;

      .amount-keypad {
        overflow: hidden;
        display: grid !important;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        grid-gap: 10px;
        min-width: auto;
        margin-top: 20px;

        #add-amt {
          cursor: pointer;
        }

        > div {
          width: auto;
          height: 45px;
          border-radius: $btn-border-radius;
          background-image: linear-gradient(180deg, #eeeeee 0%, #d8d8d8 100%);
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: $px24;
          font-weight: 600;
          font-style: normal;
          font-stretch: normal;
          line-height: 1.08;
          letter-spacing: normal;
          color: #3d3f43;
        }

        > div:nth-child(4),
        .amount-keypad > div:nth-child(8) {
          background-image: linear-gradient(180deg, #5056ca 0%, #2d38aa 100%);
          color: #fff;
        }

        > div:nth-child(12) {
          background-image: linear-gradient(180deg, #cc3232 0%, #bc2525 100%);
        }

        > div:nth-child(13) {
          background-image: linear-gradient(180deg, #fac161 0%, #f76b1c 100%);
          color: #fff;
        }
      }

      .imput-block {
        border: 1px solid $gray-middle;
        display: grid;
        grid-template-columns: max-content 1fr;
        align-items: center;
        padding: 0 10px;
        margin-top: auto;
        height: 50px;
        border-radius: $btn-border-radius;
        align-self: unset;

        input {
          border: none;
          padding-left: 10px;
          height: 100%;
          font-size: 22px;
          text-align: right;
          outline: none;
        }
      }
    }

    .calc-footer {
      .mobile-footer {
        .btn-next {
          display: none;
          &.btn-next-s {
            display: flex !important;
          }
        }
        .btn-cart {
          display: none;
        }
      }
    }
  }
}
</style>
