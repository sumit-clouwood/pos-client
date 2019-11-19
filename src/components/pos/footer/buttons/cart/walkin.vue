<template>
  <div class="button">
    <div class="template-btn">
      <div class="pay-now">
        <pay class="pay-btn-holder" @pay="payNow"></pay>
      </div>
    </div>
  </div>
</template>
<script>
/* global clickPayNow showModal */
import { mapState } from 'vuex'
import pay from './common/pay'
export default {
  name: 'WalkinBtn',
  components: {
    pay,
  },
  computed: {
    ...mapState('order', ['orderSource', 'items']),
  },
  methods: {
    payNow() {
      if (this.orderSource === 'backend') {
        showModal('#modificationReason')
      } else if (this.items.length) {
        clickPayNow()
      }
    },
  },
}
</script>
