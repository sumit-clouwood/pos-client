<template>
  <div>
    <div class="button">
      <div class="template-btn">
        <div class="pay-now">
          <pay class="pay-btn-holder" @pay="payNow"></pay>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/* global , clickPayNow */
import { mapGetters, mapState } from 'vuex'
import pay from './common/pay'
export default {
  name: 'WalkinBtn',
  components: {
    pay,
  },
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState('order', ['items', 'orderSource']),
  },
  methods: {
    payNow() {
      if (this.items.length) {
        clickPayNow()
      }
    },
  },
}
</script>
