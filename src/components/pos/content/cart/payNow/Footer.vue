<template>
  <div class="payment-screen-footer" id="payment-screen-footer">
    <div
      class="footer-wrap"
      id="add-tip-amt"
      data-toggle="modal"
      data-target="#tip-amount"
    >
      <img src="img/pos/tip.png" alt="payment-method" /><span>
        {{ _t('Tip Amount') }}
      </span>
    </div>
    <div class="footer-wrap">
      <img src="img/pos/gift-receipt.png" alt="payment-method" /><span>{{
        _t('Gift Receipt')
      }}</span>
    </div>
    <div class="footer-wrap" data-toggle="modal" data-target="#add-email">
      <img src="img/pos/email.png" alt="payment-method" /><span>
        {{ _t('Email') }}
      </span>
    </div>

    <div class="footer-wrap" @click="pay" id="submitOrder">
      <img src="img/pos/done.png" alt="payment-method" /><span>
        {{ _t('Done') }}
      </span>
    </div>
  </div>
</template>

<script>
/* global $ showModal */
import { mapGetters, mapState } from 'vuex'
import * as CONST from '@/constants'

export default {
  name: 'PayNowFooter',
  computed: {
    ...mapState('checkout', ['changedAmount']),
    ...mapState('checkoutForm', ['msg', 'error', 'method']),
    ...mapGetters('checkoutForm', ['validate']),
    ...mapGetters('location', ['_t']),
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
          return resolve()
        }
        if (this.$store.state.checkoutForm.amount <= 0.1) return resolve()

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
              this.$store.dispatch('checkoutForm/addAmount').then(() => {
                resolve()
              })
            }
          })
          .catch(() => reject())
      })
    },
    pay() {
      this.$store.commit('checkoutForm/setAction', 'pay')
      this.addAmount().then(() => {
        $('#payment-screen-footer').prop('disabled', true)
        $('#payment-msg').modal('show')

        this.$store
          .dispatch('checkout/pay', this.$store.state.order.orderType.OTApi)
          .then(() => {
            if (this.changedAmount >= 0.1) {
              $('#payment-msg').modal('hide')
              $('#change-amount').modal('show')
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
      })
    },
  },
}
</script>
<style lang="sass" scoped>
.payment-screen-footer
  min-width: 518px
</style>
