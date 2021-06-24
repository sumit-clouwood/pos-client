<template>
  <!-- Online order popup -->
  <div class="modal online-order-modal" id="online-order" role="dialog">
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content color-dashboard-background">
        <div class="modal-header customer-header">
          <h4
            class="customer-title color-text-invert"
            v-if="onlineOrders.count"
          >
            {{
              _t(
                'Additional order are almost ready. Would you like to take them with you ?'
              )
            }}
          </h4>
          <h4 class="customer-title color-text-invert" v-else>
            {{ _t('No more orders') }}
          </h4>
          <button
            type="button"
            class="close pull-right color-text"
            data-dismiss="modal"
            @click="hideOnlineModal()"
          >
            &times;
          </button>
        </div>
        <Progress :msg="_t('Loading new orders') + '...'" v-if="loading" />
        <div>
          <div
            class="modal-body online-order-wrapper"
            v-if="onlineOrders.count"
          >
            <div class="table-responsive">
              <table v-if="onlineOrders.count" class="table table-block-page">
                <tbody>
                  <tr
                    :key="index"
                    v-for="(order, index) in onlineOrders.orders"
                  >
                    <td>
                      <div class="order-item">
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
                                <span
                                  class="btn-future"
                                  v-if="order.future_order_datetime !== ''"
                                >
                                  {{ _t('Future Order') }}</span
                                >
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
                              convertDatetime(
                                order.future_order_datetime,
                                timezoneString
                              )
                            }}
                          </div>
                          <div class="order_time" v-else>
                            {{
                              convertDatetime(
                                order.real_created_datetime,
                                timezoneString
                              )
                            }}
                          </div>
                          <div
                            class="button-block"
                            style="visibility: visible;"
                          >
                            <div>
                              <span
                                :key="LabelIndex"
                                style="margin: 0.2rem"
                                v-for="(label,
                                LabelIndex) in actionDetails.actionLabel"
                              >
                                <button
                                  @click.stop="
                                    updateOrder({
                                      order: order,
                                      orderType: order.order_type,
                                      actionTrigger:
                                        actionDetails.action[LabelIndex],
                                    })
                                  "
                                  class="button text-button btn btn-success"
                                  type="button"
                                >
                                  <div class="button-content-container">
                                    <div class="button-icon-container"></div>
                                    <div class="button-caption">
                                      {{
                                        actionDetails.actionLabel[LabelIndex]
                                      }}
                                    </div>
                                  </div>
                                </button>
                              </span>
                            </div>
                          </div>
                          <div v-if="branch[order.store_id]">
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
                                  <span v-if="item.qty > 0"
                                    >+{{ item.qty }}</span
                                  >
                                  {{ item.name }}
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
                            <div
                              class="order-address"
                              v-if="order.order_building"
                            >
                              <div class="order-delivery-area">
                                <span v-if="order.order_flat_number">
                                  {{ order.order_flat_number }},</span
                                >
                                <span v-if="order.order_building">
                                  {{ order.order_building }},</span
                                >
                                <span v-if="order.order_street">
                                  {{ order.order_street }},</span
                                >
                                <span v-if="order.order_city">
                                  {{ order.order_city }}</span
                                >
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
              <InformationPopup
                :response-information="err"
                title="Information"
                :activated-class="'text-danger'"
              />
            </div>
          </div>
          <div class="modal-body text-center" v-else>
            <h4 class="customer-title color-text-invert">
              {{ _t('No more orders') }}
            </h4>
          </div>
        </div>
        <div class="modal-footer">
          <div class="btn-announce pull-right">
            <button
              type="button"
              class="btn btn-danger cancel-announce"
              data-dismiss="modal"
              @click="hideOnlineModal()"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-console */

import { mapState, mapActions, mapGetters } from 'vuex'
import DateTime from '@/mixins/DateTime'
import InformationPopup from '@/components/pos/content/InformationPopup'
import Progress from '@/components/util/Progress'

var audio = new Audio('https://d3jjfdwi6rnqlf.cloudfront.net/doorbell.mp3')
var nopromise = {
  catch: new Function(),
}
audio.load()
audio.addEventListener(
  'ended',
  function() {
    this.currentTime = 0
    this.load()
    let promise = this.play() || nopromise
    promise.catch(error => console.log(error))
  },
  false
)

/* global $ */
export default {
  name: 'OnlineOrder',
  data() {
    return {
      lastOrderId: '',
      isAudioPlaying: false,
      dateTime: '',
      err: null,
      activeIndex: [],
      actionDetails: {
        moreDetails: false,
        actionLabel: ['Accept', 'Reject'],
        action: ['delivery_accept', 'delivery_reject'],
        nextOrderStatus: 'in-progress',
      },
    }
  },
  components: {
    Progress,
    InformationPopup,
  },
  mixins: [DateTime],
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState('location', ['timezoneString', 'store']),
    ...mapState({
      orderStatus: state => state.deliveryManager.deliveryOrderStatus,
    }),
    ...mapState('order', ['alert']),
    ...mapState({
      branch: state => state.deliveryManager.availableStores,
    }),
    ...mapGetters('deliveryManager', ['drivers', 'onlineOrders']),
    ...mapState('deliveryManager', [
      'loading',
      // 'availableStores',
      // 'deliveryOrderStatus',
    ]),
    privateContext() {
      return this.$store.state.auth.token
    },
  },
  updated() {
    if (!this.onlineOrders.count) {
      this.pauseSound()
    }
  },
  methods: {
    ...mapActions('deliveryManager', ['showOrderDetails']),
    updateOrder(data) {
      this.$store.commit('deliveryManager/SET_LOADING', true)
      this.updateOrderAction(data)
        .then(() => {
          this.$store.dispatch('deliveryManager/getOnlineOrders')
        })
        .catch(er => {
          this.err = er.data ? er.data.error : er.message
          if (this.err) $('.information-popup').modal('show')
        })
    },
    hideOnlineModal() {
      $('.online-order-modal').hide()
      $('#online-order')
        .dialog()
        .dialog('close')
    },

    onlineOrderSetup() {
      if (process.env.VUE_APP_SOCKET_DISABLE) {
        return false
      }
      // let scope = this
      this.$socket.$subscribe('online-order-channel', payload => {
        this.getOnlineOrders(payload)
      })
    },
    playSound() {
      console.log('play sound')
      let promise = audio.play() || nopromise
      promise.catch(error => {
        console.log(error)
      })
      // this.isAudioPlaying = true
    },
    pauseSound() {
      console.log('pausing sound')
      let promise = audio.pause() || nopromise
      promise.catch(error => {
        console.log(error)
      })
      // this.isAudioPlaying = false
    },
    getOnlineOrders(payload) {
      let storeId = this.store ? this.store._id : this.$route.params.store_id
      let scope = this
      if (
        payload.data.store_id == storeId &&
        this.lastOrderId !== payload.data.order_id
      ) {
        this.lastOrderId = payload.data.order_id
        this.$store.dispatch('deliveryManager/getOnlineOrders').then(() => {
          if (scope.onlineOrders.count > 0 && scope.privateContext) {
            if (payload.data.action_id === 'add') {
              $('#online-order')
                .dialog()
                .dialog('open')
              if (!scope.isAudioPlaying) scope.playSound()
            }
          }
          // clearTimeout(scope.interval)
        })
      }
    },
    ...mapActions('deliveryManager', ['selectDriver']),
    ...mapActions('order', ['selectedOrderDetails', 'updateOrderAction']),
  },
  created() {
    this.onlineOrderSetup()
  },
  mounted() {},
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/variables.scss';

.table-responsive {
  max-height: 65vh;
}
.order-item {
  margin: 0;
}
.table tr {
  border-top: 1px solid #dee2e6;
}
.table tr td {
  border-top: none;
}
.order-item .order-header {
  grid-template-columns: 1.5fr 2fr;
}
.order_price,
#online-order .button-block {
  text-align: right;
}
.order_time,
#online-order .button-block {
  padding-top: 12px;
}
.main-item {
  color: #808282;
  margin-bottom: 4px;
}
.order-item .order-body .order-items-list .modifiers {
  font-size: 14px;
  color: #808282;
}
.order-footer {
  min-height: 40px;
}
.button-block span {
  margin: 0;
}

.order-delivery-area {
  width: 95% !important;
  margin: auto;
  max-height: 41px;
  overflow: scroll;
}
.btn-future {
  padding: 0.125rem 0.25rem;
  border-radius: 4px;
  margin-left: 0.75rem;
  font-weight: bold;
  background: blueviolet;
  color: #fff;
}
.active {
  background-color: blueviolet;
}
@media only screen and (max-width: 960px) and (min-width: 320px) {
  .modal {
    position: fixed !important;
  }
}
@media (max-width: 767px) {
  tbody {
    grid-template-columns: 1fr 1fr !important;
  }
  .table tr {
    margin-bottom: 10px;
  }
}
@media (max-width: 568px) {
  tbody {
    grid-template-columns: 1fr !important;
  }
  tbody {
    display: table-row-group;
  }
}
tbody {
  grid-row-start: 1;
  grid-row-end: 2;
  overflow: auto;
  display: grid;
  grid-column-gap: $px10;
  grid-row-gap: $px10;
  padding: $px16 $px8;
  word-break: break-word;
  grid-template-columns: 1fr 1fr 1fr;
}
.modal-dialog {
  width: 100% !important;
}
#online-order .modal-dialog {
  max-width: 88.5rem;
}
.online-order-modal {
  z-index: 999;
}
.runningtimes {
  width: 100%;
  display: grid;
  text-align: center;
}
</style>
