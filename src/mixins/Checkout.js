/* global $, showModal hideModal */
/* eslint-disable no-console */
import * as CONST from '@/constants'

export default {
  methods: {
    async _addAmount() {
      return new Promise((resolve, reject) => {
        this.$store
          .dispatch('checkoutForm/validatePayment')
          .then(() => {
            if (this.method.type == CONST.GIFT_CARD) {
              showModal('#Gift-card-payemnt')
              reject()
            } else if (this.method.type == CONST.LOYALTY) {
              //show loyalty popup if needed
              reject()
            } else if (this.method.reference_code) {
              showModal('#card-payemnt')
              reject()
            } else {
              //cash payments
              this.addPayment()
                .then(payable => resolve(payable))
                .catch(error => reject(error))
            }
          })
          .catch(() => reject())
      })
    },
    addPayment() {
      return new Promise((resolve, reject) => {
        this.$store
          .dispatch('checkoutForm/addAmount')
          .then(payable => {
            this.$store.commit('checkoutForm/forceCash', true)
            resolve(payable)
          })
          .catch(error => reject(error))
      })
    },
    doPayment(action) {
      $('#payment-screen-footer').prop('disabled', true)

      this.$store.commit('order/IS_PAY', 1)
      this.$store.commit('checkoutForm/setAction', 'pay')

      if (this.needSupervisorAccess) {
        showModal('#modificationReason')
      } else {
        this.executePayment(action)
      }
    },
    executePayment(action) {
      if (this.processing) {
        console.log('dual footer click')
        return false
      }

      $('#payment-msg').modal('show')
      this.$store.dispatch('order/startOrder')
      this.$store.commit('checkoutForm/SET_PROCESSING', true)

      return new Promise((resolve, reject) => {
        this.$store
          .dispatch('checkout/pay', action)
          .then(() => {
            console.log('payment success')
            this.showMsg()
            resolve()
          })
          .catch(() => {
            setTimeout(() => {
              console.log('payment fail')

              $('#payment-msg').modal('hide')
              $('#payment-screen-footer').prop('disabled', false)
            }, 500)
            reject()
          })
          .finally(() => {
            console.log('finally processing false')
            this.$store.commit('checkoutForm/SET_PROCESSING', false)
            this.$store.commit('checkoutForm/forceCash', true)
          })
      })
    },
    showMsg() {
      showModal('#payment-msg')
      if (this.changedAmount >= 0.1) {
        //alert('change amount is due')
        setTimeout(() => {
          hideModal('#payment-msg')
          setTimeout(() => {
            showModal('#change-amount')
          }, 500)
        }, 500)
      } else if (this.msg) {
        showModal('#payment-msg')
      }
      setTimeout(function() {
        $('#payment-screen-footer').prop('disabled', false)
      }, 1000)
    },
  },
}
