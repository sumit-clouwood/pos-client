<template>
  <div class="payment-breakdown" id="payment-breakdown">
    <div class="payment-breakdown-title">
      <h1>Payment Breakdown</h1>
    </div>

    <div class="payment-method-block">
      <table>
        <tr>
          <th style="width: 250px;">Payment Method</th>
          <th style="width: 150px;">Amount</th>
          <th style="width: 150px;"></th>
        </tr>
        <tr>
          <td>Cash</td>
          <td>200</td>
          <td><img src="img/pos/delete.png" alt="delete" /></td>
        </tr>
        <tr class="pay-tot-amt">
          <td>Total</td>
          <td>200.00</td>
          <td></td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PaymentBreakdown',
}
</script>
