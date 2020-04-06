<template>
  <!-- Add Note -->
  <div class="modal fade" id="add-note" role="dialog">
    <div class="modal-dialog modal-dialog-centered">
      <!-- Modal content-->
      <div class="modal-content color-dashboard-background">
        <div class="modal-header customer-header color-secondary">
          <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
          <h4 class="customer-title color-text-invert">
            {{ _t('+ Add') + ' ' + _t('Note') }}
          </h4>
        </div>
        <div class="modal-body add-note-wrap ">
          <div class="add-note-area ">
            <p class="color-text">
              {{ _t('+ Add') }} {{ _t('Order') }} {{ _t('Note') }}
            </p>
            <textarea
              type="text"
              class="add-note-form"
              v-model="orderNote"
            ></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <div class="btn-announce">
            <button
              @click="addNoteOrder(orderNote)"
              class="btn btn-success btn-large color-main "
              type="button"
              id="save-note"
            >
              {{ _t('Save') }}
            </button>
            <button
              type="button"
              class="btn btn-danger cancel-announce color-button"
              data-dismiss="modal"
            >
              {{ _t('Cancel') }}
            </button>
          </div>
          <!-- <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> -->
        </div>
      </div>
    </div>
  </div>

  <!-- Add note -->
  <!-- ====================================== -->
</template>

<script>
/* global $ */
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  name: 'AddNote',
  props: {},
  data() {
    return {
      orderNote: '',
    }
  },
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState('checkout', ['print']),
  },
  watch: {
    print(newVal, oldVal) {
      if (newVal === true && newVal !== oldVal) {
        this.orderNote = ''
      }
    },
  },
  methods: {
    addNoteOrder: function(orderNote) {
      this.addOrderNote(orderNote)
      $('#add-note').modal('toggle')
    },
    ...mapActions('order', ['addOrderNote']),
    addNoteHendler() {
      this.$store.dispatch('addNoteHendlerChange')
    },
  },
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/pixels_rem.scss';
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';

@include responsive(mobile) {
  #add-note {
    .modal-dialog {
      margin: 0px !important;
      .modal-content {
        .modal-header {
          padding: 20px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        .modal-body {
          padding: 20px;

          .add-note-area {
            p {
              margin-bottom: 20px;
              margin-top: 0;
            }
            textarea {
              outline: none;
              padding: 10px;
            }
          }
        }

        .modal-footer {
          .btn-announce {
            button,
            #save-note {
              height: 50px;
              width: 100% !important;
            }
          }
        }
      }
    }
  }
}
</style>
