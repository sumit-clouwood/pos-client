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
                :height="height"
                width="100%"
                id="dine-in-area"
                ref="dine-in-area"
                xmlns="http://www.w3.org/2000/svg"
              ></svg>
            </div>
            <div id="tooltipdata" class="dropdown-content cursor-pointer">
              <div
                class="dropdown tooltip-c-range"
                id="range"
                :key="componentKey"
              >
                <a
                  role="button"
                  class="table-popup bg-success font-weight-bold"
                  @click="newOrder()"
                >
                  {{ _t(addOrSplit) }}
                </a>
                <div v-if="orderDetails">
                  <div
                    v-for="orderData in orderDetails"
                    :key="orderData.reservationId"
                  >
                    <div v-if="orderData.orderIds.length">
                      <div
                        class="table-action"
                        v-for="orderId in orderData.orderIds"
                        :key="orderId"
                      >
                        <a
                          @click="
                            updateOrder({
                              orderId: orderId,
                              orderData: orderData,
                            })
                          "
                          role="button"
                          class="dropdown-item text-capitalize"
                          v-if="allBookedTables.lookup.orders._id"
                        >
                          {{ orderData.tableNumber }}
                          #{{ getOrderNo(orderId) }}
                        </a>
                        <span
                          class="cursor-pointer text-danger reservation-cancel"
                          @click="cancelReservation(orderData.reservationId)"
                        >
                          ✖
                        </span>
                      </div>
                    </div>
                    <div v-else class="table-action">
                      <a
                        @click="newOrder()"
                        role="button"
                        class="dropdown-item"
                      >
                        {{ orderData.tableNumber }} #Reserved |
                        {{ orderData.startDate }}, {{ orderData.startTime }}
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
      <div id="svgContainter">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            :height="height"
            id="dine-in-area"
            ref="dine-in-area"
          />
        </div>
      </div>
    </div>
    <!-- Modal confirm -->
    <div class="modal" id="confirmModal" style="display: none; z-index: 1050;">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-body" id="confirmMessage">
            <b>{{ _t('Do you want to cancel this reservation') }} ?</b>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              id="confirm"
              class="btn btn-success"
              data-dismiss="modal"
              @click="confirmReservation()"
            >
              {{ _t('Ok') }}
            </button>
            <button type="button" class="btn btn-danger" data-dismiss="modal">
              {{ _t('Close') }}
            </button>
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
import LookupData from '@/plugins/helpers/LookupData'
import Header from './Header'
import DateTime from '@/mixins/DateTime'

export default {
  name: 'TableDraw',
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState('location', ['timezoneString']),
    ...mapState('dinein', [
      'tablesOnArea',
      'activeArea',
      'orderOnTables',
      'tableStatus',
      'allBookedTables',
      'reservationId',
    ]),
    ...mapGetters('context', ['store']),
  },
  mixins: [DateTime],
  components: {
    Header,
    TableStatus,
  },
  data() {
    return {
      page: null,
      svg: null,
      width: 'auto',
      height: '700px',
      svgWidth: 250,
      svgHeight: 100,
      orderDetails: [],
      selectedTableId: false,
      svgCoordinates: {},
      viewsCoordinates: {},
      addOrSplit: 'Click here to add order',
      order: false,
      selectedReservationId: '',
      componentKey: 0,
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
    getOrderNo(orderId) {
      let order = LookupData.get({
        collection: this.allBookedTables.lookup.orders._id,
        matchWith: orderId,
      })
      let customerName = order && order.customer != null ? order.customer : ''
      return order
        ? order.order_no +
            ' | ' +
            this.convertDatetime(
              order.real_created_datetime,
              this.timezoneString
            ) +
            ' | ' +
            customerName
        : ''
    },
    newOrder() {
      let URL = this.store + '/dine-in/' + this.selectedTableId
      this.$store.dispatch('dinein/addReservation', this.selectedTableId, {
        root: true,
      })
      this.$router.push({ path: URL })
    },
    updateOrder(data) {
      this.$store.commit('dinein/ORDER_RESERVATION_DATA', data.orderData)
      let URL =
        this.store + '/dine-in/' + this.selectedTableId + '/' + data.orderId
      this.$store.dispatch('dinein/getSelectedOrder', data.orderId, {
        root: true,
      })
      this.$store.dispatch('order/updateOrderType', {
        OTview: 'Dine In',
        OTApi: 'dine_in',
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
        .attr('transform', d => {
          let transform
          if (!d.table_position_coordinate.angle) {
            d.table_position_coordinate.angle = 0
          }
          transform = `rotate(${d.table_position_coordinate.angle},${d
            .table_position_coordinate.x + 45},${d.table_position_coordinate.y +
            45})`
          return transform
        })
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

        this.manageViews()
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
      this.drawViews()
    },
    manageViews() {
      let that = this
      this.mainViewCalc()
      d3.select('#dine-in-area > g')
        .append('g')
        .lower()
        .attr('class', 'side-view-left views')
        .attr('fill', 'white')
        .attr('stroke', '#9b9fb8')
        .on('click', (d, i, a) => {
          /*that.clearSelection()*/
          d3.select(a[i])
            .attr('class', ' selected_view side-view-bottom views')
            .attr('stroke', '#b2b5c1')
            .attr('fill', '#b2b5c1')
        })
        .attr('side', 'left_view')
        .append('rect')
        .attr('x', 10)
        .attr('y', 10)
        .attr('width', 60)
        .attr('height', that.svgCoordinates.height - 20)
        .attr('stroke-width', 0.5)
        .attr('stroke-dasharray', '10.5')

      this.mainViewCalc()

      d3.select('#dine-in-area > g')
        .append('g')
        .lower()
        .attr('class', 'side-view-top views')
        .attr('fill', 'white')
        .attr('stroke', '#9b9fb8')
        .on('click', (d, i, a) => {
          /*that.clearSelection()*/
          d3.select(a[i])
            .attr('class', ' selected_view side-view-bottom views')
            .attr('stroke', '#b2b5c1')
            .attr('fill', '#b2b5c1')
        })
        .attr('side', 'top_view')
        .append('rect')
        .attr('x', 90)
        .attr('y', 10)
        .attr('width', that.svgCoordinates.width - 200)
        .attr('height', 60)
        .attr('stroke-width', 0.5)
        .attr('stroke-dasharray', '10.5')

      this.mainViewCalc()

      d3.select('#dine-in-area > g')
        .append('g')
        .lower()
        .attr('class', 'side-view-right views')
        .attr('fill', 'white')
        .attr('stroke', '#9b9fb8')
        .on('click', (d, i, a) => {
          /*that.clearSelection()*/
          d3.select(a[i])
            .attr('class', ' selected_view side-view-bottom views')
            .attr('stroke', '#b2b5c1')
            .attr('fill', '#b2b5c1')
        })
        .attr('side', 'right_view')
        .append('rect')
        .attr('x', that.svgCoordinates.width - 90)
        .attr('y', 10)
        .attr('width', 60)
        .attr('height', that.svgCoordinates.height - 20)
        .attr('stroke-width', 0.5)
        .attr('stroke-dasharray', '10.5')

      this.mainViewCalc()

      d3.select('#dine-in-area > g')
        .append('g')
        .lower()
        .attr('class', 'side-view-bottom views')
        .attr('fill', 'white')
        .attr('stroke', '#9b9fb8')
        .on('click', (d, i, a) => {
          /*that.clearSelection()*/
          d3.select(a[i])
            .attr('class', ' selected_view side-view-bottom views')
            .attr('stroke', '#b2b5c1')
            .attr('fill', '#b2b5c1')
        })
        .attr('side', 'bottom_view')
        .append('rect')
        .attr('x', 90)
        .attr('y', that.svgCoordinates.height - 70)
        .attr('width', that.svgCoordinates.width - 200)
        .attr('height', 60)
        .attr('stroke-width', 0.5)
        .attr('stroke-dasharray', '10.5')

      this.viewsCoordinates.bottom_view = d3
        .select('#dine-in-area > g > .side-view-bottom')
        .node()
        .getBBox()
      this.viewsCoordinates.right_view = d3
        .select('#dine-in-area > g > .side-view-right')
        .node()
        .getBBox()
      this.viewsCoordinates.top_view = d3
        .select('#dine-in-area > g > .side-view-top')
        .node()
        .getBBox()
      this.viewsCoordinates.left_view = d3
        .select('#dine-in-area > g > .side-view-left')
        .node()
        .getBBox()
    },
    confirmReservation() {
      this.reservationUpdateStatus({
        reservationId: this.selectedReservationId,
        status: 'cancelled_reservation',
      })
      this.componentKey += 1
      $('#range')
        .parent('div')
        .hide()
    },
    cancelReservation(id) {
      $('#confirmModal').modal('show')
      this.selectedReservationId = id
    },
    mainViewCalc() {
      this.svgCoordinates = d3
        .select('#svgContainter')
        .node()
        .getBoundingClientRect()
    },
    drawViews() {
      this.activeArea.top_view.forEach((element, i) => {
        d3.select(this.$el)
          .select('#dine-in-area > g')
          .datum(element)
          .append('g')
          .attr('index_id', i)
          .attr('view_type', d => d.name)
          .attr('view_side', 'top_view')
          .attr('class', 'side_view_block')
          .attr('x', function(d) {
            // d.x = that.viewsCoordinates.top_view.x
            return d.x
          })
          .attr('y', function(d) {
            // d.y = that.viewsCoordinates.top_view.y
            return d.y
          })
          .append('image')
          .attr('xlink:href', function(d) {
            // eslint-disable-next-line no-console
            console.log(d.name)
            return `/img/dinein/area-view/${d.name}_view_h.jpg`
            // return `/img/dinein/area-view/city_view_h.jpg`
          })
          .attr('x', function(d) {
            // d.x = that.viewsCoordinates.top_view.x
            return d.x
          })
          .attr('y', function(d) {
            // d.y = that.viewsCoordinates.top_view.y
            return d.y
          })
          .attr('height', d => d.height)
          .attr('width', d => d.width)
          .attr('index_id', i)
          .attr('stroke', d => {
            if (d.name == 'sea') {
              return 'blue'
            }
            if (d.name == 'green') {
              return 'green'
            }
            if (d.name == 'city') {
              return 'yellow'
            }
            if (d.name == 'none') {
              return 'gray'
            }
          })
          .attr('fill', d => {
            if (d.name == 'sea') {
              return 'blue'
            }
            if (d.name == 'green') {
              return 'green'
            }
            if (d.name == 'city') {
              return 'yellow'
            }
            if (d.name == 'none') {
              return 'gray'
            }
          })
          .call(
            d3
              .drag()
              .on('start', d => this.drag_start(d))
              .on('drag', (d, ia, a) =>
                this.drag_view_horizontal_drag(d, ia, a)
              )
              .on('end', this.drag_view_end)
          )
      })
      this.activeArea.right_view.forEach((element, i) => {
        d3.select(this.$el)
          .select('#dine-in-area > g')
          .datum(element)
          .append('g')
          .attr('index_id', i)
          .attr('class', 'side_view_block')
          .attr('view_type', d => d.name)
          .attr('view_side', 'right_view')
          .attr('x', function(d) {
            // d.x = that.viewsCoordinates.right_view.x
            return d.x
          })
          .attr('y', function(d) {
            // d.y = that.viewsCoordinates.right_view.y
            return d.y
          })
          .append('image')
          .attr('xlink:href', function(d) {
            return `/img/dinein/area-view/${d.name}_view_v.jpg`
          })
          .attr('x', function(d) {
            // d.x = that.viewsCoordinates.right_view.x
            return d.x
          })
          .attr('y', function(d) {
            // d.y = that.viewsCoordinates.right_view.y
            return d.y
          })
          .attr('height', d => d.height)
          .attr('width', d => d.width)
          .attr('index_id', i)
          .attr('stroke', d => {
            if (d.name == 'sea') {
              return 'blue'
            }
            if (d.name == 'green') {
              return 'green'
            }
            if (d.name == 'city') {
              return 'yellow'
            }
            if (d.name == 'none') {
              return 'gray'
            }
          })
          .attr('fill', d => {
            if (d.name == 'sea') {
              return 'blue'
            }
            if (d.name == 'green') {
              return 'green'
            }
            if (d.name == 'city') {
              return 'yellow'
            }
            if (d.name == 'none') {
              return 'gray'
            }
          })
          .call(
            d3
              .drag()
              .on('start', d => this.drag_start(d))
              .on('drag', (d, i, a) => this.drag_view_vertical_drag(d, i, a))
              .on('end', this.drag_view_end)
          )
      })
      this.activeArea.bottom_view.forEach((element, i) => {
        d3.select(this.$el)
          .select('#dine-in-area > g')
          .datum(element)
          .append('g')
          .attr('index_id', i)
          .attr('class', 'side_view_block')
          .attr('view_type', d => d.name)
          .attr('view_side', 'bottom_view')

          .attr('x', function(d) {
            // d.x = that.viewsCoordinates.bottom_view.x
            return d.x
          })
          .attr('y', function(d) {
            // d.y = that.viewsCoordinates.bottom_view.y
            return d.y
          })
          .append('image')
          .attr('xlink:href', function(d) {
            return `/img/dinein/area-view/${d.name}_view_h.jpg`
          })
          .attr('x', function(d) {
            // d.x = that.viewsCoordinates.bottom_view.x
            return d.x
          })
          .attr('y', function(d) {
            // d.y = that.viewsCoordinates.bottom_view.y
            return d.y
          })
          .attr('height', d => d.height)
          .attr('width', d => d.width)
          .attr('index_id', i)
          .call(
            d3
              .drag()
              .on('start', d => this.drag_start(d))
              .on('drag', (d, i, a) => this.drag_view_horizontal_drag(d, i, a))
              .on('end', this.drag_view_end)
          )
      })
      this.activeArea.left_view.forEach((element, i) => {
        d3.select(this.$el)
          .select('#dine-in-area > g')
          .datum(element)
          .append('g')
          .attr('index_id', i)
          .attr('class', 'side_view_block')
          .attr('view_type', d => d.name)
          .attr('view_side', 'left_view')
          .attr('x', function(d) {
            // d.x = that.viewsCoordinates.left_view.x
            return d.x
          })
          .attr('y', function(d) {
            // d.y = that.viewsCoordinates.left_view.y
            return d.y
          })
          .append('image')
          .attr('xlink:href', function(d) {
            return `/img/dinein/area-view/${d.name}_view_v.jpg`
          })
          .attr('x', function(d) {
            // d.x = that.viewsCoordinates.left_view.x
            return d.x
          })
          .attr('y', function(d) {
            // d.y = that.viewsCoordinates.left_view.y
            return d.y
          })
          .attr('height', d => d.height)
          .attr('width', d => d.width)
          .attr('index_id', i)

          .attr('stroke', d => {
            if (d.name == 'sea') {
              return 'blue'
            }
            if (d.name == 'green') {
              return 'green'
            }
            if (d.name == 'city') {
              return 'yellow'
            }
            if (d.name == 'none') {
              return 'gray'
            }
          })
          .attr('fill', d => {
            if (d.name == 'sea') {
              return 'blue'
            }
            if (d.name == 'green') {
              return 'green'
            }
            if (d.name == 'city') {
              return 'yellow'
            }
            if (d.name == 'none') {
              return 'gray'
            }
          })
          .call(
            d3
              .drag()
              .on('start', d => this.drag_start(d))
              .on('drag', (d, i, a) => this.drag_view_vertical_drag(d, i, a))
              .on('end', this.drag_view_end)
          )
      })
    },
    showOptions(datum) {
      this.orderDetails = this.orderOnTables.filter(
        order => order.tableId === datum._id
      )
      this.addOrSplit =
        this.orderDetails.length > 0
          ? 'Click here to split table'
          : 'Click here to add order'
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
.modal-dialog {
  max-width: 30%;
}
.table-action {
  position: relative;
}
a.table-popup {
  display: block;
  padding: 2px 25px 1px 12px;
  font-weight: 400;
}
</style>
