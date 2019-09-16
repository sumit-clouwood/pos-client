<template>
  <div
    v-if="dineInTabType === 'reservation'"
    class="container-fluid running-orders-dinein"
    id="reservation-orders-show"
    style="display: block"
  >
    <div class="completed-order-wrap">
      <div class="rinning-order-title">
        <h2>Reservation Orders</h2>
      </div>

      <div class="running-order-table-wrap">
        <CommingSoon />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import CommingSoon from '../../util/CommingSoon'
export default {
  name: 'Reservation',
  components: { CommingSoon },
  computed: {
    ...mapState('dinein', ['dineInTabType']),
  },
}
</script>

<style scoped></style>
