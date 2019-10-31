<template>
  <div class="left-container">
    <div
      class="table-holder container-fluid running-orders-dinein active"
      id="all-tables-show"
      v-if="tablesOnArea && dineInTabType === 'all'"
      style="display: block; padding-right: 0;"
    >
      <Preloader v-if="loading" />
      <TableDraw v-else />
    </div>
    <OrderDetailsPopup />
    <RunningOrders />
    <Waiting />
    <Reservation />
    <Preloader v-if="loading" />
    <CompletedOrders v-else />
  </div>
</template>

<script>
import Preloader from '@/components/util/Progress'
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
    Preloader,
  },
  mounted() {
    this.$store.commit('dinein/SET_COVER', '')
    //When POS to Dinein update every table status.
    const reservationId = localStorage.getItem('reservationId')
    if (reservationId !== false) {
      this.$store.dispatch('checkout/reset')
      this.$store.dispatch('dinein/getBookedTables', false)
      this.$store.dispatch('dinein/getDineInArea', false)
      this.$store.commit('dinein/RESERVATION_ID', false)
      this.selectedAreaObj = this.$store.state.dinein.activeArea
      this.$store.dispatch('dinein/selectedArea', this.selectedAreaObj)
    }
  },
}
</script>
<style scoped>
.inner-container {
  width: 100%;
}
</style>
