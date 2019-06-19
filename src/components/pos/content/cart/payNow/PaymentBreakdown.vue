<template>
  <div class="payment-breakdown" id="payment-breakdown" style="display:none">
    <div class="payment-breakdown-title">
      <h1>{{ _t('Payment Breakdown') }}</h1>
    </div>

    <div class="payment-method-block">
      <table>
        <tr>
          <th style="width: 250px;">{{ _t('Payment Method') }}</th>
          <th style="width: 150px;">{{ _t('Amount') }}</th>
          <th style="width: 150px;"></th>
        </tr>
        <tr v-for="(payment, index) in payments" :key="index">
          <td>{{ payment.method.name }}</td>
          <td>{{ formatPrice(payment.amount) }}</td>
          <td>
            <a href="" @click.prevent="removePayment(index)"
              ><img src="img/pos/delete-icon.svg" alt="delete"
            /></a>
          </td>
        </tr>
        <tr class="pay-tot-amt">
          <td>{{ _t('Total') }}</td>
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
    ...mapGetters('location', ['formatPrice', '_t']),
    ...mapGetters('checkoutForm', ['paid']),
  },
  methods: {
    ...mapActions('checkoutForm', ['removePayment']),
  },
}
</script>
