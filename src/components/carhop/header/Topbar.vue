<template>
  <div class="header-main-right color-dashboard-background">
    <button
      type=""
      class="tables-btn-style"
      :class="{ active: orderType === 'running' }"
      @click="
        fetchOrders({
          type: 'running',
          pageId: 'carhopInRunningOrders',
        })
      "
    >
      {{ _t('Running Orders') }}
    </button>
    <button
      type=""
      class="tables-btn-style"
      :class="{ active: orderType === 'completed' }"
      @click="
        fetchOrders({
          type: 'completed',
          pageId: 'carhopCompleteOrders',
        })
      "
    >
      {{ _t('Completed Orders') }}
    </button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
//import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  name: 'TopNavRight',
  props: {},
  data: function() {
    return {
      orderType: 'running',
    }
  },
  updated() {},
  computed: {
    ...mapGetters('location', ['_t']),
  },
  methods: {},
  mounted() {},
}
</script>
