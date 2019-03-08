<template>
  <div class="modal-footer">
    <div class="referal">
      <button
        type="button"
        data-value=""
        id="referal-btn"
        class="btn referal-btn dropdown-toggle"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        {{ selectedReferral() }}
      </button
      ><!--<span><img src="images/referal-down.png"></span>-->
      <div class="dropdown-menu" v-if="getReferrals" v-model="changedReferral">
        <a
          class="dropdown-item"
          data-value="Call Center"
          href="#"
          v-for="referral in getReferrals"
          :referralType="referral.referral_type"
          :key="referral._id"
          >{{ referral.name }}
        </a>
      </div>
      <div class="dropdown-menu" v-if="!getReferrals">
        Nothing found
      </div>
      <button
        data-range="true"
        data-multiple-dates-separator=" - "
        class="btn btn-success btn-large datepicker-here"
        type="button"
        id="schedule-btn"
        data-timepicker="true"
        data-language="en"
      >
        Schedule
        <span><img src="img/pos/schedule-icon.png" alt="schedule"/></span>
      </button>
    </div>
    <div class="btn-announce">
      <button
        type="button"
        class="btn btn-danger cancel-announce"
        data-dismiss="modal"
      >
        <span>X</span> Close
      </button>
      <button
        class="btn btn-success btn-large"
        type="button"
        id="confirm_announcement"
      >
        Confirm
      </button>
    </div>
    <!-- <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> -->
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'SendToDeliveryFooter',
  props: {},
  data() {
    return {
      changedReferral: 'Referal'
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
    selectedReferral() {
      return this.changedReferral
    }
  }
}
</script>

<style lang="scss" scoped>
  .dropdown-menu.show {
    max-height: 275px;
    overflow-y: auto;
    overflow-x: hidden;
  }
</style>