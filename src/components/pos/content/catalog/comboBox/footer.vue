<template>
  <div class="modal-footer">
    <div class="btn-announce">
      <p class="combobox_error_msg">You can select max three Items.</p>
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

<style>
.combobox_error_msg {
  color: #cc3232;
  font-size: 18px;
  max-width: 600px;
}
</style>
