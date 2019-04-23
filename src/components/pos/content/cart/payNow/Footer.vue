<template>
  <div class="payment-screen-footer" id="payment-screen-footer">
    <div
      class="footer-wrap"
      id="add-tip-amt"
      data-toggle="modal"
      data-target="#tip-amount"
    >
      <img src="img/pos/tip.png" alt="payment-method" /><span>Tip Amount</span>
    </div>
    <div class="footer-wrap">
      <img src="img/pos/gift-receipt.png" alt="payment-method" /><span
        >Gift Receipt</span
      >
    </div>
    <div class="footer-wrap" data-toggle="modal" data-target="#add-email">
      <img src="img/pos/email.png" alt="payment-method" /><span>Email</span>
    </div>

    <div class="footer-wrap" @click="pay">
      <img src="img/pos/done.png" alt="payment-method" /><span>Done</span>
    </div>
  </div>
</template>

<script>
/* global $ */
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'PayNowFooter',
  computed: {
    ...mapState('checkout', ['changedAmount']),
    ...mapState('checkoutForm', ['msg', 'error']),
    ...mapGetters('checkoutForm', ['validate']),
  },

  mounted() {
    $('#payment-msg').modal({
      backdrop: 'static',
      keyboard: false,
      show: false,
    })
  },
  methods: {
    pay() {
      if (this.validate) {
        $('#payment-screen-footer').prop('disabled', true)
        $('#payment-msg').modal('show')
      }

      this.$store
        .dispatch('checkout/pay')
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
    },
  },
}
</script>
<style lang="sass" scoped>
.payment-screen-footer
  min-width: 518px;
</style>
