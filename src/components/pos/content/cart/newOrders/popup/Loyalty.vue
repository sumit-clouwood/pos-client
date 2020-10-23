<template>
  <div class="modal fade" id="loyalty-payment" role="dialog">
    <div class="modal-dialog modal-dialog-centered">
      <!-- Modal content-->
      <div class="modal-content color-dashboard-background">
        <div class="modal-header customer-header color-secondary">
          <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
          <h4 class="customer-title color-text-invert">
            {{ _t('Reward Available') }}
          </h4>
        </div>
        <div class="modal-body add-email-wrap">
          <div class="add-note-area color-text-invert">
            <p v-if="loyaltyBalance > 0">
              {{ _t('Customer Loyalty Balance') }}:
              <b class="color-text">{{ formatPrice(loyaltyBalance) }}</b>
            </p>
            <p class="color-text-invert" v-if="brand.min_order">
              {{ _t('Minimum order amount should be') }}:
              <b class="color-text">{{ formatPrice(brand.min_order) }}</b>
            </p>
            <div v-if="brand.min_order >= 1 && loyaltyBalance > 0">
              <hr />
              <p class="color-text-invert">
                {{ _t('You can spend min') }}
                <b class="color-text"
                  >{{ brand.minimum_redeem ? brand.minimum_redeem : 0 }}
                  {{ _t('Loyalty') }}</b
                >
                {{ _t('and max') }}
                <b class="color-text"
                  >{{ brand.maximum_redeem ? brand.maximum_redeem : 0 }}
                  {{ _t('Loyalty') }}</b
                >
              </p>
              <div class="item_box">
                <p
                  class="color-text-invert"
                  v-for="(item, key) in customerLoyaltyItem"
                  :key="key"
                >
                  {{ dt(item) }}:
                  <b class="color-text">{{ item.loyalty_ammount }}</b>
                </p>
              </div>
              <p class="color-text-invert">
                {{ _t('You can redeem maximum loyalty') }}:
                <b class="color-text">
                  {{ _t('Amount') }}: {{ loyaltyAmount }},

                  {{ _t('Point(s)') }}: {{ loyaltyPoints }}
                </b>
              </p>
            </div>
            <div v-else>
              <p class="color-text-invert">
                {{ _t('No loyalty points available') }}
              </p>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <div class="btn-announce">
            <button
              type="button"
              class="btn btn-danger cancel-announce color-text-invert color-button"
              data-dismiss="modal"
              @click="cancelPayment"
            >
              {{ _t('Close') }}
            </button>
            <button
              v-if="brand.min_order >= 1 && !isLoyaltyUsed"
              class="btn btn-success btn-large popup-btn-save color-text-invert color-main"
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
  data() {
    return {
      total_loyalty_redeem: 0,
    }
  },
  computed: {
    ...mapGetters('location', ['formatPrice', '_t']),
    ...mapState('location', ['brand']),
    ...mapState('checkoutForm', [
      'payments',
      'loyaltyAmount',
      'loyaltyPoints',
      'customerLoyaltyItem',
    ]),
    ...mapGetters('order', ['items']),
    ...mapState({
      loyaltyBalance: state =>
        state.customer.customerLoyalty.card
          ? state.customer.customerLoyalty.card.balance
          : 0,
      loyalty: state => state.customer.customerLoyalty.details,
    }),
    isLoyaltyUsed() {
      let loyaltyUsed = 0
      if (this.payments) {
        // eslint-disable-next-line no-debugger,no-console
        console.log(this.payments)
        this.payments.forEach(element => {
          if (element.method.name == 'Loyalty Points') {
            loyaltyUsed = 1
          }
        })
      }
      return loyaltyUsed
    },
    ...mapState({
      card: state => state.customer.customerLoyalty.card,
    }),
  },
  methods: {
    cancelPayment() {
      this.$store.commit('checkoutForm/SET_PROCESSING', false)
    },
    payByLoyalty() {
      this.$store.dispatch('checkoutForm/setAmount', this.loyaltyAmount)
      this.$store.dispatch('checkoutForm/setLoyaltyCard', this.card)
    },
    ...mapActions('checkoutForm', ['calculateSpendLoyalty']),
  },
  updated() {
    this.calculateSpendLoyalty
  },
}
</script>
<style lang="scss">
#loyalty-payment {
  padding: 0 !important;
  .modal-dialog {
    .modal-content {
      .modal-header {
        min-height: 80px;
        background-color: #fff;
      }

      .modal-body {
        .item_box {
          border: 1px solid #c5bbbb;
          padding: 10px;
          line-height: 1.7;
          max-height: 110px;
          overflow: scroll;
          margin: 15px 0;
        }
      }

      .modal-footer {
      }
    }
  }
}
</style>
