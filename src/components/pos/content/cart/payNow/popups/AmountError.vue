<template>
  <!-- Amount change -->
  <div
    class="modal fade"
    id="amount-error"
    role="dialog"
    v-show="error && errorAmount"
  >
    <div class="modal-dialog modal-dialog-centered">
      <!-- Modal content-->
      <div class="modal-content color-dashboard-background">
        <div class="modal-header customer-header color-secondary">
          <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
          <h4 class="customer-title color-text-invert text-danger">
            {{ _t('Payment Error') }}
          </h4>
        </div>
        <div class="modal-body change-option-amount text-danger">
          <div class="amount-change-wrap">
            <p class="error-text">
              {{ error }}
            </p>
            <h1 class="error-amount text-danger" v-show="errorAmount">
              {{ formatPrice(errorAmount) }}
            </h1>
          </div>
        </div>
        <div class="modal-footer">
          <div class="btn-announce">
            <button
              class="btn btn-success btn-large color-main"
              type="button"
              data-dismiss="modal"
              id="dining-opt"
            >
              {{ _t('Ok') }}
            </button>
          </div>
          <!-- <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'AmountChange',
  computed: {
    ...mapState('location', ['currency']),
    ...mapGetters('location', ['formatPrice', '_t']),
    ...mapState('checkout', ['changedAmount']),
    ...mapState('checkoutForm', ['msg', 'error', 'errorAmount']),
  },
}
</script>
<style lang="sass" scoped>
.change-option-amount
  min-height: 0 !important
  margin-bottom: 0px !important
  display: block !important
.error-text
  padding-bottom: 16px
  font-size: 16px
.amount-change-wrap
  padding-top: 0
h1
  &.error-amount
    font-size: 4.5rem
</style>
