<template>
  <div class="modal fade" id="popup-item-note" role="dialog">
    <div class="modal-dialog modal-dialog-centered modal-body-wrapper">
      <div class="modal-content color-dashboard-background">
        <div class="modal-header customer-header color-secondary">
          <h4 class="customer-title color-text-invert">
            {{ _t('+ Add') + ' ' + _t('Note') }}
          </h4>
        </div>
        <div class="modal-body add-note-wrap ">
          <div class="add-note-area ">
            <p class="color-text">{{ _t('+ Add') }} {{ _t('Note') }}</p>
            <textarea
              type="text"
              class="add-note-form"
              v-model="note"
            ></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <div class="btn-announce">
            <button
              @click="addNoteToItem()"
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* global $ */
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'itemNote',
  props: {},
  data() {
    return {
      note: '',
    }
  },
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState('checkout', ['print']),
    ...mapState('order', ['item']),
  },
  watch: {
    print(newVal, oldVal) {
      if (newVal === true && newVal !== oldVal) {
        this.note = ''
      }
    },
    item(item) {
      this.note = item.note
    },
  },
  methods: {
    addNoteToItem() {
      this.$store.dispatch('order/addNoteToItem', this.note)
      $('#popup-item-note').modal('toggle')
    },
    addNoteHendler() {
      this.$store.dispatch('addNoteHendlerChange')
    },
  },
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/mixins.scss';

@include responsive(mobile) {
  #popup-item-note {
    overflow: hidden !important;
  }
  #add-note {
    position: fixed !important;

    .modal-dialog {
      margin: 0px !important;
      .modal-content {
        width: 95% !important;
        overflow: hidden !important;

        .modal-header {
          padding: 20px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        .modal-body {
          padding: 20px;
          margin-top: 2rem !important;
          margin-left: 0 !important;
          position: fixed !important;

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
      }
    }
  }
}
</style>
