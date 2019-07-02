<template>
  <div v-if="customer && selectedAddress" class="text-center">
    <p>***** DELIVER TO *****</p>
    <div class="customer-info">
      {{ customer.customer_name }}
    </div>
    <div class="customer-info">
      {{ customer.mobile_number }}
    </div>
    <div class="customer-info">
      #{{ selectedAddress.flat_number }},#{{ selectedAddress.building }},
      <br />
      {{ selectedAddress.street }}
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  name: "DeliveryAddress",
  computed: {
    ...mapGetters("customer", ["selectedAddress", "customer"])
  }
};
</script>
