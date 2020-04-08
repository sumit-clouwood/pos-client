<template>
  <!-- customer note popup -->

  <div class="modal fade" id="admin-popup" role="dialog">
    <div class="modal-dialog modal-dialog-centered">
      <!-- Modal content-->
      <div class="modal-content color-dashboard-background">
        <div class="modal-header color-secondary">
          <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
          <h4 class="customer-title color-text-invert">
            {{ _t('Customer Note') }}
          </h4>
        </div>
        <div class="modal-body add-note-wrap">
          <div class="add-note-area">
            <p class="color-text-invert">{{ _t('Customer Note') }}</p>
            <textarea type="text" class="add-note-form" v-model="note">
            </textarea>
          </div>
        </div>
        <div class="modal-footer">
          <div class="btn-announce">
            <button
              type="button"
              class="btn btn-danger cancel-announce color-button color-text-invert"
              data-dismiss="modal"
            >
              {{ _t('Cancel') }}
            </button>
            <button
              class="btn btn-success btn-large popup-btn-save color-main color-text-invert"
              type="button"
              data-dismiss="modal"
              id=""
              @click="addNote(note)"
            >
              {{ _t('+ Add') }}
            </button>
          </div>
          <!-- <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> -->
        </div>
      </div>
    </div>
  </div>

  <!-- customer note popup -->
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'CustomerNote',
  // props: ['note'],
  data() {
    return {
      note: '',
    }
  },
  computed: {
    ...mapGetters('location', ['_t']),
  },
  methods: {
    ...mapActions('customer', ['addNote']),
  },
}
</script>
<style lang="scss">
@import '@/assets/scss/pixels_rem.scss';
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';

@include responsive(mobile) {
  #admin-popup {
    .modal-dialog {
      margin: 0;

      .modal-content {
        .modal-header {
          height: 80px;
          background-color: #fff;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          border: none;
        }

        .modal-body {
          .add-note-area {
            textarea {
              padding: 10px;
            }
          }
        }

        .modal-footer {
        }
      }
    }
  }
}
</style>
