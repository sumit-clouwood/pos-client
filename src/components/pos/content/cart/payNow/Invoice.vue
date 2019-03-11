<template>
  <div class="invoice" id="printarea" v-if="items">
    <h1>Invoice</h1>
    <div v-show="print"></div>
  </div>
</template>

<script>
/* global $ */
import { mapState } from 'vuex'

export default {
  name: 'Invoice',
  props: {},
  computed: {
    ...mapState({
      items: state => state.order.items,
    }),
    ...mapState({
      print: state => state.checkout.print,
    }),
  },
  data: function() {},
  updated() {
    if (this.$store.state.checkout.print) {
      const w = window.open()
      w.document.write($('#printarea').html())
      w.print()
      w.close()
      this.$store.commit('checkout/PRINT', false)
    }
  },
}
</script>
