<template>
  <div>
    <div v-if="moveItems">
      <div class="button">
        <div class="template-btn">
          <div class="pay-now">
            <save class="pay-btn-holder" @save="save"></save>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="orderSource === 'backend' || billSplit">
      <div class="button">
        <div class="template-btn">
          <div class="pay-now">
            <pay class="pay-btn-holder" @pay="payNow"></pay>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="isWaiter()">
      <div class="button">
        <div class="template-btn">
          <div class="pay-now">
            <save class="pay-btn-holder" @save="save"></save>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="dinein-cart-buttons">
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
    </div>
  </div>
</template>
<script>
/* global $, clickPayNow showModal */
import { mapGetters, mapState } from 'vuex'
import CheckoutMixin from '@/mixins/Checkout'
import pay from './common/pay'
import save from './common/save'

export default {
  name: 'DineinBtn',
  components: {
    pay,
    save,
  },
  mixins: [CheckoutMixin],
  data() {
    return {
      checkCover: true,
    }
  },
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState('order', [
      'items',
      'orderSource',
      'needSupervisorAccess',
      'orderType',
    ]),
    ...mapState('dinein', ['selectedCover', 'orderReservationData']),
    ...mapState('checkoutForm', ['processing']),
    ...mapState('location', ['brand']),
    billSplit() {
      if (this.$store.state.checkout.splitPaid) {
        return true
      }
      if (this.$store.state.order.splitBill) {
        return true
      }
      return false
    },
    moveItems() {
      if (this.$store.state.order.selectItemsToMove) {
        return true
      }
      return false
    },
  },
  methods: {
    payNow() {
      this.$store.commit('checkoutForm/setAction', 'pay')
      /*this.$store.commit('checkout/SET_PAYMENT_ACTION', 'dine-in-paid-order', {
        root: true,
      })*/
      this.items.find(element => {
        if (typeof element.cover_name == 'undefined') {
          this.checkCover = false
        }
      })
      if (
        this.checkCover ||
        typeof this.selectedCover == 'object' ||
        this.orderType.OTApi !== 'dine_in' ||
        !this.brand.number_of_covers
      ) {
        if (this.$store.state.mobile.device === 'mobile') {
          this.$store.dispatch('paymentMethodsChange')
        } else {
          clickPayNow()
        }
      } else {
        this.$store.commit('order/setAlert', {
          type: 'alert',
          title: 'Dine-in Covers!',
          msg: 'Please select a cover for new item.',
        })
        $('#alert-popup').modal('show')
      }
    },

    save() {
      //dine in order
      let validationError = {}
      let checkCovers = this.items.find(element => {
        return (
          element.cover_name == 'undefined' || element.cover_name == undefined
        )
      })
      this.$store.commit('checkoutForm/setAction', 'add')
      if (this.items.length > 0) {
        if (
          checkCovers == undefined ||
          checkCovers == 'undefined' ||
          this.selectedCover ||
          !this.brand.number_of_covers
        ) {
          if (this.needSupervisorAccess) {
            showModal('#modificationReason')
          } else {
            this.executePayment({ action: 'dine-in-place-order' })
              .then(() => {
                if (this.$store.getters['checkout/complete']) {
                  //Reset Cart and set states and redirect to dine in.
                  this.$store.commit('dinein/SET_COVER', '')
                  // this.$store.dispatch('order/beforeRedirectResetCartDineIn')
                }
              })
              .catch(response => {
                let validationError = {}
                let errors = ''
                if (response.status === 'form_errors') {
                  for (let i in response.form_errors) {
                    response.form_errors[i].forEach(
                      err => (errors += ' ' + err)
                    )
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
          }
        } else {
          this.$store.commit('order/setAlert', {
            type: 'alert',
            title: 'Dine-in Covers!',
            msg: 'Please select a cover for new item.',
          })
          $('#alert-popup').modal('show')
        }
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
.dinein-cart-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  @include responsive(mobile) {
    grid-gap: 10px !important;
    font-size: 15px;
    font-weight: 500;
  }
}
</style>
