<template>
  <!-- payment screen email -->
  <div class="modal fade" id="add-email" role="dialog">
    <div class="modal-dialog modal-dialog-centered">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header customer-header">
          <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
          <h4 class="customer-title">{{ _t('Add Email') }}</h4>
        </div>
        <div class="modal-body add-email-wrap">
          <div class="add-note-area">
            <p>{{ _t('Enter Email') }}</p>
            <form>
              <input type="text" class="add-email-from" />
            </form>
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
<style lang="scss">
#add-email {
  .modal-dialog {
    .modal-content {
      .modal-header {
        border: none;
        background-color: #fff;
        padding: 20px;
        padding-bottom: 0;
      }

      .modal-body {
        padding: 20px;
      }
      POSItemOptions_choose_label .modal-footer {
      }
    }
  }
}
</style>
