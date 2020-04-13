<template>
  <div class="modal-header customer-header">
    <h4 class="customer-title">
      {{ dt(upSellingParentItem) || _t('Up Selling item') }}
    </h4>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState('category', ['upSellingParentItem']),
  },
}
</script>

<style></style>
