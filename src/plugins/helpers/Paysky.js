/* eslint-disable no-console */
/* global showModal hideModal */
import checkout from '@/mixins/Checkout.js'
import Vue from 'vue'
import AbstractHelper from './AbstractHelper'
import store from '@/store'

var Component = Vue.extend({
  mixins: [checkout],
})
export default class Paysky extends AbstractHelper {
  failEvent(errorMsg) {
    //this.data.error_message is what it gets from api, errorMsg argument is passed implicitly.
    //[nfc_not_found,move_card_fast,unknown_emv_card,card_with_locked_nfc,login_error,payment_error]
    //log(this.data.error_type)
    //log(this.data.error_message)
    //payment fail handle here

    let msg = ''
    switch (this.data.error_type) {
      case 'move_card_fast':
        msg = `Don't move card too quickly, please scan it again.`
        break
      default:
        msg = this.data.error_message || errorMsg || 'PaySky payment failed'
        msg += '. Please try again.'
    }

    this.$store.commit('checkoutForm/SET_MSG', {
      message: this.$store.getters['location/_t'](msg),
      result: 'error',
    })
    showModal('#payment-msg')
  }

  exec() {
    console.log('paysky ', 'Paysky event detected', this.data)
    //status ll be always true either its error or success
    if (this.data.status == true) {
      if (this.data.state == 'start') {
        console.log('paysky ', 'start')
        //open payment screen code here
        this.$store.commit('checkoutForm/SET_MSG', {
          message: this.$store.getters['location/_t']('Please scan your card'),
        })
        showModal('#payment-msg')
      } else if (this.data.state == 'processing') {
        console.log('paysky ', 'processing')
        this.$store.commit('checkoutForm/SET_MSG', {
          message: this.$store.getters['location/_t'](
            'Card has been scanned. Payment in process...'
          ),
        })
        showModal('#payment-msg')
      } else {
        hideModal('#payment-msg')
        if (this.data.state == 'success') {
          console.log('paysky ', 'success')
          if (
            this.data.transaction_token ===
            this.$store.getters['checkoutForm/transaction_token']('paysky')
          ) {
            console.log('paysky ', 'token matched')
            //payment screen close code here
            //log(this.data.response)
            if (this.data.message === 'Approved') {
              var component = new Component({
                store,
              })
              this.$store.commit('checkoutForm/SET_MSG', {
                message: this.$store.getters['location/_t'](
                  'Payment done with PaySky'
                ),
              })
              showModal('#payment-msg')
              setTimeout(() => {
                hideModal('#payment-msg')
              }, 2000)

              this.data.response.code = this.data.response.PAN

              this.$store
                .dispatch('checkoutForm/addCardAmount', this.data.response)
                .then(payable => {
                  console.log('paysky ', 'card amount added via paysky')
                  if (
                    payable <= 0.1 ||
                    this.$store.state.checkoutForm.action == 'pay'
                  ) {
                    if (this.needSupervisorAccess) {
                      showModal('#modificationReason')
                    } else {
                      if (this.$store.getters['checkoutForm/validate']) {
                        component
                          .executePayment(
                            this.$store.state.order.orderType.OTApi
                          )
                          .then(() => {
                            component.$destroy()
                          })
                      }
                    }
                  }
                })
                .catch(error => {
                  console.log(error)
                  console.log('paysky ', 'Card amount not added')
                })
            } else {
              this.failEvent()
            }
          } else {
            this.failEvent('Transaction authentication failed')
          }
        } else {
          console.log('paysky ', 'failed')
          this.failEvent()
        }
      }
    } else {
      this.failEvent()
    }
  }
}
