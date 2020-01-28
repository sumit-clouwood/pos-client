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
/* global showModal, $*/
import * as CONST from '@/constants'
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'AmountCalculator',
  computed: {
    ...mapState('checkout', ['changedAmount']),
    ...mapState('order', ['orderSource']),
    ...mapGetters('location', ['_t']),
    ...mapState('checkoutForm', ['method', 'processing']),
    ...mapGetters(['payNowCalcHendler']),
  },
  data() {
    return {
      init: false,
    }
  },
  methods: {
    addAmount() {
      $('#payment-breakdown').show()
      this.$store.commit('checkoutForm/setAction', 'add')
      this.$store.dispatch('checkoutForm/validatePayment').then(() => {
        if (this.method.type == CONST.GIFT_CARD) {
          showModal('#Gift-card-payemnt')
        } else if (this.method.reference_code) {
          showModal('#card-payemnt')
        } else {
          //cash payments
          this.$store.dispatch('checkoutForm/addAmount').then(payable => {
            //check if full payment was made, then just start processing the order straight away
            if (
              payable <= 0.1
              //&&
              //this.$store.state.checkoutForm.payments.length == 1
            ) {
              if (this.processing) {
                // eslint-disable-next-line no-console
                console.log('dual click from add button')
                return false
              }

              this.$store.commit('checkoutForm/SET_PROCESSING', true)
              this.$store.commit('order/IS_PAY', 1)
              this.$store.commit('checkoutForm/setAction', 'pay')
              $('#payment-screen-footer').prop('disabled', true)

              this.$store.dispatch('order/startOrder')
              if (this.orderSource === 'backend') {
                showModal('#modificationReason')
              } else {
                $('#payment-msg').modal('show')

                this.$store
                  .dispatch(
                    'checkout/pay',
                    this.$store.state.order.orderType.OTApi
                  )
                  .then(() => {
                    $('#payment-msg').modal('show')

                    if (this.changedAmount >= 0.1) {
                      //alert('change amount is due')
                      setTimeout(() => {
                        $('#payment-msg').modal('hide')
                        setTimeout(() => {
                          $('#change-amount').modal('show')
                        }, 500)
                      }, 500)
                    } else if (this.msg) {
                      $('#payment-msg').modal('show')
                    }
                    setTimeout(function() {
                      $('#payment-screen-footer').prop('disabled', false)
                    }, 1000)
                  })
                  .catch(() => {
                    setTimeout(() => {
                      $('#payment-msg').modal('hide')
                      $('#payment-screen-footer').prop('disabled', false)
                    }, 500)
                  })
                  .finally(() => {
                    // eslint-disable-next-line no-console
                    console.log('process complete from add button')
                    this.$store.commit('checkoutForm/SET_PROCESSING', false)
                  })
              }
            }
          })
        }
      })
      // this.$store.commit('checkoutForm/setAction', 'pay')
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
</style>
