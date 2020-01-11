<template>
  <div
    v-if="dineInTabType === 'completed'"
    class="container-fluid running-orders-dinein"
    id="completed-orders-show"
    style="display: block"
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
import { mapState } from 'vuex'
import OrderList from './OrderList'

export default {
  name: 'CompletedOrders',
  components: {
    OrderList,
  },
  computed: {
    ...mapState('dinein', ['dineInTabType']),
  },
}
</script>

<style scoped></style>
