<template>
  <div class="modal fade" id="NewReservation">
    <div class="modal-dialog" style="max-width: 80%">
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
              <h6>{{ _t('New Reservation') }}n</h6>
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
                      v-model="reservationInformation.guest"
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
                <label>Available Time Slots</label>
                <div class="row time_slot_block" style="margin: 0">
                  <div
                    v-for="(val, key) in time_slots"
                    :key="key"
                    class="col-sm-3 time_slot cursor-pointer"
                    :class="'selected_time_slot_' + key"
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
                <div class="col-md-5">
                  <button
                    type="button"
                    data-target="#dine-in-table-selection"
                    data-toggle="modal"
                    class="btn btn-secondary btn-lg btn-block"
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
                    <label>Phone</label>
                    <div class="input-group">
                      <span class="lbl-txt-box">IN</span>
                      <input
                        type="email"
                        class="form-control txt-box"
                        v-model="reservationInformation.phone"
                        @focusout="
                          getUserDetailsByMobile(reservationInformation.phone)
                        "
                      />
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      class="form-control txt-box"
                      v-model="reservationInformation.first_name"
                    />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      class="form-control txt-box"
                      v-model="reservationInformation.email"
                    />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      class="form-control txt-box"
                      v-model="reservationInformation.last_name"
                    />
                  </div>
                </div>
              </div>
              <div class="row lh-30">
                <div class="col-md-12">
                  <label>Guest History</label>
                  <table class="table table-bordered">
                    <tbody>
                      <tr>
                        <th scope="row">Thu, Sept 16</th>
                        <td>11:45 am</td>
                        <td>Nearly Finished</td>
                        <td>Victoria Pope Daniel</td>
                      </tr>
                      <tr>
                        <th scope="row">Thu, Sept 16</th>
                        <td>11:45 am</td>
                        <td>Finished</td>
                        <td>Victoria Pope Daniel</td>
                      </tr>
                      <tr>
                        <th scope="row">Thu, Sept 16</th>
                        <td>11:45 am</td>
                        <td>Finished</td>
                        <td>Victoria Pope Daniel</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="col-md-12">
                  <label style="margin-top: 10px">{{ _t('Tags') }}</label>
                  <div style="display: block">
                    <span
                      class="button-checkbox"
                      v-for="(tag, index) in tags"
                      :key="index"
                    >
                      <input
                        type="checkbox"
                        :id="tag.name.replace(/ +/g, '')"
                        class="hidden"
                      />
                      <label
                        class="btn btn-secondary"
                        :for="tag.name.replace(/ +/g, '')"
                        @click="updateTag({ name: tag.name, key: index })"
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
                      v-model="reservationInformation.visit_note"
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
// import { Datetime } from 'vue-datetime'
/* global $ */

export default {
  name: 'NewReservation',
  components: {
    // Datetime,
    DineInTableSelection,
  },
  props: {
    dateSelector: Boolean,
  },
  computed: {
    ...mapState('dinein', [
      'tablesOnArea',
      'dineInTabType',
      'availableTables',
      'selectedTable',
    ]),
    ...mapState('dineinReservation', ['tags']),
    ...mapGetters('location', ['_t']),
    ...mapState('location', ['brand', 'store']),
  },
  updated() {
    let isCalendarhasData = $('.wrapperNew').text().length
    if (isCalendarhasData == 0 && this.dineInTabType == 'reservation')
      this.cal()
  },
  data() {
    return {
      tableText: 'Select Table',
      calendarOpen: false,
      newDetails: false,
      selectedDate: '',
      no_of_guest: 1,
      time_slots: [],
      days: [],
      week_no: null,
      week_diff: null,
      curr_week_no: 0,
      settings: '',
      selectedTags: [],
      reservationInformation: {},
    }
  },
  methods: {
    getUserDetailsByMobile: function(mobileNo) {
      this.$store.dispatch('dineinReservation/getUserDetails', mobileNo)
    },
    getInterval() {
      let startTime = 0
      let closedTime = 0
      let interval = this.timeConvert(this.brand.reservation_interval)
      if (this.store.open_hours.all_day_long) {
        startTime = 0
        closedTime = 24 * 60
      } else {
        startTime = this.timeConvert(this.store.open_hours.opens_at)
        closedTime = this.timeConvert(this.store.open_hours.closes_at)
      }
      // eslint-disable-next-line no-console
      console.log(startTime)
      let time_slots = []
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
        var timeSlot =
          ('0' + (hh % 12)).slice(-2) +
          ':' +
          ('0' + mm).slice(-2) +
          ap[Math.floor(hh / 12)]
        time_slots.push({ time: timeSlot, occupied: null }) // pushing data in array in [00:00 - 12:00 AM/PM format]
        startTime = startTime + interval
      }
      this.time_slots = time_slots

      // eslint-disable-next-line no-console
      console.log(time_slots, closedTime, interval)
    },
    timeConvert(time, separator = ':') {
      let timeSplit = time.split(separator)
      return parseInt(timeSplit[0]) * 60 + parseInt(timeSplit[1])
    },
    addNewReservation: function() {
      this.reservationInformation.table = this.selectedTable
      // eslint-disable-next-line no-console
      console.log(this.reservationInformation)
    },
    getSelectedGuest: function(numberOfGuest) {
      this.reservationInformation.numberOfGuest = numberOfGuest + 1
    },
    getSelectedTimeSlot: function(selectedTimeSlot, scope) {
      $('.time_slot').removeClass('active')
      $(scope).addClass('active')
      this.reservationInformation.selectedTimeSlot = selectedTimeSlot
    },
    cal: function() {
      this.getInterval()
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
          scope.reservationInformation.datetime = cal.currentDate
          // $('#wtf').html('Selected date: ' + cal.currentDate)
        },
      })
    },
    updateTag: function(tag) {
      let id = '#' + tag.name.replace(/ +/g, '')
      this.selectedTags = this.selectedTags.filter(bdg => {
        return bdg.name != tag.name
      })
      if (this.selectedTags.includes(tag.name)) {
        this.selectedTags.splice(tag.key, 1)
      }
      if ($(id).is(':checked')) {
        $(id).attr('checked', '')
        $(id)
          .siblings('label')
          .removeClass('selected')
        this.selectedTags.splice(tag.key, 1)
      } else {
        $(id).attr('checked', 'checked')
        $(id)
          .siblings('label')
          .addClass('selected')
        this.selectedTags.push(tag)
      }
      this.reservationInformation.tags = this.selectedTags
    },
    getReservationByDate: function(date) {
      let scope = this
      this.$store
        .dispatch('dineinReservation/getReservationByDate', date)
        .then(details => {
          scope.newDetails = details
        })
        .catch(details => {
          scope.newDetails = details
        })
    },
  },
}
</script>

<style lang="scss">
@import '../../../../../assets/scss/variables';

.num_guests {
  display: block;
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
.time_slot_block {
  height: 320px;
  overflow-y: auto;
  margin-right: 40px !important;
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
    border: 1px solid #ccc;
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
  color: #989898;
  font-size: 15px;
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
  margin-left: 40px;
}
.wrapperNew .SCDay .SCElement > div {
  width: 80px !important;
}
.wrapperNew .SCMonth .SCElement > div {
  width: 80px !important;
}
.next {
  width: 40px !important;
}
.prev {
  width: 40px !important;
}
.pre .SCDayNum {
  width: 80px;
  line-height: 40px;
}

span.button-checkbox {
  background: #ddd;
  overflow: hidden;
  padding: 10px 0;
  margin-left: 5px;
}

.hidden {
  display: none;
}

.selected {
  background: #5056ca;
  border-color: #5056ca;
  box-shadow: none;
}
.slot-symbol {
  display: grid;
  margin: 10px 0;
  grid-template-columns: auto 1fr;
  grid-gap: 10px;
}
</style>
