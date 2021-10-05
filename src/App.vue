<template>
  <div>
    <div v-if="userError || error">
      <div class="center-error">
        <template v-if="userError">
          <h3>{{ userError }}</h3>
          <p>{{ userErrorInstructions }}</p>
        </template>
        <template v-else>
          <div v-if="error">{{ error }}</div>
        </template>
      </div>
    </div>
    <!-- user is logged in, there is a store id in url or the user is not admin  -->
    <template v-else>
      <div class="multiplestore-selection">
        <div v-if="showDebug" style="position:  absolute; left: 100px;">
          Showing multiple stores selector
        </div>
        <MultipleStores />
      </div>
      <template v-if="privateContext && showPrivateContext">
        <div v-if="showDebug" style="position:  absolute; left: 400px;">
          in private view
        </div>
        <private-view class="private-view"></private-view>
      </template>
      <template v-else>
        <public-view v-if="!token" class="public-view"></public-view>
      </template>
      <app-notification></app-notification>
      <loader></loader>
    </template>
    <!-- Public view -->
    <div id="appLoaded"></div>
  </div>
</template>
<script>
/* eslint-disable no-console */
/* global showModal */
import PublicView from './PublicView'
import Loader from '@/components/util/Loader.vue'
import PrivateView from './PrivateView'
import AppNotification from './AppNotification'
import bootstrap from '@/bootstrap'
import DataService from '@/services/DataService'
import MultipleStores from '@/components/MultipleStores'

import { mapState, mapGetters } from 'vuex'

export default {
  name: 'App',
  data() {
    return {
      userError: false,
      userErrorInstructions: '',

      error: false,
      showPrivateContext: true,
      roleRouteChangeBlacklist: [
        'ModifyBackendOrder',
        'UpdateDeliveryOrder',
        'selectGroupForCrmOrder',
        'selectAddressForCrmOrder',
        'selectCustomerForTakeawayOrder',
        'setOrderType',
        'DeliveryManager',
      ],
    }
  },
  components: {
    Loader,
    PublicView,
    PrivateView,
    AppNotification,
    MultipleStores,
  },
  computed: {
    ...mapState('sync', ['online', 'loaded']),
    ...mapState('auth', ['token']),
    ...mapGetters('brand', ['hasMultiStores']),
    ...mapState('context', ['storeId']),
    ...mapState('store', ['storePrerequisite']),
    ...mapGetters('location', ['_t']),

    privateContext() {
      return this.token
    },
    showDebug() {
      return process.env.VUE_APP_DEBUG
    },
  },
  watch: {
    storePrerequisite(error) {
      if (error) {
        this.userError = this._t(error.title)
        this.userErrorInstructions = this._t(error.description)
        if (process.env.NODE_ENV === 'production') {
          let secondsToLogout = 30
          //logout here after 30 sec
          const logoutInterval = setInterval(() => {
            secondsToLogout--
            if (secondsToLogout <= 0) {
              clearInterval(logoutInterval)
              this.$store.dispatch('auth/logout')
              this.userError = false
              this.userErrorInstructions = ''
            }
          }, 1000)
        }
      }
    },
    loaded: {
      handler: function(newVal, oldVal) {
        // watch it
        console.log('loaded Prop changed: ', newVal, ' | was: ', oldVal)
      },
      deep: true,
    },
    hasMultiStores: {
      handler: function(newVal, oldVal) {
        console.log('hasMultiStores Prop changed: ', newVal, ' | was: ', oldVal)
        this.showPrivateContext = true

        if (newVal && this.token) {
          if (!this.storeId) {
            this.showPrivateContext = false
            showModal('#multiStoresModal')
          } else {
            //store id already in context via url
            this.showPrivateContext = true
            console.log(
              'store id already in context via url, loading new store'
            )
            this.loadStore()
          }
        }
      },
      deep: true,
    },
    storeId: {
      handler: function(newVal, oldVal) {
        console.log('storeId Prop changed: ', newVal, ' | was: ', oldVal)
        if (newVal && this.token) {
          this.showPrivateContext = true
          console.log('loading new store')
          this.loadStore()
        }
      },
      deep: true,
    },
  },
  methods: {
    // switchCashierOnline() {
    //   if (this.online && localStorage.getItem('offline_mode_login'))
    //     this.$store
    //       .dispatch('auth/pinlogin', {
    //         pincode: this.$store.state.auth.offlinePinCode,
    //         brand: this.$store.state.context.brandId,
    //         store: this.$store.state.context.storeId,
    //       })
    //       .then(() => {
    //         localStorage.setItem('offline_mode_login', false)
    //         this.$store.commit('auth/SET_OFFLINE_PIN', '')
    //       })
    // },
    setup() {
      //set route store/brand id for pin login as pin login works in public view
      this.setupRouting()
      this.$store.dispatch('auth/auth').catch(() => {})
      bootstrap.setup(this.$store)
      this.setupExternalScripts()
      this.setupServiceWorker()
    },
    setupExternalScripts() {
      setTimeout(() => {
        require('@/../public/js/pos_script.js')
      }, 2000)
    },
    setupRouting() {
      //set routing in public view i.e pin login
      if (this.$route.params.brand_id) {
        this.$store.commit('context/SET_BRAND_ID', this.$route.params.brand_id)
        localStorage.setItem('brand_id', this.$route.params.brand_id)
        DataService.setContext({
          brand: this.$store.getters['context/brand'],
          store: '',
        })
      }
    },
    loadStore() {
      this.error = false
      const self = this
      this.$store
        .dispatch('store/loadStore')
        .then(() => {
          let newRoute = 'BrandHome'
          if (this.roleName === 'Waiter') {
            newRoute = 'Dinein'
          } else if (this.roleName === 'Carhop User') {
            newRoute = 'Carhop'
          }
          if (
            !this.roleRouteChangeBlacklist.includes(self.$route.name) &&
            self.$route.name !== newRoute
          ) {
            self.$router.replace({
              name: newRoute,
              params: {
                brand_id: self.$store.getters['context/brand_id'],
                store_id: self.$store.getters['context/store_id'],
              },
            })
          }
        })
        .catch(error => {
          if (error) {
            this.error = error
          }
        })
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
              //set token here in state and localstorage
              localStorage.setItem('token', event.data.data)
              this.$store.commit('auth/SET_TOKEN', event.data.data)
            }
            if (event.data.msg == 'token-expired') {
              console.log(event.data)
              console.log('refreshing the token')
              //this.$store.dispatch('auth/logout')
              //fetch versions api
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
  },
  mounted() {
    DataService.setVuexStore(this.$store)
    this.setup()
    const timeout = window.location.href.match('local')
      ? 1000 * 30
      : 1000 * 60 * 5
    setInterval(() => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
          registration.update()
        })
      }
    }, timeout)
  },
}
</script>
<style lang="scss">
@import './assets/scss/style.scss';
.center-error {
  text-align: center;
  width: 100%;
  padding-top: 150px;
}
</style>
