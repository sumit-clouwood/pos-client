<template>
  <div class="modal-header customer-header">
    <h4 class="customer-title">
      {{ _t(comboItemName) || _t('Up Selling item') }}
    </h4>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapGetters('comboItems', ['comboItemName']),
  },
}
</script>

<style></style>
