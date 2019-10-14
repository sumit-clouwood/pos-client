<!--
The App.vue file is the root component that all other components are nested within.
-->

<template>
  <div>
    <!--<div id="nav">-->
    <!--<router-link to="/">Home</router-link> |-->
    <!--<router-link to="/about">About</router-link>-->
    <!--</div>-->
    <div v-if="loggedIn && storeContext">
      <section v-if="errored">
        <p>
          We're sorry, we're not able to proceed at the moment, please try back
          later
        </p>
        <p>Technical info: {{ errored }}</p>
      </section>
      <div v-else-if="loading">
        <ul class="ullist-inventory-location loading-view pl-0 pt-2">
          <li class="p-3">
            <span class="margin220">
              <Preloader />
              <h2 class="text-center blue-middle">Loading Data...</h2>
              <ul class="loading-modules">
                <li
                  v-for="(val, key) in modules"
                  :key="key"
                  style="text-transform:capitalize"
                >
                  Loading {{ key }}
                  <div class="progress">
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
      <Login />
    </div>
  </div>
</template>

<script>
/* eslint-disable no-console */
import DataService from '@/services/DataService'

import Cookie from '@/mixins/Cookie'
import ResizeMixin from '@/mixins/ResizeHandler'
import bootstrap from '@/bootstrap'
import Preloader from '@/components/util/Preloader'
import Login from '@/components/login/Login'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'App',
  props: {},
  components: {
    Preloader,
    Login,
  },
  mixins: [Cookie, ResizeMixin],
  data: function() {
    return {
      storeContext: true,
      loading: true,
      errored: false,
      progressIncrement: 0,
      orderId: null,
      tableId: null,
    }
  },
  created() {
    DataService.setStore(this.$store)

    if (this.$route.params.brand_id) {
      this.$store.commit('context/SET_BRAND_ID', this.$route.params.brand_id)
      localStorage.setItem('brand_id', this.$route.params.brand_id)
      this.$store.commit('context/SET_STORE_ID', this.$route.params.store_id)

      localStorage.setItem('store_id', this.$route.params.store_id)
      DataService.setContext({
        brand: this.$store.getters['context/brand'],
        store: this.$store.getters['context/store'],
      })
    }
    /*else if (!this.$store.state.context.storeId) {}*/
    this.$store
      .dispatch('auth/checkLogin')
      .then(() => {
        if (!this.$store.state.context.storeId) {
          this.errored = 'Please provide brand id and store id in url'
          this.storeContext = false
        } else {
          this.storeContext = true
        }
      })
      .catch(error => console.log(error))

    if (this.$route.params.order_id) {
      this.orderId = this.$route.params.order_id
    }
    if (this.$route.params.table_id) {
      this.tableId = this.$route.params.table_id
    }
  },
  watch: {
    $route(to, from) {
      // react to route changes...
      console.log('route changed ', to, from)
    },
    loggedIn(newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
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

            console.log('bootstrap done, delayed loading')

            if ('serviceWorker' in navigator && 'SyncManager' in window) {
              console.log('service worker and syncmanager are in window')
              setTimeout(() => {
                console.log('waiting for servicer worker ready')
                navigator.serviceWorker.ready
                  .then(registration => {
                    console.log('servie worker is ready')
                    Notification.requestPermission()
                    console.log('asking service worker to sync')
                    return registration.sync.register('syncpos')
                  })
                  .then(function() {})
                  .catch(function() {
                    // system was unable to register for a sync,
                    // this could be an OS-level restriction
                  })
              }, 3000)
            }

            if (this.orderId && this.$route.name === 'UpdateDeliveryOrder') {
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

            if (this.orderId && this.$route.name === 'ModifyBackendOrder') {
              this.$store.dispatch('order/modifyOrder', this.orderId)
            }

            setTimeout(() => {
              require('@/../public/js/pos_script.js')
            }, 2000)
          })
          .catch(error => {
            //this.errored = error
            //setTimeout(() => {
            console.log(error, ', dispatch logout')
            this.$store.dispatch('auth/logout', error)
            this.errored = ''
            //}, 1000 * 10)
            console.log('some catch ', error)
          })

        setTimeout(() => {
          navigator.serviceWorker.addEventListener('message', event => {
            console.log('*** event received from service worker', event)
            if (event.data.msg == 'token') {
              console.log('setting new token to client')
              localStorage.setItem('token', event.data.data)
              bootstrap.loadUI().then(() => {
                setTimeout(() => {
                  this.loading = false
                  this.progressIncrement = '100%'
                }, 100)
              })
            }
          })
        }, 3000)
      } else {
        //logged out
        if (!newVal && newVal !== oldVal) {
          this.loading = true
          this.progressIncrement = 0
          this.$router.replace('/')
        }
      }
    },
  },

  computed: {
    ...mapState({
      defaultLanguage: state =>
        state.location.store ? state.location.store.default_language : false,
    }),
    ...mapState('sync', ['modules']),
    ...mapGetters('auth', ['loggedIn']),
  },
  //life cycle hooks
  mounted() {
    if (this.$router.currentRoute.name === 'Dinein') {
      this.loading = false
      return
    }
  },
}

//vanilla js
</script>
<style lang="scss">
@import './assets/scss/style.scss';
</style>
