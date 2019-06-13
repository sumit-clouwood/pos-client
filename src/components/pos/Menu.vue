<template>
  <div class="navigation">
    <div class="logo" title="logo">
      <a class="logo-link" href="javascript:void(0)">
        <img src="img/icons/icon.png" alt="icon" />
      </a>
    </div>
    <div class="navigation-list-wrapper">
      <ul class="navigation-list" v-if="categories.length">
        <li
          class="nav-item active-opacity"
          v-for="item in categories"
          :key="item._id"
          :title="dt(item)"
          :data-original-title="dt(item)"
        >
          <a
            class="nav-link-nav"
            :class="{ active: currentCategory === item._id }"
            @click.prevent="browse(item)"
          >
            <img :src="item.category_image" :alt="dt(item)" />
            <span class="nav-link-text">{{ dt(item) }}</span>
          </a>
        </li>
      </ul>
    </div>
    <div class="slider-btn">
      <i class="fa fa-chevron-down" aria-hidden="true"></i>
    </div>
    <div class="navigation-avatar">
      <a class="nav-link" href="">
        <img :src="profileImage" alt="profile" />
        <div class="nav-link-user-name">Admin</div>
      </a>
    </div>
    <div v-if="getImages">
      <link
        v-for="(url, key) in getImages"
        rel="prefetch"
        :href="url"
        :key="key"
      />
    </div>
    <!--<div v-if="modifierImages">
      <link
              v-for="(url, key) in modifierImages"
              rel="prefetch"
              :href="url"
              :key="key"
      />
    </div>-->
  </div>
</template>

<script>
/* global  $*/
import bootstrap from '@/bootstrap'

import { mapState, mapGetters } from 'vuex'
export default {
  name: 'Menu',
  computed: {
    ...mapState({
      currentCategory: state => state.category.category._id,
    }),
    ...mapState({
      profileImage: state =>
        state.auth.userDetails && state.auth.userDetails.image
          ? process.env.VUE_APP_API_ENDPOINT +
            '/profile_pic/' +
            state.auth.userDetails.image
          : '/pos/img/pos/profile-pic.png',
    }),
    ...mapGetters('category', ['categories', 'getImages']),
    // ...mapGetters('modifier', {
    //   modifierImages: 'getImages',
    // }), //to preftech modifier images, todo
  },
  methods: {
    browse(item) {
      this.$store.commit('sync/reload', true)
      bootstrap.loadUI().then(() => {})
      this.$store.dispatch('category/browse', item)
    },
  },
  updated() {
    $('li.nav-item.arrow-bottom > a > .bt-arrow').click(function(e) {
      e.preventDefault()
      let menuHeight = 0
      $('#menuAccordion li').each(function() {
        menuHeight = menuHeight + $(this).innerHeight()
      })
      let accordionHeight = $('#menuAccordion').innerHeight()
      if (menuHeight > accordionHeight) {
        $('#menuAccordion')
          .stop()
          .animate({ top: accordionHeight - (menuHeight + 60) + 'px' }, 800)
      } else {
        $('.top-arrow').css('display', 'none')
      }
      $('.bt-arrow').css('display', 'none')
      $('.top-arrow').css('display', 'block')
      return false
    }),
      $('li.nav-item.arrow-bottom > a > .top-arrow').click(function(e) {
        e.preventDefault()
        $('#menuAccordion')
          .stop()
          .animate({ top: 0 + 'px' }, 800)
        $('.bt-arrow').css('display', 'block')
        $('.top-arrow').css('display', 'none')
        return false
      })
  },
}
</script>
<style lang="sass" scoped>
.category
  a
    cursor: pointer
  img
    height: 25px;
    margin-top: 8px;
</style>
