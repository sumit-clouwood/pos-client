<template>
  <div class="payment-screen-footer" id="payment-screen-footer">
    <div
      class="footer-wrap"
      id="add-tip-amt"
      data-toggle="modal"
      data-target="#tip-amount"
    >
      <img src="img/pos/tip.png" alt="payment-method" /><span>Tip Amount</span>
    </div>
    <div class="footer-wrap">
      <img src="img/pos/gift-receipt.png" alt="payment-method" /><span
        >Gift Receipt</span
      >
    </div>
    <div class="footer-wrap" data-toggle="modal" data-target="#add-email">
      <img src="img/pos/email.png" alt="payment-method" /><span>Email</span>
    </div>
    <div
      class="footer-wrap"
      data-toggle="modal"
      data-target="#change-amount"
      data-dismiss="modal"
    >
      <img src="img/pos/done.png" alt="payment-method" /><span>Done</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PayNowFooter',
}
</script>
