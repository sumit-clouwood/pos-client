<template>
  <div class="left-container">
    <div
      class="table-holder container-fluid running-orders-dinein active"
      id="all-tables-show"
      v-if="tablesOnArea && dineInTabType === 'all'"
      style="display: block; padding-right: 0;"
    >
      <TableDraw />
    </div>
    <OrderDetailsPopup />
    <RunningOrders />
    <Waiting />
    <Reservation />
    <CompletedOrders />
    <switch-waiter v-if="allowed(PERMS.SWITCH_WAITER)"></switch-waiter>
  </div>
</template>

<script>
import switchWaiter from './popup/switchWaiter'
import RunningOrders from './content/RunningOrders'
import Reservation from './content/Reservation'
import Waiting from './content/Waiting'
import CompletedOrders from './content/CompletedOrders'
import TableDraw from './content/TableDraw'
import { mapState, mapGetters } from 'vuex'
import OrderDetailsPopup from '@/components/pos/content/OrderDetailPopup'

export default {
  name: 'Content',
  computed: {
    ...mapState('dinein', ['tablesOnArea', 'dineInTabType']),
    ...mapGetters('auth', ['allowed']),
  },
  components: {
    RunningOrders,
    Reservation,
    CompletedOrders,
    TableDraw,
    Waiting,
    OrderDetailsPopup,
    switchWaiter,
  },
  mounted() {
    if (this.$store.getters['checkout/complete']) {
      this.$store.commit('dinein/SET_COVER', '')
    }
    //When POS to Dinein update every table status.
    const reservationId = localStorage.getItem('reservationId')
    if (reservationId !== false) {
      this.$store.dispatch('checkout/reset', false)
      this.$store.dispatch('dinein/getBookedTables', false)
      //this.$store.dispatch('dinein/getDineInArea', false)
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
