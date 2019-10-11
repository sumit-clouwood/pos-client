<template>
  <div class="modal fade" id="NewReservation">
    <div class="modal-dialog" style="max-width: 80%">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title">Make a reservation</h4>
          <button type="button" class="close" data-dismiss="modal">
            &times;
            <span class="hide-text">{{ dateSelector }}</span>
          </button>
        </div>

        <!-- Modal body -->
        <div class="modal-body">
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label>Select Number of guests</label>
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
              <div class="form-group">
                <label>Time slot available</label>
                <div class="row time_slot_block" style="margin: 0">
                  <div
                    v-for="(val, key) in time_slots"
                    :key="key"
                    class="col-sm-3 time_slot"
                    @click="getSelectedTimeSlot(val)"
                  >
                    <div
                      :class="['is_available', { not_available: val.occupied }]"
                    >
                      -
                    </div>
                    <div>{{ val.time }}</div>
                    <div>am</div>
                  </div>
                </div>
                <div class="slot-symbol" style="display: flex;">
                  <div class="is_available">
                    <span
                      class="fa fa-square"
                      style="color: rgb(98, 187, 49);"
                    ></span>
                    <span> Open</span>
                  </div>
                  &nbsp;
                  <div class="is_available not_available">
                    <span
                      class="fa fa-square"
                      style="color: rgb(200, 76, 76);"
                    ></span>
                    <span> Closed</span>
                  </div>
                </div>
              </div>
              <label>Table Assignment</label>
              <div class="row">
                <div class="col-md-6">
                  <button
                    type="button"
                    class="btn btn-secondary btn-lg btn-block"
                  >
                    Select View
                  </button>
                </div>
                <div class="col-md-6">
                  <button
                    type="button"
                    data-target="#dine-in-table-selection"
                    data-toggle="modal"
                    class="btn btn-secondary btn-lg btn-block"
                  >
                    {{
                      selectedTable != false
                        ? selectedTable.name +
                          ' / ' +
                          selectedTable.table_number
                        : tableText
                    }}
                  </button>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group">
                    <label>Phone</label>
                    <div class="input-group">
                      <span class="lbl-txt-box">INR</span>
                      <input
                        type="email"
                        class="form-control txt-box"
                        v-model="reservationInformation.phone"
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
              <div class="row">
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
                  <label style="margin-top: 10px">Tags</label>
                  <div style="display: block">
                    <span
                      class="button-checkbox"
                      v-for="(tag, index) in tags"
                      :key="index"
                    >
                      <input
                        type="checkbox"
                        :id="tag.replace(/ +/g, '')"
                        class="hidden"
                      />
                      <label
                        class="btn btn-secondary"
                        :for="tag.replace(/ +/g, '')"
                        @click="updateTag({ name: tag, key: index })"
                      >
                        {{ tag }}
                      </label>
                    </span>
                  </div>
                </div>
                <div class="col-md-12">
                  <div class="form-group" style="margin-top: 10px">
                    <label>Visit Notes</label>
                    <textarea
                      class="form-control"
                      rows="3"
                      v-model="reservationInformation.visit_note"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal footer -->
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" data-dismiss="modal">
            Cancel
          </button>
          <button
            type="button"
            class="btn btn-success"
            @click="addNewReservation"
          >
            Add Reservation
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
    ...mapGetters('location', ['_t']),
  },
  updated() {
    if (!this.calendarOpen && this.dineInTabType == 'reservation') this.cal()
  },
  data() {
    return {
      tableText: 'Select Table',
      tags: ['VIP', 'Birthday', 'Anniversary', 'Private Dining', 'First Time'],
      calendarOpen: false,
      newDetails: false,
      selectedDate: '',
      no_of_guest: 5,
      time_slots: [
        {
          occupied: true,
          time: '0800',
        },
        {
          occupied: null,
          time: '0815',
        },
        {
          occupied: null,
          time: '0830',
        },
        {
          occupied: null,
          time: '0845',
        },
        {
          occupied: null,
          time: '0900',
        },
        {
          occupied: null,
          time: '0915',
        },
        {
          occupied: null,
          time: '0930',
        },
        {
          occupied: null,
          time: '0945',
        },
        {
          occupied: null,
          time: '1000',
        },
        {
          occupied: null,
          time: '1015',
        },
        {
          occupied: null,
          time: '1030',
        },
        {
          occupied: null,
          time: '1045',
        },
        {
          occupied: null,
          time: '1100',
        },
        {
          occupied: null,
          time: '1115',
        },
        {
          occupied: null,
          time: '1130',
        },
        {
          occupied: null,
          time: '1145',
        },
        {
          occupied: null,
          time: '1200',
        },
        {
          occupied: null,
          time: '1215',
        },
        {
          occupied: null,
          time: '1230',
        },
        {
          occupied: null,
          time: '1245',
        },
      ],
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
    addNewReservation: function() {
      this.reservationInformation.table = this.selectedTable
      // eslint-disable-next-line no-console
      console.log(this.reservationInformation)
    },
    getSelectedGuest: function(numberOfGuest) {
      this.reservationInformation.numberOfGuest = numberOfGuest + 1
    },
    getSelectedTimeSlot: function(selectedTimeSlot) {
      this.reservationInformation.selectedTimeSlot = selectedTimeSlot
    },
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
  overflow-y: scroll;
  .time_slot {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    padding: 5px 0;
    border: 1px solid #ccc;
    height: 80px;
    max-width: 23.5%;
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
  border: solid 1px #dce0e5;
  color: #7a808a;
  background-color: #f4f5f8;
  text-align: center;
  padding: 12px;
}
label.cursor-pointer.btn.btn-secondary {
  border-right: 1px solid #fff !important;
  border-left: 1px solid #fff !important;
}
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
  background: #62bb31;
  color: #ffffff;
}
</style>
