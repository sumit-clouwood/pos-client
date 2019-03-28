<template>
  <div class="navbar-nav-sidebar">
    <div class="add-screen-walkin">
      <p class="walk-in text-capitalize">{{ orderType }}</p>
      <p class="walk-in-place text-capitalize">{{ locationName }}</p>
    </div>
    <div class="time-zone-btn">
      <a href="#"
        ><span>{{ todayTime }}</span
        ><span>{{ todayDate }}</span></a
      >
    </div>
  </div>
</template>

<script>
/* eslint-disable no-console */
import { mapState, mapActions } from 'vuex'
import moment from 'moment-timezone'

export default {
  name: 'NavSidebar',
  props: {},
  data() {
    return {
      todayDate: moment().format('MMMM Do YYYY'),
      todayTime: moment().format('h:mm:ss a'),
    }
  },
  computed: {
    ...mapState({
      locationName: state => state.location.locationName,
    }),
    ...mapState('order', ['orderType']),
  },
  methods: {
    ...mapActions('location', ['setTimeZone']),
  },
  mounted: function() {
    setInterval(() => {
      this.todayTime = moment().format('h:mm:ss a')
    }, 1000)
  },
}
</script>
