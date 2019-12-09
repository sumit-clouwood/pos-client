<template>
  <div>
    <Preloader v-if="loading" />
    <div v-else class="running-order-table-wrap">
      <div class="header_list hide_sm">
        <div class="">Table No</div>
        <div class="">Orders</div>
        <div class="">Amount</div>
        <div class="">Table Booked Time</div>
        <div class="">Actions</div>
      </div>
      <template v-if="orderDetails">
        <div
          :key="index"
          class="dine-table-content"
          v-for="(orderTable, index) in orderDetails"
        >
          <div
            class="dine-order-tabel"
            :class="getOrderStatus(orderTable.table.status)"
          >
            <span :class="tabName">
              {{ _t('Table No') }} : {{ orderTable.table.number }}
              <p>
                <small class="text-uppercase font-weight-bold ">
                  {{ _t('Status') }}:
                  {{
                    LookupData.replaceUnderscoreHyphon(orderTable.table.status)
                  }}
                </small>
              </p>
              <p>
                <small class="text-uppercase font-weight-bold ">
                  {{ _t('Area') }}: {{ orderTable.areaName }}
                </small>
              </p>
            </span>
          </div>
          <div class="dine-order-details">
            <div class="table-order-view-wrapper">
              <div
                v-for="(order, i) in orderTable.orders"
                :key="i"
                :class="isOrderCancelledClass"
              >
                <div v-if="order">
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
                  <span
                    class="order-down-arrow"
                    :id="'id_' + order._id"
                    @click="showMoreOrderItems(order._id)"
                  >
                    <i class="fa fa-chevron-down" aria-hidden="true"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="dine-order-amt font-weight-bold">
            {{ formatPrice(orderTable.amount) }}
          </div>
          <div class="order-time-det">
            <div class="table-booked-status">
              <span
                class="btn btn-success"
                v-if="orderTable.table.status == 'in-progress'"
                @click="
                  reservationUpdateStatus({
                    reservationId: orderTable.table._id,
                    status: 'dine_in_about_to_finish',
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
                    <circle cx="10.222" cy="5.096" r="1.001"></circle>
                    <circle cx="22.782" cy="13.001" r="1.001"></circle>
                    <path
                      d="M25.21 19.19a1.2 1.2 0 0 1-.851.355H2.675a1.2 1.2 0 0 1-.851-.355 1.2 1.2 0 0 1-.355-.851V5.69c0-.331.134-.63.355-.851a1.2 1.2 0 0 1 .851-.355V3.283A2.413 2.413 0 0 0 .267 5.69v12.65a2.413 2.413 0 0 0 2.408 2.407H24.36a2.413 2.413 0 0 0 2.407-2.408h-1.201c0 .33-.135.63-.355.851z"
                    ></path>
                  </g>
                </svg>
                <span class="pay_now">{{ _t('About to Finish') }}</span>
              </span>
              <span
                class="btn btn-success"
                v-if="orderTable.table.status == 'on-a-way'"
                @click="completeOrder(orderTable.table._id)"
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
                      d="M12.844 9.08a3.64 3.64 0 1 0 7.28-.001 3.64 3.64 0 0 0-7.28 0zm6.077 0c0 fixed responsive issues .675-.272 1.28-.714 1.724a2.428 2.428 0 0 1-1.724.714c-.675 0-1.28-.272-1.724-.714a2.428 2.428 0 0 1-.714-1.724c0-.675.272-1.281.714-1.724a2.428 2.428 0 0 1 1.724-.714c.675 0 1.28.272 1.724.714.442.443.714 1.049.714 1.724z"
                    ></path>
                    <circle cx="10.222" cy="5.096" r="1.001"></circle>
                    <circle cx="22.782" cy="13.001" r="1.001"></circle>
                    <path
                      d="M25.21 19.19a1.2 1.2 0 0 1-.851.355H2.675a1.2 1.2 0 0 1-.851-.355 1.2 1.2 0 0 1-.355-.851V5.69c0-.331.134-.63.355-.851a1.2 1.2 0 0 1 .851-.355V3.283A2.413 2.413 0 0 0 .267 5.69v12.65a2.413 2.413 0 0 0 2.408 2.407H24.36a2.413 2.413 0 0 0 2.407-2.408h-1.201c0 .33-.135.63-.355.851z"
                    ></path>
                  </g>
                </svg>
                <span class="pay_now">{{ _t('Complete') }}</span>
              </span>
            </div>
            <span class="timeago elapsedTime delManTime runningtime" title="">
              {{
                storeDateTime(
                  orderTable.table.start_date +
                    ', ' +
                    orderTable.table.start_time
                )
              }}
            </span>
          </div>
          <div class="">
            <div v-for="(order, i) in orderTable.orders" :key="i">
              <template v-if="order">
                <div class="dine-running-actions">
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
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                      >
                        <g fill="#FFF" fill-rule="nonzero">
                          <path
                            d="M14.574 12.821h-3.506v-1.867H4.931v1.867H1.426a1.32 1.32 0 0 1-1.32-1.319V6.036c0-.728.593-1.32 1.32-1.32h13.148c.727 0 1.32.592 1.32 1.32v5.466c0 .727-.593 1.32-1.32 1.32zm-2.839-.666h2.839c.36 0 .653-.293.653-.653V6.036a.654.654 0 0 0-.653-.653H1.426a.653.653 0 0 0-.653.653v5.466c0 .36.293.653.653.653h2.839v-1.867h7.47v1.867z"
                          />
                          <path
                            d="M12.4 10.953H3.6a.333.333 0 1 1 0-.667h8.8a.333.333 0 1 1 0 .667z"
                          />
                          <path
                            d="M11.402 16H4.598a.333.333 0 0 1-.333-.333V10.62c0-.184.149-.333.333-.333h6.804c.184 0 .333.149.333.333v5.046c0 .184-.15.333-.333.333zm-6.47-.667h6.136v-4.379H4.931v4.38zM11.402 5.383H4.598a.333.333 0 0 1-.333-.333V.333c0-.184.149-.333.333-.333h6.804c.184 0 .333.15.333.333V5.05c0 .184-.15.333-.333.333zm-6.47-.667h6.136V.666H4.931v4.05z"
                          />
                          <path
                            d="M9.972 14.299H6.028a.333.333 0 1 1 0-.667h3.944a.333.333 0 1 1 0 .667zM9.972 12.656H6.028a.333.333 0 1 1 0-.667h3.944a.333.333 0 1 1 0 .667zM9.972 3.847H6.028a.333.333 0 1 1 0-.667h3.944a.333.333 0 1 1 0 .667zM9.972 2.203H6.028a.333.333 0 1 1 0-.667h3.944a.333.333 0 1 1 0 .667zM4.598 5.383H2.797a.333.333 0 0 1-.333-.333V3.226c0-.547.444-.991.99-.991h1.144c.184 0 .333.15.333.333V5.05c0 .184-.149.333-.333.333zM3.13 4.716h1.135V2.902h-.81a.324.324 0 0 0-.325.324v1.49zM13.203 5.383h-1.801a.333.333 0 0 1-.334-.333V2.568c0-.184.15-.333.334-.333h1.144c.546 0 .99.444.99.99V5.05c0 .184-.149.333-.333.333zm-1.468-.667h1.135v-1.49a.324.324 0 0 0-.324-.324h-.811v1.814zM2.754 7.498h-.667a.333.333 0 1 1 0-.666h.667a.333.333 0 1 1 0 .666zM4.754 7.498h-.667a.333.333 0 1 1 0-.666h.667a.333.333 0 1 1 0 .666z"
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
                        v-for="(template, index) in selectedOrder.invoice"
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
                  <span
                    class="dinefor-paynow"
                    v-if="
                      !waiter &&
                        tabName !== 'completed' &&
                        order.order_status !== 'finished'
                      /*&& order.order_status !== 'cancelled'*/
                    "
                  >
                    <a
                      class="btn btn-success"
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
                          <circle cx="10.222" cy="5.096" r="1.001"></circle>
                          <circle cx="22.782" cy="13.001" r="1.001"></circle>
                          <path
                            d="M25.21 19.19a1.2 1.2 0 0 1-.851.355H2.675a1.2 1.2 0 0 1-.851-.355 1.2 1.2 0 0 1-.355-.851V5.69c0-.331.134-.63.355-.851a1.2 1.2 0 0 1 .851-.355V3.283A2.413 2.413 0 0 0 .267 5.69v12.65a2.413 2.413 0 0 0 2.408 2.407H24.36a2.413 2.413 0 0 0 2.407-2.408h-1.201c0 .33-.135.63-.355.851z"
                          ></path>
                        </g>
                      </svg>
                      <span class="pay_now">{{ _t('Pay Now') }}</span></a
                    >
                  </span>
                  <div>
                    <span
                      v-if="order.order_system_status !== 'cancelled'"
                      @click="selectedOrderDetails(order._id)"
                      class="open-details-popup cursor-pointer font-weight-bold text-capitalize"
                      :class="getOrderStatus(order.order_status)"
                      data-dismiss="modal"
                      data-target=".bd-example-modal-lg"
                      data-toggle="modal"
                    >
                      #{{ order.order_no }} |
                      {{
                        LookupData.replaceUnderscoreHyphon(order.order_status)
                      }}
                    </span>
                    <span
                      v-else
                      class="open-details-popup cursor-pointer font-weight-bold text-capitalize"
                      :class="getOrderStatus(order.order_status)"
                    >
                      #{{ order.order_no }} | {{ _t('Cancelled') }}
                    </span>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </template>
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
import Preloader from '@/components/util/progressbar'
import paginate from 'vuejs-paginate'
import InformationPopup from '@/components/pos/content/InformationPopup'

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
  },
  data() {
    return {
      timerTime: false,
      isOrderCancelledClass: 'table-order-view',
      page: 1,
      orderAdded: [],
      msg: null,
    }
  },
  updated() {
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
    completeOrder(tableId) {
      this.reservationUpdateStatus({
        reservationId: tableId,
        status: 'dine_in_order_finished',
      })
        .then()
        .catch(error => {
          this.msg = error.data.error
          // eslint-disable-next-line no-console
          console.log(this.msg)
          //alert(error.data.error)
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
    ...mapActions('order', ['selectedOrderDetails']),
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
        this.convertDatetime(datetime, this.timezoneString),
        this.timezoneString
      )
    },
    storeDateTime(orderDateTime) {
      return this.convertDatetime(
        orderDateTime,
        this.timezoneString,
        'YYYY-MM-DD HH:mm'
      )
      // return orderDateTime + 'yyyu'
    },
    payNow(orderId) {
      // eslint-disable-next-line no-console
      console.log(orderId, this.$store)
    },
    showMoreOrderItems(id) {
      // $('.table-order-view').removeClass('active')
      $('#id_' + id)
        .closest('.table-order-view')
        .toggleClass('active')
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
/*td.dine-order-tabel > span {
  height: 7.375rem;
}*/

@import '../../../assets/scss/pixels_rem.scss';
@import '../../../assets/scss/variables.scss';
@import '../../../assets/scss/mixins.scss';

.running-order-table-wrap {
  .header_list {
    border-top: medium none;
    border-bottom: 0.125rem solid #e5e9f4;
    display: flex;
    height: 3em;
    margin-bottom: 1em;
    align-items: center;
    @include responsive(mobile) {
      &.hide_sm {
        display: none;
      }
    }
  }
  .table-order-view-wrapper {
    grid-template-columns: auto;
    .running-actions {
      grid-template-columns: 1fr auto auto;
    }
  }
  .dinefor-paynow {
    cursor: pointer;
    display: inline-block;
    margin: 0.5rem 0;
  }
}

.running-actions .dropdown {
  text-align: left;
}

#dropdownMenuButton {
  padding: 3px 10px;
  font-size: 12px;
  min-width: 115px;
}

#dropdownMenuButton > svg {
  vertical-align: middle;
}
.table-booked-status .btn {
  display: grid;
  grid-template-columns: auto 1fr;
  width: 125px;
  align-items: center;
  grid-gap: 10px;
}
.table-booked-status .btn > svg {
  width: 16px;
}
.running-order-table-wrap {
  .dine-table-content {
    display: grid;
    grid-template-columns: 1fr 1fr auto 1fr 1fr;
    grid-gap: 3rem;
    grid-area: min-content;
    align-items: center;
    margin-bottom: 30px;
  }
  .header_list {
    display: grid !important;
    grid-template-columns: 1fr 1fr auto 1fr 1fr;
    grid-gap: 3rem;
  }
  .running-actions {
    grid-template-columns: 1fr;
    grid-gap: 5px;
  }
  .order-time-det {
    .runningtime {
      margin-top: 10px;
      display: inline-block;
    }
  }
}

/*.running-order-table-wrap,*/
</style>
