<template>
  <div
    class="modal fade blur-background information-popup"
    id="alert-popup"
    role="dialog"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header customer-header">
          <h4 class="customer-title">{{ _t(alert.title || 'Alert') }}</h4>
        </div>
        <div class="modal-body" :class="alertClass">
          <div class="amount-change-wrap">
            <div class="alert" role="alert">
              <h5 class="text-capitalize">{{ _t(alert.msg) }}</h5>
            </div>
          </div>
        </div>
        <div class="modal-footer" :class="alertClass">
          <div class="btn-announce">
            <button
              class="btn btn-success btn-large"
              type="button"
              id="dining-opt"
              data-dismiss="modal"
              @click="closeModal()"
            >
              {{ _t('Ok') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* global hideModal */
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'AlertPopup',
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState('order', ['alert']),
    alertClass() {
      let sub = ''
      // switch (this.alert.type) {
      //   case 'error':
      //     sub = 'alert-danger'
      //     break
      //   case 'done':
      //     sub = 'alert-success'
      //     break
      //   case 'fade':
      //     sub = 'alert-secondary'
      //     break
      //   case 'alert':
      //     sub = 'alert-warning'
      //     break
      //   default:
      //     //case 'info'
      //     'alert-primary'
      // }
      return sub
    },
  },
  methods: {
    closeModal() {
      hideModal('#alert-popup')
    },
  },
}
</script>
<style lang="scss">
@import '@/assets/scss/pixels_rem.scss';
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';

@include responsive(mobile) {
  #alert-popup {
    .modal-dialog {
      margin: 0;

      .modal-content {
        width: 95% !important;
        max-height: 50% !important;
        margin: auto;
        margin-top: 50%;
        margin-bottom: 50%;
        .modal-header {
          height: 80px;
          background-color: #fff;
        }
        .modal-body {
          min-height: 0rem !important;
          padding: 1.275rem;
          .amount-change-wrap {
            padding-top: 1.1875rem;
          }
        }
        .modal-footer {
          .btn-announce {
            margin-bottom: 0px;
          }
        }
      }
    }
  }
}
</style>
