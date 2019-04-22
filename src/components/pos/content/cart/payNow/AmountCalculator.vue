<template>
  <div class="amount-keypad">
    <div class="payment-key" @click="set(7)">7</div>
    <div class="payment-key" @click="set(8)">8</div>
    <div class="payment-key" @click="set(9)">9</div>
    <div class="payment-key" @click="set(10)">10</div>
    <div class="payment-key" @click="set(4)">4</div>
    <div class="payment-key" @click="set(5)">5</div>
    <div class="payment-key" @click="set(6)">6</div>
    <div class="payment-key" @click="set(20)">20</div>
    <div class="payment-key" @click="set(1)">1</div>
    <div class="payment-key" @click="set(2)">2</div>
    <div class="payment-key" @click="set(3)">3</div>
    <div class="backspace" id="backspace" @click="removeDigit()">
      <img src="img/pos/close-icon.png" alt="close" />
    </div>
    <div id="clearcalc" class="" @click="reset()">c</div>
    <div class="payment-key" @click="set('0')">0</div>
    <div class="payment-key" @click="set('.')">.</div>
    <div id="add-amt" @click="addAmount">Add</div>
  </div>
</template>

<script>
/* global showModal*/
export default {
  name: 'AmountCalculator',
  data() {
    return {
      init: false,
    }
  },
  methods: {
    addAmount() {
      if (this.$store.state.checkoutForm.method.is_gift) {
        this.$store
          .dispatch('checkoutForm/validateGiftPayment')
          .then(() => {
            showModal('#Gift-card-payemnt')
          })
          .catch()
      } else if (this.$store.state.checkoutForm.method.is_cash) {
        this.$store.dispatch('checkoutForm/addAmount').then(() => {})
      } else if (!this.$store.state.checkoutForm.method.LoyalLoyalty) {
        this.$store
          .dispatch('checkoutForm/validateCardPayment')
          .then(() => {
            showModal('#card-payemnt')
          })
          .catch()
      }
    },
    set(amount) {
      if (!this.init) {
        this.$store.commit('checkoutForm/appendAmount', '')
        this.init = true
      }
      this.$store.commit('checkoutForm/appendAmount', amount)
    },
    reset() {
      this.$store.dispatch('checkoutForm/resetAmount')
    },
    removeDigit() {
      this.$store.commit('checkoutForm/removeDigit')
    },
  },
}
</script>
<style lang="sass" scoped>
.amount-keypad
  min-width: 518px;
</style>
