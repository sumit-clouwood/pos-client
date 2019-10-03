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
        </div>
      </div>
      <div class="pos-reservation-table">
        <table class="table table-hover">
          <thead>
            <tr>
              <th>Time</th>
              <th>Table Number</th>
              <th>Total Order</th>
              <th>Customer Name</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>8:00 AM</td>
              <td>3</td>
              <td>3</td>
              <td>Matlida R</td>
            </tr>
            <tr>
              <td>8:00 AM</td>
              <td>3</td>
              <td>3</td>
              <td>Matlida R</td>
            </tr>
            <tr>
              <td>8:00 AM</td>
              <td>3</td>
              <td>3</td>
              <td>Matlida R</td>
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

export default {
  name: 'Reservation',
  components: { TableDraw },
  computed: {
    ...mapState('dinein', ['tablesOnArea', 'dineInTabType']),
  },
}
</script>

<style scoped>
/*!* Style the header *!
.fixed-reservation {
  position: fixed;
  right: 0;
  background: #fff;
  z-index: 9;
  height: 90vh;
  padding: 20px;
  box-shadow: 0 25px 30px 0 rgba(0, 0, 0, 0.2), 0 28px 5px 0 rgba(0, 0, 0, 0.19);
}
.fixed-reservation th {
  color: #a4a4a4;
  font-weight: normal;
}
.fixed-reservation td {
  color: #3a3d44;
}*/
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
