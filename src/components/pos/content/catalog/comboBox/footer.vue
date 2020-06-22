<template>
  <div class="modal-footer">
    <div class="text-danger" v-if="error">
      {{ error }}
    </div>
    <div class="btn-announce">
      <button
        type="button"
        class="btn btn-success btn-default "
        @click="addComboItemCart"
      >
        {{ _t('Add to Order') }}
      </button>
      <button
        type="button"
        class="btn btn-danger cancel-announce"
        data-dismiss="modal"
        @click="emptyComboSelection"
      >
        {{ _t('Cancel') }}
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Cart from '@/mixins/Cart'
export default {
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState('combo', []),
  },
  mixins: [Cart],
  data() {
    return {}
  },
  methods: {},
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
