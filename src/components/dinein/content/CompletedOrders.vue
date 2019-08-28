<template>
  <div
    class="container-fluid row running-orders-dinein"
    id="completed-orders-show"
    style=""
  >
    <div class="completed-order-wrap">
      <div class="rinning-order-title">
        <h2>{{ _t('Completed Orders') }}</h2>
      </div>

      <OrderList tabName="completed" lookup="lookup_completed" />
    </div>
  </div>
</template>

<script>
import OrderList from './OrderList'

export default {
  name: 'CompletedOrders',
  components: {
    OrderList,
  },
}
</script>

<style scoped></style>
