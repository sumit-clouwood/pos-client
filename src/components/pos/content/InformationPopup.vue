<template>
  <!-- Amount change -->
  <div class="modal fade" id="information-popup" role="dialog">
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header customer-header">
          <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
          <h4 class="customer-title">{{ title }}</h4>
        </div>
        <div class="modal-body change-amount-option">
          <div class="amount-change-wrap" v-if="responseInformation">
            <p :class="activeClass">
              {{ responseInformation.message }}
            </p>
          </div>
        </div>
        <div class="modal-footer">
          <div class="btn-announce">
            <button
              class="btn btn-success btn-large"
              type="button"
              data-dismiss="modal"
              id="dining-opt"
            >
              Ok
            </button>
          </div>
          <!-- <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> -->
        </div>
      </div>
    </div>
  </div>

  <!-- End Amount change  -->
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'InformationPopup',
  props: {
    responseInformation: Object,
    title: String,
  },
  computed: {
    /* ...mapState({
      responseInformation: state => state.customer.responseInformation,
    }),*/
    activeClass: this.responseInformation.length
      ? this.responseInformation.status == 1
        ? 'text-success'
        : 'text-danger'
      : false,
  },
}
</script>
