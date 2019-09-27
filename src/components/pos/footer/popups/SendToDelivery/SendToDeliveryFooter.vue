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
        <p v-if="errors !== ''" class="text-danger">{{ errors }}</p>
        <p v-if="msg" class="text-info">{{ msg }}</p>
        <div class="dropdown-menu" v-if="getReferrals">
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
          Nothing found
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
/* global $, hidePayNow */
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
    ...mapGetters('location', ['_t']),
  },
  methods: {
    selectedReferral(referral) {
      this.changedReferral = referral
    },
    placeOrder() {
      hidePayNow()
      if (this.changedReferral.referralName === 'Referral') {
        this.errors = 'Please select referral to proceed.'
      } else {
        $('#confirm_announcement').prop('disabled', true)
        this.msg = 'Sending order for delivery...'
        this.errors = ''
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
            $('#payment-msg').modal('show')
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
    },
    ...mapActions('order', ['deliveryOrder']),
  },
}
</script>
<style lang="scss">
.showpropermsg .text-danger {
  display: initial;
  padding: 6px;
}

#order-confirmation {
  .btn-announce {
    text-align: right;
    margin-right: 10px;
    margin-bottom: 10px;
  }
}

@import '../../../../../assets/scss/pixels_rem.scss';
@import '../../../../../assets/scss/variables.scss';
@import '../../../../../assets/scss/mixins.scss';

@include responsive(mobile) {
  #order-confirmation {
    .vdatetime > input {
      width: 100%;
    }
    .referal {
      position: relative;
    }
    .showpropermsg .text-danger {
      position: absolute;
      left: 23%;
      top: 13%;
    }
  }
}
</style>
