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
        <tr :key="index" v-for="(order, index) in orders">
          <td
            v-if="order.order_status == orderStatus"
            :class="{ active: activeIndex.includes(order._id) }"
          >
            <div
              class="order-item"
              :class="{ active: activeIndex.includes(order._id) }"
              @click="
                ;(jeeblyEnabled || tawseelEnabled || oneClickEnabled) &&
                actionDetails.action == 'delivery_ready'
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
                <div class="order_time">
                  {{
                    convertDatetime(order.real_created_datetime, timezoneString)
                  }}
                </div>
                <div class="button-block" style="visibility: visible;">
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
                      v-else-if="typeof actionDetails.actionLabel == 'object'"
                    >
                      <span
                        :key="LabelIndex"
                        style="margin: 0.2rem"
                        v-for="(label, LabelIndex) in actionDetails.actionLabel"
                      >
                        <button
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
                            <div class="button-caption">
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
                <div>
                  {{ branch[order.store_id]['name'] }}
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
                class="order-footer"
                :class="{ active: activeIndex.includes(order._id) }"
              >
                <!--<span class="timeago elapsedTime delManTime" title=""></span>-->

                <div class="runningtimes">
                  <div class="order-address" v-if="order.order_building">
                    <div class="order-delivery-area">
                      {{ order.order_flat_number }}, {{ order.order_building }},
                      {{ order.order_street }},
                      {{ order.order_city }}
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
                    }}</span
                  >
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
    <InformationPopup
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
    }
  },
  components: {
    InformationPopup,
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
    this.activeIndex = this.jeeblyOrder
  },
  updated() {
    clearInterval(this.orderTime)
  },
  destroyed() {
    clearInterval(this.orderTime)
  },
  methods: {
    ...mapActions('deliveryManager', ['showOrderDetails']),
    updateOrder(data) {
      // if (this.activeIndex.includes(data.order._id)) {
      //   const index = this.activeIndex.indexOf(data.order._id)
      //   if (index > -1) {
      //     this.activeIndex.splice(index, 1)
      //   }
      //   this.$store.commit('location/SET_ORDER_JEEBLY', this.activeIndex)
      // }
      this.updateOrderAction(data)
        .then(() => {})
        .catch(er => {
          this.err = er.data ? er.data.error : er.message
          $('.information-popup').modal('show')
        })
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
  background-color: blueviolet;
}

tbody {
  grid-row-start: 1;
  grid-row-end: 2;
  overflow: auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: $px10;
  grid-row-gap: $px10;
  padding: $px40 $px60;
  word-break: break-word;
  grid-template-columns: 1fr 1fr 1fr 1fr;
}
.displayOrder {
  display: block;
}
</style>
