<template>
  <div :class="['amount-keypad', { amountKeypadActive: payNowCalcHendler }]">
    <div class="payment-key" @click="set(7)">7</div>
    <div class="payment-key" @click="set(8)">8</div>
    <div class="payment-key" @click="set(9)">9</div>
    <div class="payment-key" @click="set(10)">10</div>
    <div class="payment-key" @click="set(4)">4</div>
    <div class="payment-key" @click="set(5)">5</div>
    <div class="payment-key" @click="set(6)">6</div>
    <div class="payment-key" @click="set(20)">20</div>
    <div class="payment-key" @click="set(1)">1</div>
    <div class="payment-key" @click="set(2)">2</div>
    <div class="payment-key" @click="set(3)">3</div>
    <div class="backspace" id="backspace" @click="removeDigit()">
      {{ _t('Sub') }}
    </div>
    <div id="clearcalc" class="" @click="reset()">c</div>
    <div class="payment-key" @click="set('0')">0</div>
    <div class="payment-key" @click="set('.')">.</div>
    <div id="add-amt" @click="addAmount">{{ _t('+ Add') }}</div>
  </div>
</template>

<script>
/* global $ showModal */
import CheckoutMixin from '@/mixins/Checkout'
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'AmountCalculator',
  mixins: [CheckoutMixin],
  computed: {
    ...mapState('checkout', ['changedAmount']),
    ...mapState('order', ['needSupervisorAccess']),
    ...mapGetters('location', ['_t']),
    ...mapState('checkoutForm', [
      'msg',
      'error',
      'method',
      'processing',
      'amount',
    ]),
    ...mapGetters(['payNowCalcHendler']),
    ...mapGetters('order', ['orderTotal']),
  },
  data() {
    return {
      init: false,
    }
  },
  methods: {
    addAmount() {
      if (
        this.method.type === 'customer_credit' &&
        parseFloat(this.amount) != parseFloat(this.orderTotal)
      ) {
        this.$store.commit('checkoutForm/SET_MSG', {
          message:
            "Sorry! you can't split and extra payment for credit customers",
          result: 'error',
        })
        $('#payment-msg').modal('show')
        return false
      }

      $('#payment-breakdown').show()
      this.$store.commit('checkoutForm/paymentButton', 'add')
      this.$store.commit('checkoutForm/setAction', 'pay')

      this._addAmount()
        .then(payable => {
          if (payable <= 0.1) {
            this.doPayment(this.$store.state.order.orderType.OTApi)
          }
          if (this.$store.state.mobile.device === 'mobile') {
            this.$store.dispatch('payNowCalcHendlerChange')
            this.$store.dispatch('paymentMethodsChange')
            this.$store.dispatch('mainOrdersHendlerChange')
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
      if (this.$store.state.mobile.device === 'mobile') {
        this.$store.dispatch('payNowCalcHendlerChange')
        this.$store.dispatch('paymentMethodsChange')
        this.$store.dispatch('mainOrdersHendlerChange')
      }
    },
    set(amount) {
      this.$store.commit('checkoutForm/SET_PROCESSING', false)

      if (!this.init) {
        this.$store.commit('checkoutForm/appendAmount', '')
        this.init = true
      }
      this.$store.commit('checkoutForm/appendAmount', amount)
    },
    reset() {
      this.$store.dispatch('checkoutForm/resetAmount')
    },
    removeDigit() {
      this.$store.commit('checkoutForm/removeDigit')
    },
  },
}
</script>
<style lang="sass" scoped>
.amount-keypad
  min-width: 518px
#backspace
  color: white
</style>
