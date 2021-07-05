<template>
  <div>
    <button
      v-if="typeof order.carhop_ready !== undefined && !order.carhop_ready"
      class="button btn btn-success color-main color-text-invert"
      type="button"
      :id="order._id"
      @click="carhopOrderReady(order._id)"
    >
      <span>{{ _t('Ready') }}</span>
    </button>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'ReadyAction',
  props: {
    order: Object,
  },
  computed: {
    ...mapGetters('location', ['_t']),
  },
  methods: {
    ...mapActions('order', ['makeOrderReady']),
    carhopOrderReady(orderId) {
      this.makeOrderReady(orderId).then(reaponse => {
        if (reaponse.data.status === 'ok') {
          document.getElementById(orderId).style.visibility = 'hidden'
        }
      })
    },
  },
}
</script>
<style lang="sass" scoped></style>
