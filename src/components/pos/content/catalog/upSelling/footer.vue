<template>
  <div class="modal-footer">
    <div class="btn-announce">
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
import { mapGetters } from 'vuex'

export default {
  name: 'UpSellingFooter',
  computed: {
    ...mapGetters('location', ['_t']),
  },
}
</script>
<style scoped>
.btn-announce {
  margin-bottom: 0 !important;
}
@media only screen and (max-width: 600px) and (min-width: 320px) {
  .btn-announce {
    margin: 0 auto;
    margin-bottom: 0 !important;
  }
}
</style>
