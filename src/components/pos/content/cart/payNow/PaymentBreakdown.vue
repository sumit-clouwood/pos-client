<template>
  <div class="payment-breakdown" id="payment-breakdown" style="display:none">
    <div class="payment-breakdown-title">
      <h1 class="color-text">{{ _t('Payment Breakdown') }}</h1>
    </div>

    <div class="payment-method-block">
      <table>
        <tr>
          <th style="width: 250px;" class="color-text color-secondary">
            {{ _t('Payment Method') }}
          </th>
          <th style="width: 150px;" class="color-text color-secondary">
            {{ _t('Amount') }}
          </th>
          <th style="width: 150px;" class="color-text color-secondary"></th>
        </tr>
        <tr v-for="(payment, index) in payments" :key="index">
          <td class="color-main color-text">{{ payment.method.name }}</td>
          <td class="color-main color-text">
            {{ formatPrice(payment.amount) }}
          </td>
          <td class="color-main color-text">
            <a href="" @click.prevent="removePayment(index)"
              ><i class="fa fa-trash color-text-invert"></i
            ></a>
          </td>
        </tr>
        <tr class="pay-tot-amt">
          <td class="color-secondary color-text">{{ _t('Total') }}</td>
          <td class="color-secondary color-text">{{ formatPrice(paid) }}</td>
          <td class="color-secondary color-text"></td>
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
