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
        <tr v-for="(payment, index) in payments" :key="index">
          <td>{{ payment.method }}</td>
          <td>{{ formatPrice(payment.amount) }}</td>
          <td>
            <a href="" @click.prevent="removePayment(index)"
              ><img src="img/pos/delete-icon.svg" alt="delete"
            /></a>
          </td>
        </tr>
        <tr class="pay-tot-amt">
          <td>Total</td>
          <td>{{ formatPrice(paid) }}</td>
          <td></td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
export default {
  name: 'PaymentBreakdown',
  computed: {
    ...mapState('checkoutForm', ['payments']),
    ...mapGetters('location', ['formatPrice']),
    ...mapGetters('checkoutForm', ['paid']),
  },
  methods: {
    ...mapActions('checkoutForm', ['removePayment']),
  },
}
</script>
