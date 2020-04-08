<template>
  <div
    class="modal fade"
    id="card-payemnt"
    role="dialog"
    style="display: none; padding-left: 6px;"
  >
    <div class="modal-dialog modal-dialog-centered">
      <!-- Modal content-->
      <div class="modal-content color-dashboard-background">
        <div class="modal-header customer-header color-secondary">
          <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
          <h4 class="customer-title color-text-invert">
            {{ _t('Card Number') }}
          </h4>
        </div>
        <div class="modal-body add-email-wrap">
          <div class="add-note-area">
            <p class="color-text-invert">
              {{ _t('Enter Card Reference Code') }}
            </p>
            <form>
              <input
                type="text"
                class="add-email-from"
                v-model="code"
                maxlength="4"
                @keypress="Num.toNumberOnly($event)"
              />
            </form>
          </div>
          <div v-show="error" class="msg color-warning">
            <p class="text-danger">{{ error }}</p>
          </div>
        </div>
        <div class="modal-footer">
          <div class="btn-announce">
            <button
              type="button"
              class="btn btn-danger cancel-announce color-button color-text-invert"
              data-dismiss="modal"
              @click="stopProcess()"
            >
              {{ _t('Cancel') }}
            </button>
            <button
              class="btn btn-success btn-large popup-btn-save color-main color-text-invert"
              type="button"
              id="gift-card-btn"
              @click="payByCard('#card-payemnt')"
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
/* global $ hideModal showModal */

import { mapGetters, mapState } from 'vuex'
import CheckoutMixin from '@/mixins/Checkout'

export default {
  name: 'GiftCard',
  mixins: [CheckoutMixin],
  data: function() {
    return {
      code: '',
      error: null,
    }
  },
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState('order', ['needSupervisorAccess']),
  },
  methods: {
    stopProcess() {
      this.$store.commit('checkoutForm/SET_PROCESSING', false)
    },
    payByCard(target) {
      this.error = null
      if (this.code == '') {
        this.error = this._t('Please enter last 4 digit of card')
        this.$store.commit('checkoutForm/SET_PROCESSING', false)

        $(target).modal('show')
      } else {
        this.$store
          .dispatch('checkoutForm/addCardAmount', this.code)
          .then(payable => {
            $(target).modal('hide')
            this.code = ''
            if (
              payable <= 0.1 ||
              this.$store.state.checkoutForm.action == 'pay'
            ) {
              if (this.needSupervisorAccess) {
                showModal('#modificationReason')
              } else {
                if (this.$store.getters['checkoutForm/validate']) {
                  this.executePayment(this.$store.state.order.orderType.OTApi)
                }
              }
              hideModal('#card-payemnt')
            }
          })
          .catch(error => (this.error = error))
      }
    },
  },
}
</script>
<style lang="sass" scoped>
.msg
  padding-top: 20px
</style>
