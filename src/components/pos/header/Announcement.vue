<template>
  <div class="main-news color-main">
    <div class="main-news-title color-secondary ">
      <a
        class="main-news-title-link color-text-invert cursor-pointer"
        role="button"
      >
        <div class="fa fa-newspaper"></div>
        <span class="color-text-invert">
          {{ _t('News') }}
        </span>
      </a>
    </div>
    <div class="main-news-run-text color-text-invert" v-if="announcements">
      <marquee
        behavior="scroll"
        direction="left"
        onmouseover="this.stop();"
        onmouseout="this.start();"
      >
        {{ announcements }}
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
    ...mapState({
      announcements: state => state.announcement.announcements,
    }),
  },
}
</script>
