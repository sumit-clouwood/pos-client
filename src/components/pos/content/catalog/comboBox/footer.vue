<template>
  <div class="modal-footer">
    <div class="btn-announce">
      <button
        type="button"
        class="btn btn-success btn-default "
        data-dismiss="modal"
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
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters('location', ['_t']),
  },
}
</script>

<style></style>
