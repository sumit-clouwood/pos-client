<!-- eslint-disable -->
<template>
  <div>
    <div class="modal-footer showpropermsg">
      <div
        class="footer-slider-list-item color-secondary"
        :class="[{ loyalty_delivery: loyaltyCard, active: loyalty_active }]"
        @click="calculateLoyaltyAmount"
        v-if="loyaltyCard && parseFloat(loyaltyCard.balance) > 0"
      >
        <div role="button" class="footer-slider-list-item-link color-text-invert" v-if="loyalty_active">
          {{ _t('Applied Loyalty') }}
          <br />
          {{ formatPrice(loyaltyAmount) }}
        </div>
        <div v-else role="button" class="footer-slider-list-item-link color-text-invert">
          {{ _t('Apply loyalty') }}
          <i
            class="fa fa-question-circle"
            aria-hidden="true"
            :title="_t('Click here to apply loyalty, your loyalty balance is ') + formatPrice(loyaltyCard.balance)"
          ></i>
          <br />
          <span class="font-weight-bold" v-if="loyaltyAmount > 0">
            {{ _t('Balance') }} : {{ formatPrice(loyaltyCard.balance) }}
          </span>
          <span class="font-weight-bold" v-else>
           0 {{ _t('Points used') }}
          </span>
        </div>
      </div>
      <div class="referal">
        <button
          type="button"
          data-value=""
          id="referal-btn"
          class="btn referal-btn dropdown-toggle shorten-sentence color-text color-secondary"
          data-toggle="modal"
          data-target="#select-referral"
        >
          {{ changedReferral ? changedReferral.referralName : _t('Referral') }}
        </button>
        <!--<span><img src="images/referal-down.png"></span>-->
        <!--
        <p v-if="msg" class="text-info">{{ msg }}</p>
        <div id="referralDropdown" class="dropdown-menu" v-if="getReferrals">
          <a
            class="dropdown-item color-text cursor-pointer"
            :class="{ active: referral._id === orderReferralId }"
            data-value="Call Center"
            role="button"
            v-for="referral in getReferrals"
            @click="
              selectedReferral({
                referralName: referral.name,
                referralId: referral._id,
              })
            "
            :referralType="referral.name"
            :key="referral._id"
            >{{ referral.name }}
          </a>
        </div>
        <div class="dropdown-menu color-text-invert" v-if="!getReferrals">
          {{ _t('Nothing found') }}
        </div>-->
      </div>
      <div v-if="enabled(CONST.MODULE_FUTURE_ORDERS)">
        <datetime
        type="datetime"
        title="Schedule order"
        placeholder="Schedule"
        v-model="futureDateTime"
        input-class="btn schedule-input btn-large datepicker-here color-dashboard-background"
        :value-zone="timezoneString"
        :zone="timezoneString"
        :format="{
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
        }"
        :phrases="{ ok: 'Continue', cancel: 'Exit' }"
        :hour-step="1"
        :minute-step="10"
        :min-datetime="minDatetime"
        :max-datetime="maxDatetime"
        :week-start="7"
        :hide-backdrop="false"
        use12-hour
        auto
      ></datetime>
      </div>
      <!-- <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> -->

    </div>
    <div class="delivery_order_process_errors">
      <p v-if="errors !== ''" class="errors text-danger">{{ errors }}</p>
    </div>
    <div class="btn-announce" v-if="enabled(CONST.MODULE_DELIVERY)">
        <button
          type="button"
          data-dismiss="modal"
          class="btn btn-danger cancel-announce color-text-invert color-button">
        {{ _t('Close') }}
      </button>
      <button
        class="btn btn-success btn-large color-button"
        type="button"
        id="confirm_announcement"
        @click="placeOrder"
      >
        {{ _t('Confirm') }}
      </button>
    </div>
    <div class="btn-disabled-confirmation" v-else>
     <div class="text-danger">
      <span>
        {{ _t(`Delivery manager is disabled so you can't place CRM orders.`) }}
      </span> 
      <span> {{ _t('Please contact to brand admin.') }} </span>
     </div>
      <button
          type="button"
          data-dismiss="modal"
          class="btn btn-success btn-large cancel-announce color-text-invert color-button">
        {{ _t('OK') }}
      </button>
    </div>
  </div>
</template>

<script>
/* global $, showModal, hidePayNow */
import moment from 'moment-timezone'

import { Datetime } from 'vue-datetime'
import { mapState, mapActions, mapGetters } from 'vuex'
import * as CONST from '@/constants'
export default {
  name: 'SendToDeliveryFooter',
  props: {},
  components: {
    Datetime,
  },
  data() {
    return {
      // changedReferral: { referralName: 'Referral' },
      futureDateTime: '',
      minDatetime: new Date().toISOString(),
      maxDatetime: null,
      errors: '',
      msg: '',
    }
  },
  computed: {
    orderReferralId() {
      const order = this.$store.state.order.selectedOrder
      if (order) {
        return order.item.referral
      }
      return false
    },
    loyalty_active() {
      return parseFloat(this.loyaltyAmount) > 0.01 ? true : false
    },
    ...mapState({
      getReferrals: state => state.location.referrals,
    }),
    ...mapState('customer', ['address']),
    ...mapState('checkoutForm', ['loyaltyAmount', 'loyaltyPoints']),
    ...mapState({
      loyaltyCard: state => state.customer.customerLoyalty.card,
      changedReferral: state => state.order.referral,
      loyaltyAmount: state => state.checkoutForm.loyaltyAmount,
      selectedCustomer: state => state.customer.customer.name,
    }),
    ...mapState('order', ['needSupervisorAccess']),
    ...mapState('sync', ['online']),
    ...mapGetters('order', ['subTotal', 'totalTaxWithoutSurchargeTax']),
    ...mapGetters('location', ['_t', 'formatPrice']),
    ...mapGetters('payment', ['methods']),
    ...mapState('location', ['brand', 'timezoneString']),
    ...mapGetters('modules', ['enabled']),
  },
  methods: {
    calculateLoyaltyAmount() {
      if (!this.online) {
        this.$store.commit('order/setAlert', {
          type: 'error',
          title: this._t('Check your network connection'),
          msg: this._t('Loyalty will not work on offline mode'),
        })
        $('#alert-popup').modal('show')
        this.$store.commit('checkoutForm/forceCash', true)
        return false
      }
      this.$store.dispatch('checkoutForm/calculateLoyaltyAmountForItem')
      // this.loyalty_active = true
      if (
        this.methods &&
        this.methods.loyalty &&
        parseFloat(this.loyaltyAmount) > 0.01
      ) {
        let loyalty_card = this.methods.loyalty.find(
          payment => payment.type === CONST.LOYALTY
        )
        this.$store.commit('checkoutForm/setPaymentMethodLoyalty', loyalty_card)
        this.$store.dispatch('checkoutForm/addAmount')
      }
      // this.$store.dispatch('loyaltyHendlerChange')
    },
    /*selectedReferral(referral) {
      this.changedReferral = referral
      this.$store.commit('order/SET_REFERRAL', this.changedReferral)
    },*/
    placeOrder() {
      hidePayNow()
      if (!this.changedReferral) {
        this.errors = 'Please select referral to proceed.'
      } else if (
        typeof this.address.min_order_value !== 'undefined' &&
        this.address.min_order_value > this.subTotal
      ) {
        const minOrderValue = this.formatPrice(this.address.min_order_value)
        this.errors = `Minimum order values should be ${minOrderValue} for selected delivery address`
      } else if (
        this.loyalty_active &&
        this.brand.min_order >
          this.subTotal + parseFloat(this.totalTaxWithoutSurchargeTax)
      ) {
        const minOrderValue = this.formatPrice(this.brand.min_order)
        this.errors = `Minimum order values should be ${minOrderValue} for applying loyalty`
      } else {
        if (this.needSupervisorAccess) {
          this.$store.commit('order/SET_REFERRAL', this.changedReferral)
          showModal('#modificationReason')
        } else {
          $('#confirm_announcement').prop('disabled', true)
          this.msg = 'Sending order for delivery...'
          this.errors = ''
          $('#payment-msg').modal('show')
          this.deliveryOrder({
            referral: this.changedReferral,
            futureOrder:
              this.futureDateTime != ''
                ? moment.utc(this.futureDateTime).format('YYYY/MM/DD HH:mm')
                : null,
          })
            .then(response => {
              if (response.message != 'Network Error') {
                this.msg = ''
              }
              // $('#order-confirmation').modal('hide')
              $('#order-confirmation').modal('hide')
              setTimeout(function() {
                $('#confirm_announcement').prop('disabled', false)
              }, 1000)

              /*this.$store.commit('order/ORDER_TYPE', {
                OTview: 'Walk In',
                OTApi: 'walk_in',
              })*/
            })
            .catch(response => {
              this.msg = ''
              let errors = 'Error: '

              if (response.status == 'form_errors') {
                for (let i in response.form_errors) {
                  response.form_errors[i].forEach(err => (errors += ' ' + err))
                }
              } else {
                errors = response.error
              }
              this.errors = errors
              /* Added this handle because error msg not showing when click on confirmation popup, */
              // if (typeof response == 'string') {
              //   $('#payment-msg').modal('show')
              // } else {
              $('#payment-msg').modal('hide')
              // }
              $('#order-confirmation').modal('show')
              setTimeout(function() {
                $('#confirm_announcement').prop('disabled', false)
              }, 1000)
            })
        }
      }
    },
    ...mapActions('order', ['deliveryOrder']),
  },
}
</script>
<style lang="scss">
@import '@/assets/scss/pixels_rem.scss';
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';
#referralDropdown {
  max-height: 15vh;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    background-color: rgb(233, 233, 233);
    width: 0.625rem;
    height: 0.625rem;
  }
}
.btn-disabled-confirmation {
  text-align: center;
  white-space: pre-wrap;
  margin-bottom: 10px;
}
.showpropermsg .text-danger {
  display: initial;
  padding: 6px;

  &.errors {
    display: block;
  }
}
#order-confirmation {
  .btn-announce {
    text-align: right;
    margin-right: 10px;
    margin-bottom: 10px;
  }
}

@include responsive(mobile) {
  #order-confirmation {
    .modal-footer {
      width: auto !important;
      .referal {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 10px;
      }
      .vdatetime > input {
        width: 95% !important;
        margin-left: 0 !important;
      }
      .showpropermsg .text-danger {
        position: absolute;
        left: 23%;
        top: 13%;
      }
    }
    .btn-announce {
      display: grid;
      grid-template-columns: 1fr 1fr;
      width: auto;
      grid-gap: 10px;
      .btn-danger {
        width: auto !important;
        margin-left: 0.625rem !important;
      }
    }
  }
}
.referal.show .dropdown-menu {
  max-height: 200px;
  overflow: auto;
}

.referal.show .dropdown-menu a {
  padding: 8px;
  border-bottom: 1px solid #ddd;
  margin: 0;
  font-weight: bold;
}
.loyalty_delivery {
  span {
    font-size: 12px;
    text-align: center;
  }
  color: white;
  width: 160px;
  height: 3.125rem;
  font-weight: bold;
  text-align: center;
  cursor: pointer;
  border-radius: 3px;
  background-color: #4e535d;
  padding: 1px 12px;
  &.active {
    background-color: #ef6a05;
  }
}
.cancel-announce {
  font-size: unset !important;
  width: auto !important;
}
.vdatetime > input {
  margin-left: unset !important;
}
.delivery_order_process_errors {
  .errors {
    text-align: center;
    font-size: 15px;
  }
}
</style>
