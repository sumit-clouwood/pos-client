<template>
  <div>
    <div class="modal-footer showpropermsg">
      <div class="referal">
        <button
          type="button"
          data-value=""
          id="referal-btn"
          class="btn referal-btn dropdown-toggle shorten-sentence color-text color-secondary"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          {{ changedReferral.referralName }}</button
        ><!--<span><img src="images/referal-down.png"></span>-->
        <p v-if="errors !== ''" class="errors text-danger">{{ errors }}</p>
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
        </div>
      </div>
      <datetime
        type="datetime"
        title="Schedule"
        placeholder="Schedule"
        v-model="futureDateTime"
        input-class="btn schedule-input btn-large datepicker-here color-dashboard-background"
        :value-zone="timeZone"
        :zone="timeZone"
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
        use12-hour
        auto
      ></datetime>
      <!-- <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> -->
    </div>
    <div class="btn-announce">
      <button
        type="button"
        class="btn btn-danger cancel-announce color-icon-table-neutral-button"
        data-dismiss="modal"
      >
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
  </div>
</template>

<script>
/* global $, showModal, hidePayNow */
import moment from 'moment-timezone'

import { Datetime } from 'vue-datetime'
import { mapState, mapActions, mapGetters } from 'vuex'
export default {
  name: 'SendToDeliveryFooter',
  props: {},
  components: {
    Datetime,
  },
  data() {
    return {
      changedReferral: { referralName: 'Referral' },
      futureDateTime: '',
      minDatetime: null,
      maxDatetime: null,
      errors: '',
      msg: '',
      timeZone: this.$store.state.location.setTimeZone,
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
    ...mapState({
      getReferrals: state => state.location.referrals,
    }),
    ...mapState('customer', ['address']),
    ...mapState('order', ['needSupervisorAccess']),
    ...mapGetters('order', ['subTotal']),
    ...mapGetters('location', ['_t', 'formatPrice']),
  },
  methods: {
    selectedReferral(referral) {
      this.changedReferral = referral
      this.$store.commit('order/SET_REFERRAL', this.changedReferral)
    },
    placeOrder() {
      hidePayNow()
      if (this.changedReferral.referralName === 'Referral') {
        this.errors = 'Please select referral to proceed.'
      } else if (
        typeof this.address.min_order_value !== 'undefined' &&
        this.address.min_order_value > this.subTotal
      ) {
        const minOrderValue = this.formatPrice(this.address.min_order_value)
        this.errors = `Minimum order values should be ${minOrderValue} for selected delivery address`
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
                ? moment(this.futureDateTime).format('YYYY/MM/DD hh:mm')
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

              $('#payment-msg').modal('hide')
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
        margin-left: 0px !important;
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
</style>
