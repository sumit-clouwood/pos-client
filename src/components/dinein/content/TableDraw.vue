<template>
  <div class="dine-in-tabel-wrapper">
    <Header />
    <div class="dine-in-tabel-wrapper">
      <div class="inner-dinein-table">
        <TableStatus />
        <div
          class="sitting-dinein-table ui-droppable"
          id="sitting-dinein-table"
        >
          <div class="sitting-dine-wrap disable-sorting" v-if="tablesOnArea">
            <div class="sitting-image">
              <svg
                :height="height + 'px'"
                :width="width + 'px'"
                id="dine-in-area"
                ref="dine-in-area"
                xmlns="http://www.w3.org/2000/svg"
              ></svg>
            </div>
            <div id="tooltipdata" class="dropdown-content cursor-pointer">
              <div class="dropdown tooltip-c-range" id="range">
                <a
                  role="button"
                  class="dropdown-item text-capitalize bg-success font-weight-bold"
                  @click="newOrder()"
                >
                  {{ _t(addOrSplit) }}
                </a>
                <div v-if="orderDetails">
                  <div v-for="(orderData, index) in orderDetails" :key="index">
                    <div
                      class="table-action"
                      v-for="orderId in orderData.orderIds"
                      :key="orderId"
                    >
                      <a
                        @click="updateOrder(orderId)"
                        role="button"
                        class="dropdown-item text-capitalize font-weight-bold"
                        v-if="orders.lookup.orders._id"
                      >
                        {{ orderData.tableNumber }}
                        #{{
                          LookupData.get({
                            collection: orders.lookup.orders._id,
                            matchWith: orderId,
                          }).order_no
                        }}
                      </a>
                      <span
                        class="cursor-pointer text-danger reservation-cancel"
                        @click="cancelReservation(orderData.reservationId)"
                      >
                        ✖
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/* global $ */
import { mapGetters, mapState, mapActions } from 'vuex'
import * as d3 from 'd3'
import TableStatus from './TableStatus'
import Header from './Header'
export default {
  name: 'TableDraw',
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState('dinein', [
      'tablesOnArea',
      'orderOnTables',
      'tableStatus',
      'orders',
    ]),
    ...mapGetters('context', ['store']),
  },
  components: {
    Header,
    TableStatus,
  },
  data() {
    return {
      page: null,
      svg: null,
      width: 1000,
      height: 600,
      svgWidth: 250,
      svgHeight: 100,
      orderDetails: [],
      selectedTableId: false,
      addOrSplit: 'Add Order',
    }
  },
  mounted() {
    this.updateTableOnArea()
  },
  updated() {
    this.clearTableArea()
    this.updateTableOnArea()
  },
  methods: {
    ...mapActions('dinein', ['reservationUpdateStatus']),
    /*baseURL(link) {
      return window.location.href.replace('dine-in', 'dine-in/' + link)
    },*/
    newOrder() {
      let URL = this.store + '/dine-in/' + this.selectedTableId
      this.$store.dispatch('dinein/addReservation', this.selectedTableId, {
        root: true,
      })
      this.$router.push({ path: URL })
    },
    updateOrder(orderId) {
      let URL = this.store + '/dine-in/' + this.selectedTableId + '/' + orderId
      this.$store.dispatch('dinein/getSelectedOrder', orderId, {
        root: true,
      })
      this.$router.push({ path: URL })
    },
    clearTableArea() {
      d3.selectAll('#dine-in-area > *').remove()
    },
    /*orderTypeWalkIn: function(orderType) {
      this.$store.commit('order/ORDER_TYPE', orderType)
    },*/
    updateTableOnArea() {
      let dis = this
      let svgWidth = []
      this.page = d3.select(this.$el).select('#dine-in-area')
      this.svg = d3
        .select(this.$el)
        .select('#dine-in-area')
        .append('g')
        .attr('class', 'tables')
        .selectAll('.dinein_table')
        .data(this.tablesOnArea)
        .enter() //data from state tables
        .append('g')
        .attr('class', 'dinein_table_parent')
        .append('use')
        .attr('class', 'dinein_table')
        .attr('draggable', 'true')
        .attr('x', function(d) {
          return d.table_position_coordinate.x || 0
        })
        .attr('y', function(d) {
          return d.table_position_coordinate.y || 0
        })
        .attr('table_id', d => d._id)
        .attr('table_shape', d => d.table_shape)
        .attr('table_number', d => d.number)
        .attr('chairs', d => d.chairs)
        .attr('width', function(d) {
          let tableWidth = 90
          if (d.table_shape === 'rectangle') {
            tableWidth = d.chairs > 5 ? 220 : 120
          } /*else if (d.table_shape === 'circle') {
            tableWidth += 5
          }*/
          svgWidth.push(tableWidth)
          return tableWidth
        })
        .attr('height', this.svgHeight)
        .attr('xlink:href', function(d) {
          return `#dinein_${d.table_shape}_${d.chairs}`
        })
        .on('click', d => this.showOptions(d))
        .attr('fill', 'green')
      d3.selectAll('.dinein_table_parent').each((d, i, a) => {
        let dineInTableWidth = 0
        if (
          typeof $('.dinein_table') != 'undefined' &&
          $('.dinein_table').length
        ) {
          dineInTableWidth = $('.dinein_table')[i].getBoundingClientRect().width
        }
        d3.select(a[i])
          .append('text')
          .attr('class', 'dinein_table_number')
          .attr('x', function(d) {
            let xPosition = svgWidth[i] <= 100 ? 5 : 0
            if (d.table_shape === 'circle') {
              xPosition += 5
            }
            return (
              (d.table_position_coordinate.x + xPosition || 0) +
              dineInTableWidth / 2
            )
          })
          .attr('y', function(d) {
            return (d.table_position_coordinate.y || 0) + dis.svgHeight / 2
          })
          .style('fill', 'black')
          .style('font-size', '18px')
          .style('font-weight', 'bold')
          .attr('dy', '.35em')
          .attr('text-anchor', 'middle')
          .text(function(d) {
            return d.number
          })

        d3.select(a[i])
          .append('rect')
          .attr('x', function(d) {
            let rectleft = 10
            if (d.table_shape === 'rectangle') {
              rectleft += d.chairs > 5 ? 5 : 0
            } else if (
              d.table_shape === 'circle' ||
              d.table_shape === 'square'
            ) {
              rectleft += 10
            }
            return (d.table_position_coordinate.x || 0) + rectleft
          })
          .attr('y', function(d) {
            let rectTop = 5
            if (d.table_shape === 'square') {
              rectTop = 0
            }
            return (d.table_position_coordinate.y || 0) + rectTop + 50 / 2
          })
          .attr('rx', '20')
          .attr('ry', '3')
          .style('fill', function(d) {
            let fillcolor = '#c84c4c'
            dis.tableStatus.table.filter(ts => {
              if (ts.id === d._id) {
                fillcolor = ts.status.color
              }
            })
            return fillcolor
          })
          .style('stroke', 'gray')
          .style('opacity', '1')
          .style('stroke-width', '0.5')
          .attr('width', '15')
          .attr('height', '15')
      })
    },

    cancelReservation(id) {
      this.reservationUpdateStatus({
        reservationId: id,
        status: 'cancelled_reservation',
      })
    },

    showOptions(datum) {
      this.orderDetails = this.orderOnTables.filter(
        order => order.tableId === datum._id
      )
      // eslint-disable-next-line no-console
      console.log(this.orderDetails)
      this.addOrSplit =
        this.orderDetails.length > 0 ? 'Split Table' : 'Add Order'
      this.selectedTableId = datum._id
      let range = $('#range')
      range
        .parent('div')
        .attr(
          'style',
          'top:' +
            (datum.table_position_coordinate.y || 0) +
            'px; left:' +
            (datum.table_position_coordinate.x || 100) +
            'px; display:block'
        )
    },
  },
}
</script>
<style scoped lang="scss">
svg#dine-in-area {
  background: #f8fbff;
}
.tooltip-c-range {
  margin-bottom: 0;
  font-weight: 600;
}
.dropdown-content {
  box-shadow: 0 6px 8px rgba(52, 73, 94, 0.2), 0 1px 1px rgba(52, 73, 94, 0.1);
  transition: all 0.2s ease-out;
  width: auto;
}
#tooltipdata {
  display: none;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 4px 0 rgba(187, 187, 187, 0.5);
  background-color: #f8fbff;
}

.dinein_table {
  &:hover {
    svg {
      path {
        fill: #62bb31;
        stroke: #62bb31;
      }
    }
  }
}
g.dinein_table_parent:active {
  stroke: #62bb31;
  stroke-width: 2px;
}
</style>
<style lang="scss">
.table-action {
  position: relative;
}
</style>
