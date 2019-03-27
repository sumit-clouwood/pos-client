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
import bootstrap from '@/bootstrap'

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
        state.location.locationData
          ? state.location.locationData.default_language[0]
          : false,
    }),
  },
  //life cycle hooks
  mounted() {
    bootstrap
      .setup(this.$store)
      .then(() => {
        this.$store.commit('sync/loaded', true)
        this.loading = false
      })
      .catch(error => (this.errored = error))
  },
}
</script>

<style lang="scss" scoped>
@import '../assets/sass/locations';
</style>
