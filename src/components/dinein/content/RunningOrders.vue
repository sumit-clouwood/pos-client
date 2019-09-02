<template>
  <div
    v-if="dineInTabType === 'running'"
    class="container-fluid running-orders-dinein"
    id="running-orders-show"
    style="display: block"
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
import { mapState } from 'vuex'
export default {
  name: 'RunningOrders',
  components: {
    OrderList,
  },
  computed: {
    ...mapState('dinein', ['dineInTabType']),
  },
}
</script>
