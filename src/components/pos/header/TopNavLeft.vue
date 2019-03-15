<template>
  <div class="navbar-nav-sidebar">
    <div class="add-screen-walkin">
      <p class="walk-in">Walk-In</p>
      <p class="walk-in-place">{{ locationName }}</p>
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
import { mapState, mapActions } from 'vuex'
import moment from 'moment-timezone'

export default {
  name: 'NavSidebar',
  props: {},
  data() {
    return {
      todayDate: moment().format('MMMM Do YYYY'),
      todayTime: moment().format('h:mm:ss a'),
      // timeZone: this.setTimeZone(),
    }
  },
  computed: {
    ...mapState({
      // map this.categories to store.state.categories, it uses dispatch
      // locationIds: state => state.location.locationIds,
      locationName: state => state.location.locationName,
    }),
  },
  mounted: function() {
    /*moment.tz.setDefault(this.$store.state.location.setTimeZone)
    this.time()*/
  },

  methods: {
    getLocationDateTime(date) {
      return moment(date)
    },
    time() {
      //
      let self = this
      this.todayTime = moment().format('h:mm:ss a')

      setInterval(self.time, 1000)
    },
    ...mapActions('location', ['setTimeZone']),
  },
}
</script>
