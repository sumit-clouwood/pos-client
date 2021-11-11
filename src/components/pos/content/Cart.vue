<template>
  <div
    :class="[
      'main-orders',
      'walkinPOScart',
      { active: items.length && mainOrdersHendler },
    ]"
    class="main-orders color-dashboard-background"
  >
    <div class="main-orders-title">
      <div class="text">Current Sale Detail</div>
      <div class="button" @click="cartClose">
        <i class="fa fa-angle-right" aria-hidden="true"></i>
      </div>
    </div>
    <!--
    <form autocomplete="off">
      <input
        ref="barcode"
        id="barcode-holder"
        type="hidden"
        autocomplete="new-password"
        v-model="barcode"
        autofocus
        @keypress="addItem"
        placeholder="Type Barcode"
      />
    </form>
    -->
    <Header v-if="orderType.OTApi !== 'dine_in'" />
    <dineInHeader v-else />

    <div class="main-orders-list-wrapper">
      <HoldingOrders v-if="cartType === 'hold'" />
      <template v-else>
        <dineInItems v-if="orderType.OTApi === 'dine_in'" />
        <Items v-else />
      </template>
    </div>

    <PayNow />
    <Footer />
    <mobile-footer />
    <orders-menu />
  </div>
</template>

<script>
import Header from './cart/newOrders/Header'
import HoldingOrders from './cart/HoldingOrders'
import Footer from './cart/Footer'
import PayNow from './cart/PayNow'
import Items from './cart/newOrders/Items'
import ordersMenu from '../../mobileComponents/mobileOrdersMenu'
import mobileFooter from '../../mobileComponents/mobileFooter'
import dineInItems from '@/components/dinein/cart/Items'
import dineInHeader from '@/components/dinein/cart/Header'
import Vue from 'vue'
import VueBarcodeScanner from 'vue-barcode-scanner'
import { mapState, mapGetters } from 'vuex'

let options = {
  sound: true, // default is false
  soundSrc: '/barcode.wav', // default is blank
  sensitivity: 100, // default is 100
  requiredAttr: false, // default is false
}
Vue.use(VueBarcodeScanner, options)

export default {
  name: 'Cart',
  props: {
    msg: String,
  },
  data() {
    return {
      barcode: '',
      loading: false,
    }
  },
  computed: {
    ...mapState('checkout', ['order']),
    ...mapGetters('order', ['items']),
    ...mapGetters(['mainOrdersHendler']),
    ...mapState('location', ['store']),
    ...mapState('order', ['cartType', 'orderType']),
    // ...mapGetters('context', ['store']),
    ...mapState('context', ['brandId', 'storeId']),
  },
  methods: {
    addItem(event) {
      if (event.keyCode === 13) {
        this.addItemToCartByCode(event.target.value)
      }
    },
    addItemToCartByCode(itemCode) {
      this.$store.commit('category/setBarcode', itemCode)
    },
    cartClose() {
      this.$store.dispatch('cartClose')
    },
    // Create callback function to receive barcode when the scanner is already done
    onBarcodeScanned(barcode) {
      this.addItemToCartByCode(barcode)
    },
    // Reset to the last barcode before hitting enter (whatever anything in the input box)
    resetBarcode() {
      //let barcode = this.$barcodeScanner.getPreviousCode()
      // do something...
    },
    emptyCartForOtherBrands() {
      if (process.env.VUE_APP_SOCKET_DISABLE) {
        return false
      }
      let store = this.store ? this.store._id : undefined
      // let scope = this
      if (!store) {
        return false
      }
      let brand_store = this.$store.getters['context/store']

      this.$socket.client.on(
        'store-notification-channel:App\\Events\\StoreNotification:' + store,
        function(socket_notification) {
          let order = localStorage.getItem('locked_order_id')
          // eslint-disable-next-line no-console
          console.log(
            socket_notification,
            'socket_notification',
            store,
            brand_store
          )
          // scope.$router.push('/dine-in' + brand_store + '/11')
          if (
            socket_notification &&
            order &&
            socket_notification.order_id === order
          ) {
            // eslint-disable-next-line no-console
            console.log(
              socket_notification,
              'socket_notification - 2',
              store,
              brand_store,
              this.brandId,
              this.storeId
            )
            // this.$router.push('/dine-in' + brand_store)
            this.$router.replace({
              name: 'Dinein',
              params: {
                brand_id: this.brandId,
                store_id: this.storeId,
              },
            })
          }
        }
      )
    },
  },
  components: {
    Header,
    dineInHeader,
    Items,
    HoldingOrders,
    Footer,
    PayNow,
    ordersMenu,
    dineInItems,
    mobileFooter,
  },
  created() {
    setTimeout(() => {
      const eventBus = this.$barcodeScanner.init(this.onBarcodeScanned, {
        eventBus: true,
      })

      if (eventBus) {
        eventBus.$on('start', () => {
          this.loading = true
        })
        eventBus.$on('finish', () => {
          this.loading = false
        })
      }
      this.emptyCartForOtherBrands()
    }, 1000)

    //this.$barcodeScanner.hasListener() // return Boolean
    //this.$barcodeScanner.getPreviousCode() // return String
    //this.$barcodeScanner.setSensitivity(200) // sets barcode scanner recognition sensitivity to 200 ms
  },
  destroyed() {
    let order = localStorage.getItem('locked_order_id')
    if (order) {
      this.$store.dispatch(
        'order/lockUnlockOrder',
        { orderId: order, status: { order_lock: false } },
        {
          root: true,
        }
      )
      localStorage.removeItem('locked_order_id')
    }
    // Remove listener when component is destroyed
    this.$barcodeScanner.destroy()
  },
}
</script>
<style lang="sass" scoped>
.main-orders-list-wrapper
  scroll-behavior: smooth
</style>
<style lang="scss">
@import '@/assets/scss/pixels_rem.scss';
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';
// .main-orders {
// }
@include responsive(mobile) {
  .main-orders.walkinPOScart {
    position: fixed;
    top: 0;
    right: -100vw;
    bottom: 0;
    width: 100vw;
    padding: 20px;
    height: 100%;
    background-color: #fff;
    padding: 0;
    grid-template-rows: max-content max-content 1fr;
    overflow: hidden;
    transition: 0.5s ease-out;
    border-bottom: 1px solid $gray-middle;
    grid-column-start: 1;
    grid-column-end: 2;
    z-index: 50;

    &.active {
      right: 0px;
    }

    .main-orders-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px;
      padding-bottom: 0;
      font-weight: 600;
      font-size: 18px;
      z-index: 6;
      background-color: #fff;

      .fa {
        font-size: 22px;
        font-weight: 600;
      }
    }

    .main-orders-contacts {
      margin: 0;
      padding: 0;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      z-index: 1;

      .main-oreders-title {
        width: 100%;
        padding: 10px;
        font-size: 14px;
        font-weight: normal;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .main-oreders-date {
        text-align: right;
      }

      .main-oreders-buttons {
        display: none;
        margin: auto !important;
      }
    }

    .main-orders-list-wrapper {
      padding: 0;
      background-color: #fafafa;

      .main-orders-list {
        grid-gap: 0;

        .main-orders-list-item {
          border-radius: 0;
          border: none;
          border-bottom: 1px solid $gray-middle;
          padding: 10px 0;
          margin: 0 20px;
          background-color: #fafafa;

          &:last-child {
            border-bottom: none;
          }

          .main-orders-list-item-title {
            white-space: nowrap;
          }
        }
      }
    }

    .main-orders-total {
      padding: 0 20px;
      position: relative;
      overflow: hidden;
      z-index: -1;

      .total-wrapper {
        border-bottom: 1px solid $gray-middle;
        padding: 10px 0 10px 0;
        transition: 0.5s ease-out;
        margin-bottom: -167.5px;
        word-break: break-all;

        &.active {
          margin-bottom: -10px;
        }

        .item {
          padding: 5px 0;
          border-bottom: 1px solid #eee;

          .sub-total-text {
            font-size: 14px;
            overflow: hidden;
            max-width: 200px;
          }

          .sub-total-num {
            font-size: 14px;
          }
        }
      }

      .total {
        margin: 0;
        border-top: 0px solid $gray-middle;
        color: #333;
        background-color: #fff;

        .sub-total-text {
          font-size: 14px;
        }

        .sub-total-num {
          font-size: 14px;
          display: flex;
          align-items: center;

          i {
            font-size: 22px;
            font-weight: 600;
            margin-left: 10px;
            transition: 0.3s ease-out;

            &.active {
              transform: rotate(180deg);
            }
          }
        }
      }
    }

    .mobile-footer {
      padding-top: 0;
      background-color: #fff;
      z-index: 10;
      padding-top: 20px;
      box-shadow: none;
      display: block;
      .btn-cart {
        display: none;
      }

      .main-orders-buttons {
        display: grid;
      }
    }
  }
}
</style>
