<template>
  <div class="payment-break-down">
    <div v-for="(payment, key) in payments" :key="key">
      <span class="left">Paid by {{ payment[0] }} :</span>
      <span class="right"> {{ formatPrice(payment[1]) }}</span>
    </div>
  </div></template
>
<script>
import { mapGetters } from "vuex";
export default {
  name: "PaymentBreakdown",
  props: ["payments"],
  computed: {
    ...mapGetters("location", ["formatPrice"])
  }
};
</script>
