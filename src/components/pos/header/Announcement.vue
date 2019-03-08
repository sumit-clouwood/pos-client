<template>
  <ul class="breadcrumb-news" v-if="announcements">
    <li class="breadcrumb-item-news">
      <a href="#"> <img src="img/pos/news.png" /><span>News</span></a>
    </li>
    <li
      class="item-news"
      v-for="(announcement, index) in announcements"
      :key="index"
    >
      <marquee behavior="scroll" direction="left" :key="index">
        {{ announcement.announcement }}
      </marquee>
    </li>
  </ul>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Announcement',
  props: {},
  computed: {
    ...mapState({
      announcements: state =>
        typeof state.announcement.announcements != 'undefined'
          ? state.announcement.announcements
          : false,
    }),
  },
}
</script>
