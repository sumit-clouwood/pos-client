<template>
  <!-- pay now screen -->
  <div class="fade" id="pay-now" style="display: none;">
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-body pay-now-block">
          <div v-show="items.length">
            <div class="order-payment">
              <div class="order-id">
                <h2>{{ _t('Order Payment') }}</h2>
                <p>Order ID #1</p>
              </div>
              <div class="hide-btn">
                <button data-dismiss="modal" id="hide-paynow">
                  {{ _t('Hide Me') }}
                  <span
                    ><i class="fa fa-angle-right" aria-hidden="true"></i
                  ></span>
                </button>
              </div>
            </div>
            <TotalAmount />
            <div class="payment-method-title">
              <h2>{{ _t('Payment Method') }}</h2>
            </div>
            <PaymentMethods />
            <div class="error" v-if="error">
              <p class="text-danger">{{ _t('Error') }}: {{ error }}</p>
            </div>
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
            <AmountCalculator v-show="showCalc" ref="calculator" />
            <br />
            <hr />
            <PaymentBreakdown v-show="showPayBreak" />
            <PayNowFooter />
          </div>
          <div v-show="!items.length">
            <div class="error font-weight-bold">
              {{ _t('Please add some item(s) to order.') }}
            </div>
            <div class="hide-btn">
              <button
                data-dismiss="modal"
                id="hide-paynow"
                class="btn btn-danger"
              >
                {{ _t('Back') }}
                <span
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
/* global $  */
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
    payable(newVal) {
      this.payableAmount = parseFloat(newVal).toFixed(2)
    },
  },
  computed: {
    payableAmount: {
      get() {
        return this.$store.state.checkoutForm.amount > 0
          ? this.$store.state.checkoutForm.amount
          : 0
      },
      set(amount) {
        this.$store.dispatch('checkoutForm/setAmount', amount)
      },
    },
    ...mapState('order', ['items']),
    ...mapState('checkoutForm', ['error', 'showCalc', 'showPayBreak']),
    ...mapGetters('location', ['formatPrice', '_t']),
    ...mapGetters('checkoutForm', ['payable']),
  },
  methods: {
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
