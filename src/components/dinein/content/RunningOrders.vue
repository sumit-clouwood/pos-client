<template>
  <div
    class="container-fluid running-orders-dinein"
    id="running-orders-show"
    style=""
  >
    <div class="running-order-wrap">
      <div class="rinning-order-title">
        <h2>{{ _t('Running Orders') }}</h2>
      </div>
      <OrderList tabName="running" lookup="lookup_running" />
    </div>
  </div>
</template>

<script>
import OrderList from './OrderList'

export default {
  name: 'RunningOrders',
  components: {
    OrderList,
  },
}
</script>
