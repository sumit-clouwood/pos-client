<template>
  <!-- Amount change -->
  <div class="modal fade" id="payment-msg" role="dialog">
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header customer-header">
          <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
          <h4 class="customer-title">
            Order
          </h4>
        </div>
        <div class="modal-body change-amount-option">
          <div class="amount-change-wrap">
            <h2>{{ msg }}</h2>
          </div>
        </div>
        <div class="modal-footer">
          <div class="btn-announce">
            <button
              class="btn btn-success btn-large"
              type="button"
              data-dismiss="modal"
              @click="generateInvoice()"
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
/* global $ */
import { mapState } from 'vuex'
export default {
  name: 'AmountChange',
  methods: {
    generateInvoice() {
      $('#pay-now').modal('toggle')
      this.$store.dispatch('checkout/generateInvoice')
    },
  },
  computed: {
    ...mapState('checkoutForm', ['msg']),
  },
}
</script>
