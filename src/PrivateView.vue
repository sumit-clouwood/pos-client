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
    <div v-if="loggedIn && storeContext">
      <div v-if="userError">
        <div class="center-error">
          <h3>{{ userError }}</h3>
          <p>{{ userErrorInstructions }}</p>
        </div>
      </div>
      <section v-else-if="systemError" class="center-error">
        <h3>
          We're sorry, we're not able to proceed at the moment, please try back
          later.
        </h3>
        <h5>Technical info:</h5>
        <p v-html="systemError"></p>
      </section>
      <div v-else-if="loading">
        <ul class="ullist-inventory-location loading-view pl-0 pt-2">
          <li class="p-3">
            <span class="margin220">
              <Preloader />
              <h2 class="text-center blue-middle">Loading Data...</h2>
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
    <div v-else>
      <p>
        Please wait while we are loading store(s)
      </p>
    </div>
  </div>
</template>
<script>
/* eslint-disable no-console */
import * as CONST from '@/constants'
import Cookie from '@/mixins/Cookie'
import ResizeMixin from '@/mixins/ResizeHandler'
import bootstrap from '@/bootstrap'
import Preloader from '@/components/util/Preloader'
import { mapState, mapGetters } from 'vuex'
import moment from 'moment-timezone'

export default {
  name: 'PrivateView',
  props: {},
  components: {
    Preloader,
  },
  mixins: [Cookie, ResizeMixin],
  data: function() {
    return {
      storeContext: true,
      loading: true,
      systemError: false,
      userError: false,
      progressIncrement: 0,
      orderId: null,
      tableId: null,
      subscriptionError: false,
    }
  },
  methods: {
    setupExternalScripts() {
      setTimeout(() => {
        require('@/../public/js/pos_script.js')
      }, 2000)
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
      setTimeout(() => {
        navigator.serviceWorker.addEventListener('message', event => {
          console.log('*** event received from service worker', event)
          if (event.data.msg == 'token') {
            console.log('setting new token to client')
            localStorage.setItem('token', event.data.data)
            bootstrap.loadUI('sw').then(() => {
              setTimeout(() => {
                this.loading = false
                this.progressIncrement = '100%'
              }, 100)
            })
          }
          if (event.data.msg === 'sync') {
            if (event.data.data.status === 'done') {
              this.$store.dispatch('sync/offlineSync', event.data.data.status)
            }
          }
        })
      }, 3000)
    },
    setup() {
      this.subscriptionError = false

      const interval = setInterval(() => {
        this.progressIncrement += 10
        if (this.progressIncrement > 100) {
          this.progressIncrement = 0
        }
      }, 1000)
      bootstrap
        .setup(this.$store)
        .then(() => {
          setTimeout(() => {
            clearInterval(interval)
            this.progressIncrement = 100
          }, 100)
          setTimeout(() => {
            this.loading = false
          }, 300)

          this.setupServiceWorker()
          this.setupRoutes()
          this.setupExternalScripts()
        })
        .catch(error => {
          this.loading = false
          console.trace(error)
          if (error === 'subscription') {
            this.userError = this._t('Store subscription has been expired.')
            this.userErrorInstructions = this._t(
              'Please contact your store owner for access.'
            )
          }

          //this.$store.dispatch('auth/logout', error)
          if (error.data && error.data.error) {
            this.userError = error.data.error
            this.userErrorInstructions = this._t(
              'Please contact your store owner.'
            )
          } else if (error.stack) {
            this.systemError = error.stack
          } else {
            this.userError = error
          }
        })
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
  created() {},
  watch: {
    currentRoute(any) {
      if (any) {
        this.$router.replace(any)
      }
    },
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
    ...mapState({
      defaultLanguage: state =>
        state.location.store ? state.location.store.default_language : false,
    }),
    ...mapState('sync', ['modules']),
    ...mapState('context', ['currentRoute']),
    ...mapGetters('auth', ['loggedIn']),
    ...mapGetters('location', ['isTokenManager', '_t']),
    ...mapState('order', ['orderType']),
    ...mapState('sync', ['online']),
    ...mapState('location', ['timezoneString', 'openHours']),
    apisLoaded() {
      return this.$store.state.location.brand
    },
  },
  //life cycle hooks
  mounted() {
    // if (!this.$store.state.context.storeId) {
    //   this.errored = 'Please provide brand id and store id in url'
    //   this.storeContext = false
    // } else {
    //   this.storeContext = true
    // }

    if (this.$route.params.order_id) {
      this.orderId = this.$route.params.order_id
      this.$store.commit('order/RESET_SPLIT_BILL')
    }

    if (this.$route.params.table_id) {
      this.tableId = this.$route.params.table_id
    }

    if (
      (this.$store.state.auth.logoutAction === 'switchCashier' ||
        localStorage.getItem('logoutAction') === 'switchCashier') &&
      this.apisLoaded
    ) {
      this.loading = false
    } else {
      this.setup()
    }

    let vh = window.innerHeight * 0.01
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vh', `${vh}px`)
    if (this.$router.currentRoute.name === 'Dinein') {
      this.loading = false
      return
    }
  },
}
//vanilla js
</script>
<style lang="scss" scoped>
.center-error {
  text-align: center;
  width: 100%;
  padding-top: 150px;
}
</style>
