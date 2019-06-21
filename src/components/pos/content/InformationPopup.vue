<template>
  <!-- response change -->
  <div class="modal fade blur-background" id="information-popup" role="dialog">
    <div class="modal-dialog">
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
            <h5 :class="activatedClass" class="text-capitalize">
              {{ responseInformation }}
            </h5>
          </div>
        </div>
        <div class="modal-footer">
          <div class="btn-announce">
            <button
              class="btn btn-success btn-large"
              type="button"
              id="dining-opt"
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
    responseInformation: String,
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
