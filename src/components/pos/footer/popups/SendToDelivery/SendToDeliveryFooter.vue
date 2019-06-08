<template>
  <div class="modal-footer showpropermsg">
    <div class="referal">
      <p v-if="errors !== ''" class="text-danger">{{ errors }}</p>
      <p v-if="msg" class="text-info">{{ msg }}</p>

      <button
        type="button"
        data-value=""
        id="referal-btn"
        class="btn referal-btn dropdown-toggle shorten-sentence"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        {{ changedReferral.referralName }}</button
      ><!--<span><img src="images/referal-down.png"></span>-->
      <div class="dropdown-menu" v-if="getReferrals">
        <a
          class="dropdown-item"
          data-value="Call Center"
          href="#"
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
      <div class="dropdown-menu" v-if="!getReferrals">
        Nothing found
      </div>
      <datetime
        type="datetime"
        title="Schedule"
        placeholder="Schedule"
        v-model="futureDateTime"
        input-class="btn schedule-input btn-large datepicker-here"
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
    </div>
    <div class="btn-announce">
      <button
        type="button"
        class="btn btn-danger cancel-announce"
        data-dismiss="modal"
      >
        Close
      </button>
      <button
        class="btn btn-success btn-large"
        type="button"
        id="confirm_announcement"
        @click="placeOrder"
      >
        Confirm
      </button>
    </div>

    <!-- <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> -->
  </div>
</template>

<script>
/* global $, hidePayNow */
import moment from 'moment-timezone'

import { Datetime } from 'vue-datetime'
import { mapState, mapActions } from 'vuex'
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
    ...mapState({
      getReferrals: state => state.location.referrals,
    }),
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
          .then(() => {
            this.msg = ''
            $('#order-confirmation').modal('hide')
            $('#payment-msg').modal('show')
            setTimeout(function() {
              $('#confirm_announcement').prop('disabled', false)
            }, 1000)
          })
          .catch(response => {
            this.errors = response.error
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
