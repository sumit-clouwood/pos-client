<template>
  <!-- pay now screen -->
  <div
    class="fade color-dashboard-background"
    id="pay-now"
    style="display: none;"
  >
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content color-dashboard-background">
        <div class="modal-body pay-now-block">
          <div v-show="items.length" class="color-dashboard-background">
            <div class="order-payment">
              <div class="order-id">
                <h2 class="color-text">{{ _t('Order Payment') }}</h2>
                <!--<p>Order ID #1</p>-->
              </div>
              <div class="hide-btn">
                <button
                  data-dismiss="modal"
                  id="hide-paynow"
                  class="color-text-invert color-main"
                  @click="closePayNowError()"
                >
                  {{ _t('Hide Me') }}
                  <span
                    ><i class="fa fa-angle-right" aria-hidden="true"></i
                  ></span>
                </button>
              </div>
            </div>
            <TotalAmount :param="{ totalAmountBlock: true }" />
            <div class="payment-method-title">
              <h2 class="color-text">{{ _t('Payment Method') }}</h2>
              <p class="color-text">
                {{ dt(method) }}
              </p>
            </div>
            <PaymentMethods />
            <form>
              <div class="payment-input-block">
                <input
                  type="text"
                  name="payment"
                  v-model.number="payableAmount"
                  @keypress="filterInput"
                  autocomplete="off"
                  @click="showCalculator()"
                  :placeholder="formatPrice(0.0)"
                />
                <img
                  src="https://d3jjfdwi6rnqlf.cloudfront.net/img/pos/payment-input-icon.png"
                  class="input-image"
                  @click="showPayBreakdown"
                />
              </div>
            </form>
            <AmountCalculator v-show="showCalc" ref="calculator" />
            <br />
            <hr />
            <PaymentBreakdown v-show="showPayBreak" />
            <PayNowFooter />
          </div>
          <div v-show="!items.length">
            <div class="error font-weight-bold color-text">
              {{ _t('Please add some item(s) to order.') }}
            </div>
            <div class="hide-btn">
              <button
                data-dismiss="modal"
                id="hide-paynow"
                class="btn btn-danger color-secondary color-text-invert"
                @click="closePayNowError()"
              >
                {{ _t('Back') }}
                <span class="color-text-invert"
                  ><i class="fa fa-angle-right" aria-hidden="true"></i
                ></span>
              </button>
            </div>
          </div>
          <div class="pay-now-btn-next" @click="payNowCalcHendlerChange">
            {{ _t('Next') }}
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- End pay now screen  -->
</template>
<script>
/* global $  hidePayNow */
import PayNowFooter from './payNow/Footer'
import TotalAmount from './payNow/TotalAmount'
import PaymentMethods from './payNow/PaymentMethods'
import AmountCalculator from './payNow/AmountCalculator'
import PaymentBreakdown from './payNow/PaymentBreakdown'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'PayNow',
  components: {
    PaymentMethods,
    TotalAmount,
    PayNowFooter,
    PaymentBreakdown,
    AmountCalculator,
  },
  watch: {
    payable(newVal, previousVal) {
      this.payableAmount = parseFloat(newVal).toFixed(2)
      if (!newVal && previousVal > newVal) {
        $('.modal-backdrop').remove()
        $('#order-confirmation').hide()
        hidePayNow()
      }
    },
    payableAmount(newVal) {
      //handle backspace/delete
      const str = '' + newVal
      if (!str.match(/\./g)) {
        this.$store.commit('checkoutForm/SET_DECIMAL', false)
      }
    },
  },
  data() {
    return {}
  },
  computed: {
    payableAmount: {
      get() {
        if (this.$store.state.checkoutForm.amount > 0) {
          return this.$store.state.checkoutForm.amount
        } else {
          return 0
        }
      },
      set(amount) {
        this.$store.dispatch('checkoutForm/setAmount', amount)
      },
    },
    ...mapState('order', ['items']),
    ...mapState('checkoutForm', [
      'error',
      'showCalc',
      'showPayBreak',
      'method',
    ]),
    ...mapGetters('location', ['formatPrice', '_t']),
    ...mapGetters('order', ['orderTotal']),
    ...mapGetters('checkoutForm', ['payable']),
    ...mapGetters(['payNowCalcHendler']),
  },
  methods: {
    closePayNowError() {
      hidePayNow()
    },
    showPayBreakdown() {
      $('#payment-breakdown').show()
    },
    showCalculator() {
      $('#payment-breakdown').hide()
      this.$store.commit('checkoutForm/showCalc', true)
    },
    filterInput($event) {
      // eslint-disable-next-line no-console
      const keyCode = $event.keyCode ? $event.keyCode : $event.which
      if (keyCode === 46) {
        if (!this.$store.state.checkoutForm.decimalExists) {
          this.$store.commit('checkoutForm/SET_DECIMAL', true)
          return true
        }
      }
      if (keyCode < 48 || keyCode > 57) {
        // 46 is dot
        $event.preventDefault()
      }
    },
    payNowCalcHendlerChange() {
      this.$store.dispatch('payNowCalcHendlerChange')
    },
  },
}
</script>
<style lang="scss">
#pay-now {
  /* left: -100%;*/

  &.show {
    /*left: auto;*/
  }
}
</style>
