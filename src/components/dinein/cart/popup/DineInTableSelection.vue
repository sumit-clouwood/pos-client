<template>
  <div
    class="modal fade"
    data-backdrop="static"
    data-keyboard="false"
    id="dine-in-table-selection"
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
            <div class="table-status-container" id="table-status-container-id">
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
              id="move-Table-only"
              v-if="this.$route.name === 'HomeDefault'"
              @click="moveSelectedTable(true)"
            >
              {{ _t('Move Table') }}
            </button>
            <button
              class="btn btn-success btn-large color-main color-text-invert"
              type="button"
              id="discount-save-btn"
              @click="moveSelectedTable(false)"
            >
              {{ _t('Ok') }}
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
  name: 'DineInTableSelection',
  data() {
    return {
      selectedTableMove: '',
      moveTableDetails: '',
      tableBookedAlert: '',
      scrollBlockHeight: 0,
      scrollBlockInitHeight: 0,
      scrollBlockItemHeight: 0,
      scrollPosition: 0,
    }
  },
  props: {
    tableHeaderName: {
      type: String,
      default: 'Move Table',
    },
    tableStatusByDate: {
      type: String,
      default: '',
    },
  },
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState('dinein', ['availableTables', 'selectedTable']),
    ...mapGetters('context', ['store']),
    ...mapState('order', ['selectItemsToMove']),
  },
  methods: {
    showScrollButtons() {
      let scroll_height = $('#table-status-container-id')[0].scrollHeight
      let height_ = $('#table-status-container-id').height()
      if (scroll_height > height_) {
        $('.scroll-top-arrow, .scroll-bottom-arrow').removeClass('disable')
      } else {
        $('.scroll-top-arrow, .scroll-bottom-arrow').addClass('disable')
      }
    },
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
    moveSelectedTable(moveToDineIn) {
      let table = this.moveTableDetails
      if (table) {
        if (table.table_number) {
          table.number = table.table_number
        }
        if (this.selectItemsToMove) {
          this.$store.commit('dinein/MOVE_ITEM_TABLE_ID', table.table_id)
        } else {
          this.$store.commit('dinein/SELECTED_TABLE', table)
          this.$store.commit('dinein/POS_MOVE_TABLE_SELECTION', table)
          // let coverId = table.id
          /*if (this.selectItemsToMove) {
            return true
          }*/
          let tableId = table.table_id
          let reservationId = localStorage.getItem('reservationId')
          //Move Table Functionality.
          let data = {
            table: tableId,
            reservationid: reservationId,
            status: 'move_table',
          }
          this.$store.dispatch('dinein/moveTable', data)
        }
      } else {
        this.$store.commit('dinein/MOVE_ITEM_TABLE_ID', undefined)
        this.$store.commit('order/RESET_SPLIT_BILL')
        this.selectedTableMove = ''
      }
      if (moveToDineIn && typeof this.moveTableDetails == 'object')
        this.$router.push('/dine-in' + this.store)
      $('#dine-in-table-selection').modal('toggle')
    },
    removeSelectedTable: function() {
      this.$store.commit('dinein/MOVE_ITEM_TABLE_ID', undefined)
      this.$store.commit('order/RESET_SPLIT_BILL')

      $('#dine-in-table-selection').modal('hide')
      /*Bellow code is for reset table if not move, its having issue while cancel moving will check later*/
      /*if (this.selectItemsToMove) {
        $('#dine-in-table-selection').modal('hide')
      }
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
      $('#dine-in-table-selection').modal('hide')*/
    },
    areaCalculation(operation) {
      this.scrollBlockHeight = $('#table-status-container-id')[0].scrollHeight
      this.scrollBlockItemHeight = $(
        '#table-status-container-id > span'
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
        document.getElementById('table-status-container-id').scrollTop -= 220
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
        document.getElementById('table-status-container-id').scrollTop += 220
        this.areaCalculation('-')
      }
    },
    mounted() {
      bus.$on('check-move-tables-height', () => {
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
