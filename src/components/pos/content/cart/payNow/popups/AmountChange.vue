<template>
  <!-- Amount change -->
  <div class="modal fade" id="change-amount" role="dialog">
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header customer-header">
          <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
          <h4 class="customer-title">
            {{ validate ? 'Amount Change' : 'Error' }}
          </h4>
        </div>
        <div class="modal-body change-amount-option">
          <div v-show="validate" class="amount-change-wrap">
            <p>
              Change <span>({{ currency }})</span>
            </p>
            <h1>{{ formatPrice(changedAmount) }}</h1>
          </div>
          <div v-show="!validate" class="error">
            <p>{{ error }}</p>
          </div>
        </div>
        <div class="modal-footer">
          <div class="btn-announce">
            <button
              class="btn btn-success btn-large"
              type="button"
              data-dismiss="modal"
              @click="validate ? generateInvoice() : false"
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
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'AmountChange',
  computed: {
    ...mapState('location', ['currency']),
    ...mapGetters('location', ['formatPrice']),
    ...mapState('checkout', ['changedAmount']),
    ...mapState('checkoutForm', ['error']),
    ...mapGetters('checkoutForm', ['validate']),
  },
  methods: {
    generateInvoice() {
      $('#pay-now').modal('toggle')
      this.$store.dispatch('checkout/generateInvoice')
    },
  },
}
</script>
