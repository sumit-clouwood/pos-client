<template>
  <!-- Amount change -->
  <div class="modal fade" id="change-amount" role="dialog">
    <div class="modal-dialog modal-dialog-centered">
      <!-- Modal content-->
      <div class="modal-content color-dashboard-background">
        <div class="modal-header customer-header color-secondary">
          <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
          <h4 class="customer-title color-text-invert">Amount Change</h4>
        </div>
        <div class="modal-body change-amount-option">
          <div class="amount-change-wrap">
            <p class="color-text">
              Change
              <span>({{ currency }})</span>
            </p>
            <h1>{{ formatPrice(changedAmount) }}</h1>
          </div>
        </div>
        <div class="modal-footer">
          <div class="btn-announce">
            <button
              class="btn btn-success btn-large color-main"
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
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'AmountChange',
  computed: {
    ...mapState('location', ['currency']),
    ...mapGetters('location', ['formatPrice']),
    ...mapState('checkout', ['changedAmount', 'orderCreationSource']),
    ...mapState('checkoutForm', ['msg']),
  },
  methods: {
    generateInvoice() {
      if (this.orderCreationSource === 'splitOrder') {
        this.$store.commit('checkout/ORDER_CREATION_SOURCE', false)
        return false
      }

      if (this.msg.result !== 'error') {
        this.$store.dispatch('checkout/generateInvoice')
        $('#pay-now').modal('hide')
        this.$store.commit('checkout/CHANGE_AMOUNT_STATUS', true)
      }
    },
  },
}
</script>
