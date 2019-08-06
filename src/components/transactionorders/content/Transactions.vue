<template>
  <div class="main-body color-dashboard-background color-text">
    <search />
    <div :class="['food-wrapper', 'active']">
      <Orderlist v-if="transactionOrderList" />
      <div class="food-block" v-else>
        <div class="text-danger">
          {{ _t('No order found.') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Search from './catalog/Search'
import Orderlist from './catalog/Orderlist'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'Catalog',
  props: {
    msg: String,
  },
  components: {
    Search,
    Orderlist,
  },
  created() {
    this.$store.dispatch('transactionOrders/getTransactionOrders')
  },
  computed: {
    ...mapState({
      transactionOrderList: state =>
        state.transactionOrders.getTransactionOrders,
    }),
    ...mapGetters('location', ['_t']),
  },
}
</script>
