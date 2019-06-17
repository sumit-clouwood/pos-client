<template>
  <div
    class="modal fade"
    id="card-payemnt"
    role="dialog"
    style="display: none; padding-left: 6px;"
  >
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header customer-header">
          <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
          <h4 class="customer-title">{{ _t('Card Number') }}</h4>
        </div>
        <div class="modal-body add-email-wrap">
          <div class="add-note-area">
            <p>{{ _t('Enter Card Reference Code') }}</p>
            <input type="text" class="add-email-from" v-model="code" />
          </div>
          <div v-show="error" class="msg">
            <p class="text-danger">{{ error }}</p>
          </div>
        </div>
        <div class="modal-footer">
          <div class="btn-announce">
            <button
              type="button"
              class="btn btn-danger cancel-announce"
              data-dismiss="modal"
            >
              {{ _t('Cancel') }}
            </button>
            <button
              class="btn btn-success btn-large popup-btn-save"
              type="button"
              id="gift-card-btn"
              data-toggle="modal"
              @click="payByCard"
            >
              {{ _t('Add') }}
            </button>
          </div>
          <!-- <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
/* global $ hideModal */
export default {
  name: 'GiftCard',
  data: function() {
    return {
      code: '',
      error: null,
    }
  },
  computed: {
    ...mapGetters('location', ['_t']),
  },
  methods: {
    payByCard() {
      this.error = null
      this.$store
        .dispatch('checkoutForm/addCardAmount', this.code)
        .then(() => {
          this.code = ''
          if (this.$store.state.checkoutForm.action == 'pay') {
            if (this.$store.getters['checkoutForm/validate']) {
              this.$store
                .dispatch('checkout/pay')
                .then(() => {
                  $('#payment-msg').modal('show')
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
            }
          }
          hideModal('#card-payemnt')
        })
        .catch(error => (this.error = error))
    },
  },
}
</script>
<style lang="sass" scoped>
.msg
  padding-top: 20px
</style>
