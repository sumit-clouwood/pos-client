<template>
  <div class="modal fade" id="NewReservation">
    <div class="modal-dialog modal-dialog-centered" style="max-width: 80%">
      <div class="modal-content">
        <!-- Modal Header -->
        <!--<div class="modal-header">
          <h4 class="modal-title">Make a reservation</h4>
          <button type="button" class="close" data-dismiss="modal">
            &times;
            <span class="hide-text">{{ dateSelector }}</span>
          </button>
        </div>-->

        <!-- Modal body -->
        <div class="modal-body">
          <div class="row">
            <span class="hide-text">{{ dateSelector }}</span>
            <div class="col-md-6">
              <h6>{{ _t('New Reservation') }}</h6>
              <hr />
              <div class="form-group">
                <label>{{ _t('Select Number of guests') }}</label>
                <div
                  class="btn-group btn-group-toggle num_guests"
                  data-toggle="buttons"
                >
                  <label
                    v-for="(n, i) in 10"
                    :key="n"
                    :class="[
                      'btn',
                      'btn-secondary',
                      { active: no_of_guest === n },
                    ]"
                    @click="getSelectedGuest(i)"
                    class="cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="options"
                      :id="'option' + i"
                      autocomplete="off"
                      v-model="reservationInformation.number_of_guests"
                    />
                    <label :for="'option' + i"
                      >{{ i + 1 }} {{ n === 10 ? '+' : '' }}</label
                    >
                  </label>
                </div>
              </div>
              <div class="form-group">
                <label>{{ _t('Select Date') }}</label>
                <div class="reservation-date-format">
                  <input type="hidden" id="newReservationDate" value="" />
                  <span id="wtf"></span>
                  <div id="page" class="page">
                    <section id="main">
                      <div class="wrapperNew"></div>
                    </section>
                  </div>
                </div>
              </div>
              <div class="form-group pt-2">
                <label>
                  {{ _t('Available Time Slots') }}
                  <span class="text-danger"
                    >* {{ errorCheck('start_time') }}</span
                  >
                </label>
                <div class="row time_slot_block" style="margin: 0">
                  <div
                    v-for="(val, key) in time_slots"
                    :key="key"
                    class="col-sm-3 time_slot cursor-pointer"
                    :class="[
                      'selected_time_slot_' + key,
                      { active: val.time === startedTime },
                    ]"
                    @click="
                      getSelectedTimeSlot(val, '.selected_time_slot_' + key)
                    "
                  >
                    <div v-if="val.occupied">
                      <span
                        class="fa fa-square"
                        style="color: rgb(200, 76, 76);"
                      ></span>
                    </div>
                    <div v-else>
                      <span
                        class="fa fa-square"
                        style="color: rgb(98, 187, 49);"
                      ></span>
                    </div>
                    <div>{{ val.time }}</div>
                  </div>
                </div>
                <div class="slot-symbol">
                  <div class="is_available">
                    <span
                      class="fa fa-square"
                      style="color: rgb(98, 187, 49);"
                    ></span>
                    <span> Open </span>
                  </div>
                  <div class="is_available not_available">
                    <span
                      class="fa fa-square"
                      style="color: rgb(200, 76, 76);"
                    ></span>
                    <span> Closed </span>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <button
                    type="button"
                    data-target="#dine-in-table-selection"
                    data-toggle="modal"
                    class="btn btn-secondary btn-lg btn-block res-select-table"
                    :class="{ activeTable: selectedTable != false }"
                  >
                    {{
                      selectedTable != false &&
                      typeof selectedTable.name != 'undefined'
                        ? selectedTable.name +
                          ' / ' +
                          selectedTable.table_number
                        : tableText
                    }}
                  </button>
                  <span class="text-danger">
                    {{ errorCheck('assigned_table_id') }}
                  </span>
                </div>
                <div class="col-md-5" style="display: none">
                  <button
                    type="button"
                    class="btn btn-secondary btn-lg btn-block"
                  >
                    Taken By
                  </button>
                  <!-- <div class="form-group">
                    <label>Taken By</label>
                    <select
                      class="form-control txt-box"
                      v-model="reservationInformation.taken_by"
                    >
                      <option>User A</option>
                    </select>
                    &lt;!&ndash;<input
                      type="text"
                      class="form-control txt-box"
                      v-model="reservationInformation.taken_by"
                    />&ndash;&gt;
                  </div>-->
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <h6>{{ _t('Guest Details') }}</h6>
              <hr />
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group">
                    <label
                      >{{ _t('Phone') }}
                      <span class="text-danger">*</span></label
                    >
                    <div class="input-group">
                      <span class="lbl-txt-box">{{ brand.country }}</span>
                      <input
                        type="text"
                        class="form-control txt-box"
                        v-model="reservationInformation.guest_phone"
                        @focusout="
                          getuserHistoryByMobile(
                            reservationInformation.guest_phone
                          )
                        "
                      />
                    </div>
                    <span class="text-danger">
                      {{ errorCheck('guest_phone') }}
                    </span>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label>{{ _t('Email') }}</label>
                    <input
                      type="email"
                      class="form-control txt-box"
                      v-model="reservationInformation.guest_email"
                    />
                    <span class="text-danger">{{
                      errorCheck('guest_email')
                    }}</span>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label
                      >{{ _t('First Name') }}
                      <span class="text-danger">*</span></label
                    >
                    <input
                      type="text"
                      class="form-control txt-box"
                      v-model="reservationInformation.guest_fname"
                    />
                    <span class="text-danger">{{
                      errorCheck('guest_fname')
                    }}</span>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label
                      >{{ _t('Last Name')
                      }}<span class="text-danger">*</span></label
                    >
                    <input
                      type="text"
                      class="form-control txt-box"
                      v-model="reservationInformation.guest_lname"
                    />
                    <span class="text-danger">{{
                      errorCheck('guest_lname')
                    }}</span>
                  </div>
                </div>
              </div>
              <div class="row lh-30">
                <div class="col-md-12">
                  <label>{{ _t('Guest History') }}</label>
                  <div class="scroll-history">
                    <table class="table table-bordered">
                      <tbody v-if="userHistory">
                        <tr
                          v-for="(reservations, index) in userHistory"
                          :key="index"
                        >
                          <th scope="row">{{ reservations.start_date }}</th>
                          <td>{{ reservations.start_time }}</td>
                          <td class="text-capitalize">
                            {{ reservations.status }}
                          </td>
                          <td class="text-capitalize">NA</td>
                        </tr>
                      </tbody>
                      <tbody v-else>
                        <tr>
                          <td>{{ _t('No history found') }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div class="col-md-12">
                  <label style="margin-top: 10px">{{ _t('Tags') }}</label>
                  <div style="display: block" class="hiddenCB">
                    <span
                      class="button-checkbox"
                      v-for="(tag, index) in tags"
                      :key="index"
                    >
                      <input type="checkbox" :id="tag._id" class="hidden" />
                      <label
                        class="btn btn-secondary"
                        :for="tag._id"
                        @click="
                          updateTag({
                            name: tag.name,
                            key: index,
                            tagId: tag._id,
                          })
                        "
                      >
                        {{ tag.name }}
                      </label>
                    </span>
                  </div>
                </div>
                <div class="col-md-12">
                  <div class="form-group" style="margin-top: 10px">
                    <label>{{ _t('Visit Notes') }}</label>
                    <textarea
                      class="form-control"
                      rows="3"
                      v-model="reservationInformation.visit_notes"
                    ></textarea>
                  </div>
                </div>
                <!--<div class="col-md-12">
                  <div class="form-group">
                    <label>Taken By</label>
                    <select
                      class="form-control txt-box"
                      v-model="reservationInformation.taken_by"
                    >
                      <option>User A</option>
                    </select>
                    &lt;!&ndash;<input
                      type="text"
                      class="form-control txt-box"
                      v-model="reservationInformation.taken_by"
                    />&ndash;&gt;
                  </div>
                </div>-->
              </div>
            </div>
          </div>
        </div>

        <!-- Modal footer -->
        <div class="modal-footer modal-footer-reservation">
          <button type="button" class="btn btn-danger" data-dismiss="modal">
            {{ _t('Cancel') }}
          </button>
          <button
            type="button"
            v-if="edit"
            class="btn btn-success"
            @click="updateReservation"
          >
            {{ _t('Update Reservation') }}
          </button>
          <button
            type="button"
            v-else
            class="btn btn-success"
            @click="addNewReservation"
          >
            {{ _t('Add Reservation') }}
          </button>
        </div>
      </div>
    </div>
    <DineInTableSelection tableHeaderName="Select Table" />
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import DineInTableSelection from '@/components/dinein/cart/popup/DineInTableSelection'
import DateTime from '@/plugins/helpers/DateTime'
/* global $ */

export default {
  name: 'NewReservation',
  components: {
    // Datetime,
    DineInTableSelection,
  },
  props: {
    dateSelector: Boolean,
    edit: Boolean,
    reservationInformation: Object,
  },
  computed: {
    ...mapState('dinein', [
      'tablesOnArea',
      'dineInTabType',
      'availableTables',
      'selectedTable',
    ]),
    ...mapState('dineinReservation', [
      'tags',
      'userHistory',
      'tableBookedStatus',
    ]),
    ...mapGetters('location', ['_t']),
    ...mapGetters('dineinReservation', ['getUTCDate']),
    ...mapState('location', ['brand', 'store']),
  },
  updated() {
    let isCalendarhasData = $('.wrapperNew').text().length
    if (isCalendarhasData == 0 && this.dineInTabType == 'reservation')
      this.cal()
  },
  watch: {
    reservationInformation: function(oldvalue, newValue) {
      if (typeof newValue.assigned_table_id != 'undefined') {
        // newValue.assigned_table_id != oldvalue.assigned_table_id
        this.updateDetails()
        this.errors = false
        // eslint-disable-next-line no-console
        console.log(
          this.reservationInformation,
          'data',
          this.selectedTable,
          oldvalue,
          newValue
        )
      } else {
        this.getInterval()
      }
    },
  },
  data() {
    return {
      tableText: 'Select Table',
      calendarOpen: false,
      dtObj: new DateTime(),
      newDetails: false,
      startedTime: false,
      selectedDate: '',
      no_of_guest: 1,
      time_slots: [],
      days: [],
      // history: false,
      week_no: null,
      week_diff: null,
      curr_week_no: 0,
      settings: '',
      selectedTags: [],
      errors: false,
      errorsCount: 0,
      hoursCalculation: {},
    }
  },
  methods: {
    getuserHistoryByMobile: function(mobileNo) {
      this.$store.dispatch('dineinReservation/getUserHistory', mobileNo)
    },
    errorCheck(element) {
      return this.errors && this.errors[element]
        ? this.errors[element][0] || ''
        : ''
    },
    getInterval() {
      let startTime = 0
      let closedTime = 0
      let interval = this.timeConvert(
        this.store.reservation_interval,
        'reservation_interval'
      )
      if (this.store.open_hours.all_day_long) {
        startTime = 0
        closedTime = 24 * 60
      } else {
        startTime = this.timeConvert(this.store.open_hours.opens_at, 'opens_at')
        closedTime = this.timeConvert(
          this.store.open_hours.closes_at,
          'closes_at'
        )
      }
      /* below section added if time starts from morning 10AM to next day 4AM etc..*/
      let openAt = parseInt(this.hoursCalculation['opens_at'])
      let closedAt = parseInt(this.hoursCalculation['closes_at'])
      if (openAt >= closedAt) {
        let timeSplit = this.store.open_hours.closes_at.split(':')
        let calcTime = openAt + closedAt + 12 + (12 - openAt)
        // startTime += openAt
        closedTime = calcTime * 60 + parseInt(timeSplit[1])
      }
      // eslint-disable-next-line no-console
      console.log(startTime, closedTime, 'closedTime')
      let time_slots = []
      let occupied = null
      let hh = 0,
        mm = 0,
        i = 0,
        ap = ['AM', 'PM'] // AM-PM

      /*for (let i = startTime; i <= closedTime; i = i + interval) {
        this.time_slots.push(i)
      }*/
      for (i; startTime < closedTime; i++) {
        hh = Math.floor(startTime / 60) // getting hours of day in 0-24 format
        mm = startTime % 60 // getting minutes of the hour in 0-55 format
        let setAP =
          typeof ap[Math.floor(hh / 12)] === 'undefined'
            ? 'AM'
            : ap[Math.floor(hh / 12)]
        var timeSlot =
          ('0' + (hh % 12)).slice(-2) + ':' + ('0' + mm).slice(-2) + ' ' + setAP
        occupied = this.tableBookedStatus.includes(timeSlot)
        time_slots.push({ time: timeSlot, occupied: occupied }) // pushing data in array in [00:00 - 12:00 AM/PM format]
        startTime = startTime + interval
      }
      // eslint-disable-next-line no-console
      console.log(time_slots, 'time_slots', this.tableBookedStatus)
      this.time_slots = time_slots
    },
    timeConvert(time, timeKnown, separator = ':') {
      let timeSplit = time.split(separator)
      this.hoursCalculation[timeKnown] = timeSplit[0]
      return parseInt(timeSplit[0]) * 60 + parseInt(timeSplit[1])
    },
    setStartDate: function() {
      this.reservationInformation.start_date = this.$store.getters[
        'dineinReservation/getUTCDate'
      ](this.selectedDate)
    },
    checkForm: function() {
      this.errors = {}
      this.errorsCount = 0
      let er = this.reservationInformation
      if (!er.guest_phone) {
        // this.errors.guest_phone = 'Please enter valid phone number'
        this.errors = { guest_phone: ['Phone number is required'] }
        this.errorsCount = 1
      } else if (!er.guest_fname) {
        // this.errors.guest_fname = 'Please enter valid name.'
        this.errors = { guest_fname: ['Name is required'] }
        this.errorsCount = 1
      } else if (!er.guest_lname) {
        // this.errors.guest_fname = 'Please enter valid name.'
        this.errors = { guest_lname: ['Last name is required'] }
        this.errorsCount = 1
      }
      // eslint-disable-next-line no-debugger
      // debugger
    },
    addNewReservation: function() {
      this.setStartDate()
      this.checkForm()
      this.reservationInformation.assigned_table_id =
        this.selectedTable.table_id || ''
      if (this.errorsCount) return false
      this.$store
        .dispatch('dinein/newReservation', this.reservationInformation, {
          root: true,
        })
        .then(response => {
          this.errors = response.data.form_errors || false
          if (!this.errors) {
            $('#NewReservation').modal('hide')
            this.getReservationByDate(this.selectedDate)
          }
        })
        .catch(() => {
          this.errors = { start_time: ['Please select a time slot'] }
        })
    },
    updateReservation: function() {
      this.setStartDate()
      this.checkForm()
      if (this.errorsCount) return false
      let id = this.reservationInformation._id
      delete this.reservationInformation._id
      delete this.reservationInformation.number
      delete this.reservationInformation.end_time
      delete this.reservationInformation.related_orders_ids
      delete this.reservationInformation.reservation_history
      delete this.reservationInformation.created_by
      delete this.reservationInformation.assigned_to
      this.$store
        .dispatch('dineinReservation/editTable', {
          id: id,
          data: this.reservationInformation,
        })
        .then(response => {
          this.errors = response.data.form_errors || false
          $('#NewReservation').modal('hide')
          this.getReservationByDate(this.selectedDate)
        })
    },
    getSelectedGuest: function(numberOfGuest) {
      this.reservationInformation.number_of_guests = numberOfGuest + 1
    },
    getSelectedTimeSlot: function(selectedTimeSlot, scope) {
      $('.time_slot').removeClass('active')
      $(scope).addClass('active')
      this.reservationInformation.start_time = this.dtObj.convertTime12to24(
        selectedTimeSlot.time
      )
      // eslint-disable-next-line no-console
      // console.log(selectedTimeSlot, this.reservationInformation)
    },
    // calendar
    cal: function() {
      let scope = this
      // Use the settings object to change the theme
      $(function() {
        $('#main, #projects .wrapper').height($(window).height())
        $(window).on('resize', function() {
          $('#main, #projects .wrapper').height($(window).height())
        })
      })
      $('.wrapperNew').SC({
        selectedDatesObj: 'newReservationDate',
        animate: true,
        useWheel: true,
        vertical: false,
        sizes: 'auto',
        callbackDelay: 50,
        years: 1,
        months: 3,
        days: 3,
        invert: false,
        combineMonthYear: true,
        showDayArrows: true,
        showDayNames: true,
        monthNames: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
        dayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        doubleDigitsDays: true,
        allowSelectSpans: true,
        callback: function(cal) {
          $('.SCToday')
            .parent()
            .parent()
            .prevAll()
            .find('.SCElement')
            .parent()
            .parent()
            .addClass('disabled')
          scope.selectedDate = cal.currentDate
          scope.calendarOpen = true
          scope.getReservationByDate(cal.currentDate)

          // below section for change another calendar date according to this
          let getUTC = scope.$store.getters['dineinReservation/getUTCDate'](
            cal.currentDate
          ).split('-')
          let getDay = getUTC[2] || false
          if (getDay) $('.SCDayNum:contains(' + getDay + ')').click()
        },
      })
    },
    updateTag: function(tag) {
      let selectedLabel = $('#' + tag.tagId).siblings('label')
      this.selectedTags = this.selectedTags.filter(tg => {
        return tg.tagId != tag.tagId
      })
      let deletionIndex = this.selectedTags.indexOf(tag.tagId)
      if (deletionIndex != '-1') {
        this.selectedTags.splice(deletionIndex, 1)
        selectedLabel.removeClass('selected')
      } else {
        this.selectedTags.push(tag.tagId)
        selectedLabel.addClass('selected')
      }
      this.reservationInformation.tags = this.selectedTags
    },
    updateDetails: function() {
      let selectedTable = false
      if (this.edit) {
        selectedTable = this.availableTables.find(
          at => at.table_id == this.reservationInformation.assigned_table_id
        )
      }

      this.$store.commit('dinein/SELECTED_TABLE', selectedTable)
      this.selectedTags = this.reservationInformation.tags || []
      this.no_of_guest = this.reservationInformation.number_of_guests || 1
      let dateTime = new DateTime()
      this.startedTime =
        typeof this.reservationInformation.start_time != 'undefined'
          ? dateTime.convertTime24to12(this.reservationInformation.start_time)
          : false
      this.updateTagsChecks()
    },
    updateTagsChecks: function() {
      $('.hiddenCB > span')
        .children()
        .removeClass('selected')
      if (this.selectedTags.length > 0) {
        this.selectedTags.forEach(tagId => {
          $('#' + tagId)
            .siblings('label')
            .addClass('selected')
        })
      }
    },
    getReservationByDate: function(date) {
      let scope = this
      let inputDate = new Date(date)
      let todayDate = new Date()
      this.$store
        .dispatch('dineinReservation/getReservationByDate', date)
        .then(details => {
          scope.newDetails = details
          if (
            inputDate.setHours(0, 0, 0, 0) != todayDate.setHours(0, 0, 0, 0)
          ) {
            this.startedTime = false
          } else {
            let dateTime = new DateTime()
            this.startedTime =
              typeof this.reservationInformation.start_time != 'undefined'
                ? dateTime.convertTime24to12(
                    this.reservationInformation.start_time
                  )
                : false
          }
          this.getInterval()
        })
        .catch(details => {
          scope.newDetails = details
        })
    },
  },
}
</script>

<style lang="scss">
@import '@/assets/scss/variables';
@import '@/assets/scss/mixins';

.num_guests {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  .btn {
    padding: 1.175rem 1.75rem;
  }
}
.select_date {
  display: flex;
  width: 100%;
  > div {
    display: flex;
    flex-direction: column;
    padding: 12px;
    > span:first-child {
      font-size: 10px;
    }
  }
  .arrow {
    justify-content: center;
    cursor: pointer;
  }
}
.hide-text {
  display: none;
}
#NewReservation .modal-dialog {
  max-width: 1124px !important;
}
#NewReservation #dine-in-table-selection .modal-dialog {
  max-width: 100% !important;
  width: 430px;
}
.time_slot_block {
  max-height: 320px;
  overflow-y: auto;
  border: 1px solid #d7dce2;
  border-radius: $px4;
  .time_slot {
    &.active {
      border: solid 2px #5056ca;
      &:after {
        @include check_symbol;
        width: $px25;
        height: $px25;
        border-radius: $btn-border-radius;
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        right: $px10;
        top: $px10;
        background-color: $blue-light;
      }
    }
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    padding: 5px 0;
    border-bottom: 1px solid #d7dce2;
    border-right: 2px solid #d7dce2;
    height: 80px;
    max-width: 24.9%;
    .is_available {
      color: green;
      font-weight: 900;
      font-size: 30px;
      line-height: 19px;
      &.not_available {
        color: red;
      }
    }
  }
}
.time_slot_block > div:nth-child(4n) {
  border-right: medium none;
}
.tag-secondary {
  padding: 10px;
  border-radius: 10%;
  margin-right: 10px;
  background-color: #b1b1b1;
  color: #383838;
  &.active {
    background-color: #000;
    color: #fff;
  }
}
.lbl-txt-box {
  width: 50px;
  height: 50px;
  border-radius: 4px 0 0 4px;
  border: solid 1px #d7dce2;
  color: #7a808a;
  background-color: #f4f5f8;
  text-align: center;
  padding: 12px;
}
div#NewReservation label {
  color: #a4a4a4;
  font-size: $px16;
  font-weight: normal;
}

div#NewReservation .num_guests .btn-secondary {
  background: #fff;
  border: 1px solid #d7dce2;
  &.active {
    &.focus {
      box-shadow: 0 0 0 0 rgba(108, 117, 125, 0.5);
    }
    background: #f1f3f6;
    border: solid 2px #5056ca;
    &:after {
      //@include check_symbol;
      width: $px23;
      height: $px23;
      border-radius: $btn-border-radius;
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      right: $px2;
      top: $px2;
      background-color: $blue-light;
    }
  }
}
div#NewReservation .num_guests .btn-secondary label {
  color: #3d3f43;
  font-weight: bold;
}
/*div#NewReservation .num_guests .btn-secondary.active {
  background: #f1f3f6;
  border: 1px solid #d7dce2;
}*/
#NewReservation section#main {
  justify-content: left;
  margin-left: 0;
  grid-template-columns: 1fr;
}
.wrapperNew .SCDay .SCElement > div {
  width: auto !important;
}
.wrapperNew .SCMonth .SCElement > div {
  width: auto !important;
}
.wrapperNew .SCDay > div,
.wrapperNew .SCMonth > div {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  justify-content: center;
}
.next {
  width: 20px !important;
}
.prev {
  width: 20px !important;
}
.pre .SCDayNum {
  width: 80px;
  line-height: 40px;
}

span.button-checkbox {
  overflow: hidden;
  padding: 10px 0;
  margin-left: 5px;
}
#NewReservation {
  span {
    &.button-checkbox {
      .btn-secondary {
        background-color: #f4f5f8;
        border-color: #f4f5f8;
        color: #7a808a;
        &.selected {
          background: #5056ca;
          border-color: #5056ca;
          box-shadow: none;
          color: #fff;
        }
      }
    }
  }
}

span.button-checkbox .btn-secondary .hidden {
  display: none;
}

.slot-symbol {
  display: grid;
  margin: 10px 0;
  grid-template-columns: auto 1fr;
  grid-gap: 10px;
}
.scroll-history {
  max-height: 178px;
  overflow-y: auto;
  overflow-x: hidden;
}
.hiddenCB input[type='checkbox'] {
  display: none;
}
.hiddenCB label {
  cursor: pointer;
}
.hiddenCB input[type='checkbox'] + label:hover {
  background: rgba(59, 56, 255, 0.6);
}
.hiddenCB input[type='checkbox']:checked + label:hover {
  background: rgba(59, 56, 255, 0.5);
}
.res-select-table.activeTable {
  background: #5056ca;
  color: #fff;
  border-color: #5056ca;
}
</style>
