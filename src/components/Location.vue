<template>
  <div class="inventory-location-wrapper pt-5 h-100">
    <div class="mx-auto col-md-3 mt-5">
      <a v-if="loaded && locationName">{{ locationName }}</a>
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

export default {
  name: 'Location',
  props: {},
  computed: {
    ...mapState({
      // map this.categories to store.state.categories, it uses dispatch
      locationIds: state => state.location.locationIds,
      locationName: state => state.location.locationName,
      loaded: state => state.sync.loaded,
    }),
  },
  //life cycle hooks
}
</script>

<style lang="scss" scoped>
@import '../assets/sass/locations';
</style>
