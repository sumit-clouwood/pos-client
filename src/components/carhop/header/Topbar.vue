<template>
  <div class="header-main-right color-dashboard-background">
    <template v-if="$route.name === 'userDetails'">
      <h2 class="title">{{ _t('Your Profile') }}</h2>
    </template>
    <template v-else>
      <button
        type=""
        class="tables-btn-style"
        :class="{ active: orderStatus === 'in-progress' }"
        @click="fetchOrders({ orderStatus: 'in-progress', page: 1 })"
      >
        {{ _t('Running Orders') }}
      </button>
      <button
        v-if="allowed(PERMS.CARHOP_COMPLETED_ORDERS)"
        type=""
        class="tables-btn-style"
        :class="{ active: orderStatus === 'finished' }"
        @click="fetchOrders({ orderStatus: 'finished', page: 1 })"
      >
        {{ _t('Completed Orders') }}
      </button>
    </template>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  name: 'TopNavRight',
  props: {},
  data: function() {
    return {}
  },
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState('carhop', ['orderStatus']),
    ...mapGetters('auth', ['allowed']),
  },
  methods: {
    ...mapActions('carhop', ['fetchOrders']),
  },
  mounted() {},
}
</script>
<style lang="css" scoped>
.title {
  flex: auto;
  font-weight: 500;
}
</style>
