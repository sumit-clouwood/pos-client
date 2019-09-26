<template>
  <!-- Select Discount  -->
  <div class="modal fade" id="dine-in-table-selection" role="dialog">
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content color-dashboard-background">
        <div class="modal-header customer-header color-secondary">
          <h4 class="customer-title color-text-invert">
            {{ _t('Move') + ' ' + _t('Table') }}
          </h4>
        </div>
        <div class="modal-body row dining-options-block select-discount">
          <span class="error">{{ tableBookedAlert }}</span>
          <div id="available-tables" class="available-tables cursor-pointer">
            <div class="table-status-container">
              <span
                class="table-status"
                :class="selectedTableMove == table.table_id ? 'active' : ''"
                v-for="(table, i) in availableTables"
                :key="table.id + i"
                @click="setTable(table)"
              >
                <span
                  :class="'fa fa-' + table.shape"
                  v-bind:style="
                    table.shape !== 'rectangle'
                      ? { color: table.color }
                      : { background: table.color }
                  "
                ></span>
                <span v-html="table.name"></span>
                <span
                  class="table-status-number"
                  v-html="table.table_number"
                ></span>
              </span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <div class="btn-announce">
            <button
              class="btn btn-success btn-large color-main color-text-invert"
              type="button"
              id="discount-save-btn"
              data-dismiss="modal"
              @click="moveSelectedTable"
            >
              {{ _t('Ok') }}
            </button>
            <button
              @click="removeSelectedTable"
              type="button"
              class="btn btn-danger"
              data-dismiss="modal"
            >
              {{ _t('Cancel') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- End Select Discount -->
</template>

<script>
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'DineInTableSelection',
  data() {
    return {
      selectedTableMove: '',
      moveTableDetails: '',
      tableBookedAlert: '',
    }
  },
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState('dinein', ['availableTables', 'selectedTable']),
  },
  methods: {
    setTable: function(table) {
      this.moveTableDetails = table
      this.selectedTableMove = table.table_id
      if (
        table.color == '#c84c4c' &&
        table.table_id != this.selectedTable._id
      ) {
        this.tableBookedAlert = 'This table already have orders'
      } else {
        this.tableBookedAlert = ''
      }
    },
    moveSelectedTable() {
      let table = this.moveTableDetails
      if (table) {
        if (table.table_number) {
          table.number = table.table_number
        }
        this.$store.commit('dinein/SELECTED_TABLE', table)
        this.$store.commit('dinein/POS_MOVE_TABLE_SELECTION', table)
        // let coverId = table.id
        let tableId = table.table_id
        let reservationId = localStorage.getItem('reservationId')
        //Move Table Functionality.
        let data = {
          table: tableId,
          reservationid: reservationId,
          status: 'move_table',
        }
        this.$store.dispatch('dinein/moveTable', data)
      } else {
        this.selectedTableMove = ''
      }
    },
    removeSelectedTable: function() {
      if (this.selectedTable) {
        this.selectedTable.number = this.selectedTable.table_number
      }
      this.$store.commit('dinein/POS_MOVE_TABLE_SELECTION', this.selectedTable)
      this.$store.commit('dinein/SELECTED_TABLE', this.selectedTable)

      this.selectedTableMove = ''
      // let coverId = table.id
      let reservationId = localStorage.getItem('reservationId')

      let data = {
        table: this.selectedTable.table_id,
        reservationid: reservationId,
        status: 'move_table',
      }
      this.$store.dispatch('dinein/moveTable', data)
    },
  },
}
</script>
<style lang="sass" scoped>
.error
    width: 100%
    color: #c84c4c;
    padding-bottom: 5px;
    font-weight: bold;
    position: relative;
    bottom: 10px
/*padding: 40px 5px 10px 5px*/
</style>
