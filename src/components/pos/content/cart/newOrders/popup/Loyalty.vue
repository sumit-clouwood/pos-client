<template>
  <div
    class="modal fade"
    id="loyalty-payment"
    role="dialog"
    style="display: none; padding-left: 6px;"
  >
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header customer-header">
          <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
          <h4 class="customer-title">Reward Available</h4>
        </div>
        <div class="modal-body add-email-wrap">
          <div class="add-note-area">
            <p v-if="loyalty.balance > 0">
              Loyalty Balance: <span>{{ loyalty.balance }}</span>
            </p>
            <p v-if="loyalty.balance <= 0">{{ loyalty.loyalty_order_alert }}</p>
            <hr />
            <p>
              You can spend min
              <b>{{ loyalty.min_redeem_amount }} {{ loyalty.currency_code }}</b>
              and max
              <b>{{ loyalty.max_redeem_amount }} {{ loyalty.currency_code }}</b>
            </p>
            <p>
              Amount you can spend: <b>{{ amount }}</b>
            </p>
          </div>
        </div>
        <div class="modal-footer">
          <div class="btn-announce">
            <button
              type="button"
              class="btn btn-danger cancel-announce"
              data-dismiss="modal"
            >
              <span>-</span> Cancel
            </button>
            <button
              class="btn btn-success btn-large popup-btn-save"
              type="button"
              id="gift-card-btn"
              data-toggle="modal"
              data-target="#Gift-card-payemnt-details"
              data-dismiss="modal"
              @click="payByLoyalty"
            >
              Add
            </button>
          </div>
          <!-- <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'Loyalty',
  computed: {
    ...mapState({
      loyalty: state => (state.customer.loyalty ? state.customer.loyalty : 0),
    }),
    ...mapState({
      amount: state =>
        state.checkoutForm.loyaltyAmount ? state.checkoutForm.loyaltyAmount : 0,
    }),
  },
  methods: {
    payByLoyalty() {
      this.$store.dispatch('checkoutForm/setAmount', this.amount)
    },
    ...mapActions('checkoutForm',['calculateSpendLoyalty'])
  },
  updated() {
    this.calculateSpendLoyalty
  },
}
</script>
