<template>
  <div class="modal-header customer-header">
    <h4 class="customer-title">{{ _t('Combo Box items') }}</h4>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters('location', ['_t']),
  },
}
</script>

<style></style>
