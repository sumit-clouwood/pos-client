<template>
  <span
    v-if="allowed(PERMS.SWITCH_WAITER && PERMS.SWITCH_WAITER_API)"
    data-toggle="modal"
    data-target="#switchWaiter"
    data-dismiss="modal"
    class="table-popup popbtn bg-success font-weight-bold"
  >
    {{ _t('Switch Waiter') }}
  </span>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'switchWaiter',
  props: {
    orderDetails: Array,
  },
  computed: {
    ...mapGetters('auth', ['allowed']),
    ...mapGetters('location', ['_t']),
  },
  methods: {},
}
</script>
