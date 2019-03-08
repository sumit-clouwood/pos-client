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
                <h2>Order Payment</h2>
                <p>Order ID #0213232</p>
              </div>
              <div class="hide-btn">
                <button data-dismiss="modal" id="hide-paynow">
                  Hide
                  <span
                    ><i class="fa fa-angle-right" aria-hidden="true"></i
                  ></span>
                </button>
              </div>
            </div>
            <TotalAmount />
            <div class="payment-method-title">
              <h2>Payment Method</h2>
            </div>
            <PaymentMethods />
            <div class="error" v-if="error">{{ error }}</div>
            <div class="payemnt-input-block">
              <input
                type="text"
                name="payment"
                v-model.number="payable"
                id="input"
                @click="showCalc = true"
                :placeholder="formatPrice(0.0)"
              />
              <img src="img/pos/payment-input-icon.png" class="input-image" />
            </div>
            <AmountCalculator v-show="showCalc" />
            <PaymentBreakdown v-show="!showCalc" />
            <PayNowFooter />
          </div>
          <div v-show="!items.length">
            <div class="error">Please add some item(s) to order.</div>
            <div class="hide-btn">
              <button data-dismiss="modal" id="hide-paynow">
                Back
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
  computed: {
    showCalc: {
      get() {
        return this.$store.state.checkoutForm.showCalc
      },
      set(val) {
        return this.$store.commit('checkoutForm/showCalc', val)
      },
    },
    payable: {
      get() {
        return this.$store.state.checkoutForm.amount
      },
      set(amount) {
        this.$store.dispatch('checkoutForm/setAmount', amount)
      },
    },
    ...mapState('order', ['items']),
    ...mapState('checkoutForm', ['error']),
    ...mapGetters('location', ['formatPrice']),
  },
}
</script>
