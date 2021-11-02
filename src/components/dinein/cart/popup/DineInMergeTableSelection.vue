<template>
  <div
    class="modal fade"
    data-backdrop="static"
    data-keyboard="false"
    id="dine-in-merge-table-selection"
    role="dialog"
  >
    <div class="modal-dialog modal-dialog-centered">
      <!-- Modal content-->
      <div class="modal-content color-dashboard-background">
        <div class="modal-header scrollomer-header color-secondary">
          <h4 class="scrollomer-title color-text-invert">
            {{ _t(tableHeaderName) }}
          </h4>
        </div>
        <div class="scroll-top-arrow food-arrow" @click="btnTop">
          <i class="fa fa-chevron-up" aria-hidden="true"></i>
        </div>
        <div class="scroll-bottom-arrow food-arrow" @click="btnBottom">
          <i class="fa fa-chevron-down" aria-hidden="true"></i>
        </div>
        <div class="modal-body row dining-options-block select-discount">
          <span class="error">{{ tableBookedAlert }}</span>
          <div id="available-tables" class="available-tables cursor-pointer">
            <div
              class="table-status-container"
              id="merge-table-status-container-id"
            >
              <span
                class="table-status"
                :class="
                  selectedTableMerge.includes(table.table_id) ? 'active' : ''
                "
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
          <span class="text-danger" v-if="error"> {{ error }}</span>
          <div class="btn-announce">
            <button
              class="btn btn-success btn-large color-main color-text-invert"
              type="button"
              id="discount-save-btn"
              @click="mergeSelectedTables(false)"
            >
              {{ _t('Merge') }}
            </button>
            <button
              @click="removeSelectedTable"
              type="button"
              class="btn btn-danger"
            >
              {{ _t('Cancel') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/*global $*/
import { mapGetters, mapState } from 'vuex'
import { bus } from '@/eventBus'
// import { bus } from '@/eventBus'
export default {
  name: 'DineInMergeTableSelection',
  data() {
    return {
      // moveTableDetails: [],
      tableBookedAlert: '',
      scrollBlockHeight: 0,
      scrollBlockInitHeight: 0,
      scrollBlockItemHeight: 0,
      scrollPosition: 0,
      error: undefined,
    }
  },
  props: {
    tableHeaderName: {
      type: String,
      default: 'Merge Tables Selection',
    },
    tableStatusByDate: {
      type: String,
      default: '',
    },
  },
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState('dinein', [
      'availableTables',
      'selectedTable',
      'allBookedTables',
    ]),
    ...mapGetters('context', ['store']),
    selectedTableMerge() {
      let merged_tables = []
      if (this.allBookedTables.orders) {
        this.allBookedTables.orders.forEach(order_table => {
          if (
            order_table.merge_table_ids &&
            order_table.merge_table_ids.length &&
            order_table.assigned_table_id == this.selectedTable._id
          ) {
            merged_tables.push(...order_table.merge_table_ids)
          }
        })
        merged_tables.push(this.selectedTable._id)
      }
      return merged_tables
    },
  },
  methods: {
    showScrollButtons() {
      let scroll_height = $('#merge-table-status-container-id')[0].scrollHeight
      let height_ = $('#merge-table-status-container-id').height()
      if (scroll_height > height_) {
        $('.scroll-top-arrow, .scroll-bottom-arrow').removeClass('disable')
      } else {
        $('.scroll-top-arrow, .scroll-bottom-arrow').addClass('disable')
      }
    },
    removeItemOnce(arr, value) {
      var index = arr.indexOf(value)
      if (index > -1) {
        arr.splice(index, 1)
      }
      return arr
    },
    setTable: function(table) {
      // this.moveTableDetails.push(table)
      if (this.selectedTableMerge.includes(table.table_id)) {
        this.removeItemOnce(this.selectedTableMerge, table.table_id)
      } else {
        this.selectedTableMerge.push(table.table_id)
      }
      if (
        table.color == '#c84c4c' &&
        table.table_id != this.selectedTable._id
      ) {
        this.tableBookedAlert = 'This table already have orders'
      } else {
        this.tableBookedAlert = ''
      }
    },
    mergeSelectedTables(moveToDineIn) {
      this.removeItemOnce(this.selectedTableMerge, this.selectedTable._id)
      let tables = this.selectedTableMerge
      if (tables.length) {
        this.$store.commit('dinein/MERGE_TABLES', tables)
        let reservationId = localStorage.getItem('reservationId')
        //Move Table Functionality.
        let data = {
          table_ids: tables,
          reservation_id: reservationId,
          status: 'merge_table',
        }
        this.$store.dispatch('dinein/mergeTable', data)
      } else {
        this.$store.commit('dinein/MERGE_TABLES', undefined)
        this.error = 'Please select tables for merge'
        return false
      }
      if (moveToDineIn && typeof this.selectedTableMerge == 'object')
        this.$router.push('/dine-in' + this.store)
      $('#dine-in-merge-table-selection').modal('toggle')
    },
    removeSelectedTable: function() {
      this.$store.commit('dinein/MERGE_TABLES', undefined)
      let reservationId = localStorage.getItem('reservationId')

      let data = {
        table_ids: [],
        reservation_id: reservationId,
        status: 'merge_table',
      }
      this.$store.dispatch('dinein/mergeTable', data)
      $('#dine-in-merge-table-selection').modal('hide')
    },
    areaCalculation(operation) {
      this.scrollBlockHeight = $(
        '#merge-table-status-container-id'
      )[0].scrollHeight
      this.scrollBlockItemHeight = $(
        '#merge-table-status-container-id > span'
      ).innerHeight()
      if (operation === 'init') {
        this.showScrollButtons()
      }
      if (operation === 'top') {
        this.scrollPosition = this.scrollBlockItemHeight
      }
      if (
        operation === '-' &&
        this.scrollPosition >= this.scrollBlockItemHeight
      ) {
        this.scrollPosition += this.scrollBlockItemHeight - 20
      }
      if (
        operation === '+' &&
        this.scrollPosition >= this.scrollBlockItemHeight
      ) {
        this.scrollPosition -= this.scrollBlockItemHeight - 20
      }
    },
    btnTop() {
      // eslint-disable-next-line no-console
      // console.log(this.scrollPosition, '', this.scrollBlockItemHeight)
      if (this.scrollPosition <= this.scrollBlockItemHeight) {
        this.areaCalculation('top')
        $('.scroll-top-arrow').addClass('disable')
        $('.scroll-bottom-arrow').removeClass('disable')
      } else {
        this.areaCalculation('+')
        $('.scroll-top-arrow').removeClass('disable')
        $('.scroll-bottom-arrow').removeClass('disable')
        document.getElementById(
          'merge-table-status-container-id'
        ).scrollTop -= 220
      }
    },
    btnBottom() {
      $('.scroll-top-arrow').removeClass('disable')
      if (
        this.scrollBlockHeight != 0 &&
        this.scrollPosition >= this.scrollBlockHeight
      ) {
        $('.scroll-top-arrow').removeClass('disable')
        $('.scroll-bottom-arrow').addClass('disable')
      } else {
        $('.scroll-top-arrow').removeClass('disable')
        document.getElementById(
          'merge-table-status-container-id'
        ).scrollTop += 220
        this.areaCalculation('-')
      }
    },
    mounted() {
      bus.$on('check-merge-tables-height', () => {
        setTimeout(() => {
          this.areaCalculation('init')
        }, 300)
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.error {
  width: 100%;
  color: #c84c4c;
  padding-bottom: 5px;
  font-weight: bold;
  position: relative;
  bottom: 10px;
}
.disable {
  display: none;
}
/*padding: 40px 5px 10px 5px*/
.food-arrow.disable {
  display: none;
}
.food-arrow.scroll-top-arrow {
  top: 60px;
  right: 30px;
}
.food-arrow.scroll-bottom-arrow {
  bottom: 80px;
  right: 30px;
}
#available-tables {
  .table-status-container {
    //max-height: unset;
  }
}
</style>
