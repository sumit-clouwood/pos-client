<template>
  <ul class="breadcrumb-news">
    <li class="breadcrumb-item-news">
      <a href="#">
        <img src="img/pos/news.png" /><span> {{ _t('News') }}</span>
      </a>
    </li>
    <li class="item-news" v-if="announcements">
      <marquee behavior="scroll" direction="left">
        <b>{{ announcements }}</b>
      </marquee>
    </li>
  </ul>
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
