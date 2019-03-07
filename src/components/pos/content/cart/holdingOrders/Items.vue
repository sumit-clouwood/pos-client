<template>
  <div class="wrappers-orders">
    <div class="orders-name">
      <p>{{ orderData.order_no }}</p>
    </div>
    <div class="aed-amt">
      <span>{{ currencyCode }} {{ orderData.balance_due }}</span>
    </div>
    <div class="dlt-btn">
      <img src="img/pos/delete-icon.svg" alt="delete" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Items',
  props: {
    orderData: Object,
    currencyCode: String
  },
}
</script>
