<template>
  <div class="header-main-right color-dashboard-background">
    <button
      type=""
      class="tables-btn-style"
      :class="{ active: orderStatus === 'in-progress' }"
      @click="fetchOrders({ orderStatus: 'in-progress', page: 1 })"
    >
      {{ _t('Running Orders') }}
    </button>
    <button
      type=""
      class="tables-btn-style"
      :class="{ active: orderStatus === 'finished' }"
      @click="fetchOrders({ orderStatus: 'finished', page: 1 })"
    >
      {{ _t('Completed Orders') }}
    </button>
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
  },
  methods: {
    ...mapActions('carhop', ['fetchOrders']),
  },
  mounted() {},
}
</script>
