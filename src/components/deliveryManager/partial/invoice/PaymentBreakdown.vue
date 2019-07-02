<template>
  <div class="payment-break-down">
    <span class="left"
      ><b>Paid by {{ referral }} :</b></span
    >
    <div v-for="(payment, key) in payments" :key="key">
      <span class="left">Amount Received</span>
      <span class="right"> {{ formatPrice(payment.payment_amount) }}</span>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "PaymentBreakdown",
  props: ["payments", "referral"],
  computed: {
    ...mapGetters("location", ["formatPrice"])
  }
};
</script>
