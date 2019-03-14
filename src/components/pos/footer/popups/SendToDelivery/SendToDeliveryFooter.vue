<template>
  <div class="modal-footer">
    <div class="referal">
      <p v-if="errors !== ''" class="text-danger">{{ errors }}</p>

      <button
        type="button"
        data-value=""
        id="referal-btn"
        class="btn referal-btn dropdown-toggle"
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
          :referralType="referral.referral_type"
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
      futureDateTime: null,
      minDatetime: null,
      maxDatetime: null,
      errors: '',
      timeZone: this.$store.state.location.setTimeZone,
    }
  },
  computed: {
    ...mapState({
      getReferrals: state =>
        typeof state.location.locationData.referrals != 'undefined' &&
        state.location.locationData.referrals.length > 0
          ? state.location.locationData.referrals
          : false,
    }),

  },
  methods: {
    selectedReferral(referral) {
      this.changedReferral = referral
    },
    placeOrder() {
      if (this.changedReferral.referralName === 'Referral') {
        this.errors = 'Please select referral to proceed.'
      } else {
        this.errors = ''
        this.deliveryOrder({
          referral: this.changedReferral,
          futureOrder: moment(this.futureDateTime).format('YYYY/MM/DD hh:mm'),
        })
      }
    },
    ...mapActions('order', ['deliveryOrder']),
  },
}
</script>

<style lang="scss" scoped>
.dropdown-menu.show {
  max-height: 275px;
  overflow-y: auto;
  overflow-x: hidden;
}

/*theming*/
.theme-orange .vdatetime-popup__header,
.theme-orange .vdatetime-calendar__month__day--selected > span > span,
.theme-orange .vdatetime-calendar__month__day--selected:hover > span > span {
  background: #ff9800;
}

.theme-orange .vdatetime-year-picker__item--selected,
.theme-orange .vdatetime-time-picker__item--selected,
.theme-orange .vdatetime-popup__actions__button {
  color: #ff9800;
}
</style>
