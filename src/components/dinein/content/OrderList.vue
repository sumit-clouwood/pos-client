<template>
  <div>
    <Preloader v-if="loading" />
    <div v-else class="running-order-table-wrap">
      <table class="table" id="running-order">
        <thead>
          <tr class="dine-table-heading">
            <th width="200px">{{ _t('TABLE NUMBER') }}</th>
            <th width="200px">{{ _t('AMOUNT') }}</th>
            <!--<th width="100px">{{ _t('STATUS') }}</th>-->
            <th width="450px">{{ _t('ORDERS') }}</th>
            <th width="250px">{{ _t('STATUS') }}</th>
          </tr>
        </thead>
        <tbody v-if="orders[lookup].orders">
          <tr
            :key="index"
            class="dine-table-content"
            v-for="(orderTable, index) in orders[tabName]"
          >
            <td class="dine-order-tabel">
              <span>{{ orderTable.number }}</span>
            </td>
            <td class="dine-order-amt">
              {{ orderDetails.balance_due + ' ' + orderDetails.currency }}
            </td>
            <td class="dine-order-details">
              <div class="table-order-view-wrapper">
                <div
                  v-for="(orderId, i) in orderTable.related_orders_ids"
                  :key="i"
                  :class="isOrderCancelledClass"
                >
                  {{
                    getOrderDetails({
                      collection: orders[lookup].orders._id,
                      matchWith: orderId,
                    })
                  }}
                  <div>
                    <div class="running-actions">
                      <span
                        v-if="orderDetails.order_system_status !== 'cancelled'"
                        @click="selectedOrderDetails(orderId)"
                        class="open-details-popup cursor-pointer font-weight-bold text-capitalize"
                        :class="getOrderStatus(orderDetails.order_status)"
                        data-dismiss="modal"
                        data-target=".bd-example-modal-lg"
                        data-toggle="modal"
                      >
                        #{{ orderDetails.order_no }} |
                        {{
                          LookupData.replaceUnderscoreHyphon(
                            orderDetails.order_status
                          )
                        }}
                      </span>
                      <span
                        v-else
                        class="open-details-popup cursor-pointer font-weight-bold text-capitalize"
                        :class="getOrderStatus(orderDetails.order_status)"
                      >
                        #{{ orderDetails.order_no }} | {{ _t('Cancelled') }}
                      </span>
                      <span
                        class="dinefor-paynow"
                        v-if="tabName !== 'completed'"
                      >
                        <a
                          @click="
                            setRouter({
                              url:
                                $route.path +
                                '/' +
                                orderTable.assigned_table_id +
                                '/' +
                                orderId,
                              orderId: orderId,
                              orderData: orderTable,
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
                              <circle
                                cx="22.782"
                                cy="13.001"
                                r="1.001"
                              ></circle>
                              <path
                                d="M25.21 19.19a1.2 1.2 0 0 1-.851.355H2.675a1.2 1.2 0 0 1-.851-.355 1.2 1.2 0 0 1-.355-.851V5.69c0-.331.134-.63.355-.851a1.2 1.2 0 0 1 .851-.355V3.283A2.413 2.413 0 0 0 .267 5.69v12.65a2.413 2.413 0 0 0 2.408 2.407H24.36a2.413 2.413 0 0 0 2.407-2.408h-1.201c0 .33-.135.63-.355.851z"
                              ></path>
                            </g></svg
                          ><span class="pay_now">{{ _t('Pay Now') }}</span></a
                        >
                      </span>
                    </div>
                    <div
                      :key="j"
                      class="order-name"
                      v-for="(i, j) in orderDetails.items"
                    >
                      <div class="main-item">
                        {{
                          typeof orderDetails.items[j] != 'undefined'
                            ? orderDetails.items[j].name
                            : ''
                        }}
                      </div>
                      <div
                        :key="k"
                        class="modifiers"
                        v-for="(item, k) in orderDetails.item_modifiers"
                      >
                        <span v-if="item.for_item == i.no">
                          <span v-if="item.qty > 0">+{{ item.qty }}</span>
                          {{ item.name }}
                        </span>
                      </div>
                    </div>
                    <span
                      class="order-down-arrow"
                      :id="'id_' + orderId"
                      @click="showMoreOrderItems(orderId)"
                    >
                      <i class="fa fa-chevron-down" aria-hidden="true"></i>
                    </span>
                  </div>
                </div>
              </div>
            </td>
            <!--<td :class="getOrderStatus(orderDetails.order_status)">
            <span>{{ orderDetails.order_status }}</span>
          </td>-->
            <!--<td><span>{{ order.order_status }}</span></td>-->
            <td class="order-time-det">
              <div class="action-status">
                <div
                  class="dining-for-button"
                  :class="
                    orderTable.status === 'completed'
                      ? 'btn btn-success'
                      : 'btn btn-danger'
                  "
                >
                  {{ LookupData.replaceUnderscoreHyphon(orderTable.status) }}
                </div>
                <div>
                  <span
                    class="dinefor-paynow"
                    v-if="orderTable.status == 'in-progress'"
                    @click="
                      reservationUpdateStatus({
                        reservationId: orderTable._id,
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
                      </g></svg
                    ><span class="pay_now">{{ _t('About to Finish') }}</span>
                  </span>
                  <span
                    class="dinefor-paynow"
                    v-if="orderTable.status == 'on-a-way'"
                    @click="
                      reservationUpdateStatus({
                        reservationId: orderTable._id,
                        status: 'dine_in_order_finished',
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
                          d="M12.844 9.08a3.64 3.64 0 1 0 7.28-.001 3.64 3.64 0 0 0-7.28 0zm6.077 0c0 fixed responsive issues .675-.272 1.28-.714 1.724a2.428 2.428 0 0 1-1.724.714c-.675 0-1.28-.272-1.724-.714a2.428 2.428 0 0 1-.714-1.724c0-.675.272-1.281.714-1.724a2.428 2.428 0 0 1 1.724-.714c.675 0 1.28.272 1.724.714.442.443.714 1.049.714 1.724z"
                        ></path>
                        <circle cx="10.222" cy="5.096" r="1.001"></circle>
                        <circle cx="22.782" cy="13.001" r="1.001"></circle>
                        <path
                          d="M25.21 19.19a1.2 1.2 0 0 1-.851.355H2.675a1.2 1.2 0 0 1-.851-.355 1.2 1.2 0 0 1-.355-.851V5.69c0-.331.134-.63.355-.851a1.2 1.2 0 0 1 .851-.355V3.283A2.413 2.413 0 0 0 .267 5.69v12.65a2.413 2.413 0 0 0 2.408 2.407H24.36a2.413 2.413 0 0 0 2.407-2.408h-1.201c0 .33-.135.63-.355.851z"
                        ></path>
                      </g></svg
                    ><span class="pay_now">{{ _t('Complete') }}</span>
                  </span>
                </div>
              </div>
              <!--<input
                type="hidden"
                id="ordertime"
                :value="orderDetails.real_created_datetime.$date.$numberLong"
              />-->
              <span
                :id="orderDetails._id"
                class="timeago elapsedTime delManTime runningtime"
                title=""
              >
                {{ setTime(orderDetails.real_created_datetime) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <paginate
        v-if="totalReservations.totalPages"
        :page-count="totalReservations.totalPages"
        :page-range="1"
        :margin-pages="1"
        :clickHandler="fetchMore"
        :prev-text="_t('Prev')"
        :next-text="_t('Next')"
        :container-class="''"
        :page-class="_t('page-item')"
      ></paginate>
    </div>
  </div>
</template>

<script>
/*global $*/
import { mapState, mapGetters, mapActions } from 'vuex'
import DateTime from '@/mixins/DateTime'
import Preloader from '@/components/util/Preloader'
import paginate from 'vuejs-paginate'

export default {
  name: 'OrderList',
  props: {
    tabName: String,
    lookup: String,
  },
  components: {
    Preloader,
    paginate,
  },
  data() {
    return {
      orderDetails: false,
      timerTime: false,
      isOrderCancelledClass: 'table-order-view',
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
    ...mapGetters('location', ['_t']),
    ...mapState('dinein', ['orders', 'loading', 'totalReservations']),
    ...mapGetters('dinein', ['getOrderStatus', 'getTableNumber']),
  },
  methods: {
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
      this.fetchMoreReservations(pageNumber, this.tabName)
    },
    ...mapActions('order', ['selectedOrderDetails']),
    ...mapActions('dinein', [
      'reservationUpdateStatus',
      'fetchMoreReservations',
    ]),
    getOrderDetails(collection) {
      // eslint-disable-next-line no-console
      this.orderDetails = collection.collection[collection.matchWith]
      // console.log(collection)
      this.isOrderCancelledClass =
        this.orderDetails.order_system_status !== 'cancelled'
          ? 'table-order-view'
          : 'table-order-view'
    },
    timerClock(datetime) {
      return this.orderTimer(
        this.convertDatetime(datetime, this.timezoneString),
        this.timezoneString
      )
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
