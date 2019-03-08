<template>
  <div class="holding-order-panel animated zoomIn">
    <Header />
    <div class="wrappers-order-block" v-if="holdOrderList">
      <Items
        v-for="(order, key) in holdOrderList"
        :orderData="order"
        :key="key"
        :currencyCode="currencyCode"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Header from './holdingOrders/Header.vue'
import Items from './holdingOrders/Items.vue'

export default {
  name: 'HoldingOrders',
  components: {
    Header,
    Items,
  },
  props: {},
  computed: {
    ...mapState({
      holdOrderList: state =>
        state.holdOrders.getHoldOrders.status != 0 &&
        state.holdOrders.getHoldOrders.data.length > 0
          ? state.holdOrders.getHoldOrders.data
          : false,
    }),
    ...mapState({
      currencyCode: state => state.location.currency,
    }),
  },
}
</script>
