<template>
  <div class="modal fade" id="NewReservation">
    <div class="modal-dialog" style="max-width: 80%">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title">Make a reservation</h4>
          <button type="button" class="close" data-dismiss="modal">
            &times;
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
                    v-for="(n, i) in 8"
                    :key="n"
                    :class="[
                      'btn',
                      'btn-secondary',
                      { active: no_of_guest === n },
                    ]"
                    class="cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="options"
                      :id="'option' + i"
                      autocomplete="off"
                    />
                    <span @click="getSelectedGuest(n)"
                      >{{ i + 1 }} {{ n === 8 ? '+' : '' }}</span
                    >
                  </label>
                </div>
              </div>
              <div class="form-group">
                <label>Select Date</label>
                <div class="reservation-date-format">
                  <p>{{ _t('Select Date') }}</p>
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
                    class="btn btn-secondary btn-lg btn-block"
                  >
                    Select Table
                  </button>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group">
                    <label>Phone</label>
                    <input type="email" class="form-control" />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label>First Name</label>
                    <input type="text" class="form-control" />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label>Email</label>
                    <input type="email" class="form-control" />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label>Last Name</label>
                    <input type="text" class="form-control" />
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
                    <span class="badge badge-secondary active">VIP</span>
                    <span class="badge badge-secondary active">Birthday</span>
                    <span class="badge badge-secondary">Anniversary</span>
                    <span class="badge badge-secondary">Private Dining</span>
                    <span class="badge badge-secondary">First Time</span>
                  </div>
                </div>
                <div class="col-md-12">
                  <div class="form-group" style="margin-top: 10px">
                    <label>Visit Notes</label>
                    <textarea class="form-control" rows="3"></textarea>
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
          <button type="button" class="btn btn-success">Add Reservation</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line
import moment from 'moment-timezone'
import { mapState, mapGetters } from 'vuex'
// import { Datetime } from 'vue-datetime'
/* global $ */

export default {
  name: 'NewReservation',
  components: {
    // Datetime,
  },
  computed: {
    ...mapState('dinein', ['tablesOnArea', 'dineInTabType', 'availableTables']),
    ...mapGetters('location', ['_t']),
  },
  updated() {
    alert(this.calendarOpen + '>>' + this.dineInTabType)
    if (!this.calendarOpen && this.dineInTabType == 'reservation') this.cal()
  },
  data() {
    return {
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
    }
  },
  created() {
    // if (!this.calendarOpen && this.dineInTabType == 'reservation') this.cal()
  },
  methods: {
    getSelectedGuest: function(numberOfGuest) {
      alert(numberOfGuest)
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
        callbackDelay: 500,
        years: 1,
        months: 3,
        days: 3,
        invert: false,
        combineMonthYear: false,
        showDayArrows: false,
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
          scope.selectedDate = cal.currentDate
          scope.calendarOpen = true
          scope.getReservationByDate(cal.currentDate)
          // $('#wtf').html('Selected date: ' + cal.currentDate)
        },
      })
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
  text-align: center;
  .btn {
    padding: 1.175rem 1.75rem;
  }
}
.select_date {
  display: flex;
  justify-content: center;
  width: 100%;
  > div {
    display: flex;
    flex-direction: column;
    align-items: center;
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
.badge-secondary {
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
</style>
