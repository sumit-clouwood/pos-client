<template>
  <div class="left-container">
    <div
      class="table-holder container-fluid running-orders-dinein active"
      id="all-tables-show"
      v-if="tablesOnArea && dineInTabType === 'all'"
      style="display: block"
    >
      <TableDraw />
    </div>
    <OrderDetailsPopup />
    <RunningOrders />
    <Waiting />
    <Reservation />
    <CompletedOrders />
  </div>
</template>

<script>
import RunningOrders from './content/RunningOrders'
import Reservation from './content/Reservation'
import Waiting from './content/Waiting'
import CompletedOrders from './content/CompletedOrders'
import TableDraw from './content/TableDraw'
import { mapState } from 'vuex'
import OrderDetailsPopup from '@/components/pos/content/OrderDetailPopup'

export default {
  name: 'Content',
  computed: {
    ...mapState('dinein', ['tablesOnArea', 'dineInTabType']),
  },
  components: {
    RunningOrders,
    Reservation,
    CompletedOrders,
    TableDraw,
    Waiting,
    OrderDetailsPopup,
  },
  mounted() {
    //When POS to Dinein update every table status.
    this.$store.dispatch('dinein/getBookedTables', false)
    this.$store.dispatch('dinein/getDineInArea', false)
    this.selectedAreaObj = this.$store.state.dinein.activeArea
    this.$store.dispatch('dinein/selectedArea', this.selectedAreaObj)
  },
}
</script>
<style scoped>
.inner-container {
  width: 100%;
}
</style>
