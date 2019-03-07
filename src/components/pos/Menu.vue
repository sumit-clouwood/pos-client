<template>
  <div>
    <ul class="navbar-nav navbar-sidenav" id="exampleAccordion">
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
        :title="t(item.cat_name).name"
        :data-original-title="t(item.cat_name).name"
      >
        <a
          class="nav-link"
          :class="{ active: currentCategory === item._id }"
          href=""
          @click.prevent="browse(item)"
        >
          <img :src="categoryImage(item.category_image)" />
          <span class="nav-link-text">{{ t(item.cat_name).name }}</span>
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
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  name: 'Menu',
  props: {},
  computed: {
    ...mapState({
      // map this.categories to store.state.categories, it uses dispatch
      menu: state => state.category.all,
      currentCategory: state => state.category.category._id,
    }),
    ...mapState({
      profileImage: state =>
        state.auth.userDetails &&
        state.auth.userDetails.image
          ? process.env.VUE_APP_API_ENDPOINT +
            '/profile_pic/' +
            state.auth.userDetails.image
          : 'img/pos/profile-pic.png',
    }),
    ...mapGetters('category', ['categoryImage']),
  },
  // map `this.browse()` to `this.$store.category.dispatch('browse')`
  methods: {
    ...mapActions('category', ['browse']),
  },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<!--<style lang="scss" scoped>
    @import '../../assets/sass/variables.scss';
    @import '../../assets/sass/mixins.scss';
    @import '../../assets/sass/navbar.scss';
</style>-->

<style lang="scss" scoped>
.nav-link {
  img {
    /*height: 22px;*/
    /*width: 25px;*/
  }
}
</style>
