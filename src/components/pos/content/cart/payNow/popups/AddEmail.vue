<template>
  <!-- payment screen email -->
  <div class="modal fade" id="add-email" role="dialog">
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header customer-header">
          <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
          <h4 class="customer-title">{{ _t('Add Email') }}</h4>
        </div>
        <div class="modal-body add-email-wrap">
          <div class="add-note-area">
            <p>{{ _t('Enter Email') }}</p>
            <input type="text" class="add-email-from" />
          </div>
        </div>
        <div class="modal-footer">
          <div class="btn-announce">
            <button
              type="button"
              class="btn btn-danger cancel-announce"
              data-dismiss="modal"
            >
              {{ _t('Cancel') }}
            </button>
            <button
              class="btn btn-success btn-large"
              type="button"
              id="add-email-btn"
            >
              {{ _t('Add') }}
            </button>
          </div>
          <!-- <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> -->
        </div>
      </div>
    </div>
  </div>
  <!-- End payment screen Email -->
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'AddEmail',
  computed: {
    ...mapGetters('location', ['_t']),
  },
}
</script>
