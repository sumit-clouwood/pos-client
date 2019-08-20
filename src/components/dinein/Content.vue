<template>
  <div class="left-container">
    <Header />
    <div
      class="table-holder container-fluid row running-orders-dinein active"
      id="all-tables-show"
      v-if="tablesOnArea"
    >
      <TableDraw />
    </div>
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
import Header from './content/Header'
import { mapState } from 'vuex'

export default {
  name: 'Content',
  computed: {
    ...mapState('dinein', ['tablesOnArea']),
  },
  components: {
    Header,
    RunningOrders,
    Reservation,
    CompletedOrders,
    TableDraw,
    Waiting,
  },
}
</script>
<style scoped>
.inner-container {
  width: 100%;
}
</style>
