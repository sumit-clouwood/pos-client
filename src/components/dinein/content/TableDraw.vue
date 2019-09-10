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
                xmlns="http://www.w3.org/2000/svg"
                width="94vw"
                height="100%"
                id="dine-in-area"
                ref="dine-in-area"
                :viewBox="
                  viewBox.x +
                    ' ' +
                    viewBox.y +
                    ' ' +
                    viewBox.width +
                    ' ' +
                    viewBox.height
                "
                preserveAspectRatio="xMidYMid meet"
              ></svg>
            </div>
            <div id="tooltipdata" class="dropdown-content cursor-pointer">
              <div
                class="dropdown tooltip-c-range"
                id="range"
                :key="componentKey"
              >
                <div class="display-table-details">
                  <span
                    data-toggle="modal"
                    data-target="#placeOrder"
                    data-dismiss="modal"
                    class="table-popup bg-success font-weight-bold"
                  >
                    {{ _t('Book Table') }}
                  </span>
                  <span
                    class="font-weight-bold close-table-details"
                    @click="hideTableDetails"
                  >
                    X
                  </span>
                </div>
                <div v-if="orderDetails">
                  <div
                    v-for="orderData in orderDetails"
                    :key="orderData.reservationId"
                  >
                    <div v-if="orderData.orderIds.length">
                      <div
                        class="table-action order-details-with-action"
                        v-for="orderId in orderData.orderIds"
                        :key="orderId"
                      >
                        <div
                          @click="
                            updateOrder({
                              orderId: orderId,
                              orderData: orderData,
                            })
                          "
                          class="dropdown-item text-capitalize"
                          v-if="allBookedTables.lookup.orders._id"
                        >
                          {{ orderData.tableNumber }}
                          #{{ getOrderNo(orderId) }}
                        </div>
                        <div
                          class="table-popup bg-success font-weight-bold"
                          @click="newOrder(orderData.reservationId, false)"
                        >
                          {{ _t(addOrSplit) }}
                        </div>
                        <div
                          class="cursor-pointer text-danger reservation-cancel"
                          @click="cancelReservation(orderData.reservationId)"
                        >
                          <span class="dlt-icon">
                            <img src="img/pos/delete-icon.svg" />
                          </span>
                        </div>
                      </div>
                    </div>
                    <div v-else class="table-action order-details-with-action">
                      <div
                        @click="newOrder(orderData.reservationId, true)"
                        role="button"
                        class="dropdown-item"
                      >
                        {{ orderData.tableNumber }} #Reserved |
                        {{ created_date(orderData.startDate) }},
                        {{ created_time(orderData.startTime) }}
                      </div>
                      <div
                        class="table-popup bg-success font-weight-bold"
                        @click="newOrder(orderData.reservationId, true)"
                      >
                        {{ _t(addOrSplit) }}
                      </div>
                      <div
                        class="cursor-pointer text-danger reservation-cancel"
                        @click="cancelReservation(orderData.reservationId)"
                      >
                        <span class="dlt-icon">
                          <img src="img/pos/delete-icon.svg" />
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
          <div class="modal-header customer-header">
            <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
            <h4 class="customer-title">{{ _t('Confirmation!') }}</h4>
          </div>
          <div class="modal-body font-weight-bold" id="confirmMessage">
            {{ cancelReservationMsg }}
          </div>
          <div class="modal-footer">
            <button
              type="button"
              id="confirm"
              v-if="!moveReservation"
              class="btn btn-success"
              data-dismiss="modal"
              @click="confirmCancelReservation()"
            >
              {{ _t('Ok') }}
            </button>
            <button
              v-if="moveReservation"
              type="button"
              id="running_order"
              class="btn btn-success"
              data-dismiss="modal"
              @click="moveRunningOrder()"
            >
              {{ _t('Running Orders') }}
            </button>
            <button type="button" class="btn btn-danger" data-dismiss="modal">
              {{ _t('Close') }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal" id="placeOrder" style="display: none; z-index: 1050;">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header customer-header">
            <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
            <h5 class="customer-title">
              {{ _t('Please add number of guests.') }}
            </h5>
          </div>
          <div class="modal-body font-weight-bold">
            <!--{{ _t('Please add number of guest') }}-->
            <label>{{ _t('Number of guest') }} : </label>
            <input
              type="text"
              value="0"
              v-model="guests"
              class="form-control"
            />
          </div>
          <div class="modal-footer">
            <button
              type="button"
              id="placeConfirm"
              class="btn btn-success"
              data-dismiss="modal"
              @click="newOrder(false, true)"
            >
              {{ _t('Place order') }}
            </button>
            <button
              type="button"
              id="BookedTable"
              class="btn btn-success"
              data-dismiss="modal"
              @click="newOrder(false, false)"
            >
              {{ _t('Book Table') }}
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
// import LookupData from '@/plugins/helpers/LookupData'
import Header from './Header'
import DateTime from '@/mixins/DateTime'
// import Status from '../../mobileComponents/mobileElements/status'

export default {
  name: 'TableDraw',
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState('location', ['timezoneString']),
    ...mapState('dinein', [
      'tablesOnArea',
      'activeArea',
      'areas',
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
      guests: 0,
      svg: null,
      width: 'auto',
      viewBox: { x: 0, y: 0, width: 1560, height: 950 },
      height: '950px',
      selectedTableD3: '',
      svgWidth: 250,
      svgHeight: 100,
      orderDetails: [],
      selectedTableId: false,
      svgCoordinates: {},
      viewsCoordinates: {},
      addOrSplit: 'Book Table',
      cancelReservationMsg: 'Do you want to cancel this reservation?',
      order: false,
      selectedAreaObj: '',
      selectedReservationId: '',
      componentKey: 0,
      moveReservation: false,
    }
  },
  mounted() {
    this.updateTableOnArea()
  },
  updated() {
    this.clearTableArea()
    this.updateTableOnArea()
    /*if (this.selectedTableD3)
      d3.select(this.selectedTableD3).attr('class', 'dinein_table active')*/
  },
  methods: {
    ...mapActions('dinein', ['reservationUpdateStatus', 'dineInRunningOrders']),
    /*showActive() {
      // $('#id' + this.selectedTableId).addClass('class', 'dinein_table active')
      d3.select(this.selectedTableD3).attr('class', 'dinein_table active')
    },*/
    created_time(time) {
      return this.convertDatetime(time, this.timezoneString, 'h:mm:ss')
      // return this.current_time.format('h:mm A')
    },
    created_date(date) {
      return this.convertDatetime(date, this.timezoneString, 'Do MMMM YYYY')
      // return this.current_time.format('Do MMMM YYYY')
    },
    getOrderNo(orderId) {
      let order = this.allBookedTables.lookup.orders._id[orderId]
      // let customerName = order && order.customer != null ? order.customer : ''
      return order
        ? order.order_no +
            ' | ' +
            this.created_date(order.real_created_datetime) +
            ', ' +
            this.created_time(order.real_created_datetime)
        : ''
    },
    hideTableDetails() {
      $('#range')
        .parent('div')
        .hide()
    },
    newOrder(reservationId, pos) {
      let URL = '/dine-in/' + this.store + '/' + this.selectedTableId
      this.$store.commit('dinein/NUMBER_GUESTS', this.guests)
      if (!reservationId) {
        this.$store.dispatch('dinein/addReservation', this.selectedTableId, {
          root: true,
        })
      } else {
        this.$store.commit('dinein/RESERVATION_ID', reservationId)
      }
      if (pos) this.$router.push({ path: URL })
      if (!reservationId) {
        this.$store.dispatch('dinein/updateDineInOrderStatus', {
          title: 'all',
          pageId: 'getBookedTables',
          loader: false,
        })
        this.$store.dispatch('dinein/getDineInArea', false)
      }
    },
    updateOrder(data) {
      this.$store.commit('dinein/RESERVATION_ID', data.orderData.reservationId)
      let URL =
        '/dine-in/' +
        this.store +
        '/' +
        this.selectedTableId +
        '/' +
        data.orderId
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
    updateDineInOrderStatus: function(orderStatus) {
      this.$store.dispatch('dinein/updateDineInOrderStatus', orderStatus)
    },
    moveRunningOrder: function() {
      this.$store.commit('dinein/SET_PAGE_NO', 1)
      this.moveReservation = false
      let runningOrder = {
        title: 'running',
        pageId: 'dineInRunningOrders',
        dataRelated: 'running-orders-show',
      }
      this.updateDineInOrderStatus(runningOrder)
      // this.$store.commit('dinein/DINE_IN_TAB_TYPE', runningOrder.title)
      // this.$store.commit('dinein/LOADING', true)
      // this.$store.dispatch(runningOrder.pageId)
      // // it is temporary code we will update it later.
      // let id = runningOrder.dataRelated
      // $('div#dm-content-wrapper div.container-fluid').each(function() {
      //   $(this)
      //     .removeClass('active')
      //     .hide()
      //   if ($(this).attr('id') === id) {
      //     $(this)
      //       .addClass('active')
      //       .css('display', 'grid')
      //   }
      // })
      // this.$store.commit('dinein/LOADING', false)
    },
    updateTableOnArea() {
      let dis = this
      let svgWidth = []
      this.page = d3.select(this.$el).select('#dine-in-area')
      this.svg = d3
        .select(this.$el)
        .select('#dine-in-area')
        .append('g')
        .attr('class', 'tables')
        .attr('transform', 'translate(10,10)')
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
        .on('click', function(d, i, a) {
          dis.showOptions(d, i, a)
        })
        .attr('fill', 'green')
      if (this.selectedTableD3)
        d3.select(this.selectedTableD3).attr('class', 'dinein_table active')
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

        // this.manageViews()
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
          .on('click', function(d, i, a) {
            dis.showOptions(d, i, a)
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
    confirmCancelReservation() {
      this.reservationUpdateStatus({
        reservationId: this.selectedReservationId,
        status: 'cancelled_reservation',
      }).then(response => {
        if (response.status === 'form_errors') {
          this.moveReservation = true
          if (this.moveReservation) {
            this.cancelReservationMsg = response.form_errors.status[0]
            $('#confirmModal').modal('show')
            return false
          }
        }
        this.$store.dispatch('dinein/updateDineInOrderStatus', {
          title: 'all',
          pageId: 'getBookedTables',
          loader: false,
        })
        this.$store.dispatch('dinein/getDineInArea', false)
      })
      this.componentKey += 1
      $('#range')
        .parent('div')
        .hide()
    },
    cancelReservation(id) {
      // // eslint-disable-next-line no-console
      // console.log(id, '==>', this.lastActiveArea, 'Rajeev')
      this.cancelReservationMsg = 'Do you want to cancel this reservation?'
      this.moveReservation = false
      $('#confirmModal').modal('show')
      this.selectedReservationId = id
    },
    mainViewCalc() {
      this.svgCoordinates = d3
        .select('#svgContainter')
        .node()
        .getBoundingClientRect()
    },
    showOptions(datum, i, a) {
      // eslint-disable-next-line no-console
      // console.log(a[i])
      this.selectedTableD3 = a[i]
      this.orderDetails = this.orderOnTables.filter(
        order => order.tableId === datum._id
      )
      this.addOrSplit =
        this.orderDetails.length > 0 ? 'Split Bill' : 'Book Table'
      this.selectedTableId = datum._id
      let range = $('#range')
      range
        .parent('div')
        .attr(
          'style',
          'top:' +
            (datum.table_position_coordinate.y + 20 || 0) +
            'px; left:' +
            (datum.table_position_coordinate.x + 35 || 100) +
            'px; display:block'
        )
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
          .attr('preserveAspectRatio', 'none')
          .attr('xlink:href', function(d) {
            return `img/dinein/area-view/${d.name}_view_h.jpg`
            // return `img/dinein/area-view/city_view_h.jpg`
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
          .attr('preserveAspectRatio', 'none')
          .attr('xlink:href', function(d) {
            return `img/dinein/area-view/${d.name}_view_v.jpg`
          })
          .attr('x', function(d) {
            // d.x = that.viewsCoordinates.right_view.x
            return parseInt(d.x)
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
          .attr('preserveAspectRatio', 'none')
          .attr('xlink:href', function(d) {
            return `img/dinein/area-view/${d.name}_view_h.jpg`
          })
          .attr('x', function(d) {
            // d.x = that.viewsCoordinates.bottom_view.x
            return d.x
          })
          .attr('y', function(d) {
            // d.y = that.viewsCoordinates.bottom_view.y
            return parseInt(d.y)
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
          .attr('preserveAspectRatio', 'none')
          .attr('xlink:href', function(d) {
            return `img/dinein/area-view/${d.name}_view_v.jpg`
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
  },
}
</script>
<style scoped>
.display-table-details {
  display: grid;
  grid-template-columns: 3fr auto;
  /*align-items: center;*/
  align-content: center;
}
a.table-popup.bg-success.font-weight-bold {
  margin: 1px;
  box-shadow: 0 0px 0.1875rem rgba(23, 23, 32, 0.05),
    0 0px 0.625rem rgba(23, 23, 32, 0.05), 0 0px 1.25rem rgba(23, 23, 32, 0.05);
}
.close-table-details {
  background: #cc3232;
  color: #fff;
  margin: 1px;
}
.order-details-with-action {
  display: grid;
  grid-template-columns: 3fr 1fr auto;
}
div#tooltipdata
  .table-action.order-details-with-action
  .cursor-pointer.text-danger.reservation-cancel {
  position: static;
  margin: 1px;
  border-bottom: 1px solid rgba(204, 50, 50, 0.5);
}
.modal .modal-dialog .modal-content .modal-footer {
  display: unset;
}
</style>
