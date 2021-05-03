<template>
  <button
    v-if="allowed(PERMS.SWITCH_WAITER && PERMS.SWITCH_WAITER_API)"
    data-toggle="modal"
    data-target="#switchWaiter"
    type="button"
    class="btn bg-success table-popup font-weight-bold"
    data-dismiss="modal"
  >
    {{ _t('Switch Waiter') }}
  </button>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'switchWaiter',
  props: {
    tableBooked: Number,
    orderDetails: Array,
  },
  computed: {
    ...mapGetters('auth', ['allowed']),
    ...mapGetters('location', ['_t']),
  },
  methods: {
    /*setSelectedTable(orderDetails) {
      if (orderDetails) {
        let tableOrder = null
        orderDetails.forEach(order => {
          if (
            order.orderIds &&
            order.orderIds.length &&
            typeof this.allBookedTables != 'undefined'
          ) {
            const orderObj = this.allBookedTables.lookup.orders._id[
              order.orderIds[0]
            ]
            const orderStatus = orderObj.order_status
            if (orderStatus !== 'finished') {
              tableOrder = order
            }
          } else {
            tableOrder = order
          }
        })
        this.$store.commit('dinein/SET_RESERVATION_DATA', tableOrder)
      }
    },*/
  },
}
</script>
