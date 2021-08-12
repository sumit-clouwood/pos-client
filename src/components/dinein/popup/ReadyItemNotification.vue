<template>
  <div
    class="modal fade"
    id="item-notification"
    data-backdrop="static"
    data-keyboard="false"
    role="dialog"
    v-show="itemData.length"
  >
    <div class="modal-dialog modal-dialog-centered">
      <!-- Modal content-->
      <div class="modal-content color-dashboard-background">
        <div class="modal-header scrollomer-header color-secondary">
          <h4 class="scrollomer-title color-text-invert">
            {{ _t('Item Ready') }}
          </h4>
        </div>
        <scroll-buttons
          containerId="ready-item-container"
          scrollTo="130"
        ></scroll-buttons>
        <div class="modal-body">
          <div id="ready-item-container">
            <div v-for="(item_details, index) in itemData" :key="index">
              <div class="order-table-details">
                <span>
                  {{ _t('Order Number: ') }}
                  <b>#{{ item_details.order_no }}</b>
                </span>
                <span v-if="item_details.table">
                  {{ _t('Table Number:') }}
                  <b>{{ item_details.table.number }}</b>
                </span>
                <span v-else> NA </span>
              </div>
              <div
                class="item-ready"
                v-for="item in item_details.item"
                :key="item._id"
              >
                {{ _t('Ready to serve') }} : <b> {{ item.name }} </b>
              </div>
              <hr />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <div class="btn-announce">
            <button
              class="btn btn-success btn-large color-main color-text-invert"
              type="button"
              id="discount-save-btn"
              @click="noted"
            >
              {{ _t('ok') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-console */
/* global showModal hideModal $ */
import { bus } from '@/eventBus'

/* eslint-disable no-console */
var audio_ready_item = new Audio(
  'https://d3jjfdwi6rnqlf.cloudfront.net/doorbell.mp3'
)
var nopromise = {
  catch: new Function(),
}
audio_ready_item.load()
audio_ready_item.addEventListener(
  'ended',
  function() {
    this.currentTime = 0
    this.load()
    let promise = this.play() || nopromise
    promise.catch(error => console.log(error))
  },
  false
)
import { mapGetters, mapState } from 'vuex'
import ScrollButtons from '@/components/util/ScrollButtons'
export default {
  name: 'ReadyItemNotification',
  components: { ScrollButtons },
  data() {
    return {
      itemData: [],
      // showPopup: false,
      msg: '',
      isAudioPlaying: false,
    }
  },
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState('location', ['store']),
    ...mapState('dinein', ['allBookedTables']),
    ...mapState('auth', ['userDetails']),
  },
  created() {
    bus.$on('stopCarhopNotificationSound', option => {
      if (!option && this.$store.state.order.orderType.OTApi === 'carhop') {
        this.pauseSound()
      }
    })
    this.fetchReadyItemsBySocket()
  },
  methods: {
    showScrollButtons() {
      let scroll_height = $('#ready-item-container')[0].scrollHeight
      let height_ = $('#ready-item-container').height()
      if (scroll_height > height_) {
        $('.scroll-top-arrow, .scroll-bottom-arrow').removeClass('disable')
      } else {
        $('.scroll-top-arrow, .scroll-bottom-arrow').addClass('disable')
      }
    },
    noted: function() {
      this.itemData = []
      // this.showPopup = false
      hideModal('#item-notification')
      this.pauseSound()
    },
    playSound() {
      console.log('play sound')
      let promise = audio_ready_item.play() || nopromise
      this.isAudioPlaying = true
      promise.catch(error => {
        console.log(error)
      })
    },
    pauseSound() {
      console.log('pausing sound')
      let promise = audio_ready_item.pause() || nopromise
      this.isAudioPlaying = false
      this.itemData = []
      promise.catch(error => {
        console.log(error)
      })
    },
    fetchReadyItemsBySocket() {
      if (process.env.VUE_APP_SOCKET_DISABLE) {
        return false
      }
      let store = this.store._id
      let scope = this
      let user = this.userDetails ? this.userDetails.item : false
      this.$socket.client.on(
        'store-notification-channel:App\\Events\\StoreNotification:' + store,
        function(socket_notification) {
          let notifications =
            localStorage.getItem('qr_table_notification') || []
          if (notifications.length) {
            notifications = JSON.parse(notifications)
          }
          notifications.push(socket_notification.data)
          scope.$store.commit('dinein/QR_TABLE_NOTIFICATION', notifications)
          localStorage.setItem(
            'qr_table_notification',
            JSON.stringify(notifications)
          )
        }
      )
      if (!user) return false
      /*let message = {
        data: {
          assigned_to: '5e6f43c53b74fe088c58c642',
          brand_id: '5d9f2254d355b82f1543bd82',
          item_id: '5da3100b3dba6d5b8b1f4602',
          item_no: 1,
          namespace: '5d9f24ac85f9e71d726b65c25e6f43c53b74fe088c58c642',
          notification: 'carhop_ready',
          order_id: '60b9b6c3d6b40a063173f274',
          store_id: store,
        },
      }*/
      this.$socket.client.on(
        'kitchen-item-channel:App\\Events\\KitchenItemReady:' +
          store +
          user._id,
        function(message) {
          // eslint-disable-next-line no-console
          console.log(message, 'ready item')
          let socketData = message.data
          scope.$store
            .dispatch(
              'order/fetchOrderDetailsOnly',
              socketData.order_id,
              {},
              { root: true }
            )
            .then(response => {
              if (socketData.notification === 'kitchen_item_ready') {
                let is_item_duplicate = false
                let item = { item: [], table: undefined, order_no: undefined }
                let item_details = response.item.items.find(
                  item =>
                    item.no == socketData.item_no &&
                    item.entity_id == socketData.item_id
                )
                console.log(item_details, 'item_details')
                if (item_details) {
                  /* Worked according to response.item.order_type -- dine_in / or carhop*/
                  item.item.push(item_details)
                  let table = scope.allBookedTables.orders.find(
                    table => table._id === response.item.table_reservation_id
                  )
                  if (table) {
                    item.table = table
                  }
                  item.order_no = response.item.order_no
                  let notifications =
                    localStorage.getItem('ready_item_notification') || []
                  if (notifications.length) {
                    notifications = JSON.parse(notifications)
                    notifications.forEach(data => {
                      if (data.item.length) {
                        data.item.forEach(stored_item => {
                          if (
                            stored_item.entity_id === item_details.entity_id &&
                            data.order_no === item.order_no
                          ) {
                            is_item_duplicate = true
                          }
                        })
                      }
                    })
                  }
                  scope.itemData.push(item)
                  if (!is_item_duplicate) {
                    notifications.push(item)
                    scope.$store.commit(
                      'dinein/READY_ITEM_NOTIFICATION',
                      notifications
                    )
                    localStorage.setItem(
                      'ready_item_notification',
                      JSON.stringify(notifications)
                    )
                  }
                  setTimeout(() => {
                    console.log(scope.itemData, scope.isAudioPlaying, 'ID')
                    if (!scope.isAudioPlaying && scope.itemData.length) {
                      console.log('inside log ready item check')
                      if (
                        scope.$store.state.order.orderType.OTApi == 'dine_in'
                      ) {
                        showModal('#item-notification')
                        scope.playSound()
                        scope.showScrollButtons()
                      } else {
                        hideModal('#item-notification')
                        scope.pauseSound()
                      }
                    }
                  }, 300)
                }
              }
              if (socketData.notification === 'carhop_ready') {
                let is_order_duplicate = false
                let order_details = response.item
                let notifications =
                  localStorage.getItem('carhop_order_notification') || []
                if (notifications.length) {
                  notifications = JSON.parse(notifications)
                  notifications.forEach(order => {
                    if (order._id === order_details._id) {
                      is_order_duplicate = true
                    }
                  })
                }
                console.log(
                  is_order_duplicate,
                  order_details,
                  notifications,
                  'duplicate_carhop'
                )
                if (!is_order_duplicate) {
                  notifications.push(order_details)
                  scope.$store.commit(
                    'carhop/READY_ORDER_NOTIFICATION',
                    notifications
                  )
                  localStorage.setItem(
                    'carhop_order_notification',
                    JSON.stringify(notifications)
                  )
                }
                if (order_details) {
                  setTimeout(() => {
                    console.log(scope.itemData, scope.isAudioPlaying, 'ID')
                    if (!scope.isAudioPlaying) {
                      console.log(
                        'inside log ready item check',
                        scope.$store.state.order.orderType.OTApi
                      )
                      if (
                        scope.$store.state.order.orderType.OTApi == 'carhop'
                      ) {
                        scope.playSound()
                      } else {
                        scope.pauseSound()
                      }
                    }
                  }, 100)
                }
                /**/
              }
            })
        }
      )
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/pixels_rem.scss';
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';
.order-table-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  span {
    &:last-child {
      text-align: right;
    }
  }
  .item-ready {
    /**/
  }
}
#item-notification {
  .modal-body {
    padding: 45px 20px;
  }
}
#ready-item-container {
  max-height: $px335;
  overflow-x: hidden;
}
</style>
