<template>
  <div>
    <ul
      class="navbar-nav navbar-sidenav"
      id="menuAccordion"
      v-if="categories.length"
    >
      <li
        class="nav-item logo-wrap"
        data-toggle="tooltip"
        data-placement="right"
        title=""
        data-original-title="logo"
      >
        <a class="nav-link" href="">
          <img src="img/icons/icon.png" />
        </a>
      </li>
      <li
        v-for="item in categories"
        :key="item._id"
        class="nav-item active-opacity category"
        data-toggle="tooltip"
        data-placement="right"
        :title="item.name"
        :data-original-title="item.name"
      >
        <a
          class="nav-link"
          :class="{ active: currentCategory === item._id }"
          href=""
          @click.prevent="browse(item)"
        >
          <img :src="item.category_image" />
          <span class="nav-link-text">{{ item.name }}</span>
        </a>
      </li>
    </ul>

    <ul class="navbar-nav sidenav-toggler">
      <li class="nav-item arrow-bottom">
        <a class="nav-link" href="#">
          <img class="bt-arrow" src="img/pos/down-arrow.png" />
          <img class="top-arrow" src="img/pos/top-arrow.png" />
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link text-center" id="sidenavToggler">
          <img :src="profileImage" />
        </a>
      </li>
    </ul>
    <div v-if="getImages">
      <link
        v-for="(url, key) in getImages"
        rel="prefetch"
        :href="url"
        :key="key"
      />
    </div>
    <!-- <div v-if="modifierImages">
      <link
        v-for="(url, key) in modifierImages"
        rel="prefetch"
        :href="url"
        :key="key"
      />
    </div> -->
  </div>
</template>

<script>
/* global  $*/
import { mapState, mapActions, mapGetters } from 'vuex'
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
          : 'img/pos/profile-pic.png',
    }),
    ...mapGetters('category', ['categories', 'getImages']),
    // ...mapGetters('modifier', {
    //   modifierImages: 'getImages',
    // }), //to preftech modifier images, todo
  },
  methods: {
    ...mapActions('category', ['browse']),
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
    width: 25px
</style>
