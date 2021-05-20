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

/* eslint-disable no-console */
var audio_ready_item = new Audio('/sound/doorbell.ogg')
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
      if (!user) return false
      this.$socket.client.on(
        'kitchen-item-channel:App\\Events\\KitchenItemReady:' +
          store +
          user._id,
        function(message) {
          /*let message = {
        data: {
          assigned_to: '5e6f43c53b74fe088c58c642',
          brand_id: '5d9f2254d355b82f1543bd82',
          item_id: '5da2d626256e0107c8294868',
          item_no: 0,
          namespace: '5d90562cc6aee43328376de35d24920aafbc7d026e717f78',
          order_id: '60a3bdca8971261fe92ded74',
          store_id: store,
        },
      }*/
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
              // eslint-disable-next-line no-debugger
              debugger
              let item = { item: [], table: undefined, order_no: undefined }
              let item_details = response.item.items.find(
                item =>
                  item.no == socketData.item_no &&
                  item.entity_id == socketData.item_id
              )
              if (item_details) {
                item.item.push(item_details)
                let table = scope.allBookedTables.orders.find(
                  table => table._id === response.item.table_reservation_id
                )
                if (table) {
                  item.table = table
                }
                item.order_no = response.item.order_no
                scope.itemData.push(item)
                let notifications =
                  localStorage.getItem('ready_item_notification') || []
                if (notifications.length)
                  notifications = JSON.parse(notifications)
                notifications.push(item)
                localStorage.setItem(
                  'ready_item_notification',
                  JSON.stringify(notifications)
                )
                console.log(
                  scope.isAudioPlaying,
                  scope.itemData.length,
                  'ready item check'
                )
                setTimeout(() => {
                  if (!scope.isAudioPlaying && scope.itemData.length) {
                    console.log('inside log ready item check')
                    showModal('#item-notification')
                    scope.playSound()
                  }
                  scope.showScrollButtons()
                }, 300)
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
