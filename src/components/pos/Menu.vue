<template>
  <div>
    <ul
      class="navbar-nav navbar-sidenav"
      id="exampleAccordion"
      v-if="menu.length"
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
        v-for="item in menu"
        :key="item._id"
        class="nav-item active-opacity"
        data-toggle="tooltip"
        data-placement="right"
        :title="item.name"
        :data-original-title="item.name"
        @click="addImgDesign"
      >
        <a
          class="nav-link"
          :class="{ active: currentCategory === item._id }"
          href=""
          @click.prevent="browse(item)"
        >
          <img :src="categoryImage(item.category_image)" />
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
    <div v-if="modifierImages">
      <link
        v-for="(url, key) in modifierImages"
        rel="prefetch"
        :href="url"
        :key="key"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
/* global io $  */

export default {
  name: 'Menu',
  props: {},
  computed: {
    ...mapState({
      // map this.categories to store.state.categories, it uses dispatch
      //menu: state => state.category.all,
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
    ...mapGetters('category', ['categoryImage', 'menu', 'getImages']),
    ...mapGetters('modifier', {
      modifierImages: 'getImages',
    }),
  },
  // map `this.browse()` to `this.$store.category.dispatch('browse')`
  methods: {
    ...mapActions('category', ['browse']),
    addImgDesign() {
      $( '.vegetable:has(img)' ).addClass( 'pos-item-bg' )
      $( '.pizza-size-wrapper > div:has(img)' ).addClass( 'pos-size-bg' )
    }
  },
}
</script>
