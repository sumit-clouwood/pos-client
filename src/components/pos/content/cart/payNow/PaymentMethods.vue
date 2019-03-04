<template>
  <div id="payment-method">
    <div class="active">
      <img src="img/pos/money.png" alt="payment" /><label>Cash</label>
    </div>
    <div>
      <img src="img/pos/master-card.png" alt="payment" /><label
        >MasterCard</label
      >
    </div>
    <div><img src="img/pos/visa.png" alt="payment" /><label>Visa</label></div>
    <div class="gift_card" data-toggle="modal" data-target="#Gift-card-payemnt">
      <img src="img/pos/gift.png" alt="payment" /><label>Gift Card</label>
    </div>
    <div><img src="img/pos/money.png" alt="payment" /></div>
    <div><img src="img/pos/master-card.png" alt="payment" /></div>
    <div><img src="img/pos/visa.png" alt="payment" /></div>
  </div>
</template>

<script>
export default {
  name: 'PaymentMethods',
}
</script>
