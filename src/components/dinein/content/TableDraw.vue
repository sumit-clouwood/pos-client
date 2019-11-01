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
              <div class="tooltip-c-range" id="range" :key="componentKey">
                <div class="display-table-details">
                  <div class="table-header-border-bottom">
                    <h6 class="customer-title align-items-center pl-2 pt-2">
                      {{ _t('Table information') }}
                    </h6>
                  </div>
                  <span
                    class="font-weight-bold close-table-details"
                    @click="hideTableDetails"
                  >
                    X
                  </span>
                </div>
                <div class="m-1 table-order-content" v-if="orderDetails">
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
                          class="text-capitalize dt-items"
                          v-if="allBookedTables.lookup.orders._id"
                        >
                          {{ orderData.tableNumber }}
                          #{{ getOrderNo(orderId) }}
                        </div>
                        <div
                          class="order-details-with-action"
                          v-if="orderStatus(orderId) !== 'finished'"
                        >
                          <div
                            class="table-popup bg-success font-weight-bold"
                            @click="
                              updateOrder({
                                orderId: orderId,
                                orderData: orderData,
                              })
                            "
                          >
                            {{ _t('Update') }}
                            <!--Split Bill-->
                          </div>
                          <div
                            class="cursor-pointer text-danger reservation-cancel btn btn-danger"
                            @click="cancelReservation(orderData.reservationId)"
                          >
                            <span class="dlt-icon">
                              <img src="img/pos/delete-icon-reservation.svg" />
                            </span>
                          </div>
                        </div>
                        <div v-else>
                          <div
                            class="paid-amount-msg text-center font-weight-bold"
                          >
                            <img
                              src="img/dinein/paid-icon.png"
                              style="width:33px"
                            />
                            {{ _t('Paid') }}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-else class="table-action order-details-with-action">
                      <div class="text-capitalize dt-items">
                        {{ orderData.tableNumber }} #R |
                        {{ created_date(orderData.startDate) }},
                        {{ created_time(orderData.startTime) }}
                      </div>
                      <div class="order-details-with-action">
                        <div
                          class="table-popup bg-success font-weight-bold"
                          @click="newOrder(orderData.reservationId, true)"
                        >
                          {{ _t('Add Order') }}
                        </div>
                        <div
                          class="cursor-pointer text-danger reservation-cancel  btn btn-danger"
                          @click="cancelReservation(orderData.reservationId)"
                        >
                          <span class="dlt-icon">
                            <img src="img/pos/delete-icon-reservation.svg" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="table-order-footer">
                  <div class="m-1 buttons">
                    <span
                      data-toggle="modal"
                      data-target="#placeOrder"
                      data-dismiss="modal"
                      class="table-popup popbtn bg-success font-weight-bold"
                    >
                      {{ _t(addOrSplit) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--<div v-else id="svgContainter">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            :height="height"
            id="dine-in-area"
            ref="dine-in-area"
          />
        </div>
      </div>-->
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
            <label><!--{{ _t('Number of guest') }} : --></label>
            <div class="POSItemOptions_quantity_inputs">
              <!-- <input type='button' value='-' class='qtyminus value-qty' field='quantity'/> -->
              <button
                class="qtyminus value-qty"
                @click="updateGuestCount('-')"
                :disabled="this.guests <= 1"
              >
                <i class="fa fa-minus" aria-hidden="true"></i>
              </button>
              <input
                type="number"
                min="1"
                v-model.number="guests"
                @keyup="chairsValidation"
                @change="chairsValidation"
                class="form-control qty"
                name="quantity"
              />
              <!--<input type="text" name="quantity" value="1" min="1" class="qty">-->
              <button class="qtyplus value-qty" @click="updateGuestCount('+')">
                <i class="fa fa-plus" aria-hidden="true"></i>
              </button>
              <!-- <input type='button' value='+' class='qtyplus value-qty' field='quantity'/> -->
            </div>
            <span v-if="validationErrors" class="text-danger">{{
              validationErrors
            }}</span>
          </div>
          <div class="modal-footer">
            <!--<button
              type="button"
              id="placeConfirm"
              class="btn btn-success"
              data-dismiss="modal"
              @click="newOrder(false, true)"
            >
              {{ _t('Place order') }}
            </button>-->
            <button
              type="button"
              id="BookedTable"
              class="btn btn-success"
              data-dismiss="modal"
              @click="newOrder(false, false)"
            >
              {{ _t(addOrSplit) }}
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
      'getAvailableTables',
      'tableZoomScale',
      'dineInTabType',
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
      guests: 1,
      svg: null,
      width: 'auto',
      viewBox: { x: 0, y: 0, width: 1540, height: 910 },
      height: '950px',
      selectedTableD3: '',
      selectedTableData: false,
      svgWidth: 250,
      svgHeight: 100,
      orderDetails: [],
      selectedTableId: false,
      svgCoordinates: {},
      viewsCoordinates: {},
      addOrSplit: 'Book Table',
      cancelReservationMsg: 'Do you want to cancel this reservation?',
      order: false,
      selectedReservationId: '',
      componentKey: 0,
      c: 1,
      moveReservation: false,
      validationErrors: false,
      selectedArea: false,
      zoomLevel: {
        zoomOut: [
          {
            x: 1830 - 100,
            y: 1010 - 100,
            level: 0.7,
          },
          {
            x: 2100 - 100,
            y: 1195 - 100,
            level: 0.6,
          },
          {
            x: 2446 - 100,
            y: 1360 - 100,
            level: 0.5,
          },
          {
            x: 2930 - 100,
            y: 1630 - 100,
            level: 0.4,
          },
          {
            x: 3677 - 100,
            y: 2100 - 100,
            level: 0.4,
          },
        ],
      },
    }
  },
  mounted() {
    // this.updateTableOnArea()
  },
  updated() {
    // eslint-disable-next-line no-console
    console.log(this.selectedArea, this.activeArea._id)
    if (this.selectedArea != this.activeArea._id) {
      this.clearTableArea()
      this.updateTableOnArea()
      this.selectedArea = this.activeArea._id
    }
    /*this.clearTableArea()*/
    /*this.updateTableOnArea()*/
    /*this.setTableProperties()*/
    /*if (this.selectedTableD3)
      d3.select(this.selectedTableD3).attr('class', 'dinein_table active')*/
  },
  methods: {
    ...mapActions('dinein', ['reservationUpdateStatus', 'dineInRunningOrders']),
    /*showActive() {
      // $('#id' + this.selectedTableId).addClass('class', 'dinein_table active')
      d3.select(this.selectedTableD3).attr('class', 'dinein_table active')
    },*/
    chairsValidation() {
      /*if (this.guests > this.selectedTableData.chairs) {
        this.validationErrors =
          'Sorry you cannot add more then ' +
          this.selectedTableData.chairs +
          ' guests on this table'
        this.guests = this.selectedTableData.chairs
      } else */
      if (this.guests < 1) {
        this.validationErrors = 'Minimum 1 guest is required'
        this.guests = 1
      } else {
        this.validationErrors = false
      }
    },
    updateGuestCount(symbol) {
      this.chairsValidation()
      if (!this.validationErrors) {
        if (symbol === '+') {
          this.guests += 1
        } else {
          if (this.guests > 1) this.guests -= 1
        }
      }
    },
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
    orderStatus(orderId) {
      // eslint-disable-next-line no-console
      console.log(this.allBookedTables.lookup.orders._id[orderId])
      return this.allBookedTables.lookup.orders._id[orderId].order_status
    },
    hideTableDetails() {
      $('#range')
        .parent('div')
        .hide()
    },
    newOrder(reservationId, pos) {
      let makeId = '#id_' + this.selectedTableId
      $(makeId)
        .find('g')
        .attr('style', 'opacity:0.5')
      this.$store.commit('dinein/TABLE_SPLIT', false)
      this.$store.commit('dinein/SELECTED_TABLE', this.selectedTableData)
      if (!reservationId) {
        let dis = this
        this.$store.commit('dinein/NUMBER_GUESTS', this.guests)
        this.$store
          .dispatch('dinein/addReservation', this.selectedTableId, {
            root: true,
          })
          .then(() => {
            // eslint-disable-next-line no-console
            console.log('step 1')
            this.$store
              .dispatch('dinein/updateDineInOrderStatus', {
                title: 'all',
                pageId: 'getBookedTables',
                loader: false,
              })
              .then(() => {
                // eslint-disable-next-line no-console
                console.log('step 2')
                dis.$store.dispatch('dinein/getDineInArea', false).then(() => {
                  // eslint-disable-next-line no-console
                  console.log('step 3')
                  dis.$store
                    .dispatch('dinein/getDineInTables', false)
                    .then(() => {
                      // eslint-disable-next-line no-console
                      console.log('step 4')
                      /*this.clearTableArea()
                    this.setTableProperties()*/
                      dis.setTableColour(
                        dis.selectedTableD3,
                        dis.selectedTableData
                      )
                      // this.clearTableArea()
                      /*d3.selectAll('.dinein_table_parent').each(() => {
                        this.drawViews()
                        this.setTableProperties()
                      })*/
                      // this.updateTableOnArea()
                      $(makeId)
                        .find('g')
                        .removeAttr('style')
                    })
                  $('#tooltipdata').hide()
                })
              })
          })
      } else {
        if (pos) {
          let URL = '/dine-in/' + this.store + '/' + this.selectedTableId
          this.$router.push({ path: URL })
        }
        this.$store.commit('dinein/RESERVATION_ID', reservationId)
        this.$store.commit('dinein/NUMBER_GUESTS', false)
      }
    },
    updateOrder(data) {
      this.$store.commit('dinein/SELECTED_TABLE', this.selectedTableData)
      this.$store.commit('dinein/RESERVATION_ID', data.orderData.reservationId)
      this.$store.commit('dinein/NUMBER_GUESTS', false)
      this.$store.commit('dinein/TABLE_SPLIT', true)
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
      d3.selectAll('.dinein_table_parent > *').remove()
    },
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
    },
    updateTableOnArea() {
      let dis = this
      this.page = d3.select(this.$el).select('#dine-in-area')
      this.svg = d3
        .select(this.$el)
        .select('#dine-in-area')
        .append('g')
        .attr('class', 'tables')
        /*.attr('transform', 'translate(10,10)')*/
        .selectAll('.dinein_table')
        .data(this.tablesOnArea)
        .enter() //data from state tables
        .append('g')
        .attr('class', 'dinein_table_parent')
        .attr(
          'transform',
          d3.zoomIdentity.scale(dis.tableZoomScale).translate(0, 0)
        )
        .append('svg')
        .attr('class', 'dinein_table')
        .attr('draggable', 'true')
        .attr('x', function(d) {
          return d.table_position_coordinate.x || 0
        })
        .attr('y', function(d) {
          return d.table_position_coordinate.y || 0
        })
        .attr('table_id', d => d._id)
        .attr('id', d => 'id_' + d._id)
        .attr('table_shape', d => d.table_shape)
        .attr('table_number', d => d.number)
        .attr('chairs', d => d.chairs)
        .html(d => {
          return d3.select(`#dinein_${d.table_shape}_${d.chairs}`).html()
        })
      /*.attr('fill', 'green')*/
      /*if (this.selectedTableD3)
        d3.select(this.selectedTableD3).attr('class', 'dinein_table active')*/
      d3.selectAll('.dinein_table_parent').each(() => {
        this.drawViews()
        this.setTableProperties()
      })
    },
    setTableColour(selectedItem, data) {
      this.$nextTick(() => {
        let dis = this
        d3.select(selectedItem)
          .select('svg>g:last-child')
          .selectAll('path')
          .attr('fill', function() {
            let fc = '#CC3232'
            dis.tableStatus.table.filter(ts => {
              if (ts.id === data._id) {
                if (ts.status.color == '#62bb31') {
                  fc = '#009900'
                } else if (ts.status.color == '#faa03c') {
                  fc = '#fa9304'
                }
              }
            })
            return fc
          })
        d3.select(selectedItem)
          .select('g')
          .selectAll('path')
          .attr('fill', function() {
            let fillcolor = '#FF9C9A'
            dis.tableStatus.table.filter(ts => {
              if (ts.id === data._id) {
                if (ts.status.color == '#62bb31') {
                  fillcolor = '#99CA86'
                } else if (ts.status.color == '#faa03c') {
                  fillcolor = '#FAD580'
                }
              }
            })
            return fillcolor
          })
        d3.select(selectedItem).on('click', function(d, i, a) {
          dis.showOptions(d, i, a)
        })
        let nodeDims = d3
          .select(selectedItem)
          .node()
          .parentNode.getBBox()
        let x = parseFloat(data.table_position_coordinate.x)
        let y = parseFloat(data.table_position_coordinate.y)
        let midX = nodeDims.width / 2 + x
        let midY = nodeDims.height / 2 + y
        d3.select(d3.select(selectedItem).node().parentNode).attr(
          'transform',
          () => {
            // eslint-disable-next-line no-console
            // console.log(data.table_position_coordinate.angle, 'xxxxx')
            /*if (data.table_position_coordinate.angle) {
            data.table_position_coordinate.angle = 0
          }*/
            return `scale(${dis.tableZoomScale}) translate(0, 0) rotate(${
              data.table_position_coordinate.angle
            },${midX},${midY})`
          }
        )
      })
    },
    setTableProperties() {
      d3.selectAll('.dinein_table').each((d, i, a) => {
        d3.select(a[i])
          .select('text')
          .text(`#${d.number}`)
        this.setTableColour(a[i], d)
        /*.attr(
            'transform',
            d3.zoomIdentity.scale(dis.tableZoomScale).translate(0, 0)
          )*/
        // .zoomIdentity.scale(dis.tableZoomScale)
        // .translate(0, 0)
      })
    },
    /*isSupported() {
      let ua = navigator.userAgent.toLowerCase()
      if (ua.indexOf('safari') != -1) {
        if (ua.indexOf('ipad') > -1) {
          return false
        } else if (ua.indexOf('Safari') > -1) {
          return false
        } else if (ua.indexOf('macintosh') > -1 && ua.indexOf('chrome') > -1) {
          return true
        } else if (ua.indexOf('macintosh') > -1) {
          return false
        } else if (ua.indexOf('chrome') > -1) {
          return true
        } else if (ua.indexOf('mozilla') > -1) {
          return false
        } else {
          return false
        }
      } else {
        return false
      }
    },*/
    confirmCancelReservation() {
      let makeId = '#id_' + this.selectedTableId
      $(makeId)
        .find('g')
        .attr('style', 'opacity:0.5')
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
        this.$store
          .dispatch('dinein/updateDineInOrderStatus', {
            title: 'all',
            pageId: 'getBookedTables',
            loader: false,
          })
          .then(() => {
            this.$store.dispatch('dinein/getDineInArea', false).then(() => {
              this.$store.dispatch('dinein/getDineInTables', false).then(() => {
                let dis = this
                setTimeout(function() {
                  dis.setTableColour(dis.selectedTableD3, dis.selectedTableData)
                }, 250)
                // this.clearTableArea()
                // this.updateTableOnArea()
                /*d3.selectAll('.dinein_table_parent').each(() => {
                  this.drawViews()
                  this.setTableProperties()
                })*/
                $(makeId)
                  .find('g')
                  .removeAttr('style')
              })
            })
          })
        $('#tooltipdata').hide()
        // this.updateTableOnArea()
        /*this.clearTableArea()
        this.setTableProperties()*/
      })
      this.componentKey += 1
      $('#range')
        .parent('div')
        .hide()
    },
    cancelReservation(id) {
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
      /*d3.select(d3.select(a[i]).parentNode)
        .selectAll('path')
        .style('stroke', 'green')
        .style('stroke-width', '1')*/

      this.selectedTableData = datum
      this.guests = 1
      this.validationErrors = ''
      this.selectedTableD3 = a[i]
      this.orderDetails = this.orderOnTables.filter(
        order => order.tableId === datum._id
      )
      // let scope = this
      /*setTimeout(function() {
        scope.zoom(0.8, { x: 10, y: 10 })
      }, 500)*/
      /*let transform = { x: 10, y: 10 }
      this.zoom(1, transform)*/
      // eslint-disable-next-line no-console
      // console.log(this.orderDetails)
      this.addOrSplit =
        this.orderDetails.length > 0 ? 'Split Table' : 'Book Table'
      this.selectedTableId = datum._id
      let range = $('#range')
      let top = datum.table_position_coordinate.y + 20 || 0
      // let left = datum.table_position_coordinate.x + 35 || 100
      // $('#id_' + datum._id).click(function(e) {
      let posX = $('#id_' + datum._id).offset().left
      // let posY = $('#id_' + datum._id).offset().top
      /*let tableWidth = $('#id_' + datum._id)
        .find('svg')
        .width()*/
      let getWidth = 361 / 2
      if (this.orderDetails.length === 0) {
        getWidth = 155 / 2
      } else if (this.orderDetails.length > 0) {
        let orderCount = 0
        this.orderDetails.forEach(order => {
          if (order.orderIds.length > 0) {
            orderCount += 1
          }
        })
        if (orderCount > 0) {
          getWidth = 445 / 2
        }
      }
      if (top < 0) top = 0
      let left = posX - getWidth
      if (left < 0) left = 0

      range
        .parent('div')
        .attr(
          'style',
          'top:' +
            top * this.tableZoomScale +
            'px; left:' +
            left +
            'px; display:block'
        )
    },
    drawViews() {
      if (this.activeArea) {
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
                .on('drag', (d, i, a) =>
                  this.drag_view_horizontal_drag(d, i, a)
                )
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
      }
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
.modal .modal-dialog .modal-content .modal-footer {
  display: list-item;
}
</style>
