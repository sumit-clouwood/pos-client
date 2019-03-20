<template>
  <div class="inventory-location-wrapper pt-5 h-100">
    <section v-if="errored">
      <p>
        We're sorry, we're not able to proceed at the moment, please try back
        later
      </p>
      <p>Technical info: {{ errored }}</p>
    </section>
    <div v-else class="mx-auto col-md-3 mt-5">
      <div v-if="loading">
        <ul class="ullist-inventory-location pl-0 pt-2">
          <li class="p-3">
            <a v-if="loaded && locationName">{{ locationName }}</a>
            <span>
              Loading data...
            </span>
          </li>
        </ul>
      </div>
      <div v-else class="search-location p-4">
        <div v-if="locationIds.length">
          <p class="location-title">Please select a location:</p>
          <form class="form-inline search-inline">
            <div class="inner-addon left-addon">
              <img
                class="search-img"
                src="img/pos/search-icon.png"
                alt="search"
              />
              <input
                type="text"
                class="form-control"
                placeholder="Search location"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-console */
import { mapState } from 'vuex'
import Cookie from '@/mixins/Cookie'
import NetworkService from '@/services/NetworkService'
export default {
  name: 'Location',
  props: {},
  mixins: [Cookie],
  data: function() {
    return {
      info: null,
      loading: true,
      errored: false,
    }
  },
  computed: {
    ...mapState({
      // map this.categories to store.state.categories, it uses dispatch
      locationIds: state => state.location.locationIds,
      locationName: state => state.location.locationName,
      loaded: state => state.sync.loaded,
    }),
    ...mapState({
      defaultLanguage: state =>
        typeof state.location.locationData !== 'undefined'
          ? state.location.locationData.default_language[0]
          : false,
    }),
  },
  //life cycle hooks
  mounted() {
    //let deviceId = Cookie.get_cookie('device_id')
    this.$store
      .dispatch('auth/auth')
      .then(response => {
        console.log('response from server', response)
        this.$store.dispatch('location/setLocation')

        this.$store
          .dispatch('location/fetch', response)
          .then(() => {
            this.$store
              .dispatch('category/fetchAll', response)
              .then(result => {
                if (!result || result.error) {
                  this.errored =
                    result.error || 'No result from category/fetchAll'
                  return false
                }

                this.$store.dispatch('modifier/fetchAll', response).then(() => {
                  this.$store.commit('sync/loaded', true)
                  this.loading = false
                })

                this.$store.dispatch('announcement/fetchAll', response)
                this.$store.dispatch('surcharge/fetchAll', response)
                this.$store.dispatch('discount/fetchAll', response)
                this.$store.dispatch('customer/fetchAll', response)
                this.$store.dispatch('payment/fetchAll', response)
                this.$store.dispatch('giftcard/fetchAll', response)
                this.$store.dispatch('invoice/fetchAll', response)
              })
              .catch(err => (this.errored = err))
          })
          .catch(err => (this.errored = err))
        //.finally(() => (this.loading = false))

        // localStorage.setItem('selectedLanguage', this.defaultLanguage.language)
        // localStorage.setItem('selectedLanguageSortName', this.defaultLanguage.shortname)
      })
      .catch(error => {
        console.log('error from server', error)
        this.errored = error
      })

    NetworkService.status((status, msg, event) => {
      this.$store.commit('sync/status', status)
      console.log('network status: ', status, msg, event)
    })
  },

  beforeCreate() {},
}

if ('serviceWorker' in navigator && 'SyncManager' in window) {
  console.log('All things available')
  window.addEventListener('load', () => {
    console.log('window loaded with navigator')
    navigator.serviceWorker.ready
      .then(registration => {
        console.log('Service Worker Ready IN MAIN Component')
        Notification.requestPermission()
        return registration.sync.register('postOfflineOrders')
      })
      .then(function() {
        console.log('sync event postOfflineOrders registered')
      })
      .catch(function() {
        // system was unable to register for a sync,
        // this could be an OS-level restriction
        console.log('sync registration failed')
      })
  })
}
</script>

<style lang="scss" scoped>
@import '../assets/sass/locations';
</style>
