<template>
  <div class="dine-in-tabel-wrapper">
    <Header />
    <div class="inner-dinein-table">
      <TableStatus />
      <div class="sitting-dinein-table ui-droppable" id="sitting-dinein-table">
        <div class="sitting-dine-wrap disable-sorting" v-if="tablesOnArea">
          <AllTables :viewBox="viewBox" />
          <div
            class="modal fade"
            id="tooltipdata"
            tabindex="-1"
            role="dialog"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLabel">
                    {{ _t('Table information') }}
                  </h5>
                  <button
                    type="button"
                    class="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <div
                    class="m-1 table-order-content"
                    v-if="orderDetails.length"
                  >
                    <div
                      class="table-order"
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
                            class=""
                            v-if="orderStatus(orderId) !== 'finished'"
                          >
                            <button
                              class="btn bg-success table-popup font-weight-bold"
                              @click="
                                updateOrder({
                                  orderId: orderId,
                                  orderData: orderData,
                                })
                              "
                            >
                              {{ _t('Update') }}
                              <!--Split Bill-->
                            </button>
                            <button
                              class="btn bg-danger table-popup font-weight-bold"
                              @click="
                                cancelReservation(orderData.reservationId)
                              "
                            >
                              <span class="dlt-icon">
                                <img
                                  src="https://d3jjfdwi6rnqlf.cloudfront.net/img/pos/delete-icon-reservation.svg"
                                />
                              </span>
                            </button>
                          </div>
                          <div v-else>
                            <div
                              class="paid-amount-msg text-center font-weight-bold"
                            >
                              <img
                                src="https://d3jjfdwi6rnqlf.cloudfront.net/img/dinein/paid-icon.png"
                                style="width:33px"
                              />
                              {{ _t('Paid') }}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        v-else
                        class="table-action order-details-with-action"
                      >
                        <div class="text-capitalize dt-items">
                          {{ orderData.tableNumber }} #{{ _t('Reserved') }} |
                          {{ created_date(orderData.startDate) }},
                          {{ created_time(orderData.startTime) }}
                        </div>
                        <div class="table-draw-order-details">
                          <button
                            class="btn bg-success table-popup font-weight-bold"
                            @click="newOrder(orderData.reservationId, true)"
                          >
                            {{ _t('Add Order') }}
                          </button>
                          <button
                            class="btn bg-danger table-popup font-weight-bold"
                            @click="cancelReservation(orderData.reservationId)"
                          >
                            <span class="dlt-icon">
                              <img
                                src="https://d3jjfdwi6rnqlf.cloudfront.net/img/pos/delete-icon-reservation.svg"
                              />
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="m-1 table-order-content" v-else>
                    <div class="">
                      {{ _t('Table is not reserved yet') }}
                    </div>
                  </div>
                </div>
                <div class="modal-footer">
                  <div
                    v-if="brand && brand.number_of_guests"
                    class="table-order-footer"
                  >
                    <button
                      data-toggle="modal"
                      data-target="#placeOrder"
                      type="button"
                      class="btn bg-success table-popup font-weight-bold"
                      data-dismiss="modal"
                      @click="closeMyself"
                    >
                      {{ _t(addOrSplit) }}
                    </button>
                    <switch-waiter v-if="orderDetails.length"></switch-waiter>
                  </div>
                  <div class="table-order-footer" v-else>
                    <div class="m-1 buttons">
                      <button
                        data-toggle="modal"
                        type="button"
                        class="btn bg-success table-popup font-weight-bold"
                        data-dismiss="modal"
                        @click="newOrder(false, brand.book_table)"
                      >
                        {{ _t(addOrSplit) }}
                      </button>
                      <switch-waiter v-if="orderDetails.length"></switch-waiter>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!--<div id="tooltipdata1" class="dropdown-content cursor-pointer">
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
            </div>
          </div>-->
        </div>
      </div>
    </div>
    <!-- Modal confirm -->
    <div class="modal" id="confirmModal" style="display: none; z-index: 1050;">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header customer-header">
            <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
            <h4 class="customer-title">{{ _t('Confirmation!') }}</h4>
          </div>
          <div class="modal-body font-weight-bold" id="confirmMessage">
            {{ cancelReservationMsg }}
          </div>
          <div class="modal-footer">
            <div class="btn-announce">
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
    </div>
    <div class="modal" id="placeOrder" style="display: none; z-index: 1050;">
      <div class="modal-dialog modal-dialog-centered">
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
                class="form-control qty tdraw"
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
            <div class="btn-announce">
              <button
                type="button"
                id="BookedTable"
                class="btn btn-success"
                data-dismiss="modal"
                @click="newOrder(false, brand.book_table)"
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
    <div class="modal" id="orderLock" style="display: none; z-index: 1050;">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header customer-header">
            <h5 class="customer-title">
              {{ _t('Order already open') }}
            </h5>
          </div>
          <div class="modal-body font-weight-bold text-center">
            <span>
              {{
                _t(
                  'Order is already open by someone, you can not open it until you unlock or closed by other user.'
                )
              }}
            </span>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-success" @click="unlockOrder">
              {{ _t(unlock) }}
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
/* global $ showModal hideModal */
/* eslint-disable no-console */

import { mapGetters, mapState, mapActions } from 'vuex'
import * as d3 from 'd3'
import TableStatus from './TableStatus'
import AllTables from './AllTables'
import switchWaiter from './buttons/switchWaiter'

// import LookupData from '@/plugins/helpers/LookupData'
import Header from './Header'
import DateTime from '@/mixins/DateTime'
// import Status from '../../mobileComponents/mobileElements/status'
import * as PERMS from '@/const/permissions'
import OrderHelper from '@/plugins/helpers/Order'
import moment from 'moment-timezone'

export default {
  name: 'TableDraw',
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapGetters('dinein', ['getTableEmptyTime']),
    ...mapState('location', ['timezoneString', 'brand']),
    ...mapState('auth', ['userDetails']),
    ...mapState('dinein', [
      'tablesOnArea',
      'activeArea',
      'statusFlag',
      'areas',
      'orderOnTables',
      'tableStatus',
      'allBookedTables',
      'reservationId',
      'getAvailableTables',
      'tableZoomScale',
      'dineInTabType',
      'updateTableArea',
    ]),
    ...mapGetters('context', ['store']),
    ...mapGetters('auth', ['allowed']),
  },
  mixins: [DateTime],
  components: {
    Header,
    TableStatus,
    AllTables,
    switchWaiter,
  },
  data() {
    return {
      cssClass: 'restricted',
      page: null,
      popupItemLoader: false,
      tableTextTransform: true,
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
      deletion: false,
      selectedReservationId: '',
      componentKey: 0,
      moveReservation: false,
      validationErrors: false,
      selectedArea: false,
      bookedEmptyTables: [],
      selectedOrderId: undefined,
      unlock: 'Unlock',
    }
  },
  updated() {
    this.mountAction()
  },
  mounted() {
    this.mountAction()
    this.tableTextTransform = window.PrintHandle ? false : true
    let scope = this
    setInterval(() => {
      scope.$store.dispatch('dinein/getTableStatus')
    }, 1000 * 60)
  },
  watch: {
    updateTableArea: function(newValue, oldValue) {
      if (newValue !== oldValue && this.selectedTableData) {
        this.setTableColour(this.selectedTableD3, this.selectedTableData)
        // this.cssClass = 'rest'
        // this.popupItemLoader = false
      }
    },
  },
  methods: {
    mountAction() {
      if (this.selectedArea != this.activeArea._id) {
        this.clearTableArea()
        this.updateTableOnArea()
        this.selectedArea = this.activeArea._id
      }
    },
    ...mapActions('dinein', ['reservationUpdateStatus', 'dineInRunningOrders']),
    closeMyself() {
      // $('#tooltipdata').hide()
      hideModal('#tooltipdata')
    },
    /*addZero(x, n) {
      while (x.toString().length < n) {
        x = '0' + x
      }
      return x
    },*/

    getUTCCurrentTime() {
      let d = new Date()
      let h = d.getUTCHours()
      let m = d.getUTCMinutes()
      let s = d.getUTCSeconds()
      return h + ':' + m + ':' + s
    },
    timeConvert(time, separator = ':') {
      if (time) {
        let timeSplit = time.split(separator)
        return parseInt(timeSplit[0]) * 60 + parseInt(timeSplit[1])
      }
      return 0
    },
    chairsValidation() {
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
    },
    created_date(date) {
      return moment(date).format('Do MMMM, YYYY')
    },
    getOrderNo(orderId) {
      let order = this.allBookedTables.lookup.orders._id[orderId]
      return order
        ? order.order_no +
            ' | ' +
            this.created_date(order.real_created_datetime) +
            ', ' +
            this.created_time(order.real_created_datetime)
        : ''
    },
    orderStatus(orderId) {
      return this.allBookedTables.lookup.orders._id[orderId].order_status
    },
    hideTableDetails() {
      $('#range')
        .parent('div')
        .hide()
    },
    ...mapActions('location', ['getUIMenu']),
    newOrder(reservationId, pos) {
      this.$store.commit(
        'dinein/SELECTED_TABLE_RESERVATION',
        this.selectedTableData.number
      )
      // this.getUIMenu() // disable it for optimization
      let makeId = '#id_' + this.selectedTableId
      $(makeId)
        .find('svg')
        .attr('style', 'opacity:0.3')

      this.$store.commit('dinein/TABLE_SPLIT', false)
      this.$store.commit('dinein/SELECTED_TABLE', this.selectedTableData)
      if (!reservationId) {
        // let dis = this
        this.$store.commit('dinein/NUMBER_GUESTS', this.guests)
        this.$store
          .dispatch('dinein/addReservation', this.selectedTableId, {
            root: true,
          })
          .then(() => {
            if (!pos) {
              let URL = this.$route.path + '/' + this.selectedTableId
              this.$router.push({ path: URL })
            }
            // $('#tooltipdata').hide()
            hideModal('#tooltipdata')
          })
      } else {
        if (pos) {
          let URL = this.$route.path + '/' + this.selectedTableId
          this.$router.push({ path: URL })
        }
        this.$store.commit('dinein/RESERVATION_ID', reservationId)
        this.$store.commit('dinein/NUMBER_GUESTS', false)
      }
    },
    unlockOrder() {
      this.unlock = 'Wait'
      this.$store
        .dispatch(
          'order/lockUnlockOrder',
          {
            orderId: this.selectedOrderId,
            status: { order_lock: false },
          },
          {
            root: true,
          }
        )
        .then(() => {
          hideModal('#orderLock')
          this.unlock = 'Unlock'
        })
    },
    updateOrder(data) {
      let is_order_lock = false
      if (this.allBookedTables.lookup.orders._id) {
        is_order_lock = this.allBookedTables.lookup.orders._id[data.orderId]
          .order_lock
      }
      if (is_order_lock) {
        this.selectedOrderId = data.orderId
        showModal('#orderLock')
        return true
      } else {
        this.$store.dispatch(
          'order/lockUnlockOrder',
          { orderId: data.orderId, status: { order_lock: true } },
          {
            root: true,
          }
        )
      }
      this.$store.commit('dinein/SELECTED_TABLE', this.selectedTableData)
      this.$store.commit(
        'dinein/SELECTED_TABLE_RESERVATION',
        data.orderData.tableNumber
      )
      this.$store.commit('dinein/RESERVATION_ID', data.orderData.reservationId)
      this.$store.commit('dinein/NUMBER_GUESTS', false)
      this.$store.commit('dinein/TABLE_SPLIT', true)
      let URL =
        this.$route.path + '/' + this.selectedTableId + '/' + data.orderId
      this.$store.commit('order/ORDER_SOURCE', 'dinein')
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
      d3.selectAll('.tables').remove()
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
        .data(this.tablesOnArea) /* d = this.tablesOnArea */
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
      this.setTableProperties()
      this.drawViews()
      // eslint-disable-next-line no-console
      //console.log('f')
      // d3.selectAll('.dinein_table_parent').each(() => {})
    },
    setTableColour(selectedItem, data) {
      let dis = this
      this.$nextTick(() => {
        d3.select(selectedItem)
          .select('g')
          .selectAll('path:nth-of-type(2)')
          .attr('fill', '#FFF')

        d3.select(selectedItem)
          .select('svg')
          .selectAll('path:nth-last-of-type(1)')
          .attr('fill', function() {
            let fillcolor = dis.tableStatus.table.find(ts => ts.id === data._id)
            /*let colourTable = '#FF9C9A'
                            if (fillcolor.status.color == '#62bb31') {
                              colourTable = '#99CA86'
                            } else if (fillcolor.status.color == '#faa03c') {
                              colourTable = '#FAD580'
                            }*/
            if (fillcolor) return fillcolor.status.color
            return '#99ca86'
          })
        d3.select(selectedItem)
          .select('svg>g:last-child')
          .selectAll('path')
          .attr('fill', function() {
            let fc = dis.tableStatus.table.find(ts => ts.id === data._id)
            /*let colourChairs = '#CC3232'
                            if (fc.id === data._id) {
                              if (fc.status.color == '#62bb31') {
                                colourChairs = '#009900'
                              } else if (fc.status.color == '#faa03c') {
                                colourChairs = '#fa9304'
                              }
                            }*/
            if (fc) return fc.status.color
            return '#99ca86'
          })
        let makeId = '#id_' + dis.selectedTableId
        $(makeId)
          .find('svg')
          .removeAttr('style')
      })
    },
    setTextRotate(table, angle) {
      // let angleX = parseInt(table.table_position_coordinate.angle)
      // angleX = angleX > 360 || angleX < -360 ? 360 : angleX
      // let angle = angleX < 0 ? angleX + 360 : angleX
      let transform = {}
      if (!this.tableTextTransform) {
        return { transformOrigin: ';', transformRotate: '' }
      }
      let chairs = parseInt(table.chairs)
      if (angle == 270) {
        if (table.table_shape === 'rectangle') {
          if (chairs > 5) {
            transform = {
              transformOrigin: '19% 63%;',
              transformRotate: '90deg',
            }
          } else {
            transform = {
              transformOrigin: '18% 47%;',
              transformRotate: '90deg',
            }
          }
        }
        if (table.table_shape === 'square') {
          transform = {
            transformOrigin: '9% 35%;',
            transformRotate: '90deg',
          }
        }
        if (table.table_shape === 'circle') {
          transform = {
            transformOrigin: '10% 29%;',
            transformRotate: '90deg',
          }
        }
        return transform
      }
      let transformRotate = (angle > 0 ? 270 - angle : angle + 270) + 'deg'
      //eslint-disable-next-line no-console
      // console.log(table, angle, transformRotate, angleX)
      /* angle - 270 will get transformRotate in deg only we need set 315 to 315*/

      if (angle == 0 || angle == 360) {
        transform = {
          transformOrigin: '69% 8%;',
          transformRotate: transformRotate,
        }
        if (table.table_shape === 'circle') {
          transform = {
            transformOrigin: '75% 5%;',
            transformRotate: transformRotate,
          }
        }
        if (table.table_shape === 'rectangle') {
          if (chairs > 6) {
            transform = {
              transformOrigin: '48% -24%;',
              transformRotate: transformRotate,
            }
          } else {
            transform = {
              transformOrigin: '55% -6%;',
              transformRotate: transformRotate,
            }
          }
        }
      }
      if (angle == 45) {
        transform = {
          transformOrigin: '55% 10%;',
          transformRotate: transformRotate,
        }
        if (table.table_shape === 'rectangle') {
          if (chairs > 6) {
            transform = {
              transformOrigin: '40% 0%;',
              transformRotate: transformRotate,
            }
          } else {
            transform = {
              transformOrigin: '44% 5%;',
              transformRotate: transformRotate,
            }
          }
        }
        if (table.table_shape === 'square') {
          transform = {
            transformOrigin: '52% 16%;',
            transformRotate: transformRotate,
          }
        }
      }
      if (angle == 90) {
        transform = {
          transformOrigin: '38% 20%;',
          transformRotate: transformRotate,
        }
        if (table.table_shape === 'circle') {
          transform = {
            transformOrigin: '42% 15%;',
            transformRotate: transformRotate,
          }
        }
        if (table.table_shape === 'rectangle') {
          transform = {
            transformOrigin: '33% 17%;',
            transformRotate: transformRotate,
          }
        }
      }
      if (angle == 135) {
        transform = {
          transformOrigin: '27% 24%;',
          transformRotate: transformRotate,
        }
        if (table.table_shape === 'circle') {
          transform = {
            transformOrigin: '28% 20%;',
            transformRotate: transformRotate,
          }
        }
        if (table.table_shape === 'rectangle') {
          if (chairs > 6) {
            transform = {
              transformOrigin: '27% 32%;',
              transformRotate: transformRotate,
            }
          } else {
            transform = {
              transformOrigin: '28% 27%;',
              transformRotate: transformRotate,
            }
          }
        }
      }
      if (angle == 180 || angle == -180) {
        transform = {
          transformOrigin: '9% 32%;',
          transformRotate: transformRotate,
        }
        if (table.table_shape === 'circle') {
          transform = {
            transformOrigin: '9% 23%;',
            transformRotate: transformRotate,
          }
        }
        if (table.table_shape === 'rectangle') {
          if (chairs > 6) {
            transform = {
              transformOrigin: '17% 56%;',
              transformRotate: transformRotate,
            }
          } else {
            transform = {
              transformOrigin: '15% 39%;',
              transformRotate: transformRotate,
            }
          }
        }
      }
      if (angle == 225) {
        transform = {
          transformOrigin: '-38% 35%;',
          transformRotate: transformRotate,
        }
        if (table.table_shape === 'square') {
          transform = {
            transformOrigin: '-33% 46%;',
            transformRotate: transformRotate,
          }
        }
        if (table.table_shape === 'rectangle') {
          if (chairs > 6) {
            transform = {
              transformOrigin: '-5% 106%;',
              transformRotate: transformRotate,
            }
          } else {
            transform = {
              transformOrigin: '-15% 75%;',
              transformRotate: transformRotate,
            }
          }
        }
      }
      if (angle == 315) {
        transform = { transformOrigin: '85% -35%;', transformRotate: '315deg' }
        if (chairs > 6 && table.table_shape === 'rectangle') {
          transform = {
            transformOrigin: '67% -77%;',
            transformRotate: '315deg',
          }
        }
        if (table.table_shape === 'circle') {
          transform = {
            transformOrigin: '120% -5%;',
            transformRotate: '315deg',
          }
        }
        if (table.table_shape === 'square') {
          transform = {
            transformOrigin: '114% -8%;',
            transformRotate: '315deg',
          }
        }
      }
      if (table.table_shape === 'circle' && angle == -45) {
        transform = {
          transformOrigin: '120% -10%;',
          transformRotate: '315deg',
        }
      }

      return transform
      // data.table_position_coordinate.angle
    },
    setTableProperties() {
      let dis = this
      let user_agent = this.$store.state.auth.deviceType.userAgent
      // let user_agent =
      //   'mozilla/5.0 (windows nt 6.1; wow64)applewebkit/537.36 (khtml, like gecko) chrome/47.0.2526.80 safari/537.36 dimspos.app 1.0.0.0'
      let checkIpad = user_agent.search('ipad')
      let checkWindowsApp = user_agent.search('dimspos.app')
      if (checkIpad < 0) {
        checkIpad = user_agent.search('macintosh')
      }
      this.tableTextTransform = checkIpad < 0 ? true : false
      if (checkWindowsApp > 0) {
        this.tableTextTransform = false
      }
      d3.selectAll('.dinein_table').each((d, i, a) => {
        let data = d
        let angleX = parseInt(data.table_position_coordinate.angle)
        // angleX = angleX > 360 || angleX < -360 ? 360 : angleX
        let angle = angleX < 0 ? angleX + 360 : angleX
        let transform = dis.setTextRotate(data, angle)
        let writingMode =
          angle == 270 || !dis.tableTextTransform ? '' : 'vertical-lr'
        d3.select(a[i])
          .select('text')
          .text(`${d.number}`)
          .attr(
            'style',
            'font-weight:bold; cursor: default; writing-mode:' +
              writingMode +
              '; transform-origin: ' +
              transform.transformOrigin +
              'transform: rotate(' +
              transform.transformRotate +
              ')'
          )
        // .attr('fill', '#fff')

        this.setTableColour(a[i], data)
        d3.select(a[i]).on('click', function(data, index, all) {
          dis.showOptions(data, index, all)
        })
        let nodeDims = d3
          .select(a[i])
          .node()
          .parentNode.getBBox()
        let x = parseFloat(data.table_position_coordinate.x)
        let y = parseFloat(data.table_position_coordinate.y)
        let midX = nodeDims.width / 2 + x
        let midY = nodeDims.height / 2 + y
        d3.select(d3.select(a[i]).node().parentNode).attr('transform', () => {
          return `scale(${dis.tableZoomScale}) translate(0, 0) rotate(${data.table_position_coordinate.angle},${midX},${midY})`
        })
      })
    },
    confirmCancelReservation() {
      let makeId = '#id_' + this.selectedTableId
      $(makeId)
        .find('svg')
        .attr('style', 'opacity:0.3')
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
        // $('#tooltipdata').hide()
        hideModal('#tooltipdata')
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
    showOptions(datum, index, all) {
      this.$store
        .dispatch('dinein/getBookedTablesOnClick', false, { root: true })
        .then(() => {
          // $('#tooltipdata').hide()
          hideModal('#tooltipdata')
          this.cssClass = 'restricted'
          this.popupItemLoader = false
          this.selectedTableData = datum
          this.guests = 1
          this.validationErrors = ''
          this.selectedTableD3 = all[index]
          this.selectedTableId = datum._id
          //console.log('table id', datum._id)
          this.orderDetails = this.orderOnTables.filter(
            order => order.tableId === datum._id
          )
          // console.log('order on all tables', this.orderOnTables)
          // console.log('order details for table', this.orderDetails)
          // console.log(datum, index, all, all[index])

          this.setTableColour(all[index], datum)
          this.$store.commit(
            'dinein/CURRENT_TABLE_RESERVATION',
            this.orderDetails
          )

          // alert(!this.$store.getters['auth/allowed'](PERMS.SEE_OTHERS_ORDERS))
          // alert(
          //   !OrderHelper.assignedToUser(
          //     this.orderDetails,
          //     this.userDetails.item._id
          //   )
          // )
          if (!this.$store.getters['auth/allowed'](PERMS.SEE_OTHERS_ORDERS)) {
            //check if own order
            if (
              OrderHelper.assignedToUser(
                this.orderDetails,
                this.userDetails.item._id
              )
            ) {
              this.popupItemLoader = true
              this.cssClass = 'allowed'
            } else {
              this.popupItemLoader = false
              this.cssClass = 'restricted'
              // $('#tooltipdata').hide()
              hideModal('#tooltipdata')
            }
          } else {
            this.popupItemLoader = true
            this.cssClass = 'allowed'
          }
          // alert(this.popupItemLoader + ' >> ' + this.cssClass)
          if (this.cssClass == 'restricted') return false
          // $('#tooltipdata').hide()
          // $('#tooltipdata').show()
          // console.log('orderDetails', this.orderDetails)
          // if (!this.brand.number_of_guests || this.orderDetails.length > 0) {
          showModal('#tooltipdata')
          // }
          // console.log(
          //   'order details for table',
          //   this.orderDetails,
          //   this.orderDetails.length
          // )

          this.addOrSplit =
            this.orderDetails.length > 0 ? 'Split Table' : 'Book Table'
          if (
            (this.brand && this.brand.book_table) ||
            this.orderDetails.length
          ) {
            // let bookPlace = this.brand.book_table ? 'Place Order' : 'Book Table'
            let range = $('#range')
            let top = datum.table_position_coordinate.y + 20 || 0
            let posX = $('#id_' + datum._id).offset().left
            let tableX = $('#id_' + datum._id).attr('x')
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
              //console.log('order count', orderCount)
            }
            let left = posX - getWidth

            let resolution = window.screen
            if (
              resolution.availHeight <= 768 &&
              resolution.availWidth <= 1024
            ) {
              /*start square screen code*/
              let posY = $('#id_' + datum._id).offset().top
              top -= posY
              /*end square screen code*/
            }
            if (tableX > 3000) left -= 80
            // alert(window.screen.availHeight + ' > ' + window.screen.availWidth)
            if (top < 0) top = 0
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
          } else {
            this.closeMyself()
            if (this.brand && this.brand.number_of_guests) {
              $('#placeOrder').modal('show')
            } else {
              this.newOrder(false, this.brand && this.brand.book_table)
            }
          }
        })
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
              return `https://d3jjfdwi6rnqlf.cloudfront.net/img/dinein/area-view/${d.name}_view_h.jpg`
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
          /*.call(
                d3
                  .drag()
                  .on('start', d => this.drag_start(d))
                  .on('drag', (d, ia, a) =>
                    this.drag_view_horizontal_drag(d, ia, a)
                  )
                  .on('end', this.drag_view_end)
              )*/
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
              return `https://d3jjfdwi6rnqlf.cloudfront.net/img/dinein/area-view/${d.name}_view_v.jpg`
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
              return `https://d3jjfdwi6rnqlf.cloudfront.net/img/dinein/area-view/${d.name}_view_h.jpg`
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
              return `https://d3jjfdwi6rnqlf.cloudfront.net/img/dinein/area-view/${d.name}_view_v.jpg`
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
<style lang="scss" scoped>
@import '@/assets/scss/header';
@import '@/assets/scss/mixins.scss';

.m-1 {
  &.buttons {
    span {
      margin-right: 10px !important;
      &:last-child {
        margin-right: 0 !important;
      }
    }
  }
}
#tooltipdata {
  .modal-dialog {
    height: 100vh;
    display: flex;
  }
  .modal-content {
    margin: auto;
    height: fit-content;
    .modal-body {
      padding: $px10;
    }
    .modal-footer {
      padding: $px15;
      border-top: 1px solid #dbd7d7;
      background: #e3e2e2;
    }
  }
  .table-popup {
    color: #fff;
    margin: 0.1325rem;
    //&:hover {
    //  background: rgb(0, 147, 0) !important;
    //}
  }
  .table-order-footer {
    text-align: right;
  }
  .table-order-content {
    overflow: auto;
    max-height: $px190;
    padding: $px5;
    .table-order {
      //padding: $px5 $px2;
      //border-bottom: 1px solid #dbd7d7;
      //margin-bottom: $px5;
      //background: #e3e2e2;
      //font-size: 12px;
      //&:last-child {
      //  border-bottom: unset;
      //}
    }
    .order-details-with-action {
      display: grid;
      grid-template-columns: 1fr auto;
      padding: $px5 $px2;
      border-bottom: 1px solid #dbd7d7;

      .dt-items {
        font-weight: 400;
        color: #212529;
        display: grid;
        align-items: center;
        padding: 0 5px;
      }

      .paid-amount-msg {
        color: #7ac241;
      }

      /*.reservation-cancel {
        position: static;
        margin: 1px;
      }*/
    }
  }
}
@include responsive(mobile) {
  .modal .modal-dialog .modal-content {
    width: 95% !important;
    .modal-body {
      padding: $px5;
    }
  }
  .modal-dialog {
    margin-top: 2rem !important;
  }
  .modal-open .modal {
    overflow: hidden !important;
  }
  .modal-footer {
    .btn-announce {
      display: grid !important;
      grid-template-columns: 1fr !important;
      width: 100% !important;
      grid-row-gap: 10px !important;
    }
  }
}
</style>
<style lang="scss">
@import '@/assets/scss/mixins.scss';
#switchWaiter {
  .modal-dialog {
    max-width: 60% !important;
    @include responsive(mobile) {
      max-width: 90% !important;
    }
  }
}
</style>
