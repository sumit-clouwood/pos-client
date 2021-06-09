<template>
  <div>
    <div
      class="takeaway-cart-buttons"
      v-if="orderType === CONST.ORDER_TYPE_TAKEAWAY"
    >
      <div class="button">
        <div class="template-btn">
          <div class="pay-now">
            <pay class="pay-btn-holder" @pay="payNow"></pay>
          </div>
        </div>
      </div>
      <div class="button">
        <div class="template-btn">
          <div class="pay-now">
            <save class="pay-btn-holder" @save="save"></save>
          </div>
        </div>
      </div>
    </div>
    <div class="button" v-else>
      <div class="template-btn">
        <div class="pay-now">
          <pay class="pay-btn-holder" @pay="payNow"></pay>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/* global , clickPayNow $ */
import { mapGetters, mapState } from 'vuex'
import pay from './common/pay'
import Save from './common/save'
import CheckoutMixin from '@/mixins/Checkout'
export default {
  name: 'WalkinBtn',
  components: {
    Save,
    pay,
  },
  mixins: [CheckoutMixin],
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapGetters('order', ['orderType']),
    ...mapState('order', ['items', 'orderSource']),
  },
  methods: {
    payNow() {
      if (this.items.length) {
        clickPayNow()
      }
    },
    save() {
      let validationError = {}
      this.$store.commit('checkoutForm/setAction', 'add')
      if (this.items.length > 0) {
        /*if (this.needSupervisorAccess) {
            showModal('#modificationReason')
          } else {*/
        this.executePayment({ action: 'takeaway-place-order' })
          .then(() => {
            if (this.$store.getters['checkout/complete']) {
              // this.$store.dispatch('order/beforeRedirectResetCartDineIn')
            }
          })
          .catch(response => {
            // eslint-disable-next-line no-console
            console.log(response, 'response')
            let validationError = {}
            let errors = ''
            if (response.status === 'form_errors') {
              for (let i in response.form_errors) {
                response.form_errors[i].forEach(err => (errors += ' ' + err))
              }
            } else if (response.error) {
              errors = response.error
            }
            if (errors !== '') {
              validationError = {
                status: 'flash_message',
                flash_message: errors,
              }
              this.$store.commit(
                'customer/SET_RESPONSE_MESSAGES',
                validationError
              )
              $('#information-popup').modal('show')
            }
          })
          .finally(() => {
            this.$store.commit('checkoutForm/SET_PROCESSING', false)
          })
      } else {
        validationError = {
          status: 'flash_message',
          flash_message: this._t('Please add items.'),
        }
        this.$store.commit('customer/SET_RESPONSE_MESSAGES', validationError)
        $('#information-popup').modal('show')
      }
    },
  },
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/mixins.scss';
.takeaway-cart-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  @include responsive(mobile) {
    grid-gap: 10px !important;
    font-size: 15px;
    font-weight: 500;
  }
}
</style>
