<template>
  <div class="text-center">
    <p>***** DELIVER TO *****</p>
    <div class="customer-info">
      {{ deliveryAddress.customer.customer_name }}
    </div>
    <div class="customer-info">
      {{ deliveryAddress.customer.mobile_number }}
    </div>
    <div class="customer-info">
      #{{ deliveryAddress.delivery_area }} #{{
        deliveryAddress.order_address.flat_number
      }},#{{ deliveryAddress.order_address.building }},
      <br />
      {{ deliveryAddress.order_address.street }}
    </div>
  </div>
</template>
<script>
export default {
  name: "DeliveryAddress",
  props: ["deliveryAddress"]
};
</script>
