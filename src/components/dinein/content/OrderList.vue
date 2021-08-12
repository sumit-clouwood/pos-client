<template>
  <div>
    <Preloader v-if="loading" />
    <div v-else class="running-order-table-wrap">
      <table class="table responsive-table" id="running-order">
        <thead>
          <tr class="dine-table-heading text-capitalize">
            <th width="200px">{{ _t('TABLE NUMBER') }}</th>
            <!--<th width="100px">{{ _t('STATUS') }}</th>-->
            <th width="450px">{{ _t('ORDERS') }}</th>
            <!-- <th width="200px">{{ _t('AMOUNT') }}</th> -->
            <th width="250px">{{ _t('ACTION STATUS') }}</th>
          </tr>
        </thead>
        <tbody v-if="orderDetails">
          <template v-for="(orderTable, index) in orderDetails">
            <tr
              :key="index"
              class="dine-table-content"
              :id="orderTable.table._id"
              v-if="hasOrders(orderTable)"
            >
              <td
                class="dine-order-tabel"
                :class="getOrderStatus(orderTable.table.status)"
              >
                <span :class="tabName">
                  {{ _t('Table No') }} : {{ orderTable.table.number }}
                  <p>
                    {{ _t('Status') }} :
                    {{
                      _t(
                        LookupData.replaceUnderscoreHyphon(
                          orderTable.table.status
                        )
                      )
                    }}
                  </p>
                  <p>{{ _t('Area') }} : {{ orderTable.areaName }}</p>
                  <p>
                    <span
                      class="timeago elapsedTime delManTime runningtime"
                      title=""
                    >
                      {{
                        storeDateTime(
                          orderTable.table.start_date +
                            ', ' +
                            orderTable.table.start_time
                        )
                      }}
                    </span>
                  </p>
                </span>
              </td>
              <td class="dine-order-details">
                <div class="table-order-view-wrapper">
                  <div
                    v-for="(order, i) in orderTable.orders"
                    :key="i"
                    :class="isOrderCancelledClass"
                  >
                    <div
                      v-if="
                        order &&
                          order.order_system_status !== 'modified' &&
                          order.order_system_status !== 'cancelled'
                      "
                    >
                      <div class="moodifiers-btn-wrapper">
                        <div class="progress-order-details">
                          <button
                            v-if="order.order_system_status !== 'cancelled'"
                            @click="selectedOrderDetails(order._id)"
                            class="open-details-popup text-capitalize btn btn-danger"
                            :class="getOrderStatus(order.order_status)"
                            data-dismiss="modal"
                            data-target=".bd-example-modal-lg"
                            data-toggle="modal"
                          >
                            #{{ order.order_no }} |
                            {{
                              LookupData.replaceUnderscoreHyphon(
                                order.order_status
                              )
                            }}
                          </button>
                          <button
                            v-else
                            class="open-details-popup btn btn-success text-capitalize"
                            :class="getOrderStatus(order.order_status)"
                          >
                            #{{ order.order_no }} | {{ _t('Cancelled') }}
                          </button>
                        </div>
                        <div
                          class="running-actions"
                          v-if="
                            order.order_system_status !== 'requires_acceptance'
                          "
                        >
                          <div class="dropdown">
                            <button
                              class="button btn btn-success color-main color-text-invert dropdown-toggle"
                              type="button"
                              id="dropdownMenuButton"
                              @click="selectedOrderDetails(order._id)"
                              data-toggle="dropdown"
                              aria-haspopup="true"
                              aria-expanded="false"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="22"
                                height="19"
                                viewBox="0 0 22 19"
                              >
                                <g fill="#fff" fill-rule="nonzero">
                                  <path
                                    d="M2.68 7.096c0-2.825-.274-2.568 1.51-2.568V1.113c0-.53.438-.963.968-.963h11.684c.53 0 .967.433.967.963v3.415c1.785 0 1.511-.257 1.511 2.568.832 0 2.44-.26 2.44.95v5.993a.96.96 0 0 1-.963.946h-2.988v2.832a.971.971 0 0 1-.967.963H5.158a.971.971 0 0 1-.967-.963v-2.832H1.203a.96.96 0 0 1-.964-.946V8.046c0-.527.44-.95.964-.95H2.68zM3.702 5.55v1.546h.489V5.55h-.489zm14.596 0h-.489v1.546h.489V5.55zm-.489 7.425v.987h2.93V8.12H1.261v5.843H4.19c0-.499-.177-1.951.967-1.951h11.684c.593 0 .964.596.964.964h.003zm-1.022 4.78l-.007-4.718H5.217l-.004 4.717h11.574zM5.213 1.171v5.924h11.574V1.172H5.213z"
                                  />
                                  <path
                                    d="M17.518 9.8c-.672 0-.672-1.023 0-1.023h1.643c.676 0 .676 1.023 0 1.023h-1.643z"
                                  />
                                </g>
                              </svg>
                              {{ _t('Print') }}
                            </button>
                            <div
                              class="dropdown-menu"
                              aria-labelledby="dropdownMenuButton"
                            >
                              <a
                                class="dropdown-item"
                                role="button"
                                v-for="(template,
                                index) in selectedOrder.invoice"
                                :key="index"
                                @click="
                                  printInvoice({
                                    templateId: template._id,
                                    order: selectedOrder,
                                  })
                                "
                                >{{ template.name }}</a
                              >
                            </div>
                          </div>
                          <button
                            class="dinefor-paynow btn btn-success"
                            v-if="
                              !waiter &&
                                tabName !== 'completed' &&
                                order.order_status !== 'finished' &&
                                !order.order_payments.length
                              /*&& order.order_status !== 'cancelled'*/
                            "
                          >
                            <a
                              @click="
                                setRouter({
                                  url:
                                    $route.path +
                                    '/' +
                                    orderTable.table.assigned_table_id +
                                    '/' +
                                    order._id,
                                  orderId: order._id,
                                  orderData: orderTable.table,
                                })
                              "
                            >
                              <svg
                                height="21"
                                viewBox="0 0 30 21"
                                width="30"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g fill="#FFF" fill-rule="nonzero">
                                  <path
                                    d="M27.325.316H18.3v1.201h5.43c.05.498.201 1.008.444 1.512a6.63 6.63 0 0 0 1.283 1.777c.524.524 1.098.94 1.683 1.236.462.234.93.391 1.39.465v5.082c-.46.073-.928.23-1.39.465a6.678 6.678 0 0 0-1.683 1.235 6.622 6.622 0 0 0-1.282 1.778 4.537 4.537 0 0 0-.444 1.511H9.235a4.537 4.537 0 0 0-.444-1.511 6.636 6.636 0 0 0-1.283-1.778 6.678 6.678 0 0 0-1.683-1.236 4.766 4.766 0 0 0-1.39-.465v-5.08c.46-.075.929-.232 1.39-.466a6.678 6.678 0 0 0 1.683-1.236A6.622 6.622 0 0 0 8.791 3.03a4.53 4.53 0 0 0 .444-1.511h7.788V.316H5.641a2.412 2.412 0 0 0-2.407 2.408v12.649A2.412 2.412 0 0 0 5.64 17.78h21.684a2.413 2.413 0 0 0 2.408-2.407V2.723A2.413 2.413 0 0 0 27.325.317zm.36 4.655a5.488 5.488 0 0 1-1.377-1.014 5.432 5.432 0 0 1-1.051-1.451 3.492 3.492 0 0 1-.319-.988h2.387c.331 0 .63.134.851.355.22.22.355.52.355.851v2.56a3.766 3.766 0 0 1-.847-.313zM4.79 1.872a1.2 1.2 0 0 1 .851-.355h2.387a3.492 3.492 0 0 1-.318.988c-.235.486-.59.991-1.051 1.452-.437.437-.914.779-1.377 1.013-.294.15-.58.25-.847.312V2.724c0-.332.135-.63.355-.852zm0 14.352a1.2 1.2 0 0 1-.355-.851v-2.56c.267.063.553.163.847.313.463.234.94.576 1.377 1.014.46.46.816.965 1.05 1.451.17.35.273.687.32.988H5.64c-.331 0-.63-.135-.85-.355zm23.386 0a1.2 1.2 0 0 1-.851.355h-2.387c.046-.301.15-.64.319-.988.234-.486.59-.99 1.05-1.451.438-.438.914-.78 1.377-1.014.294-.15.58-.25.847-.312v2.559c0 .33-.134.63-.355.85z"
                                  ></path>
                                  <path
                                    d="M12.844 9.08a3.64 3.64 0 1 0 7.28-.001 3.64 3.64 0 0 0-7.28 0zm6.077 0c0 .675-.272 1.28-.714 1.724a2.428 2.428 0 0 1-1.724.714c-.675 0-1.28-.272-1.724-.714a2.428 2.428 0 0 1-.714-1.724c0-.675.272-1.281.714-1.724a2.428 2.428 0 0 1 1.724-.714c.675 0 1.28.272 1.724.714.442.443.714 1.049.714 1.724z"
                                  ></path>
                                  <circle
                                    cx="10.222"
                                    cy="5.096"
                                    r="1.001"
                                  ></circle>
                                  <circle
                                    cx="22.782"
                                    cy="13.001"
                                    r="1.001"
                                  ></circle>
                                  <path
                                    d="M25.21 19.19a1.2 1.2 0 0 1-.851.355H2.675a1.2 1.2 0 0 1-.851-.355 1.2 1.2 0 0 1-.355-.851V5.69c0-.331.134-.63.355-.851a1.2 1.2 0 0 1 .851-.355V3.283A2.413 2.413 0 0 0 .267 5.69v12.65a2.413 2.413 0 0 0 2.408 2.407H24.36a2.413 2.413 0 0 0 2.407-2.408h-1.201c0 .33-.135.63-.355.851z"
                                  ></path>
                                </g>
                              </svg>
                              <span class="pay_now">{{
                                _t('Pay Now')
                              }}</span></a
                            >
                          </button>
                        </div>
                        <div
                          v-if="
                            order.order_system_status ===
                              'requires_acceptance' &&
                              order.order_type === 'dine_in'
                          "
                          class="button-block running-actions"
                          style="visibility: visible;"
                        >
                          <order-accept-reject
                            :order="order"
                          ></order-accept-reject>
                        </div>
                      </div>
                      <div class="modifiers-content">
                        <div class="order-moifier-wrapper">
                          <div
                            :key="j"
                            class="order-name"
                            v-for="(i, j) in order.items"
                          >
                            <div class="main-item">
                              {{
                                typeof order.items[j] != 'undefined'
                                  ? order.items[j].name
                                  : ''
                              }}
                            </div>
                            <div
                              :key="k"
                              class="modifiers"
                              v-for="(item, k) in order.item_modifiers"
                            >
                              <span v-if="item.for_item == i.no">
                                <span v-if="item.qty > 0">+{{ item.qty }}</span>
                                {{ item.name }}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <!--<span-->
                      <!--class="order-down-arrow"-->
                      <!--:id="'id_' + order._id"-->
                      <!--@click="showMoreOrderItems(order._id)"-->
                      <!--&gt;-->
                      <!--<i class="fa fa-chevron-down" aria-hidden="true"></i>-->
                      <!--</span>-->
                    </div>
                  </div>
                </div>
              </td>
              <!-- <td class="dine-order-amt font-weight-bold">
                {{ formatPrice(orderTable.amount) }}
              </td> -->
              <td class="order-time-det">
                <div class="action-status">
                  <div>
                    <button
                      class="dinefor-paynow btn btn-danger"
                      v-if="orderTable.table.status == 'in-progress'"
                      @click="
                        reservationUpdateStatus({
                          reservationId: orderTable.table._id,
                          status: 'dine_in_about_to_finish',
                        })
                      "
                    >
                      <span class="pay_now"
                        ><i class="fa fa-clock-o" aria-hidden="true"></i>
                        {{ _t('About to Finish') }}</span
                      >
                    </button>
                    <button
                      class="dinefor-paynow btn btn-progress"
                      v-if="orderTable.table.status == 'on-a-way'"
                      @click="completeOrder(orderTable.table._id)"
                    >
                      <span class="pay_now">
                        <i class="fa fa-check" aria-hidden="true"></i>
                        {{ _t('Complete') }}</span
                      >
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="4">
              <p class="font-weight-bold text-danger text-center color-warning">
                {{ _t('No order found') }}
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="pagination-customer-details">
      <paginate
        v-if="totalReservations.totalPages"
        :page-count="totalReservations.totalPages"
        :page-range="2"
        :margin-pages="2"
        :clickHandler="fetchMore"
        :prev-text="_t('Prev')"
        :next-text="_t('Next')"
        :container-class="''"
        :page-class="_t('page-item')"
        v-model="page"
      ></paginate>
    </div>
    <InformationPopup :responseInformation="this.msg" title="Alert" />
  </div>
</template>

<script>
/*global $*/
import { mapState, mapGetters, mapActions } from 'vuex'
import DateTime from '@/mixins/DateTime'
import Preloader from '@/components/util/Preloader'
import paginate from 'vuejs-paginate'
import InformationPopup from '@/components/pos/content/InformationPopup'
import OrderAcceptReject from './buttons/OrderAcceptReject'

export default {
  name: 'OrderList',
  props: {
    tabName: String,
    lookup: String,
  },
  components: {
    Preloader,
    paginate,
    InformationPopup,
    OrderAcceptReject,
  },
  data() {
    return {
      // actionDetails: {
      //   moreDetails: false,
      //   actionLabel: ['Accept', 'Reject'],
      //   action: ['delivery_accept', 'delivery_reject'],
      //   nextOrderStatus: 'in-progress',
      // },
      processedOrder: [],
      timerTime: false,
      isOrderCancelledClass: 'table-order-view',
      page: 1,
      orderAdded: [],
      msg: null,
    }
  },
  updated() {
    //    if (this.orderTable.orders) {
    //    }
    // let scope = this
    // $('#running-order tbody .dine-table-content').each(function() {
    // let orderDateTime = this.timerTime
    /*// setInterval(() => {
      let orderDateTime = parseInt($.trim(this.timerTime))
      let orderTime = this.timerClock(orderDateTime)
      $(this)
        .find('span.runningtime')
        .html(orderTime)
      // }, 1000)*/
    // })
    // setInterval(() => {}, 1000)
  },
  mixins: [DateTime],
  computed: {
    ...mapState({
      loading_awating_order_response: state => state.deliveryManager.loading,
    }),
    ...mapState('location', ['timezoneString']),
    ...mapGetters('location', ['_t', 'formatPrice']),
    ...mapState('order', ['selectedOrder']),
    ...mapState('dinein', [
      'orderDetails',
      'loading',
      'totalReservations',
      'tables',
    ]),
    ...mapGetters('dinein', ['getOrderStatus', 'getTableNumber']),
    ...mapGetters('auth', ['waiter']),
  },
  methods: {
    // updateOrder(data) {
    //   this.processedOrder.push(data.order._id)
    //   this.$store.commit('deliveryManager/SET_LOADING', true)
    //   this.updateOrderAction(data)
    //     .then(() => {
    //       // this.$store.dispatch('dinein/dineInRunningOrders')
    //       this.$store.dispatch('deliveryManager/getOnlineOrders')
    //     })
    //     .catch(er => {
    //       this.err = er.data ? er.data.error : er.message
    //       if (this.err) $('.information-popup').modal('show')
    //     })
    // },
    hasOrders(orderDetails) {
      return orderDetails.orders.length
    },
    completeOrder(tableId) {
      this.reservationUpdateStatus({
        reservationId: tableId,
        status: 'dine_in_order_finished',
      })
        .then(() => {
          $('#' + tableId).hide()
        })
        .catch(error => {
          this.msg = error.data.error
          $('.information-popup').modal('show')
        })
    },
    setTime(timerTime) {
      let timeZoneTime =
        typeof timerTime != 'undefined' ? timerTime.$date.$numberLong : 'false'
      if (timeZoneTime) {
        return this.timerClock(parseInt($.trim(timeZoneTime)))
        /*$(this)
            .find('span.runningtime')
            .html(orderTime)*/
      }
    },
    fetchMore(pageNumber) {
      let pageInformation = {
        pageNumber: pageNumber,
        tabName: this.tabName,
        loader: false,
      }
      this.fetchMoreReservations(pageInformation)
    },
    ...mapActions('order', [
      'selectedOrderDetails',
      'fetchOrderDetailsOnly',
      'updateOrderAction',
    ]),
    ...mapActions('deliveryManager', ['printInvoice']),
    ...mapActions('dinein', [
      'reservationUpdateStatus',
      'fetchMoreReservations',
    ]),
    getOrderDetails(order) {
      this.isOrderCancelledClass =
        order.order_system_status !== 'cancelled'
          ? 'table-order-view'
          : 'table-order-view'
    },
    timerClock(datetime) {
      return this.orderTimer(
        this.convertDatetime(
          datetime,
          this.timezoneString,
          'YYYY-MM-DD HH:mm:ss'
        ),
        this.timezoneString
      )
    },
    storeDateTime(orderDateTime) {
      return this.convertDatetime(
        orderDateTime,
        this.timezoneString,
        'YYYY-MM-DD HH:mm'
      )
    },
    setRouter(data) {
      let tableData = this.tables.find(
        table => table._id === data.orderData.assigned_table_id
      )
      this.$store.commit('dinein/SELECTED_TABLE', tableData)
      this.$store.commit('dinein/RESERVATION_ID', data.orderData._id)
      this.$store.commit('dinein/ORDER_RESERVATION_DATA', data.orderData)
      this.$store.dispatch('dinein/getSelectedOrder', data.orderId, {
        root: true,
      })
      this.$store.dispatch('order/updateOrderType', {
        OTview: 'Dine In',
        OTApi: 'dine_in',
      })
      this.$router.push({ path: data.url })
    },
  },
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/mixins.scss';

/*td.dine-order-tabel > span {
    height: 7.375rem;
  }*/
.running-actions .dropdown {
  text-align: left;
}

button#dropdownMenuButton {
  width: 100%;
  @include responsive(mobile) {
    font-size: 1rem;
  }
}
.dinefor-paynow {
  @include responsive(mobile) {
    font-size: 1rem;
  }
}
button#dropdownMenuButton svg {
  display: inline-block;
  vertical-align: middle;
}
.table-order-view:empty {
  display: none;
}
@include responsive(mobile) {
  .table-order-view-wrapper {
    .table-order-view {
      border: none;
      padding: 0rem;
      margin: 0rem;
    }
  }
  .dine-table-heading {
    display: none;
  }
  .dine-order-tabel {
    padding: 0px !important;
  }
  .moodifiers-btn-wrapper {
    display: grid !important;
    grid-template-columns: 1fr !important;
    .progress-order-details {
      button {
        width: 100%;
        margin: auto;
        font-size: 1.1rem;
      }
    }
  }
  .action-status {
    button {
      width: 90%;
      margin: auto;
      font-size: 1.1rem;
      margin: 5%;
    }
  }
  .dine-order-amt,
  .order-time-det {
    border: none !important;
  }
  .dine-order-amt {
    font-size: 1.1rem;
  }
  .order-time-det {
    padding: 0px;
  }
  .dine-table-content {
    display: grid;
    border: 1px solid lightgrey;
    margin-top: 0.75rem;
    .running,
    .completed {
      grid-template-columns: 1fr 1fr !important;
      padding: 0px !important;
      width: auto;
      font-size: 1.15rem !important;
    }
  }
}
</style>
