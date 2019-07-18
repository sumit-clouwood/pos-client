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
            <TotalAmount />
            <div class="payment-method-title">
              <h2 class="color-text">{{ _t('Payment Method') }}</h2>
            </div>
            <PaymentMethods />
            <div class="error" v-if="error">
              <p class="text-danger color-warning">
                {{ _t('Error') }}: {{ error }}
              </p>
            </div>
            <form>
              <div class="payemnt-input-block">
                <input
                  type="text"
                  name="payment"
                  v-model.number="payableAmount"
                  id="input"
                  autocomplete="off"
                  @click="showCalculator()"
                  :placeholder="formatPrice(0.0)"
                />
                <img
                  src="img/pos/payment-input-icon.png"
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
  },
  computed: {
    payableAmount: {
      get() {
        return this.$store.state.checkoutForm.amount > 0
          ? this.$store.state.checkoutForm.amount
          : this.orderTotal
      },
      set(amount) {
        this.$store.dispatch('checkoutForm/setAmount', amount)
      },
    },
    ...mapState('order', ['items']),
    ...mapState('checkoutForm', ['error', 'showCalc', 'showPayBreak']),
    ...mapGetters('location', ['formatPrice', '_t']),
    ...mapGetters('order', ['orderTotal']),
    ...mapGetters('checkoutForm', ['payable']),
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
  },
}
</script>
