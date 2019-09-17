<template>
  <!-- Select Discount  -->
  <div class="modal fade" id="dine-in-table-selection" role="dialog">
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content color-dashboard-background">
        <div class="modal-header customer-header color-secondary">
          <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
          <h4 class="customer-title color-text-invert">
            {{ _t('Select') + ' ' + _t('Table') }}
          </h4>
        </div>
        <div class="modal-body row dining-options-block select-discount">
          <div id="available-tables" class="available-tables cursor-pointer">
            <!--<span @click="setTable(null)">-->
            <!--{{ _t('Select Table') }}-->
            <!--</span>-->
            <div class="table-status-container">
              <span
                class="table-status"
                v-for="(table, i) in availableTables"
                :key="table.id + i"
                v-bind:style="{
                  'border-bottom': '1px solid #ccc',
                }"
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
            >
              {{ _t('Ok') }}
            </button>
            <!--<button
                          v-show="orderError"
                          class="btn btn-danger btn-large color-text-invert color-button"
                          type="button"
                          data-dismiss="modal"
                          @click="discountHendlerChange"
                        >
                          {{ _t('Close') }}
                        </button>-->
          </div>
          <!-- <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> -->
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
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState('dinein', ['availableTables', 'selectedTable']),
  },
  methods: {
    setTable: function(table) {
      if (table) {
        this.$store.commit('dinein/POS_MOVE_TABLE_SELECTION', table)
        //        this.selectedTableMove = table.name
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
        //        this.selectedTableMove = 'Select Table'
      }
      // this.$store.commit('dinein/AVAILABLE_TABLES', table)
      //      $('.available-tables').hide()
    },
  },
}
</script>
<style lang="sass" scoped>
.error
    width: 100%
/*padding: 40px 5px 10px 5px*/
</style>
