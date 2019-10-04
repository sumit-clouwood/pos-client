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
          <div mbsc-page class="demo-week-view">
            <div mbsc-form>
              <div class="mbsc-form-group">
                <div id="demo-one-week" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="pos-reservation-table">
        <table class="table table-hover">
          <thead>
            <tr>
              <th>Time</th>
              <th>Table Number</th>
              <th>Guests</th>
              <th>Customer Name</th>
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
              <td>{{ reservation.assigned_table_id }}</td>
              <td>
                <span class="fa fa-user"></span
                >{{ reservation.number_of_guests }}
              </td>
              <td>{{ reservation.customers }}</td>
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
/* calendar   --*/

/* global mobiscroll */
export default {
  name: 'Reservation',
  components: { TableDraw },
  computed: {
    ...mapState('dinein', ['tablesOnArea', 'dineInTabType', 'allBookedTables']),
  },
  updated() {
    /* calendar   --*/
    window.isMbscDemo = true
    this.cal()
  },
  methods: {
    /* calendar   --*/
    cal: function() {
      // Use the settings object to change the theme
      mobiscroll.settings = {
        lang: 'en', // Specify language like: lang: 'pl' or omit setting to use default
        theme: 'ios', // Specify theme like: theme: 'ios' or omit setting to use default
      }

      mobiscroll.calendar('#demo-one-week', {
        display: 'inline', // Specify display mode like: display: 'bottom' or omit setting to use default
        weeks: 1, // More info about weeks: https://docs.mobiscroll.com/4-8-3/javascript/calendar#opt-weeks
      })
    },
  },
}
</script>

<style scoped>
/* calendar   --*/
[mbsc-form] {
  visibility: visible !important;
}
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
  width: 500px;
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
