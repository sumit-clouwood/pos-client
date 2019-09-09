<template>
  <div
    v-if="dineInTabType === 'waiting'"
    class="container-fluid running-orders-dinein"
    id="waiting-dinein-show"
    style="display: block"
  >
    <div class="completed-order-wrap">
      <div class="rinning-order-title">
        <h2>Waiting Customer</h2>
      </div>

      <div class="running-order-table-wrap">
        Coming soon...
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Waiting',
  computed: {
    ...mapState('dinein', ['dineInTabType']),
  },
}
</script>

<style scoped></style>
