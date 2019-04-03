<template>
  <ul class="breadcrumb-news">
    <li class="breadcrumb-item-news">
      <a href="#"> <img src="img/pos/news.png" /><span>News</span></a>
    </li>
    <li class="item-news"  v-if="announcements">
      <marquee behavior="scroll" direction="left">
        {{ announcements }}
      </marquee>
    </li>
  </ul>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Announcement',
  props: {},
  data() {
    return {
      showAnnouncements: '',
    }
  },
  computed: {
    ...mapState({
      announcements: state => state.announcement.announcements,
    }),
  },
}
</script>
