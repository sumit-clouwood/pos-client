<template>
  <div class="running-order-table-wrap">
    <table class="table" id="running-order">
      <thead>
        <tr class="dine-table-heading">
          <th width="200px">{{ _t('TABLE NUMBER') }}</th>
          <th width="200px">{{ _t('AMOUNT') }}</th>
          <!--<th width="100px">{{ _t('STATUS') }}</th>-->
          <th width="450px">{{ _t('ORDERS') }}</th>
          <th width="250px">{{ _t('DINING FOR') }}</th>
        </tr>
      </thead>
      <tbody v-if="orders[tabName]">
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
            <div
              v-for="(orderId, i) in orderTable.related_orders_ids"
              :key="i"
              class="table-order-view"
            >
              {{
                getOrderDetails({
                  collection: orders.lookup.orders._id,
                  matchWith: orderId,
                })
              }}
              <span
                @click="selectedOrderDetails(orderId)"
                class="open-details-popup cursor-pointer font-weight-bold text-capitalize"
                :class="getOrderStatus(orderDetails.order_status)"
                data-dismiss="modal"
                data-target=".bd-example-modal-lg"
                data-toggle="modal"
              >
                #{{ orderDetails.order_no }} |
                {{
                  LookupData.replaceUnderscoreHyphon(orderDetails.order_status)
                }}
              </span>
              <span class="dinefor-paynow" v-if="tabName !== 'completed'">
                <a
                  :href="
                    $route.path +
                      '/' +
                      orderTable.assigned_table_id +
                      '/' +
                      orderId
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
                  ><span class="pay_now">Pay Now</span></a
                >
              </span>
              <div
                :key="index"
                class="order-name"
                v-for="(i, index) in orderDetails.items"
              >
                <div class="main-item">
                  {{
                    typeof orderDetails.items[index] != 'undefined'
                      ? orderDetails.items[index].name
                      : ''
                  }}
                </div>
                <div
                  :key="index"
                  class="modifiers"
                  v-for="(item, index) in orderDetails.item_modifiers"
                >
                  <span v-if="item.for_item == i.no">
                    <span v-if="item.qty > 0">+{{ item.qty }}</span>
                    {{ item.name }}
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
            <input
              type="hidden"
              id="ordertime"
              :value="orderDetails.real_created_datetime.$date.$numberLong"
            />
            <span
              :id="orderDetails._id"
              class="timeago elapsedTime delManTime runningtime"
              title=""
            >
            </span>
            <div class="dining-for-button">
              {{ orderTable.status }}
              <span
                class="dinefor-paynow"
                v-if="orderTable.status == 'in-progress'"
                @click="aboutToFinish(orderTable._id)"
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
                ><span class="pay_now">About to Finish</span>
              </span>
              <span
                class="dinefor-paynow"
                v-if="orderTable.status == 'on-a-way'"
                @click="dineInComplete(orderTable._id)"
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
                ><span class="pay_now">Complete</span>
              </span>
              <!--<span class="dinefor-reprint"-->
              <!--&gt;<svg-->
              <!--height="19"-->
              <!--viewBox="0 0 22 19"-->
              <!--width="22"-->
              <!--xmlns="http://www.w3.org/2000/svg"-->
              <!--&gt;-->
              <!--<g fill="#62BB31" fill-rule="nonzero">-->
              <!--<path-->
              <!--d="M2.68 7.096c0-2.825-.274-2.568 1.51-2.568V1.113c0-.53.438-.963.968-.963h11.684c.53 0 .967.433.967.963v3.415c1.785 0 1.511-.257 1.511 2.568.832 0 2.44-.26 2.44.95v5.993a.96.96 0 0 1-.963.946h-2.988v2.832a.971.971 0 0 1-.967.963H5.158a.971.971 0 0 1-.967-.963v-2.832H1.203a.96.96 0 0 1-.964-.946V8.046c0-.527.44-.95.964-.95H2.68zM3.702 5.55v1.546h.489V5.55h-.489zm14.596 0h-.489v1.546h.489V5.55zm-.489 7.425v.987h2.93V8.12H1.261v5.843H4.19c0-.499-.177-1.951.967-1.951h11.684c.593 0 .964.596.964.964h.003zm-1.022 4.78l-.007-4.718H5.217l-.004 4.717h11.574zM5.213 1.171v5.924h11.574V1.172H5.213z"-->
              <!--&gt;</path>-->
              <!--<path-->
              <!--d="M17.518 9.8c-.672 0-.672-1.023 0-1.023h1.643c.676 0 .676 1.023 0 1.023h-1.643z"-->
              <!--&gt;</path>-->
              <!--</g></svg-->
              <!--&gt;Re-Print</span-->
              <!--&gt;-->
              <!--<span class="dinefor-paynow" v-if="tabName !== 'completed'"-->
              <!--&gt;<svg-->
              <!--height="21"-->
              <!--viewBox="0 0 30 21"-->
              <!--width="30"-->
              <!--xmlns="http://www.w3.org/2000/svg"-->
              <!--&gt;-->
              <!--<g fill="#FFF" fill-rule="nonzero">-->
              <!--<path-->
              <!--d="M27.325.316H18.3v1.201h5.43c.05.498.201 1.008.444 1.512a6.63 6.63 0 0 0 1.283 1.777c.524.524 1.098.94 1.683 1.236.462.234.93.391 1.39.465v5.082c-.46.073-.928.23-1.39.465a6.678 6.678 0 0 0-1.683 1.235 6.622 6.622 0 0 0-1.282 1.778 4.537 4.537 0 0 0-.444 1.511H9.235a4.537 4.537 0 0 0-.444-1.511 6.636 6.636 0 0 0-1.283-1.778 6.678 6.678 0 0 0-1.683-1.236 4.766 4.766 0 0 0-1.39-.465v-5.08c.46-.075.929-.232 1.39-.466a6.678 6.678 0 0 0 1.683-1.236A6.622 6.622 0 0 0 8.791 3.03a4.53 4.53 0 0 0 .444-1.511h7.788V.316H5.641a2.412 2.412 0 0 0-2.407 2.408v12.649A2.412 2.412 0 0 0 5.64 17.78h21.684a2.413 2.413 0 0 0 2.408-2.407V2.723A2.413 2.413 0 0 0 27.325.317zm.36 4.655a5.488 5.488 0 0 1-1.377-1.014 5.432 5.432 0 0 1-1.051-1.451 3.492 3.492 0 0 1-.319-.988h2.387c.331 0 .63.134.851.355.22.22.355.52.355.851v2.56a3.766 3.766 0 0 1-.847-.313zM4.79 1.872a1.2 1.2 0 0 1 .851-.355h2.387a3.492 3.492 0 0 1-.318.988c-.235.486-.59.991-1.051 1.452-.437.437-.914.779-1.377 1.013-.294.15-.58.25-.847.312V2.724c0-.332.135-.63.355-.852zm0 14.352a1.2 1.2 0 0 1-.355-.851v-2.56c.267.063.553.163.847.313.463.234.94.576 1.377 1.014.46.46.816.965 1.05 1.451.17.35.273.687.32.988H5.64c-.331 0-.63-.135-.85-.355zm23.386 0a1.2 1.2 0 0 1-.851.355h-2.387c.046-.301.15-.64.319-.988.234-.486.59-.99 1.05-1.451.438-.438.914-.78 1.377-1.014.294-.15.58-.25.847-.312v2.559c0 .33-.134.63-.355.85z"-->
              <!--&gt;</path>-->
              <!--<path-->
              <!--d="M12.844 9.08a3.64 3.64 0 1 0 7.28-.001 3.64 3.64 0 0 0-7.28 0zm6.077 0c0 .675-.272 1.28-.714 1.724a2.428 2.428 0 0 1-1.724.714c-.675 0-1.28-.272-1.724-.714a2.428 2.428 0 0 1-.714-1.724c0-.675.272-1.281.714-1.724a2.428 2.428 0 0 1 1.724-.714c.675 0 1.28.272 1.724.714.442.443.714 1.049.714 1.724z"-->
              <!--&gt;</path>-->
              <!--<circle cx="10.222" cy="5.096" r="1.001"></circle>-->
              <!--<circle cx="22.782" cy="13.001" r="1.001"></circle>-->
              <!--<path-->
              <!--d="M25.21 19.19a1.2 1.2 0 0 1-.851.355H2.675a1.2 1.2 0 0 1-.851-.355 1.2 1.2 0 0 1-.355-.851V5.69c0-.331.134-.63.355-.851a1.2 1.2 0 0 1 .851-.355V3.283A2.413 2.413 0 0 0 .267 5.69v12.65a2.413 2.413 0 0 0 2.408 2.407H24.36a2.413 2.413 0 0 0 2.407-2.408h-1.201c0 .33-.135.63-.355.851z"-->
              <!--&gt;</path>-->
              <!--</g></svg-->
              <!--&gt;Pay Now</span-->
              <!--&gt;-->
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <OrderDetailsPopup />
  </div>
</template>

<script>
/*global $*/
import OrderDetailsPopup from '@/components/pos/content/OrderDetailPopup'
import { mapState, mapGetters, mapActions } from 'vuex'
import DateTime from '@/mixins/DateTime'
import LookupData from '@/plugins/helpers/LookupData'
import DineInService from '../../../services/data/DineInService'

export default {
  name: 'OrderList',
  components: {
    OrderDetailsPopup,
  },
  props: {
    tabName: String,
  },
  data() {
    return {
      orderDetails: false,
    }
  },
  updated() {
    let scope = this
    $('#running-order tbody .dine-table-content').each(function() {
      let orderDateTime = $(this)
        .find('.order-time-det #ordertime')
        .val()
      setInterval(() => {
        orderDateTime = parseInt($.trim(orderDateTime))
        let orderTime = scope.timerClock(orderDateTime)
        $(this)
          .find('span.runningtime')
          .html(orderTime)
      }, 1000)
    })
  },
  mixins: [DateTime],
  computed: {
    ...mapState('location', ['timezoneString']),
    ...mapGetters('location', ['_t']),
    ...mapState('dinein', ['orders']),
    ...mapGetters('dinein', ['getOrderStatus', 'getTableNumber']),
  },
  methods: {
    ...mapActions('order', ['selectedOrderDetails']),
    getOrderDetails(collection) {
      this.orderDetails = LookupData.get(collection)
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
    aboutToFinish(reservationId) {
      const params = [reservationId]
      DineInService.aboutToFinish(...params).then(response => {
        // eslint-disable-next-line no-console
        console.log(response.data)
      })
    },
    dineInComplete(reservationId) {
      const params = [reservationId]
      DineInService.dineInComplete(...params).then(response => {
        // eslint-disable-next-line no-console
        console.log(response.data)
      })
    },
  },
}
</script>

<style scoped>
span.open-details-popup.cursor-pointer.font-weight-bold.running-order-details {
  background-color: #e73030;
  padding: 8px;
  color: #fff;
  box-shadow: 0px 0px 3px 0 #191515;
  border-radius: 3px;
  line-height: 3;
}
.table-order-view {
  max-height: 100px;
  overflow: auto;
  float: left;
  width: 50%;
  padding-left: 8px;
}
.pay_now {
  color: #fff;
  padding-left: 6px;
  position: relative;
  bottom: 5px;
}
</style>
