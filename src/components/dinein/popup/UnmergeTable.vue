<template>
  <div class="modal fade" id="unmerge-table" role="dialog">
    <div
      class="modal-dialog modal-dialog-centered"
      v-if="unmergeTableSelection && getMergeTablesForSelectedTable"
    >
      <!-- Modal content-->
      <div class="modal-content color-dashboard-background">
        <div class="modal-header customer-header color-secondary">
          <h4 class="customer-title color-text-invert">
            {{ _t('Are you sure you want to unmerge') }}
          </h4>
        </div>
        <div class="modal-body row dining-options-block select-discount">
          <span>
            <span
              v-if="getMergeTablesForSelectedTable.merged_table_ids.length > 1"
            >
              {{ _t('Table Number') }}
              <span
                v-for="(id,
                index) in getMergeTablesForSelectedTable.merged_table_ids"
                :key="index"
              >
                <b> {{ getTableNumber(id, 'number') }}, </b>
              </span>
              {{ _t('are merged and connected with Main Table Number') }}
            </span>
            <span v-else>
              {{ _t('Selected table number') }}
              <b>{{ unmergeTableSelection.number }}</b>
              {{ _t('is connected with table number') }}
            </span>

            <b>
              {{
                getTableNumber(
                  getMergeTablesForSelectedTable.table_id,
                  'number'
                )
              }} </b
            >.
          </span>
          <span class="unmerge-confirmation">
            <b
              >{{ _t('Do you want to unmerge Table Number') }}
              {{ unmergeTableSelection.number }} ?
            </b>
          </span>
        </div>
        <div class="modal-footer">
          <div class="btn-announce">
            <button
              class="btn btn-success btn-large color-main color-text-invert"
              type="button"
              id="discount-save-btn"
              @click="unmergeTable"
            >
              {{ _t('Unmerge') }}
            </button>
            <button
              type="button"
              class="btn btn-danger cancel-announce color-button color-text-invert"
              data-dismiss="modal"
            >
              {{ _t('Cancel') }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- <information-popup
      :responseInformation="this.msg"
      title="Alert"
    ></information-popup> -->
  </div>
</template>

<script>
// import InformationPopup from '@/components/pos/content/InformationPopup'
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'UnmergeTable',
  data() {
    return {
      msg: '',
    }
  },
  props: {
    // selectedTable: [String, Object],
  },
  components: {
    // InformationPopup,
  },
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapGetters('dinein', ['mergedTableWithParent']),
    ...mapState('dinein', [
      'unmergeTableSelection',
      'tablesOnArea',
      'allBookedTables',
    ]),
    getMergeTablesForSelectedTable() {
      let mergedTable = undefined
      if (this.mergedTableWithParent.length > 0) {
        this.mergedTableWithParent.forEach(table => {
          table.merged_table_ids.forEach(mTable => {
            if (mTable === this.unmergeTableSelection._id) {
              mergedTable = table
            }
          })
        })
      }
      return mergedTable
    },
  },
  // watch: {
  //   selectedTable: function(newData, oldData) {
  //     // eslint-disable-next-line no-console
  //     console.log(newData, oldData, 'fdfdf')
  //     if (newData != oldData) {
  //       alert('newData, oldData')
  //     }
  //   },
  // },
  methods: {
    getTableNumber(id, element) {
      let table = this.tablesOnArea.find(t => t._id === id)
      return table ? table[element] : '0'
    },
    getReservationId(selectedMergedTables) {
      let reservation = null
      if (this.allBookedTables.orders) {
        this.allBookedTables.orders.forEach(order_table => {
          if (selectedMergedTables.table_id == order_table.assigned_table_id) {
            reservation = order_table._id
          }
        })
      }
      return reservation
    },
    unmergeTable() {
      let mergedTables = []
      let selectedMergedTables = this.getMergeTablesForSelectedTable
      if (selectedMergedTables) {
        selectedMergedTables.merged_table_ids.forEach(mTable => {
          if (mTable !== this.unmergeTableSelection._id) {
            mergedTables.push(mTable)
          }
        })
      }
      let reservationId = this.getReservationId(selectedMergedTables)
      let data = {
        table_ids: mergedTables,
        reservation_id: reservationId,
        status: 'merge_table',
      }
      this.$store.dispatch('dinein/mergeTable', data)
      // eslint-disable-next-line no-console
      console.log(mergedTables, 'mergedTables')
      // this.$store.dispatch('dinein/switchWaiter', mergedTables)
      //   .then(() => {
      //     //show info popupzx
      //     this.msg = 'Waiter assigned to table.'
      //   })
      //   .catch(error => (this.msg = error.message))
      //   .finally(() => {
      //     $('.information-popup').modal('show')
      //   })
    },
  },
}
</script>

<style lang="scss" scoped>
span.unmerge-confirmation {
  margin-top: 20 px;
}
</style>
