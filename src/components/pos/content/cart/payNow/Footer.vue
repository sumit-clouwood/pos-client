<template>
  <div class="payment-screen-footer" id="payment-screen-footer">
    <div
      v-if="this.orderType !== 'dine_in' || this.brand.accept_tips"
      class="footer-wrap color-secondary"
      id="add-tip-amt"
      data-toggle="modal"
      data-target="#tip-amount"
    >
      <img src="img/pos/tip.png" alt="payment-method" /><span
        class="color-text-invert"
      >
        {{ _t('Tip Amount') }}
      </span>
    </div>
    <div class="footer-wrap color-secondary">
      <img src="img/pos/gift-receipt.png" alt="payment-method" /><span
        class="color-text-invert"
        >{{ _t('Gift Receipt') }}</span
      >
    </div>
    <div
      class="footer-wrap color-secondary"
      data-toggle="modal"
      data-target="#add-email"
    >
      <img src="img/pos/email.png" alt="payment-method" /><span
        class="color-text-invert"
      >
        {{ _t('Email') }}
      </span>
    </div>

    <div class="footer-wrap color-secondary" @click="pay" id="submitOrder">
      <img src="img/pos/done.png" alt="payment-method" /><span
        class="color-text-invert"
      >
        {{ _t('Done') }}
      </span>
    </div>
  </div>
</template>

<script>
/* global $ showModal showPaymentBreak */
/* eslint-disable no-console */
import { mapGetters, mapState } from 'vuex'
import * as CONST from '@/constants'

export default {
  name: 'PayNowFooter',
  components: {},
  computed: {
    ...mapState('checkout', ['changedAmount']),
    ...mapState('order', ['needSupervisorAccess']),
    ...mapGetters('order', ['orderType']),
    ...mapState('location', ['brand']),
    ...mapState('checkoutForm', ['msg', 'error', 'method', 'processing']),
    ...mapGetters('checkoutForm', ['validate']),
    ...mapGetters('location', ['_t']),
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
    /*getTipAmountAction() {
      if (this.orderType === 'dine_in') {
        return this.brand.accept_tips
      }
      return true
    },*/
    addAmount() {
      return new Promise((resolve, reject) => {
        if (this.$store.getters['checkoutForm/validate']) {
          return resolve(0)
        }
        if (this.$store.getters['checkoutForm/payable'] <= 0.1) {
          return resolve(0)
        }

        this.$store
          .dispatch('checkoutForm/validatePayment')
          .then(() => {
            if (this.method.type == CONST.GIFT_CARD) {
              showModal('#Gift-card-payemnt')
              reject()
            } else if (this.method.type == CONST.LOYALTY) {
              //show loyalty popup if needed
              this.$store
                .dispatch('checkoutForm/validateLoyaltyPayment')
                .then(() => {
                  this.$store
                    .dispatch('checkoutForm/addAmount')
                    .then(payable => {
                      resolve(payable)
                    })
                })
            } else if (this.method.reference_code) {
              showModal('#card-payemnt')
              reject()
            } else {
              //cash payments
              this.$store.dispatch('checkoutForm/addAmount').then(payable => {
                resolve(payable)
              })
            }
          })
          .catch(() => reject())
      })
    },
    pay() {
      if (this.processing) {
        console.log('dual footer click')
        return false
      }

      this.addAmount().then(payable => {
        if (payable <= 0.1) {
          $('#payment-screen-footer').prop('disabled', true)
          this.$store.commit('checkoutForm/setAction', 'pay')
          this.$store.commit('order/IS_PAY', 1)
          if (this.needSupervisorAccess) {
            showModal('#modificationReason')
          } else {
            this.$store.dispatch('order/startOrder')
            this.$store.commit('checkoutForm/SET_PROCESSING', true)

            $('#payment-msg').modal('show')

            this.$store
              .dispatch('checkout/pay', this.$store.state.order.orderType.OTApi)
              .then(() => {
                console.log('payment success')

                $('#payment-msg').modal('show')
                if (this.changedAmount >= 0.1) {
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
                  console.log('payment fail')

                  $('#payment-msg').modal('hide')
                  $('#payment-screen-footer').prop('disabled', false)
                }, 500)
              })
              .finally(() => {
                console.log('finally processing false')
                this.$store.commit('checkoutForm/SET_PROCESSING', false)
              })
          }
        } else {
          //show payment breakdown
          showPaymentBreak()
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
