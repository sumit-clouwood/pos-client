<template>
  <div class="modal-header customer-header">
    <h4 class="customer-title">
      {{ _t(current_combo.name) || _t('Combo item') }}
    </h4>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapGetters('combo', ['current_combo']),
  },
}
</script>

<style></style>
