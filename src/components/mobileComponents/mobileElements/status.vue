<template>
  <div class="status">
    <div class="fa fa-fw fa-circle" :class="{ online: online }"></div>
    <div class="status-text">{{ _t('Online') }}</div>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState('sync', ['online']),
  },
}
</script>
<style lang="scss">
.status {
  display: grid;
  grid-template-columns: max-content max-content;
  align-items: center;
  .fa-circle {
    font-size: 12px;
    &.online {
      color: #64c434;
    }
    margin-right: 5px;
    margin-left: -3px;
  }

  .status-text {
    font-size: 12px;
    color: #4b4e53;
  }
}
</style>
