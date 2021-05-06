<template>
  <div
    class="modal fade"
    id="item-notification"
    role="dialog"
    v-show="itemData"
  >
    <div class="modal-dialog modal-dialog-centered">
      <!-- Modal content-->
      <div class="modal-content color-dashboard-background">
        <div class="modal-header customer-header color-secondary">
          <h4 class="customer-title color-text-invert">
            {{ _t('Item Ready') }}
          </h4>
        </div>
        <div class="modal-body">
          <div>
            <strong v-if="orderData">
              {{ _t('Order Number: ') }}{{ orderData.order_no }}
            </strong>
            <br />
            <strong v-if="itemData">
              {{ _t('Table Number:') }} {{ itemData.table.number }}
            </strong>
            <hr />
            <br />
            <span v-if="itemData"
              >{{ itemData.name }} {{ _t('is ready') }}</span
            >
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
    <!--<information-popup
      :responseInformation="this.msg"
      title="Alert"
    ></information-popup>-->
  </div>
</template>

<script>
/* eslint-disable no-console */

/* global showModal hideModal */
// import InformationPopup from '@/components/pos/content/InformationPopup'
var audio = new Audio('/sound/Store_Door_Chime.mp3')
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
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'ReadyItemNotification',
  data() {
    return {
      orderData: undefined,
      itemData: undefined,
      msg: '',
      isAudioPlaying: false,
    }
  },
  // components: {InformationPopup,},
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
    noted: function() {
      this.itemData = undefined
      this.orderData = undefined
      hideModal('#item-notification')
      this.pauseSound()
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
    fetchReadyItemsBySocket() {
      if (process.env.VUE_APP_SOCKET_DISABLE) {
        return false
      }
      let store = this.store._id
      let scope = this
      let user = this.userDetails ? this.userDetails.item : false
      if (!user) return false
      // eslint-disable-next-line no-console
      console.log(this.$socket, 'this.$socket')
      this.$socket.client.on(
        'kitchen-item-channel:App\\Events\\KitchenItemReady:' +
          store +
          user._id,
        function(message) {
          /*let message = {
        data: {
          assigned_to: '5d24920aafbc7d026e717f78',
          brand_id: '5d904ed3c6aee432ec723c32',
          item_id: '5d905a07c6aee4334e7e2393',
          item_no: 1,
          namespace: '5d90562cc6aee43328376de35d24920aafbc7d026e717f78',
          order_id: '608fbfe5b9ef912ab75fd263',
          store_id: '5d90562cc6aee43328376de3',
        },*/
          // eslint-disable-next-line no-console
          console.log(message)
          let socketData = message.data
          scope.$store
            .dispatch(
              'order/fetchOrderDetailsOnly',
              socketData.order_id,
              {},
              { root: true }
            )
            .then(response => {
              scope.orderData = response.item
              let item = response.item.items.find(
                item =>
                  item.no == socketData.item_no &&
                  item.entity_id == socketData.item_id
              )
              if (item) {
                item.table = scope.allBookedTables.orders.find(
                  table => table._id === scope.orderData.table_reservation_id
                )
                scope.itemData = item
                showModal('#item-notification')
                if (!scope.isAudioPlaying) scope.playSound()
              }
            })
          // alert('Socket Run for item ready : ' + JSON.stringify(message))
        }
      )
      /*this.$socket.$subscribe(
        'kitchen-item-channel:App\\Events\\KitchenItemReady:' +
          store +
          user._id,
        payload => {
          // eslint-disable-next-line no-console
          console.log(payload)
          alert('Socket Run for item ready : ' + JSON.stringify(payload))
        }
      )*/
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/pixels_rem.scss';
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';

@include responsive(mobile) {
  #switchWaiter {
    overflow: hidden !important;
    .modal-dialog {
      max-width: 100% !important;
      margin: 0 !important;
      margin-top: 2rem !important;
      .modal-content {
        width: 95% !important;
        margin: auto !important;
        .modal-body {
          padding-left: 0 !important;
          padding-right: 0 !important;
          width: 90%;
        }
        #available-tables {
          width: 100%;
          .table-status-container {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      }
    }
  }
}
</style>
