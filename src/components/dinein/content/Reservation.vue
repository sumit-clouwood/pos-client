<template>
  <div
    v-if="tablesOnArea && dineInTabType === 'reservation'"
    class="table-holder container-fluid running-orders-dinein active"
    id="all-tables-show"
    style="display: block; padding-right: 0;"
  >
    <div class="fixed-reservation">
      <div class="pos-reservation-header">
        <div class="reservation-date-format">
          <p>Select Date</p>
          <input type="hidden" id="selectedDates" value="" />
          <span id="wtf"></span>
          <div id="page" class="page">
            <section id="main">
              <div class="wrapperHor"></div>
            </section>
          </div>
        </div>
      </div>
      <div class="pos-reservation-table">
        <table class="table table-hover">
          <thead>
            <tr>
              <th>Time</th>
              <th>Area/Table</th>
              <th>Guests</th>
              <th>Customer</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(reservation, index) in allBookedTables.orders"
              :key="index"
            >
              <td>
                {{ reservation.start_date }}, {{ reservation.start_time }}
              </td>
              <td>
                {{ getAreaName(reservation.assigned_table_id) }} /
                {{ reservation.number }}
              </td>
              <td>
                <span class="fa fa-user"></span
                >{{ reservation.number_of_guests }}
              </td>
              <td>{{ reservation.customers }}</td>
              <td class="mr-1">
                <button class="btn btn-warning">
                  <span class="fa fa-edit"></span>
                </button>
                <button class="btn btn-danger">
                  <span class="dlt-icon">
                    <img src="img/pos/delete-icon-reservation.svg" />
                  </span>
                </button>
                <button class="btn btn-success">Confirm</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="pos-reservation-footer">
        <button class="btn btn-success">New Reservation</button>
      </div>
    </div>
    <TableDraw />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import TableDraw from '../content/TableDraw'
/* global $ */
export default {
  name: 'Reservation',
  components: { TableDraw },
  computed: {
    ...mapState('dinein', [
      'tablesOnArea',
      'dineInTabType',
      'allBookedTables',
      'availableTables',
    ]),
    ...mapState('dineinReservation', ['reservations']),
  },
  updated() {
    this.cal()
  },
  methods: {
    getAreaName: function(tableId) {
      return this.availableTables.find(table => table.table_id === tableId).name
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
      $('.wrapperHor').SC({
        selectedDatesObj: 'selectedDates',
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
          scope.$store.dispatch(
            'dineinReservation/getReservationByDate',
            cal.currentDate
          )
          // eslint-disable-next-line no-console
          console.log(cal.currentDate)
          $('#wtf').html('Selected date: ' + cal.currentDate)
        },
      })
    },
  },
}
</script>

<style scoped></style>
