<template>
  <div class="navbar-nav-sidebar">
    <div class="add-screen-walkin">
      <p class="walk-in">Walk-In</p>
      <p class="walk-in-place">{{ locationName }}</p>
    </div>
    <div class="time-zone-btn">
      <a href="#"
        ><span>2 : 30<small>pm</small></span
        ><span>August 08, 2018</span></a
      >
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'NavSidebar',
  props: {},
  computed: {
    ...mapState({
      // map this.categories to store.state.categories, it uses dispatch
      // locationIds: state => state.location.locationIds,
      locationName: state => state.location.locationName,
    }),
  },
}
</script>
