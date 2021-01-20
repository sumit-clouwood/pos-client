<template>
  <div id="total-amount" class="total-amount color-secondary">
    <div class="payment-amount-title">
      <p v-if="tipAmount" class="tip-amopunt color-text-invert">
        {{ _t('Tip Amount') }}
      </p>
      <p class="total-amt color-text-invert">{{ _t('Total Amount') }}</p>
    </div>
    <div class="payment-amount-digit">
      <p v-if="tipAmount" class="color-text-invert">
        {{ formatPrice(tipAmount) }}
      </p>
      <h2 class="color-text-invert">{{ formatPrice(orderTotal) }}</h2>
    </div>
    <hr v-if="typeof param !== 'undefined' && param.totalAmountBlock" />
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import * as CONST from '@/constants'

export default {
  name: 'TotalAmount',
  props: ['param'],
  computed: {
    ...mapGetters('order', ['orderTotal']),
    ...mapGetters('location', ['formatPrice', '_t']),
    ...mapState('checkoutForm', ['tipAmount', 'method']),
    is_giftcard() {
      return this.method.type == CONST.GIFT_CARD
    },
    is_reference_code() {
      return this.method.reference_code
    },
  },
  created() {
    this.GetPaymentMethod()
  },
  methods: {
    MethodChangeHendler() {
      if (this.param.title == 'Gift Card') {
        this.$store.dispatch('QRMethodChangeHendler')
      } else if (this.param.title == 'Cash') {
        this.$store.dispatch('payNowCalcHendlerChange')
      } else if (this.param.title == 'Mastercard') {
        this.$store.dispatch('methodCardHendlerChange')
      }
    },
    GetPaymentMethod() {
      this.$store.dispatch('checkoutForm/validatePayment').then(() => {
        if (this.method.type == CONST.GIFT_CARD) {
          this.$store.dispatch('loyaltyPaymentHendlerChange')
        } else if (this.method.type == CONST.CARD) {
          this.$store.dispatch('methodCardHendlerChange')
        } else {
          //cash payments
          this.$store.dispatch('payNowCalcHendlerChange')
        }
      })
    },
  },
}
</script>
<style lang="scss">
.total-amount {
  hr {
    grid-column-start: 1;
    grid-column-end: 3;
    margin-top: 20px;
    margin-bottom: 20px;
    display: none;
  }

  .total-amount-method {
    grid-column-start: 1;
    grid-column-end: 3;
    display: grid;
    grid-template-columns: max-content 1fr auto;
    align-items: center;
    grid-gap: 10px;

    .total-amount-method-btn {
      border: 2px solid #ef7f2a;
      color: #ef6a05;
      border-radius: 3px;
      padding: 5px 25px;
      font-weight: 600;
      display: none;
    }
  }
}
</style>
