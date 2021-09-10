<template>
  <div class="main-news color-main">
    <div class="main-news-title color-secondary ">
      <a class="main-news-title-link color-text-invert" role="button">
        <div class="fa fa-newspaper"></div>
        <span class="color-text-invert">
          {{ _t('News') }}
        </span>
      </a>
    </div>
    <!--<div class="main-waiting_time color-secondary ">
      <a class="main-news-title-link color-text-invert" role="button">
        <div class="fa fa-newspaper"></div>
        <span class="color-text-invert" v-if="store.waiting_time !== '00:00'">
          {{ _t('Store waiting time is ') }} {{ store.waiting_time }}
        </span>
      </a>
    </div>-->
    <div class="main-news-run-text color-text-invert">
      <marquee
        v-if="announcements || (store && store.waiting_time !== '00:00')"
        behavior="scroll"
        direction="left"
        onmouseover="this.stop();"
        onmouseout="this.start();"
      >
        <b v-if="announcements">{{ announcements }} | </b>
        <b v-if="store && store.waiting_time && splitTime(store.waiting_time)"
          >{{ _t(' Store waiting time is ') }}
          {{ splitTime(store.waiting_time) }}</b
        >
      </marquee>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'Announcement',
  props: {},
  data() {
    return {
      showAnnouncements: '',
    }
  },
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState('location', ['store']),
    ...mapState({
      announcements: state => state.announcement.announcements,
    }),
  },
  methods: {
    splitTime(time) {
      if (time) {
        let time_split = time.split(':')
        let hh =
          parseInt(time_split[0]) !== 0 &&
          time_split[0] !== undefined &&
          time_split[0] !== ''
            ? time_split[0] + ' Hour(s)'
            : ''
        let mm =
          parseInt(time_split[1]) !== 0 &&
          time_split[1] !== undefined &&
          time_split[1] !== ''
            ? ' ' + time_split[1] + ' Minutes'
            : ''
        return hh + mm
      } else return false
    },
  },
}
</script>
