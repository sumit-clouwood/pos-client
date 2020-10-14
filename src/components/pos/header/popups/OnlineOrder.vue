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
import { mapState, mapActions, mapGetters } from 'vuex'
import DateTime from '@/mixins/DateTime'
import InformationPopup from '@/components/pos/content/InformationPopup'
import Progress from '@/components/util/Progress'

var audio = new Audio('/sounds/doorbell.ogg')
audio.load()
audio.addEventListener(
  'ended',
  function() {
    this.currentTime = 0
    this.play()
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
  },
  updated() {
    // eslint-disable-next-line no-console
    //console.log('update', this.onlineOrders.count)
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
          $('.information-popup').modal('show')
        })
    },
    hideOnlineModal() {
      // eslint-disable-next-line no-console
      console.log('hide', $('#online-order'), 'ff')
      $('.online-order-modal').hide()
      $('#online-order')
        .dialog()
        .dialog('close')
    },
    playSound() {
      // eslint-disable-next-line prettier/prettier
      audio.play()
      this.isAudioPlaying = true
    },
    onlineOrderSetup() {
      let scope = this
      let storeId = this.store ? this.store._id : this.$route.params.store_id
      this.$socket.$subscribe('online-order-channel', payload => {
        // eslint-disable-next-line no-console
        console.log(
          'payload',
          payload,
          scope.lastOrderId,
          payload.data.order_id
        )
        if (
          payload.data.store_id == storeId &&
          scope.lastOrderId !== payload.data.order_id
        ) {
          scope.lastOrderId = payload.data.order_id
          this.$store.dispatch('deliveryManager/getOnlineOrders').then(() => {
            // eslint-disable-next-line no-console
            console.log(payload)
            if (payload.data.action_id === 'add') {
              // eslint-disable-next-line no-console
              console.log(
                'onlineOrders',
                scope.onlineOrders.count,
                storeId,
                scope.isAudioPlaying
              )
              $('#online-order')
                .dialog()
                .dialog('open')
              if (!scope.isAudioPlaying) scope.playSound()
              // clearTimeout(scope.interval)
            }
          })
        }
      })
    },
    pauseSound() {
      this.pause()
      $('#online-order')
        .dialog()
        .dialog('close')
    },
    pause() {
      audio.pause()
      this.isAudioPlaying = false
    },
    getOnlineOrders() {
      // eslint-disable-next-line no-console
      let scope = this
      this.$store.dispatch('deliveryManager/getOnlineOrders').then(() => {
        // eslint-disable-next-line no-console
        // eslint-disable-next-line no-console
        console.log(scope.onlineOrders, 'onlineOrders')
        if (scope.onlineOrders.count > 0) {
          $('#online-order')
            .dialog()
            .dialog('open')
          if (!scope.isAudioPlaying) scope.playSound()
        } else {
          // if (scope.isAudioPlaying) scope.pause()
        }
        // clearTimeout(scope.interval)
      })
    },
    ...mapActions('deliveryManager', ['selectDriver']),
    ...mapActions('order', ['selectedOrderDetails', 'updateOrderAction']),
  },
  created() {
    this.onlineOrderSetup()
    this.getOnlineOrders()
    // eslint-disable-next-line no-console
    console.log(this.onlineOrders)
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
  grid-column-gap: $px10;
  grid-row-gap: $px10;
  padding: $px40 $px60;
  word-break: break-word;
  grid-template-columns: 1fr 1fr 1fr;
}
.modal-dialog {
  width: 100% !important;
}
#online-order .modal-dialog {
  max-width: 88.5rem;
}
.runningtimes {
  width: 100%;
  display: grid;
  text-align: center;
}
</style>
