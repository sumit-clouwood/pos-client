<template>
  <div id="payment-method">
    <div class="active" @click="setMethod('Cash')">
      <img src="img/pos/money.png" alt="payment" /><label>Cash</label>
    </div>
    <div @click="setMethod('MasterCard')">
      <img src="img/pos/master-card.png" alt="payment" /><label
        >MasterCard</label
      >
    </div>
    <div @click="setMethod('Visa')">
      <img src="img/pos/visa.png" alt="payment" /><label>Visa</label>
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
