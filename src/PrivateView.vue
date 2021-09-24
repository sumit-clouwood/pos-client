<!--
The App.vue file is the root component that all 
other components are nested within.
-->
<template>
  <div>
    <!--<div id="nav">-->
    <!--<router-link to="/">Home</router-link> |-->
    <!--<router-link to="/about">About</router-link>-->
    <!--</div>-->

    <div v-if="loggedIn">
      <div
        v-if="showDebug"
        style="position: absolute; background-color:#fff; left:500px;"
        class="debug"
      >
        loading status: {{ loading }} <br />
        storeId: {{ storeId }}
      </div>

      <!-- there is no system or user error, check loading -->

      <div v-if="loading">
        <ul class="ullist-inventory-location loading-view pl-0 pt-2">
          <li class="p-3">
            <span class="margin220">
              <Preloader />
              <h2 class="text-center blue-middle">
                Loading Data... &nbsp;
                <button
                  v-if="reloadButton"
                  type="button"
                  class="btn btn-success"
                  @click="reloadPage"
                >
                  {{ _t('Reload') }}
                </button>
              </h2>
              <ul class="loading-modules">
                <li v-for="(val, key) in modules" :key="key">
                  Loading {{ key }}
                  <div class="progress" style="text-transform:capitalize">
                    <div
                      class="progress-bar progressIncrement"
                      role="progressbar"
                      aria-valuenow="50"
                      aria-valuemin="1"
                      aria-valuemax="100"
                      v-bind:style="{ width: progressIncrement + '%' }"
                    >
                      {{ progressIncrement }} %
                    </div>
                  </div>
                  <span>{{ val }}</span>
                </li>
              </ul>
            </span>
          </li>
        </ul>
      </div>
      <router-view v-else />
    </div>
  </div>
</template>
<script>
/* eslint-disable no-console */
import * as CONST from '@/constants'
import Cookie from '@/mixins/Cookie'
import ResizeMixin from '@/mixins/ResizeHandler'
import Preloader from '@/components/util/Preloader'
import { mapState, mapGetters } from 'vuex'
import moment from 'moment-timezone'
import StoreService from '@/services/data/StoreService'

export default {
  name: 'PrivateView',
  props: {},
  components: {
    Preloader,
  },
  mixins: [Cookie, ResizeMixin],
  data: function() {
    return {
      reloadButton: false,
      progressIncrement: 0,
      orderId: null,
      tableId: null,
      interval: undefined,
    }
  },
  methods: {
    reloadPage() {
      window.location.reload()
    },
    setupRoutes() {
      if (this.orderId && this.$route.name === 'UpdateDeliveryOrder') {
        this.$store.commit('order/ORDER_SOURCE', 'deliveryManager')
        this.$store
          .dispatch('order/selectedOrderDetails', this.orderId)
          .then(() => {
            this.$store.dispatch(
              'order/addDeliveryOrder',
              this.$store.state.order.selectedOrder,
              {
                root: true,
              }
            )
          })
      }
      if (this.orderId) {
        this.$store.dispatch('order/fetchModificationReasons')
        if (this.$route.name === 'ModifyBackendOrder') {
          this.$store.commit('order/ORDER_SOURCE', 'backend')
          this.$store.dispatch('order/modifyOrder', this.orderId)
        }
      }
    },
    setupServiceWorker() {
      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        setTimeout(() => {
          navigator.serviceWorker.ready
            .then(registration => {
              Notification.requestPermission()
              return registration.sync.register('syncpos')
            })
            .then(function() {})
            .catch(function() {
              // system was unable to register for a sync,
              // this could be an OS-level restriction
            })
        }, 3000)
      }
      if ('serviceWorker' in navigator) {
        let scope = this
        setTimeout(() => {
          navigator.serviceWorker.addEventListener('message', event => {
            console.log('*** event received from service worker', event)
            if (event.data.msg == 'token') {
              console.log('event received from sw', event)
            }
            if (event.data.msg == 'token-expired') {
              console.log(event.data)
              console.log('refreshing the token')
              //this.$store.dispatch('auth/logout')
              //fetch versions api
              StoreService.getApiVersions()
              console.log('token refreshed')
            }
            if (event.data.msg === 'sync') {
              if (event.data.data.status === 'done') {
                scope.$store.dispatch(
                  'sync/offlineSync',
                  event.data.data.status
                )
              }
            }
          })
        }, 3000)
      }
    },
    setup() {
      this.interval = setInterval(() => {
        this.progressIncrement += 10
        if (this.progressIncrement > 100) {
          this.progressIncrement = 0
        }
      }, 1000)
    },
    resetTokenNumber() {
      if (!this.$store.state.sync.online) {
        if (
          this.isTokenManager &&
          (this.orderType.OTApi === this.CONST.ORDER_TYPE_WALKIN ||
            this.orderType.OTApi === this.CONST.ORDER_TYPE_CARHOP)
        ) {
          const storeCurrentDate = moment()
            .tz(this.timezoneString)
            .format('YYYY-MM-DD')

          const storeCurrentTime = moment()
            .tz(this.timezoneString)
            .utc()
            .valueOf()

          const storeOpeningTime = moment
            .tz(
              storeCurrentDate + ' ' + this.openHours.opens_at,
              'YYYY-MM-DD HH:mm',
              this.timezoneString
            )
            .utc()
            .valueOf()

          const tokenResetAt =
            localStorage.getItem('token_reset_at') || storeCurrentDate

          if (
            storeCurrentDate > tokenResetAt &&
            storeCurrentTime >= storeOpeningTime
          ) {
            let startingTokenNumber = localStorage.getItem('starting_token')
            localStorage.setItem('token_number', startingTokenNumber)
            localStorage.setItem('token_reset_at', storeCurrentDate)
          }
        }
      }
    },
  },
  created() {
    let scope = this
    setTimeout(() => {
      scope.reloadButton = true
    }, 10000)
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    $route(to, from) {
      // this.$store.commit('deliveryManager/LIST_TYPE', 'New Orders')
      this.$store.commit('order/NEED_SUPERVISOR_ACCESS', false)
      if (this.$route.params.order_id) {
        this.orderId = this.$route.params.order_id
        this.$store.commit('order/RESET_SPLIT_BILL')
      }
      //check if orderid exists from previous action, but user choosed different route while editign order
      if (this.orderId) {
        if (!this.$store.state.checkout.print) {
          this.$store.dispatch('checkout/reset')
        }
      }
      // if no order id found in current action reset this.orderId
      if (!this.$route.params.order_id) {
        this.orderId = null
      }

      this.$store.commit('order/RESET_SPLIT_BILL')
      if (to.name !== 'setOrderType') {
        //set order type is already set in dinin.vue, don't override here
        let orderType = {
          OTview: 'Walk In',
          OTApi: 'walk_in',
        }
        //{ OTview: 'Delivery', OTApi: 'call_center' }
        switch (to.name) {
          case 'Dinein':
            orderType = {
              OTview: 'Dine In',
              OTApi: 'dine_in',
            }
            break
          case 'Takeaway':
            orderType = {
              OTview: 'Take Away',
              OTApi: 'takeaway',
            }
            break
          case 'Carhop':
            orderType = {
              OTview: 'Carhop',
              OTApi: CONST.ORDER_TYPE_CARHOP,
            }
            this.$store.commit('checkoutForm/setAction', 'add')
            break
        }
        if (!this.$store.getters['auth/multistore']) {
          this.$store.commit('order/ORDER_TYPE', orderType)
        }
      }

      if (this.$route.params.table_id) {
        this.tableId = this.$route.params.table_id
      }

      this.$store.commit('order/CLEAR_SELECTED_ORDER')
      if (this.orderId) {
        this.$store.dispatch('order/fetchModificationReasons')
        if (this.$route.name === 'ModifyBackendOrder') {
          this.$store.commit('order/ORDER_SOURCE', 'backend')
          this.$store.dispatch('order/modifyOrder', this.orderId)
        }
      }
    },
    orderType: { handler: 'resetTokenNumber', immediate: true },
    online: 'resetTokenNumber',
  },
  computed: {
    showDebug() {
      return process.env.VUE_APP_DEBUG
    },
    ...mapState({
      defaultLanguage: state =>
        state.location.store ? state.location.store.default_language : false,
      loading: state => state.sync.loading_store,
    }),
    ...mapState('sync', ['modules']),
    ...mapState('context', ['currentRoute', 'storeId']),
    ...mapGetters('auth', ['loggedIn', 'roleName']),
    ...mapGetters('location', ['isTokenManager', '_t']),
    ...mapState('order', ['orderType']),
    ...mapState('sync', ['online', 'loaded']),
    ...mapState('location', ['timezoneString', 'openHours']),
    ...mapGetters('context', ['isStoreSelected']),

    apisLoaded() {
      return this.$store.state.location.brand
    },
  },
  //life cycle hooks
  mounted() {
    if (this.$route.params.order_id) {
      this.orderId = this.$route.params.order_id
      this.$store.commit('order/RESET_SPLIT_BILL')
    }

    if (this.$route.params.table_id) {
      this.tableId = this.$route.params.table_id
    }

    this.setup()

    let vh = window.innerHeight * 0.01
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vh', `${vh}px`)
    if (this.$router.currentRoute.name === 'Dinein') {
      this.$store.commit('sync/loading_store', false)
      return
    }
  },
}
//vanilla js
</script>
