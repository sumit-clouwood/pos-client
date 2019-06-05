<template>
  <div class="add-screen-walkin">
    <p class="walk-in">{{ _t(orderType) }}</p>
    <p class="walk-in-place text-capitalize">{{ locationName.name }}</p>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'HeaderOrderType',
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState({
      locationName: state => state.location.store,
    }),
    ...mapState('order', ['orderType']),
  },
}
</script>
