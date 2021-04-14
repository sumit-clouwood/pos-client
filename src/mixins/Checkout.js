/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
/* global $, showModal hideModal AndroidPOS Eventer */
/* eslint-disable no-console */
import * as CONST from '@/constants'

export default {
  methods: {
    async paysky(resolve, reject) {
      console.log('paysky ', 'Pay by paysky')
      if (typeof AndroidPOS == 'undefined') {
        console.log('paysky ', 'AndroidPOS not found')
        let error = this._t('Sorry! PaySky is not supported')
        this.$store.commit('checkoutForm/SET_MSG', {
          message: error,
          result: 'error',
        })
        $('#payment-msg').modal('show')
        return reject(error)
      }
      console.log('paysky ', 'AndroidPOS is present')
      this.$store.commit('checkoutForm/SET_MSG', {
        message: 'Waiting for payment...',
        result: 'loading',
      })

      $('#payment-msg').modal('show')

      let auth = { ...this.method }
      delete auth.availability

      try {
        console.log('paysky ', 'generating token')
        this.$store.dispatch('checkoutForm/generateTransactionToken', 'paysky')
        auth.transaction_token = this.$store.getters[
          'checkoutForm/transaction_token'
        ]('paysky')

        console.log('paysky ', 'token generated', auth.transaction_token)

        let paySkyData = {
          auth: auth,
          transactionAmount: this.$store.state.checkoutForm.amount,
          transactionType: 'full',
        }
        console.log('paysky ', paySkyData)
        const paySkyDataString = JSON.stringify(paySkyData)
        console.log('paysky ', paySkyDataString)
        if (paySkyDataString) {
          console.log(
            'paysky ',
            'calling AndroidPOS.callFunction.payWithPaySky'
          )
          AndroidPOS.callFunction(
            'payWithPaySky',
            paySkyDataString,
            'paySkyCallbackAndroid'
          )
          console.log('paysky ', 'resolving')
          resolve()
        } else {
          console.log('paysky ', 'stringify failed')
          reject('Json stringify failed ')
        }
      } catch (error) {
        console.log('paysky ', error)
        if (error.stack) {
          reject(error.stack)
        } else {
          reject(error)
        }
      }
    },
    async _addAmount() {
      console.log('paysky ', 'Add amount')
      return new Promise((resolve, reject) => {
        this.$store
          .dispatch('checkoutForm/validatePayment')
          .then(() => {
            console.log('paysky ', 'Payment validated', this.method)
            if (this.method.type == CONST.GIFT_CARD) {
              showModal('#Gift-card-payemnt')
              reject()
            } else if (this.method.type == CONST.LOYALTY) {
              //show loyalty popup if needed
              this.addPayment().then(payable => resolve(payable))
            } else if (this.method.reference_code) {
              if (this.method.unique_code === CONST.PAYMENT_METHOD_PAYSKY) {
                //execute code here
                console.log('paysky ', 'Pay by paysky')
                this.paysky(resolve, reject)
              } else {
                showModal('#card-payemnt')
                reject()
              }
            } else {
              //cash payments
              if (this.method.type == 'card') {
                if (this.method.unique_code === CONST.PAYMENT_METHOD_PAYSKY) {
                  //execute code here
                  console.log('paysky ', 'Payby Paysky')
                  this.paysky(resolve, reject)
                } else {
                  //card payment but reference code was off
                  this.$store
                    .dispatch('checkoutForm/addCardAmount')
                    .then(payable => {
                      if (
                        payable <= 0.1 ||
                        this.$store.state.checkoutForm.action == 'pay'
                      ) {
                        if (this.needSupervisorAccess) {
                          showModal('#modificationReason')
                        } else {
                          if (this.$store.getters['checkoutForm/validate']) {
                            this.executePayment(
                              this.$store.state.order.orderType.OTApi
                            )
                          }
                        }
                      }
                    })
                    .catch(error => (this.error = error))
                }
              } else {
                this.addPayment()
                  .then(payable => resolve(payable))
                  .catch(error => reject(error))
              }
            }
          })
          .catch(error => {
            console.log('paysky ', 'Payment not validated')
            reject(error)
          })
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
