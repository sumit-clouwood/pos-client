<template>
  <div class="inventory-location-wrapper pt-5 h-100">
    <div class="mx-auto col-md-3 mt-5">
      <div class="search-location p-4" v-if="locationIds.length">
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
      <ul class="ullist-inventory-location pl-0 pt-2">
        <li class="p-3">
          <a v-if="locationName">{{ locationName }}</a>
          <span v-if="!locationName">
            Loading data...
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Location',
  props: {},

  //life cycle hooks
  beforeCreate() {
    this.$store
      .dispatch('auth/auth')
      .then(response => {
        if (response.data.data.location_id) {
          this.$store.dispatch('location/setLocation', response.data.data)
        } else {
          this.$store.dispatch('location/setLocations', response.data.data)
        }

        this.$store.dispatch('category/fetchAll', response)
        this.$store.dispatch('modifier/fetchAll', response)
      })
      .catch(error => (this.errored = error))
  },

  mounted() {},
  computed: {
    ...mapState({
      // map this.categories to store.state.categories, it uses dispatch
      locationIds: state => state.location.locationIds,
      locationName: state => state.location.locationName,
    }),
  },
}
</script>

<style lang="scss" scoped>
@import '../assets/sass/locations';
</style>
