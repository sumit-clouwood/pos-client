<template>
  <div>
    <!-- Private view -->
    <MultipleStores
      v-show="
        haveMultipleStores && !isStoreSelected && !this.$route.params.store_id
      "
    />
    <!-- user is logged in, there is a store id in url or the user is not admin  -->
    <private-view v-if="privateContext" class="private-view"></private-view>
    <!-- Public view -->
    <public-view v-else class="public-view"></public-view>
    <app-notification></app-notification>
  </div>
</template>
<script>
import PublicView from './PublicView'
import PrivateView from './PrivateView'
import AppNotification from './AppNotification'
import { mapGetters } from 'vuex'
import MultipleStores from '@/components/MultipleStores'

import DataService from '@/services/DataService'
export default {
  name: 'App',
  components: {
    PublicView,
    PrivateView,
    AppNotification,
    MultipleStores,
  },
  computed: {
    ...mapGetters('context', ['isStoreSelected', 'haveMultipleStores']),
    privateContext() {
      return this.$store.state.auth.token
    },
  },

  watch: {
    privateContext() {
      this.setupRouting()
    },
  },

  methods: {
    setup() {
      this.setupRouting()
      this.$store.dispatch('auth/checkLogin')
    },
    setupRouting() {
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
    },
  },
  mounted() {
    DataService.setStore(this.$store)
    this.setup()
    const timeout =
      process.env.NODE_ENV === 'production' ? 1000 * 60 * 5 : 1000 * 10
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
</style>
