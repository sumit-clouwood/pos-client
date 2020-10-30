<template>
  <div class="modal fade" id="loyalty-payment" role="dialog">
    <div class="modal-dialog modal-dialog-centered">
      <!-- Modal content-->
      <div class="modal-content color-dashboard-background">
        <!--<div class="modal-header customer-header color-secondary">
          &lt;!&ndash; <button type="button" class="close" data-dismiss="modal">&times;</button> &ndash;&gt;
          <h4 class="customer-title color-text-invert">
            {{ _t('Reward Available') }}
          </h4>
        </div>-->
        <div class="modal-body add-email-wrap">
          <div class="loyalty_star">
            <img src="img/loyalty_card.svg" />
          </div>
          <div class="add-note-area color-text-invert">
            <span v-if="loyaltyBalance > 0">
              {{ _t('Customer loyalty balance') }}:
              <b class="color-text">{{ formatPrice(loyaltyBalance) }}</b>
            </span>
            <span class="color-text-invert" v-if="brand.min_order">
              {{ _t('Minimum order amount should be') }}:
              <b class="color-text">{{ formatPrice(brand.min_order) }}</b>
            </span>
            <span class="color-text-invert">
              {{ _t('You can spend') }}
              <b class="color-text">{{
                brand.minimum_redeem ? brand.minimum_redeem : 0
              }}</b>
              {{ _t(' to ') }}
              <b class="color-text"
                >{{ brand.maximum_redeem ? brand.maximum_redeem : 0 }}
                {{ _t('Loyalty') }}</b
              >
            </span>
            <div v-if="loyaltyBalance > 0">
              <hr />
              <div class="item_box">
                <span
                  class="color-text-invert"
                  v-for="(item, key) in customerLoyaltyItem"
                  :key="key"
                >
                  {{ dt(item) }}:
                  <b class="color-text">{{ item.loyalty_ammount }}</b>
                </span>
              </div>
              <span
                class="color-text-invert delivery-loyalty"
                v-if="orderType === CONST.ORDER_TYPE_CALL_CENTER"
              >
                {{ _t('You can redeem maximum loyalty') }}
                <form>
                  <b class="color-text">
                    {{ _t('Amount') }}:
                    <input
                      type="text"
                      v-model="loyalty_change_amount"
                      class="loyalty_amt_pts"
                      id="loyalty_change_amount"
                      :placeholder="loyaltyAmount"
                      @keydown="getLoyaltyAmount($event)"
                    />
                    , {{ _t('Point(s)') }}:
                    {{ loyaltyPoints }}
                  </b>
                </form>
                <span v-if="error" class="text-danger">
                  {{ _t(error) }}: {{ loyaltyAmount }}
                </span>
              </span>
              <span class="color-text-invert" v-else>
                {{ _t('You can redeem maximum loyalty') }}:
                <b class="color-text">
                  {{ _t('Amount') }}: {{ loyaltyAmount }} |

                  {{ _t('Point(s)') }}: {{ loyaltyPoints }}
                </b>
              </span>
            </div>
            <div v-else>
              <span class="color-text-invert">
                {{ _t('No loyalty points available') }}
              </span>
            </div>
            <div
              v-if="parseFloat(brand.min_order) > loyaltyAmount"
              class="text-danger errors-loyalty"
            >
              <span v-if="customerLoyaltyItem.length && loyaltyAmount < 0.01">
                {{ _t("Items doesn't have loyalty program, ") }}</span
              >
              <span>{{ _t('Please add more items') }}</span>
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
              v-if="
                parseFloat(brand.min_order) < loyaltyAmount &&
                  !isLoyaltyUsed &&
                  orderType === CONST.ORDER_TYPE_CALL_CENTER
              "
              class="btn btn-success btn-large popup-btn-save color-text-invert color-main"
              type="button"
              id="delivery_area_loyalty"
              data-toggle="modal"
              data-target="#Gift-card-payemnt-details"
              @click="payByLoyalty"
            >
              {{ _t('Add') }}
            </button>
            <button
              v-if="
                parseFloat(brand.min_order) < loyaltyAmount &&
                  !isLoyaltyUsed &&
                  orderType !== CONST.ORDER_TYPE_CALL_CENTER
              "
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
import { mapActions, mapGetters, mapState } from 'vuex'
/* global $ */
import * as CONST from '@/constants'
export default {
  name: 'Loyalty',
  data() {
    return {
      total_loyalty_redeem: 0,
      error: false,
    }
  },
  computed: {
    ...mapGetters('location', ['formatPrice', '_t']),
    ...mapGetters('order', ['orderType']),
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
        this.payments.forEach(element => {
          if (element.method.name == 'Loyalty Points') {
            loyaltyUsed = 1
          }
        })
      }
      return loyaltyUsed
    },
    loyalty_change_amount: {
      get() {
        return this.loyaltyAmount
      },
      set(amount) {
        /*if (amount > 0.01) {
          this.$store.commit('checkoutForm/LOYALTY_AMOUNT', amount)
          this.$store.commit('checkoutForm/LOYALTY_POINTS', amount)
        }*/
        return amount
      },
    },
    /*loyalty_change_point: {
      get() {
        return this.loyaltyPoints
      },
      set(amount) {
        return amount
      },
    },*/
    ...mapState({
      card: state => state.customer.customerLoyalty.card,
    }),
  },
  methods: {
    getLoyaltyAmount($event) {
      const keyCode = $event.keyCode ? $event.keyCode : $event.which
      this.error = false
      if (
        keyCode == 8 ||
        keyCode == 46 ||
        keyCode == 110 ||
        keyCode == 190 ||
        (keyCode > 95 && keyCode < 106)
      ) {
        return true
      } else if (keyCode < 48 || keyCode > 57) {
        $event.preventDefault()
      }
    },
    cancelPayment() {
      this.$store.commit('checkoutForm/SET_PROCESSING', false)
    },
    payByLoyalty() {
      if (this.orderType === CONST.ORDER_TYPE_CALL_CENTER) {
        let loyalty_change_amount = parseFloat(
          $('#loyalty_change_amount').val()
        )
        if (loyalty_change_amount > this.loyaltyAmount) {
          this.error = "Loyalty amount can't be more then "
          return false
        }
        this.$store.commit('checkoutForm/LOYALTY_POINTS', loyalty_change_amount)
        this.$store.commit('checkoutForm/LOYALTY_AMOUNT', loyalty_change_amount)
        $('#loyalty-payment').modal('hide')
      } else {
        this.$store.commit('checkoutForm/LOYALTY_POINTS', this.loyaltyAmount)
        this.$store.dispatch('checkoutForm/setAmount', this.loyaltyAmount)
      }
      this.$store.dispatch('checkoutForm/setLoyaltyCard', this.card)
    },
    ...mapActions('checkoutForm', ['calculateSpendLoyalty']),
  },
  updated() {
    this.calculateSpendLoyalty
  },
}
</script>
<style lang="scss" scoped>
#loyalty-payment {
  .loyalty_star {
    text-align: center;
    img {
      width: 60px;
      border-radius: 100%;
      box-shadow: 0 4px 10px rgba(252, 124, 63, 0.85);
    }
    margin-bottom: 20px;
  }
  .add-note-area {
    span {
      display: block;
      text-align: center;
      line-height: 28px;
      font-size: 15px;
    }
  }
  b.color-text {
    font-size: 14px;
  }
  .delivery-loyalty {
    display: inline;
  }
  padding: 0 !important;
  .modal-dialog {
    min-width: 35.5%;
    .modal-content {
      .modal-header {
        min-height: 80px;
      }
      /*background-color: #f9fafc;*/
      .modal-body {
        .item_box {
          display: none;
          border: 1px solid #c5bbbb;
          padding: 10px;
          line-height: 1.7;
          max-height: 110px;
          overflow: scroll;
          margin: 15px 0;
        }
        .loyalty_amt_pts {
          height: 20px;
          border-bottom: 1px solid #d2d2d2;
          text-align: center;
          width: 60px;
          font-weight: bold;
          color: #464040;
        }
        .errors-loyalty {
          margin-top: 20px;
        }
      }

      .modal-footer {
        justify-content: center;
        .btn-announce {
          display: -ms-inline-flexbox;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: 0;
        }
      }
    }
  }
}
</style>
