<template>
  <div id="payment-method">
    <div class="active">
      <img
        src="img/pos/money.png"
        alt="payment"
        @click="setMethod('Cash')"
      /><label>Cash</label>
    </div>
    <div>
      <img
        src="img/pos/master-card.png"
        alt="payment"
        @click="setMethod('MasterCard')"
      /><label>MasterCard</label>
    </div>
    <div>
      <img
        src="img/pos/visa.png"
        alt="payment"
        @click="setMethod('Visa')"
      /><label>Visa</label>
    </div>
    <div class="gift_card" data-toggle="modal" data-target="#Gift-card-payemnt">
      <img src="img/pos/gift.png" alt="payment" /><label>Gift Card</label>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'PaymentMethods',
  methods: {
    ...mapActions('checkoutForm', ['setMethod']),
  },
}
</script>
