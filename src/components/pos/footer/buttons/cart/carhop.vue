<template>
  <div class="button">
    <div class="template-btn">
      <div class="pay-now">
        <save class="pay-btn-holder" @save="placeCarhop"></save>
      </div>
    </div>
  </div>
</template>
<script>
/* global $ */
import { mapState } from 'vuex'
import save from './common/save'
export default {
  name: 'CarhopBtn',
  components: {
    save,
  },
  computed: {
    ...mapState('checkoutForm', ['processing']),
    ...mapState('order', ['items']),
  },
  methods: {
    placeCarhop() {
      if (this.processing) {
        return false
      }

      this.processing = true

      if (this.items.length === 0) {
        return false
      }
      if (this.processing) {
        // eslint-disable-next-line no-console
        console.log('dual footer click')
        return false
      }

      $('#payment-msg').modal('show')
      this.$store.dispatch('order/startOrder')
      this.$store.commit('checkoutForm/SET_PROCESSING', true)
      this.$store
        .dispatch('checkout/pay', { action: 'carhop-place-order' })
        .then(() => {})
        .catch(() => {})
        .finally(() => {
          this.$store.commit('checkoutForm/SET_PROCESSING', false)
        })
    },
  },
}
</script>
