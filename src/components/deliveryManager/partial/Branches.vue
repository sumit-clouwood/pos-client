<template>
  <div class="right-btn-wrap">
    <button type="button" class="btn dropdown-toggle" data-toggle="dropdown">
      All Branches
    </button>
    <ul class="dropdown-menu">
      <li>
        <a href="javascript:void(0)" @click="getLocationOrders(locationId)">{{
          locationName
        }}</a>
      </li>
    </ul>
  </div>
</template>

<script>
/* eslint-disable no-console */
import { mapState } from 'vuex'
export default {
  name: 'Branches',
  computed: {
    ...mapState({
      locationIds: state => state.location.locationIds,
      locationName: state => state.location.locationName,
      locationId: state => state.location.location,
    }),
  },
  methods: {
    getLocationOrders: function() {
      console.log(
        'update location for other location need to update state of location.location'
      )
    },
  },
}
</script>

<style scoped></style>
