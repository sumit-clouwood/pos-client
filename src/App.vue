<!--
The App.vue file is the root component that all other components are nested within.
-->

<template>
  <div>
    <!--<div id="nav">-->
    <!--<router-link to="/">Home</router-link> |-->
    <!--<router-link to="/about">About</router-link>-->
    <!--</div>-->
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
          <span>
            Loading data...
            <Preloader />
          </span>
        </li>
      </ul>
    </div>
    <router-view v-else />
  </div>
</template>

<script>
import Cookie from '@/mixins/Cookie'
import bootstrap from '@/bootstrap'
import Preloader from '@/components/util/Preloader'
import { mapState } from 'vuex'

export default {
  name: 'Location',
  props: {},
  components: {
    Preloader,
  },
  mixins: [Cookie],
  data: function() {
    return {
      loading: true,
      errored: false,
    }
  },
  computed: {
    ...mapState({
      defaultLanguage: state =>
        state.location.store ? state.location.store.default_language : false,
    }),
  },
  //life cycle hooks
  mounted() {
    if (this.$router.currentRoute.name === 'Dinein') {
      this.loading = false
      return
    }

    bootstrap
      .setup(this.$store)
      .then(() => {
        this.loading = false
        setTimeout(() => {
          require('@/../public/js/pos_script.js')
          require('@/../public/js/pos_script_functions.js')
        }, 2000)
      })
      .catch(error => (this.errored = error))
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
<!--<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  color: #2c3e50;
  margin-top: 60px;
}
</style>-->
<style lang="scss">
@import './assets/scss/style.scss';
</style>
