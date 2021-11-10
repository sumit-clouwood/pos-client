<template>
  <!-- response change -->
  <div
    class="modal fade blur-background information-popup"
    id="information-popup"
    role="dialog"
  >
    <div class="modal-dialog modal-dialog-centered">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header customer-header">
          <h4 class="customer-title">{{ title }}</h4>
          <!--<button type="button" class="close" data-dismiss="modal">-->
          <!--&times;-->
          <!--</button>-->
        </div>
        <div class="modal-body ">
          <div
            class="amount-change-wrap"
            v-if="responseInformation != ''"
            v-on:load="activeClass"
          >
            <h5
              :class="activatedClass"
              class="text-capitalize"
              v-if="responseInformation"
            >
              {{
                typeof responseInformation.message !== 'undefined'
                  ? responseInformation.message
                  : responseInformation.data
                  ? responseInformation.data.error
                  : responseInformation
              }}
            </h5>
          </div>
        </div>
        <div class="modal-footer">
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
          <!-- <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> -->
        </div>
      </div>
    </div>
  </div>

  <!-- End response change  -->
</template>

<script>
/* global $ */
import { mapGetters } from 'vuex'

export default {
  name: 'InformationPopup',
  props: {
    responseInformation: [String, Object],
    title: String,
    activatedClass: String,
  },
  computed: {
    ...mapGetters('location', ['_t']),
  },
  methods: {
    closeModal: function() {
      $('#information-popup').modal('toggle')
    },
    activeClass: function() {
      return typeof this.responseInformation != 'undefined'
        ? this.responseInformation.status === 1
          ? (this.activatedClass = 'text-success')
          : (this.activatedClass = 'text-danger')
        : false
    },
  },
}
</script>
<style lang="scss">
@import '@/assets/scss/pixels_rem.scss';
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';

@include responsive(mobile) {
  #information-popup {
    .modal-dialog {
      margin: 0;

      .modal-content {
        width: 95% !important;
        height: auto !important;
        margin: auto;
        margin-top: 50%;
        margin-bottom: 50%;
        .modal-header {
          height: 50px;
          background-color: #fff;
          font-size: 18px !important;
          .customer-title {
            font-size: 2rem !important;
          }
        }
        .modal-body {
          min-height: 0rem !important;
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
