<template>
  <div class="wrappers-new-orders">
    <div class="order">
      <h5>{{ _t('Holding Orders') }}</h5>
      <p>{{ todayDateFull }}</p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Header',
  props: {},
  computed: {
    ...mapGetters('sync', ['todayDateFull']),
    ...mapGetters('location', ['_t']),
  },
}
</script>
