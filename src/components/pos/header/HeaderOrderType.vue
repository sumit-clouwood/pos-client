<template>
  <div class="header-main-left-info color-text-invert">
    <p class="title">{{ _t(orderType.OTview) }}</p>
    <p class="subtitle">{{ locationName.name }}</p>
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
