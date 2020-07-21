<template>
  <div
    id="Delivery-Service"
    class="modal fade"
    role="dialog"
    data-keyboard="false"
    data-backdrop="static"
  >
    <div class="modal-dialog modal-dialog-centered">
      <!-- Modal content-->
      <Preloader :msg="_t('Loading new orders') + '...'" v-if="loading" />
      <div class="modal-content" v-else>
        <div class="modal-header" style="background-color: rgb(245, 245, 245)">
          <h4 class="modal-title">{{ _t('Select Delivery Service') }}</h4>
        </div>
        <div class="modal-body stores-list-container">
          <div class="stores-list">
            <div v-for="(service, index) in deliveryServices" :key="index">
              <div
                class="store-picker-single-item"
                v-if="activeServices[service.id]"
                @click="SubmitOrder(service.name)"
              >
                <img
                  class="card-img-top"
                  v-bind:src="service.img"
                  alt="Card image cap"
                />
                <div class="store-name">{{ service.name }}</div>
                <div class="store-address">{{ store.address }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            v-if="this.$route.params.store_id"
            type="button"
            class="tables-btn-style"
            data-dismiss="modal"
          >
            {{ _t('Close') }}
          </button>
        </div>
      </div>
    </div>
    <InformationPopup :responseInformation="errorMessage" title="Alert" />
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import DateTime from '@/mixins/DateTime'
import DMService from '@/services/data/DeliveryManagerService'
/* global $ */
export default {
  name: 'DeliveryService',
  data() {
    return {
      loading: false,
      errorMessage: '',
      deliveryServices: [
        {
          name: 'Jeebly',
          id: 'jeebly',
          discription: '',
          img: 'img/delivery-services/jeebly.png',
        },
        {
          name: 'Tawseel',
          id: 'tawseel',
          discription: '',
          img: 'img/delivery-services/tawseel.png',
        },
        {
          name: 'One Click',
          id: 'one_click',
          discription: '',
          img: 'img/delivery-services/oneClick.png',
        },
      ],
    }
  },
  components: {},
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
    ...mapState('deliveryManager', ['section', 'selectedDriver']),
    ...mapState('order', ['alert']),
    ...mapState({
      branch: state => state.deliveryManager.availableStores,
    }),
    ...mapGetters('deliveryManager', ['onlineOrders', 'drivers']),
    activeServices: function() {
      // `this` points to the vm instance
      let jeebly = this.brand.jeebly && this.store.jeebly ? true : false
      let tawseel = this.brand.tawseel && this.store.tawseel ? true : false
      let one_click =
        this.brand.one_click && this.store.one_click ? true : false
      return {
        jeebly: jeebly,
        tawseel: tawseel,
        one_click: one_click,
      }
    },
  },
  methods: {
    ...mapActions('deliveryManager', ['showOrderDetails']),
    hideOnlineModal() {
      // eslint-disable-next-line no-console
      $('#Delivery-Service')
        .dialog()
        .toggle('close')
      // this.pauseSound()
    },
    SubmitOrder(deliveryService) {
      this.loading = true
      var driver = this.drivers.filter(function(el) {
        return el.name == deliveryService
      })
      this.selectDriver = driver[0]
      // eslint-disable-next-line no-console
      console.log(this.selectDriver)
      // eslint-disable-next-line no-debugger
      this.$store.commit(
        'deliveryManager/SET_SELECTED_DM_DRIVER',
        this.selectDriver._id
      )
      let orders = this.jeeblyOrder
      // eslint-disable-next-line no-console
      DMService.assignOrdersToDriver(this.selectedDriver, orders)
        .then(() => {
          this.$store.commit('location/SET_ORDER_JEEBLY', [])
          let dmautoloader = true
          this.$store.dispatch(
            'deliveryManager/fetchDMOrderDetail',
            dmautoloader
          )
          this.loading = false
          this.hideOnlineModal()
        })
        .catch(er => {
          // eslint-disable-next-line no-console
          this.errorMessage = er.data.error
          this.loading = false
          this.err = er.data.error
        })
        .finally()
    },
    ...mapActions('deliveryManager', ['selectDriver']),
    ...mapActions('order', ['selectedOrderDetails', 'updateOrderAction']),
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';
.modal-title {
  font-weight: 500;
}
.tables-btn-style {
  margin-left: 21px;
  background: #cc3232;
  color: white;
  width: 10%;
  @include responsive(mobile) {
    width: 30%;
  }
  border: none;
  font-size: 12.75px;
}
.inner-container {
  width: 100%;
}
.stores-list-container {
  overflow: auto;
}
.modal-header {
  flex-direction: row;
  background-color: rgb(245, 245, 245);
}
.store-name {
  font-size: 1.2rem;
  font-weight: bold;
  text-transform: uppercase;
  line-height: 3rem;
}
.stores-list {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  @include responsive(mobile) {
    grid-template-columns: 1fr;
    padding: 0px;
  }
  grid-gap: 1.5625rem;
  padding: 1.5625rem;
}
.stores-list > div:empty {
  display: none;
}
.store-address {
  font-size: 0.85rem;
  line-height: 1.8rem;
}
.store-picker-single-item {
  background-color: rgb(255, 255, 255);
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  height: 100%;
  cursor: pointer;
  color: #3f4a4a;
  box-shadow: 0 0 5px rgba(23, 23, 32, 0.05), 0 0 15px rgba(23, 23, 32, 0.05);
  padding: 1.875rem 1.875rem 3.125rem 1.875rem;
  text-align: left;
  justify-content: left;
}
.store-picker-single-item:hover,
.store-picker-single-item:active {
  color: rgb(255, 255, 255);
  background: #5056ca;
  -webkit-transition: 0.2s ease-out;
  transition: 0.2s ease-out;
  transform: scale(1.1);
}

.modal-dialog {
  max-width: 90% !important;
  @include responsive(mobile) {
    max-width: 95% !important;
  }
  min-height: 80% !important;
}
.modal-content {
  width: 90%;
  margin: auto;
  /*margin-top: 10%;*/
}
.card-img-top {
  width: 195px;
  height: 125px;
}
.modal .modal-dialog .modal-content {
  width: min-content;
}
</style>
