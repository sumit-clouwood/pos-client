<template>
  <div class="payment-screen-footer" id="payment-screen-footer">
    <div
      v-if="this.orderType !== 'dine_in' || this.brand.accept_tips"
      class="footer-wrap color-secondary"
      id="add-tip-amt"
      data-toggle="modal"
      data-target="#tip-amount"
    >
      <img
        src="https://d3jjfdwi6rnqlf.cloudfront.net/img/pos/tip.png"
        alt="payment-method"
      /><span class="color-text-invert">
        {{ _t('Tip Amount') }}
      </span>
    </div>
    <div class="footer-wrap color-secondary">
      <img
        src="https://d3jjfdwi6rnqlf.cloudfront.net/img/pos/gift-receipt.png"
        alt="payment-method"
      /><span class="color-text-invert">{{ _t('Gift Receipt') }}</span>
    </div>
    <div
      class="footer-wrap color-secondary"
      data-toggle="modal"
      data-target="#add-email"
    >
      <img
        src="https://d3jjfdwi6rnqlf.cloudfront.net/img/pos/email.png"
        alt="payment-method"
      /><span class="color-text-invert">
        {{ _t('Email') }}
      </span>
    </div>

    <div class="footer-wrap color-secondary" @click="pay" id="submitOrder">
      <img
        src="https://d3jjfdwi6rnqlf.cloudfront.net/img/pos/done.png"
        alt="payment-method"
      /><span class="color-text-invert">
        {{ _t('Done') }}
      </span>
    </div>
  </div>
</template>

<script>
/* global $ showPaymentBreak showModal*/
/* eslint-disable no-console */
import { mapGetters, mapState } from 'vuex'
import CheckoutMixin from '@/mixins/Checkout'

export default {
  name: 'PayNowFooter',
  components: {},
  mixins: [CheckoutMixin],
  computed: {
    ...mapState('checkout', ['changedAmount']),
    ...mapState('order', ['needSupervisorAccess']),
    ...mapGetters('order', ['orderType']),
    ...mapState('location', ['brand']),
    ...mapState('checkoutForm', [
      'msg',
      'error',
      'method',
      'processing',
      'amount',
    ]),
    ...mapGetters('checkoutForm', ['validate']),
    ...mapGetters('location', ['_t']),
    ...mapGetters('order', ['orderTotal']),
  },
  data() {
    return {}
  },
  mounted() {
    $('#payment-msg').modal({
      backdrop: 'static',
      keyboard: false,
      show: false,
    })
  },
  methods: {
    addAmount() {
      return new Promise((resolve, reject) => {
        if (this.$store.getters['checkoutForm/validate']) {
          return resolve(0)
        }
        if (this.$store.getters['checkoutForm/payable'] <= 0.1) {
          return resolve(0)
        }

        this._addAmount()
          .then(payable => resolve(payable))
          .catch(response => reject(response))
      })
    },
    pay() {
      if (
        this.method.type === 'customer_credit' &&
        parseFloat(this.amount) != parseFloat(this.orderTotal)
      ) {
        this.$store.commit('checkoutForm/SET_MSG', {
          message:
            "Sorry! you can't split payment and can't add extra or less payment for credit customers",
          result: 'error',
        })
        $('#payment-msg').modal('show')
        return false
      }
      this.$store.commit('checkoutForm/paymentButton', 'done')
      this.$store.commit('checkoutForm/setAction', 'pay')
      this.addAmount()
        .then(payable => {
          if (payable <= 0.1) {
            this.doPayment(this.$store.state.order.orderType.OTApi)
          } else {
            //show payment breakdown
            showPaymentBreak()
          }
        })
        .catch(error => {
          if (this.error) {
            showModal('#amount-error')
          } else if (error) {
            this.$store.commit('checkoutForm/SET_MSG', {
              message: error,
              result: 'error',
            })
            $('#payment-msg').modal('show')
          }
        })
      this.$store.dispatch('successfullHendlerChange')
      this.$store.dispatch('payNowCalcHendlerChange')
      this.$store.dispatch('paymentMethodsChange')
      this.$store.dispatch('mainOrdersHendlerChange')
    },
  },
}
</script>
<style lang="sass" scoped>
.payment-screen-footer
    min-width: 518px
</style>
<style lang="scss">
@import '@/assets/scss/pixels_rem.scss';
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';

@include responsive(mobile) {
  .payment-screen-footer {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
}
</style>
