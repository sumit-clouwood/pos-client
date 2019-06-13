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
    <div id="add-amt" @click="addAmount">{{ _t('+ Add') }}</div>
  </div>
</template>

<script>
/* global showModal*/
import * as CONST from '@/constants'
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'AmountCalculator',
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState('checkoutForm', ['method']),
  },
  data() {
    return {
      init: false,
    }
  },
  methods: {
    addAmount() {
      this.$store.commit('checkoutForm/setAction', 'add')
      this.$store.dispatch('checkoutForm/validatePayment').then(() => {
        if (this.method.type == CONST.GIFT_CARD) {
          showModal('#Gift-card-payemnt')
        } else if (this.method.type == CONST.LOYALTY) {
          //show loyalty popup if needed
        } else if (this.method.reference_code) {
          showModal('#card-payemnt')
        } else {
          //cash payments
          this.$store.dispatch('checkoutForm/addAmount')
        }
      })
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
