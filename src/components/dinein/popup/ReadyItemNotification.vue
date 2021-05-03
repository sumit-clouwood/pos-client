<template>
  <div class="modal fade" id="switchWaiter" role="dialog">
    <div class="modal-dialog modal-dialog-centered">
      <!-- Modal content-->
      <div class="modal-content color-dashboard-background">
        <div class="modal-header customer-header color-secondary">
          <h4 class="customer-title color-text-invert">
            {{ _t('Item Ready') }}
          </h4>
        </div>
        <div class="modal-body row dining-options-block select-discount">
          <div id="available-tables" class="available-tables cursor-pointer">
            <div class="table-status-container">
              item is ready pizza
              {{ socketData }}
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
            <button
              type="button"
              class="btn btn-danger cancel-announce color-button color-text-invert"
              data-dismiss="modal"
              @click="noted"
            >
              {{ _t('Cancel') }}
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
// /* global $ */
// import InformationPopup from '@/components/pos/content/InformationPopup'
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'ReadyItemNotification',
  data() {
    return {
      socketData: null,
      msg: '',
    }
  },
  // components: {InformationPopup,},
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState('location', ['store']),
    ...mapState('auth', ['userDetails']),
  },
  created() {
    this.fetchReadyItemsBySocket()
  },
  methods: {
    noted: function() {
      this.selectedWaiter = 'no'
    },
    fetchReadyItemsBySocket() {
      if (process.env.VUE_APP_SOCKET_DISABLE) {
        return false
      }
      // var store = '5d90562cc6aee43328376de3';
      // var user = '5d24920aafbc7d026e717f78';
      // eslint-disable-next-line no-debugger
      debugger
      // var socket = io('https://websocket-stg.dimspos.com')
      let store = this.store._id
      let user = this.userDetails ? this.userDetails.item : false
      if (!user) return false
      // eslint-disable-next-line no-console
      console.log(this.$socket, 'this.$socket')
      this.$socket.client.on(
        'kitchen-item-channel:App\\Events\\KitchenItemReady:' +
          store +
          user._id,
        function(message) {
          // eslint-disable-next-line no-console
          console.log(message)
          this.socketData = message.data
          alert('Socket Run for item ready : ' + JSON.stringify(message))
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
