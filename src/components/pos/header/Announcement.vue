<template>
  <div class="main-news">
    <div class="main-news-title">
      <a class="main-news-title-link" href="#">
        <img src="/img/pos/news.png" :alt="_t('News')" />
        <span>
          {{ _t('News') }}
        </span>
      </a>
    </div>
    <div class="main-news-run-text" v-if="announcements">
      <marquee behavior="scroll" direction="left">
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
