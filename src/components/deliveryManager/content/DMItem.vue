<template>
  <div class="table-responsive">
    <table v-if="orders.length" class="table table-block-page">
      <!--<thead>
                      <tr>
                        <th class="sortable ">
                          <span title="" class="heading">Block</span
                          ><span class="sort-icon float-right fas fa-sort"></span>
                        </th>
                      </tr>
                    </thead>-->
      <!--<tfoot>
          <tr>
            <td colspan="1">Paginations</td>
          </tr>
        </tfoot>-->
      <tbody>
        <tr
          :key="index"
          v-for="(order, index) in orders"
          :class="'class' + order._id"
        >
          <td
            v-if="
              order.order_status == orderStatus &&
                order.order_type !== CONST.ORDER_TYPE_DINE_IN
            "
            :class="{ active: activeIndex.includes(order._id) }"
          >
            <div
              class="order-item"
              :class="[
                activeIndex.includes(order._id) ? 'active' : '',
                order.driver !== '' && actionDetails.action == 'delivery_ready'
                  ? 'overlay-busy-store'
                  : '',
              ]"
              @click="
                ;(jeeblyEnabled ||
                  tawseelEnabled ||
                  oneClickEnabled ||
                  careemNowEnabled) &&
                actionDetails.action == 'delivery_ready' &&
                order.driver == ''
                  ? AssigneeOrder({
                      order: order,
                      orderType: order.order_type,
                      actionTrigger: 'addToDriverBucket',
                    })
                  : null
              "
            >
              <div class="order-header">
                <div class="number-id-button">
                  <span class="order-id">
                    <span
                      @click="selectedOrderDetails(order._id)"
                      class="open-details-popup cursor-pointer"
                      data-dismiss="modal"
                      data-target=".bd-example-modal-lg"
                      data-toggle="modal"
                    >
                      #{{ order.order_no }}
                    </span>
                  </span>
                </div>
                <div class="order_price-container">
                  <div class="order_price">
                    {{ order.balance_due + ' ' + order.currency }}
                  </div>
                </div>
                <div
                  class="order_time"
                  v-if="order.future_order_datetime !== ''"
                >
                  {{
                    convertDatetime(order.future_order_datetime, timezoneString)
                  }}
                </div>
                <div class="order_time" v-else>
                  {{
                    convertDatetime(order.real_created_datetime, timezoneString)
                  }}
                </div>
                <div
                  class="button-block"
                  v-if="processedOrder.includes(order._id)"
                >
                  <button
                    class="button text-button btn btn-success"
                    type="button"
                  >
                    <div class="button-content-container">
                      <div class="button-icon-container">
                        <!---->
                      </div>
                      <div class="button-caption" :style="{ opacity: 1 }">
                        <i class="fa fa-circle-o-notch fa-spin"></i>
                        {{ _t('wait') }}
                      </div>
                    </div>
                  </button>
                </div>
                <div v-else class="button-block" style="visibility: visible;">
                  <div v-if="actionDetails.action != ''">
                    <span
                      v-if="
                        orderStatus == 'ready' && actionDetails.driverId == ''
                      "
                    >
                      <span class="select-driver-caption assign_driver">
                        {{ _t('Select driver') }}
                      </span>
                    </span>
                    <div
                      v-else-if="
                        order.order_system_status == 'requires_acceptance'
                      "
                    >
                      <span
                        :key="LabelIndex"
                        style="margin: 0.2rem"
                        v-for="(label, LabelIndex) in acceptDetails.actionLabel"
                      >
                        <button
                          @click.stop="
                            updateOrder({
                              order: order,
                              orderType: order.order_type,
                              actionTrigger: acceptDetails.action[LabelIndex],
                            })
                          "
                          class="button text-button btn btn-success"
                          type="button"
                        >
                          <div class="button-content-container">
                            <div class="button-icon-container">
                              <!---->
                            </div>
                            <div class="button-caption" :style="{ opacity: 1 }">
                              {{ acceptDetails.actionLabel[LabelIndex] }}
                            </div>
                          </div>
                        </button>
                      </span>
                    </div>
                    <div
                      v-else-if="typeof actionDetails.actionLabel == 'object'"
                    >
                      <span
                        :key="LabelIndex"
                        style="margin: 0.2rem"
                        v-for="(label, LabelIndex) in actionDetails.actionLabel"
                      >
                        <router-link
                          :to="
                            '/takeaway/' +
                              store.brand_id +
                              '/' +
                              order.store_id +
                              '/' +
                              order._id
                          "
                          v-if="
                            (actionDetails.action[LabelIndex] === 'pay' &&
                              !order.order_payments.length) ||
                              (actionDetails.action[LabelIndex] ===
                                'takeaway_ready' &&
                                !order.order_payments.length)
                          "
                          class="button text-button btn btn-success"
                          type="button"
                        >
                          <div class="button-content-container">
                            <div class="button-icon-container">
                              <!---->
                            </div>
                            <div class="button-caption" :style="{ opacity: 1 }">
                              {{ actionDetails.actionLabel[LabelIndex] }}
                            </div>
                          </div>
                        </router-link>
                        <button
                          v-else-if="actionDetails.action[LabelIndex] !== 'pay'"
                          @click.stop="
                            updateOrder({
                              order: order,
                              orderType: order.order_type,
                              actionTrigger: actionDetails.action[LabelIndex],
                            })
                          "
                          class="button text-button btn btn-success"
                          type="button"
                        >
                          <div class="button-content-container">
                            <div class="button-icon-container">
                              <!---->
                            </div>
                            <div class="button-caption" :style="{ opacity: 1 }">
                              {{ actionDetails.actionLabel[LabelIndex] }}
                            </div>
                          </div>
                        </button>
                      </span>
                    </div>
                    <button
                      v-else
                      @click.stop="
                        updateOrder({
                          order: order,
                          orderType: order.order_type,
                          actionTrigger: actionDetails.action,
                        })
                      "
                      class="button text-button btn btn-success"
                      type="button"
                    >
                      <div class="button-content-container">
                        <div class="button-icon-container">
                          <!---->
                        </div>
                        <div class="button-caption">
                          {{ actionDetails.actionLabel }}
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
                <!--<span
                  class="order-id cursor-pointer"
                  v-if="order.aggregator_data && order.aggregator_data.order_id"
                >
                  {{ _t('Talabat Order no') }} #
                  {{ order.aggregator_data.order_id }}
                </span>-->
                <span
                  class="order-id"
                  v-if="
                    order.aggregator_data &&
                      order.aggregator_data.order_id !== undefined
                  "
                >
                  <template
                    v-if="
                      order.aggregator_data.source ==
                        CONST.AGGREGATOR_SOURCE_TALABAT
                    "
                    >{{ _t('Talabat#') }}</template
                  >
                  <template v-if="isZomatoOrder(order)">{{
                    _t('Zomato#')
                  }}</template>
                  {{ order.aggregator_data.order_id }}
                </span>
                <div>
                  {{ branch[order.store_id]['name'] }}
                </div>
                <div
                  v-if="
                    order.driver !== '' &&
                      actionDetails.action == 'delivery_ready'
                  "
                  :style="{ opacity: 1 }"
                >
                  {{ _t('Order Assigned to delivery service') }}
                </div>
                <div></div>
              </div>
              <div class="order-body">
                <div class="order-items-list">
                  <div
                    :key="index"
                    class="order-name"
                    v-for="(i, index) in order.items"
                  >
                    <div class="main-item">
                      {{
                        typeof order.items[index] != 'undefined'
                          ? order.items[index].name
                          : ''
                      }}<span></span>
                    </div>
                    <div
                      :key="index"
                      class="modifiers"
                      v-for="(item, index) in order.item_modifiers"
                    >
                      <span v-if="item.for_item == i.no">
                        <span v-if="item.qty > 0">+{{ item.qty }}</span>
                        {{ item.name }}
                        <!--<img
                            class="food-icon"
                            src="https://fakeimg.pl/19x20/?text=Second&amp;font=lobster%22"
                          /><img
                            class="food-icon"
                            src="https://fakeimg.pl/19x19/?text=Second&amp;font=lobster%22"
                          />-->
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div
                :class="[
                  activeIndex.includes(order._id) ? 'active' : '',
                  order.driver !== '' &&
                  actionDetails.action == 'delivery_ready'
                    ? 'overlay-busy-store'
                    : '',
                  'order-footer',
                ]"
              >
                <!--<span class="timeago elapsedTime delManTime" title=""></span>-->

                <div class="runningtimes">
                  <div class="order-address" v-if="order.order_building">
                    <div class="order-delivery-area">
                      <span v-if="order.order_flat_number"
                        >{{ order.order_flat_number }},</span
                      >
                      <span v-if="order.order_building"
                        >{{ order.order_building }},</span
                      >
                      <span v-if="order.order_street"
                        >{{ order.order_street }},</span
                      >
                      <span v-if="order.order_city">{{
                        order.order_city
                      }}</span>
                    </div>
                  </div>
                  <span
                    style="font-size: 0.9rem; justify-content:center;"
                    v-else
                    :id="
                      'createdOrder-' +
                        convertDatetime(
                          order.real_created_datetime,
                          timezoneString,
                          'YYYY-MM-DD HH:mm:ss'
                        )
                    "
                    >{{
                      orderTimer(
                        convertDatetime(
                          order.real_created_datetime,
                          timezoneString,
                          'YYYY-MM-DD HH:mm:ss'
                        ),
                        timezoneString
                      )
                    }}
                  </span>
                </div>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <h5 v-else class="center-block text-center pt-5">
      {{ _t('No Orders Found') }}
    </h5>
    <CancelOtherOrdersPopup></CancelOtherOrdersPopup>
    <InformationPopup
      v-if="err"
      :response-information="err"
      title="Information"
      :activated-class="'text-danger'"
    />
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import DateTime from '@/mixins/DateTime'
import InformationPopup from '@/components/pos/content/InformationPopup'
import CancelOtherOrdersPopup from '@/components/transactions/content/orderDetails/CancelOtherOrdersPopup'
import * as CONST from '@/constants'

/* global $ */
export default {
  name: 'DMItem',
  data() {
    // eslint-disable-next-line no-console
    return {
      orderCount: 2,
      dateTime: '',
      err: null,
      activeIndex: [],
      processedOrder: [],
      acceptDetails: {
        moreDetails: false,
        actionLabel: ['Accept', 'Reject'],
        action: ['delivery_accept', 'delivery_reject'],
        nextOrderStatus: 'in-progress',
      },
    }
  },
  components: {
    InformationPopup,
    CancelOtherOrdersPopup,
  },
  props: {
    actionDetails: Object,
  },
  mixins: [DateTime],
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState('location', [
      'timezoneString',
      'store',
      'jeeblyOrder',
      'brand',
    ]),
    ...mapState({
      orderStatus: state => state.deliveryManager.deliveryOrderStatus,
    }),
    ...mapState('order', ['alert']),
    ...mapState({
      branch: state => state.deliveryManager.availableStores,
    }),
    ...mapGetters('deliveryManager', ['orders', 'drivers']),
  },
  created() {
    this.jeeblyEnabled = this.store.jeebly && this.brand.jeebly ? true : false
    this.tawseelEnabled =
      this.store.tawseel && this.brand.tawseel ? true : false
    this.oneClickEnabled =
      this.store.one_click && this.brand.one_click ? true : false
    this.careemNowEnabled =
      this.store.careem && this.brand.careem ? true : false
    this.activeIndex = this.jeeblyOrder
  },
  updated() {
    clearInterval(this.orderTime)
  },
  destroyed() {
    clearInterval(this.orderTime)
  },
  methods: {
    isZomatoOrder(order) {
      if (
        order['aggregator_data'] &&
        order['aggregator_data']['source'] == CONST.AGGREGATOR_SOURCE_ZOMATO
      )
        return true
      return false
    },
    ...mapActions('deliveryManager', ['showOrderDetails']),
    updateOrder(data) {
      let _class = '.class' + data.order._id
      this.order_status = false
      this.processedOrder.push(data.order._id)
      this.$store.commit('order/setZometoOrder', undefined)
      if (
        this.isZomatoOrder(data.order) &&
        data.actionTrigger === 'delivery_reject'
      ) {
        this.$store.commit('order/setZometoOrder', data.order)
        $('#cancellationReasonOtherOrders').modal('show')
        return true
      } else {
        this.updateOrderAction(data)
          .then(res => {
            if (res.data.status === 'ok') {
              // let item_block = document.getElementsByClassName(_class)
              for (let el of document.querySelectorAll(_class)) {
                el.style.visibility = 'hidden'
                el.style.display = 'none'
              }
              // item_block.style.display = 'none'
            }
          })
          .catch(er => {
            this.err = er.data ? er.data.error : er.message
            if (this.err) $('.information-popup').modal('show')
          })
      }
    },
    AssigneeOrder(data) {
      // eslint-disable-next-line no-console
      if (this.activeIndex.includes(data.order._id)) {
        const index = this.activeIndex.indexOf(data.order._id)
        if (index > -1) {
          this.activeIndex.splice(index, 1)
        }
        this.$store.commit('location/SET_ORDER_JEEBLY', this.activeIndex)
        return false
      }
      this.activeIndex.push(data.order._id)
      this.$store.commit('location/SET_ORDER_JEEBLY', this.activeIndex)
    },
    ...mapActions('deliveryManager', ['selectDriver']),
    ...mapActions('order', ['selectedOrderDetails', 'updateOrderAction']),
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/variables.scss';
.order-delivery-area {
  width: 95% !important;
  margin: auto;
}
.active {
  background-color: rgba(127, 177, 121, 0.93);
}

tbody {
  grid-row-start: 1;
  grid-row-end: 2;
  overflow: auto;
  display: grid;
  grid-column-gap: $px10;
  grid-row-gap: $px10;
  padding: $px40 $px60;
  word-break: break-word;
  grid-template-columns: 1fr 1fr 1fr 1fr;
}
.displayOrder {
  display: block;
}
.overlay-busy-store {
  background: rgba(225, 0, 0, 0.3);
}
.Overlay-show-driver {
  opacity: 1;
}
</style>
