<template>
  <div class="button">
    <div class="template-btn">
      <div class="pay-now">
        <delivery class="pay-btn-holder" @delivery="delivery"></delivery>
      </div>
    </div>
  </div>
</template>
<script>
/* global showModal */
import { mapState } from 'vuex'
import delivery from './common/delivery'
export default {
  name: 'CrmBtn',
  components: {
    delivery,
  },
  computed: {
    ...mapState('order', ['orderSource', 'items']),
  },
  methods: {
    delivery() {
      this.$store.commit('order/ORDER_TYPE', {
        OTview: 'Delivery',
        OTApi: 'call_center',
      })
      if (this.orderSource === 'backend') {
        showModal('#modificationReason')
      } else {
        const modal =
          this.$store.state.location.setModal == '#loyalty-payment'
            ? '#manage-customer'
            : this.$store.state.location.setModal
        showModal(modal)
      }
    },
  },
}
</script>
