<!--
The App.vue file is the root component that all other components are nested within.
-->

<template>
  <div>
    <!--<div id="nav">-->
    <!--<router-link to="/">Home</router-link> |-->
    <!--<router-link to="/about">About</router-link>-->
    <!--</div>-->
    <div v-if="loggedIn">
      <section v-if="errored">
        <p>
          We're sorry, we're not able to proceed at the moment, please try back
          later
        </p>
        <p>Technical info: {{ errored }}</p>
      </section>
      <div v-else-if="loading">
        <ul class="ullist-inventory-location pl-0 pt-2">
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
                      v-bind:style="{ width: progressIncrement }"
                    >
                      {{ progressIncrement }}
                    </div>
                  </div>
                  <span> {{ val }} </span>
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
import bootstrap from '@/bootstrap'
import Preloader from '@/components/util/Preloader'
import Login from '@/components/login/Login'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'Location',
  props: {},
  components: {
    Preloader,
    Login,
  },
  mixins: [Cookie],
  data: function() {
    return {
      loading: true,
      errored: false,
      progressIncrement: '0%',
      orderId: null,
    }
  },
  created() {
    if (this.$route.params.brand_id) {
      this.$store.commit('context/SET_BRAND_ID', this.$route.params.brand_id)
      this.$store.commit('context/SET_STORE_ID', this.$route.params.store_id)
      DataService.setContext({
        brand: this.$store.getters['context/brand'],
        store: this.$store.getters['context/store'],
      })
    } else {
      this.errored = 'Please provide brand id and store id in url'
    }

    if (this.$route.params.order_id) {
      this.orderId = this.$route.params.order_id
    }
  },
  watch: {
    $route(to, from) {
      // react to route changes...
      console.log('route changed ', to, from)
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
    if (this.$store.state.context.brandId) {
      bootstrap
        .setup(this.$store)
        .then(() => {
          if (this.orderId) {
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

          this.progressIncrement = '10%'
          setTimeout(() => {
            this.loading = false
            this.progressIncrement = '100%'
          }, 100)
          // this.progressIncrement = '100%'
          setTimeout(() => {
            require('@/../public/js/pos_script.js')
            require('@/../public/js/pos_script_functions.js')
          }, 2000)
        })
        .catch(error => (this.errored = error))

      setTimeout(() => {
        navigator.serviceWorker.addEventListener('message', event => {
          console.log('*** event received from service worker', event)
          if (event.data.msg == 'token') {
            console.log('setting new token to client')
            localStorage.setItem('token', event.data.data)
            //DataService.setMiddleware()
            bootstrap.loadUI().then(() => {
              setTimeout(() => {
                this.loading = false
                this.progressIncrement = '100%'
              }, 100)
            })
          }
        })
      }, 3000)
    }
  },
}

//vanilla js
if ('serviceWorker' in navigator && 'SyncManager' in window) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      navigator.serviceWorker.ready
        .then(registration => {
          Notification.requestPermission()
          return registration.sync.register('postOfflineOrders')
        })
        .then(function() {})
        .catch(function() {
          // system was unable to register for a sync,
          // this could be an OS-level restriction
        })
    }, 3000)
  })
}
</script>
<style lang="css">
@import './assets/scss/style.scss';
</style>
