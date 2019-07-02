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
          <h4 class="customer-title">{{ _t('Reward Available') }}</h4>
        </div>
        <div class="modal-body add-email-wrap">
          <div class="add-note-area">
            <p v-if="loyaltyBalance > 0">
              {{ _t('Loyalty Balance (Points)') }}:
              <span>{{ formatPrice(loyaltyBalance) }}</span>
            </p>
            <p v-if="loyalty.loyalty_order_alert != null">
              {{ loyalty.loyalty_order_alert }}
            </p>
            <div
              v-if="loyalty.loyalty_order_alert == null && loyaltyBalance > 0"
            >
              <hr />
              <p>
                {{ _t('You can spend min') }}
                <b
                  >{{ loyalty.minimum_redeem ? loyalty.minimum_redeem : 0 }}
                  {{ _t('Point(s)') }}</b
                >
                {{ _t('and max') }}
                <b
                  >{{ loyalty.maximum_redeem ? loyalty.maximum_redeem : 0 }}
                  {{ _t('Point(s)') }}</b
                >
              </p>
              <p>
                {{ _t('Points you can spend') }}:
                <b>{{ points }}</b>
              </p>
              <p>
                {{ _t('Amount respective to loyalty points') }}:
                <b>{{ amount }}</b>
              </p>
            </div>
            <div v-else>
              <p>{{ _t('No loyalty points available') }}</p>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <div class="btn-announce">
            <button
              type="button"
              class="btn btn-danger cancel-announce"
              data-dismiss="modal"
            >
              {{ _t('Close') }}
            </button>
            <button
              v-if="loyalty.loyalty_order_alert == null && !isLoyaltyUsed"
              class="btn btn-success btn-large popup-btn-save"
              type="button"
              id="gift-card-btn"
              data-toggle="modal"
              data-target="#Gift-card-payemnt-details"
              data-dismiss="modal"
              @click="payByLoyalty"
            >
              {{ _t('Add') }}
            </button>
          </div>
          <!-- <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex'
export default {
  name: 'Loyalty',
  computed: {
    ...mapGetters('location', ['formatPrice', '_t']),
    ...mapState({
      loyaltyBalance: state =>
        state.customer.loyalty.card.balance
          ? state.customer.loyalty.card.balance
          : 0,
      loyalty: state => state.customer.loyalty.details,
    }),
    ...mapState({
      amount: state =>
        state.checkoutForm.loyaltyAmount ? state.checkoutForm.loyaltyAmount : 0,
      points: state =>
        state.checkoutForm.loyaltyPoints ? state.checkoutForm.loyaltyPoints : 0,
      card: state => state.customer.loyalty.card,
      isLoyaltyUsed: state => {
        let loyaltyUsed = 0
        if (state.checkoutForm.payments) {
          state.checkoutForm.payments.forEach(element => {
            if (element.method.name == 'Loyalty Points') {
              loyaltyUsed = 1
            }
          })
        }
        return loyaltyUsed
      },
    }),
  },
  methods: {
    payByLoyalty() {
      this.$store.dispatch('checkoutForm/setAmount', this.amount)
      this.$store.dispatch('checkoutForm/setLoyaltyCard', this.card)
    },
    ...mapActions('checkoutForm', ['calculateSpendLoyalty']),
  },
  updated() {
    this.calculateSpendLoyalty
  },
}
</script>
