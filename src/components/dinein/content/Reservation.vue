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
          <input
            type="hidden"
            id="selectedDates"
            value="2014-8-13,2014-8-10,2014-8-27,2014-7-27,2014-9-25,2014-9-20"
          />
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
                {{ reservation.start_date }} : {{ reservation.start_time }}
              </td>
              <td>Area / {{ reservation.assigned_table_id }}</td>
              <td>
                <span class="fa fa-user"></span
                >{{ reservation.number_of_guests }}
              </td>
              <td>{{ reservation.customers }}</td>
              <td>
                <span class="fa fa-edit"></span>
                <span class="dlt-icon"
                  ><img src="img/pos/delete-icon.svg"
                /></span>
                <span class="fa fa-right"></span>
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
    ...mapState('dinein', ['tablesOnArea', 'dineInTabType', 'allBookedTables']),
  },
  updated() {
    this.cal()
  },
  methods: {
    /* calendar   --*/
    cal: function() {
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
          $('#wtf').html('Selected date: ' + cal.currentDate)
        },
      })
      let _gaq = _gaq || []
      _gaq.push(['_setAccount', 'UA-36251023-1'])
      _gaq.push(['_setDomainName', 'jqueryscript.net'])
      _gaq.push(['_trackPageview'])(function() {
        var ga = document.createElement('script')
        ga.type = 'text/javascript'
        ga.async = true
        ga.src =
          ('https:' == document.location.protocol
            ? 'https://ssl'
            : 'http://www') + '.google-analytics.com/ga.js'
        var s = document.getElementsByTagName('script')[0]
        s.parentNode.insertBefore(ga, s)
      })()
    },
  },
}
</script>

<style scoped>
.fixed-reservation {
  position: fixed;
  right: 0;
  background: #fff;
  z-index: 9;
  height: 90vh;
  box-shadow: 0 25px 30px 0 rgba(0, 0, 0, 0.2), 0 28px 5px 0 rgba(0, 0, 0, 0.19);
  display: grid;
  grid-template-rows: auto 1fr auto;
  grid-row-gap: 20px;
  width: 600px;
}
.fixed-reservation th {
  color: #a4a4a4;
  font-weight: normal;
}
.fixed-reservation td {
  color: #3a3d44;
}
.pos-reservation-footer {
  display: grid;
  align-items: flex-end;
  padding: 20px;
}
.reservation-date-format p {
  color: #7c7e85;
  font-weight: 600;
}
.pos-reservation-table {
  padding: 20px;
}
.pos-reservation-header {
  min-height: 100px;
  background: #f1f3f6;
  padding: 20px;
}
</style>
