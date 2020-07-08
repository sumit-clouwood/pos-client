<template>
  <div class="modal-footer">
    <div class="text-danger" v-if="error">
      {{ error }}
    </div>
    <div class="btn-announce">
      <button
        type="button"
        class="btn btn-success btn-default "
        @click="addToCart"
      >
        {{ _t('Add to Order') }}
      </button>
      <button
        type="button"
        class="btn btn-danger cancel-announce"
        data-dismiss="modal"
      >
        {{ _t('Cancel') }}
      </button>
    </div>
  </div>
</template>

<script>
/* global hideModal */
import { mapGetters } from 'vuex'
import Cart from '@/mixins/Cart'
export default {
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapGetters('combo', ['combo_errors']),
  },
  mixins: [Cart],
  data() {
    return {
      error: false,
    }
  },
  methods: {
    addToCart() {
      const item = this.$store.getters['combo/current_combo']
      this.$store.dispatch('combo/validate_combo_items')
      if (!this.combo_errors) {
        this.itemsAddToCart(item)
        hideModal('#combox-box-popup')
      }
    },
  },
}
</script>
<style scoped>
.btn-announce {
  margin-bottom: 0px !important;
}
@media only screen and (max-width: 600px) and (min-width: 320px) {
  .btn-announce {
    margin: 0 auto;
    margin-bottom: 0px !important;
  }
}
</style>
